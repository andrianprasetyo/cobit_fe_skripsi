<script setup>
import { reactive, onMounted, watch, ref } from 'vue'
import debounce from 'lodash.debounce'

import ApexChartsBar from '@/components/ApexCharts/ApexChartsBar.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'

import DashboardServices from '@/services/lib/dashboard'
import AssessmentServices from '@/services/lib/assessment'

import { useToast } from '@/stores/toast'

const toast = useToast()

/* ---------------------------------- STATE --------------------------------- */
const assessmentChart = reactive({
  loading: false,
  data: null,
})

const listAssessment = reactive({
  loading: false,
  data: []
})

const selectedAssessment = ref('')

/* --------------------------------- METHODS -------------------------------- */
const getAssessmentChart = async ({ assessment_id }) => {
  try {
    assessmentChart.loading = true

    const response = await DashboardServices.getAssessmentChart({ assessment_id })

    if (response) {
      const data = response.data
      assessmentChart.data = data
      assessmentChart.loading = false
    }
  } catch (error) {
    assessmentChart.loading = false
    toast.error({ error })
  }
}

const handleSearchAssessment = debounce(async ({ search }) => {
  try {
    const response = await AssessmentServices.getListAssessment({ limit: 10, page: 1, search })

    if (response) {
      const data = response?.data

      listAssessment.data = data?.list || []
    }

  } catch (error) {
    toast.error({ error })
  }
}, 500)

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getAssessmentChart({ assessment_id: assessmentChart.selectedAssessment })
  handleSearchAssessment({ search: '' })
})

watch(() => [selectedAssessment.value], () => {
  if (selectedAssessment.value) {
    getAssessmentChart({ assessment_id: selectedAssessment.value })
  }
}, { deep: true })

</script>

<template>
  <div>
    <div
      class="mb-4 d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-md-center">
      <div class="w-100 mb-3 mb-md-0">
        <h5 class="card-title fw-semibold">Chart Rekapitulasi</h5>
        <p class="card-subtitle mb-0">Berdasarkan Assessment</p>
      </div>

      <div class="w-100">
        <div>
          <v-select id="list_assessment" @search="(search) => handleSearchAssessment({ search })" :filterable="false"
            :reduce="option => option?.id" :options="listAssessment.data" v-model="selectedAssessment"
            :disabled="listAssessment.loading" label="id" placeholder="Filter Berdasarkan Assessment"
            :select-on-key-codes="[]">
            <template #no-options>
              Tidak Ada Assessment Ditemukan
            </template>

            <template #option="option">
              <div class="d-flex flex-row align-items-center py-1">
                <span class="me-2 fw-bold">
                  {{ option.nama }}
                </span>
              </div>
            </template>

            <template #selected-option="option">
              <div class="d-flex flex-row align-items-center py-1">
                <span class="me-2 fw-bold">
                  {{ option.nama }}
                </span>
              </div>
            </template>
          </v-select>
        </div>

      </div>

    </div>

    <LoadingOverlay :active="assessmentChart.loading" />
    <ApexChartsBar :height="400" :categories="assessmentChart.data?.categories || []"
      :series="assessmentChart.data?.series || []" />
  </div>
</template>