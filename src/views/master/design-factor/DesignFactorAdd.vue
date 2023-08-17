<script setup>
import { reactive, computed, onMounted } from 'vue'
import debounce from 'lodash.debounce'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import CKEditor from '@/components/CKEditor/CKEditor.vue'
import NoOptions from '@/components/EmptyPlaceholder/NoOptions.vue'

import DesignFactorServices from '@/services/lib/design-factor'
import GroupAnswerServices from '@/services/lib/group-answer'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useRouter } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

import groupAnswerType from '@/data/groupAnswerType.json'

const toast = useToast()
const router = useRouter()
const loading = useLoading()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loadingSubmit: false,
  nama: '',
  kode: '',
  deskripsi: '',
  questions: [],
  df_komponen: [
    {
      nama: '',
      baseline: ''
    }
  ],
  listGroupAnswer: {
    loading: false,
    data: [],
    dropdownOptions: []
  }
})

const rules = computed(() => {
  return {
    nama: {
      required: helpers.withMessage('Silahkan isi nama', required),
    },
    kode: {
      required: helpers.withMessage('Silahkan isi kode', required),
    },
    deskripsi: {
      required: helpers.withMessage("Silahkan isi deskripsi", required)
    },
    questions: {
      $each: helpers.forEach({
        pertanyaan: {
          required: helpers.withMessage('Silahkan isi question', required),
        },
        grup_id: {
          required: helpers.withMessage('Silahkan pilih group question', required),
        }
      })
    },
    df_komponen: {
      $each: helpers.forEach({
        nama: {
          required: helpers.withMessage('Silahkan isi nama', required),
        },
        baseline: {
          required: helpers.withMessage('Silahkan isi baseline', required),
        }
      })
    }
  }
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true })

const labelType = computed(() => {
  return value => {
    const selected = groupAnswerType.find(item => item?.value === value)

    return selected?.label || "Tidak Diketahui"
  }
})

const classType = computed(() => {
  return value => {
    const selected = groupAnswerType.find(item => item?.value === value)

    return selected?.class || "bg-dark text-white"
  }
})

/* --------------------------------- METHODS -------------------------------- */
const getListGroupAnswer = async ({ limit, page, search }) => {
  try {
    formState.listGroupAnswer.loading = true
    const response = await GroupAnswerServices.getListGroupAnswer({ limit, page, search })

    if (response) {
      const data = response?.data

      formState.listGroupAnswer.data = data?.list || []
      formState.listGroupAnswer.loading = false

      handleTambahQuestion()
    }
  } catch (error) {
    formState.listGroupAnswer.loading = false
    toast.error({ error })
  }
}

const handleSearchQuestion = debounce(async ({ search, index }) => {
  try {
    formState.listGroupAnswer.dropdownOptions[index].loading = true
    const response = await GroupAnswerServices.getListGroupAnswer({ search })

    if (response) {
      const data = response?.data
      formState.listGroupAnswer.dropdownOptions[index].loading = false
      formState.listGroupAnswer.dropdownOptions[index].data = data?.list || []
    }
  } catch (error) {
    formState.listGroupAnswer.dropdownOptions[index].loading = false
    toast.error({ error })
  }
}, 500)

const handleTambahQuestion = () => {
  formState.questions.push({
    pertanyaan: '',
    grup_id: ''
  })

  formState.listGroupAnswer.dropdownOptions.push({
    loading: false,
    data: formState.listGroupAnswer.data
  })
}

const handleHapusQuestion = (index) => {
  const filtered = formState.questions.filter((_, itemIndex) => itemIndex !== index)
  formState.questions = filtered

  const filteredDropdown = formState.listGroupAnswer.dropdownOptions.filter((_, itemIndex) => itemIndex !== index)
  formState.listGroupAnswer.dropdownOptions = filteredDropdown
}

const handleTambahKomponen = () => {
  formState.df_komponen.push({
    nama: '',
    baseline: ''
  })
}

