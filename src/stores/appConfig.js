import { defineStore } from 'pinia'

import appLogoImageRounded from '/assets/logo/logo-msi-full-rounded.webp'
import appLogoImageOnly from '/assets/logo/logo-msi-rounded.png'

export const useAppConfig = defineStore({
  id: 'appConfig',
  state: () => ({
    app: {
      appName: 'Assessment Cobit 2019',
      appLogoImage: appLogoImageRounded,
      appLogoImageOnly: appLogoImageOnly
    },
    layouts: {
      type: 'vertical',
      miniSidebar: false,
      routerTransition: 'fade',
      customizer: false
    }
  }),
  getters: {},
  actions: {
    toggleMiniSidebar() {
      this.layouts.miniSidebar = !this.layouts.miniSidebar
    }
  },
  persist: {
    enabled: true
  }
})
