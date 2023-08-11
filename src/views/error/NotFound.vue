<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="position-relative overflow-hidden min-vh-100 d-flex align-items-center justify-content-center">
    <div class="d-flex align-items-center justify-content-center w-100">
      <div class="row justify-content-center w-100">
        <div class="col-lg-4">
          <div class="text-center">
            <img
              src="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/dist/images/backgrounds/errorimg.svg"
              alt="" class="img-fluid">
            <h1 class="fw-semibold mb-7 fs-9">Oops!!!</h1>
            <h4 class="fw-semibold mb-7">Sepertinya halaman yang anda cari tidak ada.</h4>
            <RouterLink to="/" class="btn btn-primary">
              Kembali ke Halaman Awal
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
