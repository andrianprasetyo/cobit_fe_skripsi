<script setup>
import { reactive, computed } from 'vue'

import OTPInput from '@/components/Input/OTPInput.vue'

import AuthServices from '@/services/lib/auth'

import { useToast } from '@/stores/toast'
import { useRouter, useRoute } from 'vue-router'

const toast = useToast()
const route = useRoute()
const router = useRouter()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loadingSubmit: false,
  kode: ''
})

const token = computed(() => {
  return route?.query?.token
})

/* --------------------------------- METHODS -------------------------------- */
const handleNavigateToResetPassword = () => {
  router.replace({
    path: '/auth/forgot-password/reset',
    query: {
      kode: formState.kode,
      token: token.value
    }
  })
}

const onComplete = async () => {
  try {
    formState.loadingSubmit = true
    const response = await AuthServices.verifyKodeResetPassword({ kode: formState.kode, token: token.value })

    if (response) {
      formState.loadingSubmit = false
      handleNavigateToResetPassword()
    }
  } catch (error) {
    formState.loadingSubmit = false
    toast.error({ error })
  }
}

</script>

<template>
  <div>
    <h2 class="mb-3 fs-7 fw-bolder lh-base">Verifikasi Kode Token 🔐</h2>

    <p class="mb-9">
      Masukkan kode verifikasi untuk mengatur ulang password yang kami kirimkan ke email anda.
    </p>

    <OTPInput v-model="formState.kode" :isDisabled="formState.loadingSubmit" @complete="onComplete" />
  </div>
</template>