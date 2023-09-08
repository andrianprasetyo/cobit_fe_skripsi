<script setup>
const props = defineProps({
  step: {
    type: [Number, String]
  },
  label: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <li role="tab" :class="{
    'current': props.isActive,
    'disabled': props.disabled
  }" aria-disabled="false" aria-selected="true">
    <a :id="`steps-uid-${props.step}-t-0`" :aria-controls="`steps-uid-${props.step}-p-0`" v-bind="$attrs">
      <span class="current-info audible">current step:</span>
      <span class="step cursor-pointer">{{ props.step }}</span> {{ label }}
    </a>
  </li>
</template>