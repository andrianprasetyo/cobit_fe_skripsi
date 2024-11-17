<script setup>
import { reactive, ref, onMounted, watch, computed } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import BaseSelect from '@/components/Select/BaseSelect.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import SearchInput from '@/components/Input/SearchInput.vue'

import CapabilityLevelServices from '@/services/lib/capability-level'

import capabilityLevelJSON from '@/data/capabilityLevel.json'

import { useToast } from '@/stores/toast'
import { useAlert } from '@/stores/alert'
import { useRouter, useRoute } from 'vue-router'

const toast = useToast()
const alert = useAlert()
const router = useRouter()
const route = useRoute()

/* ---------------------------------- STATE --------------------------------- */
const capabilityLevel = reactive({
  loading: false,
  data: [],
  headers: [
    {
      text: 'Urutan',
      value: 'urutan',
      sortable: true
    },
    {
      text: 'Aksi',
      value: 'action',
    },
    {
      text: 'Sub Kode GAMO',
      value: 'subkode'
    }, {
      text: 'Capability Level',
      value: 'level'
    }, {
      text: 'Activities',
      value: 'kegiatan',
    }, {
      text: 'Translate',
      value: 'translate',
    },
    {
      text: 'Kebutuhan Dokumen',
      value: 'Guidelines'
    },
    {
      text: 'Weight',
      value: 'bobot',
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

const isShowFilterLevel = ref(false)

const filter = ref({
  search: '',
  level: ''
})

const idGamo = computed(() => {
  return route.params?.id
})

const titleGamo = computed(() => {
  return route.query?.gamo
})

/* --------------------------------- METHODS -------------------------------- */
const getListCapabilityLevel = async ({ limit, page, sortBy, sortType, search, domain_id, level }) => {
  try {
    capabilityLevel.loading = true
    const response = await CapabilityLevelServices.getListCapabilityLevel({ limit, page, sortBy, sortType, search, domain_id, level })

    if (response) {
      const data = response?.data

      capabilityLevel.data = data?.list || []
      capabilityLevel.meta = data?.meta
      capabilityLevel.loading = false
    }
  } catch (error) {
    capabilityLevel.loading = false
    toast.error({ error })
  }
}

const handleRefresh = () => {
  getListCapabilityLevel({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
    level: filter.value.level,
    domain_id: idGamo.value
  })
}

const deleteCapabilityLevel = async ({ id }) => {
  try {
    const response = await CapabilityLevelServices.deleteCapabilityLevel({ id })

    if (response) {
      toast.success({
        title: 'Hapus Capability Level',
        text: `Berhasil Menghapus Data Capability Level`
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
        const response = await deleteCapabilityLevel({ id })

        if (response) {
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
      }
    }
  })
}

const handleNavigateAdd = () => {
  router.push({
    path: `/master/gamo/${idGamo.value}/capability-level/add`,
    query: { gamo: titleGamo.value }
  })
}

const handleNavigateToEdit = ({ id, title }) => {
  router.push({
    path: `/master/gamo/${idGamo.value}/capability-level/${id}/edit`,
    query: { gamo: title }
  })
}

const resetServerOptions = () => {
  serverOptions.value.page = 1
  serverOptions.value.rowsPerPage = 10
  serverOptions.value.sortBy = ''
  serverOptions.value.sortType = ''
}


/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getListCapabilityLevel({ limit: serverOptions.value.rowsPerPage, page: serverOptions.value.page, domain_id: idGamo.value })
})

watch(() => [filter.value], value => {
  if (value) {
    resetServerOptions()
  }
}, { deep: true })

watch(() => [serverOptions.value, filter.value], () => {
  getListCapabilityLevel({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
    level: filter.value.level,
    domain_id: idGamo.value,
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
              <h5 class="card-title fw-semibold mb-2">Capability Level</h5>
              <p v-if="titleGamo" class="card-subtitle mb-0">{{ titleGamo }}</p>
            </div>

            <div
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
              <SearchInput v-model="filter.search" placeholder="Cari Capability Level" />

              <BaseButton @click="handleNavigateAdd" class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3"
                title="Tambah Capability Level" :access="['master-add']">
                <template #icon-left>
                  <TablerIcon size="16" icon="PlusIcon" />
                </template>
              </BaseButton>
            </div>
          </div>

          <DataTable :headers="capabilityLevel.headers" :items="capabilityLevel.data" :loading="capabilityLevel.loading"
            :server-items-length="capabilityLevel.meta.total" v-model:server-options="serverOptions" fixed-header
            :show-index="false">

            <template #header-level="header">
              <div class="filter-column width-150px">
                {{ header.item?.text }}

                <TablerIcon icon="FilterCogIcon" class="ms-1 cursor-pointer"
                  :class="[isShowFilterLevel ? 'text-secondary' : '']"
                  @click.stop="isShowFilterLevel = !isShowFilterLevel" />

                <div class="filter-menu filter-status-menu mt-2" v-if="isShowFilterLevel">
                  <BaseSelect v-model="filter.level" default-option="Semua Level" :options="capabilityLevelJSON">
                  </BaseSelect>
                </div>
              </div>
            </template>

            <template #header-subkode="header">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ header.item?.text }}
              </div>
            </template>

            <template #header-bobot="header">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ header.item?.text }}
              </div>
            </template>

            <template #header-actions="header">
              <div class="d-flex justify-content-center align-items-center">
                {{ header.item?.text }}
              </div>
            </template>

            <template #item-urutan="item">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ item.item?.urutan }}
              </div>
            </template>

            <template #item-level="item">
              <div class="d-flex justify-content-center align-items-center w-100">
                Level {{ item.item?.level }}
              </div>
            </template>

            <template #item-subkode="item">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ item.item?.subkode }}
              </div>
            </template>

            <template #item-kegiatan="item">
              <div v-if="item.item?.kegiatan" class="d-flex flex-wrap">
                <div class="width-250px text-break text-wrap" v-html="item.item?.kegiatan" />
              </div>
              <div v-else>
                Belum Ada Activities
              </div>
            </template>

            <template #item-translate="item">
              <div v-if="item.item?.translate" class="d-flex flex-wrap">
                <div class="width-250px text-break text-wrap" v-html="item.item?.translate" />
              </div>
              <div v-else>
                Belum Ada Translate
              </div>
            </template>

            <template #item-guidelines="item">
              <div v-if="item.item?.guidelines" class="d-flex flex-wrap">
                <div class="width-250px text-break text-wrap" v-html="item.item?.guidelines" />
              </div>
              <div v-else>
                -
              </div>
            </template>

            <template #item-bobot="item">
              <div class="d-flex justify-content-center align-items-center w-100">
                {{ item.item?.bobot }}
              </div>
            </template>

            <template #item-action="item">
              <div class="d-flex align-items-center">
                <BaseButton v-tooltip="`Edit ${item.item?.subkode || ''}`"
                  @click="handleNavigateToEdit({ id: item.item?.id, title: item.item?.subkode })" class="btn btn-icon"
                  :access="['master-edit']">
                  <template #icon-left>
                    <TablerIcon icon="EditIcon" />
                  </template>
                </BaseButton>

                <BaseButton v-tooltip="`Hapus ${item.item?.subkode || ''}`"
                  @click="handleDelete({ title: item.item?.domain?.kode, id: item.item?.id })" class="btn btn-icon"
                  :access="['master-delete']">
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
                      <BaseButton @click="handleNavigateToEdit({ id: item.item?.id, title: item.item?.subkode })"
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
                      <BaseButton @click="handleDelete({ title: item.item?.domain?.kode, id: item.item?.id })"
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