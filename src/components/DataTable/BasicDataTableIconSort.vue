<script setup>
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

const emits = defineEmits(['onDesc', 'onAsc', 'onReset'])

const props = defineProps({
  sortType: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <TablerIcon v-if="!props.sortType || !props.isActive" icon="ArrowsSortIcon"
    class="ms-1 mb-0 cursor-pointer" @click="emits('onAsc')" />
  <TablerIcon v-else-if="props.sortType.toUpperCase() === 'ASC' && props.isActive" icon="SortAscendingIcon"
    class="ms-1 mb-0 cursor-pointer" @click="emits('onDesc')" />
  <TablerIcon v-else-if="props.sortType.toUpperCase() === 'DESC' && props.isActive" icon="SortDescendingIcon"
    class="ms-1 mb-0 cursor-pointer" @click="emits('onReset')" />
</template>