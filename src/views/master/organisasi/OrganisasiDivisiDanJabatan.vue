<script setup>
import { defineAsyncComponent, ref, computed, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseTab from '@/components/Tab/BaseTab.vue'
import BaseButton from '@/components/Button/BaseButton.vue'

const TabDivisi = defineAsyncComponent({
  loader: () => import('@/views/master/organisasi/components/TabDivisi.vue')
})

const TabJabatan = defineAsyncComponent({
  loader: () => import('@/views/master/organisasi/components/TabJabatan.vue')
})

const router = useRouter()
const route = useRoute()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const tab = ref("divisi")

const ViewComponent = {
  divisi: TabDivisi,
  jabatan: TabJabatan
}

const queryView = computed(() => {
  return route.query?.view
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

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => queryView.value, (value) => {
  switch (value) {
    case 'divisi':
      tab.value = 'divisi'
      break;
    case 'jabatan':
      tab.value = 'jabatan'
      break;
    default:
      tab.value = 'divisi';
      break;
  }
}, { deep: true, immediate: true })

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <BaseTab>
        <template #tab-navigation>
          <li class="nav-item" role="presentation">
            <BaseButton @click="handleClickView('divisi')"
              class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-4"
              :class="[tab === 'divisi' ? 'active' : '']" id="pills-divisi-tab" role="tab" aria-controls="pills-divisi"
              aria-selected="true">
              <div class="d-flex flex-row align-items-center">
                <TablerIcon icon="ListDetailsIcon" class="me-2" />
                <span class="d-none d-md-block">Divisi</span>
              </div>
            </BaseButton>
          </li>
          <li class="nav-item" role="presentation">
            <BaseButton @click="handleClickView('jabatan')"
              class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-4"
              :class="[tab === 'jabatan' ? 'active' : '']" id="pills-jabatan-tab" role="tab" aria-controls="pills-jabatan"
              aria-selected="true">
              <div class="d-flex flex-row align-items-center">
                <TablerIcon icon="TieIcon" class="me-2" />
                <span class="d-none d-md-block">Jabatan</span>
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