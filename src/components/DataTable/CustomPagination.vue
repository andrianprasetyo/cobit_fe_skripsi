<script setup>
import { ref, computed } from 'vue'
import Vue3EasyDataTable from 'vue3-easy-data-table';

import 'vue3-easy-data-table/dist/style.css';

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
    required: true
  },
  maxPageLinks: {
    type: Number,
    default: 3
  },
  rowsItems: {
    type: Array,
    default: () => [10, 25, 50, 100]
  },
  serverOptions: {
    type: Object
  }
})

const emit = defineEmits(['update:modelValue'])

const dataTable = ref()

// index related
const currentPageFirstIndex = computed(() => dataTable.value?.currentPageFirstIndex);
const currentPageLastIndex = computed(() => dataTable.value?.currentPageLastIndex);
const clientItemsLength = computed(() => dataTable.value?.clientItemsLength || dataTable?.value?.serverItemsLength);

// pagination related
const maxPaginationNumber = computed(() => dataTable.value?.maxPaginationNumber);
const currentPaginationNumber = computed(() => dataTable.value?.currentPaginationNumber);

const isFirstPage = computed(() => dataTable.value?.isFirstPage);
const isLastPage = computed(() => dataTable.value?.isLastPage);

const nextPage = () => {
  /* Replace To Query
   router.replace({
    query: { ...router.currentRoute.value.query, page: dataTable.value.currentPaginationNumber }
  })
  */
  if (!isLastPage.value) {
    dataTable.value.nextPage();
    dataTable.value.currentPaginationNumber = +dataTable.value.currentPaginationNumber + 1
  }
};
const prevPage = () => {
  /* Replace To Query
   router.replace({
    query: { ...router.currentRoute.value.query, page: dataTable.value.currentPaginationNumber }
  })
  */

  if (!isFirstPage.value) {
    dataTable.value.prevPage();
    dataTable.value.currentPaginationNumber = +dataTable.value.currentPaginationNumber - 1
  }
};
const updatePage = (paginationNumber) => {
  /* Replace To Query
    router.replace({
    query: { ...router.currentRoute.value.query, page: paginationNumber }
  })
  */
  dataTable.value.updatePage(paginationNumber);
  dataTable.value.currentPaginationNumber = paginationNumber
};

// rows per page related
/*
const rowsPerPageOptions = computed(() => dataTable.value?.rowsPerPageOptions);
*/

const rowsPerPageActiveOption = computed(() => dataTable.value?.rowsPerPageActiveOption);

const updateRowsPerPageSelect = (e) => {
  dataTable.value.currentPaginationNumber = 1
  dataTable.value.updateRowsPerPageActiveOption(Number((e.target).value));
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

const valueServerOptions = computed({
  get() {
    return props.serverOptions
  },
  set(value) {
    emit('update:modelValue', value)
  }
})


</script>

<template>
  <div>
    <Vue3EasyDataTable ref="dataTable" table-class-name="customize-table pb-0" style="display: none;"
      header-item-class-name="text-center align-middle" :headers="[]" :items="props.items" buttons-pagination show-index
      border-cell rows-per-page-message="Per Halaman" :rows-items="props.rowsItems" show-index-symbol='No'
      rows-of-page-separator-message="dari" theme-color="#203058" v-model:server-options="valueServerOptions" hide-footer
      v-bind="$attrs">
    </Vue3EasyDataTable>

    <div v-if="Array.isArray(items) && items.length"
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
</style>