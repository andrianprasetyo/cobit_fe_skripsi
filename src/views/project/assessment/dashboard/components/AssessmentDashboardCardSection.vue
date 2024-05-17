<script setup>
import { reactive, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router'
import { useToast } from '@/stores/toast'

import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import LoadingSkeleton from '@/components/Loading/LoadingSkeleton.vue'
import SummaryCard from '@/views/dashboard/components/SummaryCard.vue'

import AssessmentServices from '@/services/lib/assessment'

const toast = useToast()
const route = useRoute()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const assessmentDashboard = reactive({
  loading: false,
  data: null
})

const assessmentId = computed(() => route.params?.id)

/* --------------------------------- METHODS -------------------------------- */
const getAssessmentSummary = async ({ assesment_id }) => {
  try {
    assessmentDashboard.loading = true

    const response = await AssessmentServices.getDashboardAssessment({ assesment_id })

    if (response) {
      const data = response.data
      assessmentDashboard.data = data
      assessmentDashboard.loading = false
    }
  } catch (error) {
    assessmentDashboard.loading = false
    toast.error({ error })
  }
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getAssessmentSummary({ assesment_id: assessmentId.value })
})
</script>

<template>
  <div class="row">
    <template v-if="assessmentDashboard.loading">
      <div class="col-12 col-md-4 mb-4" v-for="(_, index) in Array.from({ length: 3 })"
        :key="`skeleton-count-${index}`">
        <LoadingSkeleton bg-color="#f2f4f5" class="skeleton-count" />
      </div>
    </template>

    <template v-else>
      <SummaryCard :is-loading="assessmentDashboard.loading" label="Total Responden"
        :value="assessmentDashboard.data?.responden" variant="primary">
        <template #icon>
          <TablerIcon icon="UsersIcon" />
        </template>
      </SummaryCard>

      <SummaryCard :is-loading="assessmentDashboard.loading" label="Total Gamo yang Perlu Diasesmen"
        :value="assessmentDashboard.data?.gamo" variant="primary">
        <template #icon>
          <TablerIcon icon="ChartHistogramIcon" />
        </template>
      </SummaryCard>

      <SummaryCard :is-loading="assessmentDashboard.loading" label="Total Asesmen Target Aktif"
        :value="assessmentDashboard.data?.capability_taget" variant="primary">
        <template #icon>
          <TablerIcon icon="TargetArrowIcon" />
        </template>
      </SummaryCard>
    </template>
  </div>
</template>

<style scoped>
.skeleton-count {
  height: 160px;
  width: 100%;
  border-radius: 0.5rem;
}
</style>