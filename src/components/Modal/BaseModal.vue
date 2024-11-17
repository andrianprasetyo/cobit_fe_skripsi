<script setup>
import BaseButton from '@/components/Button/BaseButton.vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  order: {
    type: [String, Number],
    default: 1,
  },
  open: {
    type: Boolean,
    default: false,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  showBtnCloseFooter: {
    type: Boolean,
    default: true,
  },
  classNameModal: {
    type: [Array, String]
  },
  classNameModalBody: {
    type: [Array, String]
  },
  classNameModalContent: {
    type: [Array, String]
  },
  isStatic: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close', true)
}

</script>

<template>
  <portal to="modal" :order="props.order">
    <Transition name="fade-top" mode="out-in">
      <div v-if="props.open" ref="baseModal" :id="id" class="modal fade" :class="[props.open ? 'show d-block' : '']"
        tabindex="-1" aria-modal="true" role="dialog" data-bs-backdrop="static" @keydown.esc="handleClose"
        v-bind="$attrs">
        <div class="modal-dialog modal-dialog-centered" :class="props.classNameModal">
          <div class="modal-content" :class="props.classNameModalContent">
            <div class="modal-header">
              <slot name="header" />

              <BaseButton :id="`close_button_modal_${props.id}`" @click="handleClose" type="button" class="btn-close"
                data-bs-dismiss="modal" aria-label="Close">
              </BaseButton>
            </div>

            <div ref="modal-body" class="modal-body px-sm-5 mx-50 pb-4" :class="props.classNameModalBody">
              <slot name="body" />
            </div>

            <div v-if="props.showFooter" class="modal-footer">
              <slot name="footer" />

              <BaseButton v-if="props.showBtnCloseFooter" @click="handleClose" class="btn btn-primary"
                data-bs-dismiss="modal" aria-label="Close">
                Tutup
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <div v-if="props.open" class="modal-backdrop fade" :class="[props.open ? 'show' : '']"></div>
  </portal>
</template>

<style scoped>
.show-modal {
  display: block;
}
</style>