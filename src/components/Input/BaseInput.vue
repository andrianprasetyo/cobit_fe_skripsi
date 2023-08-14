
<script setup>
import { computed, reactive } from 'vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

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
    default: 'form-control'
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
  }
})

const emit = defineEmits(['update:modelValue'])

const state = reactive({
  isShowPassword: false
})

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const handleToggleShowPassword = () => {
  state.isShowPassword = !state.isShowPassword
}
</script>

<template>
  <div class="d-flex flex-row justify-content-between">
    <label v-if="props.label" :class="props.labelClass" :for="props.id"> {{ props.label }}</label>
    <slot name="extra-label" />
  </div>

  <div class="input-group">
    <input v-bind="$attrs" :id="props.id" :type="state.isShowPassword ? 'text' : props.type"
      :class="[props.class, props.isInvalid ? 'is-invalid' : '']" :disabled="disabled" v-model="value"
      autocomplete="off" />

    <template v-if="props.type === 'password'">
      <div class="input-group-text cursor-pointer" @click="handleToggleShowPassword">
        <TablerIcon :icon="state.isShowPassword ? 'EyeOffIcon' : 'EyeIcon'" />
      </div>
    </template>
  </div>
</template>