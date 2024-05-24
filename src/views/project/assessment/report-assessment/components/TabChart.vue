<script setup>
import { reactive, ref, watch, computed, onMounted } from 'vue'
import debounce from 'lodash.debounce'

import ApexChartsRadar from '@/components/ApexCharts/ApexChartsRadar.vue'
import BaseAlert from '@/components/Alert/BaseAlert.vue'
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
  target_id: '',
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
})

const assessmentTitle = computed(() => {
  return route.query?.assessment
})

const assessmentId = computed(() => {
  return route.params?.id
})

/* --------------------------------- METHODS -------------------------------- */
const getReportChartAssessment = async ({ assesment_id, target_id }) => {
  try {
    report.loading = true
    const response = await AssessmentServices.getReportChartAssessment({ assesment_id, target_id })

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
  if (filter.value.target_id) {
    getReportChartAssessment({ assesment_id: assessmentId.value })
  }
})

watch(() => [filter.value], value => {
  if (value) {
    getReportChartAssessment({ assesment_id: assessmentId.value, target_id: filter.value.target_id })
  }
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
          <BaseAlert v-if="!filter.target_id" variant="primary">
            <strong>Perhatian.</strong> Silahkan pilih Target terlebih dahulu
          </BaseAlert>

          <div class="col-12 md-12">
            <label class="form-label" for="filter-target-chart">Chart Report Berdasarkan Target</label>

            <v-select id="filter-target-chart" @search="(search) => handleSearchListTarget({ search })"
              :filterable="false" :options="listTarget.data" v-model="filter.target_id" label="nama"
              :reduce="state => state?.id" placeholder="Pilih Target" :select-on-key-codes="[]">
              <template #no-options>
                {{ listTarget.loading ? 'Loading...' : 'Tidak ada Target Ditemukan' }}
              </template>

              <template #option="option">
                <div class="d-flex flex-row align-items-center py-1 width-150px">
                  <span class="me-2 fw-bold">
                    {{ option.nama }} <span class="ms-2" v-if="option?.default">( Default )</span>
                  </span>
                </div>
              </template>

              <template #selected-option="option">
                <div class="d-flex flex-row align-items-center py-1 width-150px ">
                  <span class="me-2 fw-bold">
                    {{ option.nama }} <span class="ms-2" v-if="option?.default">( Default )</span>
                  </span>
                </div>
              </template>
            </v-select>
          </div>
        </div>

        <LoadingOverlay :active="report.loading" />

        <ApexChartsRadar v-if="filter.target_id" :height="1000" :categories="report.data?.categories || []"
          :options="chartOptions" :series="report.data?.series || []" />
      </div>
    </div>
  </div>
</template>