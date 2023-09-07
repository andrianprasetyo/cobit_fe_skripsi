<script setup>
import { reactive, onMounted, computed } from 'vue'

import BaseInput from '@/components/Input/BaseInput.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import CapabilityServices from '@/services/lib/capability'

import { useToast } from '@/stores/toast'
import { useLoading } from 'vue-loading-overlay'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'


const toast = useToast()
const loading = useLoading()
const assessmentStore = useAssessmentStore()

/* ---------------------------------- STATE --------------------------------- */
const capability = reactive({
  loading: false,
  loadingSubmit: false,
  data: [],
  answer: []
})

const valueAnwer = computed(() => {
  return value => {
    if (!value) return null

    const answered = capability.answer.find(item => item?.id === value)

    return answered?.bobot
  }
})

/* --------------------------------- METHODS -------------------------------- */
const getDetailLevelCapability = async () => {
  const loader = loading.show()

  try {
    capability.loading = true
    const response = await CapabilityServices.getDetailLevelCapability({ level: '2', domain_id: assessmentStore.capability.selectedGamo?.id })

    if (response) {
      const data = response?.data;

      capability.data = data?.list || []
      capability.answer = data?.answer || []

      capability.loading = false
      loader.hide()
    }

  } catch (error) {
    capability.loading = false
    loader.hide()
    toast.error({ error })
  }
}

const onSubmit = async () => {
  const loader = loading.show()

  try {
    capability.loadingSubmit = true
    const response = await CapabilityServices.answerLevelCapability({ jawaban: capability.data })

    if (response) {
      toast.success({
        title: 'Simpan Data Capability Level 2',
        text: 'Berhasil Menyimpan Data Capability Level 2'
      })

      capability.loadingSubmit = false
      loader.hide()

      getDetailLevelCapability()
    }

  } catch (error) {
    capability.loadingSubmit = false
    loader.hide()
    toast.error({ error })
  }
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getDetailLevelCapability()
})

