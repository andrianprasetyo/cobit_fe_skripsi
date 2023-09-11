<script setup>
import { reactive, computed, onMounted } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import NoOptions from '@/components/EmptyPlaceholder/NoOptions.vue'
import BaseAlert from '@/components/Alert/BaseAlert.vue'

import AssessmentTargetServices from '@/services/lib/assessment-target'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, maxValue } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useRouter, useRoute } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

const toast = useToast()
const router = useRouter()
const route = useRoute()
const loading = useLoading()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loading: false,
  loadingSubmit: false,
  listTarget: [],
  nama: ''
})

const rules = computed(() => {
  return {
    nama: {
      required: helpers.withMessage('Silahkan isi nama target', required),
    },
    listTarget: {
      $each: helpers.forEach({
        target: {
          required: helpers.withMessage('Silahkan isi target', required),
          maxValue: helpers.withMessage("Maksimal angka target 5", maxValue(5))
        },
      })
    }
  }
})

const assessmentId = computed(() => {
  return route.params?.id
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true })

/* --------------------------------- METHODS -------------------------------- */
const getListTargetGamoByAssessmentId = async ({ assesment_id }) => {
  const loader = loading.show()
  try {
    formState.loading = true
    const response = await AssessmentTargetServices.getListTargetGamoByAssessmentId({ assesment_id })

    if (response) {
      const data = response?.data

      const list = []

      if (Array.isArray(data?.list) && data?.list?.length) {
        data?.list.map(item => list.push({
          id: null,
          domain: item,
          domain_id: item?.id,
          capability_target_id: null,
          target: null,
        }))

        formState.listTarget = list
      }
      formState.loading = false
      loader.hide()
    }
  } catch (error) {
    formState.loading = false
    toast.error({ error })
    loader.hide()
  }
}

const handleBack = () => {
  router.back()
}

const handleSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const loader = loading.show()
    try {
      formState.loadingSubmit = true


      const response = await AssessmentTargetServices.saveTarget({
        id: null,
        assesment_id: assessmentId.value,
        nama: formState.nama,
        target: formState.listTarget,
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Tambah Target Asesmen',
          text: 'Berhasil Menambahkan Data Target Asesmen'
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
  getListTargetGamoByAssessmentId({ assesment_id: assessmentId.value })
})

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-9 fw-semibold">Target Asesmen</h5>

          <div class="mb-3">
            <BaseInput id="nama" v-model="v$.nama.$model" label="Nama Target" placeholder="Masukkan Nama Target"
              tabindex="1" :isInvalid="v$.nama.$errors?.length" :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.nama.$errors" />
          </div>
        </div>
      </div>

      <div v-if="formState.listTarget?.length" class="card">
        <div class="card-body">
          <BaseAlert
            v-if="Array.isArray(v$.listTarget.$each?.$response?.$errors) && v$.listTarget.$each?.$response?.$errors.length"
            variant="danger">
            <strong>Perhatian.</strong> Terdapat beberapa target yang belum terisi ataupun belum sesuai
          </BaseAlert>
          <div class="table-responsive rounded-2 mb-4 mt-4 ">
            <div class="mh-100vh">
              <table class="table border customize-table text-nowrap mb-0 align-middle">
                <thead class="position-sticky top-0 bg-white text-dark" style="z-index: 5 !important;">
                  <tr>
                    <th class="align-middle" rowspan="2">
                      <h6 class="fs-3 fw-semibold mb-0">GAMO</h6>
                    </th>
                    <th class="align-middle text-center" rowspan="2">
                      <h6 class="fs-3 fw-semibold mb-0">Target</h6>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(item, index) in formState.listTarget" :key="`target-${index}`">
                    <td>
                      <div class="d-flex flex-wrap flex-column">
                        <div v-if="item?.domain?.kode" class="width-250px text-break text-wrap fw-bold"
                          v-html="item?.domain?.kode" />
                        <div v-if="item?.domain?.ket" class="width-250px text-break text-wrap"
                          v-html="item?.domain?.ket" />
                      </div>
                    </td>
                    <td>
                      <BaseInput :id="`input-gamo-${index}`" type="number" v-model="item.target"
                        :disabled="formState.loadingSubmit" placeholder="Masukkan Target"
                        :is-invalid="!!v$.listTarget.$each?.$response?.$errors[index].target?.length" />
                      <ErrorMessage
                        v-if="Array.isArray(v$.listTarget.$each?.$response?.$errors) && v$.listTarget.$each?.$response?.$errors.length"
                        :errors="v$.listTarget.$each?.$response?.$errors[index].target" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="card">
        <div class="card-body">
          <NoOptions title="Tidak ada Daftar GAMO Ditemukan" />
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