import '@/assets/css/main-styles.css'
import '@/assets/css/styles.css'
import '@/assets/css/pace.css'

import { createApp } from 'vue'

import setupPinia from '@/plugins/pinia'
import setupPortal from '@/plugins/portal-vue'
import setupEasyLightbox from '@/plugins/easy-lightbox'
import setupToast from '@/plugins/toastification'
import setupSweetAlert from '@/plugins/sweetalert'
import setupVCalendar from '@/plugins/v-calendar'
import setupCKEditor from '@/plugins/ckeditor'
import setupApexCharts from '@/plugins/apexcharts'
import setupLoadingOverlay from '@/plugins/loading-overlay'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)

setupPinia(app)
setupPortal(app)
setupEasyLightbox(app)
setupToast(app)
setupSweetAlert(app)
setupVCalendar(app)
setupCKEditor(app)
setupApexCharts(app)
setupLoadingOverlay(app)

app.mount('#app')
