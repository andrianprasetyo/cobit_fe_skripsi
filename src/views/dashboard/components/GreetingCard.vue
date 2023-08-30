<script setup>
import { greeting } from '@/utils/momentDateFormat'

import { useAuth } from '@/stores/auth'

const auth = useAuth()

</script>

<template>
  <div class="card w-100 bg-light-primary overflow-hidden shadow-none">
    <div class="card-body position-relative overflow-hidden">
      <div class="row">
        <div class="col-12 col-md-9 d-flex flex-column justify-content-center">
          <div class="d-flex align-items-center mb-3">
            <h5 class="fw-semibold mb-0 fs-5">{{ greeting() }}</h5>
          </div>
          <div class="d-flex align-items-center">
            <h3 class="mb-1 fw-semibold fs-8 d-flex align-content-center text-primary">
              {{ auth.account?.nama || auth.account?.email }} 👋</h3>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="text-center mt-1">
            <img src="/assets/images/illustrations/high-five.svg" alt="image" height="150" class="mb-n4">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>