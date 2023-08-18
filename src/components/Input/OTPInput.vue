<script setup>
import { computed } from 'vue'
import VOtpInput from "vue3-otp-input";

const props = defineProps({
  value: {
    type: String
  },
  inputClasses: {
    type: String,
    default: 'form-control fw-bolder text-uppercase text-center text-primary border-primary otp-input rounded'
  },
  separator: {
    type: String,
    default: ''
  },
  numInputs: {
    type: Number,
    default: 6
  },
  inputType: {
    type: String,
    default: 'letter-numeric'
  },
  placeholder: {
    type: Array,
    default: () => ['_', '_', '_', '_', '_', '_']
  },
  isDisabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'complete']);

const value = computed({
  get: () => props.value,
  set(value) {
    if (typeof value === 'string') {
      emit("update:modelValue", value.toUpperCase());
    } else {
      emit("update:modelValue", value);
    }
  }
})

const handleChange = (value) => {
  if (typeof value === 'string') {
    emit("update:modelValue", value.toUpperCase());
  } else {
    emit("update:modelValue", value);
  }
}

const handleOnComplete = (value) => {
  emit("complete", value);
};

</script>

<template>
  <div class="d-flex flex-row">
    <v-otp-input v-model:value="value" :inputClasses="props.inputClasses" :separator="props.separator"
      :num-inputs="props.numInputs" :should-auto-focus="true" :input-type="props.inputType"
      :placeholder="props.placeholder" :is-disabled="props.isDisabled" @on-change="handleChange"
      @on-complete="handleOnComplete" v-bind="$attrs" />
  </div>
</template>

<style>
.otp-input {
  height: 45px !important;
  width: 45px !important;
  margin-right: 10px;
  margin-bottom: 10px;
  display: inline-block;
  font-weight: 600;
  font-size: 10pt;
  line-height: 100%;
  position: relative;
  z-index: 1;
}

/* Background colour of an input field with value */
.otp-input.is-complete {
  border-color: var(--bs-primary);
}

.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.otp-input::placeholder {
  font-size: 12pt;
  text-align: center;
  font-weight: 600;
}
</style>