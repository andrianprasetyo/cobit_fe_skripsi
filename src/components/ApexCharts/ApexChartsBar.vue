<script setup>
import { reactive, computed } from 'vue';

const props = defineProps({
  type: {
    type: [String],
    default: 'bar'
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
    type: "bar",
    fontFamily: "inherit",
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      columnWidth: '50%',
      borderRadius: 2,
    },
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center'
  },
  fill: {
    opacity: 1
  },
  stroke: {
    show: true,
    colors: ['transparent']
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
  yaxis: {
    labels: {
      show: true,
      align: 'right',
      minWidth: 0,
      maxWidth: 160,
      style: {
        fontFamily: 'inherit',
        fontWeight: 400,
        cssClass: 'apexcharts-yaxis-label',
      },
      offsetX: 0,
      offsetY: 0,
      rotate: 0,
    },
  },
})

const chartOptions = computed(() => {
  return ({
    ...defaultOptions, ...props.options,
    colors: props.colors,
    xaxis: {
      categories: props.categories,
    },
  })
})

</script>

<template>
  <apexchart :type="props.type" :height="props.height" :options="chartOptions" :series="props.series" />
</template>