<script setup>
import { reactive, onMounted, watch, computed, ref, onUnmounted } from 'vue'

import DesignFactorHeader from '@/views/quisioner/responden/question/components/DesignFactorHeader.vue'
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import BaseAlert from '@/components/Alert/BaseAlert.vue'

import QuisionerServices from '@/services/lib/quisioner'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, minValue } from "@vuelidate/validators";
import { ValidateEach } from '@vuelidate/components'

import { useToast } from '@/stores/toast'
import { useQuisionerStore } from '@/views/quisioner/quisionerStore'
import { useRouter } from 'vue-router'
import { useAlert } from '@/stores/alert'

const alert = useAlert()
const router = useRouter()
const toast = useToast()
const quesioner = useQuisionerStore()


/* ---------------------------------- STATE & COMPUTED --------------------------------- */
const rootTemplate = ref(null)

const questions = reactive({
  loading: false,
  loadingSubmit: false,
  data: [],
  meta: {
    total: 0,
  },
})

const isLastQuestion = computed(() => {
  if (quesioner.question.currentQuestion === questions.meta.total) {
    return true
  } else {
    return false
  }
})

const progressPercentage = computed(() => {
  return value => {
    if (value) {
      const percentage = (value / questions.meta.total) * 100

      return percentage.toFixed(0)
    }

    return 0
  }
})

const rulesPilihanGanda = computed(() => {
  return ({ indexQuestion, indexKomponen }) => {
    return {
      hasil: {
        required: helpers.withMessage('Silahkan pilih salah satu jawaban', () => {
          const indexChecked = questions.data[indexQuestion]?.komponen[indexKomponen].jawabans.findIndex(item => item?.hasil)
          return indexChecked !== -1 ? true : false
        })
      }
    }
  }
})

const rulesPersentase = computed(() => {
  return ({ indexQuestion }) => {
    return {
      hasil: {
        required: helpers.withMessage('Silahkan isi persentase', required),
        minValue: helpers.withMessage("Nilai Bobot minimal 1", minValue(1)),
        mustBe100: helpers.withMessage("Nilai Bobot Keseluruhan jika dijumlahkan harus 100", () => {
          let sum = 0
          questions.data[indexQuestion]?.komponen?.map((komponen) => {
            komponen.jawabans.reduce((acc, value) => {
              acc += value.hasil
              sum += acc
            }, 0)
          })
          return sum === 100
        })
      },
    }
  }
})

const v$ = useVuelidate()

/* --------------------------------- METHODS -------------------------------- */
const getListQuestion = async ({ id, question }) => {
  try {
    questions.loading = true
    const response = await QuisionerServices.getListQuestion({ id, question })

    if (response) {
      const data = response?.data

      questions.data = data?.list || []
      questions.meta = data?.meta

      quesioner.$patch({
        question: {
          currentQuestion: data?.meta?.current_page || 1
        }
      })
      questions.loading = false
    }
  } catch (error) {
    questions.loading = false
    toast.error({ error })
  }
}

const saveJawaban = async ({ isLastQuestion = false }) => {
  try {
    questions.loadingSubmit = true
    const response = await QuisionerServices.saveJawaban({ assesment_user_id: quesioner?.responden?.id, hasil: questions.data })

    if (response) {
      questions.loadingSubmit = false

      if (!isLastQuestion) {
        quesioner.$patch({
          question: {
            currentQuestion: quesioner.question.currentQuestion + 1
          }
        })
      }

      scrollToTop()

      return response
    }
  } catch (error) {
    questions.loadingSubmit = false
    toast.error({ error })
    throw error
  }
}

const finishQuisioner = async () => {
  try {
    questions.loadingSubmit = true
    const response = await QuisionerServices.finishQuisioner({ assesment_user_id: quesioner?.responden?.id })

    if (response) {
      questions.loadingSubmit = false
      handleNavigateFinish()
      alert.instance().close()
      quesioner.$patch({
        question: {
          currentQuestion: 1
        }
      })
    }
  } catch (error) {
    questions.loadingSubmit = false
    toast.error({ error })
  }
}

const scrollToTop = () => {
  const scrollbar = rootTemplate.value;

  const scrollToOptions = {
    top: 0,
    behavior: 'smooth',
    block: 'start'
  };

  scrollbar.scrollIntoView(scrollToOptions)
}

