<script setup>
import { defineAsyncComponent, ref, computed, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseTab from '@/components/Tab/BaseTab.vue'
import BaseButton from '@/components/Button/BaseButton.vue'

const TabProfile = defineAsyncComponent({
  loader: () => import('@/views/account/settings/components/TabProfile.vue')
})

const TabChangePassword = defineAsyncComponent({
  loader: () => import('@/views/account/settings/components/TabChangePassword.vue')
})

const router = useRouter()
const route = useRoute()

/* ---------------------------------- STATE & COMPUTED --------------------------------- */
const tab = ref("profile")

const ViewComponent = {
  profile: TabProfile,
  'change-password': TabChangePassword
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

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => queryView.value, (value) => {
  switch (value) {
    case 'profile':
      tab.value = 'profile'
      break;
    case 'change-password':
      tab.value = 'change-password'
      break;
    default:
      tab.value = 'profile';
      break;
  }
}, { deep: true, immediate: true })

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <BaseTab>
          <template #tab-navigation>
            <li class="nav-item" role="presentation">
              <BaseButton @click="handleClickView('profile')"
                class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-4"
                :class="[tab === 'profile' ? 'active' : '']" id="pills-account-tab" role="tab"
                aria-controls="pills-account" aria-selected="true">
                <div class="d-flex flex-row align-items-center">
                  <TablerIcon icon="UserCircleIcon" class="me-2" />
                  <span class="d-none d-md-block">Profil</span>
                </div>
              </BaseButton>
            </li>
            <li class="nav-item" role="presentation">
              <BaseButton @click="handleClickView('change-password')"
                class="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-4"
                :class="[tab === 'change-password' ? 'active' : '']" id="pills-change-password-tab" role="tab"
                aria-controls="pills-change-password" aria-selected="true">
                <div class="d-flex flex-row align-items-center">
                  <TablerIcon icon="LockIcon" class="me-2" />
                  <span class="d-none d-md-block">Change Password</span>
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
      </div>
    </section>
  </div>
</template>