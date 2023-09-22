<script setup>
import { reactive, onMounted, watch, computed, ref } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import SearchInput from '@/components/Input/SearchInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'

import UsersServices from '@/services/lib/users'
import RolesServices from '@/services/lib/roles'
import { useToast } from '@/stores/toast'
import { useAlert } from '@/stores/alert'
import { useRouter } from 'vue-router'

import statusUserType from '@/data/statusUserType.json'

const router = useRouter()
const toast = useToast()
const alert = useAlert()

/* ---------------------------------- STATE --------------------------------- */
const users = reactive({
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
    text: 'Username',
    value: 'username',
    sortable: true
  }, {
    text: 'Email',
    value: 'email',
  }, {
    text: 'Status',
    value: 'status',
  }, {
    text: 'Roles',
    value: 'roles'
  }],
  meta: {
    current_page: 1,
    per_page: 10,
    total: 0,
    total_page: 0
  }
})

const roles = reactive({
  loading: false,
  data: []
})

const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: '',
  sortType: '',
});

const isShowFilterStatus = ref(false)
const isShowFilterRole = ref(false)

const filter = ref({
  status: "",
  role: '',
  search: ''
})


/* -------------------------------- COMPUTED -------------------------------- */
const classBadgeStatus = computed(() => {
  return value => {
    if (value === 'active') {
      return 'bg-light-success text-success'
    } else if (value === 'pending') {
      return 'bg-light-warning text-warning'
    } else if (value === 'banned') {
      return 'bg-light-danger text-danger'
    } else {
      return 'bg-dark text-dark'
    }
  }
})

const labelStatus = computed(() => {
  return value => {
    if (value === 'active') {
      return 'Aktif'
    } else if (value === 'pending') {
      return 'Menunggu Aktivasi'
    } else if (value === 'banned') {
      return 'Diblokir'
    } else {
      return 'Tidak Diketahui'
    }
  }
})

/* --------------------------------- METHODS -------------------------------- */
const getListUsers = async ({ limit, page, sortBy, sortType, status, role, search }) => {
  try {
    users.loading = true
    const response = await UsersServices.getListUsers({ limit, page, sortBy, sortType, status, role, search })

    if (response) {
      const data = response?.data

      users.data = data?.list || []
      users.meta = data?.meta
      users.loading = false
    }
  } catch (error) {
    users.loading = false
    toast.error({ error })
  }
}

const getListRoles = async () => {
  try {
    roles.loading = true
    const response = await RolesServices.getListRoles()

    if (response) {
      const data = response?.data

      roles.data = data.list || []
      roles.loading = false
    }
  } catch (error) {
    roles.loading = false
    toast.error({ error })
  }
}

const sendEmailReaktivasi = async ({ id }) => {
  try {
    const response = await UsersServices.sendEmailReaktivasi({ id })

    if (response) {
      toast.success({
        title: 'Kirim Email Reaktivasi',
        text: `Berhasil Mengirim Email Reaktivasi`
      })
      handleRefresh()

      return response
    }
  } catch (error) {
    toast.error({ error })
    throw error
  }
}


const handleRefresh = () => {
  getListUsers({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    status: filter.value.status,
    role: filter.value.role,
    search: filter.value.search
  })
}

const resetServerOptions = () => {
  serverOptions.value.page = 1
  serverOptions.value.rowsPerPage = 10
  serverOptions.value.sortBy = ''
  serverOptions.value.sortType = ''
}

const handleNavigateToEdit = ({ id }) => {
  router.push({ path: `/manajemen-user/users/${id}/edit` })
}

const handleNavigateAdd = () => {
  router.push({ path: "/manajemen-user/users/add" })
}

const handleSendReaktivasi = ({ title, id }) => {
  alert.info({
    title: `Apakah Anda Yakin untuk Mengirim Email Re-Aktivasi ${title}`
  }).then(async (result) => {
    if (result.isConfirmed) {
      alert.loading()
      try {
        const response = await sendEmailReaktivasi({ id })

        if (response) {
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
      }
    }
  })
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getListUsers({ limit: serverOptions.value.rowsPerPage, page: serverOptions.value.page })
  getListRoles()
})

watch(() => [filter.value], value => {
  if (value) {
    resetServerOptions()
  }
}, { deep: true })

