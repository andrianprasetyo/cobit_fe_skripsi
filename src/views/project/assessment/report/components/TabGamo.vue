<script setup>
import { reactive, watch, ref, onMounted } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import DomainServices from '@/services/lib/domain'

import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'
import { useAppConfig } from '@/stores/appConfig'

const toast = useToast()
const route = useRoute()
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
  }, {
    text: 'Target Capability Adjustment',
    value: 'aggreed_capability_level'
  }
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

/* --------------------------------- METHODS -------------------------------- */
const getSummaryGamo = async ({ limit, page, assessment_id }) => {
  try {
    summary.loading = true
    const response = await DomainServices.getSummaryGamo({ limit, page, assessment_id })

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
  const url = `${appConfig.app.appHost}domain/assesment-adjustment/download?id=${route.params?.id}`
  window.open(url, '_blank');
}


/* ---------------------------------- HOOKS --------------------------------- */
watch(() => [serverOptions.value], () => {
  getSummaryGamo({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    assessment_id: route.params?.id
  })
}, { deep: true })

onMounted(() => {
  getSummaryGamo({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    assessment_id: route.params?.id
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
        </div>

        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <BaseButton @click="exportSummaryGamo" class="btn btn-outline-primary" title="Export Summary"
            :disabled="summary.loading">
            <template #icon-right>
              <TablerIcon size="16" icon="FileExportIcon" />
            </template>
          </BaseButton>
        </div>
      </div>


      <DataTable :headers="summary.headers" :items="summary.data" :loading="summary.loading"
        :server-items-length="summary.meta.total" v-model:server-options="serverOptions" fixed-header>
        <template #header-suggest_capability_level="header">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ header.item.text }}
          </div>
        </template>

        <template #header-assessment="header">
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
      </DataTable>
    </div>

  </div>
</template>