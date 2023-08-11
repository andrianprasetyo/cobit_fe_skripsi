<script setup>
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import MainMenu from '@/components/common/MainMenu.vue'

import { useAppConfig } from '@/stores/appConfig'

const { app } = useAppConfig()
</script>

<template>
  <aside class="left-sidebar">
    <!-- Sidebar scroll-->
    <div>
      <div class="brand-logo d-flex align-items-center justify-content-between">
        <RouterLink to="/" class="text-nowrap logo-img mt-3">
          <img :src="app.appLogoImage" class="light-logo" height="60" alt="logo" />
        </RouterLink>

        <div class="close-btn d-lg-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
          <TablerIcon icon="XIcon" class="fs-8 text-muted" />
        </div>
      </div>
      
      <MainMenu />
      <!-- End Sidebar navigation -->
    </div>
  </aside>
</template>