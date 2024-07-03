<script setup>
import { reactive, computed, watch } from 'vue'
import debounce from 'lodash.debounce'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'

import AssessmentServices from '@/services/lib/assessment'
import OrganisasiServices from '@/services/lib/organisasi'

import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useToast } from '@/stores/toast'
import { useLoading } from 'vue-loading-overlay'

const assessment = useAssessmentStore()
const toast = useToast()
const loading = useLoading()

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'refresh'])

/* ---------------------------------- STATE --------------------------------- */
const formState = reactive({
  loadingSubmit: false,
  organisasi: null,
  listOrganisasi: {
    loading: false,
    data: []
  },
})

/* -------------------------------- COMPUTED -------------------------------- */
const rules = computed(() => {
  return {
    organisasi: {
      required: helpers.withMessage("Silahkan pilih organisasi", required)
    },
  }
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true, $scope: false })

/* --------------------------------- METHODS -------------------------------- */
const dropdownOrganisasiShouldOpen = (VueSelect) => {
  if (VueSelect.search?.length) {
    return VueSelect.open;
  } else {
    return false;
  }
}

const handleSearchOrganisasi = debounce(async ({ search }) => {
  try {
    const response = await OrganisasiServices.getListOrganisasi({ limit: 10, page: 1, search })

    if (response) {
      const data = response?.data

      formState.listOrganisasi.data = data?.list || []
    }

  } catch (error) {
    toast.error({ error })
  }
}, 500)

const handleClose = () => {
  emits('close', true)
}

const setValueToForm = () => {
  formState.organisasi = assessment.detail?.organisasi || null
}


const onSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const loader = loading.show()
    try {
      formState.loadingSubmit = true

      const response = await AssessmentServices.editOrganisasi({
        id: assessment?.detail?.id,
        organisasi_id: formState.organisasi?.id
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Ganti Organisasi',
          text: 'Berhasil Mengubah Data Organisasi'
        })

        assessment.$patch({
          detail: {
            ...assessment.detail, organisasi: {
              ...assessment.detail.organisasi,
              nama: formState.organisasi?.nama,
              deskripsi: formState.organisasi?.deskripsi
            }
          }
        })

        v$.value.$reset()
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
watch(() => [props.isShow], () => {
  if (props.isShow) {
    setValueToForm()
  }
}, { deep: true })

</script>

<template>
  <BaseModal id="edit_organisasi" :order="5" :open="props.isShow" :showBtnCloseFooter="false" classNameModal="modal-lg"
    @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Ganti Organisasi
      </h4>
    </template>

    <template #body>
      <div class="mb-3">
        <label class="form-label" for="organisasi">Organisasi</label>

        <v-select id="organisasi" @search="(search) => handleSearchOrganisasi({ search })" :filterable="false"
          :options="formState.listOrganisasi.data" v-model="formState.organisasi" :disabled="formState.loadingSubmit"
          label="nama" placeholder="Cari Organisasi" :select-on-key-codes="[]"
          :class="{ 'invalid-v-select': v$.organisasi.$errors?.length }"
          :dropdown-should-open="dropdownOrganisasiShouldOpen">

          <template #option="option">
            <div class="d-flex flex-row align-items-center py-1">
              <span class="me-2 fw-bold">
                {{ option.nama }}
              </span>
            </div>
          </template>

          <template #selected-option="option">
            <div class="d-flex flex-row align-items-center py-1">
              <span class="me-2 fw-bold">
                {{ option.nama }}
              </span>
            </div>
          </template>
        </v-select>

        <ErrorMessage :errors="v$.organisasi.$errors" />
      </div>
    </template>

    <template #footer>
      <BaseButton @click="onSubmit" title="Simpan Perubahan" :disabled="formState.loadingSubmit"
        :is-loading="formState.loadingSubmit" :access="['project-add', 'project-edit']">
        <template #icon-left>
          <TablerIcon icon="DeviceFloppyIcon" />
        </template>
      </BaseButton>
    </template>
  </BaseModal>
</template>