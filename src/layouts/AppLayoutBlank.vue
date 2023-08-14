<script setup>
import { RouterView } from 'vue-router'
import { useAppConfig } from '@/stores/appConfig'

const props = defineProps(['Component']);

const { layouts } = useAppConfig()
</script>

<template>
  <RouterView>
    <Transition :name="layouts.routerTransition" mode="in-out">
      <component :is="props.Component" />
    </Transition>
  </RouterView>
</template>