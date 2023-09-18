<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import DataInput from '@/views/project/assessment/report-design-factor/components/DataInput.vue';
import DataOutput from '@/views/project/assessment/report-design-factor/components/DataOutput.vue';

const route = useRoute()

const assessmentTitle = computed(() => {
  return route.query?.assessment
})

const designfactorTitle = computed(() => {
  return route.query?.design_factor
})

</script>

<template>
  <div>
    <div class="card">
      <div v-if="designfactorTitle" class="card-body">
        <div class="mb-3 mb-md-0">
          <h5 class="card-title fw-semibold mb-3">Report Design Factor</h5>
          <hr />
          <p v-if="designfactorTitle" class="card-subtitle mb-2 fw-bold">{{ designfactorTitle }}</p>
          <p v-if="assessmentTitle" class="card-subtitle mb-0">{{ assessmentTitle }}</p>
        </div>
      </div>
    </div>

    <DataInput />
    <DataOutput />
  </div>
</template>