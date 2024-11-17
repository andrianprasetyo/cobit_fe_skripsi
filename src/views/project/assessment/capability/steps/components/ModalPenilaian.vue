<script setup>
import { reactive, computed, watch } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import CKEditor from '@/components/CKEditor/CKEditor.vue'
import BaseAlert from '@/components/Alert/BaseAlert.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'

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
  capability_answer_id: null,
  note: null,
})

/* -------------------------------- COMPUTED -------------------------------- */
const rules = computed(() => {
  return {
    capability_answer_id: {
      required: helpers.withMessage("Silahkan pilih nilai asesmen", requiredIf(props.isShow))
    },
  }
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true, $stopPropagation: true })

/* --------------------------------- METHODS -------------------------------- */
const handleClose = () => {
  emits('close', true)
}

const setValueToForm = () => {
  formState.capability_answer_id = assessmentStore.capability.selectedSubGamo?.capabilityass?.capability_answer_id
  formState.note = assessmentStore.capability.selectedSubGamo?.capabilityass?.note
}

const handleSubmit = async () => {
  const payload = {
    ...assessmentStore.capability.selectedSubGamo,
    capabilityass: {
      ...assessmentStore.capability.selectedSubGamo.capabilityass,
      ...formState,
      isEdited: true,
    }
  }
  assessmentStore.saveCapabilityPenilaianSubGamo(payload)
  handleClose()
}

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => [props.isShow], () => {
  if (props.isShow) {
    setValueToForm()
  } else {
    formState.capability_answer_id = null
    formState.note = null
  }
}, { deep: true })

</script>

<template>
  <BaseModal id="penilaian" :order="1" :open="props.isShow" :showBtnCloseFooter="false" classNameModal="modal-lg"
    @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Penilaian Kapabilitas
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
        <div style="font-weight: bold !important; font-style: italic !important;"
          v-html="assessmentStore.capability.selectedSubGamo?.guidelines || '-'" />
      </div>

      <div class="mb-3">
        <BaseAlert v-if="v$?.capability_answer_id?.$errors?.length" variant="danger">
          <strong>Perhatian.</strong>
          <ErrorMessage onlyShowOne class="text-body p-0" :errors="v$.capability_answer_id.$errors" />
        </BaseAlert>
        <div class="table-responsive rounded-2 mb-4 mt-4">
          <div class="mh-100vh">
            <table class="table border customize-table text-nowrap mb-0 align-middle">
              <thead class="position-sticky top-0 bg-white text-dark" style="z-index: 5 !important;">
                <tr>
                  <th class="align-middle text-center" colspan="5" rowspan="1">
                    <h6 class="fs-3 fw-semibold mb-0">Asesmen</h6>
                  </th>
                </tr>
                <tr>
                  <th v-for="item in assessmentStore.capability.detailListAnswer" :key="`header-item-${item?.id}`"
                    rowspan="1" class="width-125px align-middle">
                    <div class="width-100px text-break text-wrap text-center">
                      <h6 class="fs-3 fw-semibold mb-2">
                        {{ item?.nama }} ({{ item?.label }})
                      </h6>
                      <h6 class="fs-3 mb-0">
                        {{ item?.bobot }}
                      </h6>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <template
                    v-if="Array.isArray(assessmentStore.capability.detailListAnswer) && assessmentStore.capability.detailListAnswer.length">
                    <td v-for="(answer, index) in assessmentStore.capability.detailListAnswer"
                      :key="`answer-radio-${index}`">
                      <div class="form-check form-check-inline d-flex justify-content-center align-items-center">
                        <input type="radio" :id="`radio-answer-${index}`"
                          class="form-check-input primary check-outline outline-primary" :class="{
    'is-invalid': v$?.capability_answer_id?.$errors?.length
  }" v-model="v$.capability_answer_id.$model" :value="answer.id" :name="`radio-answer-${index}`" />
                      </div>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <hr class="my-3" />

      <div class="mb-3">
        <label class="form-label" for="note-input">Note</label>

        <CKEditor id="note-input" placeholder="Masukkan Note (Jika Ada)" v-model="formState.note" />
      </div>
    </template>

    <template #footer>
      <BaseButton @click="handleSubmit" title="Simpan Sebagai Draft Penilaian"
        :disabled="!formState.capability_answer_id" :access="['project-add', 'project-edit' ]">
        <template #icon-left>
          <TablerIcon icon="CheckboxIcon" />
        </template>
      </BaseButton>
    </template>
  </BaseModal>
</template>