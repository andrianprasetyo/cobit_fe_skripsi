<script setup>
import { reactive, computed, watch, onMounted } from 'vue'
import debounce from 'lodash.debounce'

import BaseInput from '@/components/Input/BaseInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
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
  selectedJabatan: {
    type: Object
  }
})

const emits = defineEmits(['close', 'refresh'])

/* ---------------------------------- STATE --------------------------------- */
const formState = reactive({
  loadingSubmit: false,
  nama: '',
  listDivisi: {
    loading: false,
    data: []
  },
  organisasi_divisi_id: null,
})

const rules = computed(() => {
  return {
    organisasi_divisi_id: {
      required: helpers.withMessage('Silahkan pilih divisi', required)
    },
    nama: {
      required: helpers.withMessage('Silahkan isi nama', required),
    },
  }
})

const v$ = useVuelidate(rules, formState, { $autoDirty: false })

/* --------------------------------- METHODS -------------------------------- */
const handleSearchDivisi = debounce(async ({ search }) => {
  try {
    const response = await OrganisasiServices.getListDivisi({ limit: 10, page: 1, search, organisasi_id: route.params?.id })

    if (response) {
      const data = response?.data

      formState.listDivisi.data = data?.list || []
    }

  } catch (error) {
    toast.error({ error })
  }
}, 500)

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

      const response = await OrganisasiServices.createJabatan({
        nama: formState.nama,
        organisasi_divisi_id: formState.organisasi_divisi_id,
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

      const response = await OrganisasiServices.editJabatan({
        id: props.selectedJabatan?.id,
        organisasi_divisi_id: formState.organisasi_divisi_id,
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
  formState.nama = props.selectedJabatan?.nama || ''
  formState.organisasi_divisi_id = props.selectedJabatan?.divisi || ''
}

const resetState = () => {
  formState.nama = ''
  formState.organisasi_divisi_id = null
}


/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  handleSearchDivisi({ search: '' })
})

watch(() => [props.isOnEdit], () => {
  if (props.isOnEdit) {
    setValueToForm()
  }
}, { deep: true })

</script>

<template>
  <BaseModal id="organisasi_jabatan" :order="2" :open="props.isShow" :showBtnCloseFooter="false" classNameModal="modal-lg"
    @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        {{ props.isOnEdit ? 'Edit' : 'Tambah' }} Jabatan
      </h4>
    </template>

    <template #body>
      <div class="mb-3">
        <label class="form-label" for="divisi_jabatan">Divisi</label>

        <v-select id="divisi_jabatan" @search="(search) => handleSearchDivisi({ search })" :filterable="false"
          :options="formState.listDivisi.data" v-model="formState.organisasi_divisi_id" :reduce="(state) => state?.id"
          :disabled="formState.listDivisi.loading || formState.loadingSubmit" label="nama" placeholder="Cari Divisi"
          :select-on-key-codes="[]" :class="{ 'invalid-v-select': v$.organisasi_divisi_id.$errors?.length }">
          <template #no-options>
            Tidak ada Divisi Ditemukan
          </template>

          <template #option="option">
            <div class="d-flex flex-row align-items-center py-1 width-150px">
              <span class="me-2 fw-bold text-truncate">
                {{ option.nama }}
              </span>
            </div>
          </template>

          <template #selected-option="option">
            <div class="d-flex flex-row align-items-center py-1 width-150px ">
              <span class="me-2 fw-bold text-truncate">
                {{ option.nama }}
              </span>
            </div>
          </template>

        </v-select>
        <ErrorMessage :errors="v$.organisasi_divisi_id.$errors" />
      </div>

      <div class="mb-3">
        <BaseInput id="nama" v-model="v$.nama.$model" label="Nama Jabatan" placeholder="Masukkan Nama Jabatan"
          tabindex="2" :isInvalid="v$.nama.$errors?.length" :disabled="formState.loadingSubmit" />
        <ErrorMessage :errors="v$.nama.$errors" />
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