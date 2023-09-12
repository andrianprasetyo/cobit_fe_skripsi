<script setup>
import { computed, ref } from 'vue'

import BaseModal from '@/components/Modal/BaseModal.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue';

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useAppConfig } from '@/stores/appConfig'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close'])

const assessmentStore = useAssessmentStore()
const appConfig = useAppConfig()

/* ---------------------------------- STATE --------------------------------- */
const isErrorViewFile = ref(false)

const pathSource = computed(() => {
  return value => {
    return `${appConfig.app.appHostMedia}${value}`
  }
})

/* --------------------------------- METHODS -------------------------------- */
const handleClose = () => {
  emits('close', true)
}

</script>

<template>
  <BaseModal id="view_evidence" :order="7" :open="props.isShow" classNameModal="modal-lg" @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Lihat Evidence
      </h4>
    </template>

    <template #body>
      <div class="mb-4 text-center">
        <h6>
          Management Practice Code
        </h6>
        <h4 class="fw-bolder">
          {{ assessmentStore.capability?.selectedSubGamo?.subkode }}
        </h4>
      </div>

      <template v-if="assessmentStore.capability.selectedSubGamo?.capabilityass?.evident.length">
        <template v-for="(evidence, index) in assessmentStore.capability.selectedSubGamo?.capabilityass?.evident"
          :key="`view-evidence-${index}`">
          <hr v-if="index > 0" />

          <div class="mb-9 d-flex flex-column flex-md-row justify-content-md-between align-items-md-center my-4">
            <h5 class="fw-semibold">Evidence {{ index + 1 }}</h5>
          </div>

          <div class="row">
            <div class="col-12 col-md-8 d-flex align-items-stretch">
              <div class="border rounded p-4 w-100">
                <div v-if="isErrorViewFile" class="ratio ratio-1x1">
                  <iframe class="rounded" allowfullscreen @error="isErrorViewFile = true"
                    :src="pathSource(evidence?.docs?.docs?.path)" />
                </div>
                <div v-else class="h-100 d-flex align-items-center justify-content-center">
                  <NoData title="Terjadi Kesalahan. File Tidak Ditemukan" />
                </div>
              </div>
            </div>
            <div class="col-12 col-md-4 d-flex align-items-stretch">
              <div class="border rounded p-4 w-100">
                <h6 class="fw-semibold mb-0 text-dark mb-3">Deskripsi</h6>
                <div class="text-start mb-3">
                  <div v-if="evidence.deskripsi" class="fs-3" v-html="evidence.deskripsi" />
                  <span v-else class="fs-3">Tidak Ada Deskripsi</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </template>
  </BaseModal>
</template>