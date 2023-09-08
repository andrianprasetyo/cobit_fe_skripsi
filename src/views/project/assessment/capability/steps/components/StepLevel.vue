<script setup>
import { reactive, computed, watch } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'
import ModalPenilaian from '@/views/project/assessment/capability/steps/components/ModalPenilaian.vue'

import CapabilityServices from '@/services/lib/capability'

import { useToast } from '@/stores/toast'
import { useLoading } from 'vue-loading-overlay'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const toast = useToast()
const loading = useLoading()
const assessmentStore = useAssessmentStore()

/* ---------------------------------- STATE --------------------------------- */
const capability = reactive({
  loading: false,
  loadingSubmit: false,
  isShowModalPenilaian: false,
})

const valueAnwer = computed(() => {
  return value => {
    if (!value) return null

    const answered = assessmentStore.capability.detailListAnswer.find(item => item?.id === value)

    return answered
  }
})

const totalValue = computed(() => {
  return assessmentStore.capability.detailListLevel.reduce((acc, value) => {
    if (value?.capabilityass?.capability_level_id) {
      const values = valueAnwer.value(value?.capabilityass?.capability_level_id)?.bobot
      // console.log('values', valueAnwer.value(value?.capabilityass?.capability_level_id))?.bobot
      acc += values || 0
    }

    return acc
  }, 0)
})

const totalWeight = computed(() => {
  return assessmentStore.capability.detailListLevel.reduce((acc, value) => {
    if (value?.bobot) {
      acc += value?.bobot || 0
    }

    return acc
  }, 0)
})

const totalCompliances = computed(() => {
  return totalValue.value / totalWeight.value
})

/* --------------------------------- METHODS -------------------------------- */
const getCapabilityDetailLevelAssessment = async () => {
  try {
    capability.loading = true

    const response = await assessmentStore.getCapabilityDetailLevelAssessment({
      level: assessmentStore.capability.selectedLevel,
      domain_id: assessmentStore.capability.selectedGamo?.id
    })

    if (response) {
      capability.loading = false
    }
  } catch (error) {
    capability.loading = false
  }
}

const handleToggleModalPenilaian = ({ gamo }) => {
  capability.isShowModalPenilaian = !capability.isShowModalPenilaian

  if (capability.isShowModalPenilaian) {
    assessmentStore.setCapabilitySelectedSubGamo(gamo)
  }
}

const onSubmit = async () => {
  const loader = loading.show()

  try {
    capability.loadingSubmit = true
    const response = await CapabilityServices.answerLevelCapability({ jawaban: assessmentStore.capability.detailListLevel })

    if (response) {
      toast.success({
        title: `Simpan Data Capability Level ${assessmentStore.capability.selectedLevel}`,
        text: `Berhasil Menyimpan Data Capability Level ${assessmentStore.capability.selectedLevel}`
      })

      capability.loadingSubmit = false
      loader.hide()

      getCapabilityDetailLevelAssessment()
    }

  } catch (error) {
    capability.loadingSubmit = false
    loader.hide()
    toast.error({ error })
  }
}

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => [assessmentStore.capability.selectedLevel], () => {
  getCapabilityDetailLevelAssessment()
}, { immediate: true, deep: true })

</script>

