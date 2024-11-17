<script setup>
import { reactive, computed, onMounted } from 'vue'

import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import BaseLightBadge from '@/components/Badge/BaseLightBadge.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'

import { useAppConfig } from '@/stores/appConfig'
import { useRoute } from 'vue-router'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const route = useRoute()
const appConfig = useAppConfig()
const assessmentStore = useAssessmentStore()

/* ---------------------------------- STATE --------------------------------- */
const summary = reactive({
  loading: false,
})

const assessmentId = computed(() => {
  return route.params?.id
})

/* --------------------------------- METHODS -------------------------------- */
const getProgressList = async () => {
  try {
    summary.loading = true
    const response = await assessmentStore.getCapabilityProgressListAssessment({
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
  const url = `${appConfig.app.appHost}capabilityassesment/progress/download?assesment_id=${assessmentId.value}`

  window.open(url, '_blank');
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getProgressList()
})
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex flex-row justify-content-between align-items-center">
        <div>
          <h5 class="card-title fw-semibold">Summary Progress</h5>
          <p class="card-subtitle">Rekapitulasi dari Progress Kapabilitas Asesmen</p>
        </div>

        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <BaseButton @click="handleExport" class="btn btn-outline-primary ms-0 mt-3 mt-md-0 ms-md-3"
            title="Export Summary Progress" :access="['project-add', 'project-edit']">
            <template #icon-left>
              <TablerIcon icon="FileExportIcon" />
            </template>
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="card-body">
      <LoadingOverlay :active="summary.loading" />

      <template
        v-if="Array.isArray(assessmentStore.capability.listProgressLevel) && assessmentStore.capability.listProgressLevel.length">
        <div class="table-responsive rounded-2">
          <div class="mh-100vh">
            <table class="table border customize-table text-nowrap mb-0 align-middle">
              <thead class="position-sticky top-0 bg-white text-dark" style="z-index: 5 !important;">
                <tr>
                  <th class="align-middle" rowspan="2">
                    <h6 class="fs-3 fw-semibold mb-0">Governance and Management Objectives</h6>
                  </th>
                  <th class="align-middle text-center" rowspan="1"
                    :colspan="assessmentStore.capability.listProgressLevel?.length">
                    <h6 class="fs-3 fw-semibold mb-0 text-center">Jumlah Activities</h6>
                  </th>
                  <th class="align-middle text-center bg-primary" rowspan="2">
                    <h6 class="fs-3 fw-semibold mb-0 text-white">Total</h6>
                  </th>
                </tr>

                <tr>
                  <template
                    v-if="Array.isArray(assessmentStore.capability.listProgressLevel) && assessmentStore.capability.listProgressLevel.length">
                    <th v-for="(progressLevel, index) in assessmentStore.capability.listProgressLevel"
                      class="align-middle text-center" :key="`summary-progress-level-header-${index}`">
                      <h6 class="fs-3 fw-semibold mb-0">Level {{ progressLevel }}</h6>
                    </th>
                  </template>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, indexSummaryProgress) in assessmentStore.capability.listProgress"
                  :key="`summary-progress-item-${indexSummaryProgress}`">
                  <td>
                    <div class="fw-bolder">{{ item?.kode }}</div>
                    <div v-html="item.ket" />
                  </td>

                  <template v-if="Array.isArray(item?.levels) && item?.levels?.length">
                    <td v-for="level in item.levels" :key="`level-domain-${item?.id}-${level?.level}`"
                      class="text-center">
                      <div>
                        <h6 class="fw-semibold mb-1">{{ level?.count }}</h6>
                        <BaseLightBadge v-if="level?.answered" size="small"
                          :variant="level?.answered < level?.count ? 'primary' : 'success'"
                          :title="`${level?.answered || 0} Sudah Dinilai`" />
                      </div>
                    </td>
                  </template>

                  <td class="align-middle bg-light">
                    <div class="text-center">
                      <h6 class="fw-semibold mb-1">{{ item?.total }}</h6>
                      <BaseLightBadge v-if="item?.total_answered" size="small"
                        :variant="item?.total_answered < item?.total ? 'primary' : 'success'"
                        :title="`${item?.total_answered || 0} Sudah Dinilai`" />
                    </div>
                  </td>
                </tr>
              </tbody>

              <tfoot class="position-sticky bottom-0">
                <tr>
                  <td colspan="5">
                    <div class="fw-bolder">
                      Total Activites
                    </div>
                  </td>
                  <td class="bg-primary text-center text-white">
                    {{ assessmentStore.capability.listProgressTotal }}
                  </td>
                </tr>
                <tr>
                  <td colspan="5">
                    <div class="fw-bolder">
                      Total Activities Sudah Dinilai
                    </div>
                  </td>
                  <td class="text-center text-white"
                    :class="assessmentStore.capability.listProgressTotalAnswered < assessmentStore.capability.listProgressTotal ? 'bg-success' : 'bg-success'">
                    {{ assessmentStore.capability.listProgressTotalAnswered }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </template>

      <template v-else>
        <NoData title="Belum Ada Summary Progress" />
      </template>
    </div>
  </div>
</template>