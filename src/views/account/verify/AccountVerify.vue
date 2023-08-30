<script setup>
import { reactive, computed, onMounted, defineAsyncComponent } from 'vue'

import Spinner from '@/components/Loading/LoadingSpinner.vue'

import AccountServices from '@/services/lib/account'

import { useAppConfig } from '@/stores/appConfig'
import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'

const ValidToken = defineAsyncComponent({
  loader: () => import('@/views/account/verify/components/ValidToken.vue')
})

const InvalidToken = defineAsyncComponent({
  loader: () => import('@/views/account/verify/components/InvalidToken.vue')
})

const VerifyComponent = {
  ValidToken,
  InvalidToken
}

const { app } = useAppConfig()
const toast = useToast()
const route = useRoute()

const verifyState = reactive({
  isLoading: false,
  isInvalid: false,
  data: null
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

const verifyToken = async () => {
  try {
    verifyState.isLoading = true
    const response = await AccountServices.verifyToken({ token: token.value })

    if (response) {
      const data = response?.data

      verifyState.data = data
      verifyState.isLoading = false
    }
  } catch (error) {
    verifyState.isInvalid = true
    verifyState.isLoading = false
    toast.error({ error })
  }
}

onMounted(() => {
  verifyToken()
})

</script>

<template>
  <div class="h-100 bg-body row justify-content-center align-items-center p-4">
    <div class="col-sm-8 col-md-6 col-xl-9">
      <div class="text-nowrap logo-img d-block py-9 w-100 mb-3">
        <div class="d-flex flex-column justify-content-center align-items-center">
          <img :src="app.appLogoImage" alt="logo" height="65" />
        </div>
      </div>

      <template v-if="verifyState.isLoading">
        <Spinner />
      </template>

      <template v-else>
        <component :is="VerifyComponent[showVerifyComponent]" :data="verifyState.data" />
      </template>
    </div>
  </div>
</template>