<script setup>
import { withCtx } from 'vue';
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  icon: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    default: null,
  },
  text: {
    type: String,
    default: null,
  },
  hideClose: {
    type: Boolean,
    default: false,
  },
});

const emitCloseToast = () => {
  withCtx((context) => {
    context.emit('close-toast');
  });
};
</script>

<template>
  <div class="toastification">
    <div class="d-flex align-items-center">
      <div class="mr-2 flex-shrink-0 me-3">
        <TablerIcon v-if="props.icon" :icon="props.icon" size="20" />
      </div>

      <div class="d-flex flex-grow-1">
        <div>
          <h5 v-if="title" class="mb-0 fw-bold toastification-font-size toastification-title text-white"
            :class="`text-${variant}`" v-text="title" />
          <small v-if="text" class="d-inline-block toastification-font-size text-white" v-text="text" />
        </div>

        <span class="cursor-pointer toastification-close-icon ms-auto" @click="emitCloseToast">
          <tabler-icon v-if="!hideClose" icon="XIcon" class="text-white" />
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toastification-close-icon,
.toastification-title {
  line-height: 1.5;
}

.toastification-title {
  color: inherit;
}

.toastification-font-size {
  font-size: 14px;
  font-family: "Plus Jakarta Sans"
}
</style>