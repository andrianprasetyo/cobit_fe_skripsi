<script setup>
import { defineAsyncComponent, computed } from 'vue';
import { RouterView, useRoute } from 'vue-router'

const AppLayoutAuth = defineAsyncComponent({
  loader: () => import('@/layouts/AppLayoutAuth.vue')
})

const AppLayoutAdmin = defineAsyncComponent({
  loader: () => import('@/layouts/AppLayoutAdmin.vue')
})

const AppLayoutBlank = defineAsyncComponent({
  loader: () => import('@/layouts/AppLayoutBlank.vue')
})

const AppLayoutBoxed = defineAsyncComponent({
  loader: () => import('@/layouts/AppLayoutBoxed.vue')
})

const route = useRoute()

const layoutComponents = {
  AppLayoutAdmin,
  AppLayoutAuth,
  AppLayoutBlank,
  AppLayoutBoxed
}

const layout = computed(() => {
  return route.meta?.layout
})

</script>

<template>
  <router-view v-slot="{ Component }">
    <component :is="layoutComponents[layout]" :Component="Component" />
  </router-view>

  <portal-target name="modal" :multiple="true"></portal-target>
</template>
