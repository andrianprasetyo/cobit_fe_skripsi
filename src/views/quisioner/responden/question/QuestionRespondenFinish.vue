<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

</script>

<template>
  <div class="d-flex flex-column align-items-center">
    <img :src="route.meta?.background_picture" alt="illustration" width="350" class="img-fluid">
    <h1 class="fw-semibold mb-7 fs-9 mt-4">Kuesioner Selesai 🎉</h1>
    <h4 class="fw-semibold mb-3 text-center">Selamat! Anda Telah Menyelesaikan Kuesioner yang diberikan</h4>
    <p class="text-center mb-7">Mohon menunggu info hasil kuesioner dari team kami berdasarkan pertanyaan atau kuesioner
      <br /> yang sudah anda isi ataupun jawab sebelumnya. Terima Kasih.
    </p>
    <RouterLink to="/" class="btn btn-primary">
      Kembali ke Halaman Awal
    </RouterLink>
  </div>
</template>