<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/stores/toast'
import { useAppConfig } from '@/stores/appConfig'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BasicDataTable from '@/components/DataTable/BasicDataTable.vue'
import LoadingSkeleton from '@/components/Loading/LoadingSkeleton.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import RespondenServices from '@/services/lib/responden'

const props = defineProps({
  isShowBreadCrumb: {
    type: Boolean,
    default: true
  },
})

const route = useRoute()
const toast = useToast()
const router = useRouter()
const appConfig = useAppConfig()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const resultKuesioner = reactive({
  loading: false,
  data: {
    header: [],
    kuesioner: []
  }
})

const assessmentId = computed(() => route.params?.id)

/* --------------------------------- METHODS -------------------------------- */
const getResultKuesioner = async ({ assesment_id, assesment_users_id }) => {
  try {
    resultKuesioner.loading = true

    const response = await RespondenServices.getResultKuesioner({ assesment_id, assesment_users_id })

    if (response) {
      const data = response.data
      resultKuesioner.data.header = data?.header || []
      resultKuesioner.data.kuesioner = data?.quesioner || []
      resultKuesioner.loading = false
    }
  } catch (error) {
    resultKuesioner.loading = false
    toast.error({ error })
  }
}

const handleBack = () => {
  router.push("/project/assessment")
}

const exportHasilQuisioner = async () => {
  const url = `${appConfig.app.appHost}responden/quisioner/download?id=${assessmentId.value}`
  window.open(url, '_blank');
}


/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getResultKuesioner({ assesment_id: assessmentId.value })
})
</script>

