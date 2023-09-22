<script setup>
import { reactive, ref, watch, computed, onMounted } from 'vue'
import debounce from 'lodash.debounce'

import DataTable from '@/components/DataTable/DataTable.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseAlert from '@/components/Alert/BaseAlert.vue'
import ModalOFI from '@/views/project/assessment/report-assessment/components/ModalOFI.vue'

import AssessmentServices from '@/services/lib/assessment'
import AssessmentTargetServices from '@/services/lib/assessment-target'
import DomainServices from '@/services/lib/domain'

import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'
import { useAppConfig } from '@/stores/appConfig'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const toast = useToast()
const route = useRoute()
const appConfig = useAppConfig()
const assessmentStore = useAssessmentStore()

/* ---------------------------------- STATE & COMPUTED --------------------------------- */
const report = reactive({
  loading: false,
  data: [],
  headers: [
    {
      text: 'Aksi',
      value: 'action',
    }, {
      text: 'Governance and Management Objectives',
      value: 'domain',
    }, {
      text: 'Target',
      value: 'target_level',
    }, {
      text: 'Hasil Assesment',
      value: 'hasil_assesment',
    }, {
      text: 'Gap Target',
      value: 'gap_minus',
    }, {
      text: 'Gap Deskripsi',
      value: 'gap_deskripsi',
    }, {
      text: 'Potensi Inisiatif',
      value: 'potensi',
    },
  ],
  meta: {
    current_page: 1,
    per_page: 10,
    total: 0,
    total_page: 0
  },
  isShowModalOfi: false
})

const listTarget = reactive({
  loading: false,
  data: [],
  meta: {
    current_page: 1,
    per_page: 10,
    total: 0,
    total_page: 0
  },
})

const listGamo = reactive({
  loading: false,
  data: []
})

const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: '',
  sortType: '',
});

const filter = ref({
  target_id: '',
  domain_id: ''
})

/*
const isShowFilterTarget = ref(false)
*/

const isShowFilterGamo = ref(false)


const assessmentTitle = computed(() => {
  return route.query?.assessment
})

const assessmentId = computed(() => {
  return route.params?.id
})

/* --------------------------------- METHODS -------------------------------- */
const getReportAssessment = async ({ limit, page, sortBy, sortType, assesment_id, target_id, domain_id }) => {
  try {
    report.loading = true
    const response = await AssessmentServices.getReportAssessment({ limit, page, sortBy, sortType, assesment_id, target_id, domain_id })

    if (response) {
      const data = response?.data

      report.data = data?.list || []
      report.meta = data?.meta
      report.loading = false
    }
  } catch (error) {
    report.loading = false
    toast.error({ error })
  }
}

const handleExport = () => {
  const url = `${appConfig.app.appHost}assesment/report/capability/download?assesment_id=${route.params?.id}${filter.value.target_id ? `&target_id=${filter.value.target_id}` : ''}`
  window.open(url, '_blank');
}

const handleToggleModalOfi = ({ item }) => {
  report.isShowModalOfi = !report.isShowModalOfi

  if (report.isShowModalOfi) {
    assessmentStore.setReportSelectedGamo(item)
  }
}

const resetServerOptions = () => {
  serverOptions.value.page = 1
  serverOptions.value.rowsPerPage = 10
  serverOptions.value.sortBy = ''
  serverOptions.value.sortType = ''
}

const handleSearchListTarget = debounce(async ({ search }) => {
  try {
    listTarget.loading = true
    const response = await AssessmentTargetServices.getListTarget({ limit: 10, page: 1, search, assesment_id: assessmentId.value })

    if (response) {
      const data = response?.data

      listTarget.loading = false
      listTarget.data = data?.list || []
    }

  } catch (error) {
    listTarget.loading = false
    toast.error({ error })
  }
}, 500)

const handleSearchListGamo = debounce(async ({ search }) => {
  try {
    const response = await DomainServices.getListDomain({ search })

    if (response) {
      const data = response?.data

      listGamo.data = data?.list || []
    }
  } catch (error) {
    toast.error({ error })
  }
}, 500)

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  handleSearchListTarget({ search: '' })
  handleSearchListGamo({ search: '' })
  /*
  getReportAssessment({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    target_id: filter.value.target_id,
    domain_id: filter.value.domain_id,
    assesment_id: assessmentId.value
  })
  */
})

