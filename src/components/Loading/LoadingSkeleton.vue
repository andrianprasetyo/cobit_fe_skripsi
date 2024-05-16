<script setup>
import { computed } from "vue";

const props = defineProps({
  bgColor: {
    type: String,
    default: "#f2f4f5", // #d3d3d3 Legacy
  },
  shimmerColor: {
    type: String,
    default: "#ffffff",
  },
  duration: {
    type: Number,
    default: 1400,
  },
  direction: {
    type: String,
    default: "left-to-right",
    validator: (value) =>
      ["left-to-right", "right-to-left", "top-to-bottom", "bottom-to-top"].includes(value),
  },
});

function hexToRgb(hexCode) {
  hexCode = hexCode.replace("#", "");
  if (hexCode.length === 3) hexCode = hexCode.split("").map((v) => v + v).join("");
  const [r, g, b] = [0, 2, 4].map((start) => parseInt(hexCode.substr(start, 2), 16));
  return `${r},${g},${b}`;
}

const shimmerGradient = computed(() => {
  const rgb = hexToRgb(props.shimmerColor);
  return `linear-gradient(90deg, rgba(${rgb}, 0) 0%, rgba(${rgb}, 0.1) 20%, rgba(${rgb}, 0.3) 40%, rgba(${rgb}, 0.5) 60%, rgba(${rgb}, 0.3) 80%, rgba(${rgb}, 0.1) 100%)`;
});

const animationDuration = computed(() => `${props.duration}ms`);
</script>

<template>
  <div class="vue3-loading-shimmer" :class="'vue3-loading-shimmer__' + direction" :style="{
    '--vue3-loading-shimmer-bg': props.bgColor,
    '--vue3-loading-shimmer-shimmerBg': shimmerGradient,
    '--vue3-loading-shimmer-duration': animationDuration,
  }" />
</template>

<style scoped>
.vue3-loading-shimmer {
  position: relative;
  overflow: hidden;
  background-color: var(--vue3-loading-shimmer-bg);
}

.vue3-loading-shimmer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: var(--vue3-loading-shimmer-shimmerBg);
  animation: var(--vue3-loading-shimmer-duration) infinite ease-in-out;
}

.vue3-loading-shimmer__left-to-right::before {
  transform: translateX(-100%);
  animation-name: shimmerLeftToRight;
}

.vue3-loading-shimmer__right-to-left::before {
  transform: translateX(100%);
  animation-name: shimmerRightToLeft;
}

.vue3-loading-shimmer__top-to-bottom::before {
  transform: translateY(-100%);
  animation-name: shimmerTopToBottom;
}

.vue3-loading-shimmer__bottom-to-top::before {
  transform: translateY(100%);
  animation-name: shimmerBottomToTop;
}

@keyframes shimmerLeftToRight {
  100% {
    transform: translateX(100%);
  }
}

@keyframes shimmerRightToLeft {
  100% {
    transform: translateX(-100%);
  }
}

@keyframes shimmerTopToBottom {
  100% {
    transform: translateY(100%);
  }
}

@keyframes shimmerBottomToTop {
  100% {
    transform: translateY(-100%);
  }
}
</style>
