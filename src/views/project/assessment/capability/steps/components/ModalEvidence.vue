<script setup>
import { reactive, computed, watch } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import BaseSelect from '@/components/Select/BaseSelect.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import CKEditor from '@/components/CKEditor/CKEditor.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import NoOptions from '@/components/EmptyPlaceholder/NoOptions.vue'
import FilePond from '@/components/FilePond/FilePond.vue'

import evidentTypeJSON from '@/data/evidentType.json'

import { useRoute } from 'vue-router'
import { useVuelidate } from "@vuelidate/core";
import { helpers, requiredIf, url } from "@vuelidate/validators";
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useAlert } from '@/stores/alert'
import { useLoading } from 'vue-loading-overlay'
import { useToast } from '@/stores/toast'
import { useAppConfig } from '@/stores/appConfig'

import RepositoryServices from '@/services/lib/repository'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'refresh'])

const assessmentStore = useAssessmentStore()
const alert = useAlert()
const loading = useLoading()
const route = useRoute()
const toast = useToast()
const appConfig = useAppConfig()

/* ---------------------------------- STATE --------------------------------- */
const formState = reactive({
  evident: []
})

/* -------------------------------- COMPUTED -------------------------------- */
const rules = computed(() => {
  return {
    evident: {
      $each: helpers.forEach({
        tipe: {
          required: helpers.withMessage('Silahkan isi jenis evident', requiredIf(props.isShow)),
        },
        url: {
          url: helpers.withMessage("Tautan atau URL tidak valid", url)
        },
        /*
        deskripsi: {
          required: helpers.withMessage('Silahkan isi deskripsi', requiredIf(props.isShow)),
        }
        */
      })
    },
  }
})

const assessmentId = computed(() => {
  return route.params?.id
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true, $stopPropagation: true })

/* --------------------------------- METHODS -------------------------------- */
const handleClose = () => {
  formState.evident = [];
  v$.value.$reset()
  emits('close', true)
}

const filterEvident = (index) => {
  const filtered = formState.evident.filter((_, itemIndex) => itemIndex !== index)
  formState.evident = filtered
}

const handleTambahEvident = () => {
  formState.evident.push({
    tipe: '',
    url: null,
    media_repositories_id: null,
    deskripsi: '',
    files: [],
  })
}

const handleHapusEvident = ({ title, index }) => {
  alert.info({
    title: `Apakah Anda Yakin untuk Menghapus Evidence ${title}`
  }).then(async (result) => {
    if (result.isConfirmed) {
      filterEvident(index)
    }
  })
}

const handleUploadFile = async ({ file, index }) => {
  if (file && file?.file && file?.status === 2) {
    const loader = loading.show()
    try {
      const formData = new FormData()

      formData.append('docs', file?.file)

      formData.append('assesment_id', assessmentId.value)

      const response = await RepositoryServices.createMediaRepository(formData)

      if (response) {
        const data = response.data;

        const patched = formState.evident;

        patched[index].media_repositories_id = data?.id;
        patched[index].files = [file?.file]

        formState.evident = patched

        loader.hide()
      }
    } catch (error) {
      loader.hide()
      toast.error({ error })
    }
  }
}

const handleDeleteFile = async ({ media_repositories_id }) => {
  if (media_repositories_id) {
    const loader = loading.show()
    try {
      const response = await RepositoryServices.deleteMediaRepository({ id: media_repositories_id })

      if (response) {
        loader.hide()
      }
    } catch (error) {
      loader.hide()
      toast.error({ error })
    }
  }
}

const handleSubmit = async () => {
  const result = await v$.value.$validate()
  if (result) {
    const payload = {
      ...assessmentStore.capability.selectedSubGamo,
      capabilityass: {
        ...assessmentStore.capability.selectedSubGamo.capabilityass,
        evident: formState.evident,
        isEdited: true,
      },
    }
    assessmentStore.saveCapabilityPenilaianSubGamo(payload)
    handleClose()
  }
}

const setValueToForm = () => {
  if (Array.isArray(assessmentStore.capability.selectedSubGamo?.capabilityass?.evident) && assessmentStore.capability.selectedSubGamo?.capabilityass?.evident.length) {
    assessmentStore.capability.selectedSubGamo?.capabilityass?.evident.map((ev) => {
      if (ev?.url) {
        formState.evident.push({
          tipe: 'url',
          url: ev?.url,
          deskripsi: ev?.deskripsi || '',
          media_repositories_id: null,
        })
      } else if (ev?.docs) {
        let files = []
        if (ev?.docs?.docs) {
          const path = `${appConfig.app.appHostMedia}${ev?.docs?.docs?.path}`
          const file = new File([{ ...ev?.docs?.docs, path }], ev?.docs?.docs?.originalname, { type: ev?.docs?.docs?.type })
          files[0] = file
        }

        formState.evident.push({
          tipe: 'file',
          url: null,
          media_repositories_id: ev?.media_repositories_id,
          files: files,
          deskripsi: ev?.deskripsi || '',
        })
      } else if (ev?.files) {
        formState.evident.push({
          tipe: 'file',
          url: null,
          media_repositories_id: ev?.media_repositories_id,
          files: ev?.files,
          deskripsi: ev?.deskripsi
        })
      }
    })
  }
}

