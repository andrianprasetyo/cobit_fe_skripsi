<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue'

import QuisionerServices from '@/services/lib/quisioner'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useQuisionerStore } from '@/views/quisioner/quisionerStore'
import { formatDateMoments } from '@/utils/momentDateFormat'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const quesioner = useQuisionerStore()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loadingSubmit: false,
  loading: false,
  detail: null,
  nama: '',
  email: '',
  divisi: '',
  jabatan: ''
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
      required: helpers.withMessage("Silahkan isi jabatan", required)
    }
  }
})

const v$ = useVuelidate(rules, formState, { $autoDirty: false })

const formatDate = computed(() => {
  return value => {
    return formatDateMoments({ value: value?.value, format: 'MMMM YYYY' })
  }
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
      }

      formState.detail = data
      formState.email = data?.email || ''
      formState.nama = data?.nama || ''
      formState.divisi = data?.divisi || ''
      formState.jabatan = data?.jabatan || ''

      formState.loading = false

    }
  } catch (error) {
    formState.loading = false
    handleRedirectTo404()
  }
}

const handleRedirectTo404 = () => {
  router.replace({ path: '/404' })
}

const handleNavigateToQuestion = () => {
  router.replace({ path: '/quisioner/responden/question' })
}

const onSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    try {
      formState.loadingSubmit = true

      const response = await QuisionerServices.saveResponden({
        id: formState.detail?.id,
        assesment_id: formState?.detail?.assesment?.id,
        nama: formState.nama,
        divisi: formState.divisi,
        jabatan: formState.jabatan
      })

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
  getDetailQuisionerRespondenByCode()
})

</script>

<template>
  <div>
    <div v-if="formState.loading">
      <div class="vh-100 d-flex align-items-center justify-content-center">
        <LoadingSpinner />
      </div>
    </div>

    <div v-else class="card">
      <div class="card-body">
        <h2 class="mb-3 fs-7 fw-bolder lh-base text-center">Selamat Datang 👋<br />
          di Assessment {{ formState?.detail?.assesment?.nama }} <br /> {{ formState?.detail?.assesment?.organisasi?.nama
          }} - Periode {{ formatDate({ value: formState.detail?.assesment?.organisasi?.start_date }) }}
        </h2>

        <div class="d-flex justify-content-center mx-0 mx-md-3">
          <div class="card-subtitle mb-0" v-html="formState?.detail?.assesment?.deskripsi" />
        </div>

        <hr />

        <div class="row">
          <p class="mb-9 text-center">Sebelum mulai quisioner, Silahkan isi dengan data diri anda terlebih dahulu</p>

          <div class="col-12 mb-3">
            <BaseInput id="email" label="Email" v-model="formState.email" placeholder="Masukkan Email" :disabled="true" />
          </div>

          <div class="col-12 mb-3">
            <BaseInput id="nama" label="Nama" v-model="v$.nama.$model" placeholder="Masukkan Nama"
              :isInvalid="v$.nama.$errors?.length" tabindex="1" :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.nama.$errors" />
          </div>

          <div class="col-12 col-md-6 mb-3">
            <BaseInput id="divisi" label="Divisi" v-model="v$.divisi.$model" placeholder="Masukkan Divisi"
              :isInvalid="v$.divisi.$errors?.length" tabindex="2" :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.divisi.$errors" />
          </div>

          <div class="col-12 col-md-6 mb-3">
            <BaseInput id="jabatan" label="Jabatan" v-model="v$.jabatan.$model" placeholder="Masukkan Jabatan"
              :isInvalid="v$.jabatan.$errors?.length" tabindex="3" :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.jabatan.$errors" />
          </div>

        </div>

        <div class="mt-4">
          <BaseButton @click="onSubmit" title="Mulai Quisioner" class="btn btn-primary w-100 py-2"
            :isLoading="formState.loadingSubmit" :disabled="formState.loadingSubmit" />
        </div>
      </div>
    </div>

  </div>
</template>