<script setup>
import { reactive, computed, watch, onBeforeMount, onBeforeUnmount, onUnmounted } from 'vue'

import BaseLightBadge from '@/components/Badge/BaseLightBadge.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseAlert from '@/components/Alert/BaseAlert.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'

import CapabilityServices from '@/services/lib/capability'

import ModalPBC from '@/views/project/assessment/capability/pbc/components/ModalPBC.vue'
import ModalEvidence from '@/views/project/assessment/capability/steps/components/ModalEvidence.vue'

import { useRoute } from 'vue-router'
import { useToast } from '@/stores/toast'
import { useLoading } from 'vue-loading-overlay'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useAppConfig } from '@/stores/appConfig'

const route = useRoute()
const assessmentStore = useAssessmentStore()
const toast = useToast()
const loading = useLoading()
const appConfig = useAppConfig()

/* ---------------------------------- STATE --------------------------------- */
const pbc = reactive({
  loading: false,
  loadingSubmit: false,
  isShowModalPBC: false,
  isShowModalEvidence: false,
})

/* -------------------------------- COMPUTED -------------------------------- */
const assessmentId = computed(() => {
  return route.params?.id
})

const variantStatusPbc = computed(() => {
  return value => {
    if (value === 'not_yet') {
      return 'danger'
    } else if (value === 'on_process') {
      return 'warning'
    } else if (value === 'done') {
      return 'success'
    } else if (value === 'outstanding') {
      return 'danger'
    } else {
      return 'disable'
    }
  }
})

const titleStatusPbc = computed(() => {
  return value => {
    if (value === 'not_yet') {
      return 'Not Yet'
    } else if (value === 'on_process') {
      return 'On Process'
    } else if (value === 'done') {
      return 'Done'
    } else if (value === 'outstanding') {
      return 'Outstanding'
    } else {
      return 'Belum ada Status'
    }
  }
})

const pathSource = computed(() => {
  return value => {
    return `${appConfig.app.appHostMedia}${value}`
  }
})

/* --------------------------------- METHODS -------------------------------- */
const getCapabilityPBCAssessment = async () => {
  try {
    pbc.loading = true

    const response = await assessmentStore.getCapabilityPBCAssessment({
      level: assessmentStore.capability.selectedLevel,
      domain_id: assessmentStore.capability.selectedGamo?.id,
      assesment_id: assessmentId.value
    })

    if (response) {
      pbc.loading = false
    }
  } catch (error) {
    pbc.loading = false
  }
}

const handleToggleModalEvidence = ({ gamo }) => {
  pbc.isShowModalEvidence = !pbc.isShowModalEvidence

  if (pbc.isShowModalEvidence) {
    assessmentStore.setCapabilitySelectedSubGamo(gamo)
  }
}

const handleToggleModalPBC = ({ gamo }) => {
  pbc.isShowModalPBC = !pbc.isShowModalPBC

  if (pbc.isShowModalPBC) {
    assessmentStore.setCapabilitySelectedSubGamo(gamo)
  }
}

const resetLevel = () => {
  if (Array.isArray(assessmentStore.capability.listLevel) && assessmentStore.capability.listLevel.length) {
    assessmentStore.setCapabilitySelectedLevel(assessmentStore.capability.listLevel?.[0]?.level)
  } else {
    assessmentStore.setCapabilitySelectedLevel("2")
  }
}

const preventReload = (event, isResetLevel = false) => {
  if (isResetLevel) {
    resetLevel()
  }

  if (!assessmentStore.getCapabilityIsEditedPbc) return
  event.preventDefault()
  event.returnValue = ""
}

