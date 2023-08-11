<script setup>
import { useWindowScroll } from '@vueuse/core'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

const { y } = useWindowScroll()

const scrollToTop = () => {
  const rootEle = document.documentElement

  rootEle.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

</script>

<template>
  <div class="scroll-top scroll-top-opacity" :class="{ 'scroll-top-opacity-show': y > 250 }">
    <BaseButton @click="scrollToTop" class="btn btn-primary btn-rounded-full">
      <TablerIcon icon="ArrowUpIcon" size="16" />
    </BaseButton>
  </div>
</template>

<style scoped>
.scroll-top {
  position: fixed;
  bottom: 5%;
  right: 30px;
  z-index: 99;
  opacity: 0;
  transition: all 0.5s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

/*
footer.footer .scroll-top {
  padding: 0.81rem 0.83rem;
}
*/

.btn-rounded-full {
  padding: 0;
  margin: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
}

.scroll-top-opacity {
  opacity: 0;
  transition: all 0.5s ease;

}

.scroll-top-opacity-show {
  opacity: 1;
}
</style>