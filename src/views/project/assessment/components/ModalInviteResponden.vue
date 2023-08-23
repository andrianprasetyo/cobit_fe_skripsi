<script setup>
import { reactive, computed } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import BaseSelect from '@/components/Select/BaseSelect.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'

import { useVuelidate } from "@vuelidate/core";
import { helpers, required, requiredIf, email } from "@vuelidate/validators";
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const assessment = useAssessmentStore()

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close'])

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loadingSubmit: false,
  inviteBy: '',
  emails: [],
  inviteByList: [
    {
      label: 'Kirim Lewat Email',
      value: 'email'
    },
    {
      label: 'Import dari Excel',
      value: 'excel'
    }
  ]
})

const rules = computed(() => {
  return {
    inviteBy: {
      required: helpers.withMessage('Silahkan pilih cara untuk mengundang responden', required),
    },
    emails: {
      requiredIf: helpers.withMessage('Silahkan alamat email yang ingin diundang', requiredIf(formState.inviteBy === 'email')),
    },
  }
})

const v$ = useVuelidate(rules, formState, { $autoDirty: false })

/* --------------------------------- METHODS -------------------------------- */
const dropdownEmailShouldOpen = (VueSelect) => {
  if (VueSelect.search.length && email.$validator(VueSelect.search)) {
    return VueSelect.open;
  } else {
    return false;
  }
}

const handleClose = () => {
  emits('close', true)
}

const inviteRespondenByEmail = async () => {
  try {
    formState.loadingSubmit = true
    const response = await assessment.inviteResponden({ id: assessment.selectedAssessment?.id, email: formState.emails })

    if (response) {
      formState.loadingSubmit = false
      v$.value.$reset()

    }
  } catch (error) {
    formState.loadingSubmit = false
  }
}

const handleSubmit = () => {
  if (formState.inviteBy === 'email') {
    inviteRespondenByEmail()
  }
}


</script>

<template>
  <BaseModal id="invite_responden" :order="1" :open="props.isShow" :showBtnCloseFooter="false" classNameModal="modal-lg"
    @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Undang Responden
      </h4>
    </template>

    <template #body>
      <div class="mb-3">
        <BaseSelect id="invite_by" v-model="v$.inviteBy.$model" label="Undang Melalui" tabindex="1"
          default-option="Pilih Cara Undang" :options="formState.inviteByList" options-label="label" options-value="value"
          :disabled="formState.loadingSubmit" :isInvalid="!!v$.inviteBy.$errors?.length" />

        <ErrorMessage :errors="v$.inviteBy.$errors" />
      </div>


      <template v-if="formState.inviteBy === 'email'">
        <hr />

        <div class="mb-3">
          <label class="form-label" for="email_responden">Email Responden</label>

          <v-select id="email_responden" label="value" v-model="v$.emails.$model"
            placeholder="Masukkan email yang ingin diundang" :taggable="true" :multiple="true" :no-drop="true"
            :tabindex="2" :dropdown-should-open="dropdownEmailShouldOpen" :disabled="formState.loadingSubmit"
            :select-on-key-codes="[]" :class="{ 'invalid-v-select': !!v$.emails.$errors?.length }">
            <template v-slot:option="option">
              Undang alamat email <strong>{{ option?.value }}</strong>
            </template>
          </v-select>

          <ErrorMessage :errors="v$.emails.$errors" />
        </div>
      </template>
    </template>

    <template #footer>
      <BaseButton @click="handleSubmit" title="Simpan" :disabled="formState.loadingSubmit"
        :is-loading="formState.loadingSubmit">
        <template #icon-left>
          <TablerIcon icon="DeviceFloppyIcon" />
        </template>
      </BaseButton>
    </template>
  </BaseModal>
</template>