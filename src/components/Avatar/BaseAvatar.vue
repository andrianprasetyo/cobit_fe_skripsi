<script setup>
const props = defineProps({
  source: {
    type: String,
    default: '/assets/images/profile/avatar-default.png'
  },
  width: {
    type: [String, Number],
    default: 80
  },
  height: {
    type: [String, Number],
    default: 80
  }
})

const replaceImgDefault = (e) => {
  e.target.src = '/assets/images/profile/avatar-default.png'
}

</script>

<template>
  <img :src="props.source" class="rounded-circle" :width="props.width" :height="props.height" style="object-fit: contain;"
    alt="avatar" @error="replaceImgDefault">
</template>