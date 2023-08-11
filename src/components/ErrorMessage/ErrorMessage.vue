<script setup>

const props = defineProps({
  errors: {
    type: [String, Array],
    required: true,
  },
  onlyShowOne: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <!-- This is for Vuelidators Errors Message -->
  <div v-if="Array.isArray(props.errors) && props.errors.length">
    <template v-if="!props.onlyShowOne">
      <div v-for="(error, index) of props.errors" :key="`errors-${index}`">
        <div class="text-danger pt-1">
          {{ error.$message }}
        </div>
      </div>
    </template>

    <template v-else>
      <div class="text-danger pt-1">
        {{ props.errors[0].$message }}
      </div>
    </template>

    <!-- This is for Normal String Errors Message -->
    <div v-if="typeof props.errors === 'string'">
      <div class="text-danger pt-1">{{ props.errors }}</div>
    </div>
  </div>
</template>