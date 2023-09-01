<script setup>
import { RouterView, useRoute } from 'vue-router'

import { useAppConfig } from '@/stores/appConfig'

const route = useRoute()

const props = defineProps(['Component']);

const { app } = useAppConfig()
</script>

<template>
  <div class="page-wrapper" id="main-wrapper" data-layout="vertical" data-sidebartype="full" data-sidebar-position="fixed"
    data-header-position="fixed">
    <div class="vh-100 row m-0 p-0 position-sticky position-relative">
      <div class="d-none d-lg-flex flex-column col-12 col-lg-3 align-items-center m-0 p-0 position-relative vh-100">
        <div class=" text-nowrap logo-img d-block px-4 pt-9 w-100 bg-light">
          <img :src="app.appLogoImage" width="150" alt="logo">
        </div>
        <div class="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
          <img :src="route.meta?.background_picture || '/assets/images/illustrations/discussion.svg'" alt="illustration"
            class="img-fluid" width="275">
        </div>
      </div>


      <!-- Content -->
      <div class="col-12 col-lg-9 vh-100 overflow-y-scroll">
        <div class="bg-body p-0 p-md-3">
          <RouterView v-slot="{ route }">
            <Transition name="fade" mode="out-in">
              <component :is="props.Component" :key="route.path" />
            </Transition>
          </RouterView>
        </div>
      </div>
    </div>
  </div>
</template>
