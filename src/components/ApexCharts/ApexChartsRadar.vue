<script setup>
import { reactive, computed } from 'vue'

const props = defineProps({
  type: {
    type: [String],
    default: 'radar'
  },
  height: {
    type: [String, Number],
    default: 400,
  },
  options: {
    type: Object,
    default: null,
  },
  series: {
    type: Array,
    default: () => [],
  },
  categories: {
    type: Array,
    default: () => []
  },
  colors: {
    type: Array,
    default: () => ['#203058', '#EE1E25'],
  },
})

const defaultOptions = reactive({
  chart: {
    type: "radar",
    fontFamily: `inherit`,
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center'
  },
  stroke: {
    width: 2
  },
  fill: {
    opacity: 0.1
  },
  markers: {
    size: 0
  },
  noData: {
    text: "Tidak Ada Data Ditampilkan",
    align: 'center',
    verticalAlign: 'middle',
    offsetX: 0,
    offsetY: 0,
    style: {
      fontSize: '14px',
      fontFamily: "Plus Jakarta Sans"
    }
  },
  xaxis: {
    axisBorder: {
      show: true
    },
    axisTicks: {
      show: false
    }
  },
})

const chartOptions = computed(() => {
  return ({
    ...defaultOptions, ...props.options, colors: props.colors, xaxis: {
      categories: props.categories,
    }
  })
})


</script>

<template>
  <apexchart :type="props.type" :height="props.height" :options="chartOptions" :series="props.series" />
</template>