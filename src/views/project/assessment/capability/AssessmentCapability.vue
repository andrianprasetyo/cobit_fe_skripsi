<script setup>
import { defineAsyncComponent, watch, onUnmounted, onMounted, ref, computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import debounce from 'lodash.debounce'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseTab from '@/components/Tab/BaseTab.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import BaseAlert from '@/components/Alert/BaseAlert.vue'
import NoOptions from '@/components/EmptyPlaceholder/NoOptions.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'

import { useAuth } from '@/stores/auth'
import { useAppConfig } from '@/stores/appConfig'
import { useTitle } from '@vueuse/core'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const appConfig = useAppConfig()
const router = useRouter()
const route = useRoute()
const auth = useAuth()
const title = useTitle()
const assessmentStore = useAssessmentStore()

const TabStep = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/capability/steps/AssessmentCapabilitySteps.vue'),
})

const TabPBC = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/capability/pbc/AssessmentCapabilityPBC.vue'),
})

const TabRepository = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/capability/repository/AssessmentCapabilityRepository.vue'),
})

const TabSummary = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/capability/summary/AssessmentCapabilitySummary.vue'),
})

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const tab = ref("step")

const ViewComponent = {
  'step': TabStep,
  'pbc': TabPBC,
  'repository': TabRepository,
  'summary': TabSummary,
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

const handleSearchListGamo = debounce(async ({ search }) => {
  assessmentStore.getCapabilityListGamoAssessment({
    search: search,
    assesment_id: route.params?.id,
  })
}, 500)

/*
const handleSearchGamoCapability = debounce(async ({ search }) => {
  try {
    const response = await CapabilityServices.getListGamoCapability({ limit: 10, page: 1, search, assesment_id: route.params?.id })

    if (response) {
      const data = response?.data

      listGamo.data = data?.list || []
    }

  } catch (error) {
    toast.error({ error })
  }
}, 500)
*/

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => queryView.value, (value) => {
  switch (value) {
    case 'step':
      tab.value = 'step'
      break;
    case 'pbc':
      tab.value = 'pbc'
      break;
    case 'repository':
      tab.value = 'repository'
      break;
    case 'summary':
      tab.value = 'summary'
      break;
    default:
      tab.value = 'step';
      break;
  }
}, { deep: true, immediate: true })

onMounted(() => {
  auth.setMenuToProject()
  appConfig.setMiniSidebar(true)

  assessmentStore.getCapabilityListCapabilityAnswerAssessment();
  assessmentStore.getCapabilityListTargetAssessment({
    assesment_id: route.params?.id,
  })

  title.value = `Kapabilitas Asesmen ${assessmentStore.detail?.nama || ''}`

  assessmentStore.getCapabilityListGamoAssessment({
    assesment_id: route.params?.id,
    limit: 100
  })

  assessmentStore.getCapabilityListMediaRepositoryAssessment({ assesment_id: route.params?.id, limit: 12 })
})

onUnmounted(() => {
  appConfig.setMiniSidebar(false)
  assessmentStore.resetState()
})

