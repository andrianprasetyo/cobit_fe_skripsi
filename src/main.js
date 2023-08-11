import '@/assets/css/main-styles.css'
import '@/assets/css/styles.css'

import { createApp } from 'vue'

import setupPinia from '@/plugins/pinia'
import setupPortal from '@/plugins/portal-vue'
import setupEasyLightbox from '@/plugins/easy-lightbox'
import setupToast from '@/plugins/toastification'
import setupSweetAlert from '@/plugins/sweetalert'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)

setupPinia(app)
setupPortal(app)
setupEasyLightbox(app)
setupToast(app)
setupSweetAlert(app)

app.mount('#app')
