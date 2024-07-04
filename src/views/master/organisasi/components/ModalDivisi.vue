<script setup>
import { reactive, computed, watch } from 'vue'

import BaseInput from '@/components/Input/BaseInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseCheckboxInputWithVModel from '@/components/Input/BaseCheckboxInputWithVModel.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'

import OrganisasiServices from '@/services/lib/organisasi'

import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

const toast = useToast()
const route = useRoute()
const loading = useLoading()

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
  isOnEdit: {
    type: Boolean,
    default: false
  },
  selectedDivisi: {
    type: Object
  }
})

const emits = defineEmits(['close', 'refresh'])

/* ---------------------------------- STATE --------------------------------- */
const formState = reactive({
  loadingSubmit: false,
  nama: '',
  is_specific_df: false
})

const rules = computed(() => {
  return {
    nama: {
      required: helpers.withMessage('Silahkan isi nama', required),
    },
  }
})

const v$ = useVuelidate(rules, formState, { $autoDirty: false })

/* --------------------------------- METHODS -------------------------------- */
const handleClose = () => {
  emits('close', true)
  resetState()
  v$.value.$reset()
}

const handleRefreshList = () => {
  emits('refresh')
}

const handleSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const loader = loading.show()

    try {
      formState.loadingSubmit = true

      const response = await OrganisasiServices.createDivisi({
        nama: formState.nama,
        is_specific_df: formState.is_specific_df,
        organisasi_id: route.params?.id,
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        resetState()
        v$.value.$reset()
        handleClose()
        handleRefreshList()
      }
    } catch (error) {
      loader.hide()
      formState.loadingSubmit = false
      toast.error({ error })
    }
  }
}

const handleSubmitEdit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const loader = loading.show()

    try {
      formState.loadingSubmit = true

      const response = await OrganisasiServices.editDivisi({
        id: props.selectedDivisi?.id,
        is_specific_df: formState.is_specific_df,
        nama: formState.nama,
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        resetState()
        v$.value.$reset()
        handleClose()
        handleRefreshList()
      }
    } catch (error) {
      loader.hide()
      formState.loadingSubmit = false
      toast.error({ error })
    }
  }
}

const onSubmit = () => {
  if (props.isOnEdit) {
    handleSubmitEdit()
  } else {
    handleSubmit()
  }
}

const setValueToForm = () => {
  formState.nama = props.selectedDivisi?.nama || ''
  formState.is_specific_df = !!props?.selectedDivisi?.is_specific_df
}

const resetState = () => {
  formState.nama = ''
  formState.is_specific_df = false
}

watch(() => [props.isOnEdit], () => {
  if (props.isOnEdit) {
    setValueToForm()
  }
}, { deep: true })

</script>

<template>
  <BaseModal id="organisasi_divisi" :order="1" :open="props.isShow" :showBtnCloseFooter="false"
    classNameModal="modal-lg" @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        {{ props.isOnEdit ? 'Edit' : 'Tambah' }} Divisi
      </h4>
    </template>

    <template #body>
      <div class="mb-3">
        <BaseInput id="nama" v-model="v$.nama.$model" label="Nama Divisi" placeholder="Masukkan Nama Divisi"
          tabindex="1" :isInvalid="v$.nama.$errors?.length" :disabled="formState.loadingSubmit" />
        <ErrorMessage :errors="v$.nama.$errors" />
      </div>

      <div class="mb-3">
        <label class="form-label" for="is_specific_df">
          Apakah Design Factor Spesifik?
        </label>

        <BaseCheckboxInputWithVModel id="is_specific_df" name="is_specific_df" label="Ya"
          v-model="formState.is_specific_df" :true-value="true" :false-value="false"
          :disabled="formState.loadingSubmit" />
      </div>
    </template>

    <template #footer>
      <BaseButton @click="onSubmit" title="Simpan" :disabled="formState.loadingSubmit"
        :is-loading="formState.loadingSubmit" :access="['master-organisasi-add', 'master-organisasi-edit']">
        <template #icon-left>
          <TablerIcon icon="DeviceFloppyIcon" />
        </template>
      </BaseButton>
    </template>
  </BaseModal>
</template>