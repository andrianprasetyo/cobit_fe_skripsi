<script setup>
import { reactive, computed, onMounted } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import NoOptions from '@/components/EmptyPlaceholder/NoOptions.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'
import BaseCheckboxInputWithVModel from '@/components/Input/BaseCheckboxInputWithVModel.vue'

import DesignFactorServices from '@/services/lib/design-factor'
import OrganisasiServices from '@/services/lib/organisasi'

import { useToast } from '@/stores/toast'
import { useRouter, useRoute } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const loading = useLoading()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loadingSubmit: false,
  listDesignFactor: {
    loading: false,
    data: [],
  },
  selectedDesignFactor: [],
})

const divisiNama = computed(() => route.query?.divisi);
const organisasiNama = computed(() => route?.query?.organisasi)

const divisiId = computed(() => route.params?.divisi_id);

/* --------------------------------- METHODS -------------------------------- */
const getListDesignFactor = async ({ nopaging }) => {
  try {
    formState.listDesignFactor.loading = true
    const response = await DesignFactorServices.getListDesignFactor({ nopaging })

    if (response) {
      const data = response?.data

      formState.listDesignFactor.data = data?.list || []
      formState.listDesignFactor.loading = false
    }
  } catch (error) {
    formState.listDesignFactor.loading = false
    toast.error({ error })
  }
}

const getDetailDivisi = async ({ id }) => {
  const loader = loading.show()

  try {
    formState.loading = true
    const response = await OrganisasiServices.getDetailDivisi({ id })

    if (response) {
      const data = response?.data;

      if (Array.isArray(data?.mapsdf) && data?.mapsdf?.length) {
        data?.mapsdf.forEach(item => formState.selectedDesignFactor.push(item?.design_faktor_id))
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

const handleSubmit = async () => {
  const loader = loading.show()
  try {
    const response = await OrganisasiServices.mappingDesignFactorDivisi({
      id: divisiId.value,
      df: formState.selectedDesignFactor,
    })

    if (response) {
      loader.hide()
      formState.loadingSubmit = false
      toast.success({
        title: 'Atur Design Factor Berdasarkan Divisi',
        text: 'Berhasil Mengatur Design Factor Berdasarkan Divisi'
      })
      handleBack()
    }

  } catch (error) {
    loader.hide()
    formState.loadingSubmit = false
    toast.error({ error })
  }
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getListDesignFactor({ nopaging: 1 });
  getDetailDivisi({ id: divisiId.value });
})
</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <div class="card-header">
          <h5 class="card-title fw-semibold">
            Atur Design Factor Berdasarkan Divisi
          </h5>
          <p class="card-subtitle mb-0">
            Organisasi : <span class="fw-bold">{{ organisasiNama }}</span>
            /
            Divisi: <span class="fw-bold">{{ divisiNama }}</span>
          </p>
        </div>

        <div class="card-body">
          <LoadingOverlay :height="25" :active="formState.listDesignFactor.loading" />

          <template v-if="Array.isArray(formState.listDesignFactor.data) && formState.listDesignFactor.data.length">
            <template v-for="(designFactor, index) in formState.listDesignFactor.data"
              :key="`design-factor-${designFactor?.id}`">
              <div class="d-flex flex-row border rounded mb-3 p-4">
                <div>
                  <div
                    class="p-2 rounded-1 d-flex align-items-center justify-content-center bg-light-primary text-primary">
                    <span>{{ index + 1 }}</span>
                  </div>
                </div>
                <div class="flex-grow-1 ms-2 row">
                  <div class="col-12 col-md-11 mb-md-0">
                    <p class="mb-1 fs-2">Design Factor : </p>
                    <h6 class="fw-semibold mb-0">
                      {{ designFactor?.nama }}
                    </h6>
                  </div>
                  <div class="col-12 col-md-1 mb-md-0 d-flex justify-content-end align-items-center">
                    <BaseCheckboxInputWithVModel :id="`design-factor-${designFactor?.id}`"
                      :name="`design-factor-${designFactor?.id}`"
                      :disabled="formState.listDesignFactor.loading || formState.loadingSubmit"
                      style="transform: scale(1.15);" :value="designFactor?.id" :true-value="designFactor?.id"
                      :false-value="null" v-model="formState.selectedDesignFactor">
                    </BaseCheckboxInputWithVModel>
                  </div>
                </div>
              </div>
            </template>
          </template>

          <template v-else>
            <NoOptions title="Belum Ada Design Factor Dibuat" />
          </template>
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
                :is-loading="formState.loadingSubmit" :access="['master-organisasi-edit']">
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