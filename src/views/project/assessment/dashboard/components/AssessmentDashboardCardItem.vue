<script setup>
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue'

const slots = defineSlots()

const props = defineProps({
  title: {
    type: String,
    default: 'Postingan'
  },
  value: {
    type: [String, Number],
    default: 0
  },
  variant: {
    type: String,
    default: 'primary'
  },
  class: {
    type: [String, Object, Array],
    default: 'col-12 col-md-3 d-flex align-items-strech'
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div :class="props.class">
    <div class="card w-100">
      <div class="card-body">
        <div :class="`p-2 bg-light-${props.variant} rounded-2 d-inline-block mb-3`">
          <slot v-if="slots['icon']" name="icon" />

          <TablerIcon v-else icon="PinIcon" size="24" :class="`text-${props.variant}`" />
        </div>

        <template v-if="props.isLoading">
          <LoadingSpinner :is-center="false" size="small" class="mb-2" />
        </template>

        <template v-else>
          <h4 class="mb-1 fw-semibold d-flex align-content-center text-truncate">
            {{ props.value }}
          </h4>
        </template>

        <p class="mb-0">{{ props.title }}</p>
      </div>
    </div>
  </div>
</template>
