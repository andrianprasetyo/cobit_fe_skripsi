<script setup>
import { reactive, ref, onMounted, watch, computed } from 'vue'
import debounce from 'lodash.debounce'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import SearchInput from '@/components/Input/SearchInput.vue'
import ModalUploadLaporan from '@/views/project/assessment/components/ModalUploadLaporan.vue'

import AssessmentServices from '@/services/lib/assessment'
import OrganisasiServices from '@/services/lib/organisasi'

import { useToast } from '@/stores/toast'
import { useAlert } from '@/stores/alert'
import { useRouter } from 'vue-router'
import { formatDateMoments } from '@/utils/momentDateFormat'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const toast = useToast()
const alert = useAlert()
const router = useRouter()
const assessmentStore = useAssessmentStore()

/* ---------------------------------- STATE --------------------------------- */
const assessment = reactive({
  loading: false,
  data: [],
  headers: [
    {
      text: 'Aksi',
      value: 'action',
    }, {
      text: 'Nama',
      value: 'nama'
    }, {
      text: 'Organisasi',
      value: 'organisasi',
    }, {
      text: 'Periode Asesmen',
      value: 'start_date',
    }, {
      text: 'Periode Kuesioner',
      value: 'start_date_quisioner',
    }, {
      text: 'Nilai Minimal Target',
      value: 'minimum_target',
    },
    {
      text: 'Status',
      value: 'status',
      sortable: true
    },
  ],
  meta: {
    current_page: 1,
    per_page: 10,
    total: 0,
    total_page: 0
  },
  isShowModalUploadLaporan: false
})

const organisasi = reactive({
  loading: false,
  data: [],
  meta: {
    current_page: 1,
    per_page: 10,
    total: 0,
    total_page: 0
  },
})

const isShowFilterOrganisasi = ref(false)

const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: '',
  sortType: '',
});

const filter = ref({
  search: '',
  organisasi_id: ''
})

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

const isStatusCompleted = computed(() => {
  return value => {
    if (value === 'completed') {
      return true
    } else {
      return false
    }
  }
})

/* --------------------------------- METHODS -------------------------------- */
const resetServerOptions = () => {
  serverOptions.value.page = 1
  serverOptions.value.rowsPerPage = 10
  serverOptions.value.sortBy = ''
  serverOptions.value.sortType = ''
}

const getListAssessment = async ({ limit, page, sortBy, sortType, search, organisasi_id }) => {
  try {
    assessment.loading = true
    const response = await AssessmentServices.getListAssessment({ limit, page, sortBy, sortType, search, organisasi_id })

    if (response) {
      const data = response?.data

      assessment.data = data?.list || []
      assessment.meta = data?.meta
      assessment.loading = false
    }
  } catch (error) {
    assessment.loading = false
    toast.error({ error })
  }
}

const getListOrganisasi = async ({ limit, page, search }) => {
  try {
    organisasi.loading = true
    const response = await OrganisasiServices.getListOrganisasi({ limit, page, search })

    if (response) {
      const data = response?.data

      organisasi.data = data?.list || []
      organisasi.meta = data?.meta
      organisasi.loading = false
    }
  } catch (error) {
    organisasi.loading = false
    toast.error({ error })
  }
}

const toggleModalUploadLaporan = ({ item }) => {
  assessment.isShowModalUploadLaporan = !assessment.isShowModalUploadLaporan

  if (assessment.isShowModalUploadLaporan) {
    assessmentStore.setSeletedAssessment(item)
  }
}

const handleRefresh = () => {
  getListAssessment({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
  })
}

