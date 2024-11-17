<script setup>
import { reactive, computed, onMounted } from 'vue'

import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import SummaryCard from '@/views/dashboard/components/SummaryCard.vue'

import { useRoute } from 'vue-router'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const assessmentStore = useAssessmentStore()
const route = useRoute()

/* ---------------------------------- STATE --------------------------------- */
const summary = reactive({
  loading: false,
  data: {
    total: 0,
    not_yet: 0,
    on_process: 0,
    done: 0,
    outstanding: 0
  }
})

/* -------------------------------- COMPUTED -------------------------------- */
const assessmentId = computed(() => {
  return route.params?.id
})

/* --------------------------------- METHODS -------------------------------- */
const getSummaryStatusPbc = async () => {
  try {
    summary.loading = true
    const response = await assessmentStore.getCapabilitySummaryStatusPBCAssessment({
      assesment_id: assessmentId.value,
    })

    if (response) {
      const data = response?.data;
      summary.data.total = data?.total || 0
      summary.data.not_yet = data?.not_yet || 0
      summary.data.on_process = data?.on_process || 0
      summary.data.done = data?.done || 0
      summary.data.outstanding = data?.outstanding || 0

      summary.loading = false
    }
  } catch (error) {
    summary.loading = false
  }
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getSummaryStatusPbc()
})
</script>

<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-8">
        <h5 class="card-title text-black fw-semibold mb-1">Summary PBC</h5>
        <p class="card-subtitle mb-0">Rekapitulasi dari Status PBC Kapabilitas Asesmen</p>
      </div>
    </div>

    <div class="row mt-3">
      <SummaryCard classContainer="col-lg-4 col-md-6 d-flex align-items-strech mb-1" :is-loading="summary.loading"
        label="Outstanding" :value="summary.data?.outstanding" variant="dark">
        <template #icon>
          <TablerIcon icon="FileInfoIcon" />
        </template>
      </SummaryCard>

      <SummaryCard classContainer="col-lg-4 col-md-6 d-flex align-items-strech mb-1" :is-loading="summary.loading"
        label="Not Yet" :value="summary.data?.not_yet" variant="danger">
        <template #icon>
          <TablerIcon icon="FileAlertIcon" />
        </template>
      </SummaryCard>

      <SummaryCard classContainer="col-lg-4 col-md-6 d-flex align-items-strech mb-1" :is-loading="summary.loading"
        label="On Process" :value="summary.data?.on_process" variant="warning">
        <template #icon>
          <TablerIcon icon="FileReportIcon" />
        </template>
      </SummaryCard>

      <SummaryCard classContainer="col-lg-6 col-md-6 d-flex align-items-strech" :is-loading="summary.loading"
        label="Done" :value="summary.data?.done" variant="success">
        <template #icon>
          <TablerIcon icon="FileCheckIcon" />
        </template>
      </SummaryCard>

      <SummaryCard classContainer="col-lg-6 col-md-6 d-flex align-items-strech" :is-loading="summary.loading"
        label="Total" :value="summary.data?.total" variant="info">
        <template #icon>
          <TablerIcon icon="FilesIcon" />
        </template>
      </SummaryCard>
    </div>
  </div>
</template>