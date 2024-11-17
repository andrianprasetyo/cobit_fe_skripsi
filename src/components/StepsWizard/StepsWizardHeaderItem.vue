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
  isCompleted: {
    type: Boolean,
    defalt: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const slots = defineSlots()

</script>

<template>
  <li role="tab" :class="{
    'current': props.isActive,
    'done': props.isCompleted,
    'disabled': props.disabled
  }" aria-disabled="false" aria-selected="true">
    <a :id="`steps-uid-${props.step}-t-0`" :aria-controls="`steps-uid-${props.step}-p-0`">
      <span class="current-info audible">current step:</span>
      <slot v-if="slots['step']" v-bind="$attrs" name="step" />
      <span v-else v-bind="$attrs" class="step cursor-pointer">
        {{ props.step }}
      </span>

      <slot v-if="slots['label']" name="label" />

      <div v-else>
        <span class="fw-bolder">
          {{ label }}
        </span>
      </div>
      <slot></slot>
    </a>
  </li>
</template>