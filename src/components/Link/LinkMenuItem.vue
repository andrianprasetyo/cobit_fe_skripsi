<script setup>
import { RouterLink } from 'vue-router'

const emit = defineEmits(["click"]);
const props = defineProps({
  to: {
    type: [Object, Array, String]
  }
});

const handlerClick = ($ev) => {
  emit('click', $ev)
}
const onLinkClick = (event, navigate) => {
  navigate(event);// vou router goto
  event.preventDefault()
  event.stopImmediatePropagation()

};

</script>
    
<template>
  <RouterLink :to="props.to" :custom="true" v-slot="{ href, navigate }" @click="handlerClick">
    <a :href="href" @click="($ev) => { handlerClick($ev); onLinkClick($ev, navigate) }" v-bind="$attrs">
      <slot></slot>
    </a>
  </RouterLink>
</template>