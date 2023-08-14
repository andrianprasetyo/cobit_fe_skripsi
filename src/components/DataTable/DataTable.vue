<script setup>
import { ref } from 'vue'
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue'

const slots = defineSlots()
const props = defineProps({
  headers: {
    type: Array,
    default: () => []
  },
  items: {
    type: Array,
    default: () => []
  }
})

const dataTable = ref()

</script>

<template>
  <div>
    <Vue3EasyDataTable ref="dataTable" table-class-name="customize-table "
      header-item-class-name="text-center align-middle" :headers="props.headers" :items="props.items" buttons-pagination
      show-index border-cell rows-per-page-message="Per Halaman" :rows-items="[10, 25, 50, 100]"
      show-index-symbol='No' rows-of-page-separator-message="dari" theme-color="#203058" v-bind="$attrs">


      <template #loading>
        <slot v-if="slots['loading']" name="loading" />
        <LoadingSpinner v-else size="small" />
      </template>

      <template #empty-message>
        <slot v-if="slots['empty-message']" name="empty-message" />
        <p v-else class="text-center">Tidak Ada Data Ditemukan</p>
      </template>

      <template v-for="field in Object.keys(slots)" v-slot:[field]="item">
        <slot :name="field" :item="item" />
      </template>
    </Vue3EasyDataTable>
  </div>
</template>

<style scoped>
.customize-table {
  white-space: nowrap;
  --easy-table-border: 1px solid rgb(223, 229, 239, 0.1);
  --easy-table-row-border: 1px solid rgb(223, 229, 239, 0.7);

  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: rgb(42, 53, 71);
  --easy-table-header-background-color: rgb(255, 255, 255);

  --easy-table-header-item-padding: 10px 15px;

  --easy-table-body-even-row-font-color: rgb(255, 255, 255);
  --easy-table-body-even-row-background-color: rgba(0, 0, 0, 0.02);

  --easy-table-body-row-font-color: rgb(42, 53, 71);
  --easy-table-body-row-background-color: rgb(255, 255, 255);
  --easy-table-body-row-height: 50px;
  --easy-table-body-row-font-size: 14px;

  --easy-table-body-row-hover-font-color: rgb(42, 53, 71);
  --easy-table-body-row-hover-background-color: rgba(0, 0, 0, 0.02);

  --easy-table-body-item-padding: 15px;

  --easy-table-footer-background-color: rgb(255, 255, 255);
  --easy-table-footer-font-color: rgb(42, 53, 71);
  --easy-table-footer-font-size: 14px;
  --easy-table-footer-padding: 0px 10px;
  --easy-table-footer-height: 50px;

  --easy-table-rows-per-page-selector-width: 70px;
  --easy-table-rows-per-page-selector-option-padding: 10px;

  --easy-table-scrollbar-track-color: #4c5d7a;
  --easy-table-scrollbar-color: #;
  --easy-table-scrollbar-thumb-color: #203058;
  --easy-table-scrollbar-corner-color: #;

  --easy-table-loading-mask-background-color: #4c5d7a;

  --easy-table-buttons-pagination-border: 1px solid #e0e0e0;
}
</style>