<script setup>
import { computed } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps({
  uid: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: [String, Number]
  },
  labelClass: {
    type: [String, Object, Array],
    default: 'form-label'
  },
  inputClass: {
    type: [String, Object, Array],
    default: 'form-control input-vue-datepicker'
  },
  autoApply: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: 'Silahkan pilih tanggal'
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
    type: [String, Number, Object]
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

const inputClass = computed(() => {
  if (props.isInvalid) {
    return `${props.inputClass} is-invalid`
  } else {
    return props.inputClass
  }
})

</script>

<template>
  <div class="d-flex flex-row justify-content-between">
    <label v-if="props.label" :class="props.labelClass" :for="props.uid"> {{ props.label }}</label>
    <slot name="extra-label" />
  </div>

  <div class="input-group">
    <VueDatePicker :uid="props.uid" :input-class-name="inputClass" v-model="value" :disabled="props.disabled"
      :placeholder="props.placeholder" :auto-apply="props.autoApply" autocomplete="off" v-bind="$attrs">
    </VueDatePicker>
  </div>
</template>

<style>
.input-vue-datepicker {
  /*General*/
  --dp-font-family: 'Plus Jakarta Sans', -apple-system, blinkmacsystemfont, 'Segoe UI', roboto,
    oxygen, ubuntu, cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
  --dp-border-radius: 4px;
  /*Configurable border-radius*/
  --dp-cell-border-radius: 4px;
  /*Specific border radius for the calendar cell*/
  --dp-common-transition: all 0.1s ease-in;
  /*Generic transition applied on buttons and calendar cells*/

  /*Sizing*/
  --dp-button-height: 35px;
  /*Size for buttons in overlays*/
  --dp-month-year-row-height: 35px;
  /*Height of the month-year select row*/
  --dp-month-year-row-button-size: 35px;
  /*Specific height for the next/previous buttons*/
  --dp-button-icon-height: 20px;
  /*Icon sizing in buttons*/
  --dp-cell-size: 35px;
  /*Width and height of calendar cell*/
  --dp-cell-padding: 5px;
  /*Padding in the cell*/
  --dp-common-padding: 10px;
  /*Common padding used*/
  --dp-input-icon-padding: 35px;
  /*Padding on the left side of the input if icon is present*/
  --dp-input-padding: 8px 16px !important;
  /*Padding in the input*/
  --dp-menu-min-width: 260px;
  /*Adjust the min width of the menu*/
  --dp-action-buttons-padding: 2px 5px;
  /*Adjust padding for the action buttons in action row*/
  --dp-row-maring: 5px 0;
  /*Adjust the spacing between rows in the calendar*/
  --dp-calendar-header-cell-padding: 0.5rem;
  /*Adjust padding in calendar header cells*/
  --dp-two-calendars-spacing: 10px;
  /*Space between multiple calendars*/
  --dp-overlay-col-padding: 3px;
  /*Padding in the overlay column*/
  --dp-time-inc-dec-button-size: 32px;
  /*Sizing for arrow buttons in the time picker*/
  --dp-menu-padding: 6px 8px;
  /*Menu padding*/

  /*Font sizes*/
  --dp-font-size: 0.875rem;
  /*Default font-size*/
  --dp-preview-font-size: 0.875rem;
  /*Font size of the date preview in the action row*/
  --dp-time-font-size: 0.875rem;
  /*Font size in the time picker*/

  /*Transitions*/
  --dp-animation-duration: 0.1s;
  /*Transition duration*/
  --dp-menu-appear-transition-timing: cubic-bezier(0.4, 0, 1, 1);
  /*Timing on menu appear animation*/
  --dp-transition-timing: ease-out;
  /*Timing on slide animations*/
}

.dp__theme_light {
  --dp-background-color: #ffffff;
  --dp-text-color: #212121;
  --dp-hover-color: #f3f3f3;
  --dp-hover-text-color: #212121;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #203058;
  --dp-primary-text-color: #f8f5f5;
  --dp-secondary-color: #c0c4cc;
  --dp-border-color: #ddd;
  --dp-menu-border-color: #ddd;
  --dp-border-color-hover: #aaaeb7;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #13deb9;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: #959595;
  --dp-danger-color: #ea5455;
  --dp-highlight-color: rgba(25, 118, 210, 0.1);
}
</style>