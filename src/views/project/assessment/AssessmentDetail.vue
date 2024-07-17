<script setup>
import { computed, onMounted, onUnmounted, ref, reactive } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseLightBadge from '@/components/Badge/BaseLightBadge.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import NoOptions from '@/components/EmptyPlaceholder/NoOptions.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'

import OverviewCard from '@/views/project/assessment/components/OverviewCard.vue'
import ModalEditPIC from '@/views/project/assessment/components/ModalEditPIC.vue'
import ModalInvitePIC from '@/views/project/assessment/components/ModalInvitePIC.vue'
import ModalEditTanggalKadaluarsaPIC from '@/views/project/assessment/components/ModalEditTanggalKadaluarsaPIC.vue'
import ModalEditOrganisasi from '@/views/project/assessment/components/ModalEditOrganisasi.vue'


import { formatDateMoments } from '@/utils/momentDateFormat'
import { useRoute, useRouter } from 'vue-router'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useTitle } from '@vueuse/core'
import { useAuth } from '@/stores/auth'
import { useScrollTo } from '@/hooks/useScrollTo'
import { useVuelidate } from "@vuelidate/core"
import { useToast } from '@/stores/toast'
import { useAlert } from '@/stores/alert'
import { required, helpers, sameAs } from "@vuelidate/validators";

import AssessmentServices from '@/services/lib/assessment'

const title = useTitle()
const route = useRoute()
const router = useRouter()
const auth = useAuth()
const alert = useAlert()
const toast = useToast()
const assessment = useAssessmentStore()
const scrollTo = useScrollTo()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loadingSubmit: false,
  delete_confirmation_word: '',
  selectedPic: null,
})

const isShowModalEditPIC = ref(false)

const isShowModalInvitePIC = ref(false)

const isShowModalEditTanggalKadaluarsaPIC = ref(false)

const isShowModalEditOrganisasi = ref(false)

const classStatus = computed(() => {
  return value => {
    if (value === 'ongoing') {
      return 'bg-light-primary text-primary'
    } else if (value === 'completed') {
      return 'bg-light-success text-success'
    } else if (value === 'unstart') {
      return 'bg-light-info text-info'
    } else {
      return ''
    }
  }
})

const formatDate = computed(() => {
  return value => {
    return formatDateMoments({ value: value?.value })
  }
})

const currentHash = computed(() => route.hash)

const assessmentId = computed(() => route.params?.id)

const rules = computed(() => {
  return {
    delete_confirmation_word: {
      required: helpers.withMessage('Silahkan isi kalimat konfirmasi untuk hapus project', required),
      sameAs: helpers.withMessage('Kalimat konfirmasi tidak valid', sameAs(`HapusProject${assessment.detail?.nama?.replaceAll(' ', '') || ''}`))
    },
  }
})

const classBadgeStatus = computed(() => {
  return value => {
    if (value === 'active') {
      return 'success'
    } else if (value === 'pending') {
      return 'warning'
    } else if (value === 'banned') {
      return 'danger'
    } else {
      return 'dark'
    }
  }
})

const labelStatus = computed(() => {
  return value => {
    if (value === 'active') {
      return 'Aktif'
    } else if (value === 'pending') {
      return 'Menunggu Aktivasi'
    } else if (value === 'banned') {
      return 'Diblokir'
    } else {
      return 'Tidak Diketahui'
    }
  }
})

const v$ = useVuelidate(rules, formState, { $scope: false })

/* --------------------------------- METHODS -------------------------------- */
const handleBack = () => {
  router.push("/project/assessment")
}

const handleEditPIC = ({ data }) => {
  isShowModalEditPIC.value = true;
  formState.selectedPic = data;
}

const handleEditTanggalKadaluarsaPIC = ({ data }) => {
  isShowModalEditTanggalKadaluarsaPIC.value = true;
  formState.selectedPic = data;
}

const toggleModalEditPIC = () => {
  isShowModalEditPIC.value = !isShowModalEditPIC.value
}

const toggleModalInvitePIC = () => {
  isShowModalInvitePIC.value = !isShowModalInvitePIC.value
}

const toggleModalEditTanggalKadaluarsaPIC = () => {
  isShowModalEditTanggalKadaluarsaPIC.value = !isShowModalEditTanggalKadaluarsaPIC.value
}

const toggleModalEditOrganisasi = () => {
  isShowModalEditOrganisasi.value = !isShowModalEditOrganisasi.value
}

const handleNavigateEdit = ({ id }) => {
  router.push({ path: `/project/assessment/${id}/edit` })
}

