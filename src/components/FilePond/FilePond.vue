<script setup>
import vueFilePond from "vue-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm.js'

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Upload atau Drag File'
  },
  accepted: {
    type: String,
    default: 'image/jpeg, image/png'
  },
  files: {
    type: Array,
    default: () => []
  },
  label: {
    type: [String, Number]
  },
  labelClass: {
    type: [String, Object, Array],
    default: 'form-label'
  },
})


const FilePond = vueFilePond(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
)

</script>

<template>
  <div>
    <div class="d-flex flex-row justify-content-between">
      <label v-if="props.label" :class="props.labelClass"> {{ props.label }}</label>
      <slot name="extra-label" />
    </div>

    <FilePond :label-idle="props.placeholder" :accepted-file-types="props.accepted" :files="props.files" v-bind="$attrs"
      label-invalid-field="Terdapat Beberapa file Yang Tidak Diijinkan" :instant-upload="false" />
  </div>
</template>

<style>
.filepond--root {
  font-family: -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', Roboto, Helvetica, Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}

.filepond--credits {
  display: none;
}

.filepond--panel .filepond--panel-root {
  background-color: var(--bs-light);
  border: 2px dashed var(--bs-primary);
}

.filepond--drop-label {
  color: var(--bs-primary);
  font-size: 18px !important;
  font-weight: bolder !important;
}
</style>