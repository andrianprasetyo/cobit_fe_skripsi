<script setup>
import { computed } from 'vue';

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
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: ""
  },
  value: {
    type: [String, Number, Boolean],
    default: ''
  },
  trueValue: {
    type: [String, Number, Boolean],
    default: true
  },
  falseValue: {
    type: [String, Number, Boolean],
    default: false
  }
})

const slots = defineSlots()

const emit = defineEmits(['update:modelValue']);

/* -------------------------------- COMPUTED -------------------------------- */
const isChecked = computed(() => {
  if (props.modelValue instanceof Array) {
    return props.modelValue.includes(props.value);
  }
  return props.modelValue === props.trueValue;
});

/* --------------------------------- METHODS -------------------------------- */
const updateInput = (event) => {
  const isChecked = event.target.checked;
  if (props.modelValue instanceof Array) {
    const newValue = [...props.modelValue];
    if (isChecked) {
      newValue.push(props.value);
    } else {
      newValue.splice(newValue.indexOf(props.value), 1);
    }
    emit('update:modelValue', newValue);
  } else {
    emit('update:modelValue', isChecked ? props.trueValue : props.falseValue);
  }
};
</script>

<template>
  <div class="form-check">
    <input :id="props.id" type="checkbox" :class="[props.class, props.isInvalid ? 'is-invalid' : '']"
      :disabled="disabled" :checked="isChecked" :value="value" @change="updateInput" v-bind="$attrs" />
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
