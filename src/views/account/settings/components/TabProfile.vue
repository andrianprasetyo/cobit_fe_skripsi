<script setup>
import { reactive, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import BaseAvatar from '@/components/Avatar/BaseAvatar.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

/*
import FilePond from '@/components/FilePond/FilePond.vue'
*/

import AccountServices from '@/services/lib/account'

import { useAppConfig } from '@/stores/appConfig'
import { useAuth } from '@/stores/auth'
import { useToast } from '@/stores/toast'
import { useLoading } from 'vue-loading-overlay'
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

const appConfig = useAppConfig()
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
  avatars: [],
  pathAvatars: null,
  isNewFile: false
})

/*
const filePondAvatar = ref(null)
*/

const { account } = storeToRefs(auth)

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

const classBadgeStatus = computed(() => {
  return value => {
    if (value === 'active') {
      return 'bg-light-success text-success'
    } else if (value === 'pending') {
      return 'bg-light-warning text-warning'
    } else if (value === 'banned') {
      return 'bg-light-danger text-danger'
    } else {
      return 'bg-dark text-dark'
    }
  }
})

const labelStatus = computed(() => {
  return value => {
    if (value === 'active') {
      return 'Aktif'
    } else if (value === 'pending') {
      return 'Menunggu Aktivasi'
    } else if (value === 'banned') {
      return 'Diblokir'
    } else {
      return 'Tidak Diketahui'
    }
  }
})

const labelAkunInternal = computed(() => {
  return value => {
    if (value) {
      return 'Internal'
    } else {
      return 'Eksternal'
    }
  }
})

const v$ = useVuelidate(rules, formState, { $autoDirty: false })

/* --------------------------------- METHODS -------------------------------- */
/*
const onUpdateFiles = async ({ files, newFile = false }) => {
  if (newFile && files && files?.length) {
    const listFile = []
    files.map((item) => listFile.push(item.file))
    formState.avatars = listFile
    formState.isNewFile = newFile
  } else {
    formState.avatars = []
  }
}
*/

const handleUploadAvatar = (event) => {
  const files = event.target.files || event.dataTransfer.files;

  if (files) {
    formState.avatars = [files[0]]
    formState.pathAvatars = URL.createObjectURL(files[0])
    formState.isNewFile = true
  }
}

const getMyAccount = async () => {
  const loader = loading.show()
  try {
    formState.loading = true
    const response = await AccountServices.getMyAccount()

    if (response) {
      const data = response?.data;

      formState.username = data?.username;
      formState.nama = data?.nama;
      formState.email = data?.email;
      formState.status = data?.status;

      if (data?.avatar) {
        const avatar = { ...data?.avatar, path: `${appConfig.app.appHostMedia}${data?.avatar?.path}` }
        const avatarFile = new File([avatar], data?.avatar?.filename, { type: data?.avatar?.type })
        formState.avatars = [avatarFile]
        formState.pathAvatars = `${appConfig.app.appHostMedia}${data?.avatar?.path}`
      }

      formState.loading = false
      loader.hide()
    }
  } catch (error) {
    formState.loading = false
    loader.hide()
    toast.error({ error })
  }
}


const onSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    try {
      formState.loadingSubmit = true

      const formData = new FormData()

      formData.append('nama', formState.nama)

      if (formState.isNewFile && formState.avatars && formState.avatars.length) {
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
    <div class="row">
      <div class="col-12 col-md-4 d-flex align-items-stretch">
        <div class="card w-100 position-relative overflow-hidden">
          <div class="card-body p-4">
            <div class="text-center mb-4">
              <BaseAvatar :source="`${appConfig.app.appHostMedia}${account?.avatar?.path}`" width="120" height="120" />

              <h5 class="card-title fw-semibold mt-4">{{ account?.nama }}</h5>
              <span class="badge rounded-pill font-medium text-capitalize fw-bold"
                :class="classBadgeStatus(account?.status)">
                {{ labelStatus(account?.status) }}
              </span>
            </div>

            <ul class="list-unstyled mb-0">
              <li class="d-flex align-items-center gap-3 mb-4">
                <TablerIcon icon="UserIcon" class="text-dark fs-6" />
                <h6 class="fs-3 fw-semibold mb-0">{{ account?.username || '-' }}</h6>
              </li>
              <li class="d-flex align-items-center gap-3 mb-4">
                <TablerIcon icon="MailIcon" class="text-dark fs-6" />
                <h6 class="fs-3 fw-semibold mb-0">{{ account?.email || '-' }}</h6>
              </li>
              <li class="d-flex align-items-center gap-3 mb-4">
                <TablerIcon icon="UserCheckIcon" class="text-dark fs-6" />
                <h6 class="fs-3 fw-semibold mb-0">Akun {{ labelAkunInternal(account?.internal) }}</h6>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-8">

        <div class="card">
          <div class="card-body">
            <h5 class="card-title fw-semibold">Detail Profil</h5>
            <p class="card-subtitle mb-4">
              Untuk mengubah detail pribadi Anda, Silakan isi dan lengkapi form dibawah ini
            </p>

            <form @submit.prevent="onSubmit">
              <div class="mb-3">
                <BaseInput id="username" v-model.trim="formState.username" label="Username"
                  placeholder="Masukkan Username" tabindex="1" :disabled="true" />
              </div>

              <div class="mb-3">
                <BaseInput id="email" v-model.trim="formState.email" label="Email" placeholder="Masukkan Email"
                  tabindex="2" :disabled="true" />
              </div>

              <div class="mb-3">
                <BaseInput id="nama" v-model="v$.nama.$model" label="Nama" placeholder="Masukkan Nama"
                  :isInvalid="!!v$.nama.$errors?.length" tabindex="3"
                  :disabled="formState.loadingSubmit || formState.loading" />
                <ErrorMessage :errors="v$.nama.$errors" />
              </div>

              <div class="mb-3">
                <!-- <FilePond ref="filePondAvatar" label="Foto Profil" name="avatar" :files="formState.avatars"
                  v-on:updatefiles="$event => onUpdateFiles({ files: $event, newFile: true })" /> -->

                <BaseInput id="avatar" type="file" label="Foto Profil" name="avatar" v-on:change="handleUploadAvatar"
                  accept="image/*" />

                <template v-if="Array.isArray(formState.avatars) && formState.avatars.length && formState.pathAvatars">
                  <img class="img-thumbnail rounded img-responsive mt-3" style="object-fit: cover;"
                    :src="formState.pathAvatars" alt="avatar-form">
                </template>

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
    </div>

  </div>
</template>