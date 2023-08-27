<script setup>
import { computed, onMounted, onUnmounted } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import OverviewCard from '@/views/project/assessment/components/OverviewCard.vue'
import RespondenCard from '@/views/project/assessment/components/RespondenCard.vue'

import { useRoute, useRouter } from 'vue-router'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const route = useRoute()
const router = useRouter()
const assessment = useAssessmentStore()

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

/* --------------------------------- METHODS -------------------------------- */
const handleBack = () => {
  router.back()
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  assessment.getDetailAssessment({ id: route.params?.id })
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
        <OverviewCard heading="Assessment" :class="['col-12 col-md-12']">
          <template #icon>
            <TablerIcon icon="ClipboardTextIcon" size="36" class="text-primary" />
          </template>

          <template #body>
            <div class="d-flex flex-column">
              <div class="fs-2 mb-1 d-flex flex-column">
                <span>
                  Nama:
                </span>

                <div>{{ assessment.detail?.nama }}</div>
              </div>

              <div class="fs-2 mb-1 d-flex flex-column">
                <span>Deskripsi:</span>

                <div v-html="assessment.detail?.deskripsi || ' - '" />
              </div>

              <div class="fs-2 mb-1 d-flex flex-column">
                <span>Status:</span>

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
            <div class="d-flex flex-column">
              <div class="fs-2 mb-1 d-flex flex-column">
                <span>
                  Nama:
                </span>

                <div>{{ assessment.detail?.organisasi?.nama }}</div>
              </div>

              <div class="fs-2 mb-1 d-flex flex-column">
                <span>Deskripsi:</span>

                <div v-html="assessment.detail?.organisasi?.deskripsi || ' - '" />
              </div>
            </div>
          </template>
        </OverviewCard>
        <OverviewCard heading="PIC">
          <template #icon>
            <TablerIcon icon="UserCheckIcon" size="36" class="text-primary" />
          </template>

          <template #body>
            <div class="d-flex flex-column">
              <div class="fs-2 mb-1 d-flex flex-column">
                <span>
                  Nama:
                </span>

                <div>{{ assessment.detail?.pic?.nama }}</div>
              </div>

              <div class="fs-2 mb-1 d-flex flex-column">
                <span>
                  Email:
                </span>

                <div>{{ assessment.detail?.pic?.email }}</div>
              </div>

              <div class="fs-2 mb-1 d-flex flex-column">
                <span>
                  Divisi:
                </span>

                <div>{{ assessment.detail?.pic?.divisi }}</div>
              </div>

              <div class="fs-2 mb-1 d-flex flex-column">
                <span>
                  Jabatan:
                </span>

                <div>{{ assessment.detail?.pic?.posisi }}</div>
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
  </div>
</template>