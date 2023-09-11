<script setup>
import { reactive, watch } from 'vue'

import BaseModal from '@/components/Modal/BaseModal.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'

import { useRoute } from 'vue-router'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const averageCompliance = reactive({
  loading: false
})

const emits = defineEmits(['close', 'refresh'])

const route = useRoute()
const assessmentStore = useAssessmentStore()

/* --------------------------------- METHODS -------------------------------- */
const handleClose = () => {
  assessmentStore.setCapabilityAverageComplianceLevel = null
  emits('close', true)
}

const getCapabilityAverageAverageComplianceLevel = async () => {
  try {
    averageCompliance.loading = true;

    const response = await assessmentStore.getCapabilityAverageAverageComplianceLevel({
      domain_id: assessmentStore.capability.selectedGamo?.id,
      assesment_id: route.params?.id
    })

    if (response) {
      averageCompliance.loading = false
    }
  } catch (error) {
    averageCompliance.loading = false
  }
}

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => [props.isShow], () => {
  if (props.isShow) {
    getCapabilityAverageAverageComplianceLevel()
  }
}, { deep: true, immediate: true })

</script>

<template>
  <BaseModal id="summary_compliance" :order="5" :open="props.isShow" classNameModal="modal-lg" @close="handleClose">
    <template #header>
      <h4 class="modal-title text-truncate">
        Nilai Rata-rata Level Kapabilitas {{ assessmentStore.capability.selectedGamo?.kode }}
      </h4>
    </template>

    <template #body>

      <LoadingOverlay :active="averageCompliance.loading" />

      <template
        v-if="Array.isArray(assessmentStore.capability.averageComplianceLevel?.list) && assessmentStore.capability.averageComplianceLevel?.list.length">
        <div class="table-responsive rounded-2 mb-4 mt-4">
          <div class="mh-100vh">
            <table class="table border customize-table text-nowrap mb-0 align-middle">
              <thead class="position-sticky top-0 bg-white text-dark" style="z-index: 5 !important;">
                <tr>
                  <th class="align-middle text-center">
                    <h6 class="fs-3 fw-semibold mb-0">Level</h6>
                  </th>
                  <th class="align-middle text-center">
                    <h6 class="fs-3 fw-semibold mb-0">Compliance</h6>
                  </th>
                </tr>
              </thead>
              <tbody>
                <template
                  v-if="Array.isArray(assessmentStore.capability.averageComplianceLevel?.list) && assessmentStore.capability.averageComplianceLevel?.list.length">
                  <tr v-for="(average, index) in assessmentStore.capability.averageComplianceLevel?.list"
                    :key="`average-${index}-${average?.id}`">
                    <td class="text-center">
                      {{ average?.level }}
                    </td>
                    <td class="text-center">
                      {{ average?.kompilasi }}
                    </td>
                  </tr>
                </template>
              </tbody>
              <tfoot class="position-sticky bottom-0">
                <tr>
                  <td class="align-middle text-center">
                    <h6 class="fs-3 fw-semibold mb-0">Rata-rata</h6>
                  </td>
                  <td class="align-middle text-center bg-primary">
                    <h6 class="fs-3 fw-semibold mb-0 text-white">{{
                      assessmentStore.capability.averageComplianceLevel?.total
                    }}</h6>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </template>

      <template v-else>
        <NoData title="Belum Ada Nilai Rata-rata" />
      </template>

    </template>
  </BaseModal>
</template>