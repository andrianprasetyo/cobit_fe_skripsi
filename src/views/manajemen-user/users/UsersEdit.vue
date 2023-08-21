<script setup>
import { reactive, computed, onMounted } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import BaseSelect from '@/components/Select/BaseSelect.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'

import UsersServices from '@/services/lib/users'
import RolesServices from '@/services/lib/roles'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useRouter, useRoute } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

import statusUserType from '@/data/statusUserType.json'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const loading = useLoading()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loading: false,
  loadingSubmit: false,
  nama: '',
  username: '',
  email: '',
  status: '',
  role_id: '',
  roles: {
    loading: false,
    data: []
  }
})

const rules = computed(() => {
  return {
    nama: {
      required: helpers.withMessage("Silahkan isi nama", required)
    },
    status: {
      required: helpers.withMessage("Silahkan pilih status", required)
    },
  }
})

const v$ = useVuelidate(rules, formState, { $autoDirty: false })

/* --------------------------------- METHODS -------------------------------- */
const getDetailUsers = async () => {
  const loader = loading.show()

  try {
    formState.loading = true
    const response = await UsersServices.getDetailUsers({ id: route.params?.id })

    if (response) {
      const data = response?.data;

      formState.nama = data?.nama
      formState.username = data?.username
      formState.email = data?.email
      formState.status = data?.status

      if (Array.isArray(data?.roles) && data?.roles?.length) {
        formState.role_id = data?.roles[0]?.role?.id
      }

      formState.loading = false
      loader.hide()
    }

  } catch (error) {
    formState.loading = false
    loader.hide()
    toast.error({ error })
  }
}

const getListRoles = async () => {
  try {
    formState.roles.loading = true
    const response = await RolesServices.getListRoles()

    if (response) {
      const data = response?.data

      formState.roles.data = data.list || []
      formState.roles.loading = false
    }
  } catch (error) {
    formState.roles.loading = false
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

      const response = await UsersServices.editUsers({
        id: route.params?.id,
        nama: formState.nama,
        status: formState.status,
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Edit Users',
          text: 'Berhasil Mengubah Data Users'
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
  getDetailUsers()
  getListRoles()
})

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-9 fw-semibold">Users</h5>

          <div class="mb-3">
            <BaseInput id="username" v-model="formState.username" label="Username" placeholder="Masukkan Username"
              tabindex="1" :disabled="true" />
          </div>

          <div class="mb-3">
            <BaseInput id="email" v-model="formState.email" label="Email" placeholder="Masukkan Email" tabindex="2"
              :disabled="true" />
          </div>

          <div class="mb-3">
            <BaseInput id="nama" v-model="v$.nama.$model" label="Nama" placeholder="Masukkan Nama" tabindex="3"
              :isInvalid="!!v$.nama.$errors?.length" :disabled="formState.loadingSubmit || formState.loading" />
            <ErrorMessage :errors="v$.nama.$errors" />
          </div>

          <div class="mb-3">
            <BaseSelect id="role" v-model="formState.role_id" label="Role" tabindex="4"
              :default-option="formState.roles.loading ? 'Loading...' : 'Pilih Role'" :options="formState.roles.data"
              options-label="nama" options-value="id" :disabled="true">
            </BaseSelect>
          </div>

          <div class="mb-3">
            <BaseSelect id="status" v-model="v$.status.$model" label="Status" tabindex="5" default-option="Pilih Status"
              :options="statusUserType" :isInvalid="!!v$.status.$errors?.length"
              :disabled="formState.loadingSubmit || formState.loading">
            </BaseSelect>
            <ErrorMessage :errors="v$.status.$errors" />
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