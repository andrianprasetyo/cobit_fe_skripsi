<script setup>
import { reactive, watch } from 'vue'
import debounce from 'lodash.debounce'

import { useToast } from '@/stores/toast'

import BaseModal from '@/components/Modal/BaseModal.vue'
import BaseButton from '@/components/Button/BaseButton.vue'

import OrganisasiServices from '@/services/lib/organisasi'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  activeFilter: {
    type: Object
  }
})

const emit = defineEmits(['close', 'submit'])

const toast = useToast()

/* ---------------------------------- STATE --------------------------------- */
const filterState = reactive({
  listOrganisasi: {
    loading: false,
    data: []
  },
  organisasi_id: ''
})

/* --------------------------------- METHODS -------------------------------- */
const handleSearchOrganisasi = debounce(async ({ search }) => {
  try {
    const response = await OrganisasiServices.getListOrganisasi({ limit: 10, page: 1, search })

    if (response) {
      const data = response?.data

      filterState.listOrganisasi.data = data?.list || []
    }

  } catch (error) {
    toast.error({ error })
  }
}, 500)


const handleReset = () => {
  filterState.organisasi_id = ''
}

const handleClose = () => {
  handleReset()
  emit('close')
}

const handleSubmit = () => {
  emit('submit', { organisasi_id: filterState.organisasi_id })
  handleClose()
}

/* ---------------------------------- HOOKS --------------------------------- */
watch(
  () => props.open,
  () => {
    if (props.open) {
      handleSearchOrganisasi({ limit: 12, page: 1 })

      filterState.organisasi_id = props.activeFilter?.organisasi_id || ''
    }
  },
  { deep: true }
)

</script>

<template>
  <BaseModal id="modal-filter-card" :open="props.open" @close="handleClose" class-name-modal="modal-md"
    title-footer="Batal" :show-btn-close-footer="false">
    <template #header>
      <h4 class="modal-title">
        Filter Project
      </h4>
    </template>
    <template #body>
      <div class="row">
        <div class="col-12 col-md-12">
          <label class="form-label" for="filter-organisasi">Organisasi</label>

          <v-select id="filter-organisasi" @search="(search) => handleSearchOrganisasi({ search })" :filterable="false"
            :options="filterState.listOrganisasi.data" v-model="filterState.organisasi_id"
            :disabled="filterState.listOrganisasi.loading" label="nama" :reduce="organisasi => organisasi?.id"
            :loading="filterState.listOrganisasi.loading" placeholder="Cari Organisasi" :select-on-key-codes="[]">
            <template #no-options>
              Tidak ada Organisasi Ditemukan
            </template>

            <template #option="option">
              <div class="d-flex flex-row align-items-center py-1">
                <span class="me-2 fw-bold text-wrap">
                  {{ option.nama }}
                </span>
              </div>
            </template>

            <template #selected-option="option">
              <div class="d-flex flex-row align-items-center py-1">
                <span class="me-2 fw-bold text-wrap">
                  {{ option.nama }}
                </span>
              </div>
            </template>
          </v-select>
        </div>
      </div>
    </template>

    <template #footer>
      <BaseButton title="Filter" @click="handleSubmit" :disabled="!filterState.organisasi_id" :access="['project']" />
    </template>
  </BaseModal>
</template>
