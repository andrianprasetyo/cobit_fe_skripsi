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
  isCapitalize: {
    type: Boolean,
    default: false
  }
})

const badgeClass = computed(() => {
  if (props.variant === 'primary') {
    return 'bg-light-primary text-primary'
  } else if (props.variant === 'secondary') {
    return 'bg-light-secondary text-secondary'
  } else if (props.variant === 'success') {
    return 'bg-light-success text-success'
  } else if (props.variant === 'warning') {
    return 'bg-light-warning text-warning'
  } else if (props.variant === 'danger') {
    return 'bg-light-danger text-danger'
  } else if (props.variant === 'info') {
    return 'bg-light-info text-info'
  } else if (props.variant === 'disable') {
    return 'bg-light-dark text-dark'
  } else {
    return 'bg-dark text-white'
  }
})
</script>

<template>
  <span class="badge"
    :class="[badgeClass, props.isRounded ? 'rounded-pill' : '', props.isCapitalize ? 'text-capitalize' : '']"
    v-bind="$attrs">
    {{ props.title }}
    <slot />
  </span>
</template>
