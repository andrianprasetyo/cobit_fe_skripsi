<script setup>
import { reactive, computed, onMounted, ref } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import FilePond from '@/components/FilePond/FilePond.vue'

import AccountServices from '@/services/lib/account'

import { useAuth } from '@/stores/auth'
import { useToast } from '@/stores/toast'
import { useLoading } from 'vue-loading-overlay'
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

const auth = useAuth()
const toast = useToast()
const loading = useLoading()

/* ---------------------------------- STATE & COMPUTED --------------------------------- */
const formState = reactive({
  loading: false,
  loadingSubmit: false,
  detail: null,
  nama: '',
  email: '',
  username: '',
  status: '',
  avatars: []
})

const filePondAvatar = ref(null)

const rules = computed(() => {
  return {
    /*
    email: {
      required: helpers.withMessage('Silahkan isi email', required),
      validEmail: helpers.withMessage("Alamat email tidak valid", email)
    },
    username: {
      required: helpers.withMessage('Silahkan isi username', required),
    },
    */
    nama: {
      required: helpers.withMessage('Silahkan isi nama', required),
    },
    avatars: {
      required: helpers.withMessage("Silahkan upload avatar", required)
    }
  }
})

const v$ = useVuelidate(rules, formState, { $autoDirty: false })

/* --------------------------------- METHODS -------------------------------- */
const getMyAccount = async () => {
  const loader = loading.show()
  try {
    formState.loading = true
    const response = await AccountServices.getMyAccount()

    if (response) {
      const data = response?.data;

      formState.detail = data;
      formState.username = data?.username;
      formState.nama = data?.nama;
      formState.email = data?.email;
      formState.status = data?.status;

      if (data?.avatar) {
        // const avatars = [{ source: data?.avatar }]
        // formState.avatars = avatars
      }

      formState.loading = false
      loader.hide()
    }
  } catch (error) {
    formState.loading = false
    loader.hide()
    toast({ error })
  }
}

const onUpdateFiles = (files) => {
  if (files && files?.length) {
    const listFile = []
    files.map((item) => listFile.push(item.file))
    formState.avatars = listFile
  } else {
    formState.avatars = []
  }
}

const onSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    try {
      formState.loadingSubmit = true

      const formData = new FormData()

      formData.append('nama', formState.nama)

      if (formState.avatars && formState.avatars.length) {
        formData.append('avatar', formState.avatars[0])
      }

      const response = await AccountServices.editAccount(formData)

      if (response) {
        const data = response?.data
        formState.loadingSubmit = false
        auth.setAccount(data)
        toast.success({
          title: 'Edit Profile',
          text: 'Berhasil Mengubah Data Profile'
        })

      }
    } catch (error) {
      formState.loadingSubmit = false
      toast.error({ error })
    }
  }
}


/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getMyAccount()
})

</script>

<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title fw-semibold">Detail Profile</h5>
        <p class="card-subtitle mb-4">
          Untuk mengubah detail pribadi Anda, Silakan isi dan lengkapi form dibawah ini
        </p>

        <form @submit.prevent="onSubmit">
          <div class="mb-3">
            <BaseInput id="username" v-model.trim="formState.username" label="Username" placeholder="Masukkan Username"
              tabindex="1" :disabled="true" />
          </div>

          <div class="mb-3">
            <BaseInput id="email" v-model.trim="formState.email" label="Email" placeholder="Masukkan Email" tabindex="2"
              :disabled="true" />
          </div>

          <div class="mb-3">
            <BaseInput id="nama" v-model="v$.nama.$model" label="Nama" placeholder="Masukkan Nama"
              :isInvalid="!!v$.nama.$errors?.length" tabindex="3"
              :disabled="formState.loadingSubmit || formState.loading" />
            <ErrorMessage :errors="v$.nama.$errors" />
          </div>

          <div class="mb-3">
            <FilePond ref="filePondAvatar" label="Foto Profile" name="avatar" :files="formState.avatars"
              v-on:updatefiles="onUpdateFiles" />
            <ErrorMessage :errors="v$.avatars.$errors" />
          </div>

          <div class="d-flex flex-column flex-md-row align-items-center mt-5">
            <div>
              <BaseButton type="submit" title="Simpan Perubahan" class="btn btn-primary me-0 me-md-3 mb-2 mb-md-0"
                :isLoading="formState.loadingSubmit" :disabled="formState.loading || formState.loadingSubmit" />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>