<script setup>
import { defineAsyncComponent, ref, computed, watch, onUnmounted, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseTab from '@/components/Tab/BaseTab.vue'
import BaseButton from '@/components/Button/BaseButton.vue'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useTitle } from '@vueuse/core'
import { useAppConfig } from '@/stores/appConfig'
import { useAuth } from '@/stores/auth'

const TabReportGAMO = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/report-gamo/AssessmentReportGamo.vue'),
})

const TabReportDesignFactor = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/report-design-factor/AssessmentReportDesignFactor.vue')
})

const TabReportAssessment = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/report-assessment/AssessmentReport.vue')
})

const appConfig = useAppConfig()
const title = useTitle()
const router = useRouter()
const route = useRoute()
const auth = useAuth()
const assessmentStore = useAssessmentStore()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const report = ref("gamo")

const ViewComponent = {
  gamo: TabReportGAMO,
  design_factor: TabReportDesignFactor,
  assessment: TabReportAssessment,
}

const queryReport = computed(() => {
  return route.query?.report
})

const assessmentTitle = computed(() => {
  return route.query?.assessment
})

/* --------------------------------- METHODS -------------------------------- */
const handleClickReport = (value) => {
  router.replace({
    query: { ...route.query, report: value, mounted: false }
  })
}

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => queryReport.value, (value) => {
  switch (value) {
    case 'gamo':
      report.value = 'gamo'
      break;
    case 'design_factor':
      report.value = 'design_factor'
      break;
    case 'assessment':
      report.value = 'assessment'
      break;
    default:
      report.value = 'gamo';
      break;
  }
}, { deep: true, immediate: true })

onMounted(() => {
  auth.setMenuToProject()
  appConfig.setMiniSidebar(true)
  if (assessmentTitle.value) {
    title.value = `Report Rekapitulasi ${assessmentTitle.value || ''}`
  }
})

onUnmounted(() => {
  appConfig.setMiniSidebar(false)
  assessmentStore.resetState()
})


</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <BaseTab class="nav nav-pills nav-fill">
        <template #tab-navigation>
          <li class="nav-item" role="presentation">
            <BaseButton @click="handleClickReport('gamo')"
              class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center fs-3 py-3 rounded rounded-2"
              :class="[report === 'gamo' ? 'active' : '']" id="pills-gamo-tab" role="tab" aria-controls="pills-gamo"
              aria-selected="true">
              <div class="d-flex flex-row align-items-center">
                <TablerIcon icon="SettingsStarIcon" class="me-2" />
                <span class="d-none d-md-block text-truncate">Report Governance and Management
                  Objectives (GAMO)</span>
              </div>
            </BaseButton>
          </li>

          <li class="nav-item" role="presentation">
            <BaseButton @click="handleClickReport('design_factor')"
              class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center fs-3 py-3 rounded rounded-2"
              :class="[report === 'design_factor' ? 'active' : '']" id="pills-design_factor-tab" role="tab"
              aria-controls="pills-design_factor" aria-selected="true">
              <div class="d-flex flex-row align-items-center">
                <TablerIcon icon="ChartDonutIcon" class="me-2" />
                <span class="d-none d-md-block text-truncate">Report Design Factor</span>
              </div>
            </BaseButton>
          </li>
          <li class="nav-item" role="presentation">
            <BaseButton @click="handleClickReport('assessment')"
              class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center fs-3 py-3 rounded rounded-2"
              :class="[report === 'assessment' ? 'active' : '']" id="pills-assessment-tab" role="tab"
              aria-controls="pills-assessment" aria-selected="true">
              <div class="d-flex flex-row align-items-center">
                <TablerIcon icon="ChartDotsIcon" class="me-2" />
                <span class="d-none d-md-block text-truncate">Report Asesmen</span>
              </div>
            </BaseButton>
          </li>
        </template>

        <template #tab-content>
          <RouterView>
            <component :is="ViewComponent[report]" :isShowBreadCrumb="false" :isToggleSidebar="false" />
          </RouterView>
        </template>
      </BaseTab>
    </section>
  </div>
</template>