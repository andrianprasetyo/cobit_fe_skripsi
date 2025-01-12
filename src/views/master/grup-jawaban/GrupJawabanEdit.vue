<script setup>
import { reactive, computed, onMounted } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import BaseSelect from '@/components/Select/BaseSelect.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import NoOptions from '@/components/EmptyPlaceholder/NoOptions.vue'

import GroupAnswerServices from '@/services/lib/group-answer'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, minValue, maxValue } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useAlert } from '@/stores/alert'
import { useRouter, useRoute } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

import groupAnswerType from '@/data/groupAnswerType.json'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const loading = useLoading()
const alert = useAlert()

const formState = reactive({
  loadingSubmit: false,
  loadingSubmitJawaban: false,
  loading: false,
  nama: '',
  jenis: '',
  jawaban: [
    {
      id: null,
      nama: '',
      bobot: ''
    }
  ]
})

const isJenisPilgan = computed(() => {
  return formState.jenis === 'pilgan'
})

const isJenisPersentase = computed(() => {
  return formState.jenis === 'persentase'
})

const minBobotValue = computed(() => {
  if (isJenisPilgan.value) {
    return 1
  } else if (isJenisPersentase.value) {
    return 0
  } else {
    return 0
  }
})

const maxBobotValue = computed(() => {
  if (isJenisPilgan.value) {
    /*
    return formState.jawaban.length
    */
    return 100
  } else {
    return 100
  }
})

const rules = computed(() => {
  return {
    nama: {
      required: helpers.withMessage('Silahkan isi nama', required),
    },
    jenis: {
      required: helpers.withMessage("Silahkan pilih jenis", required)
    },
    jawaban: {
      $each: helpers.forEach({
        nama: {
          required: helpers.withMessage('Silahkan isi jawaban', required),
        },
        bobot: {
          required: helpers.withMessage('Silahkan isi bobot', required),
          minValue: helpers.withMessage(`Bobot Min ${minBobotValue.value}`, minValue(minBobotValue.value)),
          maxValue: helpers.withMessage(`Bobot Max ${maxBobotValue.value}`, maxValue(maxBobotValue.value))
        }
      })
    }
  }
})

const v$ = useVuelidate(rules, formState, { $lazy: true, $autoDirty: false })

