<script setup>
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  isShowCustomAlert: {
    type: Boolean,
    default: false
  },
  customAlertMessage: {
    type: String
  },
  data: {
    type: Array,
    default: () => []
  },
  columnLength: {
    type: [Number, String],
    required: true
  },
  noDataMessage: {
    type: String,
    default: 'Tidak Ada Data Ditemukan'
  },
  caption: {
    type: String,
    default: 'Data Table'
  },
  classHeader: {
    type: [String, Object, Array],
    default: ''
  },
  classBody: {
    type: [String, Object, Array],
    default: ''
  }
})

const slots = defineSlots()
</script>

<template>
  <div class="table-responsive mb-2">
    <LoadingOverlay :height="25" :active="props.isLoading" />

    <figure>
      <figcaption class="d-none">{{ props.caption }}</figcaption>
      <!-- //NOSONAR -->
      <table class="table table-hover border text-nowrap mb-0 align-middle">
        <!-- //NOSONAR -->
        <thead :class="props.classHeader">
          <!-- //NOSONAR -->
          <slot v-if="slots['header']" name="header" />

          <tr v-else>
            <th scope="col" :colspan="props.columnLength"></th>
          </tr>
        </thead>

        <!-- //NOSONAR -->
        <tbody :class="props.classBody">
          <tr v-if="props.isShowCustomAlert">
            <td :colspan="props.columnLength" class="text-center">
              {{ props.customAlertMessage }}
            </td>
          </tr>

          <tr v-else-if="!props.isLoading && !props.data?.length">
            <td :colspan="props.columnLength" class="text-center">{{ props.noDataMessage }}</td>
          </tr>

          <tr v-else-if="props.isLoading">
            <td :colspan="props.columnLength" class="text-center">Loading...</td>
          </tr>
          <!-- //NOSONAR -->
          <slot v-else name="body" />
        </tbody>
      </table>
    </figure>
  </div>
</template>
