<script setup>
import { reactive, computed, onMounted, onUnmounted } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import NoOptions from '@/components/EmptyPlaceholder/NoOptions.vue'

import CapabilityAnswerServices from '@/services/lib/capability-answer'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, minValue, maxValue, maxLength } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useRouter } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'
import { useAlert } from '@/stores/alert'
import { useAppConfig } from '@/stores/appConfig'

const toast = useToast()
const router = useRouter()
const loading = useLoading()
const alert = useAlert()
const appConfig = useAppConfig()

/* ---------------------------------- STATE --------------------------------- */
const formState = reactive({
  loading: false,
  loadingSubmit: false,
  jawaban: [
    {
      id: null,
      nama: '',
      label: '',
      bobot: '',
    }
  ],
})

const rules = computed(() => {
  return {
    jawaban: {
      $each: helpers.forEach({
        nama: {
          required: helpers.withMessage('Silahkan isi nama', required),
        },
        label: {
          required: helpers.withMessage('Silahkan isi label', required),
          maxLength: helpers.withMessage("Maksimal 3 karakter", maxLength(3))
        },
        bobot: {
          required: helpers.withMessage('Silahkan isi weight', required),
          minValue: helpers.withMessage('Minimal weight yaitu 0', minValue(0)),
          maxValue: helpers.withMessage('Maksmial weight yaitu 1', maxValue(1))
        }
      })
    },
  }
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true })

/* --------------------------------- METHODS -------------------------------- */
const getCapabilityAnswer = async () => {
  const loader = loading.show()
  try {
    formState.loading = true
    const response = await CapabilityAnswerServices.getCapabilityAnswer()

    if (response) {
      const data = response?.data

      const list = []

      if (Array.isArray(data?.list) && data?.list.length) {
        data?.list.map(item =>
          list.push({
            id: item?.id,
            nama: item?.nama,
            label: item?.label,
            bobot: item?.bobot,
          })
        )

        formState.jawaban = list
      }

      formState.loading = false
      loader.hide()
    }
  } catch (error) {
    loader.hide()
    formState.loading = false
    toast.error({ error })
  }
}

const filterJawaban = (index) => {
  const filtered = formState.jawaban.filter((_, itemIndex) => itemIndex !== index)
  formState.jawaban = filtered
}

const deleteJawaban = async ({ id, index }) => {
  try {
    const response = await CapabilityAnswerServices.deleteCapabilityAnswer({ id })

    if (response) {
      toast.success({
        title: 'Hapus Jawaban Capability Answer',
        text: `Berhasil Menghapus Data Jawaban Capability Answer`
      })

      filterJawaban(index)

      return response
    }
  } catch (error) {
    toast.error({ error })
    throw error
  }

}

const handleTambahJawaban = () => {
  formState.jawaban.push({
    id: null,
    nama: '',
    label: '',
    bobot: '',
  })
}

const handleHapusJawaban = ({ title, id, index }) => {
  alert.info({
    title: `Apakah Anda Yakin untuk Menghapus Jawaban ${title}`
  }).then(async (result) => {
    if (result.isConfirmed && id) {
      alert.loading()
      try {
        const response = await deleteJawaban({ id, index })

        if (response) {
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
      }
    } else if (result.isConfirmed) {
      filterJawaban(index)
    }
  })
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

      const response = await CapabilityAnswerServices.createCapabilityAnswer({
        jawaban: formState.jawaban
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Simpan Data Capability Answer',
          text: 'Berhasil Menyimpan Data Capability Answer'
        })
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
  appConfig.setMiniSidebar(true)
  getCapabilityAnswer()
})

onUnmounted(() => {
  appConfig.setMiniSidebar(false)
})

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-9 fw-semibold">Jawaban Capability</h5>

          <template v-if="formState.jawaban.length">
            <div v-for="(jawaban, index) in formState.jawaban" :key="`jawaban-${index}`" class="row mb-4">
              <div class="col-12 col-md-7 mb-2 mb-md-0">
                <BaseInput :id="`input-nama-${index}`" label="Nama Jawaban" v-model="v$.jawaban.$model[index].nama"
                  placeholder="Masukkan Nama Jawaban" :disabled="formState.loadingSubmit"
                  :is-invalid="!!v$.jawaban.$each?.$response?.$errors[index]?.nama?.length" />
                <ErrorMessage
                  v-if="Array.isArray(v$.jawaban.$each?.$response?.$errors) && v$.jawaban.$each?.$response?.$errors.length"
                  :errors="v$.jawaban.$each?.$response?.$errors[index]?.nama" />
              </div>
              <div class="col-12 col-md-2 mb-2 mb-md-0">
                <BaseInput :id="`input-label-${index}`" label="Label" v-model="v$.jawaban.$model[index].label"
                  placeholder="Masukkan Label" :disabled="formState.loadingSubmit"
                  :is-invalid="!!v$.jawaban.$each?.$response?.$errors[index]?.label?.length" />
                <ErrorMessage
                  v-if="Array.isArray(v$.jawaban.$each?.$response?.$errors) && v$.jawaban.$each?.$response?.$errors.length"
                  :errors="v$.jawaban.$each?.$response?.$errors[index]?.label" />
              </div>
              <div class="col-12 col-md-2 mb-2 mb-md-0">
                <BaseInput :id="`input-bobot-${index}`" :label="`Weight`" type="number"
                  v-model="v$.jawaban.$model[index].bobot" placeholder="Masukkan Weight"
                  :disabled="formState.loadingSubmit" :step="0.01" :max="1"
                  :is-invalid="!!v$.jawaban.$each?.$response?.$errors[index]?.bobot?.length" />
                <ErrorMessage
                  v-if="Array.isArray(v$.jawaban.$each?.$response?.$errors) && v$.jawaban.$each?.$response?.$errors.length"
                  :errors="v$.jawaban.$each?.$response?.$errors[index]?.bobot" />
              </div>
              <div class="col-12 col-md-1 d-flex justify-content-center align-items-center mb-2 mb-md-0">
                <BaseButton @click="handleHapusJawaban({ title: jawaban?.nama, id: jawaban?.id, index: index })"
                  class="btn btn-outline-danger w-100"
                  :class="[v$.jawaban.$each?.$response?.$errors[index]?.nama?.length || v$.jawaban.$each?.$response?.$errors[index]?.label?.length || v$.jawaban.$each?.$response?.$errors[index]?.bobot?.length ? 'mt-1' : 'mt-4']">
                  <template #icon-left>
                    <TablerIcon icon="TrashIcon" />
                  </template>
                </BaseButton>
              </div>
            </div>
          </template>

          <template v-else>
            <NoOptions title="Belum Ada Jawaban Dibuat" />
          </template>

          <div class="mt-5 d-flex justify-content-center align-items-center">
            <BaseButton @click="handleTambahJawaban" title="Tambah Jawaban">
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
              <BaseButton @click="handleSubmit" title="Simpan"
                :disabled="formState.loadingSubmit || !formState.jawaban.length" :is-loading="formState.loadingSubmit">
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