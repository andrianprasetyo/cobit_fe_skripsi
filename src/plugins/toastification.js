import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default function setupToast(app) {
  app.use(Toast, {
    hideProgressBar: true,
    closeOnClick: true,
    closeButton: false,
    icon: false,
    timeout: 3000,
    transition: 'Vue-Toastification__fade'
  })
}
