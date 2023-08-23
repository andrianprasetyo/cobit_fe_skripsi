<script setup>
import { reactive, computed } from 'vue'

import DataTable from '@/components/DataTable/DataTable.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseButton from '@/components/Button/BaseButton.vue'

import ModalInviteResponden from '@/views/project/assessment/components/ModalInviteResponden.vue'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'


const assessment = useAssessmentStore()

const responden = reactive({
  loading: false,
  data: [],
  headers: [{
    text: 'Nama',
    value: 'nama',
  }, {
    text: 'Email',
    value: 'email',
  }, {
    text: 'Divisi',
    value: 'divisi',
  }, {
    text: 'Jabatan',
    value: 'jabatan',
  }, {
    text: 'Status',
    value: 'status'
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
  isShowModalInviteResponden: false
})

const classStatus = computed(() => {
  return value => {
    if (value === 'ongoing') {
      return 'bg-light-primary text-primary'
    } else if (value === 'completed') {
      return 'bg-light-success text-success'
    } else if (value === 'unstart') {
      return 'bg-light-info text-info'
    } else {
      return ''
    }
  }
})

const toggleModalInviteResponden = () => {
  responden.isShowModalInviteResponden = !responden.isShowModalInviteResponden

  if (responden.isShowModalInviteResponden) {
    assessment.setSeletedAssessment(assessment.detail)
  }
}

</script>

<template>
  <div class="card mt-4">
    <div class="card-body">
      <div
        class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between mb-7">
        <div class="mb-3 mb-sm-0">
          <h5 class="card-title fw-semibold">Responden</h5>
        </div>

        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <BaseButton @click="toggleModalInviteResponden" class="btn btn-primary" title="Undang Responden">
            <template #icon-left>
              <TablerIcon size="16" icon="SendIcon" class="me-2" />
            </template>
          </BaseButton>

          <BaseButton class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3" title="Lihat Hasil Quisioner">
            <template #icon-left>
              <TablerIcon size="16" icon="ClipboardDataIcon" class="me-2" />
            </template>
          </BaseButton>
        </div>

      </div>

      <DataTable :headers="responden.headers" :items="responden.data" :loading="responden.loading"
        :server-items-length="responden.meta.total" fixed-header>

        <template #header-status="header">
          <div class="d-flex justify-content-center align-items-center w-100">
            {{ header.item.text }}
          </div>
        </template>


        <template #item-status="item">
          <div class="d-flex justify-content-center align-items-center w-100">
            <span class="badge rounded-pill font-medium text-capitalize fw-bold" :class="classStatus(item?.item?.status)">
              {{ item?.item?.status }}
            </span>
          </div>
        </template>

        <template #item-action>
          <div class="dropdown dropstart">
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <BaseButton class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
                  <template #icon-left>
                    <TablerIcon icon="EyeIcon" />
                    <span class="ms-2">
                      Undang Kembali
                    </span>
                  </template>
                </BaseButton>
              </li>
            </ul>
          </div>
        </template>
      </DataTable>
    </div>

    <ModalInviteResponden :is-show="responden.isShowModalInviteResponden" @close="toggleModalInviteResponden" />
  </div>
</template>