const handleChangeHasil = ({ indexQuestion, indexKomponen, bobot }) => {
  const data = questions.data

  data[indexQuestion].komponen[indexKomponen].jawabans.forEach((jawaban) => {
    if (jawaban.bobot !== bobot) {
      jawaban.hasil = null;
    } else {
      jawaban.hasil = bobot
    }
  });

  questions.data = data
}

const handleNext = async () => {
  const result = await v$.value.$validate()
  if (result) {
    saveJawaban({ isLastQuestion: false })
  }
}

const handleFinish = async () => {
  const result = await v$.value.$validate()

  if (result) {
    alert.info({
      title: `Apakah Anda Yakin untuk Menyelesaikan Quisioner?`
    }).then(async (result) => {
      if (result.isConfirmed) {
        alert.loading()
        try {
          const response = await saveJawaban({ isLastQuestion: true })

          if (response) {
            finishQuisioner()
          }
        } catch (error) {
          alert.instance().close()
        }

      }
    })
  }
}

const handleBack = async () => {
  if (quesioner.question.currentQuestion > 0) {
    quesioner.$patch({
      question: {
        currentQuestion: quesioner.question.currentQuestion - 1
      }
    })
  }

  scrollToTop()
}

const handleNavigateFinish = () => {
  router.replace({ path: '/quisioner/responden/question/finish' })
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getListQuestion({ id: quesioner?.responden?.id, question: quesioner.question.currentQuestion })
})

onUnmounted(() => {
  quesioner.$patch({
    question: {
      currentQuestion: 1
    }
  })
})

watch(() => [quesioner.question.currentQuestion], () => {
  getListQuestion({
    id: quesioner?.responden?.id, question: quesioner.question.currentQuestion
  })
}, { deep: true })

</script>

