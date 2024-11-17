<script setup>
import { reactive, watch, ref, onMounted, computed } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import BasicDataTable from '@/components/DataTable/BasicDataTable.vue'
import BasicDataTableIconSort from '@/components/DataTable/BasicDataTableIconSort.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import DomainServices from '@/services/lib/domain'
import AssessmentTargetServices from '@/services/lib/assessment-target'

import optionsFilterListGamoReportAssessment from '@/data/optionsFilterListGamoReportAssessment.json'

import { useToast } from '@/stores/toast'
import { useRoute, useRouter } from 'vue-router'
import { useAppConfig } from '@/stores/appConfig'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const appConfig = useAppConfig()

/* ---------------------------------- STATE --------------------------------- */
const summary = reactive({
  loading: false,
  data: [],
  listTarget: {
    loading: false,
    data: []
  },
  headers: [],
  meta: {
    current_page: 1,
    per_page: 10,
    total: 0,
    total_page: 0
  },
})

const filter = ref({
  target_id: "",
  assessment: {
    "label": "Tampilkan Semua GAMO",
    "id": 0
  },
})

const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: '',
  sortType: '',
});


/* -------------------------------- COMPUTED -------------------------------- */

const classIsNeedAssessment = computed(() => {
  return value => {
    if (value === "Ya") {
      return 'bg-light-success text-success'
    } else {
      return 'bg-light-danger text-danger'
    }
  }
})

const assessmentTitle = computed(() => {
  return route.query?.assessment
})

const assessmentId = computed(() => {
  return route.params?.id
})

/* --------------------------------- METHODS -------------------------------- */
const getSummaryGamo = async ({ limit, page, assessment_id, sortBy, sortType, target_id, assessment }) => {
  try {
    summary.loading = true
    const response = await DomainServices.getGamoByTarget({ limit, page, assessment_id, sortBy, sortType, target_id, assessment })

    if (response) {
      const data = response?.data

      if (Array.isArray(data?.list_header)) {
        const list = [];
        data?.list_header.map(item => list.push({
          text: item?.label,
          value: item?.key
        }))

        summary.headers = list;
      }

      if (Array.isArray(data?.list_data)) {
        summary.data = data?.list_data || []
      }

      summary.loading = false
    }
  } catch (error) {
    summary.loading = false
    toast.error({ error })
  }
}

const getListTarget = async ({ assesment_id }) => {
  try {
    summary.listTarget.loading = true
    const response = await AssessmentTargetServices.getListTarget({ assesment_id })

    if (response) {
      const data = response?.data

      summary.listTarget.data = data?.list || []
      summary.listTarget.loading = false
    }
  } catch (error) {
    summary.listTarget.loading = false
    toast.error({ error })
  }
}

const exportSummaryGamo = async () => {
  const url = `${appConfig.app.appHost}domain/assesment-adjustment/download?id=${route.params?.id}${filter.value?.target_id ? `&target_id=${filter?.value?.target_id?.id}` : ''}`
  window.open(url, '_blank');
}

const handleNavigateToAdjustSummaryGamo = () => {
  router.push(`/project/assessment/${assessmentId.value}/summary${assessmentTitle.value ? `?assessment=${assessmentTitle.value}` : ''}`)
}

const handleSort = ({ sortBy, sortType }) => {
  serverOptions.value.sortBy = sortBy
  serverOptions.value.sortType = sortType
}

const resetServerOptions = () => {
  serverOptions.value.page = 1
  serverOptions.value.rowsPerPage = 10
  serverOptions.value.sortBy = ''
  serverOptions.value.sortType = ''
}


/* ---------------------------------- HOOKS --------------------------------- */
watch(() => [filter.value], value => {
  if (value) {
    resetServerOptions()
  }
}, { deep: true })

watch(() => [serverOptions.value, filter.value], () => {
  getSummaryGamo({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    assessment_id: assessmentId.value,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    target_id: filter.value.target_id?.id,
    assessment: filter.value.target_id?.id ? filter.value.assessment?.id : null,
  })
}, { deep: true })

onMounted(() => {
  getListTarget({
    assesment_id: assessmentId.value
  });

  getSummaryGamo({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    assessment_id: assessmentId.value,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    target_id: filter.value.target_id?.id,
    assessment: filter.value.target_id?.id ? filter.value.assessment?.id : null,
  })
})


</script>

