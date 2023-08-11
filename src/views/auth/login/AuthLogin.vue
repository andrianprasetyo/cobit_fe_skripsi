<script setup>
import { reactive, computed } from 'vue'
import { RouterLink } from 'vue-router'
import BaseButton from '@/components/Button/BaseButton.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

import { useAuth } from '@/stores/auth'
import { useAppConfig } from '@/stores/appConfig'

const { login } = useAuth()

const { app } = useAppConfig()

const formState = reactive({
  username: '',
  password: '',
  isLoading: false,
})

const rules = computed(() => {
  return {
    username: {
      required: helpers.withMessage('Silahkan isi username', required),
    },
    password: {
      required: helpers.withMessage("Silahkan isi password", required)
    }
  }
})

const v$ = useVuelidate(rules, formState, { $autoDirty: true })

const onSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    try {
      formState.isLoading = true

      const response = await login({ username: formState.username, password: formState.password })

      if (response) {
        formState.isLoading = false
      }
    } catch (error) {
      formState.isLoading = false
      throw error
    }
  }
}

</script>

<template>
  <div class="h-100 bg-body row justify-content-center align-items-center p-4">
    <div class="col-sm-8 col-md-6 col-xl-9">
      <h2 class="mb-3 fs-7 fw-bolder lh-base">Selamat Datang <br />
        di {{ app.appName }} 👋</h2>
      <p class=" mb-9">Silakan masuk ke akun Anda</p>
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <BaseInput id="username" label="Username" v-model="v$.username.$model" placeholder="Masukkan Username"
            :isInvalid="v$.username.$errors?.length" tabindex="1" />
          <ErrorMessage :errors="v$.username.$errors" />
        </div>
        <div class="mb-3">
          <BaseInput id="password" type="password" label="Password" v-model="v$.password.$model"
            placeholder="Masukkan Password" :isInvalid="v$.password.$errors?.length" tabindex="2" />
          <ErrorMessage :errors="v$.password.$errors" />
        </div>
        <div class="d-flex align-items-center justify-content-between d-none">
          <div />
          <RouterLink to="/auth/forgot-password" class="text-primary fw-medium">
            Lupa Password ?
          </RouterLink>
        </div>
        <div class="mt-4">
          <BaseButton type="submit" title="Sign In" class="btn btn-primary w-100 py-2" :isLoading="formState.isLoading"
            :disabled="formState.isLoading" />
        </div>
      </form>
    </div>
  </div>
</template>