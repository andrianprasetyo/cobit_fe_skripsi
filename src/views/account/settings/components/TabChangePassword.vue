<script setup>
import { reactive, computed } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'

import AccountServices from '@/services/lib/account'

import { useToast } from '@/stores/toast'
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, minLength, sameAs } from "@vuelidate/validators";

const toast = useToast()

const containNumber = helpers.regex(/(.*\d.*)/);
const oneLowerCase = helpers.regex(/(.*[a-z].*)/);
const oneUpperCase = helpers.regex(/(.*[A-Z].*)/);

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loadingSubmit: false,
  old_password: '',
  password: '',
  password_confirmation: ''
})

const rules = computed(() => {
  return {
    old_password: {
      required: helpers.withMessage('Silahkan isi password lama', required),
    },
    password: {
      required: helpers.withMessage("Silahkan isi password baru", required),
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
      required: helpers.withMessage("Silahkan isi konfirmasi password baru", required),
      samesAsPassword: helpers.withMessage(
        "Konfirmasi password tidak sama",
        sameAs(formState.password)
      ),
    }
  }
})

const v$ = useVuelidate(rules, formState, { $autoDirty: false })

/* --------------------------------- METHODS -------------------------------- */
const onSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    try {
      formState.loadingSubmit = true

      const response = await AccountServices.changePassword({
        old_password: formState.old_password,
        password: formState.password,
        password_confirmation: formState.password_confirmation
      })

      if (response) {
        formState.loadingSubmit = false
        toast.success({
          title: 'Change Password',
          text: 'Berhasil Mengubah Data Password'
        })
      }

    } catch (error) {
      formState.loadingSubmit = false
      toast.error({ error })
    }
  }
}

</script>

<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title fw-semibold">Change Password</h5>
        <p class="card-subtitle mb-4">
          Untuk mengubah password Anda, Silakan isi dan lengkapi form dibawah ini
        </p>

        <form @submit.prevent="onSubmit">
          <div class="mb-3">
            <BaseInput type="password" id="old_password" v-model="v$.old_password.$model" label="Password Lama"
              placeholder="Masukkan Password Lama" :isInvalid="!!v$.old_password.$errors?.length" tabindex="1"
              :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.old_password.$errors" />
          </div>

          <div class="mb-3">
            <BaseInput type="password" id="password" v-model="v$.password.$model" label="Password Baru"
              placeholder="Masukkan Password Baru" :isInvalid="!!v$.password.$errors?.length" tabindex="2"
              :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.password.$errors" />
          </div>

          <div class="mb-3">
            <BaseInput type="password" id="password_confirmation" v-model="v$.password_confirmation.$model"
              label="Konfirmasi Password Baru" placeholder="Masukkan Konfirmasi Password Baru"
              :isInvalid="!!v$.password_confirmation.$errors?.length" tabindex="3" :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.password_confirmation.$errors" />
          </div>

          <div class="d-flex flex-column flex-md-row align-items-center mt-5">
            <div>
              <BaseButton type="submit" title="Ubah Password" class="btn btn-primary me-0 me-md-3 mb-2 mb-md-0"
                :isLoading="formState.loadingSubmit" :disabled="formState.loadingSubmit" />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>