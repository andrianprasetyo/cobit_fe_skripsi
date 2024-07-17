<script setup>
import { reactive, ref, watch, computed, onMounted } from 'vue'
import debounce from 'lodash.debounce'

import ApexChartsRadar from '@/components/ApexCharts/ApexChartsRadar.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'

import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'

import AssessmentServices from '@/services/lib/assessment'
import AssessmentTargetServices from '@/services/lib/assessment-target'

const route = useRoute()
const toast = useToast()

const report = reactive({
  loading: false,
  data: null,
})

const listTarget = reactive({
  loading: false,
  data: [],
})

const filter = ref({
  target: {
    id: 'all', nama: 'Semua Target'
  },
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
    min: 0,
    stepSize: 1,
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
const getReportChartAssessment = async ({ assesment_id, target }) => {
  try {
    report.loading = true
    const response = await AssessmentServices.getReportChartAssessment({ assesment_id, target })

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

const handleSearchListTarget = debounce(async ({ search }) => {
  try {
    listTarget.loading = true
    const response = await AssessmentTargetServices.getListTarget({ limit: 10, page: 1, search, assesment_id: assessmentId.value })

    if (response) {
      const data = response?.data

      listTarget.loading = false

      let list = []

      if (Array.isArray(data?.list) && data?.list?.length) {
        list = [{ id: 'all', nama: 'Semua Target' }, ...data.list]

        listTarget.data = list
      }
    }

  } catch (error) {
    listTarget.loading = false
    toast.error({ error })
  }
}, 500)

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  handleSearchListTarget({ search: '' })
  if (filter.value.target) {
    getReportChartAssessment({ assesment_id: assessmentId.value, target: "all" })
  }
})

watch(() => [filter.value], () => {
  getReportChartAssessment({ assesment_id: assessmentId.value, target: filter.value.target })
}, { deep: true })

</script>

<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div>
          <h5 class="card-title fw-semibold">Chart Report</h5>
          <p v-if="assessmentTitle" class="card-subtitle mb-0">{{ assessmentTitle }}</p>
        </div>

        <div class="my-3">
          <div class="col-12 md-12">
            <label class="form-label" for="filter-target-chart">
              Pilih Tampilan Semua Target atau Berdasarkan
              Target Tertentu
            </label>

            <v-select id="filter-target-chart" @search="(search) => handleSearchListTarget({ search })"
              :filterable="false" :options="listTarget.data" v-model="filter.target" label="nama"
              :reduce="state => state?.id" placeholder="Pilih Target" :select-on-key-codes="[]">
              <template #no-options>
                {{ listTarget.loading ? 'Loading...' : 'Tidak ada Target Ditemukan' }}
              </template>

              <template #option="option">
                <div class="d-flex flex-row align-items-center py-1">
                  <span class="me-2 fw-bold text-wrap">
                    {{ option.nama }} <span class="ms-2" v-if="option?.default">( Default )</span>
                  </span>
                </div>
              </template>

              <template #selected-option="option">
                <div class="d-flex flex-row align-items-center py-1">
                  <span class="me-2 fw-bold text-wrap">
                    {{ option.nama }} <span class="ms-2" v-if="option?.default">( Default )</span>
                  </span>
                </div>
              </template>
            </v-select>
          </div>
        </div>

        <LoadingOverlay :active="report.loading" />

        <ApexChartsRadar :height="1000" :categories="report.data?.categories || []" :options="chartOptions"
          :series="report.data?.series || []" />
      </div>
    </div>
  </div>
</template>