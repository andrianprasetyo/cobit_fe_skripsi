<script setup>
import { reactive, computed } from 'vue'
import debounce from 'lodash.debounce'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import DateInput from '@/components/Input/DateInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import CKEditor from '@/components/CKEditor/CKEditor.vue'

import AssessmentServices from '@/services/lib/assessment'
import OrganisasiServices from '@/services/lib/organisasi'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, requiredIf, email } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useRouter } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

const toast = useToast()
const router = useRouter()
const loading = useLoading()


/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loadingSubmit: false,
  assessment: '',
  deskripsi: '',
  tahun: '',
  pic_nama: '',
  pic_email: '',
  pic_divisi: '',
  pic_jabatan: '',
  organisasi: null,
  organisasi_id: '',
  organisasi_nama: '',
  organisasi_deskripsi: '',
})

const listOrganisasi = reactive({
  loading: false,
  data: []
})

const rules = computed(() => {
  return {
    assessment: {
      required: helpers.withMessage('Silahkan isi nama assessment', required),
    },
    deskripsi: {
      required: helpers.withMessage("Silahkan isi deskripsi", required)
    },
    tahun: {
      required: helpers.withMessage("Silahkan pilih tahun", required)
    },
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
    organisasi_nama: {
      requiredIf: helpers.withMessage("Silahkan isi nama organisasi", requiredIf(!formState.organisasi_id))
    },
    organisasi_deskripsi: {
      required: helpers.withMessage("Silahkan isi deskripsi organisasi", required)
    }
  }
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true })

/* --------------------------------- METHODS -------------------------------- */

/*
const getListOrganisasi = async ({ limit, page, search }) => {
  try {
    listOrganisasi.loading = true
    const response = await OrganisasiServices.getListOrganisasi({ limit, page, search })

    if (response) {
      const data = response?.data

      listOrganisasi.data = data?.list || []
      listOrganisasi.loading = false
    }
  } catch (error) {
    listOrganisasi.loading = false
    toast.error({ error })
  }
}
*/

const handleAddOrganisasi = ({ value }) => {
  listOrganisasi.data = [{ nama: value }]
  formState.organisasi_nama = value
}

const dropdownOrganisasiShouldOpen = (VueSelect) => {
  if (VueSelect.search?.length) {
    return VueSelect.open;
  } else {
    return false;
  }
}

const handleSearchOrganisasi = debounce(async ({ search }) => {
  try {
    const response = await OrganisasiServices.getListOrganisasi({ limit: 10, page: 1, search })

    if (response) {
      const data = response?.data

      listOrganisasi.data = data?.list || []
    }

  } catch (error) {
    toast.error({ error })
  }
}, 500)

