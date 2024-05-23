<script setup>
import { computed } from 'vue';
import TablerIcon from '../TablerIcon/TablerIcon.vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  },
  class: {
    type: String,
    default: 'p-2 rounded-1 d-flex align-items-center justify-content-center',
  },
  icon: {
    type: String,
    default: ''
  },
  size: {
    type: [String],
    default: '18'
  }
})

const chipClass = computed(() => {
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
  <div :class="`${props.class} ${chipClass}`">
    <TablerIcon v-if="props.icon" :icon="props.icon" :size="props.size" />
    <slot v-else name="icon" />
    <slot />
  </div>
</template>