<script setup>
import { computed } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

/*
import AccountServices from '@/services/lib/account'

import { useToast } from '@/stores/toast'
*/

import { useRouter, useRoute } from 'vue-router'
import { useAppConfig } from '@/stores/appConfig'

/*
const toast = useToast()
*/
const route = useRoute()
const router = useRouter()
const appConfig = useAppConfig()

const props = defineProps({
  data: {
    type: Object
  }
})

/* ---------------------------- STATE & COMPUTED ---------------------------- */
/*
const formState = reactive({
  loadingSubmit: false,
})
*/

const token = computed(() => {
  return route?.query?.token
})

/* --------------------------------- METHODS -------------------------------- */


const handleNavigateToConfigPassword = () => {
  router.replace({
    path: '/account/set-password',
    query: {
      id: props.data.id,
      token: token.value,
    }
  })
}

/*
const handleNavigateToLogin = () => {
  router.replace({
    path: '/auth/login',
    query: {
      token: token.value,
    }
  })
}
*/

/*
const onSubmit = async () => {
  try {
    formState.loadingSubmit = true
    const response = await AccountServices.aktivasiToken({ id: props.data?.id, token: token.value })

    if (response) {
      formState.loadingSubmit = false
      toast.success({
        title: "Aktivasi Akun Berhasil",
        text: `Silahkan Login Menggunakan Akun yang telah didaftarkan`,
      })
      handleNavigateToLogin()
    }
  } catch (error) {
    formState.loadingSubmit = false
    toast.error({ error })
  }
}
*/

</script>

<template>
  <div>
    <h4 class="mb-0 fs-6 fw-bolder lh-base"><span class="text-primary">Halo</span> <strong class="text-secondary">{{
      props.data?.nama || props.data.email }}</strong></h4>

    <hr />

    <h2 class="mb-3 fs-7 fw-bolder lh-base">
      Ada Undangan <br /> dari {{ appConfig.app.appName }} 🥳
    </h2>

    <p class="mb-2">
      Anda telah diundang menjadi <strong>User</strong> <span v-if="props.data?.organisasi?.nama">di {{
        props.data?.organisasi?.nama }}</span>.
    </p>

    <p class="mb-7">
      Untuk mengaktivasi dan mengkonfigurasi password akun, Silahkan tekan tombol Aktivasi & Konfigurasi Password Akun
      untuk memulai atau menggunakan aplikasi
      {{ appConfig.app.appName }}
    </p>

    <BaseButton @click="handleNavigateToConfigPassword" class="btn btn-primary w-100"
      title="Aktivasi & Konfigurasi Password Akun">
      <template #icon-right>
        <TablerIcon icon="CircleChevronRightIcon" />
      </template>
    </BaseButton>
  </div>
</template>