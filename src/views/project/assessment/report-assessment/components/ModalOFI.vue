<script setup>
import { reactive, watch, computed } from 'vue'

import BaseModal from '@/components/Modal/BaseModal.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseButton from '@/components/Button/BaseButton.vue'

import AssessmentServices from '@/services/lib/assessment'

import { useClipboard } from '@vueuse/core'
import { useToast } from '@/stores/toast'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const toast = useToast()
const assessmentStore = useAssessmentStore()
const { isSupported, copy, copied } = useClipboard()

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'refresh'])

const reportOFI = reactive({
  loading: false,
  data: null
})

const copiedContent = computed(() => {
  if (reportOFI.data?.ofi?.length) {
    let plainText = "";

    plainText += `Rekomendasi aktivitas yang dapat dilakukan untuk mencapai tingkat kematangan ${assessmentStore.report?.selectedGamo?.target_level}\n`
    plainText += `(aktivitas COBIT untuk mencapai ${assessmentStore.report?.selectedGamo?.target_organisasi?.target?.nama} = ${assessmentStore.report?.selectedGamo?.target_level}) adalah :\n`
    reportOFI.data?.ofi.forEach((item, index) => {
      plainText += `${index + 1}. ${item.ofi.replace(/<\/?p>/g, '')}\n`;
    })

    return plainText
  } else {
    return ''
  }


})

/* --------------------------------- METHODS -------------------------------- */
const getReportDetailOFIAssessment = async ({ domain_id, assesment_id, capability_target_id }) => {
  try {
    reportOFI.loading = true
    const response = await AssessmentServices.getReportDetailOFIAssessment({ domain_id, assesment_id, capability_target_id })

    if (response) {
      const data = response?.data

      reportOFI.data = data
      reportOFI.loading = false
    }
  } catch (error) {
    reportOFI.loading = false
    toast.error({ error })
  }
}

const handleClose = () => {
  emits('close', true)
}

const handleCopy = () => {
  copy(copiedContent.value).catch(() => {
    toast.error({ text: 'Gagal Menyalin Opportunity for Improvement' })
  })
}

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => [props.isShow], () => {
  if (props.isShow) {
    getReportDetailOFIAssessment({
      domain_id: assessmentStore.report.selectedGamo?.domain_id,
      assesment_id: assessmentStore.report.selectedGamo?.assesment_id,
      capability_target_id: assessmentStore.report.selectedGamo?.capability_target_id
    })
  } else {
    reportOFI.data = null
  }
}, { deep: true })

</script>

<template>
  <BaseModal id="view_ofi" :order="1" :open="props.isShow" :showBtnCloseFooter="true" classNameModal="modal-lg"
    @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Opportunity for Improvement
      </h4>
    </template>

    <template #body>
      <div v-if="reportOFI.loading" style="height: 200px;">
        <LoadingOverlay :active="reportOFI.loading" />
      </div>

      <div v-else>
        <h4 class="fw-bolder">
          {{ reportOFI.data?.domain?.kode }}
        </h4>
        <h6 v-html="reportOFI.data?.domain?.ket" />

        <h6 class="text-primary">
          ( Hasil Maturity:
          <span class="fw-bolder">{{ assessmentStore.report?.selectedGamo?.hasil_assesment }}</span>;
          {{ assessmentStore?.report?.selectedGamo?.target_organisasi?.target?.nama }}:
          <span class="fw-bolder">{{ assessmentStore.report?.selectedGamo?.target_level }}</span> )
        </h6>
      </div>

      <hr v-if="reportOFI.data?.ofi.length" />


      <div v-if="Array.isArray(reportOFI.data?.ofi) && reportOFI.data?.ofi.length" class="row rounded border p-3 mt-3">
        <div class="col-12 col-md-10">
          <h6 class="lh-base">Rekomendasi aktivitas yang dapat dilakukan untuk mencapai tingkat kematangan {{
            assessmentStore.report?.selectedGamo?.target_level }} <br />
            <span class="text-primary">(aktivitas COBIT untuk mencapai {{
              assessmentStore.report?.selectedGamo?.target_organisasi?.target?.nama
            }} = {{ assessmentStore.report?.selectedGamo?.target_level }})
            </span>
            adalah:
          </h6>
          <ol>
            <template v-for="(item, index) in reportOFI.data?.ofi" :key="`ofi-${index}-${item?.id}`">
              <li v-if="item?.ofi" class="lh-base">
                <div v-html="item?.ofi" />
              </li>
            </template>
          </ol>
        </div>

        <div v-if="isSupported && Array.isArray(reportOFI.data?.ofi) && reportOFI.data?.ofi.length"
          class="col-12 col-md-2 text-center text-md-end mt-2 mt-md-0">
          <BaseButton @click="handleCopy" :title="copied ? 'Tersalin' : 'Salin'"
            :class="[copied ? 'btn btn-sm btn-success' : 'btn btn-sm btn-primary']">
            <template #icon-left>
              <TablerIcon :icon="copied ? 'ClipboardCheckIcon' : 'CopyIcon'" />
            </template>
          </BaseButton>

        </div>
      </div>

      <template v-else-if="Array.isArray(reportOFI.data?.ofi) && !reportOFI.data?.ofi.length && !reportOFI.loading">
        <NoData title="Belum Ada Opportunity for Improvement Dibuat" />
      </template>
    </template>
  </BaseModal>
</template>