<template>
  <div class="card">
    <div class="card-body">
      <div
        class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between mb-7">
        <div>
          <h5 class="card-title fw-semibold">Governance and Management Objectives</h5>
          <p v-if="assessmentTitle" class="card-subtitle mb-0">{{ assessmentTitle }}</p>
        </div>

        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <BaseButton @click="exportSummaryGamo" class="btn btn-outline-primary" title="Export Summary GAMO"
            :disabled="summary.loading" :access="['project-add', 'project-edit']">
            <template #icon-right>
              <TablerIcon size="16" icon="FileExportIcon" />
            </template>
          </BaseButton>

          <BaseButton @click="handleNavigateToAdjustSummaryGamo" class="btn btn-primary ms-0 ms-md-3 mt-3 mt-md-0"
            title="Adjust / Sesuaikan GAMO" :access="['project-add', 'project-edit']">
            <template #icon-right>
              <TablerIcon size="16" icon="AdjustmentsIcon" />
            </template>
          </BaseButton>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-12 col-md-4">
          <label class="form-label" for="filter-gamo">Filter GAMO Berdasarkan Target</label>

          <v-select id="filter-gamo" :searchable="false" :filterable="false" :options="summary.listTarget.data"
            v-model="filter.target_id" label="nama" placeholder="Tampilkan Semua GAMO" :select-on-key-codes="[]">
            <template #no-options>
              {{ summary.loading ? 'Loading...' : 'Tidak ada Target Ditemukan' }}
            </template>

            <template #option="option">
              <div class="d-flex flex-row align-items-center py-1">
                <span class="me-2 fw-bold text-wrap">
                  {{ option.nama }} <span class="ms-2" v-if="option?.default">( Default )</span>
                </span>
              </div>
            </template>

            <template #selected-option="option">
              <div class="d-flex flex-row align-items-center py-1 ">
                <span class="me-2 fw-bold text-wrap">
                  {{ option.nama }} <span class="ms-2" v-if="option?.default">( Default )</span>
                </span>
              </div>
            </template>
          </v-select>
        </div>

        <div v-if="filter?.target_id" class="col-12 col-md-4 d-none">
          <label class="form-label" for="filter-gamo">GAMO Yang Ditampilkan</label>

          <v-select id="filter-show-only-assessment-gamo" :searchable="false" :filterable="false"
            :options="optionsFilterListGamoReportAssessment" v-model="filter.assessment" label="label"
            placeholder="Opsi GAMO Yang Ditampilkan" :select-on-key-codes="[]">
            <template #option="option">
              <div class="d-flex flex-row align-items-center py-1">
                <span class="me-2 fw-bold text-wrap">
                  {{ option?.label }}
                </span>
              </div>
            </template>

            <template #selected-option="option">
              <div class="d-flex flex-row align-items-center py-1 ">
                <span class="me-2 fw-bold text-wrap">
                  {{ option?.label }}
                </span>
              </div>
            </template>
          </v-select>
        </div>
      </div>

      <BasicDataTable class="rounded" class-header="position-sticky top-0 bg-white"
        :column-length="summary.headers.length || 1" :is-loading="summary.loading" :data="summary.data">
        <template #header>
          <tr>
            <th class="width-75px text-center align-content-center sticky-col">No</th>

            <template v-if="Array.isArray(summary.headers) && summary.headers?.length">
              <th v-for="header in summary.headers" :key="`header-summary-${header?.value}`"
                class="text-center align-content-center sticky-col">
                {{ header?.text }}

                <template v-if="header?.value === 'kode'">
                  <BasicDataTableIconSort :sort-type="serverOptions.sortType"
                    :is-active="serverOptions.sortBy === 'urutan'"
                    @onAsc="handleSort({ sortBy: 'urutan', sortType: 'ASC' })"
                    @onDesc="handleSort({ sortBy: 'urutan', sortType: 'DESC' })"
                    @onReset="handleSort({ sortBy: '', sortType: '' })" />
                </template>
              </th>
            </template>
          </tr>
        </template>

        <template #body>
          <template v-if="Array.isArray(summary.data) && summary.data?.length">
            <tr v-for="(item, index) in summary.data" :key="`item-summary-${item?.id}`">
              <td class="width-75px text-center align-content-center text-wrap sticky-col">
                {{ index + 1 }}
              </td>
              <td>
                <div class="d-flex flex-column">
                  <div v-if="item?.name" class="width-250px text-break text-wrap fw-bold" v-html="item?.name" />
                  <div v-if="item?.ket_domain" class="width-250px text-break text-wrap" v-html="item?.ket_domain" />
                </div>
              </td>

              <td v-if="!filter?.target_id || filter.target_id?.default">
                <div class="d-flex justify-content-center align-items-center w-100">
                  {{ item?.canvas?.suggest_capability_level || "-" }}
                </div>
              </td>

              <td v-if="!filter?.target_id || filter.target_id?.default">
                <div class="d-flex justify-content-center align-items-center w-100">
                  {{ item?.canvas?.aggreed_capability_level || "-" }}
                </div>
              </td>

              <template v-if="Array.isArray(item?.target) && item?.target?.length">
                <template v-for="target in item.target" :key="`target-${target?.id}-${target?.target?.nama}`">
                  <td>
                    <div class="d-flex justify-content-center align-items-center w-100">
                      {{ target?.target || "-" }}
                    </div>
                  </td>
                  <td>
                    <div class="d-flex justify-content-center align-items-center w-100">
                      <span class="badge rounded-pill font-medium text-capitalize fw-bold"
                        :class="classIsNeedAssessment(target?.assesment)">
                        {{ target?.assesment }}
                      </span>
                    </div>
                  </td>
                </template>
              </template>
            </tr>
          </template>
        </template>
      </BasicDataTable>
    </div>
  </div>
</template>