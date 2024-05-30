<script setup>
import { reactive, computed, onMounted } from 'vue'

import ApexChartsRadar from '@/components/ApexCharts/ApexChartsRadar.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'

import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'

import AssessmentServices from '@/services/lib/assessment'

const route = useRoute()
const toast = useToast()

const report = reactive({
  loading: false,
  data: null,
})

const chartOptions = reactive({
  chart: {
    height: 400,
    type: 'radar',
    dropShadow: {
      enabled: true,
      blur: 1,
      left: 1,
      top: 1
    }
  },
  yaxis: {
    min: -5,
    stepSize: 2,
    // max: 100,
  }
})

const assessmentTitle = computed(() => {
  return route.query?.assessment
})

const assessmentId = computed(() => {
  return route.params?.id
})

/* --------------------------------- METHODS -------------------------------- */
const getReportChartAssessment = async ({ assesment_id }) => {
  try {
    report.loading = true
    const response = await AssessmentServices.getReportChartAssessment({ assesment_id })

    if (response) {
      const data = response?.data

      report.data = data
      report.loading = false
    }
  } catch (error) {
    report.loading = false
    toast.error({ error })
  }
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getReportChartAssessment({ assesment_id: assessmentId.value })
})

</script>

<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div>
          <h5 class="card-title fw-semibold">Chart Report</h5>
          <p v-if="assessmentTitle" class="card-subtitle mb-0">{{ assessmentTitle }}</p>
        </div>

        <LoadingOverlay :active="report.loading" />

        <ApexChartsRadar :height="1000" :categories="report.data?.categories || []" :options="chartOptions"
          :series="report.data?.series || []" />
      </div>
    </div>
  </div>
</template>