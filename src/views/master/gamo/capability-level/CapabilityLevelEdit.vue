<script setup>
import { reactive, computed, onMounted } from 'vue'

/*
import debounce from 'lodash.debounce'
*/

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import CKEditor from '@/components/CKEditor/CKEditor.vue'

import CapabilityLevelServices from '@/services/lib/capability-level'
/*
import DomainServices from '@/services/lib/domain'
*/

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, minValue, maxLength } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useRouter, useRoute } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'
import { useTitle } from '@vueuse/core'

import capabilityLevelJSON from '@/data/capabilityLevel.json'

const title = useTitle()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const loading = useLoading()

/* ---------------------------------- STATE --------------------------------- */
const formState = reactive({
  loadingSubmit: false,
  loading: false,
  detail: null,
  urutan: '',
  kode: '',
  kegiatan: '',
  translate: '',
  level: '',
  bobot: '',
  domain_id: null
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

const idCapabilityLevel = computed(() => {
  return route.params?.capability_level_id
})

const titleGamo = computed(() => {
  return route.query?.gamo
})

const rules = computed(() => {
  return {
    urutan: {
      required: helpers.withMessage('Silahkan isi urutan', required),
      minValue: helpers.withMessage('Minimal urutan yaitu angka 1', minValue(1)),
    },
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
    /*
    domain_id: {
      required: helpers.withMessage("Silahkan pilih domain", required)
    }
    */
  }
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true })

/* --------------------------------- METHODS -------------------------------- */
const getDetailCapabilityLevel = async () => {
  const loader = loading.show()

  try {
    formState.loading = true
    const response = await CapabilityLevelServices.getDetailCapabilityLevel({ id: idCapabilityLevel.value })

    if (response) {
      const data = response?.data;

      formState.urutan = data?.urutan
      formState.kode = data?.kode
      formState.level = data?.level
      formState.kegiatan = data?.kegiatan || ''
      formState.translate = data?.translate || ''
      formState.bobot = data?.bobot

      title.value = `Edit Capability Level ${data?.kode}`

      formState.loading = false
      loader.hide()
    }

  } catch (error) {
    formState.loading = false
    loader.hide()
    toast.error({ error })
  }
}

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

const handleSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const loader = loading.show()

    try {
      formState.loadingSubmit = true

      const response = await CapabilityLevelServices.editCapabilityLevel({
        id: idCapabilityLevel.value,
        urutan: formState.urutan,
        kode: formState.kode,
        kegiatan: formState.kegiatan,
        translate: formState.translate,
        level: formState.level,
        bobot: formState.bobot,
        domain_id: idGamo.value
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Edit Capability Level',
          text: 'Berhasil Menambahkan Data Capability Level'
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
  /*
  handleSearchDomain({ search: '' })
  formState.domain_id = idGamo.value
  */

  getDetailCapabilityLevel()
})

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <div class="card-body">
          <div class="mb-5 mb-sm-0">
            <h5 class="card-title mb-2 fw-semibold">Capability Level</h5>
            <p v-if="titleGamo" class="card-subtitle mb-0">{{ titleGamo }}</p>
          </div>

          <div class="row mb-3 mt-3">
            <div class="col-12 col-md-9">
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

            <div class="col-12 col-md-3">
              <BaseInput id="urutan" type="number" v-model="v$.urutan.$model" label="Urutan" placeholder="Masukkan Urutan"
                tabindex="2" :min="1" :isInvalid="v$.urutan.$errors?.length"
                :disabled="formState.loading || formState.loadingSubmit" />
              <ErrorMessage :errors="v$.urutan.$errors" />
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
                :isInvalid="v$.kode.$errors?.length" :disabled="formState.loading || formState.loadingSubmit" />
              <ErrorMessage :errors="v$.kode.$errors" />
            </div>

            <div class="col-12 col-md-3">
              <BaseInput id="weight" type="number" v-model="v$.bobot.$model" label="Weight" placeholder="Masukkan Weight"
                tabindex="4" :isInvalid="v$.bobot.$errors?.length"
                :disabled="formState.loading || formState.loadingSubmit" />
              <ErrorMessage :errors="v$.bobot.$errors" />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label" for="kegiatan">Activities</label>

            <CKEditor id="kegiatan" tabindex="5" v-model="v$.kegiatan.$model" :isInvalid="!!v$.kegiatan.$errors?.length"
              :disabled="formState.loading || formState.loadingSubmit" placeholder="Masukkan Activities" />
            <ErrorMessage :errors="v$.kegiatan.$errors" />
          </div>

          <div class="mb-3">
            <label class="form-label" for="translate">Translate</label>

            <CKEditor id="translate" tabindex="6" v-model="v$.translate.$model" placeholder="Masukkan Translate"
              :isInvalid="!!v$.translate.$errors?.length" :disabled="formState.loading || formState.loadingSubmit" />
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
              <BaseButton @click="handleSubmit" title="Simpan" :disabled="formState.loadingSubmit"
                :is-loading="formState.loadingSubmit" :access="['master-edit']">
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