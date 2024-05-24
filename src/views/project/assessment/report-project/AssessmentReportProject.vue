<script setup>
import { onMounted, computed, reactive } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import DocumentPlayer from '@/components/Player/DocumentPlayer.vue'
import LoadingSkeleton from '@/components/Loading/LoadingSkeleton.vue'
import NoOptions from '@/components/EmptyPlaceholder/NoOptions.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'
import ModalUploadLaporan from '@/views/project/assessment/components/ModalUploadLaporan.vue'
import ModalHistoryLaporan from '@/views/project/assessment/components/ModalHistoryLaporan.vue'

import { useRoute } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { useToast } from '@/stores/toast'
import { useAlert } from '@/stores/alert'
import { useDownloadFileFromURL } from '@/hooks/useDownloadFileFromURL'
import { formatDateMoments } from '@/utils/momentDateFormat'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

import AssessmentServices from '@/services/lib/assessment'

const route = useRoute()
const title = useTitle()
const toast = useToast()
const alert = useAlert()
const downloadFile = useDownloadFileFromURL()
const assessment = useAssessmentStore()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const reportProjectState = reactive({
  loading: false,
  data: [],
  selectedLaporan: null,
  selectedEditLaporan: null,
  selectedHistoryLaporan: null,
  isOnEditLaporan: false,
  isShowModalUploadLaporan: false,
  isShowModalHistoryLaporan: false,
})

const assessmentId = computed(() => route.params?.id)

const formatDate = computed(() => {
  return value => {
    return formatDateMoments({ value: value?.value })
  }
})

/* --------------------------------- METHODS -------------------------------- */
const getListLaporan = async ({ assessment_id }) => {
  try {
    reportProjectState.loading = true
    const response = await AssessmentServices.getListLaporan({ assessment_id })

    if (response) {
      const data = response?.data

      reportProjectState.data = data || []
      reportProjectState.loading = false
    }
  } catch (error) {
    reportProjectState.loading = false
    toast.error({ error })
  }
}

const handleDownloadLaporan = ({ url, fileName }) => {
  downloadFile.downloadFileFromUrl({ url, fileName })
}

const toggleModalUploadLaporan = () => {
  reportProjectState.isShowModalUploadLaporan = !reportProjectState.isShowModalUploadLaporan
}

const toggleModalHistoryLaporan = () => {
  reportProjectState.isShowModalHistoryLaporan = !reportProjectState.isShowModalHistoryLaporan
}

const handleRefresh = () => {
  getListLaporan({ assessment_id: assessmentId.value })
}

const handleSelectedLaporan = (laporan) => {
  reportProjectState.selectedLaporan = laporan
}

const handleAddLaporan = () => {
  reportProjectState.selectedHistoryLaporan = null
  reportProjectState.isShowModalUploadLaporan = true
  reportProjectState.isOnEditLaporan = false
}

const handleSelectedEditLaporan = (laporan) => {
  reportProjectState.selectedEditLaporan = laporan
  reportProjectState.isShowModalUploadLaporan = true
  reportProjectState.isOnEditLaporan = true
}

const handleSelectedHistoryLaporan = (laporan) => {
  reportProjectState.selectedHistoryLaporan = laporan
  reportProjectState.isShowModalHistoryLaporan = true
}

const deleteLaporan = async ({ id }) => {
  try {
    const response = await AssessmentServices.deleteLaporan({ id })

    if (response) {
      toast.success({
        title: 'Hapus Laporan',
        text: `Berhasil Menghapus Data Laporan`
      })
      handleRefresh()

      return response
    }
  } catch (error) {
    toast.error({ error })
    throw error
  }
}

