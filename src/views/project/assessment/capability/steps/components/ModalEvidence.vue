<script setup>
import { reactive, computed, watch, ref } from 'vue'
import debounce from 'lodash.debounce'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import BaseSelect from '@/components/Select/BaseSelect.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import CKEditor from '@/components/CKEditor/CKEditor.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import NoOptions from '@/components/EmptyPlaceholder/NoOptions.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'
import FilePond from '@/components/FilePond/FilePond.vue'
import MediaFileItem from '@/views/project/assessment/capability/repository/components/MediaFileItem.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'

import evidentTypeJSON from '@/data/evidentType.json'
import RepositoryServices from '@/services/lib/repository'

import { useRoute } from 'vue-router'
import { useVuelidate } from "@vuelidate/core";
import { helpers, requiredIf, url } from "@vuelidate/validators";
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useAlert } from '@/stores/alert'
import { useLoading } from 'vue-loading-overlay'
import { useToast } from '@/stores/toast'
import { useAppConfig } from '@/stores/appConfig'

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
const file_pond_upload = ref([])

const formState = reactive({
  evident: [],
  listFileMediaRepository: {
    loading: false,
    data: [],
  }
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
const handleSearchFileMediaRepository = debounce(async ({ search, index }) => {
  try {
    formState.evident[index].search = search
    formState.listFileMediaRepository.data[index].loading = true
    const response = await RepositoryServices.getListMediaRepository({ search, assesment_id: route.params?.id, limit: 9 })

    if (response) {
      const data = response?.data
      formState.listFileMediaRepository.data[index].loading = false
      formState.listFileMediaRepository.data[index].data = data?.list || []
    }
  } catch (error) {
    formState.listFileMediaRepository.data[index].loading = false
    toast.error({ error })
  }
}, 500)

const handleClose = () => {
  formState.evident = [];
  v$.value.$reset()
  emits('close', true)
}

const handleSelectTipe = ({ tipe, index }) => {
  formState.evident[index].tipe = tipe;
  formState.evident[index].url = null
  formState.evident[index].media_repositories_id = null
  formState.evident[index].deskripsi = ''
  formState.evident[index].search = ''
  formState.evident[index].files = []
  formState.evident[index].file = null
  formState.evident[index].docs = null
}

const filterEvident = (index) => {
  const filtered = formState.evident.filter((_, itemIndex) => itemIndex !== index)
  const filteredlistFileMediaRepository = formState.listFileMediaRepository.data.filter((_, itemIndex) => itemIndex !== index)

  formState.evident = filtered
  formState.listFileMediaRepository.data = filteredlistFileMediaRepository
}

const handleTambahEvident = () => {
  formState.evident.push({
    tipe: '',
    url: null,
    media_repositories_id: null,
    deskripsi: '',
    search: '',
    files: [],
    file: null,
    docs: null
  })

  formState.listFileMediaRepository.data.push({
    loading: false,
    data: assessmentStore.capability.listMediaFile || []
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

        if (data?.id) {
          patched[index].media_repositories_id = data?.id;
          patched[index].files = [file?.file];
          patched[index].docs = { docs: data?.docs }
          formState.evident = patched
        } else {
          if (file_pond_upload.value[index]) {
            file_pond_upload.value[index].filePondRef.removeFile(file?.id || index)
            toast.error({
              text: 'Gagal Upload File'
            })
          }

        }

        loader.hide()
      }
    } catch (error) {
      loader.hide()
      toast.error({ error })
    }
  } else if (file && file?.file && file?.status !== 2) {
    if (file_pond_upload.value[index].filePondRef) {
      file_pond_upload.value[index].filePondRef.removeFile(file?.id || index)
      toast.error({
        text: 'File Diperkenankan / Gagal Upload File',

      })
    }

  }
}

const handleClickFileMedia = ({ item, index }) => {
  if (formState.evident[index].media_repositories_id !== item?.id) {
    formState.evident[index].media_repositories_id = item?.id;
    formState.evident[index].files = [item?.docs];
    formState.evident[index].docs = item;
  } else {
    handleDoubleClickFileMedia({ index })
  }

}

const handleDoubleClickFileMedia = ({ index }) => {
  formState.evident[index].media_repositories_id = null
  formState.evident[index].files = []
}

const handleDeleteFile = async ({ media_repositories_id, index }) => {
  if (media_repositories_id) {
    formState.evident[index].media_repositories_id = null
    formState.evident[index].files = []
    formState.evident[index].docs = null

    /* Delete with Repisitory File
    const loader = loading.show()
    try {
      const response = await RepositoryServices.deleteMediaRepository({ id: media_repositories_id })

      if (response) {
        formState.evident[index].media_repositories_id = null
        formState.evident[index].files = []
        formState.evident[index].docs = null
        loader.hide()
      }
    } catch (error) {
      loader.hide()
      toast.error({ error })
    }
    */
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
          search: '',
          files: [],
          file: null,
          docs: null
        })
      } else if (ev?.docs) {
        let files = []
        if (ev?.docs?.docs) {
          const path = `${appConfig.app.appHostMedia}${ev?.docs?.docs?.path}`
          const file = new File([{ ...ev?.docs?.docs, path }], ev?.docs?.docs?.originalname, { type: ev?.docs?.docs?.type })
          files[0] = file
        }

        formState.evident.push({
          tipe: 'file-repository',
          url: null,
          media_repositories_id: ev?.media_repositories_id,
          files: files,
          deskripsi: ev?.deskripsi || '',
          search: '',
          file: null,
          docs: null
        })
      } else if (ev?.files) {
        formState.evident.push({
          tipe: 'file-repository',
          url: null,
          media_repositories_id: ev?.media_repositories_id,
          files: ev?.files,
          deskripsi: ev?.deskripsi,
          search: '',
          file: null,
          docs: null
        })
      }

      formState.listFileMediaRepository.data.push({
        loading: false,
        data: assessmentStore.capability.listMediaFile || []
      })
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
                title="Hapus Evidence">
                <template #icon-left>
                  <TablerIcon icon="TrashIcon" />
                </template>
              </BaseButton>
            </div>
          </div>

          <div class="mb-3">
            <BaseSelect :id="`evident_type_${index}`" label="Jenis" default-option="Pilih Jenis"
              :options="evidentTypeJSON" v-model:model-value="evident.tipe"
              @change="$event => handleSelectTipe({ tipe: $event?.target?.value, index: index })"
              :is-invalid="!!v$.evident.$each?.$response?.$errors[index]?.tipe?.length">
              <template #options>
                <option v-for="(item, indexEvidentType) in evidentTypeJSON"
                  :key="`base-select-${indexEvidentType}-${item.value}`" :value="item.value">
                  {{ item?.label }}
                </option>
              </template>
            </BaseSelect>

            <ErrorMessage
              v-if="Array.isArray(v$.evident.$each?.$response?.$errors) && v$.evident.$each?.$response?.$errors.length"
              :errors="v$.evident.$each?.$response?.$errors[index]?.tipe" />
          </div>

          <!-- URL -->
          <div v-if="evident.tipe === 'url'" class="mb-3">
            <BaseInput :id="`evident_url_${index}`" v-model.trim="evident.url" label="URL" placeholder="Masukkan URL"
              :is-invalid="!!v$.evident.$each?.$response?.$errors[index].url?.length" />

            <ErrorMessage
              v-if="Array.isArray(v$.evident.$each?.$response?.$errors) && v$.evident.$each?.$response?.$errors.length"
              :errors="v$.evident.$each?.$response?.$errors[index].url" />
          </div>

          <!-- File -->
          <div v-else-if="evident.tipe === 'file-upload'" class="mb-3">
            <FilePond ref="file_pond_upload" id="direct-upload-file-pond" label="File" name="direct-upload-file-pond"
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

          <!-- File Repository -->
          <div v-else-if="evident.tipe === 'file-repository'" class="mb-3">
            <div class="row border py-4">
              <div class="mb-3">
                <BaseInput :id="`search-input-file-${index}`" label="Cari File"
                  @input="$event => handleSearchFileMediaRepository({ search: $event?.target?.value, index: index })"
                  v-model:model-value="evident.search" placeholder="Ketik Pencarian..." />
              </div>

              <LoadingOverlay :active="formState.listFileMediaRepository?.data[index]?.loading" />

              <template v-if="!formState.listFileMediaRepository?.data[index]?.loading">
                <template
                  v-if="Array.isArray(formState.listFileMediaRepository?.data[index]?.data) && formState.listFileMediaRepository?.data[index]?.data?.length">
                  <MediaFileItem v-for="mediaFile in formState.listFileMediaRepository.data[index].data"
                    :key="`media-file-repo-${mediaFile?.id}`" classBody="col-12 col-md-4"
                    :is-show-checklist="mediaFile?.id === evident?.media_repositories_id"
                    :class="{ 'border-primary': mediaFile?.id === evident?.media_repositories_id }"
                    :is-show-dropdown="false" :id="`media-file-repo-${mediaFile?.id}`" :ext="mediaFile?.docs?.ext"
                    :name="mediaFile?.deskripsi || mediaFile?.docs?.originalname" :lastUpdate="mediaFile?.created_at"
                    :size="mediaFile?.docs?.size" @click="handleClickFileMedia({ item: mediaFile, index: index })"
                    @double-click="handleDoubleClickFileMedia({ index: index })" />
                </template>

                <template
                  v-else-if="evident.search && Array.isArray(formState.listFileMediaRepository?.data[index]?.data) && !formState.listFileMediaRepository?.data[index]?.data?.length">
                  <NoData title="File Repository Tidak Ditemukan" />
                </template>
              </template>


            </div>
          </div>

          <div v-if="evident.tipe" class="mb-3">
            <label class="form-label" :for="`evident_deskripsi_${index}`">Deskripsi Evidence</label>
            <CKEditor :id="`evident_deskripsi_${index}`" v-model="evident.deskripsi"
              placeholder="Masukkan Deskripsi Evidence" />
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