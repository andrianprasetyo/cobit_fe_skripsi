<script setup>
import { reactive, computed, onMounted, ref, watch } from 'vue'

import DataTable from '@/components/DataTable/DataTable.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import SearchInput from '@/components/Input/SearchInput.vue'
import BaseSwitchInput from '@/components/Input/BaseSwitchInput.vue'
import BaseLightBadge from '@/components/Badge/BaseLightBadge.vue'

import ModalInviteResponden from '@/views/project/assessment/components/ModalInviteResponden.vue'
import ModalSummaryGamo from '@/views/project/assessment/components/ModalSummaryGamo.vue'
import ModalUploadLaporan from '@/views/project/assessment/components/ModalUploadLaporan.vue'
import ModalViewHasilKuesioner from '@/views/project/assessment/components/ModalViewHasilKuesioner.vue'

import RespondenServices from '@/services/lib/responden'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'
import { useAlert } from '@/stores/alert'
import { useAppConfig } from '@/stores/appConfig'
import { useClipboard } from '@vueuse/core'

const toast = useToast()
const assessmentStore = useAssessmentStore()
const route = useRoute()
const alert = useAlert()
const appConfig = useAppConfig()
const { isSupported, copy } = useClipboard()

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
    text: 'Kuesioner Diproses',
    value: 'quesioner_processed'
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
  isOnEditProcessedKuesioner: false,
  isShowModalInviteResponden: false,
  isShowModalSummaryGamo: false,
  isShowModalUploadLaporan: false,
  isShowModalResultKuesioner: false
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

const assessmentId = computed(() => route?.params?.id)

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

const variantRespondenKuesioner = computed(() => {
  return value => {
    if (value) {
      return 'success'
    } else {
      return 'danger'
    }
  }
})

