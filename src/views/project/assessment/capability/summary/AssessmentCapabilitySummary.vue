<script setup>
import { defineAsyncComponent, watch, ref, computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseTab from '@/components/Tab/BaseTab.vue'
import BaseButton from '@/components/Button/BaseButton.vue'

const router = useRouter()
const route = useRoute()

const TabPenilaian = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/capability/summary/AssessmentCapabilitySummaryPenilaian.vue'),
})

const TabActivities = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/capability/summary/AssessmentCapabilitySummaryActivities.vue'),
})

const TabPBC = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/capability/summary/AssessmentCapabilitySummaryPBC.vue'),
})

/* ---------------------------------- STATE --------------------------------- */
const tab = ref("step")

const ViewComponent = {
  'penilaian': TabPenilaian,
  'activities': TabActivities,
  'pbc': TabPBC,
}

const querySummaryView = computed(() => {
  return route.query?.summary
})
/* --------------------------------- METHODS -------------------------------- */
const handleClickSummaryView = (value) => {
  router.replace({
    query: { ...route.query, summary: value }
  })
}

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => querySummaryView.value, (value) => {
  switch (value) {
    case 'penilaian':
      tab.value = 'penilaian'
      break;
    case 'pbc':
      tab.value = 'pbc'
      break;
    case 'activities':
      tab.value = 'activities'
      break;
    default:
      tab.value = 'penilaian';
      break;
  }
}, { deep: true, immediate: true })

</script>

<template>
  <div>
    <BaseTab>
      <template #tab-navigation>
        <li class="nav-item" role="presentation">
          <BaseButton @click="handleClickSummaryView('penilaian')"
            class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-4"
            :class="[tab === 'penilaian' ? 'active' : '']" :id="`pills-penilaian-tab`" role="tab"
            :aria-controls="`pills-step`" aria-selected="true">
            <div class="d-flex flex-row align-items-center">
              <TablerIcon :icon="`FilePencilIcon`" class="me-2" />
              <span class="d-none d-md-block text-truncate">Penilaian</span>
            </div>
          </BaseButton>
        </li>
        <li class="nav-item" role="presentation">
          <BaseButton @click="handleClickSummaryView('activities')"
            class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-4"
            :class="[tab === 'activities' ? 'active' : '']" :id="`pills-activities-tab`" role="tab"
            :aria-controls="`pills-step`" aria-selected="true">
            <div class="d-flex flex-row align-items-center">
              <TablerIcon :icon="`ReportIcon`" class="me-2" />
              <span class="d-none d-md-block text-truncate">Progress Kapabilitas</span>
            </div>
          </BaseButton>
        </li>
        <li class="nav-item" role="presentation">
          <BaseButton @click="handleClickSummaryView('pbc')"
            class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-4"
            :class="[tab === 'pbc' ? 'active' : '']" :id="`pills-pbc-tab`" role="tab" :aria-controls="`pills-step`"
            aria-selected="true">
            <div class="d-flex flex-row align-items-center">
              <TablerIcon :icon="`ChartPieIcon`" class="me-2" />
              <span class="d-none d-md-block text-truncate">Status PBC</span>
            </div>
          </BaseButton>
        </li>
      </template>

      <template #tab-content>
        <RouterView>
          <Transition name="fade-top" mode="out-in">
            <component :is="ViewComponent[tab]" />
          </Transition>
        </RouterView>
      </template>
    </BaseTab>
  </div>
</template>