const onSubmit = async () => {
  const loader = loading.show()

  try {
    pbc.loadingSubmit = true

    const formData = new FormData()

    if (assessmentStore.capability.detailListPBC.length) {
      formData.append('assesment_id', assessmentId.value)
      formData.append('domain_id', assessmentStore.capability.selectedGamo?.id)
      formData.append('level', assessmentStore.capability.selectedLevel)

      assessmentStore.capability.detailListPBC.map((item, index) => {
        formData.append(`capability_assesment_id[${index}]`, item?.capabilityass?.id || '')
        formData.append(`capability_level_id[${index}]`, item?.capabilityass?.capability_level_id || '')

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

        if (item?.capabilityass?.pbc) {
          formData.append(`pbc[${index}][status]`, item?.capabilityass?.pbc?.status || '')
          formData.append(`pbc[${index}][note]`, item?.capabilityass?.pbc?.note || '')
          formData.append(`pbc[${index}][data_owner]`, item?.capabilityass?.pbc?.data_owner || '')
        }
      })
    }

    const response = await CapabilityServices.answerPBCCapability(formData)

    if (response) {
      toast.success({
        title: `Simpan Data PBC ${assessmentStore.capability.selectedLevel}`,
        text: `Berhasil Menyimpan Data PBC ${assessmentStore.capability.selectedLevel}`
      })

      pbc.loadingSubmit = false
      loader.hide()

      getCapabilityPBCAssessment()
    }

  } catch (error) {
    pbc.loadingSubmit = false
    loader.hide()
    toast.error({ error })
  }
}

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => [assessmentStore.capability.selectedLevel, assessmentStore.capability.listLevel], () => {
  if (assessmentStore.capability.selectedGamo) {
    getCapabilityPBCAssessment()
  }
}, { deep: true, immediate: true })

onUnmounted(() => {
  resetLevel()
})

onBeforeMount(() => {
  window.addEventListener("beforeunload", preventReload)
})

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", preventReload)
})
</script>

