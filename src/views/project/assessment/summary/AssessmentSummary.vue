<script setup>
import { defineAsyncComponent, ref, computed, watch, onMounted, onUnmounted, reactive } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import BaseAlert from '@/components/Alert/BaseAlert.vue'
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseTab from '@/components/Tab/BaseTab.vue'
import BaseButton from '@/components/Button/BaseButton.vue'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useTitle } from '@vueuse/core'
import { useAppConfig } from '@/stores/appConfig'
import { useAuth } from '@/stores/auth'

const TabStep2 = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/summary/components/TabStep2.vue')
})

const TabStep3 = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/summary/components/TabStep3.vue')
})

const TabStep4 = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/summary/components/TabStep4.vue')
})

const appConfig = useAppConfig()
const title = useTitle()
const router = useRouter()
const route = useRoute()
const auth = useAuth()
const assessment = useAssessmentStore()

/* ---------------------------------- STATE & COMPUTED --------------------------------- */
const tab = ref("step2")

const state = reactive({
  loadingSubmit: false
})

const ViewComponent = {
  step2: TabStep2,
  step3: TabStep3,
  step4: TabStep4,
}

const queryView = computed(() => {
  return route.query?.view
})

const assessmentTitle = computed(() => {
  return route.query?.assessment
})

/* --------------------------------- METHODS -------------------------------- */
const handleClickView = (value) => {
  router.replace({
    query: { ...route.query, view: value }
  })
}

const handleBack = () => {
  router.back()
}

const getReportCanvasAssessment = () => {
  assessment.getReportCanvasAssessment({ assessment_id: route.params?.id }).then(() => {
    if (assessment.selectedAssessment?.nama) {
      title.value = `Summary GAMO ${assessment.selectedAssessment?.nama || ''}`
    }

  })
}

const onSubmitAdjustment = () => {
  assessment.setAdjustmentCanvasAssessment({
    assement_id: route.params?.id,
    data: assessment.reportCanvasSummary
  })
}

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => queryView.value, (value) => {
  switch (value) {
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
      tab.value = 'step2';
      break;
  }
}, { deep: true, immediate: true })

onMounted(() => {
  auth.setMenuToProject()
  appConfig.setMiniSidebar(true)
  getReportCanvasAssessment()
})

onUnmounted(() => {
  appConfig.setMiniSidebar(false)
})

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">

        <div class="card-header bg-white">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div class="mb-3 mb-md-0">
              <h5 class="card-title fw-semibold">Summary GAMO</h5>
              <p v-if="assessmentTitle" class="card-subtitle mb-0">{{ assessmentTitle }}</p>
            </div>

            <div
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
              <BaseButton @click="getReportCanvasAssessment" class="btn btn-outline-primary" title="Refresh Data"
                :disabled="state.loadingSubmit">
                <template #icon-left>
                  <TablerIcon icon="RefreshIcon" />
                </template>
              </BaseButton>

              <BaseButton @click="onSubmitAdjustment" class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3"
                title="Simpan Perubahan" :disabled="state.loadingSubmit" :is-loading="state.loadingSubmit">
                <template #icon-left>
                  <TablerIcon icon="DeviceFloppyIcon" />
                </template>
              </BaseButton>

            </div>
          </div>

        </div>

        <div class="card-body">
          <BaseAlert v-if="assessment.getIsAnyDelayReportCanvasSummary" variant="primary">
            <strong>Info.</strong> Data yang ditampilkan mungkin terdapat Perbedaan atau Delay dengan Data yang sedang
            diproses oleh sistem.
          </BaseAlert>

          <BaseTab>
            <template #tab-navigation>
              <li class="nav-item" role="presentation">
                <BaseButton @click="handleClickView('step2')"
                  class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-4"
                  :class="[tab === 'step2' ? 'active' : '']" id="pills-step2-tab" role="tab" aria-controls="pills-step2"
                  aria-selected="true">
                  <div class="d-flex flex-row align-items-center">
                    <TablerIcon icon="SquareNumber2Icon" class="me-2" />
                    <span class="d-none d-md-block width-200px text-truncate">Step 2 : Determine the initial scope of
                      the
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
                    <span class="d-none d-md-block width-200px text-truncate">
                      Step 3 : Refine the scope of the Governance System
                    </span>
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
                    <span class="d-none d-md-block width-200px text-truncate">
                      Step 4 : Conclude the Scope of the Governance System
                    </span>
                  </div>
                </BaseButton>
              </li>
            </template>

            <template #tab-content>
              <RouterView>
                <Transition name="fade" mode="out-in">
                  <KeepAlive :max="2">
                    <component :is="ViewComponent[tab]" />
                  </KeepAlive>
                </Transition>
              </RouterView>
            </template>
          </BaseTab>
        </div>
      </div>

      <div class="card mt-4">
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