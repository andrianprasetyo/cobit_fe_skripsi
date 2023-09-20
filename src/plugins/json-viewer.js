import JsonViewer from 'vue-json-viewer'
import 'vue-json-viewer/style.css'

export default function setupJSONViewer(app) {
  app.use(JsonViewer)
}
