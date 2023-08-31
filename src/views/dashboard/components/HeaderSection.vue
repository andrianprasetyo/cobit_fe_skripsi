<script setup>
import { reactive, onMounted } from 'vue'

import GreetingCard from '@/views/dashboard/components/GreetingCard.vue'
import SummaryCard from '@/views/dashboard/components/SummaryCard.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import DashboardServices from '@/services/lib/dashboard'

import { useToast } from '@/stores/toast'

const toast = useToast()

/* ---------------------------------- STATE --------------------------------- */
const assessment = reactive({
  loading: false,
  data: null
})

/* --------------------------------- METHODS -------------------------------- */
const getAssessment = async () => {
  try {
    assessment.loading = true
    const response = await DashboardServices.getAssessment()

    if (response) {
      const data = response.data
      assessment.data = data?.total || null
      assessment.loading = false
    }
  } catch (error) {
    assessment.loading = false
    toast.error({ error })
  }
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getAssessment()
})

</script>

<template>
  <div class="col-12 col-md-12">
    <GreetingCard />
  </div>

  <div class="row">
    <SummaryCard label="Jumlah Responden" variant="primary" :value="assessment.data?.responden"
      :is-loading="assessment.loading">
      <template #icon>
        <TablerIcon icon="NotesIcon" />
      </template>
    </SummaryCard>

    <SummaryCard label="Jumlah Assessment" variant="primary" :value="assessment.data?.assesment"
      :is-loading="assessment.loading">
      <template #icon>
        <TablerIcon icon="ReportAnalyticsIcon" />
      </template>
    </SummaryCard>

    <SummaryCard label="Jumlah User PIC" variant="primary" :value="assessment.data?.pic" :is-loading="assessment.loading">
      <template #icon>
        <TablerIcon icon="UsersIcon" />
      </template>
    </SummaryCard>
  </div>
</template>