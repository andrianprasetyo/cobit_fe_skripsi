<script setup>
import { computed } from 'vue';

import { useAuth } from '@/stores/auth'

const props = defineProps({
  type: {
    type: String,
    default: "button",
  },
  isLoading: {
    type: [Number, Boolean],
    default: false
  },
  title: {
    type: [String, Number],
  },
  access: {
    type: Array
  },
  class: {
    type: [String, Object, Array],
    default: 'btn btn-primary py-2'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const { access: listAccess } = useAuth()

const isHasAccess = computed(() => {
  if (props.access && Array.isArray(props.access)) {
    for (let i in props.access) {
      let isIncluded = listAccess.includes(props.access[i])

      if (isIncluded) {
        return true
      } else {
        return false
      }
    }

    return false
  }

  return false
})
</script>

<template>
  <button ref="base-button" :type="props.type" v-bind="$attrs" :class="props.class"
    :disabled="(access && !isHasAccess) || props.disabled">
    <div v-if="props.isLoading" class="spinner-border spinner-border-sm" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>

    <div v-else>
      <slot name="icon-left" />
      <slot />
      {{ props.title }}
      <slot name="icon-right" />
    </div>
  </button>
</template>