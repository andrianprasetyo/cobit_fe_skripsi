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
  assessmentStore.getReportChartAdjustmentAssessment({ assessment_id: route.params?.id })
})

</script>

<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title fw-semibold">Step 4: Conclude the Scope of the Governance System</h5>

      <ApexChartsBar :categories="assessmentStore.reportChart.adjustment?.categories || []" :options="chartOptions"
        :series="assessmentStore.reportChart.adjustment?.series?.step_2" />
    </div>
  </div>
</template>