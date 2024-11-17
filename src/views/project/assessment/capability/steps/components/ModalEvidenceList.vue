<script setup>
import { reactive, watch, computed } from 'vue'

import BaseModal from '@/components/Modal/BaseModal.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'
import BaseIFrame from '@/components/IFrame/BaseIFrame.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'
import { useAppConfig } from '@/stores/appConfig'

import CapabilityServices from '@/services/lib/capability'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'refresh'])

const assessmentStore = useAssessmentStore()
const appConfig = useAppConfig()
const toast = useToast()
const route = useRoute()

/* ---------------------------------- STATE --------------------------------- */
const evidence = reactive({
  loading: false,
  data: [],
})

/* --------------------------------- METHODS -------------------------------- */
const getEvidenceCapability = async ({
  domain_id,
  assesment_id,
  level,
}) => {
  try {
    evidence.loading = true;

    const response = await CapabilityServices.getEvidenceCapability({
      domain_id,
      assesment_id,
      level
    })

    if (response) {
      const data = response.data

      evidence.loading = false
      evidence.data = data || []
    }
  } catch (error) {
    evidence.loading = false
    toast.error({ error })
  }
}

const handleDownloadFile = ({ url }) => {
  window.open(url, '_blank');
}

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

const isImage = computed(() => {
  return value => {
    if (typeof value === 'string') {
      const listExt = ['png', 'jpg', 'jpeg', 'svg', 'webp']
      return listExt.includes(value)
    } else {
      return false
    }
  }
})


const handleClose = () => {
  emits('close', true)
}
/* ---------------------------------- HOOKS --------------------------------- */
watch(() => [props.isShow], () => {
  if (props.isShow) {
    getEvidenceCapability({
      domain_id: assessmentStore.capability.selectedGamo?.id,
      assesment_id: route.params?.id,
      level: assessmentStore.capability.selectedLevel
    })
  }
}, { deep: true })

</script>

<template>
  <BaseModal id="penilaian-note-modal" :order="8" :open="props.isShow" classNameModal="modal-lg" @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Daftar Evidence
      </h4>
    </template>

    <template #body>
      <div class="mb-5 text-center">
        <h6>
          Governance and Management Objectives (GAMO)
        </h6>
        <h4 class="fw-bolder">
          {{ assessmentStore.capability?.selectedGamo?.kode }} {{ assessmentStore.capability.selectedLevel ? ` - Level
          ${assessmentStore.capability.selectedLevel}` : '' }}
        </h4>
      </div>

      <LoadingOverlay :active="evidence.loading" />

      <template v-if="Array.isArray(evidence.data) && evidence.data.length">
        <template v-for="(item, index) in evidence.data" :key="`note-${index}-${item?.id}`">
          <hr v-if="index > 0" />

          <div class="mb-9 d-flex flex-column flex-md-row justify-content-md-between align-items-md-center my-4">
            <div>
              <h5 class="fw-semibold">Evidence {{ index + 1 }}</h5>
              <h6 class="mb-1 fs-4 fw-semibold">
                {{ item?.capability_assesment?.domain?.kode }}.{{ item?.capability_assesment?.capability_level?.kode }}
              </h6>
            </div>
          </div>

          <div class="border rounded p-4 w-100">
            <template v-if="item?.url">
              <BaseIFrame :url="item?.url" />
            </template>

            <template v-else-if="item?.docs?.docs">
              <BaseIFrame v-if="isPdf(item?.docs?.docs?.ext)" :src="pathSource(item?.docs?.docs?.path)" />
            </template>

            <div v-else-if="isExcel(item?.docs?.docs?.ext)"
              class="d-flex justify-content-center align-items-center bg-light">
              <BaseButton @click="handleDownloadFile({ url: pathSource(item?.docs?.docs?.path) })"
                title="Download File">
                <template #icon-left>
                  <TablerIcon icon="DownloadIcon" />
                </template>
              </BaseButton>
            </div>

            <div v-else-if="isImage(item.docs?.ext)">
              <img class="card-img-top img-responsive" :src="pathSource(item?.docs?.path)" alt="File" />
            </div>

            <div v-else class="d-flex justify-content-center align-items-center bg-light">
              <BaseButton
                @click="handleDownloadFile({ url: pathSource(assessmentStore.capability.selectedMediaFile?.docs?.path) })"
                title="Download File" :access="['project', 'project-add', 'project-edit']">
                <template #icon-left>
                  <TablerIcon icon="DownloadIcon" />
                </template>
              </BaseButton>
            </div>

            <div class="d-flex align-items-stretch mt-2">
              <div class="border rounded p-4 w-100">
                <h6 class="fw-semibold mb-0 text-dark mb-3">Nama Evidence</h6>
                <p class="fs-3 d-flex flex-wrap mb-3">
                  {{ item?.name || "-" }}
                </p>

                <h6 class="fw-semibold mb-0 text-dark mb-3">Deskripsi Evidence</h6>
                <div class="text-start mb-3 d-flex flex-wrap">
                  <div v-if="item.deskripsi" class="fs-3 text-break text-wrap text-truncate" v-html="item.deskripsi" />
                  <span v-else class="fs-3">Tidak Ada Deskripsi</span>
                </div>

                <template v-if="item.url">
                  <h6 class="fw-semibold mb-0 text-dark mb-3">URL</h6>
                  <span class="fs-3 d-flex flex-wrap ">
                    <a :href="item.url" target="_blank" class="link-primary d-inline-block text-truncate"
                      style="max-width: 175px;">{{ item.url }}</a>
                  </span>
                </template>
              </div>
            </div>
          </div>
        </template>
      </template>

      <template v-else>
        <NoData title="Belum Ada Evidence" />
      </template>
    </template>
  </BaseModal>
</template>