<script setup>
import { reactive, ref, onMounted, watch, computed } from 'vue'
import debounce from 'lodash.debounce'

import DataTable from '@/components/DataTable/DataTable.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import AssessmentServices from '@/services/lib/assessment'
import OrganisasiServices from '@/services/lib/organisasi'

import { useToast } from '@/stores/toast'
import { useAlert } from '@/stores/alert'
import { useAuth } from '@/stores/auth'

import { useRouter, useRoute } from 'vue-router'
import { formatDateMoments } from '@/utils/momentDateFormat'

const toast = useToast()
const alert = useAlert()
const router = useRouter()
const route = useRoute()
const auth = useAuth()

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
      text: 'Total Responden',
      value: 'users_count',
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

const filter = computed(() => ({
  search: route.query?.search,
  organisasi_id: route.query?.organisasi_id
}))

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

const handleRefresh = () => {
  getListAssessment({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
  })
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

const handleNavigateEdit = ({ id }) => {
  router.push({ path: `/project/assessment/${id}/edit` })
}

const handleNavigateDetail = ({ id }) => {
  router.push({ path: `/project/assessment/${id}/dashboard` })
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
  auth.setMenuToDefault()
  getListAssessment({ limit: serverOptions.value.rowsPerPage, page: serverOptions.value.page, search: filter.value.search, organisasi_id: filter.value.organisasi_id })
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
  <section>
    <div class="card">
      <div class="card-body">
        <DataTable :headers="assessment.headers" :items="assessment.data" :loading="assessment.loading"
          :server-items-length="assessment.meta.total" v-model:server-options="serverOptions" fixed-header>
          <template #header-organisasi="header">
            <div class="filter-column w-100">
              {{ header.item.text }}

              <TablerIcon icon="FilterCogIcon" class="ms-1 cursor-pointer d-none"
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
                    <div class="d-flex flex-row align-items-center py-1">
                      <span class="me-2 fw-bold text-wrap">
                        {{ option.nama }}
                      </span>
                    </div>
                  </template>

                  <template #selected-option="option">
                    <div class="d-flex flex-row align-items-center py-1">
                      <span class="me-2 fw-bold text-wrap">
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

          <template #header-users_count="header">
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

          <template #item-users_count="item">
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

              <BaseButton :access="['project-edit']" @click="handleNavigateEdit({ id: item?.item?.id })"
                class="btn btn-icon">
                <template #icon-left>
                  <TablerIcon icon="EditIcon" />
                </template>
              </BaseButton>

              <BaseButton :access="['project-delete']"
                @click="handleDelete({ title: item?.item?.nama, id: item?.item?.id })" class="btn btn-icon">
                <template #icon-left>
                  <TablerIcon icon="TrashIcon" class="text-danger" />
                </template>
              </BaseButton>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </section>
</template>
