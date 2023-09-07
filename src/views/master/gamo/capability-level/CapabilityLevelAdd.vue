<script setup>
import { reactive, computed, onMounted } from 'vue'
/*
import debounce from 'lodash.debounce'
*/

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import BaseDropdownButton from '@/components/Button/BaseDropdownButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import CKEditor from '@/components/CKEditor/CKEditor.vue'

import CapabilityLevelServices from '@/services/lib/capability-level'

/*
import DomainServices from '@/services/lib/domain'
*/

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, maxLength } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useRouter, useRoute } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

import capabilityLevelJSON from '@/data/capabilityLevel.json'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const loading = useLoading()

/* ---------------------------------- STATE --------------------------------- */
const formState = reactive({
  loadingSubmit: false,
  kode: '',
  kegiatan: '',
  translate: '',
  level: '',
  bobot: '',
  domain_id: null,
})

/*
const listDomain = reactive({
  loading: false,
  data: []
})
*/

const idGamo = computed(() => {
  return route.params?.id
})

const rules = computed(() => {
  return {
    kode: {
      required: helpers.withMessage('Silahkan isi kode', required),
      maxLength: helpers.withMessage('Kode maksimal 5 karakter / nomor', maxLength(5)),
    },
    kegiatan: {
      required: helpers.withMessage('Silahkan isi activities', required),
    },
    translate: {
      required: helpers.withMessage('Silahkan isi translate', required),
    },
    level: {
      required: helpers.withMessage('Silahkan pilih level', required),
    },
    bobot: {
      required: helpers.withMessage('Silahkan isi bobot', required),
    },
    domain_id: {
      required: helpers.withMessage("Silahkan pilih domain", required)
    }
  }
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true })

/* --------------------------------- METHODS -------------------------------- */
/*
const handleSearchDomain = debounce(async ({ search }) => {
  try {
    const response = await DomainServices.getListDomain({ limit: 10, page: 1, search })

    if (response) {
      const data = response?.data

      listDomain.data = data?.list || []
    }

  } catch (error) {
    toast.error({ error })
  }
}, 500)
*/

const handleBack = () => {
  router.back()
}

const handleSubmit = async ({ isSaveAndClear = false }) => {
  const result = await v$.value.$validate()

  if (result) {
    const loader = loading.show()

    try {
      formState.loadingSubmit = true

      const response = await CapabilityLevelServices.createCapabilityLevel({
        kode: formState.kode,
        kegiatan: formState.kegiatan,
        translate: formState.translate,
        level: formState.level,
        bobot: formState.bobot,
        domain_id: formState.domain_id
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Tambah Capability Level',
          text: 'Berhasil Menambahkan Data Capability Level'
        })

        if (isSaveAndClear) {
          handleResetState()
        } else {
          handleBack()
        }
      }
    } catch (error) {
      loader.hide()
      formState.loadingSubmit = false
      toast.error({ error })
    }
  }
}

const handleResetState = () => {
  v$.value.$reset()
  formState.kode = ''
  formState.kegiatan = ''
  formState.translate = ''
  formState.level = ''
  formState.bobot = ''
}


/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  /*
  handleSearchDomain({ search: '' })
  */
  formState.domain_id = idGamo.value
})

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-9 fw-semibold">Capability Level</h5>

          <div class="row mb-3">
            <div class="col-12 col-md-12">
              <label class="form-label" for="level">Level</label>

              <v-select id="level" :filterable="false" :options="capabilityLevelJSON" v-model="formState.level"
                :disabled="formState.loadingSubmit" label="label" placeholder="Pilih Capability Level"
                :reduce="state => state?.value" :class="{ 'invalid-v-select': v$.level.$errors?.length }"
                :select-on-key-codes="[]" :tabindex="1">
                <template #no-options>
                  Tidak ada Level Ditemukan
                </template>
              </v-select>
              <ErrorMessage :errors="v$.level.$errors" />
            </div>

            <!-- <div class="col-12 col-md-6">
              <label class="form-label" for="gamo">Pilih GAMO</label>

              <v-select id="gamo" @search="(search) => handleSearchDomain({ search })" :filterable="false"
                :options="listDomain.data" v-model="formState.domain_id" :disabled="formState.loadingSubmit" label="kode"
                placeholder="Cari dan Pilih GAMO" :reduce="state => state?.id"
                :class="{ 'invalid-v-select': v$.domain_id.$errors?.length }" :select-on-key-codes="[]" :tabindex="2">
                <template #no-options>
                  Tidak ada GAMO Ditemukan
                </template>
              </v-select>
              <ErrorMessage :errors="v$.domain_id.$errors" />
            </div> -->
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-12 col-md-9">
              <BaseInput id="kode" v-model="v$.kode.$model" label="Sub Kode" placeholder="Masukkan Sub Kode" tabindex="3"
                :isInvalid="v$.kode.$errors?.length" :disabled="formState.loadingSubmit" />
              <ErrorMessage :errors="v$.kode.$errors" />
            </div>

            <div class="col-12 col-md-3">
              <BaseInput id="weight" type="number" v-model="v$.bobot.$model" label="Weight" placeholder="Masukkan Weight"
                tabindex="4" :isInvalid="v$.bobot.$errors?.length" :disabled="formState.loadingSubmit" />
              <ErrorMessage :errors="v$.bobot.$errors" />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label" for="kegiatan">Activities</label>

            <CKEditor id="kegiatan" tabindex="5" v-model="v$.kegiatan.$model" :isInvalid="!!v$.kegiatan.$errors?.length"
              :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.kegiatan.$errors" />
          </div>

          <div class="mb-3">
            <label class="form-label" for="translate">Translate</label>

            <CKEditor id="translate" tabindex="6" v-model="v$.translate.$model"
              :isInvalid="!!v$.translate.$errors?.length" :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.translate.$errors" />
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
              <BaseDropdownButton @click.stop="handleSubmit({ isSaveAndClear: false })" title="Simpan"
                :disabled="formState.loadingSubmit" :is-loading="formState.loadingSubmit">
                <template #icon-left>
                  <TablerIcon icon="DeviceFloppyIcon" />
                </template>

                <template #dropdown>
                  <BaseButton @click.stop="handleSubmit({ isSaveAndClear: true })" class="dropdown-item w-100"
                    title="Simpan & Reset">
                  </BaseButton>

                  <BaseButton @click.stop="handleResetState" type="button" class="dropdown-item w-100" title="Reset">
                  </BaseButton>
                </template>
              </BaseDropdownButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>