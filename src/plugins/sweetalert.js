import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
// import '@/assets/css/sweet-alerts.css'

export default function setupSweetAlert(app) {
  app.use(VueSweetalert2)
}
