<script setup>
import { computed } from 'vue'
import { formatDateMoments } from '@/utils/momentDateFormat'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formatDate = computed(() => {
  return value => formatDateMoments({ value: value?.value, format: 'DD MMMM YYYY' })
})

const assessment = useAssessmentStore()
</script>

<template>
  <div class="card bg-primary">
    <div class="card-body">
      <h5 class="fw-bolder text-white mb-2">{{ assessment?.detail?.nama }}</h5>
      <h6 class="text-white mb-0">{{ assessment?.detail?.organisasi?.nama }}</h6>
    </div>
    <div v-if="assessment.detail?.start_date" class="card-footer bg-light">
      <p class="mb-0 text-primary">
        <span class="fw-bold">Periode Asesmen : </span> {{ formatDate({ value: assessment.detail?.start_date }) }} s/d
        {{ formatDate({
        value:
          assessment.detail?.end_date
      }) }}
      </p>
    </div>
  </div>
</template>