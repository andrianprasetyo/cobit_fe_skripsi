<script setup>
import { defineAsyncComponent, ref, computed, watch, onUnmounted, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseTab from '@/components/Tab/BaseTab.vue'
import BaseButton from '@/components/Button/BaseButton.vue'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useTitle } from '@vueuse/core'

const TabGamo = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/report/components/TabGamo.vue')
})

const TabStep2 = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/report/components/TabStep2.vue')
})

const TabStep3 = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/report/components/TabStep3.vue')
})

const TabStep4 = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/report/components/TabStep4.vue')
})

const title = useTitle()
const router = useRouter()
const route = useRoute()
const assessmentStore = useAssessmentStore()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const tab = ref("gamo")

const ViewComponent = {
  gamo: TabGamo,
  step2: TabStep2,
  step3: TabStep3,
  step4: TabStep4
}

const queryView = computed(() => {
  return route.query?.view
})

/* --------------------------------- METHODS -------------------------------- */
const handleClickView = (value) => {
  router.replace({
    query: { view: value }
  })
}

const handleBack = () => {
  router.back()
}


/* ---------------------------------- HOOKS --------------------------------- */
watch(() => queryView.value, (value) => {
  switch (value) {
    case 'gamo':
      tab.value = 'gamo'
      break;
    case 'step2':
      tab.value = 'step2'
      break;
    case 'step3':
      tab.value = 'step3'
      break;
    case 'step4':
      tab.value = 'step4'
      break;
    default:
      tab.value = 'gamo';
      break;
  }
}, { deep: true, immediate: true })

onMounted(() => {
  if (assessmentStore.selectedAssessment?.nama) {
    title.value = `Report ${assessmentStore.selectedAssessment?.nama || ''}`
  }
})

onUnmounted(() => {
  assessmentStore.resetState()
})

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <BaseTab>
        <template #tab-navigation>
          <li class="nav-item" role="presentation">
            <BaseButton @click="handleClickView('gamo')"
              class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-4"
              :class="[tab === 'gamo' ? 'active' : '']" id="pills-gamo-tab" role="tab" aria-controls="pills-gamo"
              aria-selected="true">
              <div class="d-flex flex-row align-items-center">
                <TablerIcon icon="SquareNumber1Icon" class="me-2" />
                <span class="d-none d-md-block width-150px text-truncate">Governance and Management Objectives</span>
              </div>
            </BaseButton>
          </li>
          <li class="nav-item" role="presentation">
            <BaseButton @click="handleClickView('step2')"
              class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-4"
              :class="[tab === 'step2' ? 'active' : '']" id="pills-step2-tab" role="tab" aria-controls="pills-step2"
              aria-selected="true">
              <div class="d-flex flex-row align-items-center">
                <TablerIcon icon="SquareNumber2Icon" class="me-2" />
                <span class="d-none d-md-block width-150px text-truncate">Step 2 : Determine the initial scope of the
                  Governance System</span>
              </div>
            </BaseButton>
          </li>
          <li class="nav-item" role="presentation">
            <BaseButton @click="handleClickView('step3')"
              class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-4"
              :class="[tab === 'step3' ? 'active' : '']" id="pills-step3-tab" role="tab" aria-controls="pills-step3"
              aria-selected="true">
              <div class="d-flex flex-row align-items-center">
                <TablerIcon icon="SquareNumber3Icon" class="me-2" />
                <span class="d-none d-md-block width-150px text-truncate">Step 3 : Refine the scope of the Governance
                  System</span>
              </div>
            </BaseButton>
          </li>
          <li class="nav-item" role="presentation">
            <BaseButton @click="handleClickView('step4')"
              class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-4"
              :class="[tab === 'step4' ? 'active' : '']" id="pills-step4-tab" role="tab" aria-controls="pills-step4"
              aria-selected="true">
              <div class="d-flex flex-row align-items-center">
                <TablerIcon icon="SquareNumber4Icon" class="me-2" />
                <span class="d-none d-md-block width-150px text-truncate">Step 4 : Conclude the Scope of the Governance
                  System</span>
              </div>
            </BaseButton>
          </li>
        </template>

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