<template>
  <section :id="`steps-uid-${assessmentStore.capability.selectedLevel}-p-0`" role="tabpanel"
    :aria-labelledby="`steps-uid-${assessmentStore.capability.selectedLevel}-h-0`" class="body current"
    aria-hidden="false">

    <LoadingOverlay :active="capability.loading" />

    <div class="d-flex flex-row justify-content-between align-items-center">
      <h5 class="card-title mb-3 mb-md-0 fw-semibold">Level {{ assessmentStore.capability.selectedLevel }}</h5>

      <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
        <BaseButton @click="onSubmit" class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3" title="Simpan Data"
          :disabled="capability.loadingSubmit || capability.loading" :is-loading="capability.loadingSubmit">
          <template #icon-left>
            <TablerIcon icon="DeviceFloppyIcon" />
          </template>
        </BaseButton>
      </div>
    </div>

    <div class="table-responsive rounded-2 mb-4 mt-4">
      <div class="mh-100vh">
        <table class="table border customize-table text-nowrap mb-0 align-middle">
          <thead class="position-sticky top-0 bg-white text-dark" style="z-index: 5 !important;">
            <tr>
              <th class="align-middle" rowspan="2">
                <h6 class="fs-3 fw-semibold mb-0">Urutan</h6>
              </th>
              <th class="width-150px align-middle" rowspan="2">
                <div class="width-100px text-break text-wrap">
                  <h6 class="fs-3 fw-semibold mb-0">Management Practice Code</h6>
                </div>
              </th>
              <th class="align-middle" rowspan="2">
                <h6 class="fs-3 fw-semibold mb-0">Activities</h6>
              </th>
              <th class="align-middle" rowspan="2">
                <h6 class="fs-3 fw-semibold mb-0">Translate</h6>
              </th>
              <th class="align-middle text-center" rowspan="2">
                <h6 class="fs-3 fw-semibold mb-0">Evident</h6>
              </th>
              <template
                v-if="Array.isArray(assessmentStore.capability.detailListAnswer) && assessmentStore.capability.detailListAnswer.length">
                <th class="align-middle text-center bg-light-primary" rowspan="2">
                  <h6 class="fs-3 fw-semibold mb-0">Asesmen</h6>
                </th>
              </template>
              <th class="align-middle text-center bg-light" rowspan="2">
                <h6 class="fs-3 fw-semibold mb-0">Weight</h6>
              </th>
              <th class="align-middle text-center" rowspan="2">
                <h6 class="fs-3 fw-semibold mb-0">Action</h6>
              </th>
            </tr>
          </thead>

          <tbody>
            <template
              v-if="Array.isArray(assessmentStore.capability.detailListLevel) && assessmentStore.capability.detailListLevel.length">
              <tr v-for="(item, index) in assessmentStore.capability.detailListLevel"
                :key="`capability-level-2-item-${index}`">
                <td>
                  <div class="text-break text-center text-wrap fw-bold">
                    {{ item?.urutan }}
                  </div>
                </td>
                <td>
                  <div v-if="item?.subkode" class="width-100px text-break text-wrap fw-bold" v-html="item?.subkode" />
                </td>
                <td class="width-175px">
                  <div class="d-flex flex-wrap justify-content-center ">
                    <div v-if="item?.kegiatan" class="width-150px text-break text-wrap" v-html="item?.kegiatan" />
                  </div>
                </td>
                <td class="width-175px">
                  <div class="d-flex flex-wrap justify-content-center ">
                    <div v-if="item?.translate" class="width-150px text-break text-wrap" v-html="item?.translate" />
                  </div>
                </td>
                <td class="text-center width-100px">
                  <div class="d-flex flex-wrap justify-content-center">
                    <div class="d-flex flex-column width-75px">
                      <template v-if="item?.evident">
                        <TablerIcon icon="CircleCheckIcon" class="text-success" size="20" />
                      </template>

                      <span v-else class="fst-italic text-muted text-capitalize fw-bold text-break text-wrap lh-base">
                        <TablerIcon icon="CircleXIcon" class="text-danger" size="22" />
                      </span>
                    </div>
                  </div>


                </td>
                <td class="text-center bg-light-primary width-100px">
                  <div class="d-flex flex-wrap justify-content-center">
                    <div class="d-flex flex-column width-75px">
                      <template v-if="item?.capabilityass?.capability_answer_id">
                        <h6 class="fs-3 fw-semibold text-break text-wrap">
                          {{ valueAnwer(item?.capabilityass?.capability_answer_id)?.nama }}
                          ({{ valueAnwer(item?.capabilityass?.capability_answer_id)?.label }})
                        </h6>
                        <h6 class="fs-3 mb-0">
                          {{ valueAnwer(item?.capabilityass?.capability_answer_id)?.bobot }}
                        </h6>
                      </template>

                      <template v-else>
                        <span class="fst-italic text-muted text-capitalize fw-bold text-break text-wrap lh-base">
                          Belum Dinilai
                        </span>
                      </template>
                    </div>
                  </div>
                </td>
                <td class="text-center bg-light">
                  {{ item?.bobot }}
                </td>
                <td>
                  <TablerIcon icon="DotsIcon" size="20" class="text-muted cursor-pointer" data-bs-toggle="dropdown"
                    id="dropdownMenuButton" aria-expanded="false" />

                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <BaseButton @click="handleToggleModalPenilaian({ gamo: item })"
                      class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                      <template #icon-left>
                        <TablerIcon icon="EditIcon" />
                        <span class="ms-2">
                          Atur Penilaian Kapabilitas
                        </span>
                      </template>
                    </BaseButton>

                    <BaseButton class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                      <template #icon-left>
                        <TablerIcon icon="FileTextIcon" />
                        <span class="ms-2">
                          Evident
                        </span>
                      </template>
                    </BaseButton>
                  </ul>
                </td>
              </tr>
            </template>
          </tbody>

          <template
            v-if="Array.isArray(assessmentStore.capability.detailListAnswer) && assessmentStore.capability.detailListAnswer.length">
            <tfoot class="position-sticky bottom-0">
              <tr>
                <td colspan="4"></td>
                <td colspan="1">
                  <h6 class="fs-3 fw-semibold mb-0 text-center">
                    Values
                  </h6>
                </td>
                <td class="text-center bg-light-primary">
                  <h6 class="fs-3 fw-semibold mb-0">
                    {{ totalValue }}
                  </h6>
                </td>
                <td class="text-center bg-light">
                  <h6 class="fs-3 fw-semibold mb-0">
                    {{ totalWeight }}
                  </h6>
                </td>
                <td colspan="1"></td>
              </tr>
              <tr>
                <td colspan="4"></td>
                <td colspan="1">
                  <h6 class="fs-3 fw-semibold mb-0 text-center">
                    Compliances
                  </h6>
                </td>
                <td colspan="2" class="bg-primary">
                  <h6 class="fs-3 fw-semibold mb-0 text-center text-white">
                    {{ totalCompliances }}
                  </h6>
                </td>
                <td colspan="1"></td>
              </tr>
            </tfoot>
          </template>
        </table>
      </div>
    </div>

    <ModalPenilaian :is-show="capability.isShowModalPenilaian" @close="handleToggleModalPenilaian" />
  </section>
</template>

<style scoped>
.content-table {
  -ms-overflow-style: none;
  /* Internet Explorer 10+ */
  scrollbar-width: none;
  /* Firefox */
}

.content-table::-webkit-scrollbar {
  display: none;
  /* Safari and Chrome */
}
</style>