watch(() => [assessmentStore.capability.selectedGamo], () => {
  if (assessmentStore.capability.selectedGamo?.id) {
    assessmentStore.getCapabilityListLevelAssessment({
      domain_id: assessmentStore.capability.selectedGamo?.id,
    }).then(() => {
      if (Array.isArray(assessmentStore.capability.listLevel) && assessmentStore.capability.listLevel.length) {
        assessmentStore.setCapabilitySelectedLevel(assessmentStore.capability.listLevel?.[0]?.level)
      } else {
        assessmentStore.setCapabilitySelectedLevel("2")
      }
    })

  }
}, { deep: true, immediate: true })
</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div v-if="assessmentStore.capability.listGamo?.length" class="card">
        <div class="card-body">
          <div class="mb-3">
            <h5 class="card-title fw-semibold mb-2">Kapabilitas Asesmen</h5>
            <p v-if="assessmentTitle" class="card-subtitle mb-0">{{ assessmentTitle }}</p>
          </div>

          <BaseAlert v-if="!assessmentStore.capability.selectedGamo && assessmentStore.capability.listGamo?.length"
            variant="primary">
            <strong>Perhatian.</strong> Silahkan pilih <i class="mx-1">GAMO</i> Terlebih Dahulu.
          </BaseAlert>

          <div class="mb-0">
            <label class="form-label" for="list-gamo-capability">Pilih GAMO</label>

            <v-select id="list-gamo-capability" :filterable="false" :searchable="false"
              @search="(search) => handleSearchListGamo({ search })" :options="assessmentStore.capability.listGamo"
              v-model="assessmentStore.capability.selectedGamo" label="kode" placeholder="Silahkan Pilih GAMO"
              :select-on-key-codes="[]" :tabindex="2">
              <template #no-options>
                Tidak ada GAMO Ditemukan
              </template>
            </v-select>
          </div>
        </div>
      </div>

      <template v-if="Array.isArray(assessmentStore.capability.listLevel) && assessmentStore.capability.selectedGamo">
        <BaseTab v-if="assessmentStore.capability.listLevel?.length" class="nav nav-pills nav-fill">
          <template #tab-navigation>
            <li class="nav-item" role="presentation">
              <BaseButton @click="handleClickView('step')"
                class="nav-link d-flex align-items-center justify-content-center fs-3"
                :class="[tab === 'step' ? 'active' : '']" :id="`pills-step-tab`" role="tab"
                :aria-controls="`pills-step`" aria-selected="true">
                <div class="d-flex flex-row align-items-center">
                  <TablerIcon :icon="`ChartBarIcon`" class="me-2" />
                  <span class="d-none d-md-block text-truncate">Level</span>
                </div>
              </BaseButton>
            </li>
            <li class="nav-item" role="presentation">
              <BaseButton @click="handleClickView('pbc')"
                class="nav-link d-flex align-items-center justify-content-center fs-3"
                :class="[tab === 'pbc' ? 'active' : '']" :id="`pills-pbc-tab`" role="tab" :aria-controls="`pills-pbc`"
                aria-selected="true">
                <div class="d-flex flex-row align-items-center">
                  <TablerIcon :icon="`FilesIcon`" class="me-2" />
                  <span class="d-none d-md-block text-truncate">PBC</span>
                </div>
              </BaseButton>
            </li>
            <li class="nav-item" role="presentation">
              <BaseButton @click="handleClickView('repository')"
                class="nav-link d-flex align-items-center justify-content-center fs-3"
                :class="[tab === 'repository' ? 'active' : '']" :id="`pills-repository-tab`" role="tab"
                :aria-controls="`pills-repository`" aria-selected="true">
                <div class="d-flex flex-row align-items-center">
                  <TablerIcon :icon="`DatabaseIcon`" class="me-2" />
                  <span class="d-none d-md-block text-truncate">Repository</span>
                </div>
              </BaseButton>
            </li>
            <li class="nav-item" role="presentation">
              <BaseButton @click="handleClickView('summary')"
                class="nav-link d-flex align-items-center justify-content-center fs-3"
                :class="[tab === 'summary' ? 'active' : '']" :id="`pills-summary-tab`" role="tab"
                :aria-controls="`pills-summary`" aria-selected="true">
                <div class="d-flex flex-row align-items-center">
                  <TablerIcon :icon="`ClipboardDataIcon`" class="me-2" />
                  <span class="d-none d-md-block text-truncate">Summary</span>
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

        <div v-else class="card">
          <div class="card-body">
            <NoData title="Tidak Ada Level Tersedia" />
          </div>
        </div>
      </template>

      <div v-if="!assessmentStore.capability.listGamo?.length" class="card">
        <div class="card-body">
          <div class="mb-3">
            <h5 class="card-title fw-semibold mb-2">Kapabilitas Asesmen</h5>
            <p v-if="assessmentTitle" class="card-subtitle mb-0">{{ assessmentTitle }}</p>
          </div>
          <NoOptions title="Tidak Ada Data Tersedia" />
        </div>
      </div>

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