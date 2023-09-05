<script setup>
import { reactive, computed } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'

import AuthServices from '@/services/lib/auth'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, minLength, sameAs } from "@vuelidate/validators";

import { useAppConfig } from '@/stores/appConfig'
import { useToast } from '@/stores/toast'
import { useRoute, useRouter } from 'vue-router'

const { app } = useAppConfig()
const toast = useToast()
const route = useRoute()
const router = useRouter()

const formState = reactive({
  password: '',
  password_confirmation: '',
  isLoading: false,
})

const containNumber = helpers.regex(/(.*\d.*)/);
const oneLowerCase = helpers.regex(/(.*[a-z].*)/);
const oneUpperCase = helpers.regex(/(.*[A-Z].*)/);

const rules = computed(() => {
  return {
    password: {
      required: helpers.withMessage('Silahkan isi password', required),
      minLength: helpers.withMessage(
        "Password minimal berisi 8 karakter",
        minLength(8)
      ),
      containNumber: helpers.withMessage(
        "Password harus memiliki 1 karakter angka",
        containNumber
      ),
      oneLowerCase: helpers.withMessage(
        "Password harus memiliki 1 karakter huruf kecil",
        oneLowerCase
      ),
      oneUpperCase: helpers.withMessage(
        "Password harus memiliki 1 karakter huruf kapital",
        oneUpperCase
      ),
    },
    password_confirmation: {
      required: helpers.withMessage("Silahkan isi password", required),
      samesAsPassword: helpers.withMessage(
        "Konfirmasi password tidak sama",
        sameAs(formState.password)
      ),
    }
  }
})

const token = computed(() => {
  return route?.query?.token
})

const v$ = useVuelidate(rules, formState, { $autoDirty: false })

const handleNavigateToLogin = () => {
  router.replace({
    path: "/auth/login"
  })
}

const onSubmit = async () => {
  try {
    formState.isLoading = true
    const response = await AuthServices.resetNewPassword({
      token: token.value,
      password: formState.password,
      password_confirmation: formState.password_confirmation
    })

    if (response) {
      formState.isLoading = false

      toast.success({
        title: "Reset Password Berhasil",
        text: `Silahkan Login Menggunakan Password Baru`,
      })

      handleNavigateToLogin()
    }
  } catch (error) {
    formState.isLoading = false
    toast.error({ error })
  }
}

</script>

<template>
  <div class="h-100 bg-body row justify-content-center align-items-center p-4">
    <div class="col-sm-8 col-md-6 col-xl-9">
      <div class="text-nowrap logo-img d-block py-9 w-100 mb-3">
        <div class="d-flex flex-column justify-content-center align-items-center">
          <img :src="app.appLogoImage" alt="logo" height="65" />
        </div>
      </div>

      <h2 class="mb-3 fs-7 fw-bolder lh-base">Reset Password &nbsp;🔑</h2>

      <p class="mb-9">
        Masukkan password baru yang ingin anda gunakan.
      </p>

      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <BaseInput id="password" type="password" label="Password Baru" v-model="v$.password.$model"
            placeholder="Masukkan Password Baru" :isInvalid="v$.password.$errors?.length" tabindex="1"
            :disabled="formState.isLoading" />
          <ErrorMessage :errors="v$.password.$errors" />
        </div>

        <div class="mb-3">
          <BaseInput id="password_confirmation" type="password" label="Konfirmasi Password Baru"
            v-model="v$.password_confirmation.$model" placeholder="Masukkan Konfirmasi Password Baru"
            :isInvalid="v$.password_confirmation.$errors?.length" tabindex="2" :disabled="formState.isLoading" />
          <ErrorMessage :errors="v$.password_confirmation.$errors" />
        </div>

        <div class="mt-4">
          <BaseButton type="submit" title="Reset Password" class="btn btn-primary w-100 py-2"
            :isLoading="formState.isLoading" :disabled="formState.isLoading" />
        </div>
      </form>
    </div>
  </div>
</template>