const textRespondenKuesioner = computed(() => {
  return value => {
    if (value) {
      return 'Ya'
    } else {
      return 'Tidak'
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

const toggleModalResultKuesioner = (selectedData) => {
  responden.isShowModalResultKuesioner = !responden.isShowModalResultKuesioner

  if (responden.isShowModalResultKuesioner) {
    assessmentStore.setSelectedResponden(selectedData)
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

const exportResponden = async () => {
  const url = `${appConfig.app.appHost}responden/users/download?id=${route.params?.id}`
  window.open(url, '_blank');
}

const exportHasilQuisioner = async () => {
  const url = `${appConfig.app.appHost}responden/quisioner/download?id=${route.params?.id}`
  window.open(url, '_blank');
}

const handleEditProcessedKuesioner = (value) => {
  responden.isOnEditProcessedKuesioner = value

  if (!value) {
    handleRefresh()
  }
}

const setProcessedKuesioner = async ({ assesment_id, data }) => {
  try {
    const response = await RespondenServices.setProcessedKuesioner({ assesment_id, data })

    if (response) {
      toast.success({
        title: 'Data Kuesioner Responden Terpilih',
        text: `Berhasil Memproses Data Kuesioner Responden yang dipilih`
      })

      handleRefresh()
      responden.isOnEditProcessedKuesioner = false

      return response
    }

  } catch (error) {
    toast.error({ error })
    throw error
  }
}

const handleSetProcessedKuesioner = () => {
  alert.info({
    title: `Apakah Anda Yakin untuk Merubah Data Kuesioner Yang Diproses ?`
  }).then(async (result) => {
    if (result.isConfirmed) {
      alert.loading()
      try {
        const data = [];

        responden.data.map(item => {
          if (item?.status === 'done') {
            data.push({
              id: item?.id,
              quesioner_processed: !!item?.quesioner_processed
            })
          }
        })

        const response = await setProcessedKuesioner({ assesment_id: assessmentId.value, data })

        if (response) {
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
      }
    }
  })
}

const toggleModalUploadLaporan = () => {
  responden.isShowModalUploadLaporan = !responden.isShowModalUploadLaporan

  if (responden.isShowModalUploadLaporan) {
    assessmentStore.setSeletedAssessment(assessmentStore.detail)
  }
}

const handleCopyLinkKuesioner = ({ title, link }) => {
  copy(link).then(() => {
    toast.success({
      title: 'Salink Link Kuesioner',
      text: `Berhasil Menyalin Link Kuesioner ${title}`
    })
  }).catch(() => {
    toast.error({ text: 'Gagal Menyalin Link Kuesioner' })
  })
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
  <div id="responden-table-card" class="card">
    <div class="card-body">
      <div
        class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between mb-7">
        <div class="mb-3 mb-sm-0">
          <h5 class="card-title fw-semibold">Daftar Responden</h5>
        </div>

        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <SearchInput v-model="filter.search" placeholder="Cari Responden" />

          <template v-if="responden.isOnEditProcessedKuesioner">
            <BaseButton class="btn btn-success ms-0 mt-3 mt-md-0 ms-md-3"
              title="Simpan Perubahan Kuesioner Yang Diproses" id="saveProcessedKuesioner"
              @click="handleSetProcessedKuesioner" :access="['project-edit']">
              <template #icon-right>
                <TablerIcon icon="DeviceFloppyIcon" class="ms-2" />
              </template>
            </BaseButton>

            <BaseButton class="btn btn-outline-danger ms-0 mt-3 mt-md-0 ms-md-3" title="Batalkan"
              id="cancelProcessedKuesioner" @click="handleEditProcessedKuesioner(false)" :access="['project-edit']">
              <template #icon-right>
                <TablerIcon icon="XIcon" class="ms-2" />
              </template>
            </BaseButton>
          </template>

          <template v-else>
            <BaseButton class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3" title="Sesuaikan Kuesioner Yang Diproses"
              id="changesProcessedKuesioner" @click="handleEditProcessedKuesioner(true)" :access="['project-edit']">
              <template #icon-right>
                <TablerIcon icon="EditIcon" class="ms-2" />
              </template>
            </BaseButton>
          </template>

          <BaseButton class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3" title="Action" data-bs-toggle="dropdown"
            id="dropdownMenuMore" aria-expanded="false" :access="['project']">
            <template #icon-right>
              <TablerIcon icon="DotsIcon" class="ms-2" />
            </template>
          </BaseButton>

          <ul class="dropdown-menu" aria-labelledby="dropdownMenuMore">
            <li v-if="!isAssessmentDone">
              <BaseButton @click="toggleModalInviteResponden"
                class="dropdown-item d-flex align-items-center gap-3 cursor-pointer" title="Undang Responden"
                :access="['project-invite-responden']">
                <template #icon-left>
                  <TablerIcon size="16" icon="SendIcon" class="me-2" />
                </template>
              </BaseButton>
            </li>

            <li>
              <BaseButton @click="exportResponden" class="dropdown-item d-flex align-items-center gap-3 cursor-pointer"
                title="Export Responden" :access="['project-add', 'project-edit']">
                <template #icon-left>
                  <TablerIcon size="16" icon="FileExportIcon" class="me-2" />
                </template>
              </BaseButton>
            </li>

            <li>
              <BaseButton @click="exportHasilQuisioner"
                class="dropdown-item d-flex align-items-center gap-3 cursor-pointer" title="Export Hasil Kuesioner"
                :access="['project-add', 'project-edit']">
                <template #icon-left>
                  <TablerIcon size="16" icon="CheckupListIcon" class="me-2" />
                </template>
              </BaseButton>
            </li>
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

        <template #header-quesioner_processed="header">
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
            <span class="badge rounded-pill font-medium text-capitalize fw-bold"
              :class="classStatus(item?.item?.status)">
              {{ item?.item?.status }}
            </span>
          </div>
        </template>

        <template #item-quesioner_processed="item">
          <div class="d-flex justify-content-center align-items-center w-100">
            <template v-if="item?.item?.status === 'done'">
              <div v-if="item?.item?.index >= 1 && responden.isOnEditProcessedKuesioner && responden.data?.[item.item.index - 1]">
                <BaseSwitchInput :id="`switch-${item?.item?.nama}-${item?.item?.status}`" :disabled="responden.loading"
                  v-model="responden.data[item.item.index - 1].quesioner_processed" active-text="Diproses"
                  in-active-text="Jangan Diproses" />
              </div>

              <BaseLightBadge v-else :title="textRespondenKuesioner(!!item?.item?.quesioner_processed)"
                :variant="variantRespondenKuesioner(!!item?.item?.quesioner_processed)" />
            </template>
          </div>
        </template>

        <template #item-action="item">
          <div class="d-flex flex-row align-items-center">
            <div v-if="item?.item?.status !== 'done' && isSupported" class="me-2">
              <TablerIcon v-tooltip="`Salin Link Kuesioner ${item?.item?.nama || ''}`" icon="LinkIcon"
                class="text-muted cursor-pointer"
                @click="handleCopyLinkKuesioner({ link: item?.item?.quesioner_link, title: item?.item?.nama || item?.item?.email })" />
            </div>

            <div v-if="item?.item?.status === 'done'" class="me-2">
              <TablerIcon v-tooltip="`Lihat Hasil Kuesioner ${item?.item?.nama || ''}`" icon="CheckupListIcon"
                class="text-muted cursor-pointer" @click="toggleModalResultKuesioner(item?.item)" />
            </div>

            <template v-if="!isAssessmentDone">
              <div v-if="item.item?.status === 'diundang'" class="dropdown dropstart">
                <TablerIcon icon="DotsIcon" class="text-muted cursor-pointer" data-bs-toggle="dropdown"
                  id="dropdownMenuButton" aria-expanded="false" />
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <BaseButton @click="reinviteResponden({ id: item.item?.id, email: item?.item?.email })"
                      class="dropdown-item d-flex align-items-center gap-3 cursor-pointer d-none"
                      :access="['project-edit']">
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
                      class="dropdown-item d-flex align-items-center gap-3 cursor-pointer text-danger"
                      :access="['project-edit']">
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
          </div>
        </template>
      </DataTable>
    </div>

    <ModalInviteResponden :is-show="responden.isShowModalInviteResponden" @close="toggleModalInviteResponden"
      @refresh="handleRefresh" />

    <ModalSummaryGamo :is-show="responden.isShowModalSummaryGamo" @close="toggleModalSummaryGamo" />

    <ModalUploadLaporan :is-show="responden.isShowModalUploadLaporan" @close="toggleModalUploadLaporan"
      @refresh="handleRefresh" />

    <ModalViewHasilKuesioner :is-show="responden.isShowModalResultKuesioner" @close="toggleModalResultKuesioner"
      @refresh="handleRefresh" />
  </div>
</template>