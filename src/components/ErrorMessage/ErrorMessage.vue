<script setup>

const props = defineProps({
  errors: {
    type: [String, Array],
    required: true,
  },
  onlyShowOne: {
    type: Boolean,
    default: false
  },
  class: {
    type: [String, Object, String],
    default: 'text-danger pt-1'
  }
})
</script>

<template>
  <!-- This is for Vuelidators Errors Message -->
  <div v-if="Array.isArray(props.errors) && props.errors.length">
    <template v-if="!props.onlyShowOne">
      <div v-for="(error, index) of props.errors" :key="`errors-${index}`">
        <div :class="props.class">
          {{ error.$message }}
        </div>
      </div>
    </template>

    <template v-else>
      <div :class="props.class">
        {{ props.errors[0].$message }}
      </div>
    </template>

    <!-- This is for Normal String Errors Message -->
    <div v-if="typeof props.errors === 'string'">
      <div :class="props.class">{{ props.errors }}</div>
    </div>
  </div>

  <div v-else>
    <div v-if="typeof props.errors === 'string'" :class="props.class">{{ props.errors }}</div>
  </div>
</template>