<script setup>
import { reactive, watch, ref, onMounted, computed } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseSelect from '@/components/Select/BaseSelect.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import DomainServices from '@/services/lib/domain'

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
  headers: [{
    text: 'Governance and Management Objectives',
    value: 'kode',
  }, {
    text: 'Target Capability Level',
    value: 'suggest_capability_level',
    sortable: true
  }, {
    text: 'Hasil Adjustment',
    value: 'aggreed_capability_level',
    sortable: true
  }, {
    text: 'Target BUMN',
    value: 'target',
  }, {
    text: 'Assessment',
    value: 'assessment',
    sortable: true
  }
  ],
  meta: {
    current_page: 1,
    per_page: 10,
    total: 0,
    total_page: 0
  },
  optionsFilterAssessment: [
    {
      label: 'Hanya GAMO yang Perlu Diasesmen',
      value: 1
    },
    {
      label: 'Tampilkan Semua GAMO',
      value: 0
    }
  ]
})

const filter = ref({
  assesment: 1
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
const getSummaryGamo = async ({ limit, page, assessment_id, sortBy, sortType, assesment }) => {
  try {
    summary.loading = true
    const response = await DomainServices.getSummaryGamo({ limit, page, assessment_id, sortBy, sortType, assesment })

    if (response) {
      const data = response?.data

      summary.data = data?.list || []
      summary.meta = data?.meta
      summary.loading = false
    }
  } catch (error) {
    summary.loading = false
    toast.error({ error })
  }
}

const exportSummaryGamo = async () => {
  const url = `${appConfig.app.appHost}domain/assesment-adjustment/download?assesment=1&id=${route.params?.id}`
  window.open(url, '_blank');
}

const handleNavigateToAdjustSummaryGamo = () => {
  router.push(`/project/assessment/${assessmentId.value}/summary${assessmentTitle.value ? `?assessment=${assessmentTitle.value}` : ''}`)
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
    assesment: filter.value.assesment
  })
}, { deep: true })

onMounted(() => {
  getSummaryGamo({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    assessment_id: assessmentId.value,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    assesment: filter.value.assesment
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
          <BaseSelect id="filter-gamo" v-model="filter.assesment" label="Filter GAMO yang Ditampilkan"
            default-option="Pilih Opsi Filter" :options="summary.optionsFilterAssessment" options-label="label"
            options-value="value" :disabled="summary.loading" />
        </div>
      </div>


      <DataTable :headers="summary.headers" :items="summary.data" :loading="summary.loading"
        :server-items-length="summary.meta.total" v-model:server-options="serverOptions" fixed-header>
        <template #header-suggest_capability_level="header">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ header.item.text }}
          </div>
        </template>

        <template #header-aggreed_capability_level="header">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ header.item.text }}
          </div>
        </template>

        <template #header-assessment="header">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ header.item.text }}
          </div>
        </template>

        <template #header-target="header">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ header.item.text }}
          </div>
        </template>

        <template #item-kode="item">
          <div class="d-flex flex-column">
            <div v-if="item.item?.kode" class="width-250px text-break text-wrap fw-bold" v-html="item.item?.kode" />
            <div v-if="item.item?.ket" class="width-250px text-break text-wrap" v-html="item.item?.ket" />
          </div>
        </template>

        <template #item-suggest_capability_level="item">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ item.item.suggest_capability_level }}
          </div>
        </template>

        <template #item-aggreed_capability_level="item">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ item.item.aggreed_capability_level }}
          </div>
        </template>

        <template #item-target="item">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ item.item.target || "-" }}
          </div>
        </template>

        <template #item-assessment="item">
          <div class="d-flex justify-content-center align-items-center w-100">
            <span class="badge rounded-pill font-medium text-capitalize fw-bold"
              :class="classIsNeedAssessment(item.item?.is_assessment)">
              {{ item.item?.is_assessment }}
            </span>
          </div>
        </template>
      </DataTable>
    </div>

  </div>
</template>