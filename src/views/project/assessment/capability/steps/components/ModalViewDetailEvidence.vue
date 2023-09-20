<script setup>
import { computed, ref } from 'vue'

import BaseModal from '@/components/Modal/BaseModal.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'

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

const isExcel = computed(() => {
  return value => {
    return value === 'xlsx'
  }
})

const isPdf = computed(() => {
  return value => {
    return value === 'pdf'
  }
})

/* --------------------------------- METHODS -------------------------------- */
const handleClose = () => {
  emits('close', true)
}

const handleDownloadFile = ({ url }) => {
  window.open(url, '_blank');
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

          <div class="row overflow-hidden">
            <div class="col-12 d-flex align-items-stretch">
              <div class="border rounded p-4 w-100">
                <template v-if="evidence?.url">
                  <div class="ratio ratio-1x1">
                    <iframe class="rounded" allowfullscreen :src="evidence?.url" />
                  </div>
                </template>

                <div v-else-if="evidence?.docs?.docs" class="ratio ratio-1x1">
                  <iframe v-if="isPdf(evidence?.docs?.docs?.ext)" class="rounded" allowfullscreen
                    @error="isErrorViewFile = true" :src="pathSource(evidence?.docs?.docs?.path)" />

                  <div v-else-if="isExcel(evidence?.docs?.docs?.ext)"
                    class="d-flex justify-content-center align-items-center bg-light">
                    <BaseButton @click="handleDownloadFile({ url: pathSource(evidence?.docs?.docs?.path) })"
                      title="Download File">
                      <template #icon-left>
                        <TablerIcon icon="DownloadIcon" />
                      </template>
                    </BaseButton>
                  </div>

                  <div v-else class="ratio ratio-1x1">
                    <img :src="pathSource(evidence?.docs?.docs?.path)" alt="Evidence" />
                  </div>
                </div>

                <template v-else>
                  <NoData title="Terjadi Kesalahan. File Tidak Ditemukan" />
                </template>
              </div>
            </div>
            <div class="col-12 d-flex align-items-stretch mt-2">
              <div class="border rounded p-4 w-100">
                <h6 class="fw-semibold mb-0 text-dark mb-3">Deskripsi Evidence</h6>
                <div class="text-start mb-3 d-flex flex-wrap">
                  <div v-if="evidence.deskripsi" class="fs-3 text-break text-wrap text-truncate"
                    v-html="evidence.deskripsi" />
                  <span v-else class="fs-3">Tidak Ada Deskripsi</span>
                </div>

                <template v-if="evidence.url">
                  <h6 class="fw-semibold mb-0 text-dark mb-3">URL</h6>
                  <span class="fs-3 d-flex flex-wrap ">
                    <a :href="evidence.url" target="_blank" class="link-primary d-inline-block text-truncate"
                      style="max-width: 175px;">{{ evidence.url }}</a>
                  </span>
                </template>
              </div>
            </div>
          </div>
        </template>
      </template>
    </template>
  </BaseModal>
</template>