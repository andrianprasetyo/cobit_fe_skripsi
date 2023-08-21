
<script setup>
import { computed } from 'vue'

const slots = defineSlots()
const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  label: {
    type: [String, Number]
  },
  labelClass: {
    type: [String, Object, Array],
    default: 'form-label'
  },
  class: {
    type: [String, Object, Array],
    default: 'form-select'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isInvalid: {
    type: [Boolean, Number],
    default: false,
  },
  modelValue: {
    type: [Number, String,]
  },
  defaultOption: {
    type: String,
  },
  options: {
    type: Array,
    default: () => []
  },
  optionsLabel: {
    type: String,
    default: 'label'
  },
  optionsValue: {
    type: String,
    default: 'value'
  }
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <div class="d-flex flex-row justify-content-between">
    <label v-if="props.label" :class="props.labelClass" :for="props.id"> {{ props.label }}</label>
    <slot name="extra-label" />
  </div>

  <div class="input-group">
    <select v-bind="$attrs" :class="[props.class, props.isInvalid ? 'is-invalid' : '']" :disabled="disabled"
      v-model="value">
      <option value="">
        {{ props.defaultOption }}
      </option>

      <slot v-if="slots['options']" name="options" />

      <template v-else-if="!slots['options'] && Array.isArray(props.options) && props.options.length">
        <option v-for="(item, index) in props.options" :key="`base-select-${index}-${props.id}`"
          :value="item[props.optionsValue]">
          {{ item[props.optionsLabel] }}
        </option>
      </template>
    </select>
  </div>
</template>