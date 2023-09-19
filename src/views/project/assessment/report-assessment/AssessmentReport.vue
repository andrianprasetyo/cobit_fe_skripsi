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

const TabList = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/report-assessment/components/TabList.vue'),
})

const TabChart = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/report-assessment/components/TabChart.vue')
})

const appConfig = useAppConfig()
const title = useTitle()
const router = useRouter()
const route = useRoute()
const assessmentStore = useAssessmentStore()

const tab_report = ref("list")

const props = defineProps({
  isShowBreadCrumb: {
    type: Boolean,
    default: true
  },
  isToggleSidebar: {
    type: Boolean,
    default: true
  }
})

const ViewComponent = {
  list: TabList,
  chart: TabChart
}

const queryTabReport = computed(() => {
  return route.query?.tab_report
})

const assessmentTitle = computed(() => {
  return route.query?.assessment
})

/* --------------------------------- METHODS -------------------------------- */
const handleClickTab = ({ tab_report }) => {
  router.replace({
    query: { ...route.query, tab_report }
  })
}

const handleBack = () => {
  router.back()
}

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => queryTabReport.value, (value) => {
  if (value) {
    tab_report.value = value;
  }
}, { deep: true, immediate: true })

onMounted(() => {
  if (props.isToggleSidebar) {
    appConfig.setMiniSidebar(true)
    if (assessmentTitle.value) {
      title.value = `Report Asesmen ${assessmentTitle.value || ''}`
    }
  }
})

onUnmounted(() => {
  if (props.isToggleSidebar) {
    appConfig.setMiniSidebar(false)
    assessmentStore.resetState()
  }
})

</script>

<template>
  <div>
    <BreadCrumb v-if="props.isShowBreadCrumb" />

    <section>
      <BaseTab>
        <template #tab-navigation>
          <li class="nav-item" role="presentation">
            <BaseButton @click="handleClickTab({ tab_report: 'list' })"
              class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-4"
              :class="[tab_report === 'list' ? 'active' : '']" :id="`pills-list-tab`" role="tab"
              :aria-controls="`pills-list`" aria-selected="true">
              <div class="d-flex flex-row align-items-center">
                <TablerIcon :icon="`LayoutListIcon`" class="me-2" />
                <span class="d-none d-md-block text-truncate">List Table</span>
              </div>
            </BaseButton>
          </li>

          <li class="nav-item" role="presentation">
            <BaseButton @click="handleClickTab({ tab_report: 'chart' })"
              class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-4"
              :class="[tab_report === 'chart' ? 'active' : '']" :id="`pills-chart-tab`" role="tab"
              :aria-controls="`pills-chart`" aria-selected="true">
              <div class="d-flex flex-row align-items-center">
                <TablerIcon :icon="`ChartDotsIcon`" class="me-2" />
                <span class="d-none d-md-block text-truncate">Chart</span>
              </div>
            </BaseButton>
          </li>
        </template>

        <template #tab-content>
          <RouterView>
            <Transition name="fade-top" mode="out-in">
              <KeepAlive :max="2">
                <component :is="ViewComponent[tab_report]" />
              </KeepAlive>
            </Transition>
          </RouterView>
        </template>
      </BaseTab>

      <div class="card">
        <div class="card-body">
          <div class="d-flex flex-column flex-md-row align-items-center">
            <div>
              <BaseButton @click="handleBack" class="btn btn-outline-primary me-0 me-md-3 mb-2 mb-md-0" title="Kembali">
                <template #icon-left>
                  <TablerIcon icon="ChevronLeftIcon" />
                </template>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>