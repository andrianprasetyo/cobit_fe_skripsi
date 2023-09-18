<script setup>
import { reactive, computed, watch } from 'vue'
import debounce from 'lodash.debounce'

import BaseInput from '@/components/Input/BaseInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'

import { useVuelidate } from "@vuelidate/core";
import { helpers, required, email } from "@vuelidate/validators";
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useToast } from '@/stores/toast'
import { useLoading } from 'vue-loading-overlay'

import AssessmentServices from '@/services/lib/assessment'
import OrganisasiServices from '@/services/lib/organisasi'

const assessment = useAssessmentStore()
const toast = useToast()
const loading = useLoading()

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'refresh'])

/* ---------------------------------- STATE --------------------------------- */
const formState = reactive({
  loadingSubmit: false,
  pic_nama: '',
  pic_email: '',
  pic_divisi: '',
  pic_jabatan: '',
})

const listDivisi = reactive({
  loading: false,
  data: []
})

const listJabatan = reactive({
  loading: false,
  data: []
})

/* -------------------------------- COMPUTED -------------------------------- */
const rules = computed(() => {
  return {
    pic_nama: {
      required: helpers.withMessage("Silahkan isi nama PIC", required)
    },
    pic_email: {
      required: helpers.withMessage("Silahkan isi email PIC", required),
      email: helpers.withMessage("Alamat email tidak valid", email)
    },
    pic_divisi: {
      required: helpers.withMessage("Silahkan isi divisi PIC", required)
    },
    pic_jabatan: {
      required: helpers.withMessage("Silahkan isi jabatan PIC", required)
    },
  }
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true })

/* --------------------------------- METHODS -------------------------------- */
const handleSearchJabatan = debounce(async ({ search }) => {
  try {
    const response = await OrganisasiServices.getListJabatan({ limit: 10, page: 1, search, organisasi_divisi_id: formState.pic_divisi?.id })

    if (response) {
      const data = response?.data

      listJabatan.data = data?.list || []
    }

  } catch (error) {
    toast.error({ error })
  }
}, 500)

const handleSearchDivisi = debounce(async ({ search }) => {
  try {
    const response = await OrganisasiServices.getListDivisi({ limit: 10, page: 1, search, organisasi_id: assessment.detail?.organisasi?.id })

    if (response) {
      const data = response?.data

      listDivisi.data = data?.list || []
    }

  } catch (error) {
    toast.error({ error })
  }
}, 500)

const handleClose = () => {
  emits('close', true)
}

const setValueToForm = () => {
  formState.pic_nama = assessment.detail?.pic?.nama || ''
  formState.pic_email = assessment.detail?.pic?.email || ''
  formState.pic_divisi = assessment.detail?.pic?.divisi || ''
  formState.pic_jabatan = assessment.detail?.pic?.jabatan || ''
}

const onSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const loader = loading.show()
    try {
      formState.loadingSubmit = true

      const response = await AssessmentServices.editPic({
        id: assessment.detail?.pic?.id,
        pic_nama: formState.pic_nama,
        pic_email: formState.pic_email,
        pic_divisi_id: formState.pic_divisi?.id,
        pic_jabatan_id: formState.pic_jabatan?.id,
        
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Edit PIC',
          text: 'Berhasil Mengubah Data PIC'
        })
        assessment.$patch({
          detail: {
            ...assessment.detail, pic: {
              ...assessment.detail.pic,
              nama: formState.pic_nama,
              email: formState.pic_email,
              divisi: formState.pic_divisi,
              posisi: formState.pic_jabatan
            }
          }
        })
        v$.value.$reset()
        handleClose()
      }
    } catch (error) {
      loader.hide()
      formState.loadingSubmit = false
      toast.error({ error })
    }
  }
}

watch(() => [props.isShow], () => {
  if (props.isShow) {
    setValueToForm()

    if (!listDivisi.data.length) {
      handleSearchDivisi({ search: '' })
    }
  }
}, { deep: true })

watch(() => [formState.pic_divisi], () => {
  if (formState.pic_divisi?.id) {
    handleSearchJabatan({ search: '' })
  }
}, { deep: true })
</script>

<template>
  <BaseModal id="edit_pic" :order="3" :open="props.isShow" :showBtnCloseFooter="false" classNameModal="modal-lg"
    @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Edit PIC
      </h4>
    </template>

    <template #body>
      <div class="mb-3">
        <BaseInput id="pic_nama" v-model="v$.pic_nama.$model" label="Nama PIC" placeholder="Masukkan Nama PIC"
          tabindex="1" :isInvalid="v$.pic_nama.$errors?.length" :disabled="formState.loadingSubmit" />
        <ErrorMessage :errors="v$.pic_nama.$errors" />
      </div>

      <div class="mb-3">
        <BaseInput id="pic_email" v-model="v$.pic_email.$model" label="Email PIC" placeholder="Masukkan Email PIC"
          tabindex="2" :isInvalid="v$.pic_email.$errors?.length" :disabled="formState.loadingSubmit" />
        <ErrorMessage :errors="v$.pic_email.$errors" />
      </div>

      <div class="mb-3">
        <label class="form-label" for="divisi">Divisi</label>

        <v-select id="divisi" @search="(search) => handleSearchDivisi({ search })" :filterable="false"
          :options="listDivisi.data" v-model="formState.pic_divisi"
          :disabled="listDivisi.loading || formState.loadingSubmit" label="nama" placeholder="Cari Jabatan"
          :select-on-key-codes="[]" :class="{ 'invalid-v-select': v$.pic_divisi.$errors?.length }">
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
        <ErrorMessage :errors="v$.pic_divisi.$errors" />
      </div>

      <div class="mb-3">
        <label class="form-label" for="jabatan">Jabatan</label>

        <v-select id="jabatan" @search="(search) => handleSearchJabatan({ search })" :filterable="false"
          :options="listJabatan.data" v-model="formState.pic_jabatan"
          :disabled="listJabatan.loading || formState.loadingSubmit || !formState.pic_divisi" label="nama"
          placeholder="Cari Jabatan" :select-on-key-codes="[]"
          :class="{ 'invalid-v-select': v$.pic_jabatan.$errors?.length }">
          <template #no-options>
            Tidak ada Jabatan Ditemukan
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
        <ErrorMessage :errors="v$.pic_jabatan.$errors" />
      </div>
    </template>

    <template #footer>
      <BaseButton @click="onSubmit" title="Simpan Perubahan" :disabled="formState.loadingSubmit"
        :is-loading="formState.loadingSubmit">
        <template #icon-left>
          <TablerIcon icon="DeviceFloppyIcon" />
        </template>
      </BaseButton>
    </template>
  </BaseModal>
</template>