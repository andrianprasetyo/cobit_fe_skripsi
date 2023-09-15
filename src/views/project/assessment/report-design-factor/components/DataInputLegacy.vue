<script setup>
import { reactive, watch, computed } from 'vue'

import DataTable from '@/components/DataTable/DataTable.vue'

import ReportDesignFactorServices from '@/services/lib/report-design-factor'

import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'

const toast = useToast()
const route = useRoute()


/* ---------------------------------- STATE --------------------------------- */
const reportDesignFactor = reactive({
  loading: false,
  data: [],
  headers: [{
    text: 'Value',
    value: 'dfk_nama',
  }, {
    text: 'Importance',
    value: 'avg_bobot',
  }, {
    text: 'Baseline Score',
    value: 'dfk_baseline',
  }],
  meta: {
    current_page: 1,
    per_page: 10,
    total: 0,
    total_page: 0
  },
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
      reportDesignFactor.meta = data?.meta
      reportDesignFactor.loading = false
    }
  } catch (error) {
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
      <DataTable :headers="reportDesignFactor.headers" :items="reportDesignFactor.data"
        :loading="reportDesignFactor.loading" fixed-header>
        <template #header-avg_bobot="header">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ header.item.text }}
          </div>
        </template>

        <template #header-dfk_baseline="header">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ header.item.text }}
          </div>
        </template>

        <template #item-avg_bobot="item">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ item?.item?.avg_bobot || "-" }}
          </div>
        </template>

        <template #item-dfk_baseline="item">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ item?.item?.dfk_baseline || "-" }}
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>