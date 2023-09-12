<script setup>
import { computed, ref } from 'vue'

import BaseModal from '@/components/Modal/BaseModal.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useAppConfig } from '@/stores/appConfig'

import { formatDateMoments } from "@/utils/momentDateFormat";
import formatBytes from "@/utils/formatBytes";
import NoData from '@/components/EmptyPlaceholder/NoData.vue';

const assessmentStore = useAssessmentStore()
const appConfig = useAppConfig()

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close'])

const isErrorViewFile = ref(false)

const formatDate = computed(() => {
  return value => {
    return formatDateMoments({ value: value?.value, format: "LLL" })
  }
})

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

const handleDownloadExcel = ({ url }) => {
  window.open(url, '_blank');
}


</script>

<template>
  <BaseModal id="view_media_file" :order="3" :open="props.isShow" :showBtnCloseFooter="true" classNameModal="modal-xl"
    @close="handleClose">
    <template #header>
      <h4 class="modal-title text-truncate">
        {{ assessmentStore.capability.selectedMediaFile?.docs?.originalname }}
      </h4>
    </template>

    <template #body>
      <div class="row">
        <div class="col-12 col-md-8 ">
          <div class="border rounded p-4 overflow-auto vh-100">
            <div v-if="!isErrorViewFile" class="ratio ratio-1x1">
              <iframe v-if="isPdf(assessmentStore.capability.selectedMediaFile?.docs?.ext)" class="rounded"
                allowfullscreen @error="isErrorViewFile = true"
                :src="pathSource(assessmentStore.capability.selectedMediaFile?.docs?.path)" />

              <div v-else-if="isExcel(assessmentStore.capability.selectedMediaFile?.docs?.ext)"
                class="d-flex justify-content-center align-items-center">
                <BaseButton
                  @click="handleDownloadExcel({ url: pathSource(assessmentStore.capability.selectedMediaFile?.docs?.path) })"
                  title="Download File">
                  <template #icon-left>
                    <TablerIcon icon="DownloadIcon" />
                  </template>
                </BaseButton>
              </div>
            </div>

            <div v-else class="h-100 d-flex align-items-center justify-content-center">
              <NoData title="Terjadi Kesalahan. File Tidak Ditemukan" />
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="border rounded p-4 overflow-auto vh-100">
            <h6 class="fw-semibold mb-0 text-dark mb-3">Informasi File</h6>
            <div class="text-start mb-3">
              <span class="fs-3">Nama File</span>
              <h6 class="mb-0 fw-semibold">{{ assessmentStore.capability.selectedMediaFile?.docs?.originalname || "-" }}
              </h6>
            </div>
            <div class="text-start" :class="[assessmentStore.capability.selectedMediaFile?.deskripsi ? 'mb-3' : 'mb-5']">
              <span class="fs-3">Ukuran File</span>
              <h6 class="mb-0 fw-semibold">{{ formatBytes(assessmentStore.capability.selectedMediaFile?.docs.size) }}</h6>
            </div>

            <div v-if="assessmentStore.capability.selectedMediaFile?.deskripsi" class="text-start mb-5 ">
              <span class="fs-3">Deskripsi File</span>
              <div class="bg-light-primary p-3 rounded">
                <div v-html="assessmentStore.capability.selectedMediaFile?.deskripsi" />
              </div>
            </div>


            <h6 class="fw-semibold mb-0 text-dark mb-3">Informasi Pemilik</h6>
            <div class="text-start mb-3">
              <span class="fs-3">Nama</span>
              <h6 class="mb-0 fw-semibold">{{ assessmentStore.capability.selectedMediaFile?.author?.nama || "-" }}</h6>
            </div>
            <div class="text-start mb-3">
              <span class="fs-3">Email</span>
              <h6 class="mb-0 fw-semibold">{{ assessmentStore.capability.selectedMediaFile?.author?.email || "-" }}</h6>
            </div>
            <div class="text-start mb-3">
              <span class="fs-3">Tanggal Upload</span>
              <h6 class="mb-0 fw-semibold">{{ formatDate({
                value: assessmentStore.capability.selectedMediaFile?.created_at
              })
                || "-" }}</h6>
            </div>
          </div>
        </div>
      </div>
    </template>

  </BaseModal>
</template>