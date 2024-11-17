<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: [String, Number],
    required: true
  },
  variant: {
    type: String,
    default: 'primary'
  },
  isRounded: {
    type: Boolean,
    default: true
  },
  class: {
    type: String,
  },
  size: {
    type: String,
    default: 'medium'
  }
})

const badgeClass = computed(() => {
  if (props.variant === 'primary') {
    return 'bg-primary'
  } else if (props.variant === 'secondary') {
    return 'bg-secondary'
  } else if (props.variant === 'success') {
    return 'bg-success'
  } else if (props.variant === 'warning') {
    return 'bg-warning'
  } else if (props.variant === 'danger') {
    return 'bg-danger'
  } else if (props.variant === 'info') {
    return 'bg-info'
  } else {
    return 'bg-dark text-white'
  }
})

const sizeClass = computed(() => {
  if (props.size === 'large') {
    return 'fs-6'
  } else if (props.size === 'medium') {
    return 'fs-2'
  } else if (props.size === 'small') {
    return 'fs-1'
  } else {
    return ''
  }
})
</script>

<template>
  <span class="badge" :class="[badgeClass, sizeClass, props.isRounded ? 'rounded-pill' : '', props.class]" v-bind="$attrs">
    {{ props.title }}
  </span>
</template>
