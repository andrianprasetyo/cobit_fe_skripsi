<script setup>
import { reactive, watch, ref, computed } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import DomainServices from '@/services/lib/domain'

import { useToast } from '@/stores/toast'
import { useRouter } from 'vue-router'
import { useAppConfig } from '@/stores/appConfig'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const toast = useToast()
const router = useRouter()
const appConfig = useAppConfig()
const assessment = useAssessmentStore()

const emits = defineEmits(['close'])

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

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
    text: 'Agreed Target Capability Level',
    value: 'aggreed_capability_level'
  }, {
    text: 'Assessment',
    value: 'assessment'
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

const classIsNeedAssessment = computed(() => {
  return value => {
    if (value === "Ya") {
      return 'bg-light-success text-success'
    } else {
      return 'bg-light-danger text-danger'
    }
  }
})


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

const handleNavigateToAdjust = () => {
  router.push({ path: `/project/assessment/${assessment.selectedAssessment?.id}/summary` })
}

const exportSummaryGamo = async () => {
  const url = `${appConfig.app.appHost}domain/assesment/download?id=${assessment.selectedAssessment?.id}`
  window.open(url, '_blank');
}

const handleClose = () => {
  emits('close', true)
}


watch(() => [serverOptions.value, props.isShow], () => {
  if (props.isShow) {
    getSummaryGamo({
      limit: serverOptions.value.rowsPerPage,
      page: serverOptions.value.page,
      assessment_id: assessment.selectedAssessment?.id
    })
  } else {
    summary.data = []
  }
}, { deep: true })

</script>

<template>
  <BaseModal id="summary_gamo" :order="2" :open="props.isShow" :showBtnCloseFooter="false" classNameModal="modal-lg"
    @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Summary Governance and Management Objectives
      </h4>
    </template>

    <template #body>
      <div
        class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between mb-4">
        <div>
          <h4>
            Daftar GAMO
          </h4>
        </div>

        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <BaseButton @click="exportSummaryGamo" class="btn btn-outline-primary" title="Export Summary"
            :disabled="summary.loading">
            <template #icon-right>
              <TablerIcon size="16" icon="FileExportIcon" />
            </template>
          </BaseButton>

          <BaseButton v-if="assessment.selectedAssessment.status !== 'completed'" @click="handleNavigateToAdjust"
            class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3" title="Adjust / Sesuaikan GAMO" :disabled="summary.loading">
            <template #icon-right>
              <TablerIcon size="16" icon="AdjustmentsIcon" />
            </template>
          </BaseButton>
        </div>
      </div>

      <DataTable :headers="summary.headers" :items="summary.data" :loading="summary.loading"
        :server-items-length="summary.meta.total" v-model:server-options="serverOptions" fixed-header>
        <template #header-suggest_capability_level="header">
          <div class="d-flex justify-content-center align-items-center width-100px align-middle">
            <div class="d-flex flex-wrap">
              <span class="width-100px text-break text-wrap text-center">
                {{ header.item.text }}
              </span>
            </div>
          </div>
        </template>

        <template #header-aggreed_capability_level="header">
          <div class="d-flex justify-content-center align-items-center width-100px align-middle">
            <div class="d-flex flex-wrap">
              <span class="width-100px text-break text-wrap text-center">
                {{ header.item.text }}
              </span>
            </div>
          </div>
        </template>

        <template #header-assessment="header">
          <div class="d-flex justify-content-center align-items-center width-100px align-middle">
            <div class="d-flex flex-wrap">
              <span class="width-100px text-break text-wrap text-center">
                {{ header.item.text }}
              </span>
            </div>
          </div>
        </template>

        <template #item-kode="item">
          <div class="d-flex flex-column">
            <div v-if="item.item?.kode" class="width-250px text-break text-wrap fw-bold" v-html="item.item?.kode" />
            <div v-if="item.item?.ket" class="width-250px text-break text-wrap" v-html="item.item?.ket" />
          </div>
        </template>

        <template #item-suggest_capability_level="item">
          <div class="d-flex justify-content-center align-items-center width-100px align-middle">
            <div class="d-flex flex-wrap">
              <span class="width-100px text-break text-wrap text-center">
                {{ item.item.suggest_capability_level }}
              </span>
            </div>
          </div>
        </template>

        <template #item-aggreed_capability_level="item">
          <div class="d-flex justify-content-center align-items-center width-100px align-middle">
            <div class="d-flex flex-wrap">
              <span class="width-100px tzext-break text-wrap text-center">
                {{ item.item.aggreed_capability_level }}
              </span>
            </div>
          </div>
        </template>

        <template #item-assessment="item">
          <div class="d-flex justify-content-center align-items-center w-100">
            <span class="badge rounded-pill font-medium text-capitalize fw-bold"
              :class="classIsNeedAssessment(item.item.is_assessment)">
              {{ item.item.is_assessment }}
            </span>
          </div>
        </template>
      </DataTable>
    </template>
  </BaseModal>
</template>