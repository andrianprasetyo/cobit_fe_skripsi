<script setup>
import { reactive, ref, onMounted, watch } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import SearchInput from '@/components/Input/SearchInput.vue'

import DesignFactorServices from '@/services/lib/design-factor'
import { useToast } from '@/stores/toast'
import { useAlert } from '@/stores/alert'
import { useRouter } from 'vue-router'

const toast = useToast()
const alert = useAlert()
const router = useRouter()

/* ---------------------------------- STATE --------------------------------- */
const designFactor = reactive({
  loading: false,
  data: [],
  headers: [{
    text: 'Kode',
    value: 'kode',
    sortable: true
  }, {
    text: 'Nama',
    value: 'nama',
    sortable: true,
  }, {
    text: 'Deskripsi',
    value: 'deskripsi',
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
  sortBy: '',
  sortType: '',
});

const filter = ref({
  search: ''
})

/* --------------------------------- METHODS -------------------------------- */
const getListDesignFactor = async ({ limit, page, sortBy, sortType, search }) => {
  try {
    designFactor.loading = true
    const response = await DesignFactorServices.getListDesignFactor({ limit, page, sortBy, sortType, search })

    if (response) {
      const data = response?.data

      designFactor.data = data?.list || []
      designFactor.meta = data?.meta
      designFactor.loading = false
    }
  } catch (error) {
    designFactor.loading = false
    toast.error({ error })
  }
}

const handleRefresh = () => {
  getListDesignFactor({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
  })
}

const deleteDesignFactor = async ({ id }) => {
  try {
    const response = await DesignFactorServices.deleteDesignFactor({ id })

    if (response) {
      toast.success({
        title: 'Hapus Design Factor',
        text: `Berhasil Menghapus Data Design Factor`
      })
      handleRefresh()

      return response
    }
  } catch (error) {
    toast.error({ error })
    throw error
  }
}

const handleNavigateAdd = () => {
  router.push('/master/design-factor/add')
}

const handleNavigateToEdit = ({ id }) => {
  router.push(`/master/design-factor/${id}/edit`)
}

const handleDelete = ({ title, id }) => {
  alert.info({
    title: `Apakah Anda Yakin untuk Menghapus ${title}`
  }).then(async (result) => {
    if (result.isConfirmed) {
      alert.loading()
      try {
        const response = await deleteDesignFactor({ id })

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
  getListDesignFactor({ limit: serverOptions.value.rowsPerPage, page: serverOptions.value.page })
})

watch(() => [serverOptions.value, filter.value], () => {
  getListDesignFactor({
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
              <h5 class="card-title fw-semibold">Design Factor</h5>
            </div>

            <div
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
              <SearchInput v-model="filter.search" placeholder="Cari Design Factor" />

              <BaseButton @click="handleNavigateAdd" class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3"
                title="Tambah Design Factor">
                <template #icon-left>
                  <TablerIcon size="16" icon="PlusIcon" />
                </template>
              </BaseButton>
            </div>
          </div>

          <DataTable :headers="designFactor.headers" :items="designFactor.data" :loading="designFactor.loading"
            :server-items-length="designFactor.meta.total" v-model:server-options="serverOptions" fixed-header>

            <template #header-kode="header">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ header.item?.text }}
              </div>
            </template>

            <template #item-kode="item">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ item.item?.kode }}
              </div>
            </template>

            <template #item-deskripsi="item">
              <div class="width-300px text-truncate" v-html="item.item?.deskripsi" />
            </template>

            <template #item-action="item">
              <div class="dropdown dropstart">
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
                      class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
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