const handleSelectedOrganisasi = ({ id, nama, deskripsi }) => {
  if (id) {
    formState.organisasi_id = id;
    formState.organisasi_nama = nama;
    formState.organisasi_deskripsi = deskripsi || ''
  } else {
    formState.organisasi_nama = nama;
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

      const tahun = new Date(formState?.tahun?.year, formState?.tahun?.month - 1)

      const formattedTahun = `${tahun.getFullYear()}-${(tahun.getMonth() + 1).toString().padStart(2, '0')}`;

      let payload = {
        asessment: formState.assessment,
        deskripsi: formState.deskripsi,
        tahun: formattedTahun,
        pic_nama: formState.pic_nama,
        pic_email: formState.pic_email,
        pic_divisi: formState.pic_divisi,
        pic_jabatan: formState.pic_jabatan,
        organisasi_nama: formState.organisasi_nama,
        organisasi_deskripsi: formState.organisasi_deskripsi,
      }

      if (formState.organisasi_id) {
        payload.organisasi_id = formState.organisasi_id
      }

      const response = await AssessmentServices.createAssessment(payload)

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Tambah Assessment',
          text: 'Berhasil Menambahkan Data Assessment'
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
/*
onMounted(() => {
  getListOrganisasi({ limit: 10, page: 1 })
})
*/

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-9 fw-semibold">Assessment</h5>

          <div class="mb-3">
            <BaseInput id="assessment" v-model="v$.assessment.$model" label="Nama Assessment"
              placeholder="Masukkan Nama Assessment" tabindex="1" :isInvalid="v$.assessment.$errors?.length"
              :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.assessment.$errors" />
          </div>

          <div class="mb-3">
            <label class="form-label" for="deskripsi">Deskripsi Asessment</label>

            <CKEditor id="deskripsi" tabindex="2" v-model="v$.deskripsi.$model"
              :isInvalid="!!v$.deskripsi.$errors?.length" :disabled="formState.loadingSubmit" />
            <ErrorMessage v-if="v$.deskripsi.$errors" :errors="v$.deskripsi.$errors" />
          </div>

          <div class="mb-3">
            <DateInput uid="tahun" v-model="v$.tahun.$model" label="Periode / Tahun" locale="id" month-picker
              placeholder="Silahkan Pilih Tahun" :disabled="formState.loadingSubmit" tabindex="3"
              :isInvalid="v$.tahun.$errors?.length" />
            <ErrorMessage :errors="v$.tahun.$errors" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-9 fw-semibold">Organisasi</h5>

          <div class="mb-3">
            <label class="form-label" for="organisasi_nama">Nama Organisasi</label>

            <v-select id="organisasi_nama" @search="(search) => handleSearchOrganisasi({ search })" :filterable="false"
              :options="listOrganisasi.data" v-model="formState.organisasi" :disabled="formState.loadingSubmit"
              label="nama" placeholder="Cari atau Buat Organisasi Baru" :select-on-key-codes="[]"
              :class="{ 'invalid-v-select': v$.organisasi_nama.$errors?.length }"
              :dropdown-should-open="dropdownOrganisasiShouldOpen" :tabindex="4">
              <template #no-options="option">
                <a class="cursor-pointer" @click="handleAddOrganisasi({ value: option.search })">
                  Tambahkan Organisasi <span class="fw-bold">{{ option.search }}</span>
                </a>
              </template>

              <template #option="option">
                <div
                  @click="handleSelectedOrganisasi({ id: option?.id, nama: option?.nama, deskripsi: option?.deskripsi })"
                  class="d-flex flex-row align-items-center py-1">
                  <span class="me-2 fw-bold">
                    {{ option.nama }}
                  </span>
                </div>
              </template>

              <template #selected-option="option">
                <div class="d-flex flex-row align-items-center py-1">
                  <span class="me-2 fw-bold">
                    {{ option.nama }}
                  </span>
                </div>
              </template>
            </v-select>

            <ErrorMessage :errors="v$.organisasi_nama.$errors" />
          </div>

          <!-- <div class="mb-3">
            <BaseInput id="organisasi_nama" v-model="v$.organisasi_nama.$model" label="Nama Organisasi"
              placeholder="Masukkan Nama Organisasi" tabindex="4" :isInvalid="v$.organisasi_nama.$errors?.length"
              :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.organisasi_nama.$errors" />
          </div> -->

          <div class="mb-3">
            <label class="form-label" for="organisasi_deskripsi">Deskripsi Organisasi</label>

            <CKEditor id="organisasi_deskripsi" tabindex="5" v-model="v$.organisasi_deskripsi.$model"
              :isInvalid="!!v$.organisasi_deskripsi.$errors?.length" :disabled="formState.loadingSubmit" />
            <ErrorMessage v-if="v$.organisasi_deskripsi.$errors" :errors="v$.organisasi_deskripsi.$errors" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-9 fw-semibold">PIC</h5>

          <div class="mb-3">
            <BaseInput id="pic_nama" v-model="v$.pic_nama.$model" label="Nama PIC" placeholder="Masukkan Nama PIC"
              tabindex="6" :isInvalid="v$.pic_nama.$errors?.length" :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.pic_nama.$errors" />
          </div>

          <div class="mb-3">
            <BaseInput id="pic_email" v-model="v$.pic_email.$model" label="Email PIC" placeholder="Masukkan Email PIC"
              tabindex="7" :isInvalid="v$.pic_email.$errors?.length" :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.pic_email.$errors" />
          </div>

          <div class="mb-3">
            <BaseInput id="pic_divisi" v-model="v$.pic_divisi.$model" label="Divisi PIC" placeholder="Masukkan Divisi PIC"
              tabindex="8" :isInvalid="v$.pic_divisi.$errors?.length" :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.pic_divisi.$errors" />
          </div>

          <div class="mb-3">
            <BaseInput id="pic_jabatan" v-model="v$.pic_jabatan.$model" label="Jabatan PIC"
              placeholder="Masukkan Jabatan PIC" tabindex="9" :isInvalid="v$.pic_jabatan.$errors?.length"
              :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.pic_jabatan.$errors" />
          </div>
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