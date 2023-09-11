<script setup>
import { defineAsyncComponent } from 'vue'

import StepsWizard from '@/components/StepsWizard/StepsWizard.vue'
import StepsWizardHeaderItem from '@/components/StepsWizard/StepsWizardHeaderItem.vue'

const StepLevel = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/capability/steps/components/StepLevel.vue'),
})

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const assessmentStore = useAssessmentStore()

const ViewComponent = {
  '2': StepLevel,
  '3': StepLevel,
  '4': StepLevel,
  '5': StepLevel,
}

/* --------------------------------- METHODS -------------------------------- */
const handleClickLevel = (level) => {
  assessmentStore.setCapabilitySelectedLevel(level)
}

</script>

<template>
  <div class="card">
    <div class="card-body">
      <StepsWizard>
        <template #header>
          <StepsWizardHeaderItem v-for="level in assessmentStore.capability.listLevel" :key="`step-${level.level}`"
            :step="level.level" :label="`Level ${level.level}`"
            :is-active="assessmentStore.capability.selectedLevel == level.level"
            :is-completed="assessmentStore.capability.selectedLevel >= level.level"
            :disabled="(assessmentStore.capability.selectedLevel != level.level) || assessmentStore.capability.getCapabilityIsComplianceEnough"
            @click="handleClickLevel(level.level)" />
        </template>

        <template #content>
          <Transition name="fade" mode="out-in">
            <KeepAlive :max="2">
              <component :is="ViewComponent[assessmentStore.capability.selectedLevel]" />
            </KeepAlive>
          </Transition>
        </template>
      </StepsWizard>
    </div>
  </div>
</template>