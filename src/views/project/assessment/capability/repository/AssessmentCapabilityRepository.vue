<script setup>
import { onMounted, reactive, computed } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'
import MediaFileItem from '@/views/project/assessment/capability/repository/components/MediaFileItem.vue'
import ModalUploadMediaFile from '@/views/project/assessment/capability/repository/components/ModalUploadMediaFile.vue'
import ModalViewMediaFile from '@/views/project/assessment/capability/repository/components/ModalViewMediaFile.vue'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useAlert } from '@/stores/alert'
import { useRoute } from 'vue-router'

const assessmentStore = useAssessmentStore()
const alert = useAlert()
const route = useRoute()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const repository = reactive({
  loading: false,
  highlightedMediaFile: null,
  isShowModalUploadMediaFile: false,
  isShowModalViewMediaFile: false
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

const getCapabilityListMediaRepositoryAssessment = async () => {
  try {
    repository.loading = true
    const response = await assessmentStore.getCapabilityListMediaRepositoryAssessment({ assesment_id: route.params?.id, limit: 12 })

    if (response) {
      repository.loading = false
    }
  } catch (error) {
    repository.loading = false
  }
}

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

onMounted(() => {
  getCapabilityListMediaRepositoryAssessment()
})

</script>

<template>
  <div class="card">
    <div class="card-body">
      <LoadingOverlay :active="repository.loading" />

      <div class="d-flex flex-row justify-content-between align-items-center">
        <h5 class="card-title mb-3 mb-md-0 fw-semibold">Repository</h5>

        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <BaseButton @click="handleToggleModalUploadMediaFile" class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3"
            title="Upload File">
            <template #icon-left>
              <TablerIcon icon="UploadIcon" />
            </template>
          </BaseButton>
        </div>
      </div>

      <template v-if="assessmentStore.capability.listMediaFile?.length">
        <div class="file-manager-main-content mt-3" @click.stop="handleClickOutside">
          <div class="row border-top py-4 mb-4">
            <MediaFileItem v-for="mediaFile in assessmentStore.capability.listMediaFile"
              :key="`media-file-${mediaFile?.id}`" :id="`media-file-${mediaFile?.id}`" :ext="mediaFile?.docs?.ext"
              :name="mediaFile?.deskripsi || mediaFile?.docs?.originalname" :lastUpdate="mediaFile?.created_at"
              :size="mediaFile?.docs?.size" :class="{ 'border-primary': isHighlightedMediaFile(mediaFile?.id) }"
              @edit="handleEdit({ file: mediaFile })" @click="handleClick({ file: mediaFile })"
              @double-click="handleDoubleClick({ file: mediaFile })"
              @delete="handleDelete({ title: mediaFile?.docs?.originalname, id: mediaFile?.id })" />
          </div>
        </div>
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