watch(() => [serverOptions.value, filter.value], () => {
  getListUsers({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    status: filter.value.status,
    role: filter.value.role,
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
              <h5 class="card-title fw-semibold">Daftar Users</h5>
              <!-- <p class="card-subtitle mb-0">Yang Terdaftar</p> -->
            </div>

            <div
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
              <SearchInput v-model="filter.search" placeholder="Cari Users" />

              <BaseButton @click="handleNavigateAdd" class="btn btn-primary ms-0 ms-md-3 mt-3 mt-md-0 "
                title="Tambah Users">
                <template #icon-left>
                  <TablerIcon size="16" icon="PlusIcon" />
                </template>
              </BaseButton>
            </div>
          </div>
          <DataTable :headers="users.headers" :items="users.data" :loading="users.loading" header-text-direction="center"
            body-text-direction="center" :server-items-length="users.meta.total" v-model:server-options="serverOptions"
            fixed-header>
            <!-- HEADER -->
            <template #header-status="header">
              <div class="filter-column">
                {{ header.item.text }}
                <TablerIcon icon="FilterCogIcon" class="ms-1 cursor-pointer"
                  :class="[isShowFilterStatus ? 'text-secondary' : '']"
                  @click.stop="isShowFilterStatus = !isShowFilterStatus" />
                <div class="filter-menu filter-status-menu mt-2" v-if="isShowFilterStatus">
                  <select class="status-selector form-control" v-model="filter.status" name="status">
                    <option value="">
                      Semua Status
                    </option>
                    <option v-for="item in statusUserType" :key="item?.key" :value="item.value">
                      {{ item?.label }}
                    </option>
                  </select>
                </div>
              </div>
            </template>

            <template #header-roles="header">
              <div class="filter-column">
                {{ header.item.text }}
                <TablerIcon icon="FilterCogIcon" class="ms-1 cursor-pointer"
                  :class="[isShowFilterRole ? 'text-secondary' : '']"
                  @click.stop="isShowFilterRole = !isShowFilterRole" />
                <div class="filter-menu filter-role-menu mt-2" v-if="isShowFilterRole">
                  <select class="role-selector form-control" v-model="filter.role" name="role">
                    <option value="">
                      Semua Role
                    </option>
                    <template v-if="Array.isArray(roles.data) && roles.data.length">
                      <option v-for="item in roles.data" :key="item?.id" :value="item.id">
                        {{ item?.nama }}
                      </option>
                    </template>

                  </select>
                </div>
              </div>
            </template>

            <template #item-email="item">
              <span v-if="item?.item?.email">
                {{ item?.item?.email }}
              </span>

              <span v-else class="mb-1 badge rounded-pill bg-dark text-capitalize fw-bold">
                Belum Ada Email
              </span>
            </template>

            <template #item-roles="item">
              <div v-if="item.item?.roles && Array.isArray(item.item?.roles) && item.item?.roles.length"
                class="d-flex flex-column align-items-center justify-content-center">
                <span v-for="role in item.item.roles" :key="`dropdown-role-${role?.id}`"
                  class="mb-1 badge rounded-pill fw-bold bg-light-primary text-primary">
                  {{ role?.role?.nama }}
                </span>
              </div>

              <span v-else class="mb-1 badge rounded-pill bg-dark text-capitalize fw-bold">
                Belum Ada Role
              </span>
            </template>

            <template #item-status="item">
              <span class="mb-1 badge rounded-pill font-medium text-capitalize fw-bold"
                :class="classBadgeStatus(item?.item?.status)">
                {{ labelStatus(item?.item?.status) }}
              </span>
            </template>

            <template #item-action="item">
              <div class="d-flex align-items-center">
                <BaseButton v-tooltip="`Edit User ${item.item?.username || ''}`"
                  @click="handleNavigateToEdit({ id: item?.item?.id })" class="btn btn-icon">
                  <template #icon-left>
                    <TablerIcon icon="EditIcon" />
                  </template>
                </BaseButton>

                <BaseButton v-if="item.item?.status === 'pending'"
                  v-tooltip="`Kirim Ulang Email Aktivasi ${item.item?.email || ''}`"
                  @click="handleSendReaktivasi({ title: item.item?.email, id: item?.item?.id })" class="btn btn-icon">
                  <template #icon-left>
                    <TablerIcon icon="SendIcon" />
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
                    <li v-if="item.item?.status === 'pending'">
                      <BaseButton @click="handleSendReaktivasi({ title: item.item?.email, id: item?.item?.id })"
                        class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                        <template #icon-left>
                          <TablerIcon icon="SendIcon" />

                          <span class="ms-2">
                            Kirim Ulang Email Aktivasi
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