const handleRefresh = () => {
  assessment.getDetailAssessment({ id: route.params?.id })
}

const handleScrollToElement = (target) => {
  scrollTo(target)
}

const deletePIC = async ({ id }) => {
  try {
    const response = await AssessmentServices.deletePic({ id })

    if (response) {
      toast.success({
        title: 'Hapus PIC',
        text: `Berhasil Menghapus Data PIC`
      })
      handleRefresh()

      return response
    }
  } catch (error) {
    toast.error({ error })
    throw error
  }
}

const deleteAssessment = async ({ id }) => {
  formState.loadingSubmit = true
  try {
    const response = await AssessmentServices.deleteAssessment({ id })

    if (response) {
      formState.loadingSubmit = false
      toast.success({
        title: 'Hapus Project',
        text: `Berhasil Menghapus Data Project`
      })
      handleBack()

      return response
    }
  } catch (error) {
    formState.loadingSubmit = false
    toast.error({ error })
    throw error
  }
}

const handleDeletePIC = async ({ title, id }) => {
  alert.info({
    title: `Apakah Anda Yakin untuk Menghapus ${title}`
  }).then(async (result) => {
    if (result.isConfirmed) {
      alert.loading()
      try {
        const response = await deletePIC({ id })

        if (response) {
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
      }
    }
  })
}

const handleDeleteAssessment = async ({ title, id }) => {
  const result = await v$.value.$validate()

  if (result) {
    alert.info({
      title: `Apakah Anda Yakin untuk Menghapus ${title}`
    }).then(async (result) => {
      if (result.isConfirmed) {
        alert.loading()
        try {
          const response = await deleteAssessment({ id })

          if (response) {
            alert.instance().close()
          }
        } catch (error) {
          alert.instance().close()
        }
      }
    })
  }
}

const selesaikanAsessment = async ({ id }) => {
  try {
    const response = await AssessmentServices.setStatusAssessment({ id, status: 'completed' })

    if (response) {
      toast.success({
        title: 'Ubah Status Project',
        text: `Berhasil Mengubah Status Project`
      })

      handleBack()

      return response
    }

  } catch (error) {
    toast.error({ error })
    throw error
  }
}

const handleSelesaikanAssessment = ({ title, id }) => {
  alert.info({
    title: `Apakah Anda Yakin untuk Menyelesaikan Project ${title}`
  }).then(async (result) => {
    if (result.isConfirmed) {
      alert.loading()
      try {
        const response = await selesaikanAsessment({ id })

        if (response) {
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
      }
    }
  })
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  auth.setMenuToProject()

  if (currentHash.value) {
    handleScrollToElement(currentHash.value)
  }

  assessment.getDetailAssessment({ id: route.params?.id }).then(() => {
    title.value = `Detail ${assessment.detail?.nama || ''}`
  })
})

onUnmounted(() => {
  assessment.resetState()
})
</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="row">
        <OverviewCard>
          <template #icon>
            <TablerIcon icon="ClipboardTextIcon" size="36" class="text-primary" />
          </template>

          <template #header>
            <div class="d-flex flex-row justify-content-between align-items-center">
              <h4 class="card-title text-dark mb-0">Project</h4>

              <div
                class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
                <BaseButton :access="['project-edit']" title="Edit Project"
                  @click="handleNavigateEdit({ id: assessmentId })">
                  <template #icon-right>
                    <TablerIcon icon="EditIcon" class="ms-1" />
                  </template>
                </BaseButton>

                <BaseButton v-if="assessment.detail?.status === 'ongoing'" :access="['project-edit']"
                  class="btn btn-success ms-0 mt-3 mt-md-0 ms-md-3" title="Selesaikan Project"
                  @click="handleSelesaikanAssessment({ title: assessment.detail?.nama, id: assessmentId })">
                  <template #icon-right>
                    <TablerIcon size="16" icon="CheckboxIcon" />
                  </template>
                </BaseButton>
              </div>
            </div>
          </template>

          <template #body>
            <div class="d-flex flex-column">
              <div class="fs-2 mb-2 d-flex flex-column">
                <h6 class="mb-0 fw-semibold"> Nama : </h6>

                <span class="fs-3">{{ assessment.detail?.nama || "-" }}</span>
              </div>

              <div class="fs-2 mb-2 d-flex flex-column">
                <h6 class="mb-0 fw-semibold"> Deskripsi : </h6>

                <div class="fs-3 mb-0" v-html="assessment.detail?.deskripsi || ' - '" />
              </div>

              <div class="fs-2 mb-2 d-flex flex-column">
                <h6 class="mb-0 fw-semibold"> Periode Asesmen : </h6>

                <span v-if="assessment.detail?.start_date" class="fs-3">
                  {{ formatDate({ value: assessment.detail?.start_date }) }} s/d {{ formatDate({
                  value:
                    assessment.detail?.end_date
                }) }}
                </span>

                <span v-else class="fs-3">
                  -
                </span>
              </div>

              <div class="fs-2 mb-1 d-flex flex-column">
                <h6 class="mb-0 fw-semibold"> Periode Kuesioner : </h6>

                <span v-if="assessment.detail?.start_date_quisioner" class="fs-3">
                  {{ formatDate({ value: assessment.detail?.start_date_quisioner }) }} s/d {{ formatDate({
                  value:
                    assessment.detail?.end_date_quisioner
                }) }}
                </span>

                <span v-else class="fs-3">
                  -
                </span>
              </div>

              <div class="fs-2 mb-1 d-flex flex-column">
                <h6 class="mb-0 fw-semibold"> Status : </h6>

                <div>
                  <span class="badge rounded-pill text-capitalize fw-bold"
                    :class="classStatus(assessment.detail?.status)">
                    {{ assessment.detail?.status }}
                  </span>

                </div>
              </div>
            </div>
          </template>
        </OverviewCard>

        <OverviewCard heading="Organisasi">
          <template #icon>
            <TablerIcon icon="BuildingSkyscraperIcon" size="36" class="text-primary" />
          </template>

          <template #header>
            <div class="d-flex flex-row justify-content-between align-items-center">
              <h4 class="card-title text-dark mb-0">Organisasi</h4>

              <BaseButton :access="['project-edit']" v-if="assessment.detail?.pic?.status === 'pending'"
                @click="toggleModalEditOrganisasi" title="Ganti Organisasi">
                <template #icon-right>
                  <TablerIcon icon="EditIcon" class="ms-1" />
                </template>
              </BaseButton>
            </div>
          </template>

          <template #body>
            <div class="d-flex flex-column">
              <div class="fs-2 mb-1 d-flex flex-column">
                <h6 class="mb-0 fw-semibold"> Nama : </h6>

                <span class="fs-3">{{ assessment.detail?.organisasi?.nama || '-' }}</span>
              </div>

              <div class="fs-2 mb-1 d-flex flex-column">
                <h6 class="mb-0 fw-semibold"> Deskripsi : </h6>

                <div class="fs-3" v-html="assessment.detail?.organisasi?.deskripsi || ' - '" />
              </div>
            </div>
          </template>
        </OverviewCard>

        <template v-if="Array.isArray(assessment?.detail?.allpic) && assessment?.detail?.allpic?.length">
          <OverviewCard v-for="(pic, index) in assessment.detail.allpic" :key="`card-pic-${pic?.id}`">
            <template #icon>
              <TablerIcon icon="UserCheckIcon" size="36" class="text-primary" />
            </template>

            <template #header>
              <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-center">
                <h4 class="card-title text-primary mb-0">PIC {{ index + 1 }}</h4>

                <div>
                  <BaseButton :access="['project-edit']" @click="handleEditPIC({ data: pic })" v-tooltip="`Edit PIC`"
                    class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3">
                    <template #icon-right>
                      <TablerIcon icon="EditIcon" class="ms-1" />
                    </template>
                  </BaseButton>

                  <BaseButton :access="['project-edit']" @click="handleEditTanggalKadaluarsaPIC({ data: pic })"
                    v-tooltip="`Edit Tanggal Kadaluarsa PIC`" class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3">
                    <template #icon-right>
                      <TablerIcon icon="CalendarTimeIcon" class="ms-1" />
                    </template>
                  </BaseButton>

                  <BaseButton :access="['project-edit']" @click="handleDeletePIC({ title: pic?.nama, id: pic?.id })"
                    v-tooltip="`Hapus PIC`" class="btn btn-outline-danger ms-0 mt-3 mt-md-0 ms-md-3">
                    <template #icon-right>
                      <TablerIcon icon="TrashIcon" class="ms-1" />
                    </template>
                  </BaseButton>
                </div>
              </div>
            </template>

            <template #body>
              <div class="row">
                <div class="col-12 col-md-6">
                  <div class="fs-2 mb-2 d-flex flex-column">
                    <h6 class="mb-0 fw-semibold"> Nama : </h6>

                    <span class="fs-3">{{ pic?.nama || "-" }}</span>
                  </div>

                  <div class="fs-2 mb-2 d-flex flex-column">
                    <h6 class="mb-0 fw-semibold"> Email : </h6>

                    <span class="fs-3">{{ pic?.email || '-' }}</span>
                  </div>

                  <div class="fs-2 mb-2 d-flex flex-column">
                    <h6 class="mb-0 fw-semibold"> Tanggal Kadaluarsa PIC : </h6>

                    <span v-if="pic?.assesment?.expire_at" class="fs-3">
                      {{ formatDate({ value: pic?.assesment?.expire_at }) }}
                    </span>

                    <span class="fs-3" v-else>-</span>
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="fs-2 mb-2 d-flex flex-column">
                    <h6 class="mb-0 fw-semibold"> Divisi : </h6>

                    <span class="fs-3">{{ pic?.divisi?.nama || '-' }}</span>
                  </div>

                  <div class="fs-2 mb-2 d-flex flex-column">
                    <h6 class="mb-0 fw-semibold"> Jabatan : </h6>

                    <span class="fs-3">{{ pic?.jabatan?.nama || '-' }}</span>
                  </div>

                  <div class="fs-2 mb-2 d-flex flex-column">
                    <h6 class="mb-0 fw-semibold"> Status : </h6>

                    <div class="mt-1">
                      <BaseLightBadge :title="labelStatus(pic?.status)" :variant="classBadgeStatus(pic?.status)" />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </OverviewCard>
        </template>

        <template v-else>
          <OverviewCard>
            <template #header>
              <div class="d-flex flex-row justify-content-between align-items-center">
                <h4 class="card-title text-primary mb-0">PIC</h4>
              </div>
            </template>

            <template #body>
              <div class="d-flex flex-column justify-content-center align-items-center">
                <NoOptions title="Belum Ada PIC Diundang" />
              </div>
            </template>
          </OverviewCard>
        </template>

        <div class="col-12">
          <div class="mt-2 mb-5 d-flex justify-content-center align-items-center">
            <BaseButton title="Tambah PIC" :access="['project-edit']" @click=toggleModalInvitePIC>
              <template #icon-left>
                <TablerIcon icon="PlusIcon" />
              </template>
            </BaseButton>
          </div>
        </div>
      </div>

      <div class="card" v-if="auth.getIsAdministrator || auth.getIsAssessor">
        <div class="card-header bg-light-danger">
          <h5 class="card-title fw-semibold text-danger">Hapus Project</h5>
        </div>
        <div class="card-body">
          <p class="fs-3 mb-2">
            Menghapus project akan menghapus file, repository dan semua data terkait.
          </p>

          <div class="mb-3">
            <BaseInput id="delete-confirmation-word"
              :label="`Untuk Menghapus, Masukkan Kalimat 'HapusProject${assessment.detail?.nama?.replaceAll(' ', '') || ''}' pada Kolom dibawah ini`"
              placeholder="Masukkan Kalimat Konfirmasi" v-model="v$.delete_confirmation_word.$model"
              :isInvalid="!!v$.delete_confirmation_word.$errors?.length" :disabled="formState.loadingSubmit" />

            <ErrorMessage :only-show-one="true" :errors="v$.delete_confirmation_word.$errors" />
          </div>

          <div>
            <BaseButton class="btn btn-danger" title="Hapus Project"
              @click="handleDeleteAssessment({ title: assessment.detail?.nama, id: assessmentId })"
              :access="['project-delete']">
              <template #icon-right>
                <TablerIcon icon="TrashIcon" />
              </template>
            </BaseButton>
          </div>
        </div>
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
          </div>
        </div>
      </div>
    </section>

    <ModalEditPIC :is-show="isShowModalEditPIC" :selected-pic="formState.selectedPic" @close="toggleModalEditPIC"
      @refresh="handleRefresh" />

    <ModalInvitePIC :is-show="isShowModalInvitePIC" @close="toggleModalInvitePIC" @refresh="handleRefresh" />

    <ModalEditTanggalKadaluarsaPIC :is-show="isShowModalEditTanggalKadaluarsaPIC" :selected-pic="formState.selectedPic"
      @close="toggleModalEditTanggalKadaluarsaPIC" @refresh="handleRefresh" />

    <ModalEditOrganisasi :is-show="isShowModalEditOrganisasi" @close="toggleModalEditOrganisasi"
      @refresh="handleRefresh" />
  </div>
</template>