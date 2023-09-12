<script setup>
import { reactive } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import FilePond from '@/components/FilePond/FilePond.vue'

import AssessmentServices from '@/services/lib/assessment'

import { useToast } from '@/stores/toast'
import { useLoading } from 'vue-loading-overlay'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'refresh'])

const assessmentStore = useAssessmentStore()
const toast = useToast()
const loading = useLoading()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loadingSubmit: false,
  files: [],
})

/* --------------------------------- METHODS -------------------------------- */
const onUpdateFiles = (files) => {
  if (files && files?.length) {
    const listFile = []
    files.map((item) => listFile.push(item.file))
    formState.files = listFile
  } else {
    formState.files = []
  }
}

const handleClose = () => {
  emits('close', true)
}

const handleSubmit = async () => {
  const loader = loading.show()
  formState.loadingSubmit = true

  try {
    const formData = new FormData()

    formData.append('id', assessmentStore?.selectedAssessment?.id)

    if (Array.isArray(formState.files) && formState.files.length) {
      formData.append('docs', formState.files[0])
    }

    const response = await AssessmentServices.uploadLaporan(formData)

    if (response) {
      loader.hide()
      formState.loadingSubmit = false
      toast.success({
        title: 'Upload Laporan Asesmen',
        text: 'Berhasil Mengupload Laporan Asesmen'
      })
      emits('refresh')
      handleClose()
    }
  } catch (error) {
    loader.hide()
    formState.loadingSubmit = false
    toast.error({ error })
  }
}

</script>

<template>
  <BaseModal id="upload_media_file" :order="3" :open="props.isShow" :showBtnCloseFooter="false" classNameModal="modal-lg"
    @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Upload Laporan
      </h4>
    </template>

    <template #body>
      <div class="mb-3">
        <FilePond id="upload-laporan-file-pond" label="File Laporan" name="laporan-file-pond"
          accepted=".doc, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword, application/pdf"
          :files="formState.files" v-on:updatefiles="onUpdateFiles" :allowFileSizeValidation="true" maxFileSize="5Mb"
          :fileValidateTypeLabelExpectedTypes="'File harus berupa Word atau PDF'">
        </FilePond>

        <div class="mt-1">
          <small>
            <span class="text-danger fw-bold">Perhatian!</span> File yang diupload hanya diperbolehkan file word atau
            pdf
          </small>
        </div>
      </div>
    </template>

    <template #footer>
      <BaseButton @click="handleSubmit" title="Upload Laporan"
        :disabled="!formState.files.length || formState.loadingSubmit" :isLoading="formState.loadingSubmit">
        <template #icon-left>
          <TablerIcon icon="UploadIcon" />
        </template>
      </BaseButton>
    </template>
  </BaseModal>
</template>