<script setup>
const props = defineProps({
  nama: {
    type: String
  },
  deskripsi: {
    type: String
  }
})
</script>

<template>
  <div v-if="props.nama" class="card">
    <div class="card-header bg-primary">
      <h5 class="card-title text-white mb-0 fw-semibold">{{ props.nama }}</h5>
    </div>
    <div class="card-body">
      <div v-html="props.deskripsi" />
    </div>
  </div>
</template>