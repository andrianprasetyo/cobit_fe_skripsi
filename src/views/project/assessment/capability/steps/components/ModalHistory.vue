<script setup>
import { reactive, watch, computed } from 'vue'

import BaseModal from '@/components/Modal/BaseModal.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'

import CapabilityServices from '@/services/lib/capability'

import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { formatDateMoments } from '@/utils/momentDateFormat'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'refresh'])

const assessmentStore = useAssessmentStore()

const toast = useToast()
const route = useRoute()

/* ---------------------------------- STATE --------------------------------- */
const history = reactive({
  loading: false,
  data: [],
  meta: {
    current_page: 1,
    per_page: 10,
    total: 0,
    total_page: 0
  },
})

/* -------------------------------- COMPUTED -------------------------------- */
const formatDate = computed(() => {
  return value => {
    return formatDateMoments({ value: value?.value, format: 'LLL' })
  }
})

/* --------------------------------- METHODS -------------------------------- */
const handleClose = () => {
  emits('close', true)
}

const getHistoryGamoCapability = async ({
  domain_id,
  assesment_id,
  limit,
  page,
}) => {
  try {
    history.loading = true;

    const response = await CapabilityServices.getHistoryGamoCapability({
      domain_id,
      assesment_id,
      limit,
      page,
    })

    if (response) {
      const data = response.data

      history.loading = false
      history.data = data?.list || []
      history.meta = data?.meta
    }
  } catch (error) {
    history.loading = false
    toast.error({ error })
  }
}

watch(() => [props.isShow], () => {
  if (props.isShow) {
    getHistoryGamoCapability({
      domain_id: assessmentStore.capability.selectedGamo?.id,
      assesment_id: route.params?.id,
      limit: 99,
      page: 1,
    })
  }
}, { deep: true })

</script>

<template>
  <BaseModal id="history-penilaian" :order="8" :open="props.isShow" classNameModal="modal-lg" @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        History Perubahan
      </h4>
    </template>

    <template #body>
      <div class="mb-5 text-center">
        <h6>
          Governance and Management Objectives (GAMO)
        </h6>
        <h4 class="fw-bolder">
          {{ assessmentStore.capability?.selectedGamo?.kode }}
        </h4>
      </div>

      <LoadingOverlay :active="history.loading" />

      <template v-if="Array.isArray(history.data) && history.data.length">
        <ul class="timeline-widget mb-0 position-relative mb-n5">
          <li v-for="(item, index) in history.data" :key="`history-list-${index}`"
            class="timeline-item d-flex position-relative overflow-hidden">
            <div v-if="item?.created_at" class="timeline-time text-dark flex-shrink-0 text-end">
              {{ formatDate({ value: item?.created_at }) }}
            </div>

            <div class="timeline-badge-wrap d-flex flex-column align-items-center">
              <span class="timeline-badge border-2 border border-primary flex-shrink-0 my-8"></span>
              <span class="timeline-badge-border d-block flex-shrink-0"></span>
            </div>
            <div v-tooltip="`Ketuk untuk melihat Detail Perubahan`" class="timeline-desc fs-3 mt-n1">
              <div class="cursor-pointer" data-bs-toggle="collapse" :href="`#collapse-${index}-${item?.id}`">
                <span class="text-primary fw-bolder">{{ item?.author?.nama }}</span>
                <span class="text-dark d-block fw-normal">Melakukan Perubahan Data</span>
              </div>

              <div class="collapse mt-3" :id="`collapse-${index}-${item?.id}`">
                <div class="text-body json">
                  {{ item?.after }}
                </div>
              </div>
            </div>

          </li>

        </ul>
      </template>

      <template v-else>
        <NoData title="Belum Ada History Perubahan" />
      </template>
    </template>
  </BaseModal>
</template>