<template>
  <div class="card">
    <div class="card-body">
      <LoadingOverlay :active="pbc.loading" />

      <div class="d-flex flex-row justify-content-between align-items-center">
        <h5 class="card-title mb-3 mb-md-0 fw-semibold">Level {{ assessmentStore.capability.selectedLevel }}</h5>

        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <BaseButton @click="onSubmit" class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3" title="Simpan Data"
            :disabled="pbc.loadingSubmit || pbc.loading" :is-loading="pbc.loadingSubmit" :access="['project-edit']">
            <template #icon-left>
              <TablerIcon icon="DeviceFloppyIcon" />
            </template>
          </BaseButton>
        </div>
      </div>

      <div class="my-4">
        <BaseAlert v-if="assessmentStore.getCapabilityIsEditedPbc" variant="warning">
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
                <th class="width-200 align-middle" rowspan="2">
                  <div class="width-100px text-break text-wrap">
                    <h6 class="fs-3 fw-semibold mb-0">Management Practice Code</h6>
                  </div>
                </th>
                <th class="align-middle" rowspan="2">
                  <h6 class="fs-3 fw-semibold mb-0">Kebutuhan Dokumen</h6>
                </th>
                <th class="align-middle" rowspan="2">
                  <h6 class="fs-3 fw-semibold mb-0">Evidence</h6>
                </th>
                <th class="align-middle text-center" rowspan="2">
                  <h6 class="fs-3 fw-semibold mb-0">Status</h6>
                </th>
                <th class="align-middle" rowspan="2">
                  <h6 class="fs-3 fw-semibold mb-0">Keterangan</h6>
                </th>
                <th class="align-middle" rowspan="2">
                  <h6 class="fs-3 fw-semibold mb-0">Aksi</h6>
                </th>
              </tr>
            </thead>

            <tbody>
              <template
                v-if="Array.isArray(assessmentStore.capability.detailListPBC) && assessmentStore.capability.detailListPBC.length">
                <tr v-for="(item, index) in assessmentStore.capability.detailListPBC"
                  :key="`capability-pbc-item-${index}-${item?.id}`">
                  <td :class="{ 'bg-light-warning bg-opacity-50': item?.capabilityass?.isEditedPbc }">
                    <div v-tooltip="`Urutan GAMO - ${item?.urutan}`" class="text-break text-center text-wrap fw-bold ">
                      {{ index + 1 }}
                    </div>
                  </td>

                  <td class="width-200px"
                    :class="{ 'bg-light-warning bg-opacity-50': item?.capabilityass?.isEditedPbc }">
                    <div v-if="item?.subkode" class="width-175px text-break text-wrap fw-bolder"
                      v-html="item?.subkode" />

                    <template v-if="item?.kegiatan">
                      <div class="d-flex flex-wrap mt-2">
                        <div v-if="item?.kegiatan" class="width-175px text-break text-wrap" v-html="item?.kegiatan" />
                      </div>
                    </template>

                    <div v-if="item?.capabilityass?.isEditedPbc"
                      class="d-flex flex-row align-items-center text-warning">
                      <TablerIcon icon="InfoTriangleIcon" size="12" class="me-1" />

                      <small class="text-capitalize fw-bold text-break text-wrap lh-base">
                        Terdapat Perubahan Data
                      </small>
                    </div>
                  </td>

                  <td class="width-175px"
                    :class="{ 'bg-light-warning bg-opacity-50': item?.capabilityass?.isEditedPbc }">
                    <div class="d-flex flex-wrap ">
                      <div class="width-150px text-break text-wrap" v-html="item?.guidelines || '-'" />
                    </div>
                  </td>

                  <td class="width-150px" :id="`container-evident-${item?.capabilityass?.id}`"
                    :class="{ 'bg-light-warning bg-opacity-50': item?.capabilityass?.isEditedPbc }">
                    <template
                      v-if="Array.isArray(item?.capabilityass?.evident) && item?.capabilityass?.evident?.length">
                      <ul v-for="evident in item?.capabilityass?.evident" :key="`evident-${evident?.id}`"
                        class="d-flex flex-wrap list-group">
                        <template v-if="evident?.url">
                          <a v-tooltip="{
                            content: evident?.url, container: `#container-evident-${item?.capabilityass?.id}`,
                          }" :href="evident?.url" target='_blank' rel='noopener noreferrer'
                            class="width-125px list-group-item p-2 mb-3 text-decoration-underline"
                            :class="evident?.name ? 'text-wrap text-break' : 'text-truncate'">
                            {{ evident?.name || evident?.url }}
                          </a>
                        </template>

                        <template v-else-if="evident?.docs?.docs?.path">
                          <a v-tooltip="{
                            content: pathSource(evident?.docs?.docs?.path), container: `#container-evident-${item?.capabilityass?.id}`,
                          }" :href="pathSource(evident?.docs?.docs?.path)" target='_blank' rel='noopener noreferrer'
                            class="width-125px list-group-item p-2 mb-3 text-decoration-underline"
                            :class="evident?.name ? 'text-wrap text-break' : 'text-truncate'">
                            {{ evident?.name || pathSource(evident?.docs?.docs?.path) }}
                          </a>
                        </template>

                        <template v-else-if="item?.docs?.path">
                          <a v-tooltip="{
                            content: pathSource(item?.docs?.path), container: `#container-evident-${item?.capabilityass?.id}`,
                          }" :href="pathSource(item?.docs?.path)" target='_blank' rel='noopener noreferrer'
                            class="width-125px list-group-item p-2 mb-3 text-decoration-underline"
                            :class="evident?.name ? 'text-wrap text-break' : 'text-truncate'">
                            {{ evident?.name || pathSource(item?.docs?.path) }}
                          </a>
                        </template>
                      </ul>
                    </template>

                    <template v-else>
                      <small class="text-capitalize fst-italic fw-bold text-break text-wrap text-muted lh-base">
                        Belum Ada Evidence
                      </small>
                    </template>
                  </td>

                  <td class="text-center width-175px"
                    :class="{ 'bg-light-warning bg-opacity-50': item?.capabilityass?.isEditedPbc }">
                    <div class="d-flex flex-wrap justify-content-center">
                      <BaseLightBadge :title="titleStatusPbc(item?.capabilityass?.pbc?.status)"
                        :variant="variantStatusPbc(item?.capabilityass?.pbc?.status)" />
                    </div>
                  </td>

                  <td class="width-150px"
                    :class="{ 'bg-light-warning bg-opacity-50': item?.capabilityass?.isEditedPbc }">
                    <div class="d-flex flex-wrap">
                      <div class="width-150px text-break text-wrap" v-html="item?.capabilityass?.pbc?.note || '-'" />
                    </div>
                  </td>

                  <td :class="{ 'bg-light-warning bg-opacity-50': item?.capabilityass?.isEditedPbc }">
                    <BaseButton v-tooltip="`Lihat Aksi`" class="btn btn-sm btn-primary btn-icon"
                      data-bs-toggle="dropdown" id="dropdownMenuButton" aria-expanded="false"
                      :access="['project-add', 'project-edit']">
                      <template #icon-left>
                        <TablerIcon icon="DotsIcon" />
                      </template>
                    </BaseButton>

                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <BaseButton @click="handleToggleModalPBC({ gamo: item })"
                        class="dropdown-item d-flex align-items-center gap-3 cursor-pointer"
                        :access="['project-add', 'project-edit']">
                        <template #icon-left>
                          <TablerIcon icon="EditIcon" />
                          <span class="ms-2">
                            Ubah Status
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
                    </ul>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ModalPBC :is-show="pbc.isShowModalPBC" @close="handleToggleModalPBC" />
    <ModalEvidence :is-show="pbc.isShowModalEvidence" type="pbc" @close="handleToggleModalEvidence" />
  </div>
</template>