const handleDeleteLaporan = ({ title, id }) => {
  alert.info({
    title: `Apakah Anda Yakin untuk Menghapus ${title}`
  }).then(async (result) => {
    if (result.isConfirmed) {
      alert.loading()
      try {
        const response = await deleteLaporan({ id })

        if (response) {
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
      }
    }
  })
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  assessment.getDetailAssessment({ id: assessmentId.value }).then(() => {
    title.value = `Laporan Project ${assessment.detail?.nama || ''}`
  })

  getListLaporan({ assessment_id: assessmentId.value })
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
              <h5 class="card-title fw-semibold">Laporan</h5>
            </div>
            <div
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
              <BaseButton class="btn btn-primary" title="Upload Laporan" @click="handleAddLaporan">
                <template #icon-right>
                  <TablerIcon icon="UploadIcon" />
                </template>
              </BaseButton>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-12 col-md-4 position-relative" :class="{
        'rounded border p-3': Array.isArray(reportProjectState.data) && !reportProjectState.data.length
      }">
              <template v-if="reportProjectState.loading">
                <LoadingSkeleton v-for="number in Array.from({ length: 5 })" :key="`skeleton-${number}`"
                  class="skeleton-report-item mb-1" />
              </template>

              <template
                v-else-if="!reportProjectState.loading && Array.isArray(reportProjectState.data) && reportProjectState.data.length">
                <template v-for="(reportItem, reportIndex) in reportProjectState.data"
                  :key="`report-${reportItem?.id}-${reportItem?.name}-${reportIndex}`">
                  <div class="cursor-pointer p-3 border-bottom d-flex align-items-center" :class="{
        'rounded-top': reportIndex === 0,
        'rounded-bottom': (reportIndex + 1) === reportProjectState.data.length,
        'bg-light': reportProjectState?.selectedLaporan?.id !== reportItem?.id,
        'bg-light-primary': reportProjectState?.selectedLaporan?.id === reportItem?.id
      }" @click.stop="handleSelectedLaporan(reportItem)">
                    <div class="btn btn-primary round rounded-circle d-flex align-items-center justify-content-center">
                      <TablerIcon icon="ReportIcon" />
                    </div>
                    <div class="ms-3 w-75 d-flex flex-column justify-content-center">
                      <h6 class="mb-0 text-truncate"><span class="fw-bolder">{{ reportItem?.name }}</span>  <span class="fw-lighter">| Versi {{ reportItem?.version }}</span></h6>

                      <!-- <span class="fs-3 text-truncate text-body-color d-block w-85 mb-0">
                      </span> -->

                      <span class="fs-3 text-truncate text-body-color d-block w-85 mb-0">
                        Terakhir Update : {{ formatDate({ value: reportItem?.updated_at }) }}
                      </span>

                      <div class="mt-2 d-flex align-items-center">
                        <BaseButton v-tooltip="`Download Laporan ${reportItem?.name || ''}`"
                          @click.stop="handleDownloadLaporan({ url: reportItem?.file?.url, fileName: reportItem?.name })"
                          class="btn btn-sm btn-outline-primary">
                          <template #icon-left>
                            <TablerIcon icon="DownloadIcon" />
                          </template>
                        </BaseButton>

                        <BaseButton v-tooltip="`Edit Laporan ${reportItem?.name || ''}`"
                          @click.stop="handleSelectedEditLaporan(reportItem)"
                          class="btn btn-sm btn-outline-primary ms-0 ms-md-1 mt-3 mt-md-0">
                          <template #icon-left>
                            <TablerIcon icon="EditIcon" />
                          </template>
                        </BaseButton>

                        <BaseButton v-tooltip="`Lihat History Laporan ${reportItem?.name || ''}`"
                          @click.stop="handleSelectedHistoryLaporan(reportItem)"
                          class="btn btn-sm btn-outline-primary ms-0 ms-md-1 mt-3 mt-md-0">
                          <template #icon-left>
                            <TablerIcon icon="HistoryIcon" />
                          </template>
                        </BaseButton>

                        <BaseButton v-tooltip="`Hapus Laporan ${reportItem?.name || ''}`"
                          @click.stop="handleDeleteLaporan({ id: reportItem?.id, title: reportItem?.name })"
                          class="btn btn-sm btn-outline-danger ms-0 ms-md-1 mt-3 mt-md-0">
                          <template #icon-left>
                            <TablerIcon icon="TrashIcon" />
                          </template>
                        </BaseButton>
                      </div>
                    </div>
                  </div>
                </template>
              </template>

              <template v-else>
                <NoData title="Belum Ada File Laporan" />
              </template>
            </div>

            <div class="col-12 col-md-8 rounded border p-4 overflow-auto">
              <template v-if="reportProjectState.selectedLaporan?.file?.url">
                <h4>{{ reportProjectState?.selectedLaporan?.name }}</h4>
                <hr />
                <DocumentPlayer v-if="reportProjectState.selectedLaporan?.file?.url"
                  :src="reportProjectState.selectedLaporan?.file?.url" />
              </template>
              <template v-else>
                <div class="d-flex justify-content-center align-items-center h-100">
                  <NoOptions title="Belum Ada File Laporan Dipilih" />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>

    <ModalUploadLaporan :is-show="reportProjectState.isShowModalUploadLaporan"
      :is-on-edit="reportProjectState.isOnEditLaporan" @close="toggleModalUploadLaporan"
      :selected-data="reportProjectState.selectedEditLaporan" @refresh="handleRefresh" />

    <ModalHistoryLaporan :is-show="reportProjectState.isShowModalHistoryLaporan" @close="toggleModalHistoryLaporan"
      :selected-data="reportProjectState.selectedHistoryLaporan" @refresh="handleRefresh" />
  </div>
</template>

<style scoped>
.skeleton-card-project {
  width: 100% !important;
  height: 100% !important;
  border-radius: 0.5rem;
}

.skeleton-report-item {
  width: 100% !important;
  height: 80px !important;
  border-radius: 0.5rem;
}
</style>