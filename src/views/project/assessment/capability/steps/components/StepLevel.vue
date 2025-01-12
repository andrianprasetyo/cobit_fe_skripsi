<script setup>
import { reactive, computed, watch, onBeforeMount, onBeforeUnmount, onUnmounted } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'
import BaseAlert from '@/components/Alert/BaseAlert.vue'
import ModalPenilaian from '@/views/project/assessment/capability/steps/components/ModalPenilaian.vue'
import ModalEvidence from '@/views/project/assessment/capability/steps/components/ModalEvidence.vue'
import ModalAverageCompliance from '@/views/project/assessment/capability/steps/components/ModalAverageCompliance.vue'
import ModalViewDetailEvidence from '@/views/project/assessment/capability/steps/components/ModalViewDetailEvidence.vue'
import ModalOFI from "@/views/project/assessment/capability/steps/components/ModalOFI.vue"
import ModalHistory from '@/views/project/assessment/capability/steps/components/ModalHistory.vue'
import ModalPenilaianNoteList from '@/views/project/assessment/capability/steps/components/ModalPenilaianNoteList.vue'
import ModalEvidenceList from '@/views/project/assessment/capability/steps/components/ModalEvidenceList.vue'

import CapabilityServices from '@/services/lib/capability'

import { useRoute } from 'vue-router'
import { useToast } from '@/stores/toast'
import { useLoading } from 'vue-loading-overlay'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const route = useRoute()
const toast = useToast()
const loading = useLoading()
const assessmentStore = useAssessmentStore()

/* ---------------------------------- STATE --------------------------------- */
const capability = reactive({
  loading: false,
  loadingSubmit: false,
  isShowModalPenilaian: false,
  isShowModalEvidence: false,
  isShowModalViewDetailEvidence: false,
  isShowModalAverageCompliance: false,
  isShowModalOFI: false,
  isShowModalHistory: false,
  isShowModalPenilaianNoteList: false,
  isShowModalEvidenceList: false,
})

const valueAnwer = computed(() => {
  return value => {
    if (!value) return null

    const answered = assessmentStore.capability.detailListAnswer.find(item => item?.id === value)

    return answered
  }
})

/*
const totalValue = computed(() => {
  return assessmentStore.capability.detailListLevel.reduce((acc, value) => {
    if (value?.capabilityass?.capability_level_id) {
      const values = valueAnwer.value(value?.capabilityass?.capability_answer_id)?.bobot
      acc += parseInt(values) || 0
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
  return (totalValue.value / totalWeight.value).toFixed(2)
})
*/

