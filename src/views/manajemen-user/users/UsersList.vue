<script setup>
import { reactive, onMounted, watch, computed, ref } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import UsersServices from '@/services/lib/users'
import { useToast } from '@/stores/toast';


const toast = useToast()

/* ---------------------------------- STATE --------------------------------- */
const users = reactive({
  loading: false,
  data: [],
  headers: [{
    text: 'Nama',
    value: 'nama',
  }, {
    text: 'Username',
    value: 'username',
  }, {
    text: 'Email',
    value: 'email',
  }, {
    text: 'Status',
    value: 'status',
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

const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
});



/* -------------------------------- COMPUTED -------------------------------- */
const offset = computed(() => {
  let offsetData = 0;
  offsetData = (users.meta.current_page - 1) * users.meta.per_page
  return offsetData
})

const classBadgeStatus = computed(() => {
  return value => {
    if (value === 'active') {
      return 'bg-light-success text-success'
    } else if (value === 'inactive') {
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
    } else if (value === 'inactive') {
      return 'Tidak Aktif'
    } else {
      return 'Tidak Diketahui'
    }
  }
})

/* --------------------------------- METHODS -------------------------------- */
const getListUsers = async ({ limit, offset }) => {
  try {
    users.loading = true
    const response = await UsersServices.getListUsers({ limit, offset })

    if (response) {
      users.loading = false
      const data = response?.data

      users.data = data?.list || []
      users.meta = data?.meta
    }
  } catch (error) {
    users.loading = false
    toast.error({ error })
  }
}


onMounted(() => {
  getListUsers({ limit: serverOptions.value.rowsPerPage, offset: offset.value })
})

watch(() => serverOptions.value, (value) => {
  users.meta.current_page = value.page
  getListUsers({ limit: value.rowsPerPage, offset: offset.value })
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
          </div>
          <DataTable :headers="users.headers" :items="users.data" :loading="users.loading" header-text-direction="center"
            body-text-direction="center" fixed-header :server-items-length="users.meta.total"
            v-model:server-options="serverOptions">
            <template #item-email="item">
              <span v-if="item?.item?.email">
                {{ item?.item?.email }}
              </span>

              <span v-else class="mb-1 badge rounded-pill bg-dark text-capitalize fw-bold">
                Belum Ada Email
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
                    <a class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                      <TablerIcon icon="EditIcon" />
                      Edit
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                      <TablerIcon icon="TrashIcon" />

                      Delete
                    </a>
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