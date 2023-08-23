<script setup>
const props = defineProps({
  heading: {
    type: String,
  },
})
</script>

<template>
  <div class="col-12 col-md-6 col-lg-4" v-bind="$attrs">
    <div class="card rounded-3">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <span class="flex-shrink-0">
            <slot name="icon" />
          </span>
          <div class="ms-4">
            <h4 class="card-title text-dark">{{ props.heading }}</h4>
            <slot name="body" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>