const totalValue = computed(() => {
  return assessmentStore.capability.detailListLevel.reduce((acc, value) => {
    if (value?.capabilityass?.capability_level_id) {
      const values = valueAnwer.value(value?.capabilityass?.capability_answer_id)?.bobot
      acc += Math.fround(values) || 0
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
  return (totalValue.value / totalWeight.value)
})

const assessmentId = computed(() => {
  return route.params?.id
})

/* --------------------------------- METHODS -------------------------------- */
const getCapabilityDetailLevelAssessment = async () => {
  try {
    capability.loading = true

    const response = await assessmentStore.getCapabilityDetailLevelAssessment({
      level: assessmentStore.capability.selectedLevel,
      domain_id: assessmentStore.capability.selectedGamo?.id,
      assesment_id: assessmentId.value
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

const handleToggleModalEvidence = ({ gamo }) => {
  capability.isShowModalEvidence = !capability.isShowModalEvidence

  if (capability.isShowModalEvidence) {
    assessmentStore.setCapabilitySelectedSubGamo(gamo)
  }
}

const handleToggleModalOFI = ({ gamo }) => {
  capability.isShowModalOFI = !capability.isShowModalOFI

  if (capability.isShowModalOFI) {
    assessmentStore.setCapabilitySelectedSubGamo(gamo)
  }
}

const handleToggleModalHistory = ({ gamo }) => {
  capability.isShowModalHistory = !capability.isShowModalHistory

  if (capability.isShowModalHistory) {
    assessmentStore.setCapabilitySelectedSubGamo(gamo)
  }
}

const handleToggleModalViewDetailEvidence = ({ gamo }) => {
  capability.isShowModalViewDetailEvidence = !capability.isShowModalViewDetailEvidence

  if (capability.isShowModalViewDetailEvidence) {
    assessmentStore.setCapabilitySelectedSubGamo(gamo)
  }
}

const handleToggleModalAverageCompliance = () => {
  capability.isShowModalAverageCompliance = !capability.isShowModalAverageCompliance
}

const handleToggleModalPenilaianNoteList = () => {
  capability.isShowModalPenilaianNoteList = !capability.isShowModalPenilaianNoteList
}

const handleToggleModalEvidenceList = () => {
  capability.isShowModalEvidenceList = !capability.isShowModalEvidenceList
}

const onSubmit = async () => {
  const loader = loading.show()

  try {
    capability.loadingSubmit = true

    const formData = new FormData()

    if (assessmentStore.capability.detailListLevel.length) {
      formData.append('assesment_id', assessmentId.value)
      formData.append('domain_id', assessmentStore.capability.selectedGamo?.id)
      formData.append('level', assessmentStore.capability.selectedLevel)

      assessmentStore.capability.detailListLevel.map((item, index) => {
        formData.append(`capability_assesment_id[${index}]`, item?.capabilityass?.id || '')
        formData.append(`capability_level_id[${index}]`, item?.capabilityass?.capability_level_id || '')
        formData.append(`capability_answer_id[${index}]`, item?.capabilityass?.capability_answer_id || '')
        formData.append(`note[${index}]`, item?.capabilityass?.note || '')

        if (Array.isArray(item?.capabilityass?.evident) && item?.capabilityass?.evident?.length) {
          item?.capabilityass?.evident.map((ev, indexEv) => {
            if (ev?.tipe) {
              formData.append(`evident[${index}][${indexEv}][tipe]`, ev?.tipe)
            }

            if (ev?.url) {
              formData.append(`evident[${index}][${indexEv}][url]`, ev?.url)
            } else if (ev?.media_repositories_id) {
              formData.append(`evident[${index}][${indexEv}][media_repositories_id]`, ev?.media_repositories_id)
            }

            formData.append(`evident[${index}][${indexEv}][name]`, ev?.name || '')
            formData.append(`evident[${index}][${indexEv}][deskripsi]`, ev?.deskripsi || '')
          })
        }

        if (Array.isArray(item?.capabilityass?.ofi) && item?.capabilityass?.ofi?.length) {
          item?.capabilityass?.ofi.map((ofi, indexOfi) => {
            formData.append(`ofi[${index}][${indexOfi}][ofi]`, ofi?.ofi || '')
            formData.append(`ofi[${index}][${indexOfi}][capability_target_id]`, ofi?.capability_target_id || '')
            formData.append(`ofi[${index}][${indexOfi}][domain_id]`, ofi?.domain_id || '')
          })
        }
      })
    }

    const response = await CapabilityServices.answerLevelCapability(formData)

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

const resetLevel = () => {
  if (Array.isArray(assessmentStore.capability.listLevel) && assessmentStore.capability.listLevel.length) {
    assessmentStore.setCapabilitySelectedLevel(assessmentStore.capability.listLevel?.[0]?.level)
  } else {
    assessmentStore.setCapabilitySelectedLevel("2")
  }
}

const preventReload = (event) => {
  if (!assessmentStore.getCapabilityIsEditedPenilaianSubGamo) return
  event.preventDefault()
  event.returnValue = ""
}

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => [assessmentStore.capability.selectedLevel, assessmentStore.capability.listLevel], () => {
  if (assessmentStore.capability.listLevel.length && assessmentStore.capability.selectedLevel && assessmentStore.capability.selectedGamo) {
    getCapabilityDetailLevelAssessment()
  }
}, { deep: true, immediate: true })

onUnmounted(() => {
  resetLevel()
})

onBeforeMount(() => {
  window.addEventListener("beforeunload", preventReload)
})

onBeforeUnmount(() => {
  window.addEventListener("beforeunload", preventReload)
})
</script>

<template>
  <section :id="`steps-uid-${assessmentStore.capability.selectedLevel}-p-0`" role="tabpanel"
    :aria-labelledby="`steps-uid-${assessmentStore.capability.selectedLevel}-h-0`" class="body current"
    aria-hidden="false">

    <LoadingOverlay :active="capability.loading" />

    <div class="d-flex flex-row justify-content-between align-items-center">
      <h5 class="card-title mb-3 mb-md-0 fw-semibold">Level {{ assessmentStore.capability.selectedLevel }}</h5>

      <div
        class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
        <BaseButton @click="onSubmit" class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3" title="Simpan Data"
          :disabled="capability.loadingSubmit || capability.loading" :is-loading="capability.loadingSubmit"
          :access="['project-edit']">
          <template #icon-left>
            <TablerIcon icon="DeviceFloppyIcon" />
          </template>
        </BaseButton>

        <div class="dropdown dropstart">
          <TablerIcon icon="DotsIcon" class="text-muted cursor-pointer ms-0 mt-3 mt-md-0 ms-md-3"
            data-bs-toggle="dropdown" id="dropdownMenuButton" aria-expanded="false" />

          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <BaseButton @click="handleToggleModalHistory"
              class="dropdown-item d-flex align-items-center gap-3 cursor-pointer" title="Lihat History Perubahan Data"
              :disabled="capability.loadingSubmit || capability.loading">
              <template #icon-left>
                <TablerIcon icon="HistoryIcon" />
              </template>
            </BaseButton>

            <BaseButton @click="handleToggleModalAverageCompliance"
              class="dropdown-item d-flex align-items-center gap-3 cursor-pointer" title="Lihat Nilai Rata-rata"
              :disabled="capability.loadingSubmit || capability.loading">
              <template #icon-left>
                <TablerIcon icon="GraphIcon" />
              </template>
            </BaseButton>

            <BaseButton @click="handleToggleModalPenilaianNoteList"
              class="dropdown-item d-flex align-items-center gap-3 cursor-pointer"
              title="Lihat Daftar Catatan / Note Penilaian" :disabled="capability.loadingSubmit || capability.loading">
              <template #icon-left>
                <TablerIcon icon="NoteIcon" />
              </template>
            </BaseButton>

            <BaseButton @click="handleToggleModalEvidenceList"
              class="dropdown-item d-flex align-items-center gap-3 cursor-pointer" title="Lihat Daftar Evidence"
              :disabled="capability.loadingSubmit || capability.loading">
              <template #icon-left>
                <TablerIcon icon="FileTextIcon" />
              </template>
            </BaseButton>
          </ul>
        </div>
      </div>
    </div>

    <div class="my-4">
      <BaseAlert v-if="assessmentStore.getCapabilityIsEditedPenilaianSubGamo" variant="warning">
        <strong>Info.</strong> Terdapat <i class="mx-1">Draft</i> perubahan data yang belum anda simpan.
      </BaseAlert>
    </div>

    <div class="table-responsive rounded-2 mb-4 mt-4">
      <div class="mh-100vh">
        <table class="table border customize-table text-nowrap mb-0 align-middle">
          <thead class="position-sticky top-0 bg-white text-dark" style="z-index: 5 !important;">
            <tr>
              <th class="align-middle" rowspan="2">
                <h6 class="fs-3 fw-semibold mb-0 text-center">Urutan</h6>
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
                <h6 class="fs-3 fw-semibold mb-0">Evidence</h6>
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
                <h6 class="fs-3 fw-semibold mb-0">Aksi</h6>
              </th>
            </tr>
          </thead>

          <tbody>
            <template
              v-if="Array.isArray(assessmentStore.capability.detailListLevel) && assessmentStore.capability.detailListLevel.length">
              <tr v-for="(item, index) in assessmentStore.capability.detailListLevel"
                :key="`capability-level-item-${index}-${item?.id}`">
                <td :class="{ 'bg-light-warning bg-opacity-50': item?.capabilityass?.isEdited }">
                  <div v-tooltip="`Urutan GAMO - ${item?.urutan}`" class="text-break text-center text-wrap fw-bold ">
                    {{ index + 1 }}
                  </div>
                </td>
                <td :class="{ 'bg-light-warning bg-opacity-50': item?.capabilityass?.isEdited }">
                  <div v-if="item?.subkode" class="width-100px text-break text-wrap fw-bold" v-html="item?.subkode" />

                  <div v-if="item?.capabilityass?.isEdited" class="d-flex flex-row align-items-center text-warning">
                    <TablerIcon icon="InfoTriangleIcon" size="12" class="me-1" />

                    <small class="text-capitalize fw-bold text-break text-wrap lh-base">
                      Terdapat Perubahan Data
                    </small>
                  </div>
                </td>
                <td class="width-175px" :class="{ 'bg-light-warning bg-opacity-50': item?.capabilityass?.isEdited }">
                  <div class="d-flex flex-wrap ">
                    <div v-if="item?.kegiatan" class="width-150px text-break text-wrap" v-html="item?.kegiatan" />
                  </div>
                </td>
                <td class="width-175px" :class="{ 'bg-light-warning bg-opacity-50': item?.capabilityass?.isEdited }">
                  <div class="d-flex flex-wrap ">
                    <div v-if="item?.translate" class="width-150px text-break text-wrap" v-html="item?.translate" />
                  </div>
                </td>
                <td class="text-center width-100px"
                  :class="{ 'bg-light-warning bg-opacity-50': item?.capabilityass?.isEdited }">
                  <div class="d-flex flex-wrap justify-content-center">
                    <div class="d-flex flex-column width-75px">
                      <template
                        v-if="Array.isArray(item?.capabilityass?.evident) && item?.capabilityass?.evident?.length">
                        <TablerIcon @click="handleToggleModalViewDetailEvidence({ gamo: item })"
                          v-tooltip="`Terdapat ${item?.capabilityass?.evident?.length} Evidence. Tekan Untuk Lihat Detail`"
                          icon="CircleCheckIcon" class="text-success cursor-pointer" size="24" />

                      </template>

                      <span v-else class="fst-italic text-muted text-capitalize fw-bold text-break text-wrap lh-base">
                        <TablerIcon v-tooltip="`Belum Ada Evidence`" icon="HelpCircleIcon" class="text-body"
                          size="24" />
                      </span>
                    </div>
                  </div>
                </td>
                <td class="text-center bg-light-primary width-100px">
                  <div class="d-flex flex-wrap justify-content-center">
                    <div class="d-flex flex-column width-75px">
                      <template v-if="item?.capabilityass?.capability_answer_id">
                        <div @click="handleToggleModalPenilaian({ gamo: item })" class="cursor-pointer">
                          <h6 class="fs-3 fw-semibold text-break text-wrap">
                            {{ valueAnwer(item?.capabilityass?.capability_answer_id)?.nama }}
                            ({{ valueAnwer(item?.capabilityass?.capability_answer_id)?.label }})
                          </h6>
                          <h6 class="fs-3 mb-0">
                            {{ valueAnwer(item?.capabilityass?.capability_answer_id)?.bobot }}
                          </h6>
                        </div>
                      </template>

                      <template v-else>
                        <span v-tooltip="`Ketuk Untuk Menambahkan Penilaian`"
                          class="cursor-pointer fst-italic text-muted text-capitalize fw-bold text-break text-wrap lh-base"
                          @click="handleToggleModalPenilaian({ gamo: item })">
                          Belum Dinilai
                        </span>
                      </template>
                    </div>
                  </div>
                </td>
                <td class="text-center bg-light">
                  {{ item?.bobot }}
                </td>
                <td :class="{ 'bg-light-warning bg-opacity-50': item?.capabilityass?.isEdited }">
                  <BaseButton v-tooltip="`Lihat Aksi`" class="btn btn-sm btn-primary btn-icon" data-bs-toggle="dropdown"
                    id="dropdownMenuButton" aria-expanded="false" :access="['project-add', 'project-edit']">
                    <template #icon-left>
                      <TablerIcon icon="DotsIcon" />
                    </template>
                  </BaseButton>

                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <BaseButton @click="handleToggleModalPenilaian({ gamo: item })"
                      class="dropdown-item d-flex align-items-center gap-3 cursor-pointer"
                      :access="['project-add', 'project-edit']">
                      <template #icon-left>
                        <TablerIcon icon="EditIcon" />
                        <span class="ms-2">
                          Atur Penilaian Kapabilitas
                        </span>
                      </template>
                    </BaseButton>

                    <BaseButton @click="handleToggleModalEvidence({ gamo: item })"
                      class="dropdown-item d-flex align-items-center gap-3 cursor-pointer"
                      :access="['project-add', 'project-edit']">
                      <template #icon-left>
                        <TablerIcon icon="FileTextIcon" />
                        <span class="ms-2">
                          Evidence
                        </span>
                      </template>
                    </BaseButton>

                    <BaseButton @click="handleToggleModalOFI({ gamo: item })"
                      class="dropdown-item d-flex align-items-center gap-3 cursor-pointer"
                      :access="['project-add', 'project-edit']">
                      <template #icon-left>
                        <TablerIcon icon="FileStarIcon" />
                        <span class="ms-2">
                          Opportunity for Improvement
                        </span>
                      </template>
                    </BaseButton>

                    <!-- History In Dropdown -->
                    <!-- <hr class="dropdown-divider">

                    <BaseButton @click="handleToggleModalHistory({ gamo: item })"
                      class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                      <template #icon-left>
                        <TablerIcon icon="HistoryIcon" />
                        <span class="ms-2">
                          History Perubahan
                        </span>
                      </template>
                    </BaseButton> -->
                  </ul>
                </td>
              </tr>
            </template>
          </tbody>

          <template v-if="assessmentStore.capability.detailTotalBobot">
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
                    <!-- Computing Front End -->
                    {{ isFinite(totalValue) ? Math.fround(parseFloat(totalValue).toFixed(2)).toFixed(2) : 0 }}

                    <!-- From Backend -->
                    <!-- {{ assessmentStore.capability.detailTotalBobot.answer ? parseFloat(assessmentStore.capability.detailTotalBobot.answer).toFixed(2) : 0 }} -->
                  </h6>
                </td>
                <td class="text-center bg-light">
                  <h6 class="fs-3 fw-semibold mb-0">
                    <!-- Computing Front End -->
                    {{ isFinite(totalWeight) ? totalWeight : 0 }}

                    <!-- From Backend -->
                    <!-- {{ assessmentStore.capability.detailTotalBobot.level || 0 }} -->
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
                    <!-- Computing Front End -->
                    {{ isFinite(totalCompliances) ? Math.fround(parseFloat(totalCompliances).toFixed(2)).toFixed(2) : 0
                    }}

                    <!-- From Backend -->
                    <!-- {{ assessmentStore.capability.detailTotalBobot.result ?
                      parseFloat(assessmentStore.capability.detailTotalBobot.result).toFixed(2) : 0 }} -->
                  </h6>
                </td>
                <td colspan="1"></td>
              </tr>
            </tfoot>
          </template>
        </table>
      </div>
    </div>

    <ModalOFI :is-show="capability.isShowModalOFI" @close="handleToggleModalOFI" />
    <ModalPenilaian :is-show="capability.isShowModalPenilaian" @close="handleToggleModalPenilaian" />
    <ModalEvidence :is-show="capability.isShowModalEvidence" type="penilaian" @close="handleToggleModalEvidence" />
    <ModalViewDetailEvidence :is-show="capability.isShowModalViewDetailEvidence"
      @close="handleToggleModalViewDetailEvidence" />
    <ModalAverageCompliance :is-show="capability.isShowModalAverageCompliance"
      @close="handleToggleModalAverageCompliance" />
    <ModalHistory :is-show="capability.isShowModalHistory" @close="handleToggleModalHistory" />
    <ModalPenilaianNoteList :is-show="capability.isShowModalPenilaianNoteList"
      @close="handleToggleModalPenilaianNoteList" />
    <ModalEvidenceList :is-show="capability.isShowModalEvidenceList" @close="handleToggleModalEvidenceList" />
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