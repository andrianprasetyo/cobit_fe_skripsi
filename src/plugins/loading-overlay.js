import { LoadingPlugin } from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

export default function setupLoadingOverlay(app) {
  app.use(LoadingPlugin, {
    color: '#203058',
    canCancel: false
  })
}
