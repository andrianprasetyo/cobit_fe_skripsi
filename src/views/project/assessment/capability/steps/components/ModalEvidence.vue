<script setup>
import { reactive, computed } from 'vue'

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
import { helpers, requiredIf } from "@vuelidate/validators";
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useAlert } from '@/stores/alert'
import { useLoading } from 'vue-loading-overlay'
import { useToast } from '@/stores/toast'

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

/* ---------------------------------- STATE --------------------------------- */
const formState = reactive({
  evident: []
})

/* -------------------------------- COMPUTED -------------------------------- */
const rules = computed(() => {
  return {
    evident: {
      $each: helpers.forEach({
        type: {
          required: helpers.withMessage('Silahkan isi jenis evident', requiredIf(props.isShow)),
        },
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
  emits('close', true)
}

const filterEvident = (index) => {
  const filtered = formState.evident.filter((_, itemIndex) => itemIndex !== index)
  formState.evident = filtered
}

const handleTambahEvident = () => {
  formState.evident.push({
    type: '',
    url: null,
    media_repositories_id: null,
    deskripsi: '',
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

  const loader = loading.show()

  if (file && file?.file) {
    try {
      const formData = new FormData()

      formData.append('docs', file?.file)

      formData.append('assesment_id', assessmentId.value)

      const response = await RepositoryServices.createMediaRepository(formData)

      if (response) {
        const data = response.data;

        const patched = formState.evident;

        patched[index].media_repositories_id = data?.id;

        formState.evident = patched

        loader.hide()
      }
    } catch (error) {
      loader.hide()
      toast.error({ error })
    }
  }
}

const handleSubmit = async () => {
  const payload = {
    ...assessmentStore.capability.selectedSubGamo,
    capabilityass: {
      ...assessmentStore.capability.selectedSubGamo.capabilityass,
      isEdited: true,
    },
    evident: formState.evident
  }
  assessmentStore.saveCapabilityPenilaianSubGamo(payload)
  handleClose()
}

/* ---------------------------------- HOOKS --------------------------------- */

</script>

<template>
  <BaseModal id="evident" :order="4" :open="props.isShow" :showBtnCloseFooter="false" classNameModal="modal-lg"
    @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Evident
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
          <div class="mb-9 d-flex flex-column flex-md-row justify-content-md-between align-items-md-center my-4">
            <h5 class="fw-semibold">Evident {{ index + 1 }}</h5>

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
            <BaseSelect :id="`evident_type_${index}`" v-model="evident.type" label="Jenis" default-option="Pilih Jenis"
              :options="evidentTypeJSON" options-label="label" options-value="value" />

            <ErrorMessage
              v-if="Array.isArray(v$.evident.$each?.$response?.$errors) && v$.evident.$each?.$response?.$errors.length"
              :errors="v$.evident.$each?.$response?.$errors[index].type" />
          </div>

          <!-- URL -->
          <div v-if="evident.type === 'url'" class="mb-3">
            <BaseInput :id="`evident_url_${index}`" v-model="evident.url" label="URL" placeholder="Masukkan URL" />
          </div>

          <!-- File -->
          <div v-if="evident.type === 'file'" class="mb-3">
            <FilePond id="direct-upload-file-pond" label="File" name="direct-upload-file-pond"
              accepted=".xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/pdf"
              :files="formState.files" :allowFileSizeValidation="true" maxFileSize="2Mb"
              :fileValidateTypeLabelExpectedTypes="'File harus berupa Excel atau PDF'" :instant-upload="true"
              v-on:initfile="$event => handleUploadFile({ file: $event, index })" />

            <div class="mt-1">
              <small>
                <span class="text-danger fw-bold">Perhatian!</span> File yang diupload hanya diperbolehkan file excel atau
                pdf
              </small>
            </div>
          </div>

          <div v-if="evident.type" class="mb-3">
            <label class="form-label" :for="`evident_deskripsi_${index}`">Deskripsi</label>
            <CKEditor :id="`evident_deskripsi_${index}`" v-model="evident.deskripsi" placeholder="Masukkan Deskripsi"
              :isInvalid="!!v$.evident.$each?.$response?.$errors[index].deskripsi?.length" />
            <ErrorMessage
              v-if="Array.isArray(v$.evident.$each?.$response?.$errors) && v$.listTarget.$each?.$response?.$errors.length"
              :errors="v$.listTarget.$each?.$response?.$errors[index].deskripsi" />
          </div>

          <hr />
        </template>


      </template>

      <template v-else>
        <NoOptions title="Belum Ada Evident" />
      </template>

      <div class="mt-5 d-flex justify-content-center align-items-center">
        <BaseButton @click="handleTambahEvident" title="Tambah Evident">
          <template #icon-left>
            <TablerIcon icon="PlusIcon" />
          </template>
        </BaseButton>
      </div>
    </template>

    <template #footer>
      <BaseButton @click="handleSubmit" title="Simpan Evident" :disabled="!formState.evident.length">
        <template #icon-left>
          <TablerIcon icon="CheckboxIcon" />
        </template>
      </BaseButton>
    </template>
  </BaseModal>
</template>