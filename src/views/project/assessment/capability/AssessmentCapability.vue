<script setup>
import { defineAsyncComponent, watch, onUnmounted, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseTab from '@/components/Tab/BaseTab.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import BaseAlert from '@/components/Alert/BaseAlert.vue'
import NoOptions from '@/components/EmptyPlaceholder/NoOptions.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'

import { useAppConfig } from '@/stores/appConfig'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const TabLevel = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/capability/components/TabLevel.vue'),
})

const appConfig = useAppConfig()
const router = useRouter()
const route = useRoute()
const assessmentStore = useAssessmentStore()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const ViewComponent = {
  '2': TabLevel,
  '3': TabLevel,
  '4': TabLevel,
  '5': TabLevel,
}

/* --------------------------------- METHODS -------------------------------- */
const handleClickLevel = (value) => {
  assessmentStore.setCapabilitySelectedLevel(value)
}

const handleBack = () => {
  router.back()
}

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
onMounted(() => {
  appConfig.setMiniSidebar(true)
  assessmentStore.getCapabilityListGamoAssessment({
    assesment_id: route.params?.id
  })
})

onUnmounted(() => {
  appConfig.setMiniSidebar(false)
  assessmentStore.resetState()
})

watch(() => assessmentStore.capability.selectedGamo, (value) => {
  assessmentStore.getCapabilityListLevelAssessment({
    domain_id: value?.id
  })
}, { deep: true })

</script>

<template>
  <div>
    <BreadCrumb />

    <section>

      <div v-if="assessmentStore.capability.listGamo?.length" class="card">
        <div class="card-body">
          <BaseAlert v-if="!assessmentStore.capability.selectedGamo && assessmentStore.capability.listGamo?.length"
            variant="primary">
            <strong>Perhatian.</strong> Silahkan pilih terlebih dahulu GAMO
          </BaseAlert>

          <div class="mb-0">
            <label class="form-label" for="list-gamo-capability">Pilih GAMO</label>

            <v-select id="list-gamo-capability" :filterable="false" :searchable="false"
              :options="assessmentStore.capability.listGamo" v-model="assessmentStore.capability.selectedGamo"
              label="kode" placeholder="Silahkan Pilih GAMO" :select-on-key-codes="[]" :tabindex="1">
              <template #no-options>
                Tidak ada GAMO Ditemukan
              </template>
            </v-select>
          </div>
        </div>
      </div>

      <template v-if="Array.isArray(assessmentStore.capability.listLevel) && assessmentStore.capability.selectedGamo">
        <BaseTab v-if="assessmentStore.capability.listLevel?.length">
          <template #tab-navigation>
            <li v-for="(item, index) in assessmentStore.capability.listLevel" :key="`tab-item-${index}`" class="nav-item"
              role="presentation">
              <BaseButton @click="handleClickLevel(item?.level)"
                class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-4"
                :class="[assessmentStore.capability.selectedLevel === (item?.level || index) ? 'active' : '']"
                :id="`pills-${item?.level || index}-tab`" role="tab" :aria-controls="`pills-${item?.level || index}`"
                aria-selected="true">
                <div class="d-flex flex-row align-items-center">
                  <TablerIcon :icon="`SquareNumber${item?.level || index}Icon`" class="me-2" />
                  <span class="d-none d-md-block width-50px text-truncate">Level {{ item?.level }}</span>
                </div>
              </BaseButton>
            </li>
          </template>

          <template #tab-content>
            <RouterView>
              <Transition name="fade-top" mode="out-in">
                <KeepAlive :max="2">
                  <component :is="ViewComponent[assessmentStore.capability.selectedLevel]" />
                </KeepAlive>
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