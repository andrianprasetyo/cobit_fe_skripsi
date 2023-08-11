<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { useAppConfig } from '@/stores/appConfig'

const { layouts, app } = useAppConfig()
</script>

<template>
  <div class="page-wrapper" id="main-wrapper" data-layout="vertical" data-sidebartype="full" data-sidebar-position="fixed"
    data-header-position="fixed">
    <div class="position-relative overflow-hidden radial-gradient min-vh-100">
      <div class="position-relative z-index-5">
        <div class="row">
          <!-- Image -->
          <div class="col-xl-7 col-xxl-8">
            <RouterLink to="/" class="text-nowrap logo-img d-block px-4 py-9 w-100">
              <img :src="app.appLogoImage" width="180" alt="logo">
            </RouterLink>
            <div class="d-none d-xl-flex align-items-center justify-content-center" style="height: calc(100vh - 80px);">
              <img
                src="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/dist/images/backgrounds/login-security.svg"
                alt="illustration" class="img-fluid" width="500">
            </div>
          </div>

          <!-- Content -->
          <div class="col-xl-5 col-xxl-4">
            <RouterView v-slot="{ Component, route }">
              <Transition :name="layouts.routerTransition" mode="in-out">
                <component :is="Component" :key="route.path" />
              </Transition>
            </RouterView>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>