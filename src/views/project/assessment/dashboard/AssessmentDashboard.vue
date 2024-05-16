<script setup>
import { onMounted } from 'vue'
import { useTitle } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import AssessmentDashboardCardSection from '@/views/project/assessment/dashboard/components/AssessmentDashboardCardSection.vue'
import AssessmentReportDesignFactor from '@/views/project/assessment/report-design-factor/AssessmentReportDesignFactor.vue'

const route = useRoute()
const title = useTitle()
const assessment = useAssessmentStore()

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  assessment.getDetailAssessment({ id: route.params?.id }).then(() => {
    title.value = `Dashboard Project ${assessment.detail?.nama || ''}`
  })
})
</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <AssessmentDashboardCardSection />
      <hr />
      <AssessmentReportDesignFactor :isShowBreadCrumb="false" :isShowBackButton="false" />
    </section>
  </div>
</template>