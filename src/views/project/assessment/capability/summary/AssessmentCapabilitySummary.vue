<script setup>
import { reactive } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import DataTable from '@/components/DataTable/DataTable.vue';

const summary = reactive({
  loading: false,
  data: [],
  headers: [{
    text: 'Governance and Management Objectives',
    value: 'domain',
    sortable: true
  }, {
    text: 'Hasil Asesmen',
    value: 'hasil',
  }, {
    text: 'Level',
    value: 'level',
  }
  ],
  meta: {
    current_page: 1,
    per_page: 10,
    total: 0,
    total_page: 0
  },
})

/* --------------------------------- METHODS -------------------------------- */


</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex flex-row justify-content-between align-items-center">
        <h5 class="card-title mb-3 mb-md-0 fw-semibold">Summary</h5>

        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <BaseButton class="btn btn-outline-primary ms-0 mt-3 mt-md-0 ms-md-3" title="Export Summary">
            <template #icon-left>
              <TablerIcon icon="FileExportIcon" />
            </template>
          </BaseButton>
        </div>
      </div>

      <div class="mb-4 mt-4">
        <DataTable :headers="summary.headers" :items="summary.data" :loading="summary.loading"
          :server-items-length="summary.meta.total" fixed-header>
        </DataTable>
      </div>
    </div>
  </div>
</template>