<script setup>
import { reactive, onMounted } from 'vue'

import ApexChartsBar from '@/components/ApexCharts/ApexChartsBar.vue'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

import { useRoute } from 'vue-router'

const chartOptions = reactive({
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 3,
      endingShape: 'rounded',
      columnWidth: '70%',
      barHeight: '70%',
      distributed: false,
      rangeBarOverlap: true,
      rangeBarGroupRows: false,
      hideZeroBarsWhenGrouped: false,
      isDumbbell: false,
      dumbbellColors: undefined,
      isFunnel: false,
      isFunnel3d: true,
      colors: {
        ranges: [{
          from: -100,
          to: -1,
          color: '#EE1E25'
        }, {
          from: 1,
          to: 100,
          color: '#203058'
        }],
        backgroundBarColors: [],
        backgroundBarOpacity: 1,
        backgroundBarRadius: 0,
      },
    }
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '12px',
      fontFamily: 'inherit',
      fontWeight: 'bold',
    },
  },
  grid: {
    show: true,
    borderColor: '#dfe5ef',
    strokeDashArray: 0,
    position: 'back',
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: false
      }
    },
    row: {
      colors: undefined,
      opacity: 0.5
    },
    column: {
      colors: undefined,
      opacity: 0.5
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
  },
  yaxis: {
    min: -100,
    max: 100,
    labels: {
      show: true,
      align: 'right',
      minWidth: 0,
      maxWidth: 160,
      style: {
        fontSize: 10,
        fontFamily: 'inherit',
        fontWeight: 400,
        cssClass: 'apexcharts-yaxis-label',
      },
      offsetX: 0,
      offsetY: 0,
      rotate: 0,
    },
  },
})

const route = useRoute()
const assessmentStore = useAssessmentStore()

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  if (!assessmentStore.reportChart.nonAdjustment?.series?.step_3) {
    assessmentStore.getReportChartNonAdjustmentAssessment({ assessment_id: route.params?.id })
  }
})

</script>

<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title fw-semibold">Step 3: Refine the scope of the Governance System</h5>

      <ApexChartsBar :height="1000" :categories="assessmentStore.reportChart.nonAdjustment?.categories || []"
        :options="chartOptions" :series="assessmentStore.reportChart.nonAdjustment?.series?.step_3 || []" />
    </div>
  </div>
</template>