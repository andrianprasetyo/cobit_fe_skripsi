<script setup>
import { reactive, computed, onMounted } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'

import { useAppConfig } from '@/stores/appConfig'
import { useRoute } from 'vue-router'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const assessmentStore = useAssessmentStore()
const appConfig = useAppConfig()
const route = useRoute()

/* ---------------------------------- STATE --------------------------------- */
const summary = reactive({
  loading: false,
})

const assessmentId = computed(() => {
  return route.params?.id
})

const isLastValueLevelNotNA = computed(() => {
  return ({ index, lastIndex, label }) => {
    return ((index + 1 === lastIndex) && label !== 'N/A')
  }
})

const indexIsLastValueLevelNA = computed(() => {
  return value => {
    if (Array.isArray(value) && value.length) {
      const indexNA = value.findIndex(v => v?.label === 'N' || v?.label === 'N/A')

      if (indexNA !== -1) {
        return indexNA - 1
      } else {
        return -1
      }
    } else {
      return -1
    }
  }
})

/* --------------------------------- METHODS -------------------------------- */
const getSummary = async () => {
  try {
    summary.loading = true
    const response = await assessmentStore.getCapabilitySummaryAssessment({
      assesment_id: assessmentId.value,
    })

    if (response) {
      summary.loading = false
    }
  } catch (error) {
    summary.loading = false
  }
}

const handleExport = () => {
  const url = `${appConfig.app.appHost}capabilityassesment/summary-by-domain/download?assesment_id=${assessmentId.value}`
  window.open(url, '_blank');
}

onMounted(() => {
  getSummary()
})

</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex flex-row justify-content-between align-items-center">
        <h5 class="card-title mb-3 mb-md-0 fw-semibold">Summary</h5>

        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <BaseButton @click="handleExport" class="btn btn-outline-primary ms-0 mt-3 mt-md-0 ms-md-3"
            title="Export Summary">
            <template #icon-left>
              <TablerIcon icon="FileExportIcon" />
            </template>
          </BaseButton>
        </div>
      </div>

      <LoadingOverlay :active="summary.loading" />

      <div v-if="Array.isArray(assessmentStore.capability.listSummary) && assessmentStore.capability.listSummary.length"
        class="table-responsive rounded-2 mb-4 mt-4">
        <div class="mh-100vh">
          <table class="table border customize-table text-nowrap mb-0 align-middle">
            <thead class="position-sticky top-0 bg-white text-dark" style="z-index: 5 !important;">
              <tr>
                <th class="align-middle" rowspan="2">
                  <h6 class="fs-3 fw-semibold mb-0">Governance and Management Objectives</h6>
                </th>
                <th class="align-middle text-center" rowspan="2">
                  <h6 class="fs-3 fw-semibold mb-0">Hasil Assessment</h6>
                </th>
                <th class="align-middle text-center" rowspan="1"
                  :colspan="assessmentStore.capability.listSummaryLevel?.length">
                  <h6 class="fs-3 fw-semibold mb-0 text-center">Level</h6>
                </th>
              </tr>
              <tr>
                <template
                  v-if="Array.isArray(assessmentStore.capability.listSummaryLevel) && assessmentStore.capability.listSummaryLevel.length">
                  <th v-for="(summaryLevel, index) in assessmentStore.capability.listSummaryLevel"
                    class="align-middle text-center" :key="`summary-level-header-${index}`">
                    <h6 class="fs-3 fw-semibold mb-0">{{ summaryLevel }}</h6>
                  </th>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, indexSummary) in assessmentStore.capability.listSummary"
                :key="`summary-item-${indexSummary}`">
                <td>
                  <div class="fw-bolder">{{ item?.kode }}</div>
                  <div v-html="item.ket" />
                </td>
                <td class="text-center">
                  {{ item?.total }}
                </td>

                <template v-if="Array.isArray(item?.level) && item?.level?.length">
                  <template v-if="item?.level?.length">
                    <td v-for="(level, index) in item?.level" :key="`value-level-${index}-${indexSummary}`"
                      v-tooltip="`${level?.total_compilance}`" class="text-center">
                      <span
                        v-if="(indexIsLastValueLevelNA(item?.level) === index) || isLastValueLevelNotNA({ index: index, lastIndex: item?.level?.length, label: level?.label })"
                        class="badge rounded-pill font-medium text-capitalize fw-bold bg-primary">
                        {{ level?.label }}
                      </span>
                      <span v-else>
                        {{ level?.label }}
                      </span>
                    </td>
                  </template>
                  <template v-else>
                    <td colspan="5" />
                  </template>
                </template>
                <template
                  v-else-if="Array.isArray(assessmentStore.capability.listSummaryLevel) && assessmentStore.capability.listSummaryLevel.length">
                  <td v-for="(index) in assessmentStore.capability.listSummaryLevel"
                    :key="`value-placeholder-${index}-${indexSummary}`" />
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <template v-else>
        <NoData title="Belum Ada Summary" />
      </template>
    </div>
  </div>
</template>