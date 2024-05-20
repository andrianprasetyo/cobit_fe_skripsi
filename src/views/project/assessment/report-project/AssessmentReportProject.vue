<script setup>
import { onMounted, computed, reactive } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import DocumentPlayer from '@/components/Player/DocumentPlayer.vue'
import LoadingSkeleton from '@/components/Loading/LoadingSkeleton.vue'
import ModalUploadLaporan from '@/views/project/assessment/components/ModalUploadLaporan.vue'

import { useRoute } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { useDownloadFileFromURL } from '@/hooks/useDownloadFileFromURL'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const route = useRoute()
const title = useTitle()
const downloadFile = useDownloadFileFromURL()
const assessment = useAssessmentStore()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const reportProjectState = reactive({
  isShowModalUploadLaporan: false
})

const assessmentId = computed(() => route.params?.id)

/* --------------------------------- METHODS -------------------------------- */
const handleDownloadLaporan = ({ url, fileName }) => {
  downloadFile.downloadFileFromUrl({ url, fileName })
}

const toggleModalUploadLaporan = () => {
  reportProjectState.isShowModalUploadLaporan = !reportProjectState.isShowModalUploadLaporan
}

const handleRefresh = () => {
  assessment.getDetailAssessment({ id: assessmentId.value })
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  assessment.getDetailAssessment({ id: assessmentId.value }).then(() => {
    title.value = `Laporan Project ${assessment.detail?.nama || ''}`
  })
})
</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <LoadingSkeleton v-if="assessment.loading" class="skeleton-card-project" />
      <div v-else class="card">
        <div class="card-header">
          <div
            class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
            <div class="mb-3 mb-sm-0">
              <h5 class="card-title fw-semibold">Laporan Project</h5>
            </div>
            <div
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
              <BaseButton class="btn btn-primary" title="Upload Laporan" @click="toggleModalUploadLaporan">
                <template #icon-right>
                  <TablerIcon icon="UploadIcon" />
                </template>
              </BaseButton>

              <BaseButton v-if="assessment.detail?.docs?.url" class="btn btn-outline-primary ms-0 ms-md-3 mt-3 mt-md-0"
                title="Download Laporan"
                @click="handleDownloadLaporan({ url: assessment.detail?.docs?.url, fileName: assessment.detail?.docs?.originalname })">
                <template #icon-right>
                  <TablerIcon icon="DownloadIcon" />
                </template>
              </BaseButton>
            </div>
          </div>
        </div>
        <div class="card-body">
          <DocumentPlayer :src="assessment.detail?.docs?.url" />
        </div>
      </div>
    </section>

    <ModalUploadLaporan :is-show="reportProjectState.isShowModalUploadLaporan" @close="toggleModalUploadLaporan"
      @refresh="handleRefresh" />
  </div>
</template>

<style scoped>
.skeleton-card-project {
  width: 100%;
  height: 100vh;
  border-radius: 0.5rem;
}
</style>