watch(() => [filter.value], value => {
  if (value) {
    resetServerOptions()
  }
}, { deep: true })

watch(() => [serverOptions.value, filter.value], () => {
  getReportAssessment({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    target_id: filter.value.target_id,
    domain_id: filter.value.domain_id,
    assesment_id: assessmentId.value
  })
}, { deep: true })

</script>

<template>
  <div>
    <section>
      <div class="card">
        <div class="card-body">
          <div
            class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between mb-7">
            <div class="mb-3 mb-sm-0">
              <h5 class="card-title fw-semibold">Report</h5>
              <p v-if="assessmentTitle" class="card-subtitle mb-0">{{ assessmentTitle }}</p>
            </div>

            <div
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
              <BaseButton @click="handleExport" class="btn btn-outline-primary ms-0 mt-3 mt-md-0 ms-md-3"
                title="Export Report" :disabled="report.loading || !filter.target_id">
                <template #icon-left>
                  <TablerIcon size="16" icon="FileExportIcon" />
                </template>
              </BaseButton>
            </div>
          </div>

          <div class="row mb-3">
            <BaseAlert v-if="!filter.target_id" variant="primary">
              <strong>Perhatian.</strong> Silahkan pilih Target terlebih dahulu
            </BaseAlert>
            <div class="col-12 col-md-12">
              <label class="form-label" for="list-gamo-capability">Report Berdasarkan Target</label>

              <v-select id="filter-target" @search="(search) => handleSearchListTarget({ search })" :filterable="false"
                :options="listTarget.data" v-model="filter.target_id" label="nama" :reduce="state => state?.id"
                placeholder="Pilih Target" :select-on-key-codes="[]">
                <template #no-options>
                  {{ listTarget.loading ? 'Loading...' : 'Tidak ada Target Ditemukan' }}
                </template>

                <template #option="option">
                  <div class="d-flex flex-row align-items-center py-1 width-150px">
                    <span class="me-2 fw-bold">
                      {{ option.nama }} <span class="ms-2" v-if="option?.default">( Default )</span>
                    </span>
                  </div>
                </template>

                <template #selected-option="option">
                  <div class="d-flex flex-row align-items-center py-1 width-150px ">
                    <span class="me-2 fw-bold">
                      {{ option.nama }} <span class="ms-2" v-if="option?.default">( Default )</span>
                    </span>
                  </div>
                </template>
              </v-select>
            </div>
          </div>

          <template v-if="filter.target_id">
            <DataTable :headers="report.headers" :items="report.data" :loading="report.loading"
              :server-items-length="report.meta.total" v-model:server-options="serverOptions" fixed-header>
              <template #header-domain="header">
                <div class="filter-column width-400px align-middle">
                  <div>
                    {{ header.item.text }}
                    <TablerIcon icon="FilterCogIcon" class="ms-1 cursor-pointer"
                      @click.stop="isShowFilterGamo = !isShowFilterGamo"
                      :class="[isShowFilterGamo ? 'text-secondary' : '']" />
                  </div>

                  <div class="filter-menu filter-status-menu mt-2" v-if="isShowFilterGamo">
                    <v-select id="filter-gamo" @search="(search) => handleSearchListGamo({ search })" :filterable="false"
                      :options="listGamo.data" v-model="filter.domain_id" :disabled="listGamo.loading" label="nama"
                      :reduce="state => state?.id" placeholder="Cari GAMO" :select-on-key-codes="[]">
                      <template #no-options>
                        Tidak ada GAMO Ditemukan
                      </template>

                      <template #option="option">
                        <div class="d-flex flex-row align-items-center py-1 width-150px">
                          <span class="me-2 fw-bold text-truncate">
                            {{ option.kode }}
                          </span>
                        </div>
                      </template>

                      <template #selected-option="option">
                        <div class="d-flex flex-row align-items-center py-1 width-150px ">
                          <span class="me-2 fw-bold text-truncate">
                            {{ option.kode }}
                          </span>
                        </div>
                      </template>
                    </v-select>
                  </div>
                </div>
              </template>

              <template #header-target_level="header">
                <div class="d-flex justify-content-center align-items-center w-100">
                  {{ header.item.text }}
                </div>
                <!-- Target With Dropdown -->
                <!-- <div class="filter-column width-200px align-middle">
                  <div>
                    {{ header.item.text }}
  
                    <TablerIcon icon="FilterCogIcon" class="ms-1 cursor-pointer"
                      :class="[isShowFilterTarget ? 'text-secondary' : '']"
                      @click.stop="isShowFilterTarget = !isShowFilterTarget" />
                  </div>
  
                  <div class="filter-menu filter-status-menu mt-2" v-if="isShowFilterTarget">
                    <v-select id="filter-target" @search="(search) => handleSearchListTarget({ search })"
                      :filterable="false" :options="listTarget.data" v-model="filter.target_id"
                      :disabled="listTarget.loading" label="nama" :reduce="state => state?.id" :loading="listTarget.loading"
                      placeholder="Cari Target" :select-on-key-codes="[]">
                      <template #no-options>
                        Tidak ada Target Ditemukan
                      </template>
  
                      <template #option="option">
                        <div class="d-flex flex-row align-items-center py-1 width-150px">
                          <span class="me-2 fw-bold text-truncate">
                            {{ option.nama }}
                          </span>
                        </div>
                      </template>
  
                      <template #selected-option="option">
                        <div class="d-flex flex-row align-items-center py-1 width-150px ">
                          <span class="me-2 fw-bold text-truncate">
                            {{ option.nama }}
                          </span>
                        </div>
                      </template>
                    </v-select>
                  </div>
                </div> -->
              </template>

              <template #header-hasil_assesment="header">
                <div class="d-flex justify-content-center align-items-center w-100">
                  {{ header.item.text }}
                </div>
              </template>

              <template #header-gap_minus="header">
                <div class="d-flex justify-content-center align-items-center w-100">
                  {{ header.item.text }}
                </div>
              </template>

              <template #item-domain="item">
                <div class="d-flex flex-wrap flex-column">
                  <div v-if="item.item?.kode" class="width-250px text-break text-wrap fw-bold" v-html="item.item?.kode" />
                  <div v-if="item.item?.ket" class="width-250px text-break text-wrap" v-html="item.item?.ket" />
                </div>
              </template>

              <template #item-target_level="item">
                <div class="d-flex justify-content-center align-items-center w-100">
                  {{ item.item?.target_level }}
                </div>
              </template>

              <template #item-hasil_assesment="item">
                <div class="d-flex justify-content-center align-items-center w-100">
                  {{ item.item?.hasil_assesment }}
                </div>
              </template>

              <template #item-gap_minus="item">
                <div class="d-flex justify-content-center align-items-center w-100 text-danger">
                  {{ item.item?.gap_minus }}
                </div>
              </template>

              <template #item-gap_deskripsi="item">
                <div class="d-flex flex-wrap">
                  <div v-if="item.item?.gap_deskripsi" class="width-250px text-break text-wrap"
                    :class="{ 'text-danger': item.item?.gap_minus }" v-html="item.item?.gap_deskripsi" />

                  <div v-else>
                    Tidak Ada Gap Deskripsi
                  </div>
                </div>
              </template>

              <template #item-potensi="item">
                <div class="d-flex flex-wrap">
                  <div v-if="item.item?.potensi" class="width-250px text-break text-wrap" v-html="item.item?.potensi" />

                  <div v-else>
                    Tidak Ada Potensi Inisiatif
                  </div>
                </div>
              </template>

              <template #item-action="item">
                <div class="d-flex align-items-center">
                  <div class="dropdown dropstart">
                    <BaseButton v-tooltip="`Lihat Aksi`" class="btn btn-icon" data-bs-toggle="dropdown"
                      id="dropdownMenuButton" aria-expanded="false">
                      <template #icon-left>
                        <TablerIcon icon="DotsIcon" />
                      </template>
                    </BaseButton>

                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <li>
                        <BaseButton @click="handleToggleModalOfi({ item: item.item })"
                          class="dropdown-item d-flex align-items-center gap-3 cursor-pointer text-primary">
                          <template #icon-left>
                            <TablerIcon icon="EyeIcon" />
                            <span class="ms-2">
                              Lihat Opportunity for Improvement
                            </span>
                          </template>
                        </BaseButton>
                      </li>
                    </ul>
                  </div>
                </div>
              </template>
            </DataTable>
          </template>
        </div>
      </div>
    </section>

    <ModalOFI :is-show="report.isShowModalOfi" @close="handleToggleModalOfi" />
  </div>
</template>