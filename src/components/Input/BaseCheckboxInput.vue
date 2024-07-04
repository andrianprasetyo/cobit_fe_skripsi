<script setup>
const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  },
  label: {
    type: [String, Number]
  },
  labelClass: {
    type: [String, Object, Array],
    default: 'form-check-label'
  },
  class: {
    type: [String, Object, Array],
    default: 'form-check-input'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isInvalid: {
    type: [Boolean, Number],
    default: false
  },
  checked: {
    type: Boolean,
    default: false
  },
})

const slots = defineSlots()
</script>

<template>
  <div class="form-check">
    <input :id="props.id" type="checkbox" :class="[props.class, props.isInvalid ? 'is-invalid' : '']"
      :disabled="disabled" :checked="props.checked" />
    <slot v-if="slots['label']" name="label" />

    <label v-else-if="!slots['label'] && props.label" :class="props.labelClass" :for="props.id">
      <span :class="{
      'text-danger': props.isInvalid
    }">
        {{ props.label }}
      </span>
    </label>
  </div>
</template>
