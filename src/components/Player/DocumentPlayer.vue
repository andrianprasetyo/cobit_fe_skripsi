<script setup>
import { computed, reactive } from 'vue';

import LoadingSkeleton from '@/components/Loading/LoadingSkeleton.vue'
import NoOptions from '@/components/EmptyPlaceholder/NoOptions.vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  }
})

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const playerState = reactive({
  loading: false,
  error: false
})

const sourceURL = computed(() => `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(props.src)}`)

/* --------------------------------- METHODS -------------------------------- */
const handleOnLoad = () => {
  playerState.loading = false
}

const handleOnError = () => {
  playerState.loading = false
  playerState.error = true
}
</script>

<template>
  <LoadingSkeleton v-if="playerState.loading" class="skeleton-player-iframe" />
  <iframe v-else-if="!playerState.loading && !playerState.error" title="Document Player" class="document-player-iframe"
    :src="sourceURL" @load="handleOnLoad" @error="handleOnError" v-bind="$attrs" />
  <template v-else-if="!playerState.loading && playerState.error">
    <NoOptions title="Terjadi Kesalahan Dalam Memuat" />
  </template>
</template>

<style scoped>
.skeleton-player-iframe {
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
}

.document-player-iframe {
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  border: none;
  background-color: #ddd;
}
</style>