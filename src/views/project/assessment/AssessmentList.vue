<script setup>
import { reactive, ref, onMounted, watch, computed } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import SearchInput from '@/components/Input/SearchInput.vue'

import AssessmentServices from '@/services/lib/assessment'
import { useToast } from '@/stores/toast'
import { useAlert } from '@/stores/alert'
import { useRouter } from 'vue-router'
import { formatDateMoments } from '@/utils/momentDateFormat'

const toast = useToast()
const alert = useAlert()
const router = useRouter()

/* ---------------------------------- STATE --------------------------------- */
const assessment = reactive({
  loading: false,
  data: [],
  headers: [{
    text: 'Nama',
    value: 'nama',
    sortable: true
  }, {
    text: 'Organisasi',
    value: 'organisasi',
  }, {
    text: 'Periode Assessment',
    value: 'start_date',
  }, {
    text: 'Status',
    value: 'status',
    sortable: true
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
  }
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
    return formatDateMoments({ value: value?.value, format: 'MMMM YYYY' })
  }
})

/* --------------------------------- METHODS -------------------------------- */
const getListAssessment = async ({ limit, page, sortBy, sortType, search }) => {
  try {
    assessment.loading = true
    const response = await AssessmentServices.getListAssessment({ limit, page, sortBy, sortType, search })

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
        title: 'Hapus Assessment',
        text: `Berhasil Menghapus Data Assessment`
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

const handleNavigateDetail = ({ id }) => {
  router.push({ path: `/project/assessment/${id}/detail` })
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getListAssessment({ limit: serverOptions.value.rowsPerPage, page: serverOptions.value.page })
})

watch(() => [serverOptions.value, filter.value], () => {
  getListAssessment({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
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
              <h5 class="card-title fw-semibold">Assessment</h5>
            </div>

            <div
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
              <SearchInput v-model="filter.search" placeholder="Cari Assessment" />

              <BaseButton @click="handleNavigateAdd" class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3"
                title="Tambah Assessment">
                <template #icon-left>
                  <TablerIcon size="16" icon="PlusIcon" />
                </template>
              </BaseButton>
            </div>
          </div>

          <DataTable :headers="assessment.headers" :items="assessment.data" :loading="assessment.loading"
            :server-items-length="assessment.meta.total" v-model:server-options="serverOptions" fixed-header>
            <template #header-status="header">
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
                {{ formatDate({ value: item.item?.start_date }) }}
              </div>

              <div v-else>
                Belum Ditentukan
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
              <div class="dropdown dropstart">
                <TablerIcon icon="DotsIcon" class="text-muted cursor-pointer" data-bs-toggle="dropdown"
                  id="dropdownMenuButton" aria-expanded="false" />

                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <BaseButton @click="handleNavigateDetail({ id: item?.item?.id })"
                      class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                      <template #icon-left>
                        <TablerIcon icon="EyeIcon" />
                        <span class="ms-2">
                          Detail
                        </span>
                      </template>
                    </BaseButton>
                  </li>
                  <li>
                    <hr class="dropdown-divider">
                  </li>
                  <li>
                    <BaseButton class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                      <template #icon-left>
                        <TablerIcon icon="SendIcon" />
                        <span class="ms-2">
                          Undang Responden
                        </span>
                      </template>
                    </BaseButton>
                  </li>
                  <li>
                    <BaseButton class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                      <template #icon-left>
                        <TablerIcon icon="ClipboardDataIcon" />
                        <span class="ms-2">
                          Lihat Hasil Quisioner
                        </span>
                      </template>
                    </BaseButton>
                  </li>
                  <li>
                    <hr class="dropdown-divider">
                  </li>
                  <li>
                    <BaseButton @click="handleDelete({ title: item?.item?.nama, id: item?.item?.id })"
                      class="dropdown-item d-flex align-items-center gap-3 cursor-pointer text-danger">
                      <template #icon-left>
                        <TablerIcon icon="TrashIcon" />
                        <span class="ms-2">
                          Hapus
                        </span>
                      </template>
                    </BaseButton>
                  </li>
                </ul>
              </div>
            </template>
          </DataTable>
        </div>
      </div>
    </section>
  </div>
</template>