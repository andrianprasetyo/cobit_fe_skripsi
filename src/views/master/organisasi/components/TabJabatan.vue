<script setup>
import { reactive, ref, watch, onMounted } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import SearchInput from '@/components/Input/SearchInput.vue'
import ModalJabatan from '@/views/master/organisasi/components/ModalJabatan.vue'

import OrganisasiServices from '@/services/lib/organisasi'

import { useAlert } from '@/stores/alert'
import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'

const alert = useAlert()
const toast = useToast()
const route = useRoute()

/* ---------------------------------- STATE --------------------------------- */
const jabatan = reactive({
  loading: false,
  data: [],
  headers: [{
    text: 'Nama',
    value: 'nama',
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
  },
  isShowModal: false,
  isOnEdit: false,
  selectedJabatan: null
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
const getListJabatan = async ({ limit, page, sortBy, sortType, search, organisasi_id }) => {
  try {
    jabatan.loading = true
    const response = await OrganisasiServices.getListJabatan({ limit, page, sortBy, sortType, search, organisasi_id })

    if (response) {
      const data = response?.data

      jabatan.data = data?.list || []
      jabatan.meta = data?.meta
      jabatan.loading = false
    }
  } catch (error) {
    jabatan.loading = false
    toast.error({ error })
  }
}

const handleRefresh = () => {
  getListJabatan({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
    organisasi_id: route.params?.id
  })
}


const deleteJabatan = async ({ id }) => {
  try {
    const response = await OrganisasiServices.deleteJabatan({ id })

    if (response) {
      toast.success({
        title: 'Hapus Jabatan',
        text: `Berhasil Menghapus Data Jabatan`
      })
      handleRefresh()

      return response
    }
  } catch (error) {
    toast.error({ error })
    throw error
  }
}

const handleDeleteJabatan = ({ title, id }) => {
  alert.info({
    title: `Apakah Anda Yakin untuk Menghapus ${title}`
  }).then(async (result) => {
    if (result.isConfirmed) {
      alert.loading()
      try {
        const response = await deleteJabatan({ id })

        if (response) {
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
      }
    }
  })
}

const handleShowModalEdit = ({ item }) => {
  jabatan.selectedJabatan = item
  jabatan.isOnEdit = true
  jabatan.isShowModal = true
}

const toggleModalJabatan = () => {
  jabatan.isShowModal = !jabatan.isShowModal

  if (!jabatan.isShowModal) {
    jabatan.selectedDivisi = null
    jabatan.isOnEdit = false
  }
}

onMounted(() => {
  getListJabatan({ limit: serverOptions.value.rowsPerPage, page: serverOptions.value.page, organisasi_id: route.params?.id })
})

watch(() => [serverOptions.value, filter.value], () => {
  getListJabatan({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
    organisasi_id: route.params?.id
  })
}, { deep: true })

</script>

<template>
  <div class="card">
    <div class="card-body">
      <div
        class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between mb-7">
        <div class="mb-3 mb-sm-0">
          <h5 class="card-title fw-semibold">Jabatan</h5>
        </div>

        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <SearchInput v-model="filter.search" placeholder="Cari Jabatan" />

          <BaseButton @click="toggleModalJabatan" class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3"
            title="Tambah Jabatan">
            <template #icon-left>
              <TablerIcon size="16" icon="PlusIcon" />
            </template>
          </BaseButton>
        </div>
      </div>

      <DataTable :headers="jabatan.headers" :items="jabatan.data" :loading="jabatan.loading"
        :server-items-length="jabatan.meta.total" v-model:server-options="serverOptions" fixed-header>
        <template #item-action="item">
          <div class="dropdown dropstart">
            <TablerIcon icon="DotsIcon" class="text-muted cursor-pointer" data-bs-toggle="dropdown"
              id="dropdownMenuButton" aria-expanded="false" />
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <BaseButton @click="handleShowModalEdit({ item: item.item })"
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
                <BaseButton @click="handleDeleteJabatan({ title: item.item?.nama, id: item.item?.id })"
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

    <ModalJabatan :is-show="jabatan.isShowModal" :is-on-edit="jabatan.isOnEdit"
      :selected-jabatan="jabatan.selectedJabatan" @close="toggleModalJabatan" @refresh="handleRefresh" />
  </div>
</template>