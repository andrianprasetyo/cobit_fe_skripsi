<script setup>
import { reactive, computed } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, email } from "@vuelidate/validators";

import AuthServices from '@/services/lib/auth'

import { useAppConfig } from '@/stores/appConfig'
import { useToast } from '@/stores/toast'
import { useRouter, RouterLink } from 'vue-router'

const { app } = useAppConfig()
const toast = useToast()
const router = useRouter()

const formState = reactive({
  email: '',
  isLoading: false,
})

const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage('Silahkan isi email', required),
      email: helpers.withMessage("Alamat Email tidak Valid", email)
    },
  }
})

const v$ = useVuelidate(rules, formState, { $lazy: true, $autoDirty: false })

const handleRedirectToLogin = () => {
  router.push({ path: "/auth/login" })
}

const onSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    try {
      formState.isLoading = true
      const response = await AuthServices.resetPassword({ email: formState.email })

      if (response) {
        formState.isLoading = false

        toast.success({
          title: 'Email Pengaturan Ulang Password',
          text: `Berhasil Mengirimkan Email Instruksi Atur Ulang Password ke ${formState.email}`
        })

        handleRedirectToLogin()
      }
    } catch (error) {
      formState.isLoading = false
      toast.error({ error })
    }
  }
}

</script>

<template>
  <div class="h-100 bg-body row justify-content-center align-items-center p-4">
    <div class="col-sm-8 col-md-6 col-xl-9">
      <RouterLink to="/" class="text-nowrap logo-img d-block py-9 w-100 mb-3">
        <div class="d-flex flex-column justify-content-center align-items-center">
          <img :src="app.appLogoImage" alt="logo" height="65" />
        </div>
      </RouterLink>

      <h2 class="mb-3 fs-7 fw-bolder lh-base">Lupa Password ? 🔐</h2>
      <p class="mb-9">
        Masukkan email Anda dan kami akan mengirimkan instruksi untuk mengatur
        ulang password anda.
      </p>

      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <BaseInput id="email" label="Email" v-model="v$.email.$model" placeholder="Masukkan Email"
            :isInvalid="v$.email.$errors?.length" tabindex="1" :disabled="formState.isLoading" />
          <ErrorMessage :errors="v$.email.$errors" />
        </div>

        <div class="mt-4">
          <BaseButton type="submit" title="Atur Ulang Password" class="btn btn-primary w-100 py-2"
            :isLoading="formState.isLoading" :disabled="formState.isLoading" />
        </div>
      </form>

      <p class="text-center mt-4">
        <RouterLink to="/auth/login">
          <TablerIcon icon="ChevronLeftIcon" class="me-1" />
          <a><span>&nbsp;Kembali ke Login</span></a>
        </RouterLink>
      </p>
    </div>
  </div>
</template>