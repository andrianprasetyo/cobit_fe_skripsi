<script setup>
import { reactive, computed, onMounted } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import CKEditor from '@/components/CKEditor/CKEditor.vue'

import DesignFactorServices from '@/services/lib/design-factor'
import GroupAnswerServices from '@/services/lib/group-answer'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useAlert } from '@/stores/alert'
import { useRouter, useRoute } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

import groupAnswerType from '@/data/groupAnswerType.json'

const alert = useAlert()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const loading = useLoading()

/* ---------------------------------- STATE --------------------------------- */
const formState = reactive({
  loading: false,
  loadingSubmit: false,
  questions: [],
  listGroupAnswer: {
    loading: false,
    data: []
  }
})

const rules = computed(() => {
  return {
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
const getQuestionDesignFactor = async () => {
  const loader = loading.show()

  try {
    formState.loading = true
    const response = await DesignFactorServices.getQuestionAndComponentDesignFactor({ id: route.params?.id })

    if (response) {
      const data = response?.data;

      const dataQuestion = data?.quisioner || []

      const listQuestion = []

      if (Array.isArray(dataQuestion) && dataQuestion.length) {
        dataQuestion.map(item => listQuestion.push({
          id: item?.id,
          pertanyaan: item?.pertanyaan,
          grup_id: item?.grup,
        }))

        formState.questions = listQuestion
      }

      formState.loading = false
      loader.hide()
    }

  } catch (error) {
    formState.loading = false
    loader.hide()
    toast.error({ error })
  }
}

const getListGroupAnswer = async ({ limit, page, search }) => {
  try {
    formState.listGroupAnswer.loading = true
    const response = await GroupAnswerServices.getListGroupAnswer({ limit, page, search })

    if (response) {
      const data = response?.data

      formState.listGroupAnswer.data = data?.list || []
      formState.listGroupAnswer.loading = false
    }
  } catch (error) {
    formState.listGroupAnswer.loading = false
    toast.error({ error })
  }
}

const deleteQuestion = async ({ id, index }) => {

  try {
    const response = await DesignFactorServices.deleteQuestionDesignFactor({ id })

    if (response) {
      toast.success({
        title: 'Hapus Question Design Factor',
        text: `Berhasil Menghapus Data Question Design Factor`
      })

      filterQuestion(index)

      return response
    }
  } catch (error) {
    toast.error({ error })
    throw error
  }

}

const handleBack = () => {
  router.back()
}

const handleTambahQuestion = () => {
  formState.questions.push({
    id: null,
    pertanyaan: '',
    grup_id: null,
  })
}

const handleHapusQuestion = ({ title, id, index }) => {
  alert.info({
    title: `Apakah Anda Yakin untuk Menghapus Question ${title}`
  }).then(async (result) => {
    if (result.isConfirmed && id) {
      alert.loading()
      try {
        const response = await deleteQuestion({ id, index })

        if (response) {
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
      }
    } else if (result.isConfirmed) {
      filterQuestion(index)
    }
  })
}

const filterQuestion = (index) => {
  const filtered = formState.questions.filter((_, itemIndex) => itemIndex !== index)
  formState.questions = filtered
}

const handleSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const loader = loading.show()
    try {
      formState.loadingSubmit = true

      const question = [];

      if (formState.questions.length) {
        formState.questions.map(item => question.push({ id: item?.id, pertanyaan: item?.pertanyaan, grup_id: item?.grup_id?.id }))
      }

      const response = await DesignFactorServices.editQuestionDesignFactor({
        id: route.params?.id,
        question: question
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Edit Question Design Factor',
          text: 'Berhasil Mengubah Data Question Design Factor'
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
  getQuestionDesignFactor()
  getListGroupAnswer({ limit: 10, page: 1 })
})

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <h2 class="fw-bolder mb-3 fs-8 lh-base">Questions</h2>

      <template v-if="formState.questions.length">
        <div v-for="(question, index) in formState.questions" :key="`question-card-${index}`" class="card">
          <div class="card-body">
            <div class="mb-9 d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
              <div>
                <h5 class="card-title fw-semibold">Question {{ index + 1 }}</h5>
              </div>

              <div>
                <BaseButton @click="handleHapusQuestion({ title: question?.pertanyaan, id: question?.id, index: index })"
                  class="btn btn-outline-danger" title="Hapus Question">
                  <template #icon-left>
                    <TablerIcon icon="TrashIcon" />
                  </template>
                </BaseButton>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label" :for="`question-${index}`">Question</label>

              <CKEditor :id="`question-${index}`" v-model="v$.questions.$model[index].pertanyaan" :tabindex="1 + index"
                :isInvalid="!!v$.questions.$each?.$response?.$errors[index]?.pertanyaan?.length"
                :disabled="formState.loadingSubmit || formState.loading" />
              <ErrorMessage
                v-if="Array.isArray(v$.questions.$each?.$response?.$errors) && v$.questions.$each?.$response?.$errors.length"
                :errors="v$.questions.$each?.$response?.$errors[index].pertanyaan" />
            </div>

            <div class="mb-3">
              <label class="form-label" :for="`group-answer-${index}`">Group Answer</label>

              <v-select :id="`group-answer-${index}`" :options="formState.listGroupAnswer.data" label="id"
                placeholder="Cari dan Pilih Group Answer" :clearable="true" :filterable="false" :searchable="false"
                v-model="v$.questions.$model[index].grup_id" :disabled="formState.loadingSubmit"
                :class="[!!v$.questions.$each?.$response?.$errors[index]?.grup_id?.length ? 'invalid-v-select' : '']">
                <template #no-options>
                  Group Answer tidak ditemukan
                </template>

                <template #option="option">
                  <div class="d-flex flex-row">
                    <span class="me-2 fw-bold">
                      {{ option.nama }}
                    </span>

                    <span class="mb-1 badge rounded-pill font-medium text-capitalize fw-bold"
                      :class="classType(option.jenis)">
                      {{ labelType(option.jenis) }}
                    </span>
                  </div>
                </template>

                <template #selected-option="option">
                  <div class="d-flex flex-row">
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

      <div class="mt-2 d-flex justify-content-center align-items-center">
        <BaseButton @click="handleTambahQuestion" title="Tambah Question">
          <template #icon-left>
            <TablerIcon icon="PlusIcon" />
          </template>
        </BaseButton>
      </div>

      <div class="card mt-4">
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
              <BaseButton @click="handleSubmit" title="Simpan Perubahan" :disabled="formState.loadingSubmit"
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