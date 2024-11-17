<script setup>
import { defineAsyncComponent, ref, computed, watch, onMounted, onUnmounted, reactive } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseTab from '@/components/Tab/BaseTab.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import SearchInput from '@/components/Input/SearchInput.vue'
import ModalFilterListCard from '@/views/project/assessment/components/ModalFilterListCard.vue'

import { useAuth } from '@/stores/auth'
import { useAppConfig } from '@/stores/appConfig'

const router = useRouter()
const route = useRoute()
const auth = useAuth()
const appConfig = useAppConfig()

const TabProjectListCard = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/AssessmentListAllCard.vue'),
})

const TabProjectListTable = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/AssessmentListTable.vue'),
})

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const tab = ref("grid")

const assessment = reactive({
  openModalFilter: false
})

const filter = computed(() => ({
  search: route.query?.search,
  organisasi_id: route.query?.organisasi_id
}))

const isActiveFilter = computed(() => {
  return Object.keys(filter.value).some((key) => filter.value[key])
})

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

const handleNavigateAdd = () => {
  router.push('/project/assessment/add')
}

const toggleModalFilter = () => {
  assessment.openModalFilter = !assessment.openModalFilter
}

const handleFilterList = (payload) => {
  router.replace({
    query: { ...payload }
  })
}

const handleResetFilter = () => {
  router.replace({ query: null })
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
      <div class="card mb-0">
        <div class="card-header">
          <div
            class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
            <div class="mb-3 mb-sm-0">
              <h5 class="card-title fw-semibold">Project</h5>
              <p class="card-subtitle mb-0">Daftar Project yang terdaftar di Aplikasi</p>
            </div>

            <div
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
              <SearchInput v-model="filter.search" placeholder="Cari Project" :is-append-to-query="true" />

              <BaseButton :access="['project-add']" @click="handleNavigateAdd"
                class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3" title="Tambah Project">
                <template #icon-left>
                  <TablerIcon size="16" icon="PlusIcon" />
                </template>
              </BaseButton>

              <BaseButton @click="toggleModalFilter" class="btn btn-outline-primary ms-0 ms-md-3 mt-3 mt-md-0"
                title="Filter">
                <template #icon-left>
                  <TablerIcon size="16" icon="FilterIcon" />
                </template>
              </BaseButton>

              <BaseButton v-if="isActiveFilter" @click="handleResetFilter" v-tooltip="`Reset Filter`"
                class="btn btn-danger ms-0 ms-md-3 mt-3 mt-md-0" title="Reset">
                <template #icon-left>
                  <TablerIcon size="16" icon="ReloadIcon" />
                </template>
              </BaseButton>

              <BaseButton v-if="tab === 'table'" class="btn btn-outline-primary ms-0 ms-md-3 mt-3 mt-md-0"
                @click="handleClickView('grid')" v-tooltip="`Lihat Tampilan Grid`">
                <template #icon-left>
                  <TablerIcon size="16" icon="LayoutGridIcon" />
                </template>
              </BaseButton>

              <BaseButton v-else class="btn btn-outline-primary ms-0 ms-md-3 mt-3 mt-md-0"
                v-tooltip="`Lihat Tampilan Table`" @click="handleClickView('table')">
                <template #icon-left>
                  <TablerIcon size="16" icon="ListDetailsIcon" />
                </template>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <BaseTab class="nav nav-pills nav-fill">
        <template #tab-navigation>
          <li class="nav-item d-none" role="presentation">
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
          <li class="nav-item d-none" role="presentation">
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

    <ModalFilterListCard :open="assessment.openModalFilter" @close="toggleModalFilter" @submit="handleFilterList"
      :active-filter="filter" />
  </div>
</template>