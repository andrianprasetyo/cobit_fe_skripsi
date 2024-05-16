<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useScrollTo } from '@/hooks/useScrollTo'

const emit = defineEmits(["click"]);

const scrollTo = useScrollTo()

const props = defineProps({
  to: {
    type: [Object, Array, String]
  },
  hash: {
    type: [String],
    default: ''
  }
});

const hrefWithHash = computed(() => (value) => value?.hash ? `${value?.href}${value?.hash}` : value?.href)

const handlerClick = ($ev) => {
  emit('click', $ev)

  if (props.hash) {
    scrollTo(props.hash)
  }
}

const onLinkClick = (event, navigate) => {
  navigate(event);// vou router goto
  event.preventDefault()
  event.stopImmediatePropagation()
};

</script>

<template>
  <RouterLink :to="hrefWithHash({ href: props.to, hash: props.hash })" :custom="true" v-slot="{ href, navigate }"
    @click="handlerClick">
    <a :href="href" @click="($ev) => { handlerClick($ev); onLinkClick($ev, navigate) }" v-bind="$attrs">
      <slot></slot>
    </a>
  </RouterLink>
</template>