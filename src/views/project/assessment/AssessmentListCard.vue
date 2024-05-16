<script setup>
import { reactive, ref, onMounted, watch } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import SearchInput from '@/components/Input/SearchInput.vue'
import LoadingSkeleton from '@/components/Loading/LoadingSkeleton.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'
import EasyPagination from '@/components/Pagination/EasyPagination.vue'
import AssessmentListCardItem from '@/views/project/assessment/components/AssessmentListCardItem.vue'

import AssessmentServices from '@/services/lib/assessment'
import OrganisasiServices from '@/services/lib/organisasi'

import { useToast } from '@/stores/toast'
import { useAlert } from '@/stores/alert'
import { useAuth } from '@/stores/auth'

import { useRouter } from 'vue-router'

const toast = useToast()
const alert = useAlert()
const router = useRouter()
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
      text: 'Status',
      value: 'status',
      sortable: true
    },
  ],
  meta: {
    current_page: 1,
    per_page: 12,
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
    per_page: 12,
    total: 0,
    total_page: 0
  },
})

const serverOptions = ref({
  page: 1,
  rowsPerPage: 12,
  sortBy: '',
  sortType: '',
});

const filter = ref({
  search: '',
  organisasi_id: ''
})

/* --------------------------------- METHODS -------------------------------- */
const resetServerOptions = () => {
  serverOptions.value.page = 1
  serverOptions.value.rowsPerPage = 12
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

const handleNavigateAdd = () => {
  router.push('/project/assessment/add')
}

const handleNavigateEdit = ({ id }) => {
  router.push({ path: `/project/assessment/${id}/edit` })
}

const handleNavigateDetail = ({ id }) => {
  router.push({ path: `/project/assessment/${id}/detail` })
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  auth.setMenuToDefault()
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
  <section>
    <div class="card">
      <div class="card-header">
        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <div class="mb-3 mb-sm-0">
            <h5 class="card-title fw-semibold">Project</h5>
            <p class="card-subtitle mb-0">Daftar Project yang terdaftar di Aplikasi</p>
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
      </div>
    </div>

    <div class="row">
      <template v-if="assessment.loading">
        <div class="col-12 col-md-4 mb-3" v-for="(_, index) in Array.from({ length: 12 })"
          :key="`skeleton-project-${index}`">
          <LoadingSkeleton class="skeleton-project" />
        </div>
      </template>

      <template v-else-if="!assessment.loading && Array.isArray(assessment.data) && assessment.data.length">
        <AssessmentListCardItem v-for="item in assessment.data" :key="`assessment-card-list-${item?.id}`"
          :nama="item?.nama" :organisasi="item?.organisasi?.nama" :status="item?.status" :start_date="item?.start_date"
          :end_date="item?.end_date" :start_date_quisioner="item?.start_date_quisioner"
          :end_date_quisioner="item?.end_date_quisioner" :minimum_target="item?.minimum_target"
          :users_count="item?.users_count" @handle-delete="handleDelete({ title: item?.nama, id: item?.id })"
          @handle-edit="handleNavigateEdit({ id: item?.id })" @handle-detail="handleNavigateDetail({ id: item?.id })" />
      </template>

      <template
        v-else-if="!assessment.loading && Array.isArray(assessment.data) && !assessment.data.length && filter.search">
        <div class="card">
          <div class="card-body">
            <NoData :title="`Project dengan kata kunci '${filter.search}' Tidak Ditemukan`" />
          </div>
        </div>
      </template>

      <template v-else>
        <div class="card">
          <div class="card-body">
            <NoData :title="`Belum Ada Data Project`" />
          </div>
        </div>
      </template>

      <div class="col-12">
        <EasyPagination :loading="assessment.loading" :items="assessment.data"
          :server-items-length="assessment.meta.total" :rows-items="[12, 24, 56, 99]"
          v-model:server-options="serverOptions" :filter="filter" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.skeleton-project {
  height: 400px;
  width: 100%;
  border-radius: 1rem;
}
</style>
