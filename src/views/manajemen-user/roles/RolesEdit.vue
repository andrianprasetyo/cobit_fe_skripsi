<script setup>
import { reactive, computed, onMounted } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import BaseSelect from '@/components/Select/BaseSelect.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import CKEditor from '@/components/CKEditor/CKEditor.vue'

import RolesServices from '@/services/lib/roles'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useToast } from '@/stores/toast';
import { useRouter, useRoute } from 'vue-router';
import { useLoading } from 'vue-loading-overlay';

const route = useRoute()
const router = useRouter()
const toast = useToast()
const loading = useLoading()

/* ---------------------------------- STATE --------------------------------- */
const formState = reactive({
  loadingSubmit: false,
  nama: '',
  deskripsi: '',
  status: '',
  listStatus: [
    {
      id: 1,
      label: "Aktif",
      value: 1
    },
    {
      id: 2,
      label: "Tidak Aktif",
      value: 0
    }
  ]
})

const rules = computed(() => {
  return {
    nama: {
      required: helpers.withMessage("Silahkan isi nama", required)
    },
    deskripsi: {
      required: helpers.withMessage("Silahkan isi deskripsi", required)
    },
    status: {
      required: helpers.withMessage("Silahkan pilih status", required)
    },
  }
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true })

/* --------------------------------- METHODS -------------------------------- */
const getDetailRoles = async () => {
  const loader = loading.show()

  try {
    formState.loading = true
    const response = await RolesServices.getDetailRoles({ id: route.params?.id })

    if (response) {
      const data = response?.data;

      formState.nama = data?.nama
      formState.deskripsi = data?.deskripsi || ''
      formState.status = data?.aktif ? 1 : 0

      formState.loading = false
      loader.hide()
    }

  } catch (error) {
    formState.loading = false
    loader.hide()
    toast.error({ error })
  }
}

const handleBack = () => {
  router.back()
}

const handleSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const loader = loading.show()
    try {
      formState.loadingSubmit = true

      const response = await RolesServices.editRoles({
        id: route.params?.id,
        nama: formState.nama,
        deskripsi: formState.deskripsi,
        aktif: formState.status === 1 ? true : false
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Edit Roles',
          text: 'Berhasil Mengubah Data Roles'
        })
        handleBack()
      }
    } catch (error) {
      loader.hide()
      formState.loadingSubmit = false
      toast.error({ error })
    }
  }
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getDetailRoles()
})

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-9 fw-semibold">Roles</h5>

          <div class="mb-3">
            <BaseInput id="nama" v-model="v$.nama.$model" label="Nama" placeholder="Masukkan Nama"
              :isInvalid="!!v$.nama.$errors?.length" tabindex="1"
              :disabled="formState.loadingSubmit || formState.loading" />
            <ErrorMessage :errors="v$.nama.$errors" />
          </div>

          <div class="mb-3">
            <label class="form-label" for="deskripsi">Deskripsi</label>

            <CKEditor id="deskripsi" tabindex="2" v-model="v$.deskripsi.$model"
              :isInvalid="!!v$.deskripsi.$errors?.length" :disabled="formState.loadingSubmit" />
            <ErrorMessage v-if="v$.deskripsi.$errors" :errors="v$.deskripsi.$errors" />
          </div>

          <div class="mb-3">
            <BaseSelect id="status" v-model="v$.status.$model" label="Status" tabindex="3" default-option="Pilih Status"
              :options="formState.listStatus" options-label="label" options-value="value"
              :disabled="formState.loadingSubmit" />
          </div>

          <div class="d-flex flex-column flex-md-row align-items-center mt-5">
            <div>
              <BaseButton @click="handleBack" class="btn btn-outline-primary me-0 me-md-3 mb-2 mb-md-0" title="Kembali">
                <template #icon-left>
                  <TablerIcon icon="ChevronLeftIcon" />
                </template>
              </BaseButton>
            </div>

            <div>
              <BaseButton @click="handleSubmit" title="Simpan" :disabled="formState.loadingSubmit"
                :is-loading="formState.loadingSubmit">
                <template #icon-left>
                  <TablerIcon icon="DeviceFloppyIcon" />
                </template>
              </BaseButton>
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>