const selesaikanAsessment = async ({ id }) => {
  try {
    const response = await AssessmentServices.setStatusAssessment({ id, status: 'completed' })

    if (response) {
      toast.success({
        title: 'Ubah Status Project',
        text: `Berhasil Mengubah Status Project`
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
  try {
    const response = await AssessmentServices.deleteAssessment({ id })

    if (response) {
      toast.success({
        title: 'Hapus Project',
        text: `Berhasil Menghapus Data Project`
      })
      handleRefresh()

      return response
    }
  } catch (error) {
    toast.error({ error })
    throw error
  }
}

const handleDelete = ({ title, id }) => {
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

const handleNavigateAdd = () => {
  router.push('/project/assessment/add')
}

const handleNavigateEdit = ({ id }) => {
  router.push({ path: `/project/assessment/${id}/edit` })
}

const handleNavigateDetail = ({ id }) => {
  router.push({ path: `/project/assessment/${id}/detail` })
}

const handleNavigateCapability = ({ id, assessment }) => {
  router.push({ path: `/project/assessment/${id}/capability`, query: { assessment } })
}

const handleNavigateSettingTarget = ({ id, assessment }) => {
  router.push({ path: `/project/assessment/${id}/setting-target`, query: { assessment } })
}

const handleNavigateReport = ({ id, assessment }) => {
  router.push({ path: `/project/assessment/${id}/report-assessment`, query: { assessment } })
}

const handleNavigateReportRekapitulasi = ({ id, assessment }) => {
  router.push({ path: `/project/assessment/${id}/report-rekapitulasi`, query: { assessment } })
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

const handleSearchOrganisasi = debounce(async ({ search }) => {
  try {
    const response = await OrganisasiServices.getListOrganisasi({ limit: 10, page: 1, search })

    if (response) {
      const data = response?.data

      organisasi.data = data?.list || []
    }

  } catch (error) {
    toast.error({ error })
  }
}, 500)

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getListAssessment({ limit: serverOptions.value.rowsPerPage, page: serverOptions.value.page })
  getListOrganisasi({ limit: 10, page: 1 })
})

watch(() => [filter.value], value => {
  if (value) {
    resetServerOptions()
  }
}, { deep: true })

watch(() => [serverOptions.value, filter.value], () => {
  getListAssessment({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
    organisasi_id: filter.value.organisasi_id
  })
}, { deep: true })



</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <div class="card-body">
          <div
            class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between mb-7">
            <div class="mb-3 mb-sm-0">
              <h5 class="card-title fw-semibold">Project</h5>
            </div>

            <div
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
              <SearchInput v-model="filter.search" placeholder="Cari Project" />

              <BaseButton :access="['project-add']" @click="handleNavigateAdd"
                class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3" title="Tambah Project">
                <template #icon-left>
                  <TablerIcon size="16" icon="PlusIcon" />
                </template>
              </BaseButton>
            </div>
          </div>

          <DataTable :headers="assessment.headers" :items="assessment.data" :loading="assessment.loading"
            :server-items-length="assessment.meta.total" v-model:server-options="serverOptions" fixed-header>
            <template #header-organisasi="header">
              <div class="filter-column w-100">
                {{ header.item.text }}

                <TablerIcon icon="FilterCogIcon" class="ms-1 cursor-pointer"
                  :class="[isShowFilterOrganisasi ? 'text-secondary' : '']"
                  @click.stop="isShowFilterOrganisasi = !isShowFilterOrganisasi" />

                <div class="filter-menu filter-status-menu mt-2" v-if="isShowFilterOrganisasi">
                  <v-select id="filter-organisasi" @search="(search) => handleSearchOrganisasi({ search })"
                    :filterable="false" :options="organisasi.data" v-model="filter.organisasi_id"
                    :disabled="organisasi.loading" label="nama" :reduce="organisasi => organisasi?.id"
                    :loading="organisasi.loading" placeholder="Cari Organisasi" :select-on-key-codes="[]" :tabindex="4">
                    <template #no-options>
                      Tidak ada Organisasi Ditemukan
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
              </div>
            </template>

            <template #header-status="header">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ header.item.text }}
              </div>
            </template>

            <template #header-minimum_target="header">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ header.item.text }}
              </div>
            </template>

            <template #item-organisasi="item">
              <div class="d-flex w-100">
                {{ item.item?.organisasi?.nama }}
              </div>
            </template>

            <template #item-start_date="item">
              <div v-if="item.item?.start_date" class="d-flex w-100">
                {{ formatDate({ value: item.item?.start_date }) }} s/d {{ formatDate({ value: item.item?.end_date }) }}
              </div>

              <div v-else>
                Belum Ditentukan
              </div>
            </template>

            <template #item-start_date_quisioner="item">
              <div v-if="item.item?.start_date_quisioner" class="d-flex w-100">
                {{ formatDate({ value: item.item?.start_date_quisioner }) }} s/d {{ formatDate({
                  value:
                    item.item?.end_date_quisioner
                }) }}
              </div>

              <div v-else>
                Belum Ditentukan
              </div>
            </template>

            <template #item-minimum_target="item">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ item.item?.minimum_target || 0 }}
              </div>
            </template>

            <template #item-status="item">
              <div class="d-flex justify-content-center align-items-center w-100">
                <span class="badge rounded-pill font-medium text-capitalize fw-bold"
                  :class="classStatus(item?.item?.status)">
                  {{ item?.item?.status }}
                </span>
              </div>
            </template>

            <template #item-action="item">
              <div class="d-flex align-items-center">
                <BaseButton v-tooltip="`Lihat Detail Project ${item.item?.nama || ''}`"
                  @click="handleNavigateDetail({ id: item?.item?.id })" class="btn btn-icon">
                  <template #icon-left>
                    <TablerIcon icon="EyeIcon" />
                  </template>
                </BaseButton>

                <BaseButton v-tooltip="`Lihat Report Rekapitulasi Project ${item.item?.nama || ''}`"
                  @click="handleNavigateReportRekapitulasi({ id: item?.item?.id, assessment: item.item?.nama })"
                  class="btn btn-icon">
                  <template #icon-left>
                    <TablerIcon icon="DeviceDesktopAnalyticsIcon" />
                  </template>
                </BaseButton>

                <div class="dropdown dropstart">
                  <BaseButton v-tooltip="`Lihat Aksi Lain`" class="btn btn-icon" data-bs-toggle="dropdown"
                    id="dropdownMenuButton" aria-expanded="false">
                    <template #icon-left>
                      <TablerIcon icon="DotsIcon" />
                    </template>
                  </BaseButton>

                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <!-- <li>
                      <BaseButton @click="handleNavigateDetail({ id: item?.item?.id })"
                        class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                        <template #icon-left>
                          <TablerIcon icon="EyeIcon" />
                          <span class="ms-2">
                            Lihat Detail Project
                          </span>
                        </template>
                      </BaseButton>
                    </li> -->

                    <li>
                      <BaseButton @click="handleNavigateReport({ id: item?.item?.id, assessment: item.item?.nama })"
                        class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                        <template #icon-left>
                          <TablerIcon icon="ChartDotsIcon" />
                          <span class="ms-2">
                            Lihat Report Berdasarkan Target
                          </span>
                        </template>
                      </BaseButton>
                    </li>

                    <!-- <li>
                      <BaseButton
                        @click="handleNavigateReportRekapitulasi({ id: item?.item?.id, assessment: item.item?.nama })"
                        class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                        <template #icon-left>
                          <TablerIcon icon="ChartGridDotsIcon" />
                          <span class="ms-2">
                            Lihat Report Rekapitulasi
                          </span>
                        </template>
                      </BaseButton>
                    </li> -->

                    <template v-if="!isStatusCompleted(item?.item?.status)">
                      <li>
                        <hr class="dropdown-divider">
                      </li>
                      <li>
                        <BaseButton :access="['project-capability']"
                          @click="handleNavigateCapability({ id: item?.item?.id, assessment: item.item?.nama })"
                          class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                          <template #icon-left>
                            <TablerIcon icon="ClipboardTextIcon" />
                            <span class="ms-2">
                              Atur Kapabilitas
                            </span>
                          </template>
                        </BaseButton>
                      </li>
                      <li>
                        <BaseButton :access="['project-target']"
                          @click="handleNavigateSettingTarget({ id: item?.item?.id, assessment: item.item?.nama })"
                          class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                          <template #icon-left>
                            <TablerIcon icon="TargetArrowIcon" />
                            <span class="ms-2">
                              Setting Target
                            </span>
                          </template>
                        </BaseButton>
                      </li>
                      <li>
                        <BaseButton :access="['project-edit']" @click="handleNavigateEdit({ id: item?.item?.id })"
                          class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                          <template #icon-left>
                            <TablerIcon icon="EditIcon" />
                            <span class="ms-2">
                              Edit Project
                            </span>
                          </template>
                        </BaseButton>
                      </li>
                      <li>
                        <BaseButton :access="['project-edit']" @click="toggleModalUploadLaporan({ item: item?.item })"
                          class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                          <template #icon-left>
                            <TablerIcon icon="UploadIcon" />
                            <span class="ms-2">
                              Upload Laporan Project
                            </span>
                          </template>
                        </BaseButton>
                      </li>
                      <li>
                        <BaseButton :access="['project-edit']"
                          @click="handleSelesaikanAssessment({ title: item?.item?.nama, id: item?.item?.id })"
                          class="dropdown-item d-flex align-items-center gap-3 cursor-pointer text-success">
                          <template #icon-left>
                            <TablerIcon icon="CheckboxIcon" />
                            <span class="ms-2">
                              Selesaikan Project
                            </span>
                          </template>
                        </BaseButton>
                      </li>
                      <!-- <li>
                        <BaseButton class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                          <template #icon-left>
                            <TablerIcon icon="ClipboardDataIcon" />
                            <span class="ms-2">
                              Lihat Hasil Quisioner
                            </span>
                          </template>
                        </BaseButton>
                      </li> -->
                      <li>
                        <hr class="dropdown-divider">
                      </li>
                      <li>
                        <BaseButton :access="['project-delete']"
                          @click="handleDelete({ title: item?.item?.nama, id: item?.item?.id })"
                          class="dropdown-item d-flex align-items-center gap-3 cursor-pointer text-danger">
                          <template #icon-left>
                            <TablerIcon icon="TrashIcon" />
                            <span class="ms-2">
                              Hapus
                            </span>
                          </template>
                        </BaseButton>
                      </li>
                    </template>
                  </ul>
                </div>
              </div>
            </template>
          </DataTable>
        </div>
      </div>
    </section>

    <ModalUploadLaporan :is-show="assessment.isShowModalUploadLaporan" @close="toggleModalUploadLaporan({ item: null })"
      @refresh="handleRefresh" />
  </div>
</template>