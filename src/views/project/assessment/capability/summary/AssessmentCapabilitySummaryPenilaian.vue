<script setup>
import { reactive, computed, onMounted, ref, watch } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'

import { useAppConfig } from '@/stores/appConfig'
import { useRoute } from 'vue-router'
import { useToast } from '@/stores/toast'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

import AssessmentTargetServices from '@/services/lib/assessment-target'

const assessmentStore = useAssessmentStore()
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

/* ---------------------------------- STATE --------------------------------- */
const summary = reactive({
  loading: false,
  progress: {
    loading: false,
    data: {
      total_progress: 0,
      total_capability: 0,
      total_capability_answered: 0,
    }
  },
  listTarget: {
    loading: false,
    data: []
  },
})

const filter = ref({
  target_id: "",
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
      const indexNA = value.findIndex(v => v?.label === 'N/A' || !v?.label)

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

const averageValue = computed(() => {
  return ({ data, key }) => {
    if (!data || data?.length === 0) return 0;

    const sum = data.reduce((acc, value) => {
      if (key) {
        acc += Number(value[key] || 0);
      }
      return acc;
    }, 0);

    const average = sum / data.length;
    return Number(average.toFixed(2)); // Format to 2 decimal places
  };
})

const totalGap = computed(() => {
  const gaps = averageValue.value({ data: assessmentStore.capability.listSummary, key: "total" }) - averageValue.value({ data: assessmentStore.capability.listSummary, key: "target_adjustment" })

  return Number(gaps.toFixed(2))
})

/* --------------------------------- METHODS -------------------------------- */
const getSummary = async () => {
  try {
    summary.loading = true
    const response = await assessmentStore.getCapabilitySummaryAssessment({
      assesment_id: assessmentId.value,
      target_id: filter.value.target_id?.id
    })

    if (response) {
      summary.loading = false
    }
  } catch (error) {
    summary.loading = false
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


const handleExport = () => {
  const url = `${appConfig.app.appHost}capabilityassesment/summary-by-domain/download?assesment_id=${assessmentId.value}${filter.value.target_id?.id ? `&target_id=${filter.value.target_id?.id}` : ''}`

  window.open(url, '_blank');
}


/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getListTarget({
    assesment_id: assessmentId.value
  });
  getSummary()
})

watch(() => [filter.value], () => {
  getSummary()
}, { deep: true })
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex flex-row justify-content-between align-items-center">
        <div>
          <h5 class="card-title fw-semibold">Summary Penilaian</h5>
          <p class="card-subtitle">Rekapitulasi dari Penilaian Kapabilitas Asesmen</p>
        </div>

        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <BaseButton @click="handleExport" class="btn btn-outline-primary ms-0 mt-3 mt-md-0 ms-md-3"
            title="Export Summary Penilaian" :access="['project-add', 'project-edit']">
            <template #icon-left>
              <TablerIcon icon="FileExportIcon" />
            </template>
          </BaseButton>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="row mb-3">
        <div class="col-12 col-md-4">
          <label class="form-label" for="filter-gamo">Filter Summary Berdasarkan Target</label>

          <v-select id="filter-gamo" :searchable="false" :filterable="false" :options="summary.listTarget.data"
            v-model="filter.target_id" label="nama" placeholder="Tampilkan Semua" :select-on-key-codes="[]">
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
                  <h6 class="fs-3 fw-semibold mb-0">Target Adjustment</h6>
                </th>
                <th class="align-middle text-center" rowspan="2">
                  <h6 class="fs-3 fw-semibold mb-0">Hasil Assessment</h6>
                </th>
                <th class="align-middle text-center" rowspan="2">
                  <h6 class="fs-3 fw-semibold mb-0">Gap</h6>
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
                  {{ item?.target_adjustment }}
                </td>
                <td class="text-center">
                  {{ item?.total }}
                </td>
                <td class="text-center" :class="item?.gap < 0 ? 'text-danger' : 'text-success'">
                  {{ item?.gap > 0 ? `+ ${item?.gap}` : item?.gap }}
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
            <tfoot class="position-sticky bottom-0">
              <tr>
                <td>
                  <div class="fw-bolder">
                    Rata-rata
                  </div>
                </td>
                <td class="bg-primary text-center text-white">
                  {{ averageValue({ data: assessmentStore.capability.listSummary, key: "target_adjustment" }) }}
                </td>
                <td class="bg-primary text-center text-white">
                  {{ averageValue({ data: assessmentStore.capability.listSummary, key: "total" }) }}
                </td>
                <td class="text-center" :class="totalGap < 0 ? 'bg-danger text-white' : 'bg-primary text-white'">
                  <span class="fw-bolder">Gap :</span> <span>{{ totalGap > 0 ? `+ ${totalGap}` : totalGap }}</span>
                </td>
                <td colspan="4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <template v-else>
        <NoData title="Belum Ada Summary" />
      </template>
    </div>
  </div>
</template>