<script setup>
import { reactive, computed, onMounted, defineAsyncComponent } from 'vue'

import Spinner from '@/components/Loading/LoadingSpinner.vue'

import AuthServices from '@/services/lib/auth'

import { useAppConfig } from '@/stores/appConfig'
import { useToast } from '@/stores/toast'
import { useRoute, RouterLink } from 'vue-router'

const ValidToken = defineAsyncComponent({
  loader: () => import('@/views/auth/forgot-password/verify/components/ValidToken.vue')
})

const InvalidToken = defineAsyncComponent({
  loader: () => import('@/views/auth/forgot-password/verify/components/InvalidToken.vue')
})

const VerifyComponent = {
  ValidToken,
  InvalidToken
}

const { app } = useAppConfig()
const toast = useToast()
const route = useRoute()

const verifyState = reactive({
  kode: '',
  isLoading: false,
  isInvalid: false,
})

const token = computed(() => {
  return route?.query?.token
})

const showVerifyComponent = computed(() => {
  if (verifyState.isInvalid) {
    return "InvalidToken"
  } else {
    return 'ValidToken'
  }
})

const verifyForgotPassword = async () => {
  try {
    verifyState.isLoading = true
    const response = await AuthServices.verifyResetPassword({ token: token.value })

    if (response) {
      verifyState.isLoading = false
    }
  } catch (error) {
    verifyState.isInvalid = true
    verifyState.isLoading = false
    toast.error({ error })
  }
}

onMounted(() => {
  verifyForgotPassword()
})

</script>

<template>
  <div class="h-100 bg-body row justify-content-center align-items-center p-4">
    <div class="col-sm-8 col-md-6 col-xl-9">
      <RouterLink to="/" class="text-nowrap logo-img d-block py-9 w-100 mb-3">
        <div class="d-flex flex-column justify-content-center align-items-center">
          <img :src="app.appLogoImage" alt="logo" height="65" />
        </div>
      </RouterLink>

      <template v-if="verifyState.isLoading">
        <Spinner />
      </template>

      <template v-else>
        <component :is="VerifyComponent[showVerifyComponent]" />
      </template>
    </div>
  </div>
</template>