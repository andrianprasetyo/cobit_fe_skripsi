<script setup>
import BaseModal from '@/components/Modal/BaseModal.vue'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close'])

const handleClose = () => {
  emits('close', true)
}

</script>

<template>
  <BaseModal id="hasil_quisioner" :order="2" :open="props.isShow" :showBtnCloseFooter="true" classNameModal="modal-lg"
    @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Hasil Quisioner
      </h4>
    </template>
  </BaseModal>
</template>