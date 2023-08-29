<script setup>
import { reactive, onMounted } from 'vue'

import ApexChartsBar from '@/components/ApexCharts/ApexChartsBar.vue'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

import { useRoute } from 'vue-router'

const chartOptions = reactive({
  plotOptions: {
    bar: {
      horizontal: true,
      columnWidth: '50%',
      borderRadius: 2,
    },
  },
})

const route = useRoute()
const assessmentStore = useAssessmentStore()

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  if(!assessmentStore.reportChart.nonAdjustment?.series?.step_2){
    assessmentStore.getReportChartNonAdjustmentAssessment({ assessment_id: route.params?.id })
  }
})

</script>

<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title fw-semibold">Step 2: Determine the initial scope of the Governance System</h5>

      <ApexChartsBar :categories="assessmentStore.reportChart.nonAdjustment?.categories || []" :options="chartOptions"
        :series="assessmentStore.reportChart.nonAdjustment?.series?.step_2" />
    </div>
  </div>
</template>