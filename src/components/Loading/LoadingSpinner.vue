<script setup>

const props = defineProps({
  isAbsolute: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
  },
  size: {
    type: String,
  },
  isCenter: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div class="text-primary" :class="[
    props.isAbsolute ? 'position-absolute top-50 start-50 translate-middle ' : '',
    props.isCenter ? 'text-center' : '',
    props.class ? `${props.class}` : '',
  ]">
    <div class="spinner-border" :class="[props.size === 'small' ? 'spinner-border-sm' : '']" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>