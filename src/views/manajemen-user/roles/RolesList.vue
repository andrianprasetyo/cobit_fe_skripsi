<script setup>
import { reactive, onMounted, watch, ref, computed } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import SearchInput from '@/components/Input/SearchInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'

import RolesServices from '@/services/lib/roles'

import { useToast } from '@/stores/toast';
import { useRouter } from 'vue-router'

/*
import { useAlert } from '@/stores/alert'
*/

const router = useRouter()
const toast = useToast()

/*
const alert = useAlert()
*/

/* ---------------------------------- STATE --------------------------------- */
const roles = reactive({
  loading: false,
  data: [],
  headers: [{
    text: 'Aksi',
    value: 'action'
  }, {
    text: 'Nama',
    value: 'nama',
    sortable: true
  }, {
    text: 'Kode',
    value: 'code',
    sortable: true
  }, {
    text: 'Deskripsi',
    value: 'deskripsi',
    sortable: true
  }, {
    text: 'Status',
    value: 'aktif',
    sortable: true
  }],
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

/* -------------------------------- COMPUTED -------------------------------- */
const classBadgeStatus = computed(() => {
  return value => {
    if (value) {
      return 'bg-light-success text-success'
    } else {
      return 'bg-light-danger text-danger'
    }
  }
})

const labelStatus = computed(() => {
  return value => {
    if (value) {
      return 'Aktif'
    } else {
      return 'Tidak Aktif'
    }
  }
})

/* --------------------------------- METHODS -------------------------------- */
const getListRoles = async ({ limit, page, sortBy, sortType, search }) => {
  try {
    roles.loading = true
    const response = await RolesServices.getListRoles({ limit, page, sortBy, sortType, search })

    if (response) {
      const data = response?.data

      roles.data = data.list || []
      roles.meta = data?.meta
      roles.loading = false
    }
  } catch (error) {
    roles.loading = false
    toast.error({ error })
  }
}

const resetServerOptions = () => {
  serverOptions.value.page = 1
  serverOptions.value.rowsPerPage = 10
  serverOptions.value.sortBy = ''
  serverOptions.value.sortType = ''
}

/*
const handleRefresh = () => {
  getListRoles({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
  })
}

const deleteRoles = async ({ id }) => {
  try {
    const response = await RolesServices.deleteRoles({ id })

    if (response) {
      toast.success({
        title: 'Hapus Roles',
        text: `Berhasil Menghapus Data Roles`
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
        const response = await deleteRoles({ id })

        if (response) {
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
      }
    }
  })
}
*/

const handleNavigateToEdit = ({ id }) => {
  router.push({ path: `/manajemen-user/roles/${id}/edit` })
}

/*
const handleNavigateAdd = () => {
  router.push({ path: "/manajemen-user/roles/add" })
}
*/


/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getListRoles({ limit: serverOptions.value.rowsPerPage, page: serverOptions.value.page })
})

watch(() => [filter.value], value => {
  if (value) {
    resetServerOptions()
  }
}, { deep: true })

watch(() => [serverOptions.value, filter.value], () => {
  getListRoles({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search
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
              <h5 class="card-title fw-semibold">Daftar Roles</h5>
            </div>

            <div
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
              <SearchInput v-model="filter.search" placeholder="Cari Roles" />

              <!-- <BaseButton @click="handleNavigateAdd" class="btn btn-primary ms-0 ms-md-3 mt-3 mt-md-0 "
                title="Tambah Roles">
                <template #icon-left>
                  <TablerIcon size="16" icon="PlusIcon" />
                </template>
              </BaseButton> -->
            </div>
          </div>

          <DataTable :headers="roles.headers" :items="roles.data" :loading="roles.loading"
            :server-items-length="roles.meta.total" v-model:server-options="serverOptions" fixed-header>
            <template #header-aktif="header">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ header.item.text }}
              </div>
            </template>

            <template #item-deskripsi="item">
              <div v-if="item.item?.deskripsi" class="width-300px text-truncate text-break d-inline-block truncate-html"
                v-html="item.item?.deskripsi" />

              <div v-else class="width-300px text-truncate text-break d-inline-block truncate-html">
                Belum Ada Deskripsi
              </div>
            </template>

            <template #item-aktif="item">
              <div class="d-flex justify-content-center align-items-center w-100">
                <span class="mb-1 badge rounded-pill text-capitalize fw-bold"
                  :class="[classBadgeStatus(item.item?.aktif)]">
                  {{ labelStatus(item.item?.aktif) }}
                </span>
              </div>
            </template>

            <template #item-action="item">
              <div class="d-flex align-items-center">
                <BaseButton v-tooltip="`Edit Role ${item.item?.nama || ''}`"
                  @click="handleNavigateToEdit({ id: item?.item?.id })" class="btn btn-icon" :access="['manuser-edit']">
                  <template #icon-left>
                    <TablerIcon icon="EditIcon" />
                  </template>
                </BaseButton>

                <!-- <div class="dropdown dropstart">
                  <TablerIcon icon="DotsIcon" class="text-muted cursor-pointer" data-bs-toggle="dropdown"
                    id="dropdownMenuButton" aria-expanded="false" />

                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li>
                      <BaseButton @click="handleNavigateToEdit({ id: item?.item?.id })"
                        class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                        <template #icon-left>
                          <TablerIcon icon="EditIcon" />

                          <span class="ms-2">
                            Edit
                          </span>
                        </template>

                      </BaseButton>
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
                </div> -->
              </div>
            </template>
          </DataTable>
        </div>
      </div>
    </section>
  </div>
</template>