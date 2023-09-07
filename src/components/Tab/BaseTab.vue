<script setup>
const props = defineProps({
  class: {
    type: [Array, String],
    default: 'nav nav-tabs user-profile-tab'
  },
})
</script>

<template>
  <ul :class="props.class" id="pills-tab" role="tablist">
    <slot name="tab-navigation" />
  </ul>

  <div class="card-body">
    <div class="tab-content" id="pills-tabContent">
      <slot name="tab-content" />
    </div>
  </div>
</template>