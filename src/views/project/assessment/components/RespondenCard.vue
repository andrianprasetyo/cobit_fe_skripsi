<script setup>
import { reactive, computed, onMounted, ref, watch } from 'vue'

import DataTable from '@/components/DataTable/DataTable.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import SearchInput from '@/components/Input/SearchInput.vue'

import ModalInviteResponden from '@/views/project/assessment/components/ModalInviteResponden.vue'
import ModalSummaryGamo from '@/views/project/assessment/components/ModalSummaryGamo.vue'

import AssessmentServices from '@/services/lib/assessment'
import RespondenServices from '@/services/lib/responden'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useToast } from '@/stores/toast'
import { useRoute, useRouter } from 'vue-router'
import { useAlert } from '@/stores/alert'
import { useAppConfig } from '@/stores/appConfig'

const toast = useToast()
const assessmentStore = useAssessmentStore()
const route = useRoute()
const alert = useAlert()
const router = useRouter()
const appConfig = useAppConfig()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const responden = reactive({
  loading: false,
  data: [],
  headers: [{
    text: 'Nama',
    value: 'nama',
  }, {
    text: 'Email',
    value: 'email',
  }, {
    text: 'Divisi',
    value: 'divisi',
  }, {
    text: 'Jabatan',
    value: 'jabatan',
  }, {
    text: 'Status',
    value: 'status'
  }, {
    text: 'Action',
    value: 'action'
  },
  ],
  meta: {
    current_page: 1,
    per_page: 10,
    total: 0,
    total_page: 0
  },
  isShowModalInviteResponden: false,
  isShowModalSummaryGamo: false
})

const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: '',
  sortType: '',
});

const filter = ref({
  search: ''
})

const isAssessmentDone = computed(() => {
  return assessmentStore?.detail?.status === 'completed'
})


