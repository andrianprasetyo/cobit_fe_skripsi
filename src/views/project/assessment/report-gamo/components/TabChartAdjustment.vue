<script setup>
import { reactive, onMounted, computed } from 'vue'

import ApexChartsRadar from '@/components/ApexCharts/ApexChartsRadar.vue'

import { useRoute } from 'vue-router'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

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
  /* Y Axis Config Min & Max
  yaxis: {
    min: -5,
    stepSize: 2,
    // max: 100,
  }
  */
})

const route = useRoute()
const assessmentStore = useAssessmentStore()

const assessmentTitle = computed(() => {
  return route.query?.assessment
})


/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  assessmentStore.getChartAdjustmentAssesment({ assessment_id: route.params?.id })
})

</script>

<template>
  <div class="card">
    <div class="card-body">
      <div>
        <h5 class="card-title fw-semibold">Hasil Adjustment</h5>
        <p v-if="assessmentTitle" class="card-subtitle mb-0">{{ assessmentTitle }}</p>
      </div>

      <ApexChartsRadar :height="1000" :categories="assessmentStore.chartAdjustment?.categories || []"
        :options="chartOptions" :series="assessmentStore.chartAdjustment?.series || []" />
    </div>
  </div>
</template>