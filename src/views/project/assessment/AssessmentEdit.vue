<script setup>
import { reactive, computed, onMounted, onUnmounted } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import CKEditor from '@/components/CKEditor/CKEditor.vue'

import AssessmentServices from '@/services/lib/assessment'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useRouter, useRoute } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'


const toast = useToast()
const route = useRoute()
const router = useRouter()
const loading = useLoading()
const assessment = useAssessmentStore()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loadingSubmit: false,
  assessment: '',
  deskripsi: '',
})

const rules = computed(() => {
  return {
    assessment: {
      required: helpers.withMessage('Silahkan isi nama assessment', required),
    },
    deskripsi: {
      required: helpers.withMessage("Silahkan isi deskripsi", required)
    },
  }
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true })


const handleBack = () => {
  router.back()
}

const handleSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const loader = loading.show()
    try {
      formState.loadingSubmit = true

      const response = await AssessmentServices.editAssessment({
        id: route.params?.id,
        assesment: formState.assessment,
        deskripsi: formState.deskripsi,
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Edit Assessment',
          text: 'Berhasil Mengubah Data Assessment'
        })
        handleBack()
      }
    } catch (error) {
      loader.hide()
      formState.loadingSubmit = false
      toast.error({ error })
    }
  }
}


/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  assessment.getDetailAssessment({ id: route.params?.id }).then((response) => {
    const data = response?.data

    formState.assessment = data?.nama || ''
    formState.deskripsi = data?.deskripsi || ''
  })
})

onUnmounted(() => {
  assessment.resetState()
})

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-9 fw-semibold">Assessment</h5>

          <div class="mb-3">
            <BaseInput id="assessment" v-model="v$.assessment.$model" label="Nama Assessment"
              placeholder="Masukkan Nama Assessment" tabindex="1" :isInvalid="v$.assessment.$errors?.length"
              :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.assessment.$errors" />
          </div>

          <div class="mb-3">
            <label class="form-label" for="deskripsi">Deskripsi Asessment</label>

            <CKEditor id="deskripsi" tabindex="2" v-model="v$.deskripsi.$model"
              :isInvalid="!!v$.deskripsi.$errors?.length" :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.deskripsi.$errors" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="d-flex flex-column flex-md-row align-items-center">
            <div>
              <BaseButton @click="handleBack" class="btn btn-outline-primary me-0 me-md-3 mb-2 mb-md-0" title="Kembali">
                <template #icon-left>
                  <TablerIcon icon="ChevronLeftIcon" />
                </template>
              </BaseButton>
            </div>

            <div>
              <BaseButton @click="handleSubmit" title="Simpan" :disabled="formState.loadingSubmit"
                :is-loading="formState.loadingSubmit">
                <template #icon-left>
                  <TablerIcon icon="DeviceFloppyIcon" />
                </template>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>