<script setup>
import Spinner from '@/components/Loading/LoadingSpinner.vue';


const props = defineProps({
  value: {
    type: [String, Number],
    default: 0
  },
  label: {
    type: String,
  },
  variant: {
    type: String,
    default: "primary",
  },
  classContainer: {
    type: String,
    default: 'col-lg-4 col-md-6'
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  isShowIcon: {
    type: Boolean,
    default: true
  },
  isCustomSlotValue: {
    type: Boolean,
    default: false
  }
})


</script>

<template>
  <div :class="props.classContainer">
    <div class="card">
      <div class="card-body">
        <div class="d-flex flex-row align-items-center">
          <div v-if="props.isShowIcon"
            :class="`round-40 rounded-circle text-white d-flex align-items-center justify-content-center bg-${props.variant}`">
            <slot name="icon" />
          </div>
          <div class="ms-3 align-self-center">
            <template v-if="props.isLoading">
              <Spinner class="text-start mb-50" size="small" />
            </template>

            <template v-else>
              <slot v-if="props.isCustomSlotValue" name="value" />
              <h3 v-else class="mb-0 fs-6">{{ props.value }}</h3>

              <span class="text-muted">{{ props.label }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>