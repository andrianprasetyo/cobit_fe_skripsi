<script setup>
import { onMounted } from 'vue'
import { useTitle } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

import AssessmentDashboardBanner from '@/views/project/assessment/dashboard/components/AssessmentDashboardBanner.vue'
import AssessmentDashboardCardSection from '@/views/project/assessment/dashboard/components/AssessmentDashboardCardSection.vue'
import AssessmentDashboardDesignFactorChart from '@/views/project/assessment/dashboard/components/AssessmentDashboardDesignFactorChart.vue'
import AssessmentDashboardListGamo from '@/views/project/assessment/dashboard/components/AssessmentDashboardListGamo.vue'
import TabChartAdjustment from '@/views/project/assessment/report-gamo/components/TabChartAdjustment.vue'

const auth = useAuth()
const route = useRoute()
const title = useTitle()
const assessment = useAssessmentStore()

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  auth.setMenuToProject()
  assessment.getDetailAssessment({ id: route.params?.id }).then(() => {
    title.value = `Dashboard Project ${assessment.detail?.nama || ''}`
  })
})
</script>

<template>
  <div>
    <AssessmentDashboardBanner />

    <section>
      <AssessmentDashboardCardSection />

      <div class="row">
        <div class="col-12">
          <TabChartAdjustment />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-8 d-flex align-items-strech">
          <AssessmentDashboardDesignFactorChart />
        </div>

        <div class="col-12 col-md-4 d-flex align-items-strech">
          <AssessmentDashboardListGamo />
        </div>
      </div>
    </section>
  </div>
</template>