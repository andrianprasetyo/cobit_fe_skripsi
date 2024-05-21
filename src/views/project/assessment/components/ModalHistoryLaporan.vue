<script setup>
import { reactive, computed, watch } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import BaseLightBadge from '@/components/Badge/BaseLightBadge.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'
import DocumentPlayer from '@/components/Player/DocumentPlayer.vue'

import AssessmentServices from '@/services/lib/assessment'

import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'
import { formatDateMoments } from '@/utils/momentDateFormat'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
  selectedData: {
    type: Object,
    default: null
  }
})

const emits = defineEmits(['close', 'refresh'])

const route = useRoute()
const toast = useToast()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const historyState = reactive({
  loading: false,
  data: [],
  selectedLaporan: null,
})

const assessmentId = computed(() => route.params?.id)

const formatDate = computed(() => {
  return value => {
    return formatDateMoments({ value: value?.value })
  }
})

/* --------------------------------- METHODS -------------------------------- */
const getHistoryLaporan = async ({ parent_id, assessment_id }) => {
  try {
    historyState.loading = true
    const response = await AssessmentServices.getHistoryLaporan({ parent_id, assessment_id })

    if (response) {
      const data = response?.data

      historyState.data = data || []
      historyState.loading = false
    }
  } catch (error) {
    historyState.loading = false
    toast.error({ error })
  }
}

const resetState = () => {
  historyState.data = []
  historyState.selectedLaporan = null
}

const handleClose = () => {
  resetState()
  emits('close', true)
}

const handleSelectedLaporan = (laporan) => {
  historyState.selectedLaporan = laporan
}

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => props.isShow,
  () => {
    if (props.isShow && props.selectedData) {
      getHistoryLaporan({ parent_id: props.selectedData?.parent_id || props.selectedData?.id, assessment_id: assessmentId.value })
    }
  }, { deep: true })

</script>

<template>
  <BaseModal id="history_media_file_laporan" :order="3" :open="props.isShow" :showBtnCloseFooter="true"
    classNameModal="modal-lg" @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        History Laporan
      </h4>
    </template>

    <template #body>
      <div class="position-relative">
        <LoadingOverlay :height="40" :active="historyState.loading" />
        <template v-if="!historyState.loading && Array.isArray(historyState.data) && historyState.data.length">
          <div class="row">
            <div class="col-12 col-md-6">
              <ul class="timeline-widget mb-0 position-relative mb-n5">
                <template v-for="item in historyState.data" :key="`history-${item?.id}`">
                  <li class="timeline-item d-flex position-relative overflow-hidden">
                    <div class="timeline-time text-dark flex-shrink-0 text-end">
                      {{ formatDate({ value: item?.created_at }) }}
                    </div>
                    <div class="timeline-badge-wrap d-flex flex-column align-items-center">
                      <span class="timeline-badge border-2 border border-info flex-shrink-0 my-8"></span>
                      <span class="timeline-badge-border d-block flex-shrink-0"></span>
                    </div>
                    <div class="timeline-desc fs-3 text-dark mt-n1 fw-semibold">
                      <div>
                        <span>
                          {{ item?.name }}
                        </span>

                        <BaseLightBadge v-if="item?.current" class="ms-2" title="Terbaru" variant="success" />
                      </div>
                      <span class="text-primary d-block fw-normal ">Versi {{ item?.version }}</span>

                      <div class="mt-2">
                        <BaseButton class="btn btn-sm"
                          :class="[historyState.selectedLaporan?.id === item?.id ? 'btn-primary' : 'btn-outline-primary']"
                          title="Lihat Laporan" @click="handleSelectedLaporan(item)">
                          <template #icon-right>
                            <TablerIcon icon="ChevronRightIcon" />
                          </template>
                        </BaseButton>
                      </div>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
            <div v-if="historyState?.selectedLaporan" class="col-12 col-md-6 rounded border p-4 overflow-auto">
              <h4>{{ historyState.selectedLaporan?.name }}</h4>
              <hr />
              <DocumentPlayer :src="historyState.selectedLaporan?.file?.url" />
            </div>
          </div>

        </template>
        <template v-else>
          <NoData title="Tidak Ada Data History" />
        </template>
      </div>
    </template>
  </BaseModal>
</template>