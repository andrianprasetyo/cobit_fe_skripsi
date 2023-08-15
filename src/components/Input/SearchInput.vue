<script setup>
import { computed, ref } from 'vue'
import debounce from 'lodash.debounce'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  isShowSearchIcon: {
    type: Boolean,
    default: true
  }
})

const query = ref('')

const value = computed({
  get: () => query.value,
  set: debounce((value) => {
    query.value = value
    emit('update:modelValue', value)
  }, 500)
})

</script>

<template>
  <div class="position-relative">
    <input class="form-control ps-5" :type="type" v-model="value" :placeholder="props.placeholder" v-bind="$attrs" />
    <TablerIcon v-if="props.isShowSearchIcon" size="20" icon="SearchIcon"
      class="position-absolute top-50 start-0 translate-middle-y text-dark ms-3" />
  </div>
</template>