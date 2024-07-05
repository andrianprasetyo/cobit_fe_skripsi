<script setup>
import { reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import debounce from 'lodash.debounce'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue'
import BaseAlert from '@/components/Alert/BaseAlert.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import QuisionerServices from '@/services/lib/quisioner'
import RespondenServices from '@/services/lib/responden'

import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf, helpers } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useKuesionerStore } from '@/views/kuesioner/kuesionerStore'
import { formatDateMoments, isSameOrBefore, isSameOrAfter } from '@/utils/momentDateFormat'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const quesioner = useKuesionerStore()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loadingSubmit: false,
  loading: false,
  detail: null,
  nama: '',
  email: '',
  divisi: '',
  jabatan: '',
  listDivisi: {
    loading: false,
    data: []
  },
  listJabatan: {
    loading: false,
    data: []
  },
})

const rules = computed(() => {
  return {
    nama: {
      required: helpers.withMessage('Silahkan isi nama', required),
    },
    divisi: {
      required: helpers.withMessage("Silahkan isi divisi", required)
    },
    jabatan: {
      required: helpers.withMessage("Silahkan isi jabatan", requiredIf(false))
    }
  }
})

const v$ = useVuelidate(rules, formState, { $autoDirty: false })

const formatDate = computed(() => {
  return value => {
    return formatDateMoments({ value: value?.value, format: 'DD MMMM YYYY' })
  }
})

const isKuesionerAvailable = computed(() => {
  const start_date = new Date(formState?.detail?.assesment?.start_date_quisioner).toDateString()
  const end_date = new Date(formState?.detail?.assesment?.end_date_quisioner).toDateString()

  const today = new Date().toDateString()

  const isPassed = isSameOrAfter({ date1: today, date2: start_date })

  const isNotExpired = isSameOrBefore({ date1: today, date2: end_date })

  const isAvailable = isPassed && isNotExpired;

  return isAvailable
})

/* --------------------------------- METHODS -------------------------------- */
const getDetailQuisionerRespondenByCode = async () => {
  try {
    formState.loading = true
    const response = await QuisionerServices.getDetailQuisionerRespondenByCode({ code: route.query?.code })

    if (response) {
      const data = response?.data;

      quesioner.$patch({ responden: data })

      if (data?.status === 'active' && (!data?.is_proses || data?.is_proses === null)) {
        handleNavigateToQuestion()

        return
      } else if (data?.status === 'done') {
        handleNavigateToFinishQuestion()

        return
      }

      formState.detail = data
      formState.email = data?.email || ''
      formState.nama = data?.nama || ''
      formState.divisi = data?.divisi || ''
      formState.jabatan = data?.jabatan || ''

      formState.loading = false

      return response
    }
  } catch (error) {
    formState.loading = false
    handleRedirectTo404()
  }
}

const handleSearchDivisi = debounce(async ({ search }) => {
  try {
    const response = await RespondenServices.getListDivisi({ limit: 10, page: 1, search, organisasi_id: formState.detail?.assesment?.organisasi?.id })

    if (response) {
      const data = response?.data

      formState.listDivisi.data = data?.list || []
    }

  } catch (error) {
    toast.error({ error })
  }
}, 500)

const handleSearchJabatan = debounce(async ({ search }) => {
  try {
    const response = await RespondenServices.getListJabatan({ limit: 10, page: 1, search, divisi_id: formState.divisi?.id })

    if (response) {
      const data = response?.data

      formState.listJabatan.data = data?.list || []
    }

  } catch (error) {
    toast.error({ error })
  }
}, 500)

const handleRedirectTo404 = () => {
  router.replace({ path: '/404' })
}

const handleNavigateToQuestion = () => {
  router.replace({
    path: '/kuesioner/responden/question', query: {
      code: route.query?.code
    }
  })
}

const handleNavigateToFinishQuestion = () => {
  router.replace({ path: '/kuesioner/responden/question/finish' })
}

const onSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    try {
      formState.loadingSubmit = true

      let payload = {
        id: formState.detail?.id,
        assesment_id: formState?.detail?.assesment?.id,
        nama: formState.nama,
        divisi_id: formState.divisi?.id
      }

      if (formState.jabatan?.id) {
        payload['jabatan_id'] = formState.jabatan?.id
      }

      const response = await QuisionerServices.saveResponden(payload);

      if (response) {
        const data = response?.data
        quesioner.$patch({ responden: data })
        formState.loadingSubmit = false
        handleNavigateToQuestion()
      }
    } catch (error) {
      formState.loadingSubmit = false
      toast.error({ error })
      throw error
    }
  }
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  quesioner.$patch({
    question: {
      currentQuestion: 1
    }
  })

  getDetailQuisionerRespondenByCode().then(() => {
    if (formState.detail?.assesment?.organisasi?.id) {
      handleSearchDivisi({ search: '' })
    }
  })
})

watch(() => [formState.divisi], () => {
  if (formState.divisi) {
    handleSearchJabatan({ search: '' })
  }

  formState.jabatan = ''
}, { deep: true })

</script>

