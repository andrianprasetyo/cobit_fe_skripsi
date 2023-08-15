<script setup>
import { reactive, onMounted, watch, computed, ref } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import SearchInput from '@/components/Input/SearchInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'

import UsersServices from '@/services/lib/users'
import RolesServices from '@/services/lib/roles'
import { useToast } from '@/stores/toast';

import statusUserType from '@/data/statusUserType.json'


const toast = useToast()

/* ---------------------------------- STATE --------------------------------- */
const users = reactive({
  loading: false,
  data: [],
  headers: [{
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
  }, {
    text: 'Action',
    value: 'action'
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

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getListUsers({ limit: serverOptions.value.rowsPerPage, page: serverOptions.value.page })
  getListRoles()
})

watch(() => [serverOptions.value, filter], () => {
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
          <div class="d-sm-flex d-block align-items-center justify-content-between mb-7">
            <div class="mb-3 mb-sm-0">
              <h5 class="card-title fw-semibold">Daftar Users</h5>
              <!-- <p class="card-subtitle mb-0">Yang Terdaftar</p> -->
            </div>
            <SearchInput :v-model="filter.search" placeholder="Cari Users" />
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

            <template #item-action>
              <div class="dropdown dropstart">
                <TablerIcon icon="DotsIcon" class="text-muted cursor-pointer" data-bs-toggle="dropdown"
                  id="dropdownMenuButton" aria-expanded="false" />

                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <BaseButton class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                      <template #icon-left>
                        <TablerIcon icon="EditIcon" />

                        <span class="ms-2">
                          Edit
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