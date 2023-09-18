<script setup>
import { reactive, watch, computed } from 'vue'

import BaseModal from '@/components/Modal/BaseModal.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'

/*
import CapabilityServices from '@/services/lib/capability'

import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'
*/

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

/*
const toast = useToast()
const route = useRoute()
*/

/* ---------------------------------- STATE --------------------------------- */
const history = reactive({
  loading: false,
  data: []
})

/* -------------------------------- COMPUTED -------------------------------- */
const formatDate = computed(() => {
  return value => {
    return formatDateMoments({ value: value?.value })
  }
})

/* --------------------------------- METHODS -------------------------------- */
const handleClose = () => {
  emits('close', true)
}

const getHistoryGamoCapability = async () => {
  /*
  try {
    history.loading = true;

    const response = await CapabilityServices.getHistoryGamoCapability({
      domain_id: assessmentStore.capability.selectedGamo?.id,
      assesment_id: route.params?.id,
    })

    if (response) {
      const data = response.data

      history.loading = false
      history.data = data || []
    }
  } catch (error) {
    history.loading = false
    toast.error({ error })
  }
  */

  history.data = [
    {
      id: 1,
      created_at: '2023-09-18T01:34:55.000000Z',
      history: 'Terdapat Perubahan pada Penilaian',
      user: {
        nama: 'Administrator'
      }
    },
    {
      id: 1,
      created_at: '2023-09-17T01:34:55.000000Z',
      history: 'Terdapat Perubahan pada Penilaian',
      user: {
        nama: 'Administrator'
      }
    }
  ]
}

watch(() => [props.isShow], () => {
  if (props.isShow) {
    getHistoryGamoCapability()
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
          Management Practice Code
        </h6>
        <h4 class="fw-bolder">
          {{ assessmentStore.capability?.selectedSubGamo?.subkode }}
        </h4>
      </div>

      <LoadingOverlay :active="history.loading" />

      <template v-if="Array.isArray(history.data) && history.data.length">
        <ul class="timeline-widget mb-0 position-relative mb-n5">
          <li v-for="(item, index) in history.data" :key="`history-list-${index}`"
            class="timeline-item d-flex position-relative overflow-hidden">
            <div v-if="item?.created_at" class="timeline-time text-dark flex-shrink-0 text-end">{{ formatDate({
              value:
                item?.created_at
            }) }}</div>

            <div class="timeline-badge-wrap d-flex flex-column align-items-center">
              <span class="timeline-badge border-2 border border-primary flex-shrink-0 my-8"></span>
              <span class="timeline-badge-border d-block flex-shrink-0"></span>
            </div>
            <div class="timeline-desc fs-3 text-dark mt-n1 fw-semibold">
              {{ item?.history }}
              <span class="text-primary d-block fw-normal ">{{ item?.user?.nama }}</span>
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