<script setup>
import { reactive, computed, onMounted, onUnmounted } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import DateInput from '@/components/Input/DateInput.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import CKEditor from '@/components/CKEditor/CKEditor.vue'

import AssessmentServices from '@/services/lib/assessment'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useRouter, useRoute } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useTitle } from '@vueuse/core'

const title = useTitle()
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
  start_date: '',
  end_date: '',
  start_date_quisioner: '',
  end_date_quisioner: ''
})

const rules = computed(() => {
  return {
    assessment: {
      required: helpers.withMessage('Silahkan isi nama asesmen', required),
    },
    deskripsi: {
      required: helpers.withMessage("Silahkan isi deskripsi", required)
    },
    start_date: {
      required: helpers.withMessage("Silahkan isi tanggal mulai asesmen", required)
    },
    end_date: {
      required: helpers.withMessage("Silahkan isi tanggal selesai asesmen", required)
    },
    start_date_quisioner: {
      required: helpers.withMessage("Silahkan isi tanggal mulai kuesioner", required)
    },
    end_date_quisioner: {
      required: helpers.withMessage("Silahkan isi tanggal selesai kuesioner", required)
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
        nama: formState.assessment,
        deskripsi: formState.deskripsi,
        start_date: formState.start_date,
        end_date: formState.end_date,
        start_date_quisioner: formState.start_date_quisioner,
        end_date_quisioner: formState.end_date_quisioner
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Edit Asesmen',
          text: 'Berhasil Mengubah Data Asesmen'
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
    formState.start_date = data?.start_date || ''
    formState.end_date = data?.end_date || ''
    formState.start_date_quisioner = data?.start_date_quisioner || ''
    formState.end_date_quisioner = data?.end_date_quisioner || ''

    title.value = `Edit ${data?.nama || ''}`
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
          <h5 class="card-title mb-9 fw-semibold">Asesmen</h5>

          <div class="mb-3">
            <BaseInput id="assessment" v-model="v$.assessment.$model" label="Nama Asesmen"
              placeholder="Masukkan Nama Asesmen" tabindex="1" :isInvalid="v$.assessment.$errors?.length"
              :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.assessment.$errors" />
          </div>

          <div class="mb-3">
            <label class="form-label" for="deskripsi">Deskripsi Asesmen</label>

            <CKEditor id="deskripsi" tabindex="2" v-model="v$.deskripsi.$model" placeholder="Masukkan Deskripsi"
              :isInvalid="!!v$.deskripsi.$errors?.length" :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.deskripsi.$errors" />
          </div>

          <div class="row mb-3">
            <div class="col-12 col-md-6">
              <DateInput uid="start_date" v-model="v$.start_date.$model" label="Tanggal Mulai Asesmen" locale="id"
                model-type="yyyy-MM-dd" format="dd/MM/yyyy" placeholder="Silahkan Pilih Tanggal Mulai Asesmen"
                :disabled="formState.loadingSubmit" tabindex="3" :isInvalid="v$.start_date.$errors?.length"
                :enable-time-picker="false" />
              <ErrorMessage :errors="v$.start_date.$errors" />
            </div>

            <div class="col-12 col-md-6">
              <DateInput uid="end_date" v-model="v$.end_date.$model" label="Tanggal Selesai Asesmen" locale="id"
                model-type="yyyy-MM-dd" format="dd/MM/yyyy" placeholder="Silahkan Pilih Tanggal Selesai Asesmen"
                :disabled="formState.loadingSubmit || !formState.start_date" tabindex="4"
                :isInvalid="v$.end_date.$errors?.length" :min-date="formState.start_date" :enable-time-picker="false" />
              <ErrorMessage :errors="v$.end_date.$errors" />
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-12 col-md-6">
              <DateInput uid="start_date_quisioner" v-model="v$.start_date_quisioner.$model"
                label="Tanggal Mulai Kuesioner" locale="id" model-type="yyyy-MM-dd" format="dd/MM/yyyy"
                :min-date="formState.start_date" :max-date="formState.end_date"
                placeholder="Silahkan Pilih Tanggal Mulai Kuesioner" :disabled="formState.loadingSubmit" tabindex="5"
                :isInvalid="v$.start_date_quisioner.$errors?.length" :enable-time-picker="false" />
              <ErrorMessage :errors="v$.start_date_quisioner.$errors" />
            </div>

            <div class="col-12 col-md-6">
              <DateInput uid="end_date_quisioner" v-model="v$.end_date_quisioner.$model" label="Tanggal Selesai Kuesioner"
                locale="id" model-type="yyyy-MM-dd" format="dd/MM/yyyy"
                placeholder="Silahkan Pilih Tanggal Selesai Kuesioner"
                :disabled="formState.loadingSubmit || !formState.start_date" tabindex="6"
                :isInvalid="v$.end_date_quisioner.$errors?.length" :min-date="formState.start_date_quisioner"
                :max-date="formState.end_date" :enable-time-picker="false" />
              <ErrorMessage :errors="v$.end_date_quisioner.$errors" />
            </div>
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