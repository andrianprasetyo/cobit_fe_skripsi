<script setup>
import { reactive, onMounted, computed } from 'vue'

import ApexChartsRadar from '@/components/ApexCharts/ApexChartsRadar.vue'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

import { useRoute } from 'vue-router'

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

})

const route = useRoute()
const assessmentStore = useAssessmentStore()

const assessmentTitle = computed(() => {
  return route.query?.assessment
})


/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  assessmentStore.getReportChartAdjustmentAssessment({ assessment_id: route.params?.id })
})

</script>

<template>
  <div class="card">
    <div class="card-body">
      <div>
        <h5 class="card-title fw-semibold">Step 4: Conclude the Scope of the Governance System</h5>
        <p v-if="assessmentTitle" class="card-subtitle mb-0">{{ assessmentTitle }}</p>
      </div>

      <ApexChartsRadar :height="1000" :categories="assessmentStore.reportChart.adjustment?.categories || []"
        :options="chartOptions" :series="assessmentStore.reportChart.adjustment?.series || []" />
    </div>
  </div>
</template>