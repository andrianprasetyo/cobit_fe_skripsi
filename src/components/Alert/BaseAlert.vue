<script setup>
import { computed } from 'vue'

import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'success',
  },
  classContainer: {
    type: String
  },
  classBody: {
    type: String
  }
})

const variantClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'alert-primary';
    case 'success':
      return 'alert-success';
    case 'danger':
      return 'alert-danger';
    case 'info':
      return 'alert-info';
    case 'warning':
      return 'alert-warning';
    case 'dark':
      return 'alert-dark';
    default:
      return 'alert-success';
  }
})

const variantTextClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'text-primary';
    case 'success':
      return 'text-success';
    case 'danger':
      return 'text-danger';
    case 'info':
      return 'text-info';
    case 'warning':
      return 'text-warning';
    case 'dark':
      return 'text-dark';
    default:
      return 'text-success';
  }
})

const variantIcon = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'InfoCircleIcon';
    case 'success':
      return 'InfoCircleIcon';
    case 'danger':
      return 'AlertTriangleIcon';
    case 'info':
      return 'InfoCircleIcon';
    case 'warning':
      return 'AlertCircleIcon';
    case 'dark':
      return 'InfoCircleIcon';
    default:
      return 'CircleCheckIcon';
  }
})
</script>

<template>
  <div class="alert alert-dismissible fade show remove-close-icon" :class="[variantClass, props.classContainer]"
    role="alert">
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    <div class="d-flex align-items-center font-medium me-3 me-md-0" :class="[classBody]">
      <TablerIcon :icon="variantIcon" class="fs-5 me-2" :class="[variantTextClass]" />
      <slot />
    </div>
  </div>
</template>