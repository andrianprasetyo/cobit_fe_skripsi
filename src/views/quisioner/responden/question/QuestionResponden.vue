<script setup>
import { reactive, onMounted, watch, computed } from 'vue'

import DesignFactorHeader from '@/views/quisioner/responden/question/components/DesignFactorHeader.vue'
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import QuisionerServices from '@/services/lib/quisioner'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { RouterLink } from 'vue-router'
import { useToast } from '@/stores/toast'
import { useAppConfig } from '@/stores/appConfig'
import { useQuisionerStore } from '@/views/quisioner/quisionerStore'

const toast = useToast()
const quesioner = useQuisionerStore()
const { app } = useAppConfig()

const questions = reactive({
  loading: false,
  loadingSubmit: false,
  data: [],
  meta: {
    total: 0,
  }
})

const navigation = reactive({
  currentQuestion: 3
})

const rules = computed(() => {
  return {
    data: {
      $each: {
        komponen: {
          $each: {
            grup: {
              $each: {
                jawabans: {
                  hasil: {
                    required: helpers.withMessage('Silahkan pilih salah satu jawaban', required),
                  }
                }
              }
            }
          }
        }
      }
    }
  }
})

const v$ = useVuelidate(rules, questions, { $rewardEarly: true })

/* --------------------------------- METHODS -------------------------------- */
const getListQuestion = async ({ id, question }) => {
  try {
    questions.loading = true
    const response = await QuisionerServices.getListQuestion({ id, question })

    if (response) {
      const data = response?.data

      questions.data = data?.list || []
      questions.meta = data?.meta

      navigation.currentQuestion = data?.meta?.current_page
      questions.loading = false
    }
  } catch (error) {
    questions.loading = false
    toast.error({ error })
  }
}

const saveJawaban = async () => {
  try {
    questions.loadingSubmit = true
    const response = await QuisionerServices.saveJawaban({ assesment_user_id: quesioner?.responden?.id, hasil: questions.data })

    if (response) {
      questions.loadingSubmit = false
      navigation.currentQuestion = navigation.currentQuestion + 1
    }
  } catch (error) {
    questions.loadingSubmit = false
    toast.error({ error })
  }
}

const handleNext = async () => {
  const result = await v$.value.$validate()

  if (result) {
    saveJawaban()
  }
}

const handleBack = async () => {
  if (navigation.currentQuestion > 0) {
    navigation.currentQuestion = navigation.currentQuestion - 1
  }

}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getListQuestion({ id: quesioner?.responden?.id, question: navigation.currentQuestion })
})

watch(() => [navigation], () => {
  getListQuestion({
    id: quesioner?.responden?.id, question: navigation.currentQuestion
  })
}, { deep: true })

</script>

<template>
  <div>
    <RouterLink to="/" class="text-nowrap logo-img text-center d-block mb-4 w-100">
      <div class="d-flex flex-column justify-content-center align-items-center">
        <img :src="app.appLogoImage" width="180" alt="logo" />
      </div>
    </RouterLink>

    <template v-if="questions.loading">
      <LoadingSpinner />
    </template>

    <template v-else-if="!questions.loading && Array.isArray(questions.data) && questions.data.length">
      <!-- <pre>
        {{ v$ }}
      </pre> -->

      <div v-for="(question, indexQuestion) in questions.data" :key="`${question?.id}-${indexQuestion}`">
        <DesignFactorHeader :nama="question?.nama" :deskripsi="question?.deskripsi" />

        <div class="card">
          <div class="card-body">
            <div class="mt-4 d-flex">
              <h5 class="fw-semibold me-2 align-items-start">{{ question?.sorting }}.</h5>

              <div v-if="question?.pertanyaan" v-html="question?.pertanyaan" />
            </div>

            <div class="table-responsive rounded-2 mb-4 mt-4">
              <table class="table border text-nowrap mb-0 align-middle">
                <thead class="text-primary">
                  <tr>
                    <th>Komponen</th>
                    <template v-if="Array.isArray(question?.komponen) && question?.komponen.length">
                      <template
                        v-if="Array.isArray(question?.komponen[0]?.grup?.jawabans) && question?.komponen[0]?.grup?.jawabans?.length">
                        <th v-for="(jawaban, indexJawaban) in question.komponen[0].grup.jawabans"
                          :key="`jawaban-${indexJawaban}`">
                          <div class="text-center">
                            {{ jawaban?.jawaban }}
                          </div>
                        </th>
                      </template>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="Array.isArray(question?.komponen) && question?.komponen?.length">
                    <tr v-for="(komponen, indexKomponen) in question?.komponen" :key="`komponen-answer-${indexKomponen}`">
                      <td class="">
                        <div v-if="komponen?.deskripsi" v-html="komponen?.deskripsi" />
                      </td>
                      <template v-if="Array.isArray(komponen.grup.jawabans) && komponen.grup.jawabans.length">
                        <td v-for="(_, indexJawaban) in komponen.grup.jawabans" :key="`answer-${indexJawaban}`">
                          <!-- If Jenis Pilgan -->
                          <div v-if="komponen?.grup.jenis === 'pilgan'"
                            class="form-check form-check-inline d-flex justify-content-center align-items-center">
                            <input
                              v-model="questions.data[indexQuestion].komponen[indexKomponen].grup.jawabans[indexJawaban].hasil"
                              :value="questions.data[indexQuestion].komponen[indexKomponen].grup.jawabans[indexJawaban].bobot"
                              class="form-check-input primary check-outline outline-primary" type="radio"
                              :checked="!!questions.data[indexQuestion].komponen[indexKomponen].grup.jawabans[indexJawaban].hasil"
                              :id="`radio-${indexJawaban}-${indexKomponen}`" :name="`radio-${indexKomponen}`">
                          </div>

                          <!-- If Jenis Persentasi -->
                          <div v-else-if="komponen?.grup.jenis === 'persentase'" class="d-flex justify-content-center">
                            <input
                              v-model="questions.data[indexQuestion].komponen[indexKomponen].grup.jawabans[indexJawaban].hasil"
                              class="form-control w-50" type="number" :id="`input-${index}-${indexKomponen}`"
                              :name="`input-${indexKomponen}`" />
                          </div>

                          <!-- <ErrorMessage !errors="" /> -->
                        </td>
                      </template>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      <div class="d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-between">
        <div>
          <BaseButton v-if="navigation && navigation.currentQuestion > 1" @click="handleBack" title="Sebelumnya"
            class="btn btn-outline-primary">
            <template #icon-left>
              <TablerIcon icon="ChevronLeftIcon" />
            </template>
          </BaseButton>
        </div>

        <div>
          <BaseButton @click="handleNext" title="Selanjutnya" :disabled="questions.loadingSubmit"
            :is-loading="questions.loadingSubmit">
            <template #icon-right>
              <TablerIcon icon="ChevronRightIcon" />
            </template>
          </BaseButton>
        </div>
      </div>
    </template>

  </div>
</template>

<style></style>