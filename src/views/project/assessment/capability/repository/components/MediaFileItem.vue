<script setup>
import { computed } from 'vue'

import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import { formatDateMoments } from "@/utils/momentDateFormat";

import formatBytes from "@/utils/formatBytes";

const props = defineProps({
  name: {
    type: [String, Number]
  },
  size: {
    type: [String, Number]
  },
  lastUpdate: {
    type: [String,]
  }
})

const formatDate = computed(() => {
  return value => {
    return formatDateMoments({ value: value?.value, format: "LLL" })
  }
})


</script>

<template>
  <div class="col-12 col-lg-3 col-md-4">
    <div class="card shadow-none border cursor-pointer hover hovering-zoom">
      <div class="card-img-top bg-dark bg-opacity-10 py-5">
        <div class="d-flex justify-content-center position-relative">
          <TablerIcon :icon="'FileIcon'" size="60" />
        </div>
      </div>

      <div class="card-body pb-1">
        <div class="d-flex justify-content-between align-items-center mb-50">
          <h5 class="mb-25 fw-bolder text-truncate">{{ props.name }}</h5>
        </div>
        <div class="d-flex justify-content-between mb-1">
          <small class="text-muted fw-light text-truncate">
            Ukuran File :
            <span class="fw-bold">
              {{ formatBytes(props.size) }}
            </span>
          </small>
        </div>
        <div class="d-flex justify-content-between">
          <small class="text-muted fw-light text-truncate">
            Terakhir Update :
            <span class="fw-bold">
              {{ formatDate({ value: props.lastUpdate }) }}
            </span>
          </small>
        </div>

        <!-- <div class="mb-50">
          <span class="badge rounded-pill text-capitalize bg-light-dark">
            Status File
          </span>
        </div> -->
      </div>
    </div>
  </div>
</template>'