<template>
  <div>
    <div v-if="formState.loading">
      <div class="vh-100 d-flex align-items-center justify-content-center">
        <LoadingSpinner />
      </div>
    </div>

    <div v-else class="row col-12 offset-md-1 col-md-9">

      <div class="card">
        <div class="card-body">
          <h2 class="mb-4 fs-7 fw-bolder lh-base text-center">
            Selamat Datang 👋<br />
            di {{ formState?.detail?.assesment?.nama }}
          </h2>

          <div>
            <div class="d-flex flex-column flex-md-row mb-4 bg-primary rounded p-3 justify-content-between">
              <div>
                <h5 class="fw-bolder text-white mb-1">{{ formState?.detail?.assesment?.organisasi?.nama }}</h5>
                <p class="mb-0 text-white">
                  Periode : {{ formatDate({ value: formState.detail?.assesment?.start_date }) }} s/d {{ formatDate({
      value:
        formState.detail?.assesment?.end_date
    }) }}
                </p>
              </div>

              <div class="d-none d-md-block">
                <TablerIcon icon="ChecklistIcon" size="45" class="text-white" />
              </div>
            </div>

            <div class="d-flex justify-content-center">
              <div class="card-subtitle mb-0" v-html="formState?.detail?.assesment?.deskripsi" />
            </div>
          </div>

          <div class="row">
            <BaseAlert v-if="!isKuesionerAvailable" variant="danger">
              <div>
                <strong>Perhatian.</strong> Periode Kuisioner Belum Dimulai atau Sudah Terlewat.
                <br />
                <strong>Periode Kuesioner :</strong> {{ formatDate({
      value:
        formState.detail?.assesment?.start_date_quisioner
    }) }} s/d {{
      formatDate({
        value:
          formState.detail?.assesment?.end_date_quisioner
      }) }}.
              </div>
            </BaseAlert>

            <BaseAlert v-else-if="isKuesionerAvailable" variant="primary">
              <strong>Periode Kuesioner : </strong> {{ formatDate({
      value:
        formState.detail?.assesment?.start_date_quisioner
    }) }} s/d {{
      formatDate({
        value:
          formState.detail?.assesment?.end_date_quisioner
      }) }}
            </BaseAlert>

            <hr />

            <p class="mb-9 text-center">Sebelum mulai Kuesioner, Silahkan isi dengan data diri anda terlebih dahulu</p>

            <div class="col-12 mb-3">
              <BaseInput id="email" label="Email" v-model="formState.email" placeholder="Masukkan Email"
                :disabled="true" />
            </div>

            <div class="col-12 mb-3">
              <BaseInput id="nama" label="Nama" v-model="v$.nama.$model" placeholder="Masukkan Nama"
                :isInvalid="v$.nama.$errors?.length" tabindex="1"
                :disabled="formState.loadingSubmit || !isKuesionerAvailable" />
              <ErrorMessage :errors="v$.nama.$errors" />
            </div>

            <div class="row mb-3">
              <div class="col-12 col-md-6 mb-2 mb-md-0">
                <label class="form-label" for="divisi">Divisi / Direktorat</label>

                <v-select id="divisi" @search="(search) => handleSearchDivisi({ search })" :filterable="false"
                  :options="formState.listDivisi.data" v-model="formState.divisi"
                  :disabled="formState.listDivisi.loading || formState.loadingSubmit || !isKuesionerAvailable"
                  label="nama" placeholder="Cari Divisi" :select-on-key-codes="[]"
                  :class="{ 'invalid-v-select': v$.divisi.$errors?.length }">
                  <template #no-options>
                    Tidak ada Divisi Ditemukan
                  </template>

                  <template #option="option">
                    <div class="d-flex flex-row align-items-center py-1 width-150px">
                      <span class="me-2 fw-bold text-truncate">
                        {{ option.nama }}
                      </span>
                    </div>
                  </template>

                  <template #selected-option="option">
                    <div class="d-flex flex-row align-items-center py-1 width-150px ">
                      <span class="me-2 fw-bold text-truncate">
                        {{ option.nama }}
                      </span>
                    </div>
                  </template>

                </v-select>
                <ErrorMessage :errors="v$.divisi.$errors" />
              </div>

              <div class="col-12 col-md-6 mb-2 mb-md-0">
                <label class="form-label" for="jabatan">Jabatan</label>

                <v-select id="jabatan" @search="(search) => handleSearchJabatan({ search })" :filterable="false"
                  :options="formState.listJabatan.data" v-model="formState.jabatan"
                  :disabled="formState.listJabatan.loading || formState.loadingSubmit || !formState.divisi || !isKuesionerAvailable"
                  label="nama" placeholder="Cari Jabatan" :select-on-key-codes="[]"
                  :class="{ 'invalid-v-select': v$.jabatan.$errors?.length }">
                  <template #no-options>
                    Tidak ada Jabatan Ditemukan
                  </template>

                  <template #option="option">
                    <div class="d-flex flex-row align-items-center py-1 width-150px">
                      <span class="me-2 fw-bold text-truncate">
                        {{ option.nama }}
                      </span>
                    </div>
                  </template>

                  <template #selected-option="option">
                    <div class="d-flex flex-row align-items-center py-1 width-150px ">
                      <span class="me-2 fw-bold text-truncate">
                        {{ option.nama }}
                      </span>
                    </div>
                  </template>

                </v-select>
                <ErrorMessage :errors="v$.jabatan.$errors" />
              </div>
            </div>

          </div>

          <div class="mt-4">
            <BaseButton @click="onSubmit" title="Mulai Kuesioner" class="btn btn-primary w-100 py-2"
              :isLoading="formState.loadingSubmit" :disabled="formState.loadingSubmit" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>