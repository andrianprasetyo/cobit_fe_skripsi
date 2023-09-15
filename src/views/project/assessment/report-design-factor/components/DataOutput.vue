<script setup>
import { reactive, watch, computed, ref, onMounted } from 'vue'

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
    text: 'Governance / Management Objective',
    value: 'domain_kode',
  }, {
    text: 'Score',
    value: 'score',
  }, {
    text: 'Baseline Score',
    value: 'baseline_score',
  }, {
    text: 'Relative Importance',
    value: 'relative_importance',
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

const serverOptions = ref({
  page: 1,
  rowsPerPage: 50,
  sortBy: '',
  sortType: '',
});


/* ---------------------------------- METHODS --------------------------------- */
const getReportDesignFactorOutput = async ({ assesment_id, design_faktor_id, limit, page }) => {
  try {
    reportDesignFactor.loading = true
    const response = await ReportDesignFactorServices.getReportDesignFactorOutput({ assesment_id, design_faktor_id, limit, page })

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
onMounted(() => {
  if (designFactorId.value && assessmentId.value) {
    getReportDesignFactorOutput({ design_faktor_id: designFactorId.value, assesment_id: assessmentId.value, page: serverOptions.value.page, limit: serverOptions.value.rowsPerPage })
  }
})

watch(() => [serverOptions.value, designFactorId.value, assessmentId.value], () => {
  if (designFactorId.value && assessmentId.value) {
    getReportDesignFactorOutput({ design_faktor_id: designFactorId.value, assesment_id: assessmentId.value, page: serverOptions.value.page, limit: serverOptions.value.rowsPerPage })
  }
}, { deep: true })

</script>

<template>
  <div class="card">
    <div class="card-body">
      <div
        class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between mb-7">
        <div>
          <h5 class="card-title fw-semibold">Output Section</h5>
        </div>
      </div>
      <DataTable :headers="reportDesignFactor.headers" :items="reportDesignFactor.data"
        :loading="reportDesignFactor.loading" :server-items-length="reportDesignFactor.meta.total"
        v-model:server-options="serverOptions" fixed-header>
        <template #header-score="header">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ header.item.text }}
          </div>
        </template>

        <template #header-baseline_score="header">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ header.item.text }}
          </div>
        </template>

        <template #header-relative_importance="header">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ header.item.text }}
          </div>
        </template>

        <template #item-domain_kode="item">
          <div v-if="item?.item.domain_kode" class="width-100px text-break text-wrap fw-bold"
            v-html="item?.item?.domain_kode" />
          <div v-if="item?.item.domain_ket" class="width-250px text-break text-wrap"
            v-html="item?.item?.domain_ket" />

        </template>

        <template #item-score="item">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ item?.item?.score || "-" }}
          </div>
        </template>

        <template #item-baseline_score="item">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ item?.item?.baseline_score || "-" }}
          </div>
        </template>

        <template #item-relative_importance="item">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ item?.item?.relative_importance || "-" }}
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>