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
    text: 'Aksi',
    value: 'action'
  }, {
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

const resetServerOptions = () => {
  serverOptions.value.page = 1
  serverOptions.value.rowsPerPage = 10
  serverOptions.value.sortBy = ''
  serverOptions.value.sortType = ''
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

const handleNavigateToOverview = ({ id }) => {
  router.push(`/master/design-factor/${id}/overview`)
}

const handleNavigateToEdit = ({ id }) => {
  router.push(`/master/design-factor/${id}/edit`)
}

const handleNavigateToQuestion = ({ id }) => {
  router.push(`/master/design-factor/${id}/question`)
}

const handleNavigateToComponent = ({ id }) => {
  router.push(`/master/design-factor/${id}/component`)
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

watch(() => [filter.value], value => {
  if (value) {
    resetServerOptions()
  }
}, { deep: true })

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
                title="Tambah Design Factor" :access="['master-add']">
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
              <div v-if="item.item?.deskripsi" class="d-flex flex-wrap">
                <div class="width-250px text-break text-wrap" v-html="item.item?.deskripsi" />
              </div>
              <div v-else>
                Belum Ada Deskripsi
              </div>
            </template>

            <template #item-action="item">
              <div class="d-flex align-items-center">
                <BaseButton v-tooltip="`Atur Question ${item.item?.kode || ''}`"
                  @click="handleNavigateToQuestion({ id: item?.item?.id })" class="btn btn-icon">
                  <template #icon-left>
                    <TablerIcon icon="ClipboardListIcon" />
                  </template>
                </BaseButton>

                <BaseButton v-tooltip="`Atur Komponen ${item.item?.kode || ''}`"
                  @click="handleNavigateToComponent({ id: item?.item?.id })" class="btn btn-icon">
                  <template #icon-left>
                    <TablerIcon icon="ListDetailsIcon" />
                  </template>
                </BaseButton>

                <div class="dropdown dropstart">
                  <BaseButton v-tooltip="`Lihat Aksi Lain`" class="btn btn-icon" data-bs-toggle="dropdown"
                    id="dropdownMenuButton" aria-expanded="false">
                    <template #icon-left>
                      <TablerIcon icon="DotsIcon" />
                    </template>
                  </BaseButton>

                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li>
                      <BaseButton @click="handleNavigateToOverview({ id: item?.item?.id })"
                        class="dropdown-item d-flex align-items-center gap-3 cursor-pointer text-primary">
                        <template #icon-left>
                          <TablerIcon icon="EyeIcon" />
                          <span class="ms-2">
                            Overview
                          </span>
                        </template>
                      </BaseButton>
                    </li>

                    <li>
                      <hr class="dropdown-divider">
                    </li>

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
                      <BaseButton @click="handleNavigateToQuestion({ id: item?.item?.id })"
                        class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                        <template #icon-left>
                          <TablerIcon icon="ClipboardListIcon" />
                          <span class="ms-2">
                            Question
                          </span>
                        </template>
                      </BaseButton>
                    </li> -->

                    <!-- <li>
                      <BaseButton @click="handleNavigateToComponent({ id: item?.item?.id })"
                        class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                        <template #icon-left>
                          <TablerIcon icon="ListDetailsIcon" />
                          <span class="ms-2">
                            Komponen
                          </span>
                        </template>
                      </BaseButton>
                    </li> -->

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
              </div>
            </template>
          </DataTable>
        </div>
      </div>
    </section>
  </div>
</template>