const handleHapusKomponen = (index) => {
  const filtered = formState.df_komponen.filter((_, itemIndex) => itemIndex !== index)
  formState.df_komponen = filtered
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

      const response = await DesignFactorServices.createDesignFactorWithQuestionAndComponent({
        df_kode: formState.kode,
        df_nama: formState.nama,
        df_deskripsi: formState.deskripsi,
        question: formState.questions,
        df_komponen: formState.df_komponen
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Tambah Design Factor',
          text: 'Berhasil Menambahkan Data Design Factor'
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
  getListGroupAnswer({ limit: 10, page: 1 })
})

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-9 fw-semibold">Design Factor</h5>

          <div class="mb-3">
            <BaseInput id="kode" v-model="v$.kode.$model" label="Kode" placeholder="Masukkan Kode Design Factor"
              tabindex="1" :isInvalid="v$.kode.$errors?.length" :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.kode.$errors" />
          </div>

          <div class="mb-3">
            <BaseInput id="nama" v-model="v$.nama.$model" label="Nama" placeholder="Masukkan Nama Design Factor"
              tabindex="2" :isInvalid="v$.nama.$errors?.length" :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.nama.$errors" />
          </div>

          <div class="mb-3">
            <label class="form-label" for="deskripsi">Deskripsi</label>

            <CKEditor id="deskripsi" tabindex="3" v-model="v$.deskripsi.$model"
              :isInvalid="!!v$.deskripsi.$errors?.length" :disabled="formState.loadingSubmit" />
            <ErrorMessage v-if="v$.deskripsi.$errors" :errors="v$.deskripsi.$errors" />
          </div>
        </div>
      </div>

      <h2 class="fw-bolder mb-3 fs-8 lh-base">Questions</h2>

      <template v-if="formState.questions.length">
        <div v-for="(_, index) in formState.questions" :key="`question-card-${index}`" class="card">
          <div class="card-body">
            <div class="mb-9 d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
              <div>
                <h5 class="card-title fw-semibold">Question {{ index + 1 }}</h5>
              </div>

              <div>
                <BaseButton @click="handleHapusQuestion(index)" class="btn btn-outline-danger" title="Hapus Question">
                  <template #icon-left>
                    <TablerIcon icon="TrashIcon" />
                  </template>
                </BaseButton>
              </div>
            </div>


            <div class="mb-3">
              <label class="form-label" :for="`question-${index}`">Question</label>

              <CKEditor :id="`question-${index}`" v-model="v$.questions.$model[index].pertanyaan" :tabindex="4 + index"
                :isInvalid="!!v$.questions.$each?.$response?.$errors[index]?.pertanyaan?.length"
                :disabled="formState.loadingSubmit" />
              <ErrorMessage
                v-if="Array.isArray(v$.questions.$each?.$response?.$errors) && v$.questions.$each?.$response?.$errors.length"
                :errors="v$.questions.$each?.$response?.$errors[index].pertanyaan" />
            </div>

            <div class="mb-3">
              <label class="form-label" :for="`group-answer-${index}`">Group Answer</label>

              <v-select :id="`group-answer-${index}`" @search="(search) => handleSearchQuestion({ search, index })"
                :loading="formState.listGroupAnswer.dropdownOptions[index].loading"
                :options="formState.listGroupAnswer.dropdownOptions[index].data" label="id"
                :reduce="(option) => option.id" placeholder="Cari dan Pilih Group Answer" :clearable="true"
                :filterable="false" v-model="v$.questions.$model[index].grup_id" :disabled="formState.loadingSubmit"
                :class="[!!v$.questions.$each?.$response?.$errors[index]?.grup_id?.length ? 'invalid-v-select' : '']">
                <template #no-options>
                  Group Answer tidak ditemukan
                </template>

                <template #option="option">
                  <div class="d-flex flex-row align-items-center py-1">
                    <span class="me-2 fw-bold">
                      {{ option.nama }}
                    </span>

                    <span class="badge rounded-pill font-medium text-capitalize fw-bold" :class="classType(option.jenis)">
                      {{ labelType(option.jenis) }}
                    </span>
                  </div>
                </template>

                <template #selected-option="option">
                  <div class="d-flex flex-row align-items-center py-1">
                    <span class="me-2 fw-bold">
                      {{ option.nama }}
                    </span>

                    <span class="mb-1 badge rounded-pill font-medium text-capitalize fw-bold"
                      :class="classType(option.jenis)">
                      {{ labelType(option.jenis) }}
                    </span>
                  </div>
                </template>
              </v-select>

              <ErrorMessage
                v-if="Array.isArray(v$.questions.$each?.$response?.$errors) && v$.questions.$each?.$response?.$errors.length"
                :errors="v$.questions.$each?.$response?.$errors[index].grup_id" />
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <NoOptions title="Belum Ada Question Dibuat" />
      </template>

      <div class="mt-2 d-flex justify-content-center align-items-center">
        <BaseButton @click="handleTambahQuestion" title="Tambah Question">
          <template #icon-left>
            <TablerIcon icon="PlusIcon" />
          </template>
        </BaseButton>
      </div>

      <h2 class="fw-bolder my-3 fs-8 lh-base">Komponen</h2>

      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-9 fw-semibold">Tambah Komponen</h5>

          <div class="d-flex flex-column mt-4">
            <template v-if="formState.df_komponen.length">
              <div v-for="(_, index) in formState.df_komponen" :key="`df-komponen-${index}`" class="row mb-3">
                <div class="col-12 col-md-9 mb-2 mb-md-0">
                  <BaseInput :id="`input-df-komponen-${index}`" :label="`Komponen ${index + 1}`"
                    v-model="v$.df_komponen.$model[index].nama" placeholder="Masukkan Nama Komponen"
                    :disabled="formState.loadingSubmit"
                    :is-invalid="!!v$.df_komponen.$each?.$response?.$errors[index]?.nama?.length" />
                  <ErrorMessage
                    v-if="Array.isArray(v$.df_komponen.$each?.$response?.$errors) && v$.df_komponen.$each?.$response?.$errors.length"
                    :errors="v$.df_komponen.$each?.$response?.$errors[index]?.nama" />
                </div>
                <div class="col-12 col-md-2">
                  <BaseInput :id="`input-df-baseline-${index}`" :label="`Skor Baseline`" type="number"
                    v-model="v$.df_komponen.$model[index].baseline" placeholder="Masukkan Baseline"
                    :disabled="formState.loadingSubmit"
                    :is-invalid="!!v$.df_komponen.$each?.$response?.$errors[index]?.baseline?.length" />
                  <ErrorMessage
                    v-if="Array.isArray(v$.df_komponen.$each?.$response?.$errors) && v$.df_komponen.$each?.$response?.$errors.length"
                    :errors="v$.df_komponen.$each?.$response?.$errors[index]?.baseline" />
                </div>
                <div class="col-12 col-md-1 d-flex justify-content-center align-items-center mb-2 mb-md-0">
                  <BaseButton @click="handleHapusKomponen(index)" class="btn btn-outline-danger w-100"
                    :class="[v$.df_komponen.$each?.$response?.$errors[index]?.nama?.length || v$.df_komponen.$each?.$response?.$errors[index]?.baseline?.length ? 'mt-1' : 'mt-4']">
                    <TablerIcon icon="TrashIcon" />
                  </BaseButton>
                </div>
              </div>
            </template>

            <template v-else>
              <NoOptions title="Belum Ada Komponen Dibuat" />
            </template>

            <div class="mt-2 d-flex justify-content-center align-items-center">
              <BaseButton @click="handleTambahKomponen" title="Tambah Komponen">
                <template #icon-left>
                  <TablerIcon icon="PlusIcon" />
                </template>
              </BaseButton>
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