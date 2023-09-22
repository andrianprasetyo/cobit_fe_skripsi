<script setup>
import { reactive, ref, onMounted, watch, computed } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import SearchInput from '@/components/Input/SearchInput.vue'

import GroupAnswerServices from '@/services/lib/group-answer'
import { useToast } from '@/stores/toast'
import { useAlert } from '@/stores/alert'
import { useRouter } from 'vue-router'

import groupAnswerType from '@/data/groupAnswerType.json'


const toast = useToast()
const alert = useAlert()
const router = useRouter()

/* ---------------------------------- STATE --------------------------------- */
const groupAnswer = reactive({
  loading: false,
  data: [],
  headers: [
    {
      text: 'Aksi',
      value: 'action',
      width: 150
    }, {
      text: 'Nama Grup Jawaban',
      value: 'nama',
      sortable: true
    }, {
      text: 'Jenis',
      value: 'jenis',
      sortable: true
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

/* -------------------------------- COMPUTED -------------------------------- */
const labelType = computed(() => {
  return value => {
    const selected = groupAnswerType.find(item => item?.value === value)

    return selected?.label || "Tidak Diketahui"
  }
})

const classType = computed(() => {
  return value => {
    const selected = groupAnswerType.find(item => item?.value === value)

    return selected?.class || "bg-dark text-white"
  }
})


/* --------------------------------- METHODS -------------------------------- */
const getListGroupAnswer = async ({ limit, page, sortBy, sortType, search }) => {
  try {
    groupAnswer.loading = true
    const response = await GroupAnswerServices.getListGroupAnswer({ limit, page, sortBy, sortType, search })

    if (response) {
      const data = response?.data

      groupAnswer.data = data?.list || []
      groupAnswer.meta = data?.meta
      groupAnswer.loading = false
    }
  } catch (error) {
    groupAnswer.loading = false
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
  getListGroupAnswer({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
  })
}

const deleteGroupAnswer = async ({ id }) => {
  try {
    const response = await GroupAnswerServices.deleteGroupAnswer({ id })

    if (response) {
      toast.success({
        title: 'Hapus Grup Jawaban',
        text: `Berhasil Menghapus Data Grup Jawaban`
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
        const response = await deleteGroupAnswer({ id })

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
  router.push(`/master/grup-jawaban/${id}/edit`)
}

const handleNavigateAdd = () => {
  router.push('/master/grup-jawaban/add')
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getListGroupAnswer({ limit: serverOptions.value.rowsPerPage, page: serverOptions.value.page })
})

watch(() => [filter.value], value => {
  if (value) {
    resetServerOptions()
  }
}, { deep: true })

watch(() => [serverOptions.value, filter.value], () => {
  getListGroupAnswer({
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
              <h5 class="card-title fw-semibold">Grup Jawaban</h5>
            </div>

            <div
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
              <SearchInput v-model="filter.search" placeholder="Cari Grup Jawaban" />

              <BaseButton @click="handleNavigateAdd" class="btn btn-primary ms-0 ms-md-3 mt-3 mt-md-0 "
                title="Tambah Grup Jawaban">
                <template #icon-left>
                  <TablerIcon size="16" icon="PlusIcon" />
                </template>
              </BaseButton>
            </div>
          </div>

          <DataTable :headers="groupAnswer.headers" :items="groupAnswer.data" :loading="groupAnswer.loading"
            :server-items-length="groupAnswer.meta.total" v-model:server-options="serverOptions" fixed-header>
            <template #header-jenis="header">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ header.item.text }}
              </div>
            </template>

            <template #item-jenis="item">
              <div class="d-flex justify-content-center align-items-center w-100">
                <span class="mb-1 badge rounded-pill font-medium text-capitalize fw-bold"
                  :class="classType(item?.item?.jenis)">
                  {{ labelType(item?.item?.jenis) }}
                </span>
              </div>

            </template>

            <template #item-action="item">
              <BaseButton v-tooltip="`Edit ${item.item?.nama || ''}`" @click="handleNavigateToEdit({ id: item?.item?.id })"
                class="btn btn-icon">
                <template #icon-left>
                  <TablerIcon icon="EditIcon" />
                </template>
              </BaseButton>

              <BaseButton v-tooltip="`Hapus ${item.item?.nama || ''}`"
                @click="handleDelete({ title: item?.item?.nama, id: item?.item?.id })" class="btn btn-icon">
                <template #icon-left>
                  <TablerIcon icon="TrashIcon" />
                </template>
              </BaseButton>

              <!-- Dropdown -->
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
            </template>
          </DataTable>
        </div>
      </div>
    </section>
  </div>
</template>