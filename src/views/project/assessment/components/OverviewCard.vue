<script setup>
/*
const props = defineProps({
  heading: {
    type: String,
  },
})
*/
</script>

<template>
  <div class="col-12 col-md-12" v-bind="$attrs">
    <div class="card rounded-3">
      <div class="card-header">
        <slot name="header" />
      </div>
      <div class="card-body">
        <div class="d-flex align-items-baseline">
          <span class="flex-shrink-0">
            <slot name="icon" />
          </span>
          <div class="ms-4 w-100">
            <slot name="body" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>