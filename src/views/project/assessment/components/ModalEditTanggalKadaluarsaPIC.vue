<script setup>
import { reactive, computed, watch } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import DateInput from '@/components/Input/DateInput.vue'

import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useToast } from '@/stores/toast'
import { useLoading } from 'vue-loading-overlay'

import AssessmentServices from '@/services/lib/assessment'

const assessment = useAssessmentStore()
const toast = useToast()
const loading = useLoading()

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'refresh'])

/* ---------------------------------- STATE --------------------------------- */
const formState = reactive({
  loadingSubmit: false,
  expire_at: ''
})

/* -------------------------------- COMPUTED -------------------------------- */
const rules = computed(() => {
  return {
    expire_at: {
      required: helpers.withMessage("Silahkan pilih tanggal kadaluarsa PIC", required)
    },
  }
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true, $scope: false })

/* --------------------------------- METHODS -------------------------------- */

const handleClose = () => {
  emits('close', true)
}

const setValueToForm = () => {
  formState.expire_at = assessment.detail?.assesment_user?.expire_at || ''
}

const onSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const loader = loading.show()
    try {
      formState.loadingSubmit = true

      const response = await AssessmentServices.editTanggalKadaluarsaPic({
        id: assessment.detail?.assesment_user?.id,
        expire_at: formState.expire_at
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Ubah Tanggal Kadaluarsa PIC',
          text: 'Berhasil Mengubah Tanggal Kadaluarsa PIC'
        })
        assessment.$patch({
          detail: {
            ...assessment.detail, assesment_user: {
              ...assessment.detail.assesment_user,
              expire_at: formState.expire_at
            }
          }
        })
        v$.value.$reset()
        handleClose()
      }
    } catch (error) {
      loader.hide()
      formState.loadingSubmit = false
      toast.error({ error })
    }
  }
}

watch(() => [props.isShow], () => {
  if (props.isShow) {
    setValueToForm()
  }
}, { deep: true })
</script>

<template>
  <BaseModal id="tanggal_kadaluarsa_pic" :order="7" :open="props.isShow" :showBtnCloseFooter="false"
    classNameModal="modal-lg" @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Edit Tanggal Kadalursa PIC
      </h4>
    </template>

    <template #body>
      <div class="mb-3">
        <DateInput uid="expire_at" v-model="v$.expire_at.$model" label="Tanggal Kadaluarsa PIC" locale="id"
          model-type="yyyy-MM-dd" format="dd/MM/yyyy" placeholder="Silahkan Pilih Tanggal Kadaluarsa PIC"
          :disabled="formState.loadingSubmit" tabindex="1" :isInvalid="v$.expire_at.$errors?.length"
          :min-date="assessment.detail?.start_date" :max-date="assessment.detail?.end_date"
          :enable-time-picker="false" />
        <ErrorMessage :errors="v$.expire_at.$errors" />
      </div>
    </template>

    <template #footer>
      <BaseButton @click="onSubmit" title="Simpan Perubahan" :disabled="formState.loadingSubmit"
        :is-loading="formState.loadingSubmit">
        <template #icon-left>
          <TablerIcon icon="DeviceFloppyIcon" />
        </template>
      </BaseButton>
    </template>
  </BaseModal>
</template>