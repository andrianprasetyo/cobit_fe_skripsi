<script setup>
import { defineAsyncComponent, computed } from 'vue'

import StepsWizard from '@/components/StepsWizard/StepsWizard.vue'
import StepsWizardHeaderItem from '@/components/StepsWizard/StepsWizardHeaderItem.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

const StepLevel = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/capability/steps/components/StepLevel.vue'),
})

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useAlert } from '@/stores/alert'

const assessmentStore = useAssessmentStore()
const alert = useAlert()

const ViewComponent = {
  '2': StepLevel,
  '3': StepLevel,
  '4': StepLevel,
  '5': StepLevel,
}

const isStepsUnlocked = computed(() => {
  return level => {
    const isOverlapped = level < assessmentStore.capability.selectedLevel
    const isCurrentLevel = level == assessmentStore.capability.selectedLevel
    const isNextLevelUnlocked = assessmentStore.getCapabilityIsComplianceEnough && (level == +assessmentStore.capability.selectedLevel + 1)

    if (isOverlapped || isCurrentLevel || isNextLevelUnlocked) {
      return true
    } else {
      return false
    }
  }
})

/* --------------------------------- METHODS -------------------------------- */
const handleClickLevel = (level) => {
  if (isStepsUnlocked.value(level)) {
    if (assessmentStore.getCapabilityIsEditedPenilaianSubGamo) {
      alert.info({
        title: `Terdapat Draft Perubahan yang Belum Anda Simpan, Apakah Tetap Pindah Level`
      }).then((result) => {
        if (result.isConfirmed) {
          assessmentStore.setCapabilitySelectedLevel(level)
        }
      })
    } else {
      assessmentStore.setCapabilitySelectedLevel(level)
    }
  }
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
            :disabled="!isStepsUnlocked(level.level)" @click="handleClickLevel(level.level)">
            <template #step>
              <span v-if="isStepsUnlocked(level.level)" v-tooltip="`Pindah Ke Level ${level.level}`"
                class="step cursor-pointer fw-bolder">
                {{ level.level }}
              </span>
              <span v-else>
                <span class="step" v-tooltip="`Level Terkunci`">
                  <TablerIcon icon="LockIcon" />
                </span>
              </span>
            </template>
            <template #default>
              <span class="mt-1">
                {{ level?.count || 0 }} Activities
              </span>
            </template>
          </StepsWizardHeaderItem>
        </template>

        <template #content>
          <Transition name="fade" mode="out-in">
            <KeepAlive :max="1">
              <component :is="ViewComponent[assessmentStore.capability.selectedLevel]" />
            </KeepAlive>
          </Transition>
        </template>
      </StepsWizard>
    </div>
  </div>
</template>