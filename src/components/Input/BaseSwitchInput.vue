<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  },
  direction: {
    type: String,
    default: 'vertical'
  },
  labelColumn: {
    type: String,
    default: 'col-12 col-md-3'
  },
  inputColumn: {
    type: String,
    default: 'col-12 col-md-9'
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
    default: 'form-control'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isInvalid: {
    type: [Boolean, Number],
    default: false
  },
  modelValue: {
    type: [Boolean, String]
  },
  width: {
    type: Number,
    default: 3
  },
  height: {
    type: Number,
    default: 1.5
  },
  isChecked: {
    type: Boolean,
    default: false
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  activeText: {
    type: String
  },
  inActiveText: {
    type: String
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
    <label v-if="props.label" :class="props.labelClass" :for="props.id">
      {{ props.label }} <span v-if="props.isRequired" class="text-danger"> * </span></label>
    <slot name="extra-label" />
  </div>

  <div class="input-group">
    <div class="form-check form-switch d-flex flex-row align-items-center justify-content-center">
      <input :class="[props.class, props.isInvalid ? 'is-invalid' : 'form-check-input']" type="checkbox" role="switch"
        :id="props.id" v-model="value" :disabled="disabled" v-bind="$attrs" :checked="!!value"
        :style="`width: ${width}em; height: ${height}em`" />
      <slot name="extra-input-group" />

      <label v-if="props.activeText && !!value" class="form-check-label ms-2" :for="props.id">
        {{ props.activeText }}
      </label>
      <slot v-else-if="$slots['active-text']" name="active-text" />

      <label v-if="props.inActiveText && !!!value" class="form-check-label ms-2" :for="props.id">
        {{ props.inActiveText }}
      </label>
      <slot v-else-if="$slots['inactive-text']" name="inactive-text" />
    </div>
  </div>
</template>
