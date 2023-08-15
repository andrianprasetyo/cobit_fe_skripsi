<script setup>
import { ref, onMounted, computed } from 'vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Spinner from '@/components/Loading/LoadingSpinner.vue';
import ckEditorConfig from '@/utils/ckEditorConfig';

const props = defineProps({
  value: {
    type: String,
  },
  editorConfig: {
    type: Object,
    default: null,
  },
  tagName: {
    type: String,
    default: 'textarea',
  },
  isInvalid: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:value'])

const isReady = ref(false);
const editor = ref(ClassicEditor);
const editorConfigDefault = computed(() => ({
  ...ckEditorConfig,
  ...props.editorConfig,
}));

const editorData = computed({
  get() {
    return props.value
  },
  set(value) {
    emit('update:value', value)
  }
})

onMounted(() => {
  isReady.value = true;
})

const onEditorReady = () => {
  isReady.value = true;
};
</script>

<template>
  <Spinner v-if="!isReady" />
  <ckeditor v-else ref="baseCKEditor" :editor="editor" v-model="editorData" @ready="onEditorReady" v-bind="$attrs"
    :config="editorConfigDefault">
  </ckeditor>
</template>