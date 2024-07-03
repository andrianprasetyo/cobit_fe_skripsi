<script setup>
import { reactive, ref, onMounted, watch } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import SearchInput from '@/components/Input/SearchInput.vue'

import DomainServices from '@/services/lib/domain'
import { useToast } from '@/stores/toast'
import { useAlert } from '@/stores/alert'
import { useRouter } from 'vue-router'

const toast = useToast()
const alert = useAlert()
const router = useRouter()


/* ---------------------------------- STATE --------------------------------- */
const domain = reactive({
  loading: false,
  data: [],
  headers: [
    {
      text: 'Aksi',
      value: 'action',
      width: 100,
    }, {
      text: 'Kode',
      value: 'kode',
      sortable: true
    }, {
      text: 'Deskripsi',
      value: 'ket',
    }, {
      text: 'Translate atau Terjemahan',
      value: 'translate',
    },],
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

/* --------------------------------- METHODS -------------------------------- */
const getListDomain = async ({ limit, page, sortBy, sortType, search }) => {
  try {
    domain.loading = true
    const response = await DomainServices.getListDomain({ limit, page, sortBy, sortType, search })

    if (response) {
      const data = response?.data

      domain.data = data?.list || []
      domain.meta = data?.meta
      domain.loading = false
    }
  } catch (error) {
    domain.loading = false
    toast.error({ error })
  }
}

const resetServerOptions = () => {
  serverOptions.value.page = 1
  serverOptions.value.rowsPerPage = 10
  serverOptions.value.sortBy = ''
  serverOptions.value.sortType = ''
}

const handleRefresh = () => {
  getListDomain({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
  })
}

const deleteDomain = async ({ id }) => {
  try {
    const response = await DomainServices.deleteDomain({ id })

    if (response) {
      toast.success({
        title: 'Hapus Governance and Management Objectives (GAMO)',
        text: `Berhasil Menghapus Data Governance and Management Objectives (GAMO)`
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
        const response = await deleteDomain({ id })

        if (response) {
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
      }
    }
  })
}

const handleNavigateToEdit = ({ id }) => {
  router.push(`/master/gamo/${id}/edit`)
}

const handleNavigateToCapabilityLevel = ({ id, title }) => {
  router.push({
    path: `/master/gamo/${id}/capability-level`,
    query: { gamo: title }
  })
}

const handleNavigateToCapabilityAnswer = () => {
  router.push(`/master/gamo/capability-answer`)
}

const handleNavigateAdd = () => {
  router.push('/master/gamo/add')
}


/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getListDomain({ limit: serverOptions.value.rowsPerPage, page: serverOptions.value.page })
})

watch(() => [filter.value], value => {
  if (value) {
    resetServerOptions()
  }
}, { deep: true })

watch(() => [serverOptions.value, filter.value], () => {
  getListDomain({
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
              <h5 class="card-title fw-semibold">Governance and Management Objectives</h5>
            </div>

            <div
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
              <SearchInput v-model="filter.search" placeholder="Cari GAMO" />

              <BaseButton @click="handleNavigateAdd" class="btn btn-primary ms-0 ms-md-3 mt-3 mt-md-0 "
                title="Tambah GAMO" :access="['master-add']">
                <template #icon-left>
                  <TablerIcon size="16" icon="PlusIcon" />
                </template>
              </BaseButton>

              <BaseButton @click="handleNavigateToCapabilityAnswer"
                class="btn btn-outline-primary ms-0 ms-md-3 mt-3 mt-md-0 " title="Atur Jawaban Capability" :access="['master-add', 'master-edit']">
                <template #icon-left>
                  <TablerIcon size="16" icon="AdjustmentsIcon" />
                </template>
              </BaseButton>
            </div>
          </div>

          <DataTable :headers="domain.headers" :items="domain.data" :loading="domain.loading"
            :server-items-length="domain.meta.total" v-model:server-options="serverOptions" fixed-header>
            <template #header-jenis="header">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ header.item.text }}
              </div>
            </template>

            <template #item-ket="item">
              <div v-if="item.item?.ket" class="width-300px text-truncate text-break d-inline-block truncate-html"
                v-html="item.item?.ket" />

              <div v-else class="width-300px text-truncate text-break d-inline-block truncate-html">
                Belum Ada Deskripsi
              </div>
            </template>

            <template #item-translate="item">
              <div v-if="item.item?.translate" class="width-300px text-truncate text-break d-inline-block truncate-html"
                v-html="item.item?.translate" />

              <div v-else class="width-300px text-truncate text-break d-inline-block truncate-html">
                -
              </div>
            </template>

            <template #item-action="item">
              <div class="d-flex align-items-center">
                <BaseButton v-tooltip="`Capability Level ${item.item?.kode || ''}`"
                  @click="handleNavigateToCapabilityLevel({ id: item?.item?.id, title: item.item?.kode })"
                  class="btn btn-icon" :access="['master']">
                  <template #icon-left>
                    <TablerIcon icon="ChartBarIcon" />
                  </template>
                </BaseButton>

                <!-- Dropdown -->
                <div class="dropdown dropstart">
                  <BaseButton v-tooltip="`Lihat Aksi Lain`" class="btn btn-icon" data-bs-toggle="dropdown"
                    id="dropdownMenuButton" aria-expanded="false">
                    <template #icon-left>
                      <TablerIcon icon="DotsIcon" />
                    </template>
                  </BaseButton>

                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li>
                      <BaseButton @click="handleNavigateToEdit({ id: item?.item?.id })"
                        class="dropdown-item d-flex align-items-center gap-3 cursor-pointer" :access="['master-edit']">
                        <template #icon-left>
                          <TablerIcon icon="EditIcon" />
                          <span class="ms-2">
                            Edit
                          </span>
                        </template>
                      </BaseButton>
                    </li>
                    <!-- <li>
                    <BaseButton @click="handleNavigateToCapabilityLevel({ id: item?.item?.id, title: item.item?.kode })"
                      class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                      <template #icon-left>
                        <TablerIcon icon="ChartBarIcon" />
                        <span class="ms-2">
                          Capability Level
                        </span>
                      </template>
                    </BaseButton>
                  </li> -->
                    <li>
                      <hr class="dropdown-divider">
                    </li>
                    <li>
                      <BaseButton @click="handleDelete({ title: item?.item?.kode, id: item?.item?.id })"
                        class="dropdown-item d-flex align-items-center gap-3 cursor-pointer text-danger"
                        :access="['master-delete']">
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
              </div>
            </template>
          </DataTable>

        </div>
      </div>

    </section>

  </div>
</template>