watch(() => [props.isShow], () => {
  if (props.isShow) {
    setValueToForm()
  }
}, { deep: true })

</script>

<template>
  <BaseModal id="evidence" :order="4" :open="props.isShow" :showBtnCloseFooter="false" classNameModal="modal-lg"
    @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Evidence
      </h4>
    </template>

    <template #body>
      <div class="mb-4 text-center">
        <h6>
          Management Practice Code
        </h6>
        <h4 class="fw-bolder">
          {{ assessmentStore.capability?.selectedSubGamo?.subkode }}
        </h4>
      </div>

      <template v-if="formState.evident.length">
        <template v-for="(evident, index) in formState.evident" :key="`evident-form-${index}`">

          <hr v-if="index > 0" />

          <div class="mb-9 d-flex flex-column flex-md-row justify-content-md-between align-items-md-center my-4">
            <h5 class="fw-semibold">Evidence {{ index + 1 }}</h5>

            <div>
              <BaseButton @click="handleHapusEvident({ title: index + 1, index: index })" class="btn btn-outline-danger"
                title="Hapus Evident">
                <template #icon-left>
                  <TablerIcon icon="TrashIcon" />
                </template>
              </BaseButton>
            </div>
          </div>
          <div class="mb-3">
            <BaseSelect :id="`evident_type_${index}`" v-model="evident.tipe" label="Jenis" default-option="Pilih Jenis"
              :options="evidentTypeJSON" options-label="label" options-value="value"
              :is-invalid="!!v$.evident.$each?.$response?.$errors[index]?.tipe?.length" />

            <ErrorMessage
              v-if="Array.isArray(v$.evident.$each?.$response?.$errors) && v$.evident.$each?.$response?.$errors.length"
              :errors="v$.evident.$each?.$response?.$errors[index]?.tipe" />
          </div>

          <!-- URL -->
          <div v-if="evident.tipe === 'url'" class="mb-3">
            <BaseInput :id="`evident_url_${index}`" v-model="evident.url" label="URL" placeholder="Masukkan URL"
              :is-invalid="!!v$.evident.$each?.$response?.$errors[index].url?.length" />

            <ErrorMessage
              v-if="Array.isArray(v$.evident.$each?.$response?.$errors) && v$.evident.$each?.$response?.$errors.length"
              :errors="v$.evident.$each?.$response?.$errors[index].url" />
          </div>

          <!-- File -->
          <div v-if="evident.tipe === 'file'" class="mb-3">
            <FilePond id="direct-upload-file-pond" label="File" name="direct-upload-file-pond"
              accepted=".xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/pdf"
              :files="formState.evident[index].files" :allowFileSizeValidation="true" maxFileSize="2Mb"
              :fileValidateTypeLabelExpectedTypes="'File harus berupa Excel atau PDF'" :instant-upload="true"
              v-on:initfile="$event => handleUploadFile({ file: $event, index })"
              v-on:removefile="handleDeleteFile({ media_repositories_id: evident?.media_repositories_id, index })" />

            <div class="mt-1">
              <small>
                <span class="text-danger fw-bold">Perhatian!</span> File yang diupload hanya diperbolehkan file excel atau
                pdf
              </small>
            </div>
          </div>

          <div v-if="evident.tipe === 'file'" class="mb-3">

          </div>

          <div v-if="evident.tipe" class="mb-3">
            <label class="form-label" :for="`evident_deskripsi_${index}`">Deskripsi</label>
            <CKEditor :id="`evident_deskripsi_${index}`" v-model="evident.deskripsi" placeholder="Masukkan Deskripsi" />
            <!-- <ErrorMessage
              v-if="Array.isArray(v$.evident.$each?.$response?.$errors) && v$.evident.$each?.$response?.$errors.length"
              :errors="v$.evident.$each?.$response?.$errors[index].deskripsi" /> -->
          </div>

        </template>


      </template>

      <template v-else>
        <NoOptions title="Belum Ada Evidence" />
      </template>

      <div class="mt-5 d-flex justify-content-center align-items-center">
        <BaseButton @click="handleTambahEvident" title="Tambah Evidence">
          <template #icon-left>
            <TablerIcon icon="PlusIcon" />
          </template>
        </BaseButton>
      </div>
    </template>

    <template #footer>
      <BaseButton @click="handleSubmit" title="Simpan Sebagai Draft Evidence" :disabled="!formState.evident.length">
        <template #icon-left>
          <TablerIcon icon="CheckboxIcon" />
        </template>
      </BaseButton>
    </template>
  </BaseModal>
</template>