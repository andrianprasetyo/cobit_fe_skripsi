<script setup>
import { ref, watch } from 'vue'
import debounce from "lodash.debounce";
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

const props = defineProps({
  value: String,
  type: { type: String, default: 'text' },
  placeholder: String
})

const state = ref({
  internalValue: '',
  touched: false
})

const emit = defineEmits(['input', 'update:value'])

const updateInternalValue = (event) => {
  state.value.touched = true
  updateValue(event.target.value)
};

const updateValue = debounce((value) => {
  state.value.touched = false;
  emit('input', value);
  emit('update:value', value);
}, 500);

watch(() => props.value, (value) => {
  if (!state.value.touched) state.value.internalValue = value
})

</script>

<template>
  <div class="position-relative">
    <input class="form-control ps-5" :type="type" v-model="state.internalValue" @input="updateInternalValue"
      :placeholder="props.placeholder" v-bind="$attrs" />
    <TablerIcon size="20" icon="SearchIcon" class="position-absolute top-50 start-0 translate-middle-y text-dark ms-3" />
  </div>
</template>