<script setup>
import { reactive, computed } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import BaseSelect from '@/components/Select/BaseSelect.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'

import GroupAnswerServices from '@/services/lib/group-answer'

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useRouter } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

import groupAnswerType from '@/data/groupAnswerType.json'

const toast = useToast()
const router = useRouter()
const loading = useLoading()

const formState = reactive({
  loadingSubmit: false,
  nama: '',
  jenis: '',
  jawaban: [
    {
      nama: '',
      bobot: ''
    }
  ]
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
          required: helpers.withMessage('Silahkan isi baseline', required),
        }
      })
    }
  }
})

const v$ = useVuelidate(rules, formState, { $lazy: true, $autoDirty: true })

const handleBack = () => {
  router.back()
}

const handleRemoveJawaban = (index) => {
  const filtered = formState.jawaban.filter((_, itemIndex) => itemIndex !== index)
  formState.jawaban = filtered
}

const handleTambahJawaban = () => {
  formState.jawaban.push({
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

      const response = await GroupAnswerServices.createGroupAnswer({ nama: formState.nama, jenis: formState.jenis, jawaban: formState.jawaban })

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Tambah Group Answer',
          text: 'Berhasil Menambahkan Data Group Answer'
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
          <div class="mb-3">
            <BaseInput id="nama" v-model="v$.nama.$model" label="Nama" placeholder="Masukkan Nama Group Answer"
              tabindex="1" :isInvalid="v$.nama.$errors?.length" :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.nama.$errors" />
          </div>

          <div class="mb-3">
            <BaseSelect id="jenis" v-model="v$.jenis.$model" label="Jenis" default-option="Pilih Jenis Group Answer"
              :options="groupAnswerType" tabindex="2" :isInvalid="v$.jenis.$errors?.length"
              :disabled="formState.loadingSubmit" />
            <ErrorMessage :errors="v$.jenis.$errors" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h4 class="fw-semibold mb-8">Jawaban Group Answer</h4>

          <div class="d-flex flex-column mt-4">
            <template v-if="formState.jawaban.length">
              <div v-for="(_, index) in formState.jawaban" :key="`jawaban-${index}`" class="row mb-3">
                <div class="col-12 col-md-9 mb-2 mb-md-0">
                  <BaseInput :id="`input-jawaban-${index}`" :label="`Jawaban ${index + 1}`"
                    v-model="v$.jawaban.$model[index].nama" placeholder="Masukkan Jawaban" :tabindex="3 + (index + 1)"
                    :disabled="formState.loadingSubmit"
                    :isInvalid="!!v$.jawaban.$each?.$response?.$errors[index]?.nama?.length" />
                  <ErrorMessage
                    v-if="Array.isArray(v$.jawaban.$each?.$response?.$errors) && v$.jawaban.$each?.$response?.$errors.length"
                    :errors="v$.jawaban.$each?.$response?.$errors[index].nama" />
                </div>
                <div class="col-12 col-md-2">
                  <BaseInput :id="`input-baseline-${index}`" :label="`Skor Baseline`" type="number"
                    v-model="v$.jawaban.$model[index].bobot" placeholder="Masukkan Baseline" :tabindex="3 + (index + 1)"
                    :disabled="formState.loadingSubmit"
                    :isInvalid="!!v$.jawaban.$each?.$response?.$errors[index]?.bobot?.length" />
                  <ErrorMessage
                    v-if="Array.isArray(v$.jawaban.$each?.$response?.$errors) && v$.jawaban.$each?.$response?.$errors.length"
                    :errors="v$.jawaban.$each?.$response?.$errors[index].bobot" />
                </div>
                <div class="col-12 col-md-1 d-flex justify-content-center align-items-center mb-2 mb-md-0">
                  <BaseButton @click="handleRemoveJawaban(index)" class="btn btn-outline-danger w-100"
                    :class="[v$.jawaban.$each?.$response?.$errors[index]?.name?.length || v$.jawaban.$each?.$response?.$errors[index]?.bobot?.length ? 'mt-1' : 'mt-4']">
                    <TablerIcon icon="TrashIcon" />
                  </BaseButton>
                </div>
              </div>
            </template>

            <div class="mt-2 d-flex justify-content-center align-items-center">
              <BaseButton @click="handleTambahJawaban" title="Tambah Jawaban">
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