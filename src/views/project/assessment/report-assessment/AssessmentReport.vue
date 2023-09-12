<script setup>
import { reactive, ref, watch, computed } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import ReportAssessmentServices from '@/services/lib/report-assessment'

import { useToast } from '@/stores/toast'
import { useRoute, useRouter } from 'vue-router'
import { useAppConfig } from '@/stores/appConfig'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const appConfig = useAppConfig()

/* ---------------------------------- STATE --------------------------------- */
const report = reactive({
  loading: false,
  data: [],
  headers: [{
    text: 'Governance and Management Objectives',
    value: 'nama',
    sortable: true
  }, {
    text: 'Target Organisasi',
    value: 'aggreed_capability_level',
  }, {
    text: 'Hasil Assesment',
    value: 'result',
  }, {
    text: 'Gap Organisasi',
    value: 'gap_organisasi',
  }, {
    text: 'Gap Deskripsi',
    value: 'gap_deskripsi',
  }, {
    text: 'Potensi Inisiatif',
    value: 'potensi',
  }, {
    text: 'Action',
    value: 'action',
  },
  ],
  meta: {
    current_page: 1,
    per_page: 10,
    total: 0,
    total_page: 0
  },
})

const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: '',
  sortType: '',
});

const filter = ref({
  domain_id: ''
})

const titleAssessment = computed(() => {
  return route.query?.assessment
})

/* --------------------------------- METHODS -------------------------------- */
const getListReportAssessment = async ({ limit, page, sortBy, sortType, organisasi_id }) => {
  try {
    report.loading = true
    const response = await ReportAssessmentServices.getListReportAssessment({ limit, page, sortBy, sortType, organisasi_id })

    if (response) {
      const data = response?.data

      report.data = data?.list || []
      report.meta = data?.meta
      report.loading = false
    }
  } catch (error) {
    report.loading = false
    toast.error({ error })
  }
}

const handleBack = () => {
  router.back()
}

const handleExport = () => {
  const url = `${appConfig.app.appHost}assesment/report/download?id=${route.params?.id}`
  window.open(url, '_blank');
}

/*
onMounted(() => {
  getListReportAssessment({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
  })
})
*/

watch(() => [serverOptions.value, filter.value], () => {
  getListReportAssessment({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
  })
}, { deep: true })

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <div class="card-body">
          <div
            class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between mb-7">
            <div class="mb-3 mb-sm-0">
              <h5 class="card-title fw-semibold">Report</h5>
              <p v-if="titleAssessment" class="card-subtitle mb-0">{{ titleAssessment }}</p>
            </div>

            <div
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
              <BaseButton @click="handleExport" class="btn btn-outline-primary ms-0 mt-3 mt-md-0 ms-md-3"
                title="Export Report">
                <template #icon-left>
                  <TablerIcon size="16" icon="FileExportIcon" />
                </template>
              </BaseButton>
            </div>
          </div>

          <DataTable :headers="report.headers" :items="report.data" :loading="report.loading"
            :server-items-length="report.meta.total" v-model:server-options="serverOptions" fixed-header>
          </DataTable>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="d-flex flex-column flex-md-row align-items-center">
            <div>
              <BaseButton @click="handleBack" class="btn btn-outline-primary me-0 me-md-3 mb-2 mb-md-0" title="Kembali">
                <template #icon-left>
                  <TablerIcon icon="ChevronLeftIcon" />
                </template>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>