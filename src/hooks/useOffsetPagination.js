import { computed } from 'vue'

export function useOffsetPagination({ currentPage, itemsPerPage }) {
  const offset = computed(() => (currentPage - 1) * itemsPerPage)
  const offsetEndIndex = computed(() => offset.value + itemsPerPage)

  return {
    offset,
    offsetEndIndex
  }
}
