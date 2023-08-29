import { defineStore } from 'pinia'

import appLogoImageRounded from '/assets/logo/logo-msi-full-rounded.webp'
import appLogoImageOnly from '/assets/logo/logo-msi-rounded.png'

const APP_HOST_DOWNLOAD = import.meta.env.VITE_HOST_DOWNLOAD
const APP_HOST_MEDIA = import.meta.env.VITE_HOST_MEDIA
const APP_HOST = import.meta.env.VITE_HOST

export const useAppConfig = defineStore({
  id: 'appConfig',
  state: () => ({
    app: {
      appName: 'Assessment Cobit 2019',
      appLogoImage: appLogoImageRounded,
      appLogoImageOnly: appLogoImageOnly,
      appHostDownload: APP_HOST_DOWNLOAD,
      appHostMedia: APP_HOST_MEDIA,
      appHost: APP_HOST
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
