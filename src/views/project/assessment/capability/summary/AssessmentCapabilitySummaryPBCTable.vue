<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'

import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'
import BaseLightBadge from '@/components/Badge/BaseLightBadge.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'
import EasyPagination from '@/components/Pagination/EasyPagination.vue'

import CapabilityServices from '@/services/lib/capability'

import { useAppConfig } from '@/stores/appConfig'
import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'

const toast = useToast()
const route = useRoute()
const appConfig = useAppConfig()

/* ---------------------------------- STATE --------------------------------- */
const summary = reactive({
  loading: false,
  data: [],
  selectedIdGamo: [],
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

/* -------------------------------- COMPUTED -------------------------------- */
const assessmentId = computed(() => {
  return route.params?.id
})

const isActiveGamo = computed(() => idValue => {
  return summary.selectedIdGamo.includes(idValue)
})

const variantStatusPbc = computed(() => {
  return value => {
    if (value === 'not_yet') {
      return 'danger'
    } else if (value === 'on_process') {
      return 'warning'
    } else if (value === 'done') {
      return 'success'
    } else if (value === 'outstanding') {
      return 'danger'
    } else {
      return 'disable'
    }
  }
})

const titleStatusPbc = computed(() => {
  return value => {
    if (value === 'not_yet') {
      return 'Not Yet'
    } else if (value === 'on_process') {
      return 'On Process'
    } else if (value === 'done') {
      return 'Done'
    } else if (value === 'outstanding') {
      return 'Outstanding'
    } else {
      return 'Belum ada Status'
    }
  }
})

/* --------------------------------- METHODS -------------------------------- */
const getSummaryPBCList = async ({ assesment_id, limit, page, sortBy, sortType }) => {
  try {
    summary.loading = true
    const response = await CapabilityServices.getPBCListCapability({ limit, page, sortBy, sortType, assesment_id })

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

const toggleActiveGamo = (idValue) => {
  const isIncluded = summary.selectedIdGamo.includes(idValue)

  if (!isIncluded) {
    const newSelectedIdGamo = [...summary.selectedIdGamo, idValue]

    summary.selectedIdGamo = newSelectedIdGamo;
  } else {
    const filteredSelectedIdGamo = summary.selectedIdGamo.filter(idGamo => idGamo !== idValue);

    summary.selectedIdGamo = filteredSelectedIdGamo;
  }
}

const handleExport = () => {
  const url = `${appConfig.app.appHost}capabilityassesment/pbc/download?limit=100&page=1&assesment_id=${assessmentId.value}`

  window.open(url, '_blank');
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getSummaryPBCList({
    assesment_id: assessmentId.value,
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
  })
})

watch(() => [serverOptions.value], () => {
  getSummaryPBCList({
    assesment_id: assessmentId.value,
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
  })
}, { deep: true })
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex flex-row justify-content-between align-items-center">
        <div>
          <h5 class="card-title fw-semibold">Summary Status PBC</h5>
          <p class="card-subtitle">Rekapitulasi dari Status PBC Kapabilitas Asesmen</p>
        </div>

        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <BaseButton @click="handleExport" class="btn btn-outline-primary ms-0 mt-3 mt-md-0 ms-md-3"
            title="Export Summary Status PBC" :access="['project-add', 'project-edit']">
            <template #icon-left>
              <TablerIcon icon="FileExportIcon" />
            </template>
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="card-body">
      <LoadingOverlay :active="summary.loading" />

      <template v-if="Array.isArray(summary.data) && summary.data.length">
        <div class="table-responsive rounded-2">
          <div class="mh-100vh">
            <table class="table border customize-table text-nowrap mb-0 align-middle">
              <thead class="position-sticky top-0 bg-white text-dark" style="z-index: 5 !important;">
                <tr>
                  <th class="align-middle" colspan="3">
                    <h6 class="fs-3 fw-semibold mb-0">Governance and Management Objectives</h6>
                  </th>
                  <th class="width-50px" />
                </tr>
              </thead>

              <tbody>
                <template v-for="(item, indexSummary) in summary.data" :key="`summary-domain-pbc-item-${indexSummary}`">
                  <tr @click="toggleActiveGamo(item?.id)" class="cursor-pointer">
                    <td :class="{ 'bg-light-primary': isActiveGamo(item?.id) }" colspan="2">
                      <div class="text-break text-wrap fw-bolder text-primary">{{ item?.kode }}</div>
                      <div v-html="item.ket" />
                    </td>
                    <td class="align-middle text-end" :class="{ 'bg-light-primary': isActiveGamo(item?.id) }">
                      <div class="d-flex justify-content-end align-items-end">
                        <BaseLightBadge v-if="item?.capability_level_count"
                          :title="`${item?.capability_level_count || 0} Activities`" variant="primary" />
                      </div>
                    </td>
                    <td class="width-50px align-middle text-end"
                      :class="{ 'bg-light-primary': isActiveGamo(item?.id) }">
                      <TablerIcon :icon="isActiveGamo(item?.id) ? 'ChevronUpIcon' : 'ChevronDownIcon'" />
                    </td>
                  </tr>

                  <template
                    v-if="Array.isArray(item?.capability_level) && item?.capability_level?.length && isActiveGamo(item?.id)">
                    <tr v-for="(capabilityLevel, indexCapabilityLevel) in item?.capability_level"
                      :key="`summary-pbc-capabilityLevel-item-${indexCapabilityLevel}`">
                      <td>
                        <div class="text-break text-wrap fw-bolder text-primary ms-5">
                          {{ capabilityLevel?.domain?.kode }}.{{ capabilityLevel?.kode }}
                        </div>

                        <div class="d-flex flex-wrap mt-2 ms-5">
                          <div v-if="capabilityLevel.kegiatan" class="text-break text-wrap"
                            v-html="capabilityLevel.kegiatan" />
                        </div>
                      </td>
                      <td class="align-middle text-center">
                        Level {{ capabilityLevel?.level }}
                      </td>
                      <td class="text-center">
                        <BaseLightBadge :title="titleStatusPbc(capabilityLevel?.capabilityass?.pbc?.status)"
                          :variant="variantStatusPbc(capabilityLevel?.capabilityass?.pbc?.status)" />
                      </td>
                      <td class="width-50px" />
                    </tr>
                  </template>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <template v-else>
        <NoData title="Belum Ada Summary PBC" />
      </template>

      <div>
        <EasyPagination :loading="summary.loading" :items="summary.data" :server-items-length="summary.meta.total"
          v-model:server-options="serverOptions" />
      </div>
    </div>
  </div>
</template>