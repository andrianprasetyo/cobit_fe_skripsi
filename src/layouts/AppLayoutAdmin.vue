<script setup>
import SidebarLayout from '@/components/common/SidebarLayout.vue'
import HeaderLayout from '@/components/common/HeaderLayout.vue'

import ScrollToTop from '@/components/ScrollToTop/ScrollToTop.vue'

import { RouterView } from 'vue-router'
import { useAppConfig } from '@/stores/appConfig'

const props = defineProps(['Component']);

const { layouts } = useAppConfig();
</script>

<template>
  <div class="page-wrapper" :class="[layouts.miniSidebar ? 'mini-sidebar show-sidebar' : '']" id="main-wrapper"
    data-layout="vertical" :data-sidebartype="layouts.miniSidebar ? 'mini-sidebar' : 'full'" data-sidebar-position="fixed"
    data-header-position="fixed">
    <SidebarLayout />

    <div class="body-wrapper">
      <HeaderLayout />

      <div class="container-fluid">
        <RouterView v-slot="{ route }">
          <Transition :name="layouts.routerTransition" mode="in-out">
            <component :is="props.Component" :key="route.path" />
          </Transition>
        </RouterView>
      </div>

    </div>
    <ScrollToTop />
  </div>
</template>