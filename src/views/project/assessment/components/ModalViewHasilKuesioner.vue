<script setup>
import { reactive, watch, computed } from 'vue'

import BaseModal from '@/components/Modal/BaseModal.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'
import RoundedLightChip from '@/components/Chip/RoundedLightChip.vue'

import RespondenServices from '@/services/lib/responden'

import { useRoute } from 'vue-router'
import { useToast } from '@/stores/toast'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
})

const emits = defineEmits(['close', 'refresh'])

const route = useRoute()
const toast = useToast()
const assessment = useAssessmentStore()

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const kuesionerState = reactive({
  loading: false,
  data: {
    header: [],
    kuesioner: []
  },
})

const assessmentId = computed(() => route?.params?.id)

/* --------------------------------- METHODS -------------------------------- */
const getResultKuesioner = async ({ assesment_id, assesment_users_id }) => {
  try {
    kuesionerState.loading = true
    const response = await RespondenServices.getResultKuesioner({ assesment_id, assesment_users_id })

    if (response) {
      const data = response?.data

      kuesionerState.data.header = data?.header || []
      kuesionerState.data.kuesioner = data?.quesioner || []
      kuesionerState.loading = false
    }
  } catch (error) {
    kuesionerState.loading = false
    toast.error({ error })
  }
}

const resetState = () => {
  kuesionerState.data.header = []
  kuesionerState.data.kuesioner = []
}

const handleClose = () => {
  resetState()
  emits('close', true)
}

/* ---------------------------------- HOOKS --------------------------------- */
watch(() => props.isShow,
  () => {
    if (props.isShow && assessment.selectedResponden) {
      getResultKuesioner({ assesment_id: assessmentId.value, assesment_users_id: assessment.selectedResponden?.id })
    }
  }, { deep: true })

</script>

<template>
  <BaseModal id="view_hasil_kuesioner_by_responden" :order="5" :open="props.isShow" :showBtnCloseFooter="true"
    classNameModal="modal-xl" @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Hasil Kuesioner
      </h4>
    </template>

    <template #body>
      <div class="position-relative">
        <LoadingOverlay :height="40" :active="kuesionerState.loading" />
        <template v-if="!kuesionerState.loading">
          <div v-if="assessment?.selectedResponden" class="border rounded">
            <div class="p-4">
              <div>
                <h6 class="fw-semibold fs-4 mb-0">{{ assessment?.selectedResponden?.nama }}</h6>
                <p class="mb-0">{{ assessment?.selectedResponden?.email }}</p>
              </div>

              <hr />

              <div class="row">
                <div class="col-12 col-md-4 mb-3 mb-md-0">
                  <p class="mb-1 fs-2">Organisasi</p>
                  <h6 class="fw-semibold mb-0">
                    {{ assessment?.selectedResponden?.assesment?.organisasi?.nama || "-" }}
                  </h6>
                </div>
                <div class="col-12 col-md-4 mb-3 mb-md-0">
                  <p class="mb-1 fs-2">Divisi</p>
                  <h6 class="fw-semibold mb-0">{{ assessment?.selectedResponden?.divisi?.nama || "-" }}</h6>
                </div>
                <div class="col-12 col-md-4">
                  <p class="mb-1 fs-2">Jabatan</p>
                  <h6 class="fw-semibold mb-0">{{ assessment?.selectedResponden?.jabatan?.nama || "-" }}</h6>
                </div>
              </div>
            </div>
          </div>

          <div class="border rounded mt-3">
            <div class="p-4">
              <h5 class="text-dark mb-0 fs-5">Hasil</h5>
              <hr />

              <template
                v-if="Array.isArray(kuesionerState.data.kuesioner) && kuesionerState.data.kuesioner.length && Array.isArray(kuesionerState.data.kuesioner?.[0]?.jawaban_quesioner) && kuesionerState.data?.kuesioner?.[0]?.jawaban_quesioner?.length">
                <template v-for="(item, index) in kuesionerState.data.kuesioner?.[0]?.jawaban_quesioner"
                  :key="`header-item-${item?.id}`">
                  <div class="d-flex flex-row">
                    <div>
                      <RoundedLightChip variant="primary">
                        <span>{{ index + 1 }}</span>
                      </RoundedLightChip>

                    </div>
                    <div class="flex-grow-1 ms-2 row mb-3">
                      <div class="col-12 col-md-4 mb-3 mb-md-0">
                        <p class="mb-1 fs-2">Kode Design Factor</p>
                        <h6 class="fw-semibold mb-0">{{ item?.jawaban?.kode }}</h6>
                      </div>
                      <div class="col-12 col-md-8 mb-3 mb-md-0">
                        <p class="mb-1 fs-2">Komponen Design Factor</p>
                        <h6 class="fw-semibold mb-0">{{ item?.jawaban?.nama }}</h6>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <div class="fw-semibold fs-4 mb-0 text-dark pb-0" v-html="item?.jawaban?.pertanyaan" />
                    <div class="p-2 bg-light rounded-1 text-dark fs-3">
                      {{ item?.jawaban?.jawaban }}
                    </div>
                    <h6 class="fs-2 text-muted mt-2 ms-2">Bobot : <span class="text-primary">{{ item?.jawaban?.bobot
                        }}</span></h6>
                  </div>
                  <hr class="my-3" />
                </template>
              </template>
            </div>
          </div>
        </template>
        <template v-else>
          <NoData title="Tidak Ada Data Kuesioner" />
        </template>
      </div>
    </template>
  </BaseModal>
</template>