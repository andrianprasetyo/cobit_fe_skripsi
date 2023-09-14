<script setup>
import { reactive, computed, onMounted } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'

/*
import CKEditor from '@/components/CKEditor/CKEditor.vue'
*/

import DomainServices from '@/services/lib/domain'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useRouter, useRoute } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const loading = useLoading()

const formState = reactive({
  loadingSubmit: false,
  kode: '',
  ket: '',
  translate: ''
})

const rules = computed(() => {
  return {
    kode: {
      required: helpers.withMessage('Silahkan isi kode', required),
    },
    ket: {
      required: helpers.withMessage("Silahkan isi deskripsi", required)
    },
    translate: {
      required: helpers.withMessage("Silahkan isi translate", required)
    },
  }
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true })

/* --------------------------------- METHODS -------------------------------- */
const getDetailDomain = async () => {
  const loader = loading.show()

  try {
    formState.loading = true
    const response = await DomainServices.getDetailDomain({ id: route.params?.id })

    if (response) {
      const data = response?.data;

      formState.kode = data?.kode
      formState.ket = data?.ket || ''

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

      const response = await DomainServices.editDomain({
        id: route.params?.id,
        kode: formState.kode,
        ket: formState.ket,
        translate: formState.translate
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Edit Governance and Management Objectives (GAMO)',
          text: 'Berhasil Mengubah Data Governance and Management Objectives (GAMO)'
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
  getDetailDomain()
})

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-9 fw-semibold">Governance and Management Objectives</h5>

          <div class="mb-3">
            <BaseInput id="kode" v-model="v$.kode.$model" label="Kode" placeholder="Masukkan Kode GAMO" tabindex="1"
              :isInvalid="v$.kode.$errors?.length" :disabled="true" />
            <ErrorMessage :errors="v$.kode.$errors" />
          </div>

          <div class="mb-3">
            <BaseInput id="ket" type="text-area" v-model="v$.ket.$model" label="Deskripsi"
              placeholder="Masukkan Deskripsi Domain" tabindex="2" rows="4" :isInvalid="v$.ket.$errors?.length"
              :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.ket.$errors" />
          </div>

          <div class="mb-3">
            <BaseInput id="translate" type="text-area" v-model="v$.translate.$model" label="Translate"
              placeholder="Masukkan Translate" tabindex="3" rows="4" :isInvalid="v$.translate.$errors?.length"
              :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.translate.$errors" />
          </div>

          <!-- <div class="mb-3">
            <label class="form-label" for="ket">Deskripsi</label>

            <CKEditor id="ket" v-model="v$.ket.$model" tabindex="2" :isInvalid="!!v$.ket.$errors?.length"
              :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.ket.$errors" />
          </div> -->

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