import '@/assets/css/main-styles.css'
import '@/assets/css/styles.css'
import '@/assets/css/pace.css'
import '@/assets/css/vue-select.css'
import '@/assets/css/file-manager.css'

import '@/assets/libs/jquery/jquery.min.js'
import '@/assets/libs/simplebar/simplebar.min.js'
import '@/assets/libs/bootstrap/bootstrap.bundle.min.js'
import '@/assets/libs/pace/pace.min.js'

import '@/assets/js/app.min.js'
import '@/assets/js/app.init.js'
import '@/assets/js/app-style-switcher.js'
import '@/assets/js/sidebarmenu.js'
import '@/assets/js/custom.js'

import { createApp } from 'vue'

import setupPinia from '@/plugins/pinia'
import setupPortal from '@/plugins/portal-vue'
import setupEasyLightbox from '@/plugins/easy-lightbox'
import setupToast from '@/plugins/toastification'
import setupSweetAlert from '@/plugins/sweetalert'
import setupCKEditor from '@/plugins/ckeditor'
import setupApexCharts from '@/plugins/apexcharts'
import setupLoadingOverlay from '@/plugins/loading-overlay'
import setupVSelect from '@/plugins/v-select'
import setupFloatingVue from '@/plugins/floating-vue'
import setupJSONViewer from '@/plugins/json-viewer'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)

setupPinia(app)
setupPortal(app)
setupEasyLightbox(app)
setupToast(app)
setupSweetAlert(app)
setupCKEditor(app)
setupApexCharts(app)
setupLoadingOverlay(app)
setupVSelect(app)
setupFloatingVue(app)
setupJSONViewer(app)

app.mount('#app')
