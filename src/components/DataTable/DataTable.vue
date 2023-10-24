<script setup>
import { ref, computed } from 'vue'
import Vue3EasyDataTable from 'vue3-easy-data-table';
import { usePagination, useRowsPerPage } from "use-vue3-easy-data-table";

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
  },
  maxPageLinks: {
    type: Number,
    default: 3
  },
  rowsItems: {
    type: Array,
    default: () => [10, 25, 50, 100]
  },
  isShowPagination: {
    type: Boolean,
    default: true
  }
})

const dataTable = ref()

const {
  currentPageFirstIndex,
  currentPageLastIndex,
  clientItemsLength,
  maxPaginationNumber,
  currentPaginationNumber,
  isFirstPage,
  isLastPage,
  nextPage,
  prevPage,
  updatePage,
} = usePagination(dataTable);

const {
  rowsPerPageActiveOption,
  updateRowsPerPageActiveOption,
} = useRowsPerPage(dataTable);

const updateRowsPerPageSelect = (e) => {
  updateRowsPerPageActiveOption(e.target.value);
};

const limitVisiblePages = computed(() => {
  const displayPages = []

  const totalTiers = Math.ceil(maxPaginationNumber.value / props.maxPageLinks)

  const activeTier = Math.ceil(currentPaginationNumber.value / props.maxPageLinks)

  const start = ((activeTier - 1) * props.maxPageLinks) + 1
  const end = start + props.maxPageLinks

  if (activeTier > 1) {
    displayPages.push(start - 1)
  }

  for (let i = start; i < end; i++) {
    if (i > maxPaginationNumber.value) {
      break
    }

    displayPages.push(i)
  }

  if (activeTier < totalTiers) {
    displayPages.push(end)
  }

  return displayPages
})


</script>

<template>
  <div>
    <Vue3EasyDataTable ref="dataTable" table-class-name="customize-table pb-0"
      header-item-class-name="text-center align-middle" :headers="props.headers" :items="props.items" buttons-pagination
      show-index border-cell rows-per-page-message="Per Halaman" :rows-items="props.rowsItems" show-index-symbol='No'
      rows-of-page-separator-message="dari" theme-color="#203058" hide-footer :max-pagination-number="5" v-bind="$attrs">

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

    <div v-if="Array.isArray(items) && items.length && props.isShowPagination"
      class="pt-3 d-flex flex-column justify-content-center flex-md-row justify-content-md-between align-items-center border-top">
      <div class="d-flex flex-row justify-content-center align-items-center">
        <div>
          <select class="form-select" @change="updateRowsPerPageSelect">
            <option v-for="item in props.rowsItems" :key="item" :selected="item === rowsPerPageActiveOption"
              :value="item">
              {{ item }}
            </option>
          </select>
        </div>

        <div class="ms-3">
          Menampilkan {{ currentPageFirstIndex }} s/d {{ currentPageLastIndex }} dari {{ clientItemsLength }} Data
        </div>
      </div>

      <div class="pt-3 pt-md-0">
        <ul class="pagination justify-content-center justify-content-md-end">
          <li class="page-item" :class="[isFirstPage ? 'disabled' : '']" :disabled="isFirstPage" @click="prevPage">
            <a class="page-link cursor-pointer" tabindex="-1" aria-disabled="true">Sebelumnya</a>
          </li>
          <template v-if="maxPaginationNumber">
            <li v-for="paginationNumber in limitVisiblePages" :key="`index-button-pagination-${paginationNumber}`"
              class="page-item" @click="updatePage(paginationNumber)">
              <button class="page-link cursor-pointer" :disabled="paginationNumber === currentPaginationNumber"
                :class="{ 'active': paginationNumber === currentPaginationNumber }">
                {{ paginationNumber }}
              </button>
            </li>
          </template>

          <li class="page-item" :class="[isLastPage ? 'disabled' : '']" :disabled="isLastPage" @click="nextPage">
            <a class="page-link cursor-pointer">Selanjutnya</a>
          </li>
        </ul>
      </div>
    </div>
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

  --easy-table-scrollbar-track-color: #a6b9db;
  --easy-table-scrollbar-color: #;
  --easy-table-scrollbar-thumb-color: #203058;
  --easy-table-scrollbar-corner-color: #;

  --easy-table-loading-mask-background-color: #f1f1f1;

  --easy-table-buttons-pagination-border: 1px solid #e0e0e0;
}

/* Auto */
/* .vue3-easy-data-table div.vue3-easy-data-table__main {
    min-height: auto;
} */
</style>