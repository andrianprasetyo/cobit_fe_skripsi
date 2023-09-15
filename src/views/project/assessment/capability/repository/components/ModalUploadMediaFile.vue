<script setup>
import { reactive, computed } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import FilePond from '@/components/FilePond/FilePond.vue'

import RepositoryServices from '@/services/lib/repository'

import { useRoute } from 'vue-router'
import { useToast } from '@/stores/toast'
import { useLoading } from 'vue-loading-overlay'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'refresh'])

const route = useRoute()
const toast = useToast()
const loading = useLoading()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loadingSubmit: false,
  files: [],
  deskripsi: '',
  isNewFiles: false,
})

const assessmentId = computed(() => {
  return route.params?.id
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

    formData.append('assesment_id', assessmentId.value)

    if (Array.isArray(formState.files) && formState.files.length) {
      formData.append('docs', formState.files[0])
    }

    if (formState.deskripsi) {
      formData.append('deskripsi', formState.deskripsi)
    }

    const response = await RepositoryServices.createMediaRepository(formData)

    if (response) {
      loader.hide()
      formState.loadingSubmit = false
      toast.success({
        title: 'Upload Media File',
        text: 'Berhasil Mengupload Media File'
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
  <BaseModal id="upload_media_file" :order="2" :open="props.isShow" :showBtnCloseFooter="false" classNameModal="modal-lg"
    @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Upload Media File
      </h4>
    </template>

    <template #body>
      <div class="mb-3">
        <FilePond id="upload-media-file-pond" label="File" name="media-file-pond"
          accepted=".xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/pdf"
          :files="formState.files" v-on:updatefiles="onUpdateFiles" :allowFileSizeValidation="true" maxFileSize="5Mb"
          :fileValidateTypeLabelExpectedTypes="'File harus berupa Excel atau PDF'">
        </FilePond>

        <div class="mt-1">
          <small>
            <span class="text-danger fw-bold">Perhatian!</span> File yang diupload hanya diperbolehkan file excel atau
            pdf
          </small>
        </div>
      </div>

      <div class="mb-3">
        <BaseInput id="deskripsi_file" type="text-area" label="Deskripsi File" v-model="formState.deskripsi"
          placeholder="Masukkan Deskripsi File" />
      </div>
    </template>

    <template #footer>
      <BaseButton @click="handleSubmit" title="Upload" :disabled="!formState.files.length || formState.loadingSubmit"
        :isLoading="formState.loadingSubmit">
        <template #icon-left>
          <TablerIcon icon="UploadIcon" />
        </template>
      </BaseButton>
    </template>
  </BaseModal>
</template>