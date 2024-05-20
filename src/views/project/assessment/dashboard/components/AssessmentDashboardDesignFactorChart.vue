<script setup>
import { reactive, onMounted, computed, watch } from 'vue'
import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

import ApexChartsRadar from '@/components/ApexCharts/ApexChartsRadar.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'
import BaseSelect from '@/components/Select/BaseSelect.vue'

import ReportDesignFactorServices from '@/services/lib/report-design-factor'

const toast = useToast()
const route = useRoute()
const assessmentStore = useAssessmentStore()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const assessmentDesignFactorChart = reactive({
  loading: false,
  data: {
    categories: [],
    series: []
  },
  selectedDesignFactorId: null
})

const assessmentId = computed(() => route?.params?.id)

/* --------------------------------- METHODS -------------------------------- */
const getAssessmentDesignFactorChart = async ({ assessment_id, design_faktor_id }) => {
  try {
    assessmentDesignFactorChart.loading = true

    const response = await ReportDesignFactorServices.getReportChartDesignFactor({ assessment_id, design_faktor_id })

    if (response) {
      const data = response.data
      assessmentDesignFactorChart.data.categories = data?.categories || []
      assessmentDesignFactorChart.data.series = data?.series || []
      assessmentDesignFactorChart.loading = false
    }
  } catch (error) {
    assessmentDesignFactorChart.loading = false
    toast.error({ error })
  }
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  if (Array.isArray(assessmentStore.reportDesignFactor.listDesignFactor) && assessmentStore.reportDesignFactor.listDesignFactor.length) {
    assessmentDesignFactorChart.selectedDesignFactorId = assessmentStore.reportDesignFactor.listDesignFactor?.[0]?.id
  } else {
    assessmentStore.getReportDesignFactorList({ limit: 99 }).then(() => {
      assessmentDesignFactorChart.selectedDesignFactorId = assessmentStore.reportDesignFactor.listDesignFactor?.[0]?.id
    })
  }
})

watch(() => [assessmentDesignFactorChart.selectedDesignFactorId], () => {
  if (assessmentDesignFactorChart.selectedDesignFactorId) {
    getAssessmentDesignFactorChart({ assessment_id: assessmentId.value, design_faktor_id: assessmentDesignFactorChart.selectedDesignFactorId })
  }
}, { deep: true })

</script>

<template>
  <div class="card w-100">
    <div class="card-header">
      <div
        class="d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-md-center">
        <div class="w-100 mb-3 mb-md-0">
          <h5 class="card-title fw-semibold">Grafik Design Factor</h5>
          <p class="card-subtitle mb-0">Berdasarkan Data Kuesioner yang telah diproses</p>
        </div>

        <div class="w-100">
          <BaseSelect id="list-design-factor" v-model="assessmentDesignFactorChart.selectedDesignFactorId"
            default-option="Pilih Design Factor" :options="assessmentStore.reportDesignFactor.listDesignFactor"
            options-label="nama" options-value="id" :disabled="assessmentDesignFactorChart.loading" />
        </div>
      </div>
    </div>
    <div class="card-body position-relative d-flex flex-column justify-content-center  overflow-auto">
      <LoadingOverlay :active="assessmentDesignFactorChart.loading" />
      <div>
        <ApexChartsRadar :height="400" :categories="assessmentDesignFactorChart.data.categories"
          :series="assessmentDesignFactorChart.data.series" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-dashboard-content {
  height: calc(100vh - 400px);
}
</style>