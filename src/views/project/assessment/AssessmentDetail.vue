<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import OverviewCard from '@/views/project/assessment/components/OverviewCard.vue'
import RespondenCard from '@/views/project/assessment/components/RespondenCard.vue'
import ModalEditPIC from '@/views/project/assessment/components/ModalEditPIC.vue'
import ModalEditTanggalKadaluarsaPIC from '@/views/project/assessment/components/ModalEditTanggalKadaluarsaPIC.vue'

import { formatDateMoments } from '@/utils/momentDateFormat'
import { useRoute, useRouter } from 'vue-router'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useTitle } from '@vueuse/core'
import { useAuth } from '@/stores/auth'
import { useScrollTo } from '@/hooks/useScrollTo'

const title = useTitle()
const route = useRoute()
const router = useRouter()
const auth = useAuth()
const assessment = useAssessmentStore()
const scrollTo = useScrollTo()

const isShowModalEditPIC = ref(false)

const isShowModalEditTanggalKadaluarsaPIC = ref(false)

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

/* --------------------------------- METHODS -------------------------------- */
const handleBack = () => {
  router.back()
}

const toggleModalEditPIC = () => {
  isShowModalEditPIC.value = !isShowModalEditPIC.value
}

const toggleModalEditTanggalKadaluarsaPIC = () => {
  isShowModalEditTanggalKadaluarsaPIC.value = !isShowModalEditTanggalKadaluarsaPIC.value
}

const handleRefresh = () => {
  assessment.getDetailAssessment({ id: route.params?.id })
}

const handleScrollToElement = (target) => {
  scrollTo(target)
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

          <template #body>
            <h4 class="card-title text-dark mb-3">Project</h4>
            <div class="d-flex flex-column">
              <div class="fs-2 mb-1 d-flex flex-column">
                <span class="fw-bolder">
                  Nama:
                </span>

                <div>{{ assessment.detail?.nama || '-' }}</div>
              </div>

              <div class="fs-2 mb-1 d-flex flex-column">
                <span class="fw-bolder">Deskripsi:</span>

                <div v-html="assessment.detail?.deskripsi || ' - '" />
              </div>

              <div class="fs-2 mb-1 d-flex flex-column">
                <span class="fw-bolder">Periode Asesmen:</span>

                <div v-if="assessment.detail?.start_date">
                  {{ formatDate({ value: assessment.detail?.start_date }) }} s/d {{ formatDate({
                  value:
                    assessment.detail?.end_date
                }) }}
                </div>

                <div v-else>
                  -
                </div>
              </div>

              <div class="fs-2 mb-1 d-flex flex-column">
                <span class="fw-bolder">Periode Kuesioner:</span>

                <div v-if="assessment.detail?.start_date_quisioner">
                  {{ formatDate({ value: assessment.detail?.start_date_quisioner }) }} s/d {{ formatDate({
                  value:
                    assessment.detail?.end_date_quisioner
                }) }}
                </div>

                <div v-else>
                  -
                </div>
              </div>

              <div class="fs-2 mb-1 d-flex flex-column">
                <span class="fw-bolder">Status:</span>

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

          <template #body>
            <h4 class="card-title text-dark mb-3">Organisasi</h4>
            <div class="d-flex flex-column">
              <div class="fs-2 mb-1 d-flex flex-column">
                <span class="fw-bolder">
                  Nama:
                </span>

                <div>{{ assessment.detail?.organisasi?.nama || '-' }}</div>
              </div>

              <div class="fs-2 mb-1 d-flex flex-column">
                <span class="fw-bolder">Deskripsi:</span>

                <div v-html="assessment.detail?.organisasi?.deskripsi || ' - '" />
              </div>
            </div>
          </template>
        </OverviewCard>
        <OverviewCard>
          <template #icon>
            <TablerIcon icon="UserCheckIcon" size="36" class="text-primary" />
          </template>

          <template #body>
            <div class="mb-3 d-flex flex-row justify-content-between align-items-center">
              <h4 class="card-title text-dark">PIC</h4>

              <BaseButton :access="['project-edit']" v-if="assessment.detail?.pic?.status === 'pending'"
                @click="toggleModalEditPIC" title="Edit PIC">
                <template #icon-right>
                  <TablerIcon icon="EditIcon" class="ms-1" />
                </template>
              </BaseButton>

              <BaseButton v-else-if="assessment.detail?.pic?.status === 'active'" :access="['project-edit']"
                @click="toggleModalEditTanggalKadaluarsaPIC" title="Edit Tanggal Kadaluarsa PIC">
                <template #icon-right>
                  <TablerIcon icon="EditIcon" class="ms-1" />
                </template>
              </BaseButton>
            </div>

            <div class="row">
              <div class="col-12 col-md-6">
                <div class="fs-2 mb-2 d-flex flex-column">
                  <span class="fw-bolder">
                    Nama:
                  </span>

                  <div>{{ assessment.detail?.pic?.nama || "-" }}</div>
                </div>

                <div class="fs-2 mb-2 d-flex flex-column">
                  <span class="fw-bolder">
                    Email:
                  </span>

                  <div>{{ assessment.detail?.pic?.email || '-' }}</div>
                </div>

                <div class="fs-2 mb-2 d-flex flex-column">
                  <span class="fw-bolder">
                    Tanggal Kadaluarsa PIC:
                  </span>

                  <div v-if="assessment.detail?.assesment_user?.expire_at">
                    {{ formatDate({ value: assessment.detail?.assesment_user?.expire_at }) }}
                  </div>

                  <div v-else>-</div>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="fs-2 mb-2 d-flex flex-column">
                  <span class="fw-bolder">
                    Divisi:
                  </span>

                  <div>{{ assessment.detail?.pic?.divisi?.nama || '-' }}</div>
                </div>

                <div class="fs-2 mb-2 d-flex flex-column">
                  <span class="fw-bolder">
                    Jabatan:
                  </span>

                  <div>{{ assessment.detail?.pic?.jabatan?.nama || '-' }}</div>
                </div>
              </div>
            </div>
          </template>
        </OverviewCard>
      </div>

      <RespondenCard />

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

    <ModalEditPIC :is-show="isShowModalEditPIC" @close="toggleModalEditPIC" @refresh="handleRefresh" />
    <ModalEditTanggalKadaluarsaPIC :is-show="isShowModalEditTanggalKadaluarsaPIC"
      @close="toggleModalEditTanggalKadaluarsaPIC" @refresh="handleRefresh" />
  </div>
</template>