const getDetailGroupAnswer = async () => {
  const loader = loading.show()

  try {
    formState.loading = true
    const response = await GroupAnswerServices.getDetailGroupAnswer({ id: route.params?.id })

    if (response) {
      const data = response?.data;

      formState.nama = data?.nama
      formState.jenis = data?.jenis

      const jawabans = data?.jawabans

      if (Array.isArray(jawabans) && jawabans.length) {
        const listJawaban = []
        jawabans.map((item => listJawaban.push({
          id: item?.id,
          nama: item?.jawaban,
          bobot: item?.bobot
        })))
        formState.jawaban = listJawaban
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

const handleBack = () => {
  router.back()
}

const filterJawaban = (index) => {
  const filtered = formState.jawaban.filter((_, itemIndex) => itemIndex !== index)
  formState.jawaban = filtered
}

const removeJawaban = async ({ id, index }) => {

  try {
    const response = await GroupAnswerServices.deleteJawabanGroupAnswer({ id })

    if (response) {
      toast.success({
        title: 'Hapus Jawaban Grup Jawaban',
        text: `Berhasil Menghapus Data Jawaban Grup Jawaban`
      })

      filterJawaban(index)

      return response
    }
  } catch (error) {
    toast.error({ error })
    throw error
  }

}

const removeSemuaJawaban = async ({ id }) => {

  try {
    const response = await GroupAnswerServices.deleteSemuaJawabanGroupAnswer({ id })

    if (response) {
      toast.success({
        title: 'Hapus Semua Grup Jawaban',
        text: `Berhasil Menghapus Semua Data Grup Jawaban`
      })

      formState.jawaban = []
      return response
    }
  } catch (error) {
    toast.error({ error })
    throw error
  }
}

const handleRemoveJawaban = ({ title, id, index }) => {
  alert.info({
    title: `Apakah Anda Yakin untuk Menghapus Jawaban ${title}`
  }).then(async (result) => {
    if (result.isConfirmed && id) {
      alert.loading()
      try {
        const response = await removeJawaban({ id, index })

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

const handleRemoveSemuaJawaban = () => {
  alert.info({
    title: `Apakah Anda Yakin untuk Menghapus Semua Jawaban`
  }).then(async (result) => {
    if (result.isConfirmed) {
      alert.loading()
      try {
        const response = await removeSemuaJawaban({ id: route.params?.id })

        if (response) {
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
      }
    }
  })
}

const handleTambahJawaban = () => {
  formState.jawaban.push({
    id: null,
    nama: '',
    bobot: ''
  })
}

const handleSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const loader = loading.show()
    try {
      formState.loadingSubmit = true

      const response = await GroupAnswerServices.editGroupAnswer({
        id: route.params?.id,
        nama: formState.nama,
        jenis: formState.jenis,
        jawaban: formState.jawaban
      })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Edit Grup Jawaban',
          text: 'Berhasil Mengubah Data Grup Jawaban'
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

onMounted(() => {
  getDetailGroupAnswer()
})

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <div class="card-body">
          <div class="mb-3">
            <BaseInput id="nama" v-model="v$.nama.$model" label="Nama" placeholder="Masukkan Nama Grup Jawaban"
              tabindex="1" :isInvalid="v$.nama.$errors?.length"
              :disabled="formState.loadingSubmit || formState.loading" />
            <ErrorMessage :errors="v$.nama.$errors" />
          </div>

          <div class="mb-3">
            <BaseSelect id="jenis" v-model="v$.jenis.$model" label="Jenis" default-option="Pilih Jenis Grup Jawaban"
              :options="groupAnswerType" tabindex="2" :isInvalid="v$.jenis.$errors?.length"
              :disabled="formState.loadingSubmit || formState.loading" />
            <ErrorMessage :errors="v$.jenis.$errors" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
            <h5 class="card-title fw-semibold">Jawaban Grup</h5>

            <div>
              <BaseButton @click="handleRemoveSemuaJawaban" class="btn btn-outline-danger" title="Hapus Semua Jawaban">
                <template #icon-left>
                  <TablerIcon icon="TrashIcon" />
                </template>
              </BaseButton>
            </div>
          </div>

          <div class="d-flex flex-column mt-4">
            <template v-if="formState.jawaban.length">
              <div v-for="(jawaban, index) in formState.jawaban" :key="`jawaban-${index}`" class="row mb-3">
                <div class="col-12 col-md-9 mb-2 mb-md-0">
                  <BaseInput :id="`input-jawaban-${index}`" :label="`Jawaban ${isJenisPilgan ? index + 1 : ''}`"
                    v-model="v$.jawaban.$model[index].nama" placeholder="Masukkan Jawaban" :tabindex="3 + (index + 1)"
                    :disabled="formState.loadingSubmit || formState.loading"
                    :is-invalid="!!v$.jawaban.$each?.$response?.$errors[index]?.nama?.length" />
                  <ErrorMessage
                    v-if="Array.isArray(v$.jawaban.$each?.$response?.$errors) && v$.jawaban.$each?.$response?.$errors.length"
                    :errors="v$.jawaban.$each?.$response?.$errors[index]?.nama" />
                </div>
                <div class="col-12 col-md-2">
                  <BaseInput :id="`input-Bobot-${index}`" :label="`Bobot`" type="number"
                    v-model="v$.jawaban.$model[index].bobot" placeholder="Masukkan Bobot" :tabindex="3 + (index + 1)"
                    :disabled="formState.loadingSubmit || formState.loading"
                    :is-invalid="!!v$.jawaban.$each?.$response?.$errors[index]?.bobot?.length" />
                  <ErrorMessage
                    v-if="Array.isArray(v$.jawaban.$each?.$response?.$errors) && v$.jawaban.$each?.$response?.$errors.length"
                    :errors="v$.jawaban.$each?.$response?.$errors[index]?.bobot" />
                </div>
                <div class="col-12 col-md-1 d-flex justify-content-center align-items-center mb-2 mb-md-0">
                  <BaseButton @click="handleRemoveJawaban({ id: jawaban.id, title: jawaban.nama, index: index })"
                    class="btn btn-outline-danger w-100"
                    :class="[v$.jawaban.$each?.$response?.$errors[index]?.nama?.length || v$.jawaban.$each?.$response?.$errors[index]?.bobot?.length ? 'mt-1' : 'mt-4']"
                    :access="['master-add', 'master-edit', 'master-delete']">
                    <TablerIcon icon="TrashIcon" />
                  </BaseButton>
                </div>
              </div>
            </template>

            <template v-else>
              <NoOptions title="Belum Ada Jawaban Dibuat" />
            </template>

            <div v-if="(isJenisPersentase && !formState.jawaban.length) || isJenisPilgan"
              class="mt-2 d-flex justify-content-center align-items-center">
              <BaseButton @click="handleTambahJawaban" title="Tambah Jawaban" :access="['master-add', 'master-edit', 'master-delete']">
                <template #icon-left>
                  <TablerIcon icon="PlusIcon" />
                </template>
              </BaseButton>
            </div>

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
              <BaseButton @click="handleSubmit" title="Simpan Perubahan" :disabled="formState.loadingSubmit"
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