<script setup>
import { reactive, computed, onMounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue'

import QuisionerServices from '@/services/lib/quisioner'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useAppConfig } from '@/stores/appConfig'
import { useToast } from '@/stores/toast'
import { useQuisionerStore } from '@/views/quisioner/quisionerStore'

const { app } = useAppConfig()
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
    <RouterLink to="/" class="text-nowrap logo-img text-center d-block mb-4 w-100">
      <div class="d-flex flex-column justify-content-center align-items-center">
        <img :src="app.appLogoImage" width="180" alt="logo" />
      </div>
    </RouterLink>

    <template v-if="formState.loading">
      <LoadingSpinner />
    </template>

    <template v-else>
      <h2 class="mb-3 fs-7 fw-bolder lh-base text-center">Selamat Datang <br />
        di {{ formState?.detail?.assesment?.nama }} - {{ formState?.detail?.assesment?.organisasi?.nama }} 👋
      </h2>

      <div class="d-flex justify-content-center mx-0 mx-md-3">
        <div class="card-subtitle mb-0" v-html="formState?.detail?.assesment?.deskripsi" />
      </div>

      <hr />

      <div class="mb-3">
        <BaseInput id="email" label="Email" v-model="formState.email" placeholder="Masukkan Email" :disabled="true" />
      </div>

      <div class="mb-3">
        <BaseInput id="nama" label="Nama" v-model="v$.nama.$model" placeholder="Masukkan Nama"
          :isInvalid="v$.nama.$errors?.length" tabindex="1" :disabled="formState.loadingSubmit" />
        <ErrorMessage :errors="v$.nama.$errors" />
      </div>

      <div class="mb-3">
        <BaseInput id="divisi" label="Divisi" v-model="v$.divisi.$model" placeholder="Masukkan Divisi"
          :isInvalid="v$.divisi.$errors?.length" tabindex="2" :disabled="formState.loadingSubmit" />
        <ErrorMessage :errors="v$.divisi.$errors" />
      </div>

      <div class="mb-3">
        <BaseInput id="jabatan" label="Jabatan" v-model="v$.jabatan.$model" placeholder="Masukkan Jabatan"
          :isInvalid="v$.jabatan.$errors?.length" tabindex="3" :disabled="formState.loadingSubmit" />
        <ErrorMessage :errors="v$.jabatan.$errors" />
      </div>

      <div class="mt-4">
        <BaseButton @click="onSubmit" title="Mulai" class="btn btn-primary w-100 py-2"
          :isLoading="formState.loadingSubmit" :disabled="formState.loadingSubmit" />
      </div>
    </template>

  </div>
</template>