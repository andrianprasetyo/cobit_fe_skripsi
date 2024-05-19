<script setup>
import { computed } from 'vue'
import debounce from 'lodash.debounce'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String
  },
  isShowSearchIcon: {
    type: Boolean,
    default: true
  },
  isAppendToQuery: {
    type: Boolean,
    default: false
  },
  excludedQuery: {
    type: Array,
    default: () => []
  }
})

const value = computed({
  get: () => {
    if (props.isAppendToQuery) {
      return route.query?.search
    } else {
      return props.modelValue
    }
  },
  set: debounce((value) => {
    if (props.isAppendToQuery) {
      updateQueryHandler(value)
    }
    emit('update:modelValue', value)
  }, 500)
})

/* --------------------------------- HANDLER -------------------------------- */
const updateQueryHandler = (searchValue) => {
  if (props.isAppendToQuery && searchValue) {
    if (Array.isArray(props.excludedQuery) && props.excludedQuery.length) {
      const queries = {}
      props.excludedQuery.forEach((item) => {
        queries[item] = route.query[item]
      })
      router.replace({
        query: {
          ...queries,
          search: searchValue
        }
      })
    } else {
      router.replace({
        query: {
          search: searchValue
        }
      })
    }
  } else if (props.isAppendToQuery && !searchValue) {
    const queries = { ...route.query }

    delete queries?.search

    router.replace({
      query: queries
    })
  }
}
</script>

<template>
  <div class="position-relative">
    <input class="form-control ps-5" :type="type" v-model="value" :placeholder="props.placeholder" v-bind="$attrs" />
    <TablerIcon v-if="props.isShowSearchIcon" size="20" icon="SearchIcon"
      class="position-absolute top-50 start-0 translate-middle-y text-dark ms-3" />
  </div>
</template>
