<script setup>
import { reactive, computed, watch, ref } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import FilePond from '@/components/FilePond/FilePond.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'

import AssessmentServices from '@/services/lib/assessment'

import { useVuelidate } from "@vuelidate/core";
import { helpers, required, requiredIf } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

const intVersionRegex = /^\d+$/

const majorMinorVersionRegex = /^\d+\.\d+$/

const semanticVersionRegex = /^(\d+)\.(\d+)\.(\d+)$/

const complexVersioningRegex = /^(\d+)\.(\d+)\.(\d+)(-[\da-zA-Z-]+(\.\d+)*)?$/

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
  isOnEdit: {
    type: Boolean,
    default: false
  },
  selectedData: {
    type: Object,
    default: null
  }
})

const emits = defineEmits(['close', 'refresh'])

const toast = useToast()
const route = useRoute()
const loading = useLoading()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const filePondRef = ref(null)

const formState = reactive({
  loadingSubmit: false,
  files: [],
  filename: '',
  version: '',
  isNewFiles: false
})

const assessmentId = computed(() => route.params?.id)

const rules = computed(() => {
  return {
    files: {
      required: helpers.withMessage("Silahkan upload laporan", requiredIf(!props.isOnEdit))
    },
    filename: {
      required: helpers.withMessage("Silahkan nama file", required)
    },
    version: {
      required: helpers.withMessage('Silahkan isi versi laporan', required),
      isComplexVersioning: helpers.withMessage('Kode Version tidak valid (Contoh: 1 / 1.0 / 1.0.1 / 1.0.1-alpha)', value => intVersionRegex.test(value) || complexVersioningRegex.test(value) || semanticVersionRegex.test(value) || majorMinorVersionRegex.test(value)),
    }
  }
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true, $scope: false })

/* --------------------------------- METHODS -------------------------------- */
const onUpdateFiles = (files) => {
  if (files && files?.length) {
    const listFile = []
    files.map((item) => listFile.push(item.file))
    formState.files = listFile
    formState.isNewFiles = true
  } else {
    formState.files = []
    formState.isNewFiles = true
  }
}

const resetForm = () => {
  formState.filename = ''
  formState.version = ''
  formState.files = []
  formState.isNewFiles = false
}

const handleClose = () => {
  resetForm()
  v$.value.$reset()
  emits('close', true)
}

const handleSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const loader = loading.show()
    formState.loadingSubmit = true

    try {
      const formData = new FormData()

      formData.append('id', assessmentId.value)
      formData.append('filename', formState.filename)
      formData.append('version', formState.version)

      if (Array.isArray(formState.files) && formState.files.length && props.isOnEdit && formState.files[0]?.initialFile) {
        formData.append('docs_id', props.selectedData?.id)
      } else if (Array.isArray(formState.files) && formState.files.length && formState.isNewFiles) {
        formData.append('docs', formState.files[0])
      }

      if (props.isOnEdit) {
        formData.append('parent_id', props.selectedData?.parent_id || props.selectedData?.id)
      }

      const response = await AssessmentServices.uploadLaporan(formData)

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: `${props.isOnEdit ? 'Edit' : 'Upload'} Laporan`,
          text: `Berhasil ${props.isOnEdit ? 'Mengubah' : 'Mengupload'} Laporan`
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

}

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => props.isShow, () => {
  if (props.isShow && props.isOnEdit && props.selectedData) {
    formState.filename = props.selectedData?.name
    formState.version = props.selectedData?.version
    const exisitingFile = new File([props.selectedData?.file], props.selectedData?.name, { type: props.selectedData?.file?.type });
    exisitingFile.initialFile = true;
    formState.files = [exisitingFile]
  }
}, { deep: true })

</script>

<template>
  <BaseModal id="upload_media_file" :order="3" :open="props.isShow" :showBtnCloseFooter="false"
    classNameModal="modal-lg" @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        {{ props.isOnEdit ? 'Edit' : 'Upload' }} Laporan
      </h4>
    </template>

    <template #body>
      <div class="mb-3">
        <FilePond ref="filePondRef" id="upload-laporan-file-pond" label="File Laporan" name="laporan-file-pond"
          accepted=".doc, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword, application/pdf"
          :files="formState.files" v-on:updatefiles="onUpdateFiles" :allowFileSizeValidation="true" maxFileSize="250Mb"
          :fileValidateTypeLabelExpectedTypes="'File harus berupa Word atau PDF'">
        </FilePond>

        <div class="mt-1">
          <small>
            <span class="text-danger fw-bold">Perhatian!</span> File yang diupload hanya diperbolehkan file word atau
            pdf
          </small>
        </div>

        <ErrorMessage :errors="v$.files.$errors" />
      </div>

      <div class="mb-3">
        <BaseInput id="filename-laporan" label="Nama File" v-model="v$.filename.$model" placeholder="Masukkan Nama File"
          :isInvalid="!!v$.filename.$errors?.length" :tabindex="2" :disabled="formState.isLoading" />
        <ErrorMessage :errors="v$.filename.$errors" />
      </div>

      <div class="mb-3">
        <BaseInput id="version-laporan" label="Versi File" v-model="v$.version.$model" placeholder="Masukkan Versi File"
          :isInvalid="!!v$.version.$errors?.length" :tabindex="3" :disabled="formState.isLoading">
          <template #extra-label>
            <div v-tooltip="`Kode Version yang diperkenankan seperti: 1, 1.0, 1.0.1, 1.0.1-aplha, dsb`"
              class="d-flex align-items-center cursor-pointer">
              <TablerIcon icon="InfoSquareRoundedIcon" size="18" class="text-primary me-1 mb-1" />
              <span class="fw-bold mb-0 text-primary">Info Kode Version</span>
            </div>
          </template>
        </BaseInput>
        <ErrorMessage :only-show-one="true" :errors="v$.version.$errors" />
      </div>
    </template>

    <template #footer>
      <BaseButton @click="handleSubmit" :title="`${props.isOnEdit ? 'Simpan Perubahan' : 'Upload'} Laporan`"
        :disabled="formState.loadingSubmit" :isLoading="formState.loadingSubmit">
        <template #icon-left>
          <TablerIcon :icon="props.isOnEdit ? 'DeviceFloppyIcon' : 'UploadIcon'" />
        </template>
      </BaseButton>
    </template>
  </BaseModal>
</template>