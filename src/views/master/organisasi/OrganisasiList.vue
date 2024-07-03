<script setup>
import { reactive, ref, onMounted, watch } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import SearchInput from '@/components/Input/SearchInput.vue'

import OrganisasiServices from '@/services/lib/organisasi'

/*
import { useAlert } from '@/stores/alert'
*/
import { useToast } from '@/stores/toast'
import { useRouter } from 'vue-router'

/*
const alert = useAlert()
*/

const toast = useToast()
const router = useRouter()

/* ---------------------------------- STATE --------------------------------- */
const organisasi = reactive({
  loading: false,
  data: [],
  headers: [{
    text: 'Aksi',
    value: 'action',
    width: 150
  }, {
    text: 'Nama',
    value: 'nama',
    sortable: true
  }, {
    text: 'Deskripsi',
    value: 'deskripsi',
  },
  ],
  meta: {
    current_page: 1,
    per_page: 10,
    total: 0,
    total_page: 0
  },
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
const getListOrganisasi = async ({ limit, page, sortBy, sortType, search }) => {
  try {
    organisasi.loading = true
    const response = await OrganisasiServices.getListOrganisasi({ limit, page, sortBy, sortType, search })

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

/*
const handleRefresh = () => {
  getListOrganisasi({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
  })
}


const deleteOrganisasi = async ({ id }) => {
  try {
    const response = await OrganisasiServices.deleteOrganisasi({ id })

    if (response) {
      toast.success({
        title: 'Hapus Organisasi',
        text: `Berhasil Menghapus Data Organisasi`
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
        const response = await deleteOrganisasi({ id })

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

const resetServerOptions = () => {
  serverOptions.value.page = 1
  serverOptions.value.rowsPerPage = 10
  serverOptions.value.sortBy = ''
  serverOptions.value.sortType = ''
}

const handleNavigateAdd = () => {
  router.push('/master/organisasi/add')
}

const handleNavigateEdit = ({ id }) => {
  router.push({ path: `/master/organisasi/${id}/edit` })
}

const handleNavigateDivisiDanJabatan = ({ id, organisasi }) => {
  router.push({
    path: `/master/organisasi/${id}/divisi-dan-jabatan`,
    query: {
      organisasi
    }
  })
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getListOrganisasi({ limit: serverOptions.value.rowsPerPage, page: serverOptions.value.page })
})

watch(() => [filter.value], value => {
  if (value) {
    resetServerOptions()
  }
}, { deep: true })

watch(() => [serverOptions.value, filter.value], () => {
  getListOrganisasi({
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
              <h5 class="card-title fw-semibold">Organisasi</h5>
            </div>

            <div
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
              <SearchInput v-model="filter.search" placeholder="Cari Organisasi" />

              <BaseButton @click="handleNavigateAdd" class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3"
                title="Tambah Organisasi" :access="['master-organisasi-add']">
                <template #icon-left>
                  <TablerIcon size="16" icon="PlusIcon" />
                </template>
              </BaseButton>
            </div>
          </div>

          <DataTable :headers="organisasi.headers" :items="organisasi.data" :loading="organisasi.loading"
            :server-items-length="organisasi.meta.total" v-model:server-options="serverOptions" fixed-header>

            <template #item-deskripsi="item">
              <div v-if="item?.item?.deskripsi" class="d-flex flex-wrap">
                <div class="width-250px text-break text-wrap" v-html="item.item?.deskripsi" />
              </div>
              <div v-else>
                Belum Ada Deskripsi
              </div>
            </template>

            <template #item-action="item">
              <div class="d-flex align-items-center">
                <BaseButton v-tooltip="`Edit Organisasi ${item.item?.nama || ''}`"
                  @click="handleNavigateEdit({ id: item?.item?.id })" class="btn btn-icon" :access="['master-organisasi-edit']">
                  <template #icon-left>
                    <TablerIcon icon="EditIcon" />
                  </template>
                </BaseButton>

                <BaseButton v-tooltip="`Lihat Daftar Divisi & Jabatan ${item.item?.nama || ''}`"
                  @click="handleNavigateDivisiDanJabatan({ id: item?.item?.id })" class="btn btn-icon"
                  :access="['master-organisasi']">
                  <template #icon-left>
                    <TablerIcon icon="SubtaskIcon" />
                  </template>
                </BaseButton>

                <!-- <div class="dropdown dropstart">
                  <BaseButton v-tooltip="`Lihat Aksi Lain`" class="btn btn-icon" data-bs-toggle="dropdown"
                    id="dropdownMenuButton" aria-expanded="false">
                    <template #icon-left>
                      <TablerIcon icon="DotsIcon" />
                    </template>
                  </BaseButton>

                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li>
                      <BaseButton @click="handleNavigateEdit({ id: item?.item?.id })"
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
                      <hr class="dropdown-divider">
                    </li>

                    <li>
                      <BaseButton
                        @click="handleNavigateDivisiDanJabatan({ id: item?.item?.id, organisasi: item.item?.nama })"
                        class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                        <template #icon-left>
                          <TablerIcon icon="SubtaskIcon" />
                          <span class="ms-2">
                            Lihat Daftar Divisi & Jabatan
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