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
  progress: {
    loading: false,
    data: {
      total_progress: 0,
      total_capability: 0,
      total_capability_answered: 0,
    }
  },
})

/* -------------------------------- COMPUTED -------------------------------- */
const assessmentId = computed(() => {
  return route.params?.id
})

/* --------------------------------- METHODS -------------------------------- */
const getProgress = async () => {
  try {
    summary.progress.loading = true
    const response = await assessmentStore.getCapabilityProgressAssessment({
      assesment_id: assessmentId.value,
    })

    if (response) {
      const data = response?.data;
      summary.progress.data.total_progress = data?.total_progress || 0
      summary.progress.data.total_capability = data?.total_capability || 0
      summary.progress.data.total_capability_answered = data?.total_capability_answered || 0

      summary.progress.loading = false
    }
  } catch (error) {
    summary.progress.loading = false
  }
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getProgress()
})
</script>

<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-8">
        <h5 class="card-title text-black fw-semibold mb-1">Summary Progress Kapabilitas</h5>
        <p class="card-subtitle mb-0">Rekapitulasi dari Activites Kapabilitas Asesmen</p>
      </div>
    </div>
    <div class="row mt-3">
      <SummaryCard :is-loading="summary.progress.loading" label="Total Activities"
        :value="summary.progress.data?.total_capability" variant="info">
        <template #icon>
          <TablerIcon icon="ClipboardListIcon" />
        </template>
      </SummaryCard>

      <SummaryCard :is-loading="summary.progress.loading" label="Total Activities Sudah Dinilai"
        :value="summary.progress.data?.total_capability_answered" variant="success">
        <template #icon>
          <TablerIcon icon="CheckupListIcon" />
        </template>
      </SummaryCard>

      <SummaryCard :is-loading="summary.progress.loading" label="Progress Kapabilitas Asesmen"
        :value="`${summary.progress.data?.total_progress} %`" variant="primary">
        <template #icon>
          <TablerIcon icon="ClipboardDataIcon" />
        </template>
      </SummaryCard>
    </div>
  </div>
</template>