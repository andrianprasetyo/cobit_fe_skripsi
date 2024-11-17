<script setup>
import { reactive, computed, onMounted, ref, watch } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import NoOptions from '@/components/EmptyPlaceholder/NoOptions.vue'
import BaseAlert from '@/components/Alert/BaseAlert.vue'
import BaseSelect from '@/components/Select/BaseSelect.vue'
import BaseCheckboxInput from '@/components/Input/BaseCheckboxInput.vue'
import BaseCheckboxInputWithVModel from '@/components/Input/BaseCheckboxInputWithVModel.vue'

import AssessmentTargetServices from '@/services/lib/assessment-target'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, maxValue, minValue, requiredIf } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useRouter, useRoute } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'
import { useAuth } from '@/stores/auth'

import optionsFilterAssessment from '@/data/optionsFilterListGamoAssessment.json'

const toast = useToast()
const router = useRouter()
const route = useRoute()
const loading = useLoading()
const auth = useAuth()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loading: false,
  loadingSubmit: false,
  listTarget: [],
  nama: '',
  optionsFilterAssessment: optionsFilterAssessment
})

const filter = ref({
  assesment: 0
})

const rules = computed(() => {
  return {
    nama: {
      required: helpers.withMessage('Silahkan isi nama target', required),
    },
    listTarget: {
      $each: helpers.forEach({
        target: {
          required: helpers.withMessage('Silahkan isi target', requiredIf(false)),
          minValue: helpers.withMessage("Minimal angka target 0", minValue(0)),
          maxValue: helpers.withMessage("Maksimal angka target 4", maxValue(4)),
        },
      })
    }
  }
})

const assessmentId = computed(() => {
  return route.params?.id
})

const assessmentTitle = computed(() => {
  return route.query?.assessment
})

const isCheckedAll = computed(() => {
  return (
    formState.listTarget?.length > 0 &&
    formState.listTarget.every(item => item?.assesment))
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true })

/* --------------------------------- METHODS -------------------------------- */
const getListTargetGamoByAssessmentId = async ({ assesment_id, assesment }) => {
  const loader = loading.show()
  try {
    formState.loading = true
    const response = await AssessmentTargetServices.getListTargetGamoByAssessmentId({ assesment_id, assesment })

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

const handleCheckAll = (event) => {
  const isChecked = event.target.checked

  if (isChecked) {
    const listChecked = [];

    formState.listTarget.map(item => {
      listChecked.push({ ...item, assesment: item?.target ? true : false })
    }
    )

    formState.listTarget = listChecked;
  } else {
    const listUnchecked = [];

    formState.listTarget.map(item =>
      listUnchecked.push({ ...item, assesment: false })
    )

    formState.listTarget = listUnchecked;
  }
}

const handleSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const loader = loading.show()
    try {
      formState.loadingSubmit = true

      let payload = {
        id: null,
        assesment_id: assessmentId.value,
        nama: formState.nama,
        target: formState.listTarget,
      }

      const response = await AssessmentTargetServices.saveTarget(payload)

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
watch(() => [filter.value], () => {
  getListTargetGamoByAssessmentId({
    assesment_id: assessmentId.value,
    assesment: filter.value.assesment
  })
}, { deep: true, immediate: true })

onMounted(() => {
  auth.setMenuToProject()
})

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <div class="card-body">
          <div class="pb-3 mb-sm-0">
            <h5 class="card-title fw-semibold">Tambah Target Asesmen</h5>
            <p v-if="assessmentTitle" class="card-subtitle mb-0">{{ assessmentTitle }}</p>
          </div>

          <div class="mb-3">
            <BaseInput id="nama" v-model="v$.nama.$model" label="Nama Target" placeholder="Masukkan Nama Target"
              tabindex="1" :isInvalid="v$.nama.$errors?.length" :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.nama.$errors" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-12 col-md-4">
              <BaseSelect id="filter-gamo" v-model="filter.assesment" label="Filter GAMO yang Ditampilkan"
                default-option="Pilih Opsi Filter" :options="formState.optionsFilterAssessment" options-label="label"
                options-value="value" :disabled="formState.loading" />
            </div>
          </div>

          <BaseAlert
            v-if="Array.isArray(v$.listTarget.$each?.$response?.$errors) && v$.listTarget.$each?.$response?.$errors.length"
            variant="danger">
            <strong>Perhatian.</strong> Terdapat beberapa target yang belum terisi ataupun belum sesuai
          </BaseAlert>

          <div v-if="formState.listTarget?.length" class="table-responsive rounded-2 mb-4 mt-4 ">
            <div class="mh-100vh">
              <table class="table border customize-table text-nowrap mb-0 align-middle">
                <thead class="position-sticky top-0 bg-white text-dark" style="z-index: 5 !important;">
                  <tr>
                    <th class="align-middle text-center" rowspan="2">
                      <h6 class="fs-3 fw-semibold mb-0">No</h6>
                    </th>
                    <th class="align-middle" rowspan="2">
                      <h6 class="fs-3 fw-semibold mb-0">GAMO</h6>
                    </th>
                    <th class="align-middle text-center" rowspan="2">
                      <h6 class="fs-3 fw-semibold mb-0">Target</h6>
                    </th>
                    <th class="align-middle text-center" rowspan="2">
                      <div class="d-flex justify-content-center align-items-center"
                        v-tooltip="`Apakah Semua GAMO yang Mempunyai Value Ingin Dijadikan Asesmen?`">
                        <BaseCheckboxInput id="checkbox-check-all-access" class="form-check-input big-checkbox"
                          style="transform: scale(1.15);" @change="handleCheckAll" :checked="isCheckedAll"
                          :access="['master-organisasi-edit']" />
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(item, index) in formState.listTarget" :key="`target-${index}`">
                    <td class="text-center">
                      {{ index + 1 }}
                    </td>
                    <td>
                      <div class="d-flex flex-wrap flex-column">
                        <div v-if="item?.domain?.kode" class="width-250px text-break text-wrap fw-bold"
                          v-html="item?.domain?.kode" />
                        <div v-if="item?.domain?.ket" class="width-250px text-break text-wrap"
                          v-html="item?.domain?.ket" />
                      </div>
                    </td>
                    <td>
                      <div class="d-flex flex-column">
                        <BaseInput :id="`input-gamo-${index}`" type="number" v-model="item.target"
                          :disabled="formState.loadingSubmit" placeholder="Masukkan Target"
                          :is-invalid="!!v$.listTarget.$each?.$response?.$errors[index].target?.length">
                        </BaseInput>
                        <ErrorMessage
                          v-if="Array.isArray(v$.listTarget.$each?.$response?.$errors) && v$.listTarget.$each?.$response?.$errors.length"
                          :errors="v$.listTarget.$each?.$response?.$errors[index].target" />
                      </div>
                    </td>
                    <td>
                      <div class="d-flex align-items-center justify-content-center"
                        v-tooltip="`Apakah GAMO Ingin Dijadikan Asesmen?`">
                        <BaseCheckboxInputWithVModel :id="`is-assessment-${item?.id}`" :name="`assessment-${item?.id}`"
                          :disabled="formState.loadingSubmit || !item.target" :value="item?.assesment"
                          :true-value="true" style="transform: scale(1.15);" :false-value="false"
                          v-model="item.assesment">
                        </BaseCheckboxInputWithVModel>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <NoOptions v-else title="Tidak ada Daftar GAMO Ditemukan" />
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
                :is-loading="formState.loadingSubmit" :access="['project-add', 'project-edit']">
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