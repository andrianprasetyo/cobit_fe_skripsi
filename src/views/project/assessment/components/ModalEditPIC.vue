<script setup>
import { reactive, computed, watch } from 'vue'

import BaseInput from '@/components/Input/BaseInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'

import { useVuelidate } from "@vuelidate/core";
import { helpers, required, email } from "@vuelidate/validators";
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
  pic_nama: '',
  pic_email: '',
  pic_divisi: '',
  pic_jabatan: '',
})

/* -------------------------------- COMPUTED -------------------------------- */
const rules = computed(() => {
  return {
    pic_nama: {
      required: helpers.withMessage("Silahkan isi nama PIC", required)
    },
    pic_email: {
      required: helpers.withMessage("Silahkan isi email PIC", required),
      email: helpers.withMessage("Alamat email tidak valid", email)
    },
    pic_divisi: {
      required: helpers.withMessage("Silahkan isi divisi PIC", required)
    },
    pic_jabatan: {
      required: helpers.withMessage("Silahkan isi jabatan PIC", required)
    },
  }
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true })

/* --------------------------------- METHODS -------------------------------- */
const handleClose = () => {
  emits('close', true)
}

const setValueToForm = () => {
  formState.pic_nama = assessment.detail?.pic?.nama || ''
  formState.pic_email = assessment.detail?.pic?.email || ''
  formState.pic_divisi = assessment.detail?.pic?.divisi || ''
  formState.pic_jabatan = assessment.detail?.pic?.posisi || ''
}

const onSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const loader = loading.show()
    try {
      formState.loadingSubmit = true

      const response = await AssessmentServices.editPic({
        id: assessment.detail?.pic?.id,
        pic_nama: formState.pic_nama,
        pic_email: formState.pic_email,
        pic_divisi: formState.pic_divisi,
        pic_jabatan: formState.pic_jabatan
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Edit PIC',
          text: 'Berhasil Mengubah Data PIC'
        })
        assessment.$patch({
          detail: {
            ...assessment.detail, pic: {
              ...assessment.detail.pic,
              nama: formState.pic_nama,
              email: formState.pic_email,
              divisi: formState.pic_divisi,
              posisi: formState.pic_jabatan
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
  <BaseModal id="edit_pic" :order="3" :open="props.isShow" :showBtnCloseFooter="false" classNameModal="modal-lg"
    @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Edit PIC
      </h4>
    </template>

    <template #body>
      <div class="mb-3">
        <BaseInput id="pic_nama" v-model="v$.pic_nama.$model" label="Nama PIC" placeholder="Masukkan Nama PIC"
          tabindex="1" :isInvalid="v$.pic_nama.$errors?.length" :disabled="formState.loadingSubmit" />
        <ErrorMessage :errors="v$.pic_nama.$errors" />
      </div>

      <div class="mb-3">
        <BaseInput id="pic_email" v-model="v$.pic_email.$model" label="Email PIC" placeholder="Masukkan Email PIC"
          tabindex="2" :isInvalid="v$.pic_email.$errors?.length" :disabled="formState.loadingSubmit" />
        <ErrorMessage :errors="v$.pic_email.$errors" />
      </div>

      <div class="mb-3">
        <BaseInput id="pic_divisi" v-model="v$.pic_divisi.$model" label="Divisi PIC" placeholder="Masukkan Divisi PIC"
          tabindex="3" :isInvalid="v$.pic_divisi.$errors?.length" :disabled="formState.loadingSubmit" />
        <ErrorMessage :errors="v$.pic_divisi.$errors" />
      </div>

      <div class="mb-3">
        <BaseInput id="pic_jabatan" v-model="v$.pic_jabatan.$model" label="Divisi PIC" placeholder="Masukkan Jabatan PIC"
          tabindex="4" :isInvalid="v$.pic_jabatan.$errors?.length" :disabled="formState.loadingSubmit" />
        <ErrorMessage :errors="v$.pic_jabatan.$errors" />
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