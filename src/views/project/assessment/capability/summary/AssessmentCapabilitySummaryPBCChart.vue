<script setup>
import { reactive, computed, onMounted } from 'vue'

import ApexChartsPie from '@/components/ApexCharts/ApexChartsPie.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'

import { useRoute } from 'vue-router'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const assessmentStore = useAssessmentStore()
const route = useRoute()

/* ---------------------------------- STATE --------------------------------- */
const summary = reactive({
  loading: false,
  data: {
    labels: [],
    series: []
  }
})

/* -------------------------------- COMPUTED -------------------------------- */
const assessmentId = computed(() => {
  return route.params?.id
})

/* --------------------------------- METHODS -------------------------------- */
const getSummaryChartStatusPbc = async () => {
  try {
    summary.loading = true
    const response = await assessmentStore.getCapabilitySummaryChartStatusPBCAssessment({
      assesment_id: assessmentId.value,
    })

    if (response) {
      const data = response?.data;
      summary.data.labels = data?.labels || []
      summary.data.series = data?.series || []

      summary.loading = false
    }
  } catch (error) {
    summary.loading = false
  }
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getSummaryChartStatusPbc()
})
</script>

<template>
  <div>
    <div class="card">
      <div class="card-header">
        <div class="row">
          <div class="col-12 col-md-8">
            <h5 class="card-title text-black fw-semibold mb-1">Summary Chart PBC</h5>
            <p class="card-subtitle mb-0">Sajian Data Chart dari Status PBC Kapabilitas Asesmen</p>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="bg-light-primary rounded">
          <LoadingOverlay :active="summary.loading" />
          <ApexChartsPie :labels="summary.data?.labels || []" :series="summary.data?.series || []"
            :colors="['#2A3546', '#EA5354', '#FFAE1D', '#12DEB9']" />
        </div>
      </div>
    </div>
  </div>
</template>