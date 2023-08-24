import { defineStore } from 'pinia'

import appLogoImageRounded from '/assets/logo/logo-msi-full-rounded.webp'
import appLogoImageOnly from '/assets/logo/logo-msi-rounded.png'

const APP_HOST_DOWNLOAD = import.meta.env.VITE_HOST_DOWNLOAD

export const useAppConfig = defineStore({
  id: 'appConfig',
  state: () => ({
    app: {
      appName: 'Assessment Cobit 2019',
      appLogoImage: appLogoImageRounded,
      appLogoImageOnly: appLogoImageOnly,
      appHostDownload: APP_HOST_DOWNLOAD
    },
    layouts: {
      type: 'vertical',
      miniSidebar: false,
      routerTransition: 'zoom-fade',
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
