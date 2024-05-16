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
</script>

<template>
  <span class="badge" :class="[badgeClass, props.isRounded ? 'rounded-pill' : '', props.class]" v-bind="$attrs">
    {{ props.title }}
  </span>
</template>
