<script setup>
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps(['Component']);

</script>

<template>
  <div class="page-wrapper" id="main-wrapper" data-layout="vertical" data-sidebartype="full" data-sidebar-position="fixed"
    data-header-position="fixed">
    <div class="position-relative overflow-hidden bg-light min-vh-100">
      <div class="position-relative z-index-5">
        <div class="row">
          <!-- Image -->
          <div class="col-xl-7 col-xxl-8">
            <!-- <RouterLink to="/" class="text-nowrap logo-img d-block px-4 py-9 w-100">
              <img :src="app.appLogoImage" width="150" alt="logo">
            </RouterLink> -->
            <div class="d-none d-xl-flex align-items-center justify-content-center vh-100">
              <img :src="route.meta?.background_picture || '/assets/images/illustrations/discussion.svg'"
                alt="illustration" class="img-fluid" width="500">
            </div>
          </div>

          <!-- Content -->
          <div class="col-xl-5 col-xxl-4">
            <RouterView v-slot="{ route }">
              <Transition name="fade" mode="out-in">
                <component :is="props.Component" :key="route.path" />
              </Transition>
            </RouterView>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>