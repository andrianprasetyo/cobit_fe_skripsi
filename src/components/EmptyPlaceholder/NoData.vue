<script setup>

const props = defineProps({
  source: {
    type: String,
    default: '/assets/images/illustrations/no-data.svg'
  },
  title: {
    type: String,
    default: "Tidak Ada Data Tersedia"
  },
  isShowTitle: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div class="my-3 d-flex flex-column justify-content-between align-items-center">
    <img :src="props.source" alt="No Data" width="250" v-bind="$attrs" />

    <h5 v-if="props.isShowTitle" class="mt-3 text-center">{{ props.title }}</h5>
  </div>
</template>