const classStatus = computed(() => {
  return value => {
    const isOngoing = value === 'ongoing' || value === 'active'
    const isCompleted = value === 'completed' || value === 'done'
    const isUnstart = value === 'unstart'
    const isPending = value === 'pending' || value === 'diundang'


    if (isOngoing) {
      return 'bg-light-primary text-primary'
    } else if (isCompleted) {
      return 'bg-light-success text-success'
    } else if (isUnstart) {
      return 'bg-light-info text-info'
    } else if (isPending) {
      return 'bg-light-warning text-warning'
    } else {
      return 'bg-dark text-white'
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

const toggleModalInviteResponden = () => {
  responden.isShowModalInviteResponden = !responden.isShowModalInviteResponden

  if (responden.isShowModalInviteResponden) {
    assessmentStore.setSeletedAssessment(assessmentStore.detail)
  }
}

const toggleModalSummaryGamo = () => {
  responden.isShowModalSummaryGamo = !responden.isShowModalSummaryGamo

  if (responden.isShowModalSummaryGamo) {
    assessmentStore.setSeletedAssessment(assessmentStore.detail)
  }
}

const getListResponden = async ({ limit, page, sortBy, sortType, search, assesment_id }) => {
  try {
    responden.loading = true
    const response = await RespondenServices.getListResponden({ limit, page, sortBy, sortType, search, assesment_id })

    if (response) {
      const data = response?.data

      responden.data = data?.list || []
      responden.meta = data?.meta
      responden.loading = false
    }
  } catch (error) {
    responden.loading = false
    toast.error({ error })
  }
}

const reinviteResponden = async ({ id, email }) => {
  try {
    alert.loading()
    const response = await RespondenServices.reinviteResponden({ id })

    if (response) {
      toast.success({
        title: 'Kirim Ulang Undangan Responden',
        text: `Berhasil Mengirim Ulang Undangan ke Responden ${email}`
      })
      alert.instance().close()
    }
  } catch (error) {
    alert.instance().close()
    toast.error({ error })
  }
}

const handleRefresh = () => {
  getListResponden({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
    assesment_id: route.params?.id
  })
}

const deleteResponden = async ({ id }) => {
  try {
    const response = await RespondenServices.deleteResponden({ id })

    if (response) {
      toast.success({
        title: 'Hapus Responden',
        text: `Berhasil Menghapus Data Responden`
      })
      handleRefresh()

      return response
    }
  } catch (error) {
    toast.error({ error })
    throw error
  }
}

const handleDeleteResponden = ({ title, id }) => {
  alert.info({
    title: `Apakah Anda Yakin untuk Menghapus ${title}`
  }).then(async (result) => {
    if (result.isConfirmed) {
      alert.loading()
      try {
        const response = await deleteResponden({ id })

        if (response) {
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
      }
    }
  })
}

const handleNavigateReportGamo = () => {
  router.push({
    path: `/project/assessment/${route.params?.id}/report-gamo`,
    query: { assessment: assessmentStore.detail?.nama }
  })
}

const handleNavigateReportDesignFactor = () => {
  router.push({
    path: `/project/assessment/${route.params?.id}/report-design-factor`,
    query: { assessment: assessmentStore.detail?.nama }
  })
}

const selesaikanAsessment = async ({ id }) => {
  try {
    const response = await AssessmentServices.setStatusAssessment({ id, status: 'completed' })

    if (response) {
      toast.success({
        title: 'Ubah Status Asesmen',
        text: `Berhasil Mengubah Status Asesmen`
      })

      assessmentStore.getDetailAssessment({ id })

      return response
    }

  } catch (error) {
    toast.error({ error })
    throw error
  }
}

const handleSelesaikanAssessment = () => {
  alert.info({
    title: `Apakah Anda Yakin untuk Menyelesaikan Asesmen`
  }).then(async (result) => {
    if (result.isConfirmed) {
      alert.loading()
      try {
        const response = await selesaikanAsessment({ id: route.params?.id })

        if (response) {
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
      }
    }
  })
}

const exportResponden = async () => {
  const url = `${appConfig.app.appHost}responden/users/download?id=${route.params?.id}`
  window.open(url, '_blank');
}

const exportHasilQuisioner = async () => {
  const url = `${appConfig.app.appHost}responden/quisioner/download?id=${route.params?.id}`
  window.open(url, '_blank');
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getListResponden({ limit: 10, page: 1, assesment_id: route.params?.id })
})

watch(() => [filter.value], value => {
  if (value) {
    resetServerOptions()
  }
}, { deep: true })

watch(() => [serverOptions.value, filter.value], () => {
  getListResponden({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
    assesment_id: route.params?.id
  })
}, { deep: true })

</script>

<template>
  <div class="card mt-4">
    <div class="card-body">
      <div
        class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between mb-7">
        <div class="mb-3 mb-sm-0">
          <h5 class="card-title fw-semibold">Responden</h5>
        </div>

        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <SearchInput v-model="filter.search" placeholder="Cari Responden" />

          <BaseButton class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3" title="Action" data-bs-toggle="dropdown"
            id="dropdownMenuMore" aria-expanded="false">
            <template #icon-right>
              <TablerIcon icon="DotsIcon" class="ms-2" />
            </template>
          </BaseButton>

          <ul class="dropdown-menu" aria-labelledby="dropdownMenuMore">
            <li v-if="!isAssessmentDone">
              <BaseButton @click="toggleModalInviteResponden"
                class="dropdown-item d-flex align-items-center gap-3 cursor-pointer" title="Undang Responden">
                <template #icon-left>
                  <TablerIcon size="16" icon="SendIcon" class="me-2" />
                </template>
              </BaseButton>
            </li>

            <li>
              <BaseButton @click="exportResponden" class="dropdown-item d-flex align-items-center gap-3 cursor-pointer"
                title="Export Responden">
                <template #icon-left>
                  <TablerIcon size="16" icon="FileExportIcon" class="me-2" />
                </template>
              </BaseButton>
            </li>

            <li>
              <BaseButton @click="exportHasilQuisioner"
                class="dropdown-item d-flex align-items-center gap-3 cursor-pointer" title="Export Hasil Kuesioner">
                <template #icon-left>
                  <TablerIcon size="16" icon="CheckupListIcon" class="me-2" />
                </template>
              </BaseButton>
            </li>

            <li>
              <hr class="dropdown-divider">
            </li>

            <li>
              <BaseButton :access="['project-canvas']" @click="toggleModalSummaryGamo"
                class="dropdown-item d-flex align-items-center gap-3 cursor-pointer" title="Lihat Summary GAMO">
                <template #icon-left>
                  <TablerIcon size="16" icon="ClipboardDataIcon" class="me-2" />
                </template>
              </BaseButton>
            </li>

            <li>
              <BaseButton @click="handleNavigateReportGamo"
                class="dropdown-item d-flex align-items-center gap-3 cursor-pointer" title="Lihat Report GAMO">
                <template #icon-left>
                  <TablerIcon size="16" icon="ChartHistogramIcon" class="me-2" />
                </template>
              </BaseButton>
            </li>

            <li>
              <BaseButton @click="handleNavigateReportDesignFactor"
                class="dropdown-item d-flex align-items-center gap-3 cursor-pointer" title="Lihat Report Design Factor">
                <template #icon-left>
                  <TablerIcon size="16" icon="ChartDonutIcon" class="me-2" />
                </template>
              </BaseButton>
            </li>

            <template v-if="!isAssessmentDone">
              <li>
                <hr class="dropdown-divider">
              </li>
              <li>
                <BaseButton :access="['project-complete']" @click="handleSelesaikanAssessment"
                  class="dropdown-item d-flex align-items-center gap-3 cursor-pointer text-success">
                  <template #icon-left>
                    <TablerIcon icon="CheckboxIcon" />
                    <span class="ms-2">
                      Selesaikan Project
                    </span>
                  </template>
                </BaseButton>
              </li>
            </template>
          </ul>


        </div>

      </div>

      <DataTable :headers="responden.headers" :items="responden.data" :loading="responden.loading"
        :server-items-length="responden.meta.total" v-model:server-options="serverOptions" fixed-header>

        <template #header-status="header">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ header.item.text }}
          </div>
        </template>

        <template #item-nama="item">
          <div v-if="item.item?.nama" class="d-flex w-100">
            {{ item.item?.nama }}
          </div>

          <div v-else>
            -
          </div>
        </template>

        <template #item-divisi="item">
          <div v-if="item.item?.divisi?.nama" class="d-flex w-100">
            {{ item.item?.divisi?.nama }}
          </div>

          <div v-else>
            -
          </div>
        </template>

        <template #item-jabatan="item">
          <div v-if="item.item?.jabatan?.nama" class="d-flex w-100">
            {{ item.item?.jabatan?.nama }}
          </div>

          <div v-else>
            -
          </div>
        </template>

        <template #item-status="item">
          <div class="d-flex justify-content-center align-items-center w-100">
            <span class="badge rounded-pill font-medium text-capitalize fw-bold" :class="classStatus(item?.item?.status)">
              {{ item?.item?.status }}
            </span>
          </div>
        </template>

        <template #item-action="item">
          <template v-if="!isAssessmentDone">

            <div v-if="item.item?.status === 'diundang'" class="dropdown dropstart">
              <TablerIcon icon="DotsIcon" class="text-muted cursor-pointer" data-bs-toggle="dropdown"
                id="dropdownMenuButton" aria-expanded="false" />
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li>
                  <BaseButton @click="reinviteResponden({ id: item.item?.id, email: item?.item?.email })"
                    class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                    <template #icon-left>
                      <TablerIcon icon="MailIcon" />
                      <span class="ms-2">
                        Kirim Ulang Undangan
                      </span>
                    </template>
                  </BaseButton>
                </li>

                <li>
                  <BaseButton
                    @click="handleDeleteResponden({ title: item.item?.nama || item.item?.email, id: item.item?.id })"
                    class="dropdown-item d-flex align-items-center gap-3 cursor-pointer text-danger">
                    <template #icon-left>
                      <TablerIcon icon="TrashIcon" />
                      <span class="ms-2">
                        Hapus Responden
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
              </ul>
            </div>
          </template>
        </template>
      </DataTable>
    </div>

    <ModalInviteResponden :is-show="responden.isShowModalInviteResponden" @close="toggleModalInviteResponden"
      @refresh="handleRefresh" />

    <ModalSummaryGamo :is-show="responden.isShowModalSummaryGamo" @close="toggleModalSummaryGamo" />
  </div>
</template>