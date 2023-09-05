<script setup>
import { reactive, ref, watch, onMounted } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import SearchInput from '@/components/Input/SearchInput.vue'

import ModalDivisi from '@/views/master/organisasi/components/ModalDivisi.vue'

import OrganisasiServices from '@/services/lib/organisasi'

import { useAlert } from '@/stores/alert'
import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'

const alert = useAlert()
const toast = useToast()
const route = useRoute()

/* ---------------------------------- STATE --------------------------------- */
const divisi = reactive({
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
  selectedDivisi: null
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
const getListDivisi = async ({ limit, page, sortBy, sortType, search, organisasi_id }) => {
  try {
    divisi.loading = true
    const response = await OrganisasiServices.getListDivisi({ limit, page, sortBy, sortType, search, organisasi_id })

    if (response) {
      const data = response?.data

      divisi.data = data?.list || []
      divisi.meta = data?.meta
      divisi.loading = false
    }
  } catch (error) {
    divisi.loading = false
    toast.error({ error })
  }
}

const handleRefresh = () => {
  getListDivisi({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
    organisasi_id: route.params?.id
  })
}

const deleteDivisi = async ({ id }) => {
  try {
    const response = await OrganisasiServices.deleteDivisi({ id })

    if (response) {
      toast.success({
        title: 'Hapus Divisi',
        text: `Berhasil Menghapus Data Divisi`
      })
      handleRefresh()

      return response
    }
  } catch (error) {
    toast.error({ error })
    throw error
  }
}

const handleDeleteDivisi = ({ title, id }) => {
  alert.info({
    title: `Apakah Anda Yakin untuk Menghapus ${title}`
  }).then(async (result) => {
    if (result.isConfirmed) {
      alert.loading()
      try {
        const response = await deleteDivisi({ id })

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
  divisi.selectedDivisi = item
  divisi.isOnEdit = true
  divisi.isShowModal = true
}

const toggleModalDivisi = () => {
  divisi.isShowModal = !divisi.isShowModal

  if (!divisi.isShowModal) {
    divisi.selectedDivisi = null
    divisi.isOnEdit = false
  }
}

/* ---------------------------------- HOOKS --------------------------------- */

onMounted(() => {
  getListDivisi({ limit: serverOptions.value.rowsPerPage, page: serverOptions.value.page, organisasi_id: route.params?.id })
})

watch(() => [serverOptions.value, filter.value], () => {
  getListDivisi({
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
          <h5 class="card-title fw-semibold">Divisi</h5>
        </div>

        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <SearchInput v-model="filter.search" placeholder="Cari Divisi" />

          <BaseButton @click="toggleModalDivisi" class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3" title="Tambah Divisi">
            <template #icon-left>
              <TablerIcon size="16" icon="PlusIcon" />
            </template>
          </BaseButton>
        </div>
      </div>

      <DataTable :headers="divisi.headers" :items="divisi.data" :loading="divisi.loading"
        :server-items-length="divisi.meta.total" v-model:server-options="serverOptions" fixed-header>
        <template #item-nama="item">
          <div>
            <div class="cursor-pointer" data-bs-toggle="collapse" :href="`#collapse-${item.item?.id}`">
              {{ item.item?.nama }}
            </div>

            <div class="collapse mt-3" :id="`collapse-${item.item?.id}`">
              <template v-if="Array.isArray(item.item?.jabatans) && item.item?.jabatans?.length">
                <hr />
                <h6 class="fw-semibold mb-0 text-dark mb-3">Daftar Jabatan {{ item.item?.nama }} :</h6>
                <ol>
                  <li v-for="(jabatan, index) in item.item.jabatans" :key="`jabatan-${index}-${jabatan?.id}`">{{
                    jabatan?.nama }}</li>
                </ol>
              </template>

            </div>
          </div>

        </template>

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
                <BaseButton @click="handleDeleteDivisi({ title: item.item?.nama, id: item.item?.id })"
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

    <ModalDivisi :is-show="divisi.isShowModal" :is-on-edit="divisi.isOnEdit" :selected-divisi="divisi.selectedDivisi"
      @close="toggleModalDivisi" @refresh="handleRefresh" />
  </div>
</template>