<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

</script>

<template>
  <div class="position-relative overflow-hidden min-vh-100 d-flex align-items-center justify-content-center">
    <div class="d-flex align-items-center justify-content-center w-100">
      <div class="row justify-content-center w-100">
        <div class="col-lg-4">
          <div class="text-center">
            <img :src="route.meta?.background_picture" alt="illustration" width="400" class="img-fluid">
            <h1 class="fw-semibold mb-7 fs-9 mt-4">Oops!!!</h1>
            <h4 class="fw-semibold mb-7">Sepertinya halaman yang anda cari <br /> tidak ditemukan.</h4>
            <RouterLink to="/" class="btn btn-primary">
              Kembali ke Halaman Awal
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
