<script setup>
import * as icons from 'vue-tabler-icons'

const props = defineProps({
  icon: { required: true, type: [String, Object] },
  size: { type: String, default: "18" },
  badge: { type: [String, Object, Number], default: null },
  badgeClasses: { type: [String, Object, Array], default: "bg-primary" },
  strokeWidth: { type: [String, Number], default: 2 }
});

</script>

<template>
  <span class="position-relative">
    <component :is="icons[props.icon]" :size="size" :stroke-width="strokeWidth" stroke="currentColor" v-bind="props" />
    <span v-if="badge" class="badge rounded-pill badge-up" :class="badgeClasses">{{ badge }}</span>
  </span>
</template>

<style scoped>
.badge-up {
  width: 18px;
  height: 18px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 16px;
  right: -6px;
  font-size: 10px;
  font-weight: bold;
}
</style>