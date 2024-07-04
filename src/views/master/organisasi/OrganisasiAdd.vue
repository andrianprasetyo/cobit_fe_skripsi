<script setup>
import { reactive, computed } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import CKEditor from '@/components/CKEditor/CKEditor.vue'

import OrganisasiServices from '@/services/lib/organisasi'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useRouter } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

const toast = useToast()
const router = useRouter()
const loading = useLoading()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loadingSubmit: false,
  nama: '',
  deskripsi: '',
  /*
  divisi: [],
  jabatan: []
  */
})

const rules = computed(() => {
  return {
    nama: {
      required: helpers.withMessage('Silahkan isi nama', required),
    },
    deskripsi: {
      required: helpers.withMessage("Silahkan isi deskripsi", required)
    },
    /*
    divisi: {
      required: helpers.withMessage("Silahkan isi divisi", required),
    },
    jabatan: {
      required: helpers.withMessage("Silahkan isi jabatan", required)
    }
    */
  }
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true })

/* --------------------------------- METHODS -------------------------------- */
const handleBack = () => {
  router.back()
}
/*
const dropdownDivisiShouldOpen = (VueSelect) => {
  if (VueSelect.search?.length) {
    return VueSelect.open;
  } else {
    return false;
  }
}

const dropdownJabatanShouldOpen = (VueSelect) => {
  if (VueSelect.search?.length) {
    return VueSelect.open;
  } else {
    return false;
  }
}
*/

const handleSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const loader = loading.show()
    try {
      formState.loadingSubmit = true

      const divisi_jabatan = []

      if (formState.divisi?.length) {
        formState.divisi.map((item) => divisi_jabatan.push({
          nama: item,
          jenis: 'divisi'
        }))
      }

      if (formState.jabatan?.length) {
        formState.jabatan.map((item) => divisi_jabatan.push({
          nama: item,
          jenis: 'jabatan'
        }))
      }

      const response = await OrganisasiServices.createOrganisasi({
        nama: formState.nama,
        deskripsi: formState.deskripsi,
        divisi_jabatan: divisi_jabatan
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Tambah Organisasi',
          text: 'Berhasil Menambahkan Data Organisasi'
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

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-9 fw-semibold">Organisasi</h5>

          <div class="mb-3">
            <BaseInput id="nama" v-model="v$.nama.$model" label="Nama" placeholder="Masukkan Nama" tabindex="1"
              :isInvalid="v$.nama.$errors?.length" :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.nama.$errors" />
          </div>

          <div class="mb-3">
            <label class="form-label" for="deskripsi">Deskripsi</label>

            <CKEditor id="deskripsi" v-model="v$.deskripsi.$model" tabindex="2"
              :isInvalid="!!v$.deskripsi.$errors?.length" :disabled="formState.loadingSubmit" />

            <ErrorMessage :errors="v$.deskripsi.$errors" />
          </div>

          
          <!-- <div class="mb-3">
            <label class="form-label" for="divisi">Daftar Divisi</label>

            <v-select id="divisi" taggable multiple v-model="formState.divisi" placeholder="Tambahkan Divisi"
              :dropdown-should-open="dropdownDivisiShouldOpen" :tabindex="3"
              :class="{ 'invalid-v-select': v$.divisi.$errors?.length }" :disabled="formState.loadingSubmit"
              :select-on-key-codes="[]">
              <template #option="option">
                <div class="d-flex flex-row align-items-center py-1">
                  <span class="me-2 fw-bold">
                    Tambahkan Divisi <span class="fw-bold">{{ option.label }}</span>
                  </span>
                </div>
              </template>

              <template #selected-option="option">
                <div class="d-flex flex-row align-items-center py-1">
                  <span class="me-2 fw-bold">
                    {{ option.label }}
                  </span>
                </div>
              </template>
            </v-select>

            <ErrorMessage :errors="v$.divisi.$errors" />
          </div>

          <div class="mb-3">
            <label class="form-label" for="jabatan">Daftar Jabatan</label>

            <v-select id="jabatan" taggable multiple v-model="formState.jabatan" placeholder="Tambahkan Jabatan"
              :dropdown-should-open="dropdownJabatanShouldOpen" :tabindex="4"
              :class="{ 'invalid-v-select': v$.jabatan.$errors?.length }" :disabled="formState.loadingSubmit"
              :select-on-key-codes="[]">
              <template #option="option">
                <div class="d-flex flex-row align-items-center py-1">
                  <span class="me-2 fw-bold">
                    Tambahkan Jabatan <span class="fw-bold">{{ option.label }}</span>
                  </span>
                </div>
              </template>

              <template #selected-option="option">
                <div class="d-flex flex-row align-items-center py-1">
                  <span class="me-2 fw-bold">
                    {{ option.label }}
                  </span>
                </div>
              </template>
            </v-select>

            <ErrorMessage :errors="v$.jabatan.$errors" />
          </div> -->
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="d-flex flex-column flex-md-row align-items-center">
            <div>
              <BaseButton @click="handleBack" class="btn btn-outline-primary me-0 me-md-3 mb-2 mb-md-0" title="Kembali">
                <template #icon-left>
                  <TablerIcon icon="ChevronLeftIcon" />
                </template>
              </BaseButton>
            </div>

            <div>
              <BaseButton @click="handleSubmit" title="Simpan" :disabled="formState.loadingSubmit"
                :is-loading="formState.loadingSubmit" :access="['master-organisasi-add']">
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