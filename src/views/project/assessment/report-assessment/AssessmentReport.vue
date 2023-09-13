<script setup>
import { reactive, ref, watch, computed, onMounted } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import AssessmentServices from '@/services/lib/assessment'

import { useToast } from '@/stores/toast'
import { useRoute, useRouter } from 'vue-router'
import { useAppConfig } from '@/stores/appConfig'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const appConfig = useAppConfig()
const assessmentStore = useAssessmentStore()

/* ---------------------------------- STATE & COMPUTED --------------------------------- */
const report = reactive({
  loading: false,
  data: [],
  headers: [{
    text: 'Governance and Management Objectives',
    value: 'domain',
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
  isShowModalOfi: false
})

const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: '',
  sortType: '',
});

const filter = ref({
  target_id: ''
})

const assessmentTitle = computed(() => {
  return route.query?.assessment
})

const assessmentId = computed(() => {
  return route.params?.id
})

/* --------------------------------- METHODS -------------------------------- */
const getReportAssessment = async ({ limit, page, sortBy, sortType, assesment_id, target_id }) => {
  try {
    report.loading = true
    const response = await AssessmentServices.getReportAssessment({ limit, page, sortBy, sortType, assesment_id, target_id })

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

const handleToggleModalOfi = ({ item }) => {
  report.isShowModalOfi = !report.isShowModalOfi

  if (report.isShowModalOfi) {
    assessmentStore.setReportSelectedGamo(item)
  }
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getReportAssessment({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    target_id: filter.value.target_id,
    assesment_id: assessmentId.value
  })
})

watch(() => [serverOptions.value, filter.value], () => {
  getReportAssessment({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    target_id: filter.value.target_id,
    assesment_id: assessmentId.value
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
              <p v-if="assessmentTitle" class="card-subtitle mb-0">{{ assessmentTitle }}</p>
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
            <template #header-aggreed_capability_level="header">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ header.item.text }}
              </div>
            </template>

            <template #header-result="header">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ header.item.text }}
              </div>
            </template>

            <template #header-gap_organisasi="header">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ header.item.text }}
              </div>
            </template>

            <template #item-domain="item">
              <div class="d-flex flex-wrap flex-column">
                <div v-if="item.item?.domain?.kode" class="width-250px text-break text-wrap fw-bold"
                  v-html="item.item?.domain?.kode" />
                <div v-if="item.item?.domain?.ket" class="width-250px text-break text-wrap"
                  v-html="item.item?.domain?.ket" />
              </div>
            </template>

            <template #item-aggreed_capability_level="item">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ item.item?.aggreed_capability_level }}
              </div>
            </template>

            <template #item-result="item">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ item.item?.result }}
              </div>
            </template>

            <template #item-gap_organisasi="item">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ item.item?.gap_organisasi }}
              </div>
            </template>

            <template #item-gap_deskripsi="item">
              <div class="d-flex flex-wrap">
                <div v-if="item.item?.gap_deskripsi" class="width-250px text-break text-wrap"
                  v-html="item.item?.gap_deskripsi" />

                <div v-else>
                  Tidak Ada Gap Deskripsi
                </div>
              </div>
            </template>

            <template #item-potensi="item">
              <div class="d-flex flex-wrap">
                <div v-if="item.item?.potensi" class="width-250px text-break text-wrap" v-html="item.item?.potensi" />

                <div v-else>
                  Tidak Ada Potensi Inisiatif
                </div>
              </div>
            </template>

            <template #item-action="item">
              <div class="dropdown dropstart">
                <TablerIcon icon="DotsIcon" class="text-muted cursor-pointer" data-bs-toggle="dropdown"
                  id="dropdownMenuButton" aria-expanded="false" />

                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <BaseButton @class="handleToggleModalOfi({ item: item.item })"
                      class="dropdown-item d-flex align-items-center gap-3 cursor-pointer text-primary">
                      <template #icon-left>
                        <TablerIcon icon="EyeIcon" />
                        <span class="ms-2">
                          Lihat OFI
                        </span>
                      </template>
                    </BaseButton>
                  </li>
                </ul>
              </div>
            </template>
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