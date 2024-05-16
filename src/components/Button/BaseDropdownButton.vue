<script setup>
import { computed } from 'vue';

import { useAuth } from '@/stores/auth'

const props = defineProps({
  title: {
    type: String,
  },
  type: {
    type: String,
    default: "button",
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  classNameGroup: {
    type: String,
  },
  class: {
    type: String,
    default: "btn btn-primary waves-effect",
  },
  dropdownToggleClass: {
    type: String,
    default:
      "btn btn-primary dropdown-toggle dropdown-toggle-split",
  },
  access: {
    type: Array,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: 'btn-dropdown'
  }
})

const auth = useAuth()

const isHasAccess = computed(() => {
  if (props.access && Array.isArray(props.access)) {
    for (let i in props.access) {
      let isIncluded = auth.access.includes(props.access[i])

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
  <div class="btn-group" :class="[props.classNameGroup]">
    <button ref="base-dropdown-button" :type="props.type" :class="props.class"
      :disabled="(access && !isHasAccess) || props.disabled" v-bind="$attrs">
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
    <button @click.stop :id="props.id" :disabled="props.isLoading || (props.access && !isHasAccess) || props.isLoading"
      type="button" :class="props.dropdownToggleClass" data-bs-toggle="dropdown" aria-expanded="false">
      <span class="visually-hidden">Toggle Dropdown</span>
    </button>
    <div class="dropdown-menu dropdown-menu-end">
      <slot name="dropdown"></slot>
    </div>
  </div>
</template>