</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex flex-row justify-content-between align-items-center">
        <h5 class="card-title mb-3 mb-md-0 fw-semibold">Level 2</h5>

        <div
          class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
          <BaseButton @click="onSubmit" class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3" title="Simpan Data"
            :disabled="capability.loadingSubmit || capability.loading" :is-loading="capability.loadingSubmit">
            <template #icon-left>
              <TablerIcon icon="DeviceFloppyIcon" />
            </template>
          </BaseButton>
        </div>
      </div>


      <div class="table-responsive rounded-2 mb-4 mt-4">
        <div class="mh-100vh">
          <table class="table border customize-table text-nowrap mb-0 align-middle">
            <thead class="position-sticky top-0 bg-white text-dark" style="z-index: 5 !important;">
              <tr>
                <th class="width-150px align-middle" rowspan="2">
                  <div class="width-100px text-break text-wrap">
                    <h6 class="fs-3 fw-semibold mb-0">Management Practice Code</h6>
                  </div>
                </th>
                <th class="align-middle" rowspan="2">
                  <h6 class="fs-3 fw-semibold mb-0">Activities</h6>
                </th>
                <th class="align-middle" rowspan="2">
                  <h6 class="fs-3 fw-semibold mb-0">Translate</h6>
                </th>
                <template v-if="Array.isArray(capability.answer) && capability.answer.length">
                  <th class="align-middle text-center" colspan="5" rowspan="1">
                    <h6 class="fs-3 fw-semibold mb-0">Asesmen</h6>
                  </th>
                </template>
                <th class="align-middle text-center bg-light-primary" rowspan="2">
                  <h6 class="fs-3 fw-semibold mb-0">Value</h6>
                </th>
                <th class="align-middle text-center bg-light" rowspan="2">
                  <h6 class="fs-3 fw-semibold mb-0">Weight</h6>
                </th>
                <th class="align-middle" rowspan="2">
                  <h6 class="fs-3 fw-semibold mb-0">Note</h6>
                </th>
                <th class="align-middle" rowspan="2">
                  <h6 class="fs-3 fw-semibold mb-0">Opportunity for Improvement</h6>
                </th>
              </tr>
              <tr>
                <th v-for="item in capability.answer" :key="`header-item-${item?.id}`" rowspan="1"
                  class="width-125px align-middle">
                  <div class="width-100px text-break text-wrap text-center">
                    <h6 class="fs-3 fw-semibold mb-0">
                      {{ item?.nama }} ({{ item?.bobot }})
                    </h6>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              <template v-if="Array.isArray(capability.data) && capability.data.length">
                <tr v-for="(item, index) in capability.data" :key="`capability-level-2-item-${index}`">
                  <td>
                    <div v-if="item?.subkode" class="width-100px text-break text-wrap fw-bold" v-html="item?.subkode" />
                  </td>
                  <td class="width-250px">
                    <div class="d-flex flex-wrap justify-content-center ">
                      <div v-if="item?.kegiatan" class="width-200px text-break text-wrap" v-html="item?.kegiatan" />
                    </div>
                  </td>
                  <td class="width-250px">
                    <div class="d-flex flex-wrap justify-content-center ">
                      <div v-if="item?.translate" class="width-200px text-break text-wrap" v-html="item?.translate" />
                    </div>
                  </td>

                  <template v-if="Array.isArray(capability.answer) && capability.answer.length">
                    <td v-for="(answer, indexAnswer) in capability.answer" :key="`answer-${index}-${indexAnswer}`">
                      <div class="form-check form-check-inline d-flex justify-content-center align-items-center">
                        <input type="radio" class="form-check-input primary check-outline outline-primary"
                          :value="answer?.id" :id="`radio-answer-${index}-${indexAnswer}`"
                          v-model="item.capabilityass.capability_answer_id" :name="`radio-answer-${index}`" />
                      </div>
                    </td>
                  </template>
                  <td class="text-center bg-light-primary">
                    <div class="width-50px">
                      <h6 class="fs-3 fw-semibold mb-0">
                        {{ valueAnwer(item?.capabilityass?.capability_answer_id) }}
                      </h6>
                    </div>
                  </td>
                  <td class="text-center bg-light">
                    {{ item?.bobot }}
                  </td>
                  <td>
                    <div class="d-flex flex-column justify-content-center width-250px">
                      <BaseInput type="text-area" :id="`note-${index}`" class="form-control" :name="`input-note-${index}`"
                        placeholder="Silakan isi Catatan (Jika Ada)" v-model="item.capabilityass.note" />
                    </div>
                  </td>
                  <td>
                    <div class="d-flex flex-column justify-content-center width-250px">
                      <BaseInput type="text-area" :id="`ofi-${index}`" class="form-control" :name="`input-ofi-${index}`"
                        placeholder="Silakan isi Opportunity for Improvement (Jika Ada)"
                        v-model="item.capabilityass.ofi" />
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>

            <template v-if="Array.isArray(capability.answer) && capability.answer.length">
              <tfoot class="position-sticky bottom-0">
                <tr>
                  <td colspan="3"></td>
                  <td colspan="5">
                    <h6 class="fs-3 fw-semibold mb-0 text-center">
                      Values
                    </h6>
                  </td>
                  <td class="text-center bg-light-primary">
                    <h6 class="fs-3 fw-semibold mb-0">
                      0
                    </h6>
                  </td>
                  <td class="text-center bg-light">
                    <h6 class="fs-3 fw-semibold mb-0">
                      0
                    </h6>
                  </td>
                  <td colspan="2"></td>
                </tr>
                <tr>
                  <td colspan="3"></td>
                  <td colspan="5">
                    <h6 class="fs-3 fw-semibold mb-0 text-center">
                      Compliances
                    </h6>
                  </td>
                  <td colspan="2" class="bg-primary">
                    <h6 class="fs-3 fw-semibold mb-0 text-center text-white">
                      0
                    </h6>
                  </td>
                  <td colspan="2"></td>
                </tr>
              </tfoot>
            </template>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>