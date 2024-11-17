<script setup>
import { reactive, computed, watch } from 'vue'

import BaseModal from '@/components/Modal/BaseModal.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import BaseSelect from '@/components/Select/BaseSelect.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import CKEditor from '@/components/CKEditor/CKEditor.vue'

import evidentPBCStatusJSON from '@/data/evidentPBCStatus.json'

import { useVuelidate } from "@vuelidate/core";
import { helpers, requiredIf } from "@vuelidate/validators";
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'refresh'])

const assessmentStore = useAssessmentStore()

/* ---------------------------------- STATE --------------------------------- */
const formState = reactive({
  status: "",
  note: "",
  data_owner: ""
})

/* -------------------------------- COMPUTED -------------------------------- */
const rules = computed(() => {
  return {
    status: {
      required: helpers.withMessage("Silahkan pilih status", requiredIf(props.isShow))
    },
  }
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true, $stopPropagation: true })

/* --------------------------------- METHODS -------------------------------- */
const setValueToForm = () => {
  formState.status = assessmentStore.capability.selectedSubGamo?.capabilityass?.pbc?.status || ''
  formState.note = assessmentStore.capability.selectedSubGamo?.capabilityass?.pbc?.note || ''
  formState.data_owner = assessmentStore.capability.selectedSubGamo?.capabilityass?.pbc?.data_owner || ''
}

const resetForm = () => {
  formState.status = "";
  formState.note = "";
  formState.data_owner = "";
  v$.value.$reset()
}

const handleClose = () => {
  resetForm()
  emits('close', true)
}

const handleSubmit = async () => {
  const payload = {
    ...assessmentStore.capability.selectedSubGamo,
    capabilityass: {
      ...assessmentStore.capability.selectedSubGamo.capabilityass,
      pbc: {
        ...formState,
      },
      isEditedPbc: true,
    }
  }
  assessmentStore.saveCapabilityPBCSubGamo(payload)
  handleClose()
}

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => [props.isShow], () => {
  if (props.isShow) {
    setValueToForm()
  } else {
    resetForm()
  }
}, { deep: true })

</script>

<template>
  <BaseModal id="update-pbc" :order="8" :open="props.isShow" :show-btn-close-footer="false" classNameModal="modal-lg"
    @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Update Status Kebutuhan Dokumen
      </h4>
    </template>

    <template #body>
      <div class="mb-4 rounded border p-4">
        <h6 class="text-center">
          Management Practice Code
        </h6>
        <h4 class="fw-bolder text-center">
          {{ assessmentStore.capability?.selectedSubGamo?.subkode }}
        </h4>
        <hr />
        <p class="mb-1 fs-2">Activities</p>
        <div style="font-weight: bold !important;" v-html="assessmentStore.capability.selectedSubGamo?.translate" />
        <p class="mb-1 fs-2">Translate</p>
        <div style="font-weight: bold !important; font-style: italic !important;"
          v-html="assessmentStore.capability.selectedSubGamo?.kegiatan" />
        <p class="mb-1 fs-2">Kebutuhan Dokumen</p>
        <div style="font-weight: bold !important;"
          v-html="assessmentStore.capability.selectedSubGamo?.guidelines || '-'" />
      </div>

      <div class="mb-3">
        <BaseSelect :id="`status-pbc`" label="Status" default-option="Pilih Status" :options="evidentPBCStatusJSON"
          v-model:model-value="v$.status.$model" :is-invalid="!!v$.status.$errors?.length" options-label="label"
          options-value="value" />

        <ErrorMessage :errors="v$.status.$errors" />
      </div>

      <div class="mb-3">
        <BaseInput id="data_owner" v-model="formState.data_owner" label="Data Owner" placeholder="Masukkan Data Owner"
          :disabled="formState.loadingSubmit" />
      </div>

      <div class="mb-3">
        <label class="form-label" for="note-pbc">Keterangan</label>
        <CKEditor id="note-pbc" v-model="formState.note" :disabled="formState.loadingSubmit"
          placeholder="Masukkan Keterangan" />
      </div>
    </template>

    <template #footer>
      <BaseButton @click="handleSubmit" title="Simpan Perubahan" :access="['project-add', 'project-edit']">
        <template #icon-left>
          <TablerIcon icon="CheckboxIcon" />
        </template>
      </BaseButton>
    </template>
  </BaseModal>
</template>