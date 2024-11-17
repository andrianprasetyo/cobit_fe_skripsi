<script setup>
import { reactive, watch } from 'vue'

import BaseModal from '@/components/Modal/BaseModal.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'

import CapabilityServices from '@/services/lib/capability'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'refresh'])

const assessmentStore = useAssessmentStore()
const toast = useToast()
const route = useRoute()

/* ---------------------------------- STATE --------------------------------- */
const notes = reactive({
  loading: false,
  data: [],
})

/* --------------------------------- METHODS -------------------------------- */
const getPenilaianNoteCapability = async ({
  domain_id,
  assesment_id,
  level,
}) => {
  try {
    notes.loading = true;

    const response = await CapabilityServices.getPenilaianNoteCapability({
      domain_id,
      assesment_id,
      level
    })

    if (response) {
      const data = response.data

      notes.loading = false
      notes.data = data || []
    }
  } catch (error) {
    notes.loading = false
    toast.error({ error })
  }
}

const handleClose = () => {
  emits('close', true)
}
/* ---------------------------------- HOOKS --------------------------------- */
watch(() => [props.isShow], () => {
  if (props.isShow) {
    getPenilaianNoteCapability({
      domain_id: assessmentStore.capability.selectedGamo?.id,
      assesment_id: route.params?.id,
      level: assessmentStore.capability.selectedLevel
    })
  }
}, { deep: true })

</script>

<template>
  <BaseModal id="penilaian-note-modal" :order="6" :open="props.isShow" classNameModal="modal-lg" @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Daftar Catatan / Note Penilaian
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

      <LoadingOverlay :active="notes.loading" />

      <template v-if="Array.isArray(notes.data) && notes.data.length">
        <div class="rounded border p-3 mt-3">
          <template v-for="(note, index) in notes.data" :key="`note-${index}-${note?.id}`">
            <div class="d-flex flex-row">
              <div>
                <div
                  class="flex-shrink-0 bg-primary-subtle text-primary rounded-circle round d-flex align-items-center justify-content-center">
                  <TablerIcon icon="NoteIcon" class="fs-6" />
                </div>
              </div>

              <div class="ms-3">
                <h6 class="mb-1 fs-4 fw-semibold">{{ note?.domain?.kode }}.{{ note?.capability_level?.kode }}
                </h6>
                <div v-html="note?.note" />
              </div>
            </div>
          </template>
        </div>
      </template>

      <template v-else>
        <NoData title="Belum Ada Note / Catatan" />
      </template>
    </template>
  </BaseModal>
</template>