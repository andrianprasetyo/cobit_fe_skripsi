<script setup>
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop.vue'

import { RouterView } from 'vue-router'
import { useAppConfig } from '@/stores/appConfig'

const props = defineProps(['Component']);

const { layouts } = useAppConfig();
</script>

<template>
  <div class="page-wrapper" id="main-wrapper" data-layout="vertical" data-sidebartype="full" data-sidebar-position="fixed"
    data-header-position="fixed">
    <div
      class="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
      <div class="d-flex align-items-center justify-content-center w-100">
        <div class="row justify-content-center w-100">
          <div class="col-12 col-md-9 col-lg-9">
            <div class="card mb-0">
              <div class="card-body">
                <RouterView v-slot="{ route }">
                  <Transition :name="layouts.routerTransition" mode="out-in">
                    <component :is="props.Component" :key="route.path" />
                  </Transition>
                </RouterView>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ScrollToTop />
  </div>
</template>