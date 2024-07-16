<script setup>
import { reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAlert } from '@/stores/alert'
import { useToast } from '@/stores/toast'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue';
import BaseButton from '@/components/Button/BaseButton.vue';
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue';

import AssessmentServices from '@/services/lib/assessment'

const route = useRoute()
const router = useRouter()
const alert = useAlert()
const toast = useToast()

const props = defineProps({
  isShowBreadCrumb: {
    type: Boolean,
    default: true
  },
  isShowBackButton: {
    type: Boolean,
    default: true
  }
})

/* ---------------------------------- STATE --------------------------------- */
const recalculateProject = reactive({
  loadingSubmit: false,
  commands: [
    /*
    {
      sorting: 1,
      command: "setAssesmentHasilAvg",
      title: "Hasil Rata-rata Nilai Responden",
      description: 'Kalkulasi Ulang Hasil Rata-rata Nilai Responden yang telah selesai'
    },
    */
    {
      sorting: 1,
      command: "assesmentDfWeight",
      title: "Nilai Bobot Design Faktor",
      description: 'Kalkulasi Ulang Nilai Bobot Design Faktor berdasarkan hasil responden yang telah selesai'
    },
    {
      sorting: 2,
      command: "setCanvasStep2Value",
      title: "Nilai Canvas Step 2",
      description: 'Kalkulasi Ulang Nilai Canvas dari Design Faktor 1, 2, 3, dan 4 berdasarkan hasil responden yang telah selesai'
    },
    {
      sorting: 3,
      command: "setCanvasStep3Value",
      title: "Nilai Canvas Step 3",
      description: 'Kalkulasi Ulang Nilai Canvas dari Design Faktor 5, 6, 7, 8, 9 dan 10 berdasarkan hasil responden yang telah selesai'
    },
    {
      sorting: 4,
      command: "updateCanvasAdjust",
      title: "Nilai Canvas Hasil Adjustment",
      description: 'Kalkulasi Ulang Nilai Canvas dari Hasil Adjustment atau Penyesuaian yang telah disepakati'
    },
    {
      sorting: 5,
      command: "generateTargetLevelDomain",
      title: "Perhitungan Target Level Domain Kapabilitas Asesmen",
      description: 'Kalkulasi Ulang Perhitungan Target Level Domain Kapabilitas Asesmen'
    }
  ],
})

const assessmentId = computed(() => route.params?.id)

/* --------------------------------- METHODS -------------------------------- */
const executeCommand = async ({ method, assesment_id }) => {
  try {
    const response = await AssessmentServices.recalculateAssessment({ method, assesment_id })

    if (response) {
      toast.success({
        title: 'Eksekusi Perintah Kalkulasi',
        text: `Berhasil Mengeksekusi Perintah Kalkulasi`
      })

      return response
    }
  } catch (error) {
    toast.error({ error })
    throw error
  }
}

const handleExecuteCommand = async ({ title, command, sorting }) => {
  alert.info({
    title: `Apakah Anda Yakin untuk mengeksekusi perintah '${title}'`
  }).then(async (result) => {
    if (result.isConfirmed) {
      alert.loading()
      try {
        let anotherCommandMustBeExcecuted = [];

        recalculateProject.commands.map(item => {
          if (item?.sorting < sorting) {
            anotherCommandMustBeExcecuted.push(item?.command)
          }
        });

        let payload = {
          assesment_id: assessmentId.value,
          method: [
            command,
            ...anotherCommandMustBeExcecuted,
          ],
        }

        const response = await executeCommand(payload)

        if (response) {
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
      }
    }
  })
}

const handleBack = () => {
  router.push("/project/assessment")
}
</script>

<template>
  <div>
    <BreadCrumb v-if="props.isShowBreadCrumb" />

    <section>
      <div class="card">
        <div class="card-body">
          <template v-if="Array.isArray(recalculateProject?.commands) && recalculateProject?.commands.length">
            <div v-for="command in recalculateProject.commands" :key="`command-${command?.sorting}`"
              class="d-flex flex-column flex-md-row align-items-center justify-content-md-between mb-4">
              <div class="d-flex align-items-center gap-3">
                <div class="text-bg-light rounded-1 p-6 d-flex align-items-center justify-content-center">
                  <TablerIcon icon="SettingsBoltIcon" class="text-dark d-block fs-7" size="22" />
                </div>
                <div>
                  <h5 class="fs-4 fw-semibold">{{ command?.title }}</h5>
                  <p class="mb-0">{{ command.description }}</p>
                </div>
              </div>
              <div>
                <BaseButton
                  @click="handleExecuteCommand({ title: command.title, command: command.command, sorting: command.sorting })"
                  class="btn btn-outline-primary mt-2 mt-md-0" title="Jalankan">
                  <template #icon-left>
                    <TablerIcon icon="PlayerPlayIcon" />
                  </template>
                </BaseButton>
              </div>
            </div>
          </template>

        </div>
      </div>

      <div v-if="props.isShowBackButton" class="card mt-4">
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