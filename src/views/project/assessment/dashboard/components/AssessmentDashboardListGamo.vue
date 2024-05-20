<script setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

import NoData from '@/components/EmptyPlaceholder/NoData.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import LoadingSkeleton from '@/components/Loading/LoadingSkeleton.vue'

const route = useRoute()
const router = useRouter()
const assessmentStore = useAssessmentStore()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const assessmentId = computed(() => route?.params?.id)

/* --------------------------------- METHODS -------------------------------- */
const handleNavigateToCapability = ({ capability_id, kode }) => {
  assessmentStore.setCapabilitySelectedGamoAssessment({ id: capability_id, kode: kode })
  router.push(`/project/assessment/${assessmentId.value}/capability`)
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  assessmentStore.getCapabilityListGamoAssessment({
    assesment_id: assessmentId.value,
    limit: 100
  })
})
</script>

<template>
  <LoadingSkeleton v-if="assessmentStore.capability.loadingListGamo" class="skeleton-gamo-card" />
  <div v-else class="card w-100 container-dashboard-card-content overflow-auto">
    <div class="card-body">
      <div
        class="mb-4 d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-md-center">
        <div class="w-100 mb-3 mb-md-0">
          <h5 class="card-title fw-semibold">Daftar GAMO</h5>
          <p class="card-subtitle mb-0">Daftar Gamo yang Perlu Diasesmen</p>
        </div>
      </div>

      <template v-if="Array.isArray(assessmentStore.capability.listGamo) && assessmentStore.capability.listGamo.length">
        <div v-for="(item, index) in assessmentStore.capability.listGamo" :key="`gamo-${index}-${item?.id}`"
          class="d-flex align-items-center justify-content-between mb-4"
          @click="handleNavigateToCapability({ capability_id: item?.id, kode: item?.kode })">
          <div class="d-flex cursor-pointer">
            <div class="p-8 bg-primary-subtle rounded-2 d-flex align-items-center justify-content-center me-6">
              <TablerIcon icon="GridDotsIcon" size="18" class="text-primary" />
            </div>
            <div>
              <p class="fs-3 mb-0 fw-normal">GAMO</p>
              <h6 class="mb-1 fs-4 fw-semibold">{{ item?.kode }}</h6>
            </div>
          </div>
          <BaseButton class="btn btn-sm btn-primary rounded">
            <template #icon-right>
              <TablerIcon icon="ChevronRightIcon" />
            </template>
          </BaseButton>
        </div>
      </template>

      <template v-else>
        <NoData title="Tidak Ada Data Gamo" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.container-dashboard-card-content {
  height: calc(100vh);
}

.skeleton-gamo-card {
  height: calc(100vh);
  width: 100%;
  border-radius: 0.5rem;
}
</style>