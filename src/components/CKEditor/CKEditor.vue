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
    if (value) {
      emit('update:value', value)
    }

  }
})

const onEditorReady = () => {
  isReady.value = true;
};

onMounted(() => {
  isReady.value = true;
})
</script>

<template>
  <Spinner v-if="!isReady" />
  <div v-else :class="[isInvalid ? 'border border-1 border-danger invalid-border-radius' : '']">
    <ckeditor ref="baseCKEditor" :editor="editor" v-model="editorData" @ready="onEditorReady" :tag-name="props.tagName"
      :config="editorConfigDefault" v-bind="$attrs">
    </ckeditor>
  </div>
</template>

<style scoped>
.invalid-border-radius {
  border-radius: 2px !important;
  z-index: 1000 !important;
}
</style>
