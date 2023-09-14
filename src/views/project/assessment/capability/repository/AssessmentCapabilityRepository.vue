<script setup>
import { onMounted, reactive, computed, ref, watch } from 'vue'

import SearchInput from '@/components/Input/SearchInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'
import NoOptions from '@/components/EmptyPlaceholder/NoOptions.vue'
import MediaFileItem from '@/views/project/assessment/capability/repository/components/MediaFileItem.vue'
import ModalUploadMediaFile from '@/views/project/assessment/capability/repository/components/ModalUploadMediaFile.vue'
import ModalViewMediaFile from '@/views/project/assessment/capability/repository/components/ModalViewMediaFile.vue'
import CustomPagination from '@/components/DataTable/CustomPagination.vue'

import RepositoryServices from '@/services/lib/repository'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useAlert } from '@/stores/alert'
import { useRoute } from 'vue-router'
import { useToast } from '@/stores/toast'

const assessmentStore = useAssessmentStore()
const alert = useAlert()
const route = useRoute()
const toast = useToast()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const repository = reactive({
  loading: false,
  data: [],
  meta: {
    current_page: 1,
    per_page: 10,
    total: 0,
    total_page: 0
  },
  highlightedMediaFile: null,
  isShowModalUploadMediaFile: false,
  isShowModalViewMediaFile: false
})

const serverOptions = ref({
  page: 1,
  rowsPerPage: 12,
  sortBy: '',
  sortType: '',
});

const filter = ref({
  search: '',
})


const isHighlightedMediaFile = computed(() => {
  return value => {
    return repository.highlightedMediaFile?.id === value
  }
})

/* --------------------------------- METHODS -------------------------------- */
const handleToggleModalUploadMediaFile = () => {
  repository.isShowModalUploadMediaFile = !repository.isShowModalUploadMediaFile
}

const handleToggleModalViewMediaFile = () => {
  repository.isShowModalViewMediaFile = !repository.isShowModalViewMediaFile
}

const getCapabilityListMediaRepositoryAssessment = async ({ limit, page, search, assesment_id }) => {
  try {
    repository.loading = true
    const response = await RepositoryServices.getListMediaRepository({
      limit,
      page,
      search,
      assesment_id
    })

    if (response) {
      const data = response?.data

      repository.data = data?.list || [];
      repository.meta = data?.meta

      repository.loading = false
    }
  } catch (error) {
    toast.error({ error })
    repository.loading = false
  }
}

/*
const handleSearchListMediaRepositoryAssessment = debounce(async ({ search }) => {
  try {
    const response = await RepositoryServices.getListMediaRepository({ limit: 12, page: 1, search, assesment_id: route.params?.id })

    if (response) {
      const data = response?.data

      repository.data = data?.list || []
    }

  } catch (error) {
    toast.error({ error })
  }
}, 500)
*/

const handleDoubleClick = ({ file }) => {
  assessmentStore.setCapabilitySelectedMediaFile(file)
  repository.isShowModalViewMediaFile = true
}

const handleClick = ({ file }) => {
  if (repository.highlightedMediaFile?.id === file?.id) {
    handleDoubleClick({ file })
  } else {
    repository.highlightedMediaFile = file
  }
}

const handleClickOutside = () => {
  repository.highlightedMediaFile = null
}

const handleEdit = ({ file }) => {
  assessmentStore.setCapabilitySelectedMediaFile(file)
  repository.isShowModalUploadMediaFile = true
}

const handleDelete = ({ title, id }) => {
  alert.info({
    title: `Apakah Anda Yakin untuk Menghapus ${title}`
  }).then(async (result) => {
    if (result.isConfirmed) {
      alert.loading()
      try {
        const response = await assessmentStore.deleteCapabilityMediaRepositoryAssessment({ id })

        if (response) {
          alert.instance().close()
          getCapabilityListMediaRepositoryAssessment()
        }
      } catch (error) {
        alert.instance().close()
      }
    }
  })
}

const resetServerOptions = () => {
  serverOptions.value.page = 1
  serverOptions.value.rowsPerPage = 12
  serverOptions.value.sortBy = ''
  serverOptions.value.sortType = ''
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getCapabilityListMediaRepositoryAssessment({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
    assesment_id: route.params?.id,
  })
})

watch(() => [filter.value], value => {
  if (value) {
    resetServerOptions()
  }
}, { deep: true })

watch(() => [serverOptions.value, filter.value], () => {
  getCapabilityListMediaRepositoryAssessment({
    limit: serverOptions.value.rowsPerPage,
    page: serverOptions.value.page,
    sortBy: serverOptions.value.sortBy,
    sortType: serverOptions.value.sortType,
    search: filter.value.search,
    assesment_id: route.params?.id,
  })
}, { deep: true })


</script>

<template>
  <div class="card">
    <div class="card-body">
      <LoadingOverlay :active="repository.loading" />

      <div class="d-flex flex-row justify-content-between align-items-center">
        <h5 class="card-title mb-3 mb-md-0 fw-semibold">Repository</h5>

        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <SearchInput v-model="filter.search" placeholder="Cari File" />

          <BaseButton @click="handleToggleModalUploadMediaFile" class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3"
            title="Upload File">
            <template #icon-left>
              <TablerIcon icon="UploadIcon" />
            </template>
          </BaseButton>
        </div>
      </div>

      <template v-if="Array.isArray(repository.data) && repository.data.length">
        <div class="file-manager-main-content mt-3" @click.stop="handleClickOutside">
          <div class="row border-top py-4 mb-4">
            <MediaFileItem v-for="mediaFile in repository.data" :key="`media-file-${mediaFile?.id}`"
              :id="`media-file-${mediaFile?.id}`" :ext="mediaFile?.docs?.ext"
              :name="mediaFile?.deskripsi || mediaFile?.docs?.originalname" :lastUpdate="mediaFile?.created_at"
              :size="mediaFile?.docs?.size" :class="{ 'border-primary': isHighlightedMediaFile(mediaFile?.id) }"
              @edit="handleEdit({ file: mediaFile })" @click="handleClick({ file: mediaFile })"
              @double-click="handleDoubleClick({ file: mediaFile })"
              @delete="handleDelete({ title: mediaFile?.docs?.originalname, id: mediaFile?.id })" />
          </div>

          <CustomPagination :items="repository.data" :server-items-length="repository.meta.total"
            :serverOptions="serverOptions" v-model="serverOptions" :current-page="repository.meta.current_page" />
        </div>


      </template>

      <template v-else-if="Array.isArray(repository.data) && !repository.data.length && filter.search">
        <NoOptions title="File Tidak Ditemukan" />
      </template>

      <template v-else>
        <NoData title="Belum Ada File di Upload" />
      </template>

    </div>

    <ModalUploadMediaFile :is-show="repository.isShowModalUploadMediaFile" @close="handleToggleModalUploadMediaFile"
      @refresh="getCapabilityListMediaRepositoryAssessment" />

    <ModalViewMediaFile :is-show="repository.isShowModalViewMediaFile" @close="handleToggleModalViewMediaFile" />
  </div>
</template>