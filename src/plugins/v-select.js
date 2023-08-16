import { h } from 'vue'
import VueSelect from 'vue-select'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

VueSelect.props.components.default = () => ({
  Deselect: () => h(TablerIcon, { icon: 'XIcon', size: '16', style: 'fill: none;' }),
  OpenIndicator: () => h(TablerIcon, { icon: 'ChevronDownIcon', size: '16', style: 'fill: none;' })
})

export default function setupVSelect(app) {
  app.component('v-select', VueSelect)
}
