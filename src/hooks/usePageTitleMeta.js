import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

export function usePageTitleMeta() {
  const route = useRoute()
  const pageTitle = ref('') // Initialize pageTitle as a ref

  // Update the route's meta with the pageTitle when pageTitle.value changes
  onMounted(() => {
    pageTitle.value = route.meta.pageTitle || ''
  })

  // Watch for changes to pageTitle and update route.meta.pageTitle accordingly
  pageTitle.value = route.meta.pageTitle || ''

  return pageTitle
}
