<script setup>
import BaseButton from '@/components/Button/BaseButton.vue'

import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  router.replace("/auth/login")
}
</script>

<template>
  <div>
    <h2 class="mb-3 fs-7 fw-bolder lh-base">Token Tidak Valid <br />atau Kadaluarsa &nbsp;⏲️</h2>

    <p class="mb-9">
      Sepertinya masa aktif token untuk konfirmasi kode sudah kadaluarsa atau
      tidak aktif.

      <br />

      Silahkan hubungi <span class="fw-bolder">Administrator</span> untuk info
      lebih lanjut.
    </p>

    <div class="mt-4">
      <BaseButton @click="handleBack" class="btn btn-primary w-100" title="Kembali" />
    </div>
  </div>
</template>