<script setup>
import { reactive, ref, onMounted, watch, computed } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import SearchInput from '@/components/Input/SearchInput.vue'

import AssessmentTargetServices from '@/services/lib/assessment-target'

import { useToast } from '@/stores/toast'
import { useAlert } from '@/stores/alert'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { useTitle } from '@vueuse/core'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const toast = useToast()
const alert = useAlert()
const router = useRouter()
const route = useRoute()
const auth = useAuth()
const title = useTitle()
const assessmentStore = useAssessmentStore()


/* ---------------------------------- STATE --------------------------------- */
const assessmentTarget = reactive({
  loading: false,
  data: [],
  headers: [{
    text: 'Nama Target',
    value: 'nama',
    sortable: true
  }, {
    text: 'Action',
    value: 'action',
  }
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
  search: '',
})

const assessmentTitle = computed(() => {
  return route.query?.assessment
})

const assessmentId = computed(() => {
  return route.params?.id
})

/* --------------------------------- METHODS -------------------------------- */
const getListTarget = async ({ limit, page, sortBy, sortType, search, assesment_id }) => {
  try {
    assessmentTarget.loading = true
    const response = await AssessmentTargetServices.getListTarget({ limit, page, sortBy, sortType, search, assesment_id })

    if (response) {
      const data = response?.data

      assessmentTarget.data = data?.list || []
      assessmentTarget.meta = data?.meta
      assessmentTarget.loading = false
    }
  } catch (error) {
    assessmentTarget.loading = false
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
  getListTarget({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
    assesment_id: assessmentId.value
  })
}

const deleteTarget = async ({ id }) => {
  try {
    const response = await AssessmentTargetServices.deleteTarget({ id })

    if (response) {
      toast.success({
        title: 'Hapus Target Asesmen',
        text: `Berhasil Menghapus Data Target Asesmen`
      })
      handleRefresh()

      return response
    }
  } catch (error) {
    toast.error({ error })
    throw error
  }
}

const handleDelete = async ({ title, id }) => {
  alert.info({
    title: `Apakah Anda Yakin untuk Menghapus ${title}`
  }).then(async (result) => {
    if (result.isConfirmed) {
      alert.loading()
      try {
        const response = await deleteTarget({ id })

        if (response) {
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
      }
    }
  })
}

const handleNavigateEdit = ({ id, target }) => {
  router.push({ path: `/project/assessment/${assessmentId.value}/setting-target/${id}/edit`, query: { target } })
}

const handleNavigateAdd = () => {
  router.push({
    path: `/project/assessment/${assessmentId.value}/setting-target/add`, query: {
      assessment: assessmentTitle.value
    }
  })
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  auth.setMenuToProject()
  title.value = `Setting Target ${assessmentStore.detail?.nama || ''}`
  getListTarget({ limit: serverOptions.value.rowsPerPage, page: serverOptions.value.page, assesment_id: assessmentId.value })
})

watch(() => [filter.value], value => {
  if (value) {
    resetServerOptions()
  }
}, { deep: true })

watch(() => [serverOptions.value, filter.value], () => {
  getListTarget({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
    assesment_id: assessmentId.value
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
              <h5 class="card-title fw-semibold mb-3">Setting Target</h5>
              <p v-if="assessmentTitle" class="card-subtitle mb-0">{{ assessmentTitle }}</p>
            </div>

            <div
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
              <SearchInput v-model="filter.search" placeholder="Cari Target" />

              <BaseButton @click="handleNavigateAdd" class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3"
                title="Tambah Target">
                <template #icon-left>
                  <TablerIcon size="16" icon="PlusIcon" />
                </template>
              </BaseButton>
            </div>
          </div>

          <DataTable :headers="assessmentTarget.headers" :items="assessmentTarget.data"
            :loading="assessmentTarget.loading" :server-items-length="assessmentTarget.meta.total"
            v-model:server-options="serverOptions" fixed-header>

            <template #item-nama="item">
              <div class="d-flex w-100">
                {{ item.item.nama }} <span v-if="item.item?.default" class="ms-2 fw-bold">(Default)</span>
              </div>
            </template>

            <template #item-action="item">
              <div v-if="!item.item.default" class="dropdown dropstart">
                <TablerIcon icon="DotsIcon" class="text-muted cursor-pointer" data-bs-toggle="dropdown"
                  id="dropdownMenuButton" aria-expanded="false" />

                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <BaseButton @click="handleNavigateEdit({ id: item?.item?.id, target: item?.item?.nama })"
                      class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                      <template #icon-left>
                        <TablerIcon icon="EditIcon" />
                        <span class="ms-2">
                          Edit Target
                        </span>
                      </template>
                    </BaseButton>
                  </li>
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
            </template>
          </DataTable>
        </div>
      </div>
    </section>
  </div>
</template>