<template>
  <div>
    <BreadCrumb v-if="props.isShowBreadCrumb" />

    <section>
      <template v-if="resultKuesioner.loading">
        <LoadingSkeleton class="skeleton-card-result" />
      </template>
      <div v-else class="card">
        <div class="card-header">
          <div
            class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
            <div class="mb-3 mb-sm-0">
              <h5 class="card-title fw-semibold">Hasil Kuesioner</h5>
              <p class="card-subtitle mb-0">{{ props.subtitle }}</p>
              <slot />
            </div>

            <div
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
              <BaseButton @click="exportHasilQuisioner" class="btn btn-outline-primary" title="Export Hasil Kuesioner"
                :disabled="resultKuesioner.loading" :access="['project']">
                <template #icon-right>
                  <TablerIcon size="16" icon="FileExportIcon" />
                </template>
              </BaseButton>

              <!-- <BaseButton @click="handleNavigateToAdjustSummaryGamo" class="btn btn-primary ms-0 ms-md-3 mt-3 mt-md-0"
                title="Adjust / Sesuaikan GAMO">
                <template #icon-right>
                  <TablerIcon size="16" icon="AdjustmentsIcon" />
                </template>
              </BaseButton> -->
            </div>
          </div>
        </div>
        <div class="card-body">
          <BasicDataTable class="rounded" class-header="position-sticky top-0 bg-white"
            :column-length="resultKuesioner.data.header.length || 4" :is-loading="resultKuesioner.loading"
            :data="resultKuesioner.data.kuesioner">
            <template #header>
              <tr>
                <th class="width-75px text-center align-content-center  sticky-col bg-primary text-white" scope="col"
                  rowspan="3">No</th>
                <th class="width-150px text-center align-content-center sticky-col bg-primary text-white" scope="col"
                  rowspan="3">Nama</th>
                <th class="width-150px text-center align-content-center sticky-col bg-primary text-white" scope="col"
                  rowspan="3">Jabatan</th>
                <th class="width-150px text-center align-content-center sticky-col bg-primary text-white" scope="col"
                  rowspan="3">Divisi</th>

                <template v-if="Array.isArray(resultKuesioner.data.header) && resultKuesioner.data.header.length">
                  <template v-for="(headerItem, headerIndex) in resultKuesioner.data.header"
                    :key="`header-${headerItem?.id}-${headerItem?.nama}-${headerItem?.sorting}-${headerIndex}`">
                    <th class="text-center align-content-center bg-light-primary text-primary" colspan="2">
                      <div class="width-500px text-break text-wrap" v-html="headerItem?.pertanyaan" />
                    </th>
                  </template>
                </template>
              </tr>
              <template v-if="Array.isArray(resultKuesioner.data.header) && resultKuesioner.data.header.length">
                <tr>
                  <template v-for="(headerItem, headerIndex) in resultKuesioner.data.header"
                    :key="`header-${headerItem?.id}-${headerItem?.nama}-${headerItem?.sorting}-${headerIndex}`">
                    <th class="text-center bg-light text-primary" colspan="2">
                      <p class="mb-1 fst-italic fw-light">{{ headerItem?.kode }}</p>
                      <span>
                        {{ headerItem?.nama }}
                      </span>

                    </th>
                  </template>
                </tr>

                <tr>
                  <template v-for="(headerItem, headerIndex) in resultKuesioner.data.header"
                    :key="`header-${headerItem?.id}-${headerItem?.nama}-${headerItem?.sorting}-${headerIndex}`">
                    <th class="text-center bg-light text-primary" colspan="1">
                      Jawaban
                    </th>
                    <th class="text-center bg-light text-primary" colspan="1">
                      Bobot
                    </th>
                  </template>
                </tr>
              </template>
            </template>

            <template #body>
              <template v-if="Array.isArray(resultKuesioner.data.kuesioner) && resultKuesioner.data.kuesioner.length">
                <template v-for="(kuesionerItem, kuesionerIndex) in resultKuesioner.data.kuesioner"
                  :key="`kuesioner-${kuesionerItem?.id}-${kuesionerItem?.nama}-${kuesionerIndex}`">
                  <tr>
                    <td class="width-75px text-center align-content-center sticky-col">{{ kuesionerIndex + 1 }}</td>
                    <td class="width-150px text-center align-content-center sticky-col">
                      {{ kuesionerItem?.nama_responden }}
                    </td>
                    <td class="width-150px text-center align-content-center sticky-col">
                      {{ kuesionerItem?.nama_jabatan }}
                    </td>
                    <td class="width-150px text-center align-content-center sticky-col">
                      {{ kuesionerItem?.nama_divisi }}
                    </td>

                    <template
                      v-if="Array.isArray(kuesionerItem?.jawaban_quesioner) && kuesionerItem?.jawaban_quesioner?.length">
                      <template v-for="(jawabanKuesioner, indexJawabanKuesioner) in kuesionerItem?.jawaban_quesioner"
                        :key="`jawaban-kuesioner-${jawabanKuesioner?.jawaban?.id}-${indexJawabanKuesioner}`">
                        <td class="text-center align-content-center">
                          {{ jawabanKuesioner?.jawaban?.jawaban }}
                        </td>
                        <td class="text-center align-content-center bg-light text-primary">
                          {{ jawabanKuesioner?.jawaban?.bobot }}
                        </td>
                      </template>
                    </template>
                  </tr>
                </template>
              </template>
              <template v-else>
                <tr>
                  <td :colspan="resultKuesioner.data.header.length || 4" class="text-center">
                    Tidak Ada Data Kuesioner
                  </td>
                </tr>
              </template>
            </template>
          </BasicDataTable>
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
  </div>
</template>

<style scoped>
.skeleton-card-result {
  height: 100vh;
  width: 100%;
  border-radius: 0.5rem;
}

.table-container {
  overflow-x: auto;
}

table {
  border-collapse: collapse;
  width: 100%;
}

.sticky-col {
  position: -webkit-sticky;
  /* For Safari */
  position: sticky;
  left: 0;
  background-color: white;
  /* Ensures the sticky columns have a background */
  z-index: 1;
  /* Ensure it sits above other columns */
}

/* Adjust left positions for each sticky column */
th.sticky-col:nth-child(1) {
  left: 0;
}

th.sticky-col:nth-child(2) {
  left: 75px;
  /* Adjust based on the actual width of the first column */
}

th.sticky-col:nth-child(3) {
  left: 225px;
  /* Adjust based on the actual width of the first two columns */
}

th.sticky-col:nth-child(4) {
  left: 375px;
  /* Adjust based on the actual width of the first three columns */
}

/* Adjust left positions for each sticky column */
td.sticky-col:nth-child(1) {
  left: 0;
}

td.sticky-col:nth-child(2) {
  left: 75px;
  /* Adjust based on the actual width of the first column */
}

td.sticky-col:nth-child(3) {
  left: 225px;
  /* Adjust based on the actual width of the first two columns */
}

td.sticky-col:nth-child(4) {
  left: 375px;
  /* Adjust based on the actual width of the first three columns */
}
</style>