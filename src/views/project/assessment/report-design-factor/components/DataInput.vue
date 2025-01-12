<script setup>
import { reactive, watch, computed } from 'vue'

import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'

import ReportDesignFactorServices from '@/services/lib/report-design-factor'

import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'

const toast = useToast()
const route = useRoute()


/* ---------------------------------- STATE --------------------------------- */
const reportDesignFactor = reactive({
  loading: false,
  data: [],
  header: [],
})

const assessmentId = computed(() => {
  return route.params?.id
})

const designFactorId = computed(() => {
  return route.query?.design_factor_id
})


/* ---------------------------------- METHODS --------------------------------- */
const getReportDesignFactorInput = async ({ assesment_id, design_faktor_id }) => {
  try {
    reportDesignFactor.loading = true
    const response = await ReportDesignFactorServices.getReportDesignFactorInput({ assesment_id, design_faktor_id })

    if (response) {
      const data = response?.data

      reportDesignFactor.data = data?.list || []
      reportDesignFactor.header = data?.headercol || []
      reportDesignFactor.loading = false
    }
  } catch (error) {
    reportDesignFactor.data = []
    reportDesignFactor.loading = false
    toast.error({ error })
  }
}

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => [designFactorId.value, assessmentId.value], () => {
  if (designFactorId.value && assessmentId.value) {
    getReportDesignFactorInput({ design_faktor_id: designFactorId.value, assesment_id: assessmentId.value })
  }
}, { deep: true, immediate: true })

</script>

<template>
  <div class="card">
    <div class="card-body">
      <div
        class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between mb-7">
        <div>
          <h5 class="card-title fw-semibold">Input Section</h5>
        </div>
      </div>

      <LoadingOverlay :active="reportDesignFactor.loading" />

      <div class="table-responsive rounded-2 mb-4 mt-4">
        <div class="mh-100vh">
          <table class="table border text-nowrap mb-0 align-middle">
            <thead class="position-sticky top-0 bg-white" style="z-index: 5 !important;">
              <tr>
                <th class="width-75px align-middle text-center">
                  <h6 class="fs-3 fw-semibold mb-0">
                    No
                  </h6>
                </th>
                <th class="width-250px align-middle">
                  <h6 class="fs-3 fw-semibold mb-0 text-wrap text-break">
                    Value
                  </h6>
                </th>
                <template v-if="Array.isArray(reportDesignFactor.header) && reportDesignFactor.header.length">
                  <th v-for="(header, indexHeader) in reportDesignFactor.header"
                    class="width-250px align-middle text-center" :key="`header-in-${indexHeader}`">
                    <div class="fs-3 fw-semibold mb-0 text-wrap text-break" v-html="header" />
                  </th>
                </template>
                <th class="align-middle text-center">
                  <h6 class="fs-3 fw-semibold mb-0">
                    Baseline
                  </h6>
                </th>
              </tr>
            </thead>

            <tbody>
              <template v-if="Array.isArray(reportDesignFactor.data) && reportDesignFactor.data.length">
                <tr v-for="(report, index) in reportDesignFactor.data" :key="`data-in-${report.id}-${index}`">
                  <td class="width-75px text-center">
                    {{ index + 1 }}
                  </td>
                  <td class="width-250px">
                    <div class="text-wrap text-break">
                      {{ report?.dfk_nama }}
                    </div>
                  </td>
                  <template v-if="Array.isArray(report?.values) && report.values.length">
                    <td v-for="(value, indexValue) in report.values" class="text-center" :key="`value-${indexValue}`">
                      {{ value?.avg_bobot }}
                    </td>
                  </template>
                  <td class="text-center">
                    {{ report?.dfk_baseline }}
                  </td>
                </tr>
              </template>

              <template v-else>
                <tr>
                  <td colspan="5" class="text-center">
                    Data Tidak Ditemukan
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>