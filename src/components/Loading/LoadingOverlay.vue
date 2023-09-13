<script setup>
import { computed } from 'vue'
import Loading from 'vue-loading-overlay'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  isFullPage: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits(['update:active'])

const value = computed({
  get() {
    return props.active
  },
  set(value) {
    emit('update:active', value)
  }
})

</script>

<template>
  <loading v-model:active="value" :is-full-page="props.isFullPage" v-bind="$attrs" />
</template>