<template>
  <div ref="rootTemplate">
    <template v-if="questions.loading">
      <div class="vh-100 d-flex align-items-center justify-content-center">
        <LoadingSpinner />
      </div>
    </template>

    <template v-else-if="!questions.loading && Array.isArray(questions.data) && questions.data.length">
      <div v-for="(question, indexQuestion) in questions.data" :key="`${question?.id}-${indexQuestion}`">
        <DesignFactorHeader :nama="question?.nama" :deskripsi="question?.deskripsi" />

        <div class="card">
          <div class="card-body">
            <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center mb-3">
              <h6 class="mb-1 fs-4 fw-semibold">Pertanyaan ke {{ question?.sorting }} dari {{ questions.meta.total }}</h6>

              <div>
                <span class="badge bg-light-primary text-primary fw-semibold fs-3 mt-2 mt-md-0">
                  {{ progressPercentage(quesioner.question.currentQuestion - 1) }}%
                </span>
              </div>
            </div>

            <div class="progress mt-2 mt-md-0">
              <div class="progress-bar progress-bar-striped bg-primary progress-bar-animated" role="progressbar"
                :aria-valuenow="quesioner.question.currentQuestion - 1" aria-valuemin="1"
                :aria-valuemax="questions.meta.total"
                :style="`width: ${progressPercentage(quesioner.question.currentQuestion - 1)}%`">
              </div>
            </div>

            <div v-if="v$.$errors.length" class="mt-4">
              <BaseAlert variant="danger">
                <strong>Perhatian.</strong> Terdapat beberapa pertanyaan yang belum sesuai jawabannya ataupun belum anda
                jawab.
              </BaseAlert>
            </div>

            <div class="mt-4 d-flex">
              <h5 class="fw-semibold me-2 align-items-start">{{ question?.sorting }}.</h5>
              <div v-if="question?.pertanyaan" v-html="question?.pertanyaan" />
            </div>

            <div class="table-responsive rounded-2 mb-4 mt-4">
              <div class="mh-100vh">
                <table class="table border text-nowrap mb-0 align-middle">
                  <thead v-if="question?.grup?.jenis === 'pilgan'" class="text-primary position-sticky top-0">
                    <tr>
                      <th class="width-250px align-middle"></th>
                      <template v-if="Array.isArray(question?.grup?.jawabans) && question?.grup?.jawabans.length">
                        <th v-for="(jawaban, indexJawaban) in question?.grup?.jawabans" :key="`jawaban-${indexJawaban}`"
                          class="width-125px align-middle">
                          <div class="d-flex flex-wrap">
                            <span class="width-100px text-break text-wrap text-center">
                              {{ jawaban?.jawaban }}
                            </span>
                          </div>
                        </th>
                      </template>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="Array.isArray(question?.komponen) && question?.komponen?.length">
                      <tr v-for="(komponen, indexKomponen) in question?.komponen"
                        :key="`komponen-answer-${indexKomponen}`">
                        <td>
                          <div class="d-flex flex-wrap">
                            <div v-if="komponen?.deskripsi" v-html="komponen?.deskripsi"
                              class="width-250px text-break text-wrap" />
                          </div>
                        </td>
                        <template v-if="Array.isArray(komponen?.jawabans) && komponen?.jawabans.length">
                          <!-- If Jenis Pilihan Ganda -->
                          <template v-if="question?.grup?.jenis === 'pilgan'">
                            <ValidateEach v-for="(jawaban, indexJawaban) in komponen?.jawabans" :key="indexJawaban"
                              :state="jawaban" :rules="rulesPilihanGanda({ indexJawaban, indexKomponen, indexQuestion })"
                              :index="indexKomponen">
                              <template #default="{ v }">
                                <td>
                                  <div
                                    class="form-check form-check-inline d-flex justify-content-center align-items-center">
                                    <input type="radio" class="form-check-input primary check-outline outline-primary"
                                      :class="[v?.hasil?.$errors?.length ? 'is-invalid' : '']" :checked="!!jawaban.hasil"
                                      :id="`radio-${indexJawaban}-${indexKomponen}`"
                                      @change="handleChangeHasil({ bobot: jawaban?.bobot, indexJawaban, indexKomponen, indexQuestion })"
                                      :name="`radio-komponen-${indexKomponen}`" />
                                  </div>
                                </td>
                              </template>
                            </ValidateEach>
                          </template>

                          <!-- Else If Jenis Persentasi -->
                          <template v-else-if="question?.grup?.jenis === 'persentase'">
                            <ValidateEach v-for="(jawaban, indexJawaban) in komponen?.jawabans" :key="indexJawaban"
                              :state="jawaban" :rules="rulesPersentase({ indexJawaban, indexKomponen, indexQuestion })"
                              :index="indexKomponen">
                              <template #default="{ v }">
                                <td>
                                  <div class="d-flex flex-column justify-content-center ">
                                    <BaseInput :id="`input-${indexJawaban}-${indexKomponen}`" class="form-control w-25"
                                      type="number" :min="1" :max="100" :name="`input-${indexKomponen}`"
                                      placeholder="Silakan isi persentase" v-model="v.hasil.$model"
                                      :is-invalid="!!v.hasil?.$errors?.length">
                                      <template #extra-input-group>
                                        <div class="input-group-text">
                                          <TablerIcon icon="PercentageIcon" />
                                        </div>
                                      </template>
                                    </BaseInput>

                                    <ErrorMessage :errors="v.hasil.$errors" />
                                  </div>
                                </td>
                              </template>
                            </ValidateEach>
                          </template>
                        </template>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-between">
        <div>
          <BaseButton v-if="quesioner.question.currentQuestion > 1" @click="handleBack" title="Sebelumnya"
            class="btn btn-outline-primary">
            <template #icon-left>
              <TablerIcon icon="ChevronLeftIcon" />
            </template>
          </BaseButton>
        </div>

        <div>
          <BaseButton v-if="isLastQuestion" @click="handleFinish" class="btn btn-success mt-2 mt-md-0"
            title="Simpan dan Selesaikan" :disabled="questions.loadingSubmit" :is-loading="questions.loadingSubmit">
            <template #icon-right>
              <TablerIcon icon="CheckboxIcon" />
            </template>
          </BaseButton>

          <BaseButton v-else @click="handleNext" class="btn btn-primary mt-2 mt-md-0" title="Selanjutnya"
            :disabled="questions.loadingSubmit" :is-loading="questions.loadingSubmit">
            <template #icon-right>
              <TablerIcon icon="ChevronRightIcon" />
            </template>
          </BaseButton>
        </div>
      </div>
    </template>
  </div>
</template>