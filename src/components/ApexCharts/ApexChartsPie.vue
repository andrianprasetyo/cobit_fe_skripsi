<script setup>
import { reactive, computed } from 'vue'

const props = defineProps({
  type: {
    type: [String],
    default: 'pie'
  },
  height: {
    type: [String, Number],
    default: 400
  },
  options: {
    type: Object,
    default: null
  },
  series: {
    type: Array,
    default: () => []
  },
  labels: {
    type: Array,
    default: () => []
  },
  colors: {
    type: Array,
    default: () => ['var(--bs-primary)', 'var(--bs-secondary)']
  }
})

const defaultOptions = reactive({
  chart: {
    type: 'pie',
    fontFamily: 'inherit',
    toolbar: {
      show: true
    },
  },
  dataLabels: {
    enabled: true
  },
  noData: {
    text: 'Tidak Ada Data Ditampilkan',
    align: 'center',
    verticalAlign: 'middle',
    offsetX: 0,
    offsetY: 0,
  }
})

const chartOptions = computed(() => {
  return {
    ...defaultOptions,
    ...props.options,
    colors: props.colors,
    labels: props.labels
  }
})
</script>

<template>
  <apexchart :type="props.type" :height="props.height" :options="chartOptions" :series="props.series" />
</template>
