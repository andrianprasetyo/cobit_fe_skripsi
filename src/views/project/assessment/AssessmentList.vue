<script setup>
import { defineAsyncComponent, ref, computed, watch, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseTab from '@/components/Tab/BaseTab.vue'
import BaseButton from '@/components/Button/BaseButton.vue'

import { useAuth } from '@/stores/auth'
import { useAppConfig } from '@/stores/appConfig'
import { onUnmounted } from 'vue'


const router = useRouter()
const route = useRoute()
const auth = useAuth()
const appConfig = useAppConfig()

const TabProjectListCard = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/AssessmentListCard.vue'),
})

const TabProjectListTable = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/AssessmentListTable.vue'),
})

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const tab = ref("grid")

const ViewComponent = {
  'grid': TabProjectListCard,
  'table': TabProjectListTable
}

const queryView = computed(() => {
  return route.query?.view
})

/* --------------------------------- METHODS -------------------------------- */
const handleClickView = (view) => {
  router.replace({
    query: { ...route.query, view }
  })
}

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => queryView.value, (value) => {
  if (value) {
    tab.value = value;
  }
}, { deep: true, immediate: true })

onMounted(() => {
  auth.setMenuToDefault()
  appConfig.setMiniSidebar(true)
})

onUnmounted(() => {
  appConfig.setMiniSidebar(false)
})

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <BaseTab class="nav nav-pills nav-fill">
        <template #tab-navigation>
          <li class="nav-item" role="presentation">
            <BaseButton @click="handleClickView('grid')"
              class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center fs-3 py-3 rounded rounded-2"
              :class="[tab === 'grid' ? 'active' : '']" id="pills-grid-tab" role="tab" aria-controls="pills-grid"
              aria-selected="true">
              <div class="d-flex flex-row align-items-center">
                <TablerIcon icon="LayoutGridIcon" class="me-2" />
                <span class="d-none d-md-block text-truncate">Tampilan Grid</span>
              </div>
            </BaseButton>
          </li>
          <li class="nav-item" role="presentation">
            <BaseButton @click="handleClickView('table')"
              class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center fs-3 py-3 rounded rounded-2"
              :class="[tab === 'table' ? 'active' : '']" id="pills-table-tab" role="tab" aria-controls="pills-table"
              aria-selected="true">
              <div class="d-flex flex-row align-items-center">
                <TablerIcon icon="ListDetailsIcon" class="me-2" />
                <span class="d-none d-md-block text-truncate">Tampilan List Table</span>
              </div>
            </BaseButton>
          </li>
        </template>

        <template #tab-content>
          <div class="mt-3">
            <RouterView>
              <Transition name="fade-top" mode="out-in">
                <component :is="ViewComponent[tab]" />
              </Transition>
            </RouterView>
          </div>
        </template>
      </BaseTab>
    </section>
  </div>
</template>