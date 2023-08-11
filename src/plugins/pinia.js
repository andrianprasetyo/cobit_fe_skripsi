import { markRaw } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import router from '@/router'

export default function setupPinia(app) {
  const pinia = createPinia()
  pinia.use(({ store }) => {
    store.router = markRaw(router)
  })
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
}
