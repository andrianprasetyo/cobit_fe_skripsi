<script setup>
import { ref, reactive, watch } from 'vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import MainMenu from '@/components/common/MainMenu.vue'
import LinkMenuItem from '@/components/Link/LinkMenuItem.vue'
import { useWindowSize } from '@vueuse/core'

import { useAppConfig } from '@/stores/appConfig'

const { app, toggleMiniSidebar, layouts } = useAppConfig()

const { width } = useWindowSize()

const logo = reactive({
  isShowFullLogo: false,
  isPlayAnimation: false
})

const mainMenuRef = ref()

const handleClickLogo = () => {
  mainMenuRef.value?.resetStateSidebar()
}

const handleToggleMiniSidebar = () => {
  toggleMiniSidebar()
}

const toggleOnlyShowLogo = () => {
  if (layouts.miniSidebar) {
    logo.isShowFullLogo = !logo.isShowFullLogo
  }
}

watch(() => width.value, (value) => {
  if (value >= 1093 && layouts.miniSidebar) {
    toggleMiniSidebar()
  }
})

setInterval(() => {
  logo.isPlayAnimation = !logo.isPlayAnimation

  setTimeout(() => {
    logo.isPlayAnimation = !logo.isPlayAnimation
  }, 1000) // Duration Animation
}, 10000) // Play Animation Every 10 sec

</script>

<template>
  <aside class="left-sidebar" @mouseenter="toggleOnlyShowLogo" @mouseleave="toggleOnlyShowLogo">
    <!-- Sidebar scroll-->
    <div class="brand-logo d-flex align-items-center justify-content-center">
      <LinkMenuItem v-if="!layouts.miniSidebar" to="/" class="text-nowrap logo-img mt-3" @click="handleClickLogo">
        <div v-if="logo.isPlayAnimation" class="logo-shine"></div>
        <img :src="app.appLogoImage" class="light-logo" height="50" alt="logo" />
      </LinkMenuItem>

      <LinkMenuItem v-else to="/">
        <div v-if="logo.isPlayAnimation" :class="[logo.isShowFullLogo ? 'logo-shine mt-3' : 'logo-only-shine']"></div>
        <img :src="logo.isShowFullLogo ? app.appLogoImage : app.appLogoImageOnly"
          :height="logo.isShowFullLogo ? '50' : '40'" :class="[logo.isShowFullLogo ? 'text-nowrap logo-img mt-3' : '']"
          alt="logo" />
      </LinkMenuItem>

      <div @click="handleToggleMiniSidebar" class="close-btn d-lg-none d-block sidebartoggler cursor-pointer ms-3"
        id="sidebarCollapse">
        <TablerIcon icon="XIcon" class="fs-8 text-muted" />
      </div>
    </div>

    <MainMenu ref="mainMenuRef" />
    <!-- End Sidebar navigation -->
  </aside>
</template>