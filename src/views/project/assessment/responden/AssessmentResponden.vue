<script setup>
import { useRouter } from 'vue-router'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue';
import BaseButton from '@/components/Button/BaseButton.vue';
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue';
import RespondenCard from '@/views/project/assessment/responden/components/RespondenCard.vue';

const router = useRouter()

const props = defineProps({
  isShowBreadCrumb: {
    type: Boolean,
    default: true
  },
  isShowBackButton: {
    type: Boolean,
    default: true
  }
})

const handleBack = () => {
  router.push("/project/assessment")
}

</script>

<template>
  <div>
    <BreadCrumb v-if="props.isShowBreadCrumb" />

    <section>
      <RespondenCard />

      <div v-if="props.isShowBackButton" class="card mt-4">
        <div class="card-body">
          <div class="d-flex flex-column flex-md-row align-items-center">
            <div>
              <BaseButton @click="handleBack" class="btn btn-outline-primary me-0 me-md-3 mb-2 mb-md-0" title="Kembali">
                <template #icon-left>
                  <TablerIcon icon="ChevronLeftIcon" />
                </template>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>