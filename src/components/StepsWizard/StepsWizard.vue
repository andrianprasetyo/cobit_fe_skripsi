<script setup>
const props = defineProps({
  class: {
    type: [Object, String, Array],
    default: 'validation-wizard wizard-circle mt-5 wizard clearfix'
  }
})
</script>

<template>
  <div class="wizard-content">
    <div :class="props.class" role="application">
      <div class="steps clearfix">
        <ul role="tablist">
          <slot name="header" />
        </ul>
      </div>

      <div class="content clearfix">
        <slot name="content" />

      </div>
    </div>
  </div>
</template>