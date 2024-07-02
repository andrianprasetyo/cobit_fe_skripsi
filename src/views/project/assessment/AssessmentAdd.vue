<script setup>
import { reactive, computed, onMounted, watch } from 'vue'
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
import { useAuth } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

const auth = useAuth()
const toast = useToast()
const router = useRouter()
const loading = useLoading()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loadingSubmit: false,
  assessment: '',
  deskripsi: '',
  start_date: '',
  end_date: '',
  start_date_quisioner: '',
  end_date_quisioner: '',
  pic_nama: '',
  pic_email: '',
  pic_divisi: '',
  pic_jabatan: '',
  pic_divisi_id: '',
  pic_jabatan_id: '',
  organisasi: null,
  organisasi_id: '',
  organisasi_nama: '',
  organisasi_deskripsi: '',
  pic_expire_at: ''
})

const listOrganisasi = reactive({
  loading: false,
  data: []
})

const listDivisi = reactive({
  loading: false,
  data: []
})

const listJabatan = reactive({
  loading: false,
  data: []
})

const rules = computed(() => {
  return {
    assessment: {
      required: helpers.withMessage('Silahkan isi nama asesmen', required),
    },
    deskripsi: {
      required: helpers.withMessage("Silahkan isi deskripsi", required)
    },
    start_date: {
      required: helpers.withMessage("Silahkan tanggal mulai asesmen", required)
    },
    end_date: {
      required: helpers.withMessage("Silahkan tanggal selesai asesmen", required)
    },
    start_date_quisioner: {
      required: helpers.withMessage("Silahkan tanggal mulai kuesioner", required)
    },
    end_date_quisioner: {
      required: helpers.withMessage("Silahkan tanggal selesai kuesioner", required)
    },
    pic_nama: {
      required: helpers.withMessage("Silahkan isi nama PIC", requiredIf(false))
    },
    pic_email: {
      required: helpers.withMessage("Silahkan isi email PIC", requiredIf(false)),
      email: helpers.withMessage("Alamat email tidak valid", email)
    },
    pic_divisi: {
      requiredIf: helpers.withMessage("Silahkan isi divisi PIC", requiredIf(false)) // requiredIf(!formState.organisasi_id))
    },
    pic_jabatan: {
      requiredIf: helpers.withMessage("Silahkan isi jabatan PIC", requiredIf(false)) // requiredIf(!formState.organisasi_id)
    },
    pic_divisi_id: {
      requiredIf: helpers.withMessage("Silahkan isi divisi PIC", requiredIf(false)) // requiredIf(formState.organisasi_id)
    },
    pic_jabatan_id: {
      requiredIf: helpers.withMessage("Silahkan isi divisi PIC", requiredIf(false)) // requiredIf(formState.organisasi_id)
    },
    organisasi_nama: {
      requiredIf: helpers.withMessage("Silahkan isi nama organisasi", requiredIf(!formState.organisasi_id))
    },
    organisasi_deskripsi: {
      required: helpers.withMessage("Silahkan isi deskripsi organisasi", requiredIf(!formState.organisasi_id))
    },
    pic_expire_at: {
      required: helpers.withMessage("Silahkan isi tanggal kadaluarsa pic", requiredIf(false)) // required
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

const handleSearchDivisi = debounce(async ({ search }) => {
  try {
    const response = await OrganisasiServices.getListDivisi({ limit: 10, page: 1, search, organisasi_id: formState.organisasi_id })

    if (response) {
      const data = response?.data

      listDivisi.data = data?.list || []
    }

  } catch (error) {
    toast.error({ error })
  }
}, 500)

const handleSearchJabatan = debounce(async ({ search }) => {
  try {
    const response = await OrganisasiServices.getListJabatan({ limit: 10, page: 1, search, organisasi_divisi_id: formState.pic_divisi_id })

    if (response) {
      const data = response?.data

      listJabatan.data = data?.list || []
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
    handleSearchDivisi({ search: '' })
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

      let payload = {
        asessment: formState.assessment,
        deskripsi: formState.deskripsi,
        start_date: formState.start_date,
        end_date: formState.end_date,
        start_date_quisioner: formState.start_date_quisioner,
        end_date_quisioner: formState.end_date_quisioner,
      }

      if (formState.pic_nama) {
        payload.pic_nama = formState.pic_nama
      }

      if (formState.pic_email) {
        payload.pic_email = formState.pic_email
      }

      if (formState.pic_expire_at) {
        payload.pic_expire_at = formState.pic_expire_at
      }

      if (formState.organisasi_id) {
        payload.organisasi_id = formState.organisasi_id
      } else {
        payload.organisasi_nama = formState.organisasi_nama
        payload.organisasi_deskripsi = formState.organisasi_deskripsi
      }

      if (formState.pic_divisi) {
        payload.pic_divisi = formState.pic_divisi
      }

      if (formState.pic_jabatan) {
        payload.pic_jabatan = formState.pic_jabatan
      }

      if (formState.pic_divisi_id) {
        payload.pic_divisi_id = formState.pic_divisi_id
      }

      if (formState.pic_jabatan_id) {
        payload.pic_jabatan_id = formState.pic_jabatan_id
      }

      const response = await AssessmentServices.createAssessment(payload)

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Tambah Project',
          text: 'Berhasil Menambahkan Data Project'
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

const setDefaultPIC = ({ nama, email, divisi, jabatan }) => {
  formState.pic_nama = nama
  formState.pic_email = email
  formState.pic_divisi = divisi
  formState.pic_jabatan = jabatan
}

const setDefaultOrganisasi = ({ organisasi_id }) => {
  formState.organisasi_id = organisasi_id
}

const handleResetPIC = () => {
  formState.pic_nama = ''
  formState.pic_email = ''
  formState.pic_jabatan = ''
  formState.pic_divisi = ''
  formState.pic_divisi_id = ''
  formState.pic_jabatan_id = ''
  formState.pic_expire_at = ''
}

/* ---------------------------------- HOOKS --------------------------------- */
/*
onMounted(() => {
  getListOrganisasi({ limit: 10, page: 1 })
})
*/

watch(() => [formState.pic_divisi_id], () => {
  if (formState.pic_divisi_id) {
    handleSearchJabatan({ search: '' })
  }
}, { deep: true })

onMounted(() => {
  if (auth.getIsEksternal) {
    setDefaultPIC({
      nama: auth.account?.nama,
      email: auth.account?.email,
      divisi: auth.account?.divisi,
      jabatan: auth.account?.jabatan
    })

    setDefaultOrganisasi({
      organisasi_id: auth.account?.organisasi?.id
    })
  }
})
</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-9 fw-semibold">Project</h5>

          <div class="mb-3">
            <BaseInput id="assessment" v-model="v$.assessment.$model" label="Nama Asesmen"
              placeholder="Masukkan Nama Asesmen" tabindex="1" :isInvalid="v$.assessment.$errors?.length"
              :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.assessment.$errors" />
          </div>

          <div class="mb-3">
            <label class="form-label" for="deskripsi">Deskripsi Asesmen</label>

            <CKEditor id="deskripsi" tabindex="2" v-model="v$.deskripsi.$model"
              :isInvalid="!!v$.deskripsi.$errors?.length" :disabled="formState.loadingSubmit"
              placeholder="Masukkan Deskripsi Asesmen" />
            <ErrorMessage v-if="v$.deskripsi.$errors" :errors="v$.deskripsi.$errors" />
          </div>

          <div class="row mb-3">
            <div class="col-12 col-md-6">
              <DateInput uid="start_date" v-model="v$.start_date.$model" label="Tanggal Mulai Asesmen" locale="id"
                model-type="yyyy-MM-dd" format="dd/MM/yyyy" placeholder="Silahkan Pilih Tanggal Mulai Asesmen"
                :disabled="formState.loadingSubmit" tabindex="3" :isInvalid="v$.start_date.$errors?.length"
                :enable-time-picker="false" />
              <ErrorMessage :errors="v$.start_date.$errors" />
            </div>

            <div class="col-12 col-md-6">
              <DateInput uid="end_date" v-model="v$.end_date.$model" label="Tanggal Selesai Asesmen" locale="id"
                model-type="yyyy-MM-dd" format="dd/MM/yyyy" placeholder="Silahkan Pilih Tanggal Selesai Asesmen"
                :disabled="formState.loadingSubmit || !formState.start_date" tabindex="4"
                :isInvalid="v$.end_date.$errors?.length" :min-date="formState.start_date" :enable-time-picker="false" />
              <ErrorMessage :errors="v$.end_date.$errors" />
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-12 col-md-6">
              <DateInput uid="start_date_quisioner" v-model="v$.start_date_quisioner.$model"
                label="Tanggal Mulai Kuesioner" locale="id" model-type="yyyy-MM-dd" format="dd/MM/yyyy"
                placeholder="Silahkan Pilih Tanggal Mulai Kuesioner"
                :disabled="formState.loadingSubmit || !formState.start_date" tabindex="5"
                :isInvalid="v$.start_date_quisioner.$errors?.length" :min-date="formState.start_date"
                :max-date="formState.end_date" :enable-time-picker="false" />
              <ErrorMessage :errors="v$.start_date_quisioner.$errors" />
            </div>

            <div class="col-12 col-md-6">
              <DateInput uid="end_date_quisioner" v-model="v$.end_date_quisioner.$model"
                label="Tanggal Selesai Kuesioner" locale="id" model-type="yyyy-MM-dd" format="dd/MM/yyyy"
                placeholder="Silahkan Pilih Tanggal Selesai Kuesioner"
                :disabled="formState.loadingSubmit || !formState.start_date_quisioner" tabindex="6"
                :isInvalid="v$.end_date_quisioner.$errors?.length" :min-date="formState.start_date_quisioner"
                :max-date="formState.end_date" :enable-time-picker="false" />
              <ErrorMessage :errors="v$.end_date_quisioner.$errors" />
            </div>
          </div>
        </div>
      </div>

      <div v-if="auth.getIsAdministrator || auth.getIsAssessor" class="card">
        <div class="card-body">
          <h5 class="card-title mb-9 fw-semibold">Organisasi</h5>

          <div class="mb-3">
            <label class="form-label" for="organisasi_nama">Nama Organisasi</label>

            <v-select id="organisasi_nama" @search="(search) => handleSearchOrganisasi({ search })" :filterable="false"
              :options="listOrganisasi.data" v-model="formState.organisasi" :disabled="formState.loadingSubmit"
              label="nama" placeholder="Cari atau Buat Organisasi Baru" :select-on-key-codes="[]"
              :class="{ 'invalid-v-select': v$.organisasi_nama.$errors?.length }"
              :dropdown-should-open="dropdownOrganisasiShouldOpen" :tabindex="5">
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

            <CKEditor id="organisasi_deskripsi" tabindex="6" v-model="v$.organisasi_deskripsi.$model"
              placeholder="Masukkan Deskripsi Organisasi" :isInvalid="!!v$.organisasi_deskripsi.$errors?.length"
              :disabled="formState.loadingSubmit" />
            <ErrorMessage v-if="v$.organisasi_deskripsi.$errors" :errors="v$.organisasi_deskripsi.$errors" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <h5 class="card-title mb-9 fw-semibold">PIC</h5>

            <BaseButton v-if="formState.pic_nama" @click="handleResetPIC" class="btn btn-outline-primary"
              title="Reset PIC">
              <template #icon-right>
                <TablerIcon icon="RefreshIcon" />
              </template>
            </BaseButton>
          </div>

          <div class="mb-3">
            <BaseInput id="pic_nama" v-model="v$.pic_nama.$model" label="Nama PIC" placeholder="Masukkan Nama PIC"
              tabindex="7" :isInvalid="v$.pic_nama.$errors?.length" :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.pic_nama.$errors" />
          </div>

          <div class="mb-3">
            <BaseInput id="pic_email" v-model="v$.pic_email.$model" label="Email PIC" placeholder="Masukkan Email PIC"
              tabindex="8" :isInvalid="v$.pic_email.$errors?.length" :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.pic_email.$errors" />
          </div>

          <template v-if="formState.organisasi_id">
            <div class="mb-3">
              <label class="form-label" for="divisi">Divisi</label>

              <v-select id="divisi" @search="(search) => handleSearchDivisi({ search })" :filterable="false"
                :options="listDivisi.data" v-model="formState.pic_divisi_id" :reduce="(state) => state?.id"
                :disabled="listDivisi.loading || formState.loadingSubmit" label="nama" placeholder="Cari Divisi"
                :select-on-key-codes="[]" :class="{ 'invalid-v-select': v$.pic_divisi_id.$errors?.length }">
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
              <ErrorMessage :errors="v$.pic_divisi_id.$errors" />
            </div>

            <div class="mb-3">
              <label class="form-label" for="jabatan">Jabatan</label>

              <v-select id="jabatan" @search="(search) => handleSearchJabatan({ search })" :filterable="false"
                :options="listJabatan.data" v-model="formState.pic_jabatan_id" :reduce="(state) => state?.id"
                :disabled="listJabatan.loading || formState.loadingSubmit || !formState.pic_divisi_id" label="nama"
                placeholder="Cari Jabatan" :select-on-key-codes="[]"
                :class="{ 'invalid-v-select': v$.pic_jabatan_id.$errors?.length }">
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
              <ErrorMessage :errors="v$.pic_jabatan_id.$errors" />
            </div>
          </template>

          <template v-else>
            <div class="mb-3">
              <BaseInput id="pic_divisi" v-model="v$.pic_divisi.$model" label="Divisi PIC"
                placeholder="Masukkan Divisi PIC" tabindex="9" :isInvalid="v$.pic_divisi.$errors?.length"
                :disabled="formState.loadingSubmit" />
              <ErrorMessage :errors="v$.pic_divisi.$errors" />
            </div>

            <div class="mb-3">
              <BaseInput id="pic_jabatan" v-model="v$.pic_jabatan.$model" label="Jabatan PIC"
                placeholder="Masukkan Jabatan PIC" tabindex="10" :isInvalid="v$.pic_jabatan.$errors?.length"
                :disabled="formState.loadingSubmit" />
              <ErrorMessage :errors="v$.pic_jabatan.$errors" />
            </div>
          </template>

          <div class="mb-3">
            <DateInput uid="pic_expire_at" v-model="v$.pic_expire_at.$model" label="Tanggal Kadaluarsa PIC" locale="id"
              model-type="yyyy-MM-dd" format="dd/MM/yyyy" placeholder="Silahkan Pilih Tanggal Mulai Kadaluarsa PIC"
              :disabled="formState.loadingSubmit || !formState.start_date" tabindex="5"
              :isInvalid="v$.pic_expire_at.$errors?.length" :min-date="formState.start_date"
              :max-date="formState.end_date" :enable-time-picker="false" />
            <ErrorMessage :errors="v$.pic_expire_at.$errors" />
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