<script setup>
import { onMounted } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'
import MediaFileItem from '@/views/project/assessment/capability/repository/components/MediaFileItem.vue'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useRoute } from 'vue-router'

const assessmentStore = useAssessmentStore()
const route = useRoute()

onMounted(() => {
  assessmentStore.getCapabilityListMediaRepositoryAssessment({ assesment_id: route.params?.id })
})

</script>

<template>
  <div class="card">
    <div class="card-body">
      <LoadingOverlay />

      <div class="d-flex flex-row justify-content-between align-items-center">
        <h5 class="card-title mb-3 mb-md-0 fw-semibold">Repository</h5>

        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <BaseButton class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3" title="Upload File">
            <template #icon-left>
              <TablerIcon icon="UploadIcon" />
            </template>
          </BaseButton>
        </div>
      </div>

      <template v-if="assessmentStore.capability.listMediaFile?.length">
        <div class="file-manager-main-content mt-3">
          <div class="row border-top py-4 mb-4">
            <MediaFileItem v-for="mediaFile in assessmentStore.capability.listMediaFile"
              :key="`media-file-${mediaFile?.id}`" :name="mediaFile?.docs?.originalname"
              :lastUpdate="mediaFile?.created_at" :size="mediaFile?.docs?.size" />
          </div>
        </div>
      </template>

      <template v-else>
        <NoData title="Belum Ada File di Upload" />
      </template>

    </div>
  </div>
</template>