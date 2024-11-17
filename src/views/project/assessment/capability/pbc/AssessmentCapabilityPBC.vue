<script setup>
import { defineAsyncComponent } from 'vue'

import StepsWizard from '@/components/StepsWizard/StepsWizard.vue'
import StepsWizardHeaderItem from '@/components/StepsWizard/StepsWizardHeaderItem.vue'

const StepLevelPBC = defineAsyncComponent({
  loader: () => import('@/views/project/assessment/capability/pbc/components/StepLevelPBC.vue'),
})

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useAlert } from '@/stores/alert'

const assessmentStore = useAssessmentStore()
const alert = useAlert()

const ViewComponent = {
  '2': StepLevelPBC,
  '3': StepLevelPBC,
  '4': StepLevelPBC,
  '5': StepLevelPBC,
}

/* --------------------------------- METHODS -------------------------------- */
const handleClickLevel = (level) => {
  if (assessmentStore.getCapabilityIsEditedPbc) {
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
            @click="handleClickLevel(level.level)">
            <template #step>
              <span v-tooltip="`Pindah Ke Level ${level.level}`" class="step cursor-pointer fw-bolder">
                {{ level.level }}
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