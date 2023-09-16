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

const TabStep = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/report-design-factor/components/TabStep.vue'),
})

const appConfig = useAppConfig()
const title = useTitle()
const router = useRouter()
const route = useRoute()
const assessmentStore = useAssessmentStore()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const tab = ref("DF1")

const ViewComponent = {
  DF1: TabStep,
  DF2: TabStep,
  DF3: TabStep,
  DF4: TabStep,
  DF5: TabStep,
  DF6: TabStep,
  DF7: TabStep,
  DF8: TabStep,
  DF9: TabStep,
  DF10: TabStep,
}

const queryView = computed(() => {
  return route.query?.view
})

const assessmentTitle = computed(() => {
  return route.query?.assessment
})

const mounted = computed(() => {
  return route.query?.mounted
})

/* --------------------------------- METHODS -------------------------------- */
const handleClickView = ({ design_factor_id, design_factor, kode, mounted = true }) => {
  router.replace({
    query: { ...route.query, view: kode, design_factor, design_factor_id, mounted }
  })
}

const handleBack = () => {
  router.back()
}

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => queryView.value, (value) => {
  if (value) {
    tab.value = value;
  }
}, { deep: true, immediate: true })

onMounted(() => {
  appConfig.setMiniSidebar(true)

  assessmentStore.getReportDesignFactorList({
    limit: 99,
  }).then((response) => {
    const data = response?.data

    if (Array.isArray(data?.list) && data?.list.length && !mounted.value) {
      handleClickView({ design_factor: data?.list[0]?.nama, design_factor_id: data?.list[0]?.id, kode: data?.list[0]?.kode, mounted: false })
    }
  })

  if (assessmentTitle.value) {
    title.value = `Report Design Factor ${assessmentTitle.value || ''}`
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
      <BaseTab>
        <template #tab-navigation>
          <template
            v-if="Array.isArray(assessmentStore.reportDesignFactor.listDesignFactor) && assessmentStore.reportDesignFactor.listDesignFactor.length">
            <li v-for="(designFactor, index) in assessmentStore.reportDesignFactor.listDesignFactor" class="nav-item"
              role="presentation" :key="`design-factor-${designFactor?.kode}`">
              <BaseButton
                @click="handleClickView({ design_factor_id: designFactor?.id, kode: designFactor?.kode, design_factor: designFactor?.nama })"
                class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-4"
                :class="[tab === designFactor?.kode ? 'active' : '']" :id="`pills-${designFactor?.kode}-tab`" role="tab"
                :aria-controls="`pills-${designFactor?.kode}`" aria-selected="true">
                <div class="d-flex flex-row align-items-center">
                  <TablerIcon :icon="`SquareLetter${String.fromCharCode(64 + (index + 1))}Icon`" class="me-2" />
                  <span class="d-none d-md-block text-truncate">{{ designFactor?.kode }}</span>
                </div>
              </BaseButton>
            </li>
          </template>
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