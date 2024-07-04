<script setup>
import { reactive, onMounted, watch, computed, ref, onUnmounted } from 'vue'

import DesignFactorHeader from '@/views/kuesioner/responden/question/components/DesignFactorHeader.vue'
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import BaseAlert from '@/components/Alert/BaseAlert.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'

import QuisionerServices from '@/services/lib/quisioner'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, minValue } from "@vuelidate/validators";
import { ValidateEach } from '@vuelidate/components'
import { formatDateMoments } from '@/utils/momentDateFormat'

import { useToast } from '@/stores/toast'
import { useKuesionerStore } from '@/views/kuesioner/kuesionerStore'
import { useRouter } from 'vue-router'
import { useAlert } from '@/stores/alert'

const alert = useAlert()
const router = useRouter()
const toast = useToast()
const quesioner = useKuesionerStore()


/* ---------------------------------- STATE & COMPUTED --------------------------------- */
const rootTemplate = ref(null)

const questions = reactive({
  loading: false,
  loadingSubmit: false,
  loadingSubmitBack: false,
  loadingLastSubmit: false,
  data: [],
  loadingNavigation: false,
  navigation: [],
  navigation_meta: {
    total: 0,
    terisi: 0,
  },
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

/*
const progressPercentage = computed(() => {
  return value => {
    if (value) {
      const percentage = (value / questions.meta.total) * 100

      return percentage.toFixed(0)
    }

    return 0
  }
})
*/

const progressPercentageAnswered = computed(() => {
  const answered = questions.navigation.reduce((acc, value) => {
    const isAnswered = value.terisi

    if (isAnswered) {
      acc += 1
    }

    return acc
  }, 0)

  const percentage = (answered / questions.meta.total) * 100

  return percentage ? percentage.toFixed(0) : 0
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
        minValue: helpers.withMessage("Nilai Bobot / Persentase minimal 0", minValue(0)),
        mustBe100: helpers.withMessage("Nilai Bobot / Persentase Keseluruhan jika dijumlahkan harus 100", () => {
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

const formatDate = computed(() => {
  return value => {
    return formatDateMoments({ value: value?.value })
  }
})

const isAllQuestionAnswered = computed(() => {
  if (questions.navigation_meta.terisi == questions.navigation_meta.total) {
    return true
  } else {
    return false
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
    // toast.error({ error })
  }
}

const getNavigationQuestion = async ({ assesment_id, responden_id }) => {
  try {
    questions.loadingNavigation = true
    const response = await QuisionerServices.getNavigationQuestion({ assesment_id, responden_id })

    if (response) {
      const data = response?.data

      questions.navigation = data?.pertanyaan || []
      questions.navigation_meta = data?.meta;
      questions.loadingNavigation = false

      return response
    }
  } catch (error) {
    questions.loadingNavigation = false
    toast.error({ error })
    throw error
  }
}

const saveJawaban = async ({ isLastQuestion = false, withScrollToTop = true }) => {
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

      if (withScrollToTop) {
        scrollToTop()
      }

      return response
    }
  } catch (error) {
    questions.loadingSubmit = false
    toast.error({ error })
    throw error
  }
}

const saveJawabanBack = async () => {
  try {
    questions.loadingSubmitBack = true
    const response = await QuisionerServices.saveJawaban({ assesment_user_id: quesioner?.responden?.id, hasil: questions.data })

    if (response) {
      questions.loadingSubmitBack = false

      quesioner.$patch({
        question: {
          currentQuestion: quesioner.question.currentQuestion - 1
        }
      })

      scrollToTop()

      return response
    }
  } catch (error) {
    questions.loadingSubmitBack = false
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

      return response
    }
  } catch (error) {
    questions.loadingSubmit = false
    toast.error({ error })
    throw error
  }
}

const backToFillFormData = async () => {
  try {
    const response = await QuisionerServices.backToFillFormData({ assesment_user_id: quesioner?.responden?.id });

    if (response) {
      quesioner.$patch({
        question: {
          currentQuestion: 1
        }
      })

      return response
    }
  } catch (error) {
    toast.error({ error })
    throw error
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
      title: `Apakah Anda Yakin untuk Menyelesaikan Kuesioner?`
    }).then(async (result) => {
      if (result.isConfirmed) {
        alert.loading()
        try {
          await finishQuisioner()
        } catch (error) {
          alert.instance().close()
        }

      }
    })
  }
}

const handleSaveLastJawaban = async () => {
  const result = await v$.value.$validate()
  if (result) {
    const response = await saveJawaban({ isLastQuestion: true, withScrollToTop: false })

    if (response) {
      try {
        questions.loadingLastSubmit = true
        const navigationResponse = await getNavigationQuestion({ assesment_id: quesioner.responden.assesment?.id, responden_id: quesioner?.responden?.id })

        if (navigationResponse) {
          questions.loadingLastSubmit = false
        }
      } catch (error) {
        questions.loadingLastSubmit = false
      }
    }
  }
}

/*
const handleForceFinish = async () => {
  alert.info({
    title: `Apakah Anda Yakin untuk Menyelesaikan Kuesioner?`
  }).then(async (result) => {
    if (result.isConfirmed) {
      alert.loading()
      try {
        finishQuisioner()
      } catch (error) {
        alert.instance().close()
      }
    }
  })
}
*/

const handleBack = async () => {
  if (quesioner.question.currentQuestion > 0) {
    const result = await v$.value.$validate()
    if (result) {
      saveJawabanBack({ isLastQuestion: false })
    }
  }
}

const handleNavigateToFillFormData = ({ code }) => {
  router.replace({ path: '/kuesioner/responden', query: { code } })
}

const handleBackToFillFormData = () => {
  alert.info({
    title: `Apakah Anda Yakin untuk Kembali ke Pengisian Data`,
    footer: `
        <span class="text-danger">[Perhatian]</span> <br /> <span class="fst-italic">Semua jawaban dipilih akan hilang jika dikonfirmasi</span>
    `,
  }).then(async (result) => {
    if (result.isConfirmed) {
      alert.loading()
      try {
        const response = await backToFillFormData()

        if (response) {
          const data = response?.data;
          handleNavigateToFillFormData({ code: data?.code })
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
      }
    }
  })
}

const handleNavigateFinish = () => {
  router.replace({ path: '/kuesioner/responden/question/finish' })
}

const handleClickNavigation = ({ number }) => {
  quesioner.$patch({
    question: {
      currentQuestion: number
    }
  })
  scrollToTop()
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  Promise.all([
    getListQuestion({ id: quesioner?.responden?.id, question: quesioner.question.currentQuestion }),
    getNavigationQuestion({ assesment_id: quesioner.responden.assesment?.id, responden_id: quesioner?.responden?.id })
  ])
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


  if (quesioner.question.currentQuestion <= questions.meta.total) {
    getNavigationQuestion({ assesment_id: quesioner.responden.assesment?.id, responden_id: quesioner?.responden?.id })
  }
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
      <div class="card bg-primary">
        <div class="card-body text-white">
          <div class="d-flex flex-column flex-md-row align-items-md-center">
            <div class="ms-0">
              <h4 class="mb-1 text-white fs-6">{{ quesioner.responden.assesment?.nama }}</h4>
              <span class="text-white-50">
                {{ formatDate({ value: quesioner.responden.assesment?.start_date }) }}
                s/d
                {{ formatDate({ value: quesioner.responden.assesment?.end_date }) }}
              </span>
            </div>
            <div class="ms-md-auto mt-3 mt-md-0">
              <h2 class="fs-7 mb-0 text-white">
                {{ quesioner.responden?.assesment?.organisasi?.nama }}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div v-for="(question, indexQuestion) in questions.data" :key="`${question?.id}-${indexQuestion}`">
        <DesignFactorHeader :nama="question?.nama" :deskripsi="question?.deskripsi" />

        <div class="card">
          <div class="card-header">
            <div class="d-flex">
              <BaseButton v-tooltip="`Kembali ke Pengisian Data Diri`"
                class="btn btn-navigation-question btn-danger me-3 d-none" @click="handleBackToFillFormData">
                <template #icon-left>
                  <TablerIcon icon="ArrowLeftIcon" />
                </template>
              </BaseButton>

              <template v-if="Array.isArray(questions.navigation) && questions.navigation.length">
                <div class="d-flex flex-row flex-wrap gap-3">
                  <template v-for="(item, index) in questions.navigation" :key="`navigation-${index}`">
                    <BaseButton @click="handleClickNavigation({ number: item?.urutan })"
                      class="btn btn-navigation-question" :class="{
      'btn-success': item?.terisi && item.urutan !== quesioner.question.currentQuestion,
      'btn-primary': item?.urutan === quesioner.question.currentQuestion,
      'btn-outline-dark': !item?.terisi && item?.urutan !== quesioner.question.currentQuestion
    }" :title="item?.urutan" />
                  </template>
                </div>
              </template>
            </div>

          </div>

          <div class="card-body">
            <LoadingOverlay :active="questions.loadingLastSubmit" />

            <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center mb-3">
              <h6 class="mb-1 fs-4 fw-semibold">
                Pertanyaan ke {{ quesioner.question.currentQuestion }}
                dari {{ questions.meta.total }}
              </h6>

              <div class="d-flex flex-row align-items-center">
                <span class="badge bg-light-primary text-primary fw-semibold py-2 fs-3 mt-2 mt-md-0">
                  <!-- Percetange By Answered -->
                  {{ progressPercentageAnswered }}%

                  <!-- Percentage By Number -->
                  <!-- {{ progressPercentage(quesioner.question.currentQuestion - 1) }}% -->
                </span>

                <BaseButton v-if="isAllQuestionAnswered && !isLastQuestion" @click="handleFinish"
                  class="btn btn-sm btn-light-success ms-2 text-primary" title="Selesaikan">
                  <template #icon-right>
                    <TablerIcon icon="CheckboxIcon" />
                  </template>
                </BaseButton>
              </div>
            </div>

            <div class="progress mt-2 mt-md-0">
              <div class="progress-bar progress-bar-striped bg-primary progress-bar-animated" role="progressbar"
                :aria-valuenow="quesioner.question.currentQuestion - 1" aria-valuemin="1"
                :aria-valuemax="questions.meta.total" :style="`width: ${progressPercentageAnswered}%`">
              </div>
            </div>

            <div v-if="v$.$errors.length" class="mt-4">
              <BaseAlert variant="danger">
                <strong>Perhatian.</strong> Terdapat beberapa pertanyaan yang belum sesuai jawabannya ataupun belum anda
                jawab.
              </BaseAlert>
            </div>

            <div v-if="question?.grup?.jenis === 'persentase'" class="mt-4">
              <BaseAlert variant="primary">
                <strong>Info.</strong> Nilai Bobot / Persentase Keseluruhan jika dijumlahkan harus 100.
              </BaseAlert>
            </div>

            <div class="mt-4 d-flex">
              <h5 class="fw-semibold me-2 align-items-start">{{ quesioner.question.currentQuestion }}.</h5>
              <div v-if="question?.pertanyaan" v-html="question?.pertanyaan" />
            </div>


            <div class="table-responsive rounded-2 mb-4 mt-4">
              <div class="mh-100vh">
                <table class="table border text-nowrap mb-0 align-middle">
                  <thead v-if="question?.grup?.jenis === 'pilgan'" class="text-primary position-sticky top-0"
                    style="z-index: 1001 !important;">
                    <tr>
                      <th class="width-200px align-middle"></th>
                      <template v-if="Array.isArray(question?.grup?.jawabans) && question?.grup?.jawabans.length">
                        <th v-for="(jawaban, indexJawaban) in question?.grup?.jawabans" :key="`jawaban-${indexJawaban}`"
                          class="width-100px align-middle">
                          <div class="d-flex flex-wrap justify-content-center ">
                            <span class="width-100px text-break text-wrap text-center">
                              <h6 class="fs-3 fw-semibold mb-0">
                                {{ jawaban?.jawaban }}
                              </h6>
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
                              class="width-200px text-break text-wrap" />
                          </div>
                        </td>
                        <template v-if="Array.isArray(komponen?.jawabans) && komponen?.jawabans.length">
                          <!-- If Jenis Pilihan Ganda -->
                          <template v-if="question?.grup?.jenis === 'pilgan'">
                            <ValidateEach v-for="(jawaban, indexJawaban) in komponen?.jawabans" :key="indexJawaban"
                              :state="jawaban"
                              :rules="rulesPilihanGanda({ indexJawaban, indexKomponen, indexQuestion })"
                              :index="indexKomponen">
                              <template #default="{ v }">
                                <td :class="{
      'bg-light-danger': v?.hasil?.$errors?.length
    }">
                                  <div
                                    class="form-check form-check-inline d-flex justify-content-center align-items-center">
                                    <input type="radio" class="form-check-input primary check-outline outline-primary"
                                      style="transform: scale(1.15);"
                                      :class="[v?.hasil?.$errors?.length ? 'is-invalid' : '']"
                                      :checked="!!jawaban.hasil" :id="`radio-${indexJawaban}-${indexKomponen}`"
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
                                <td class="width-250px">
                                  <div class="d-flex flex-column justify-content-center">
                                    <BaseInput :id="`input-${indexJawaban}-${indexKomponen}`" class="form-control"
                                      type="number" :min="0" :max="100" :name="`input-${indexKomponen}`"
                                      placeholder="Silakan isi persentase" v-model="v.hasil.$model"
                                      :is-invalid="!!v.hasil?.$errors?.length">
                                      <template #extra-input-group>
                                        <div class="input-group-text">
                                          <TablerIcon icon="PercentageIcon" />
                                        </div>
                                      </template>
                                    </BaseInput>

                                    <ErrorMessage :onlyShowOne="true" :errors="v.hasil.$errors" />
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
            class="btn btn-outline-primary" :disabled="questions.loadingSubmitBack || questions.loadingSubmit"
            :is-loading="questions.loadingSubmitBack">
            <template #icon-left>
              <TablerIcon icon="ChevronLeftIcon" />
            </template>
          </BaseButton>
        </div>

        <div>
          <BaseButton v-if="isLastQuestion && isAllQuestionAnswered" @click="handleFinish"
            class="btn btn-success mt-2 mt-md-0" title="Selesaikan Kuesioner"
            :disabled="questions.loadingSubmit || questions.loadingSubmitBack" :is-loading="questions.loadingSubmit">
            <template #icon-right>
              <TablerIcon icon="CheckboxIcon" />
            </template>
          </BaseButton>

          <BaseButton v-else-if="isLastQuestion" @click="handleSaveLastJawaban" class="btn btn-primary mt-2 mt-md-0"
            title="Simpan Jawaban Terakhir"
            :disabled="questions.loadingSubmit || questions.loadingSubmitBack || questions.loadingLastSubmit"
            :is-loading="questions.loadingSubmit">
            <template #icon-right>
              <TablerIcon icon="DeviceFloppyIcon" />
            </template>
          </BaseButton>

          <BaseButton v-else-if="!isLastQuestion" @click="handleNext" class="btn btn-primary mt-2 mt-md-0"
            title="Simpan dan Selanjutnya" :disabled="questions.loadingSubmit || questions.loadingSubmitBack"
            :is-loading="questions.loadingSubmit">
            <template #icon-right>
              <TablerIcon icon="ChevronRightIcon" />
            </template>
          </BaseButton>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="d-flex flex-column align-items-center justify-content-center vh-100">
        <NoData source="/assets/images/illustrations/man-confusing-with-phone.svg"
          title="Terjadi Kesalahan. Reload Halaman Untuk Menyegarkan Halaman" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.btn-navigation-question {
  width: 40px !important;
  height: 40px !important;
  font-size: 12px !important;
  padding: 5px !important;
}
</style>