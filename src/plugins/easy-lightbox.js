import VueEasyLightbox from 'vue-easy-lightbox'
import 'vue-easy-lightbox/external-css/vue-easy-lightbox.css'

export default function setupEasyLightbox(app) {
  app.use(VueEasyLightbox)
}
