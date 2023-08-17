<script setup>
import { reactive, computed, onMounted } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import NoOptions from '@/components/EmptyPlaceholder/NoOptions.vue'

import DesignFactorHeader from '@/views/master/design-factor/components/DesignFactorHeader.vue'

import DesignFactorServices from '@/services/lib/design-factor'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useAlert } from '@/stores/alert'
import { useRouter, useRoute } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

const alert = useAlert()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const loading = useLoading()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loadingSubmit: false,
  loading: false,
  detail: {},
  df_komponen: [
  ],
})

const rules = computed(() => {
  return {
    df_komponen: {
      $each: helpers.forEach({
        nama: {
          required: helpers.withMessage('Silahkan isi nama', required),
        },
        baseline: {
          required: helpers.withMessage('Silahkan isi baseline', required),
        }
      })
    }
  }
})

const v$ = useVuelidate(rules, formState, { $lazy: true, $autoDirty: false, $scope: false })


/* --------------------------------- METHODS -------------------------------- */
const getComponentDesignFactor = async () => {
  const loader = loading.show()

  try {
    formState.loading = true
    const response = await DesignFactorServices.getQuestionAndComponentDesignFactor({ id: route.params?.id })

    if (response) {
      const data = response?.data;

      const dataComponent = data?.komponen || []

      const listComponent = []

      if (Array.isArray(dataComponent) && dataComponent.length) {
        dataComponent.map(item => listComponent.push({
          id: item?.id,
          nama: item?.nama,
          baseline: item?.baseline
        }))

        formState.df_komponen = listComponent
      }

      formState.detail = data
      formState.loading = false
      loader.hide()
    }

  } catch (error) {
    formState.loading = false
    loader.hide()
    toast.error({ error })
  }
}

const deleteKomponenDesignFactor = async ({ id, index }) => {
  try {
    const response = await DesignFactorServices.deleteKomponenDesignFactor({ id })

    if (response) {
      toast.success({
        title: 'Hapus Komponen Design Factor',
        text: `Berhasil Menghapus Data Komponen Design Factor`
      })

      filterKomponen(index)

      return response
    }
  } catch (error) {
    toast.error({ error })
    throw error
  }

}

const handleBack = () => {
  router.back()
}

const handleTambahKomponen = () => {
  formState.df_komponen.push({
    id: null,
    nama: '',
    baseline: ''
  })
}

const handleHapusKomponen = ({ title, id, index }) => {
  alert.info({
    title: `Apakah Anda Yakin untuk Menghapus Komponen ${title}`
  }).then(async (result) => {
    if (result.isConfirmed && id) {
      alert.loading()
      try {
        const response = await deleteKomponenDesignFactor({ id, index })

        if (response) {
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
      }
    } else if (result.isConfirmed) {
      filterKomponen(index)
    }
  })
}

const filterKomponen = (index) => {
  const filtered = formState.df_komponen.filter((_, itemIndex) => itemIndex !== index)
  formState.df_komponen = filtered
}

const handleSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const loader = loading.show()

    try {
      formState.loadingSubmit = true

      const response = await DesignFactorServices.editKomponenDesignFactor({
        id: route.params?.id,
        df_komponen: formState.df_komponen
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Edit Komponen Design Factor',
          text: 'Berhasil Mengubah Data Komponen Design Factor'
        })
        handleBack()
      }

    } catch (error) {
      loader.hide()
      formState.loadingSubmit = false
    }
  }
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getComponentDesignFactor()
})

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <DesignFactorHeader :nama="formState.detail?.nama" :deskripsi="formState.detail?.deskripsi" />

      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-9 fw-semibold">Komponen</h5>

          <template v-if="formState.df_komponen.length">
            <div v-for="(komponen, index) in formState.df_komponen" :key="`df-komponen-${index}`" class="row mb-3">
              <div class="col-12 col-md-9 mb-2 mb-md-0">
                <BaseInput :id="`input-df-komponen-${index}`" :label="`Komponen ${index + 1}`"
                  v-model="v$.df_komponen.$model[index].nama" placeholder="Masukkan Nama Komponen"
                  :disabled="formState.loadingSubmit"
                  :is-invalid="!!v$.df_komponen.$each?.$response?.$errors[index]?.nama?.length" />
                <ErrorMessage
                  v-if="Array.isArray(v$.df_komponen.$each?.$response?.$errors) && v$.df_komponen.$each?.$response?.$errors.length"
                  :errors="v$.df_komponen.$each?.$response?.$errors[index]?.nama" />
              </div>

              <div class="col-12 col-md-2">
                <BaseInput :id="`input-df-baseline-${index}`" :label="`Skor Baseline`" type="number"
                  v-model="v$.df_komponen.$model[index].baseline" placeholder="Masukkan Baseline"
                  :disabled="formState.loadingSubmit"
                  :is-invalid="!!v$.df_komponen.$each?.$response?.$errors[index]?.baseline?.length" />
                <ErrorMessage
                  v-if="Array.isArray(v$.df_komponen.$each?.$response?.$errors) && v$.df_komponen.$each?.$response?.$errors.length"
                  :errors="v$.df_komponen.$each?.$response?.$errors[index]?.baseline" />
              </div>

              <div class="col-12 col-md-1 d-flex justify-content-center align-items-center mb-2 mb-md-0">
                <BaseButton @click="handleHapusKomponen({ id: komponen?.id, title: komponen?.nama, index: index })"
                  class="btn btn-outline-danger w-100"
                  :class="[v$.df_komponen.$each?.$response?.$errors[index]?.nama?.length || v$.df_komponen.$each?.$response?.$errors[index]?.baseline?.length ? 'mt-1' : 'mt-4']">
                  <TablerIcon icon="TrashIcon" />
                </BaseButton>
              </div>

            </div>
          </template>

          <template v-else>
            <NoOptions title="Belum Ada Komponen Dibuat" />
          </template>

          <div class="mt-2 d-flex justify-content-center align-items-center">
            <BaseButton @click="handleTambahKomponen" title="Tambah Komponen">
              <template #icon-left>
                <TablerIcon icon="PlusIcon" />
              </template>
            </BaseButton>
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
              <BaseButton @click="handleSubmit" title="Simpan Perubahan" :disabled="formState.loadingSubmit"
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