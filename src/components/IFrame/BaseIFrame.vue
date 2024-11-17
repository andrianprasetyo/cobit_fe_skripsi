<script setup>
import { ref } from 'vue';

import NoData from '@/components/EmptyPlaceholder/NoData.vue'

const props = defineProps({
  url: {
    type: String,
  }
})

const isError = ref(false);

function handleIframeError() {
  isError.value = true;
}

</script>

<template>
  <div class="ratio ratio-1x1">
    <iframe v-if="!isError" class="rounded" allowfullscreen :src="props.url || ''" @error="handleIframeError" />


    <div v-else>
      <NoData title="Terjadi Kesalahan Dalam Memuat" />
    </div>
    <slot />
  </div>
</template>