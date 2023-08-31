<script setup>
import { defineAsyncComponent, ref, computed, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'

/*
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
*/

import BaseTab from '@/components/Tab/BaseTab.vue'

const TabChartAssessmentSummary = defineAsyncComponent({
  loader: () => import('@/views/dashboard/components/ChartAssessmentSummary.vue')
})

// const router = useRouter()
const route = useRoute()

const tab = ref("summary")

const ViewComponent = {
  summary: TabChartAssessmentSummary,
}

const queryView = computed(() => {
  return route.query?.chart_responden
})

/* --------------------------------- METHODS -------------------------------- */
// const handleClickView = (value) => {
//   router.replace({
//     query: { ...route.query, chart_assessment: value }
//   })
// }

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => queryView.value, (value) => {
  switch (value) {
    case 'summary':
      tab.value = 'summary'
      break;
    default:
      tab.value = 'summary';
      break;
  }
}, { deep: true, immediate: true })

</script>

<template>
  <div class="card">
    <BaseTab>
      <!-- <template #tab-navigation>
        <li class="nav-item w-100" role="presentation">
          <BaseButton @click="handleClickView('summary')"
            class="nav-link w-100 position-relative rounded-0 d-flex align-items-center bg-transparent fs-3 py-4"
            :class="[tab === 'summary' ? 'active' : '']" id="pills-summary-tab" role="tab" aria-controls="pills-summary"
            aria-selected="true">
            <div class="d-flex flex-row align-items-center">
              <TablerIcon icon="GraphIcon" class="me-2" />
              <span class="d-none d-md-block">Rekapitulasi Assessment</span>
            </div>
          </BaseButton>
        </li>
      </template> -->

      <template #tab-content>
        <RouterView>
          <Transition name="fade-top" mode="out-in">
            <KeepAlive :max="2">
              <component :is="ViewComponent[tab]" />
            </KeepAlive>
          </Transition>
        </RouterView>
      </template>
    </BaseTab>
  </div>
</template>