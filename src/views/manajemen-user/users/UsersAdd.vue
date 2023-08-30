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
import { required, helpers, email } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useRouter } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

import statusUserType from '@/data/statusUserType.json'

const toast = useToast()
const router = useRouter()
const loading = useLoading()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loading: false,
  loadingSubmit: false,
  nama: '',
  username: '',
  email: '',
  role_id: '',
  status: '',
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
    username: {
      required: helpers.withMessage("Silahkan isi username", required)
    },
    email: {
      required: helpers.withMessage("Silahkan isi email", required),
      email: helpers.withMessage("Alamat Email tidak Valid", email)
    },
    role_id: {
      required: helpers.withMessage("Silahkan pilih role", required)
    },
    status: {
      required: helpers.withMessage("Silahkan pilih status", required)
    },
  }
})

const v$ = useVuelidate(rules, formState, { $autoDirty: false })

/* --------------------------------- METHODS -------------------------------- */
const getListRoles = async () => {
  try {
    formState.roles.loading = true
    const response = await RolesServices.getListRoles()

    if (response) {
      const data = response?.data

      const listRoles = []

      if (Array.isArray(data?.list) && data?.list?.length) {
        data?.list.map(item => {
          if (item?.code !== 'eksternal') {
            listRoles.push(item)
          }
        })
      }

      formState.roles.data = listRoles
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

      const response = await UsersServices.createUsers({
        nama: formState.nama,
        username: formState.username,
        email: formState.email,
        status: formState.status,
        role_id: formState.role_id
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Tambah Users',
          text: 'Berhasil Menambah Data Users'
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
            <BaseInput id="username" v-model.trim="v$.username.$model" label="Username" placeholder="Masukkan Username"
              :isInvalid="!!v$.username.$errors?.length" tabindex="1"
              :disabled="formState.loadingSubmit || formState.loading" />
            <ErrorMessage :errors="v$.username.$errors" />
          </div>

          <div class="mb-3">
            <BaseInput id="email" v-model="v$.email.$model" label="Email" placeholder="Masukkan Email" tabindex="2"
              :isInvalid="!!v$.email.$errors?.length" :disabled="formState.loadingSubmit || formState.loading" />
            <ErrorMessage :errors="v$.email.$errors" />
          </div>

          <div class="mb-3">
            <BaseInput id="nama" v-model="v$.nama.$model" label="Nama" placeholder="Masukkan Nama" tabindex="3"
              :isInvalid="!!v$.nama.$errors?.length" :disabled="formState.loadingSubmit || formState.loading" />
            <ErrorMessage :errors="v$.nama.$errors" />
          </div>

          <div class="mb-3">
            <BaseSelect id="role" v-model="v$.role_id.$model" label="Role" tabindex="4"
              :default-option="formState.roles.loading ? 'Loading...' : 'Pilih Role'" :options="formState.roles.data"
              :isInvalid="!!v$.role_id.$errors?.length" options-label="nama" options-value="id"
              :disabled="formState.loadingSubmit || formState.loading || formState.roles.loading">
            </BaseSelect>
            <ErrorMessage :errors="v$.role_id.$errors" />
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