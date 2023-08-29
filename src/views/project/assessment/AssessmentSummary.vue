<script setup>
import { reactive, onMounted, computed } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
import NoData from '@/components/EmptyPlaceholder/NoData.vue'
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import ReportServices from '@/services/lib/report'

import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

const toast = useToast()
const route = useRoute()
const loading = useLoading()

/* ---------------------------------- STATE --------------------------------- */
const report = reactive({
  loadingSubmit: false,
  loading: false,
  data: null
})

/* -------------------------------- COMPUTED -------------------------------- */
const concludedScope = computed(() => {
  return ({ refinedScope, adjustment }) => {
    return refinedScope + adjustment
  }
})

const suggessCapabilityLevel = computed(() => {
  return value => {
    if (value >= 75) {
      return 4
    } else if (value >= 50) {
      return 3
    } else if (value >= 25) {
      return 2
    } else {
      return 1
    }
  }
})

/* --------------------------------- METHODS -------------------------------- */
const getReportCanvasAssessment = async () => {
  const loader = loading.show()

  try {
    report.loading = true
    const response = await ReportServices.getReportCanvasAssessment({ assessment_id: route.params?.id })

    if (response) {
      const data = response?.data;

      report.data = data

      report.loading = false
      loader.hide()
    }

  } catch (error) {
    report.loading = false
    loader.hide()
    toast.error({ error })
  }
}

const setHasilCanvasAssessment = async () => {
  const loader = loading.show()

  try {
    report.loading = true
    const response = await ReportServices.setHasilCanvasAssessment({ id: route.params?.id })

    if (response) {
      report.loading = false
      loader.hide()
      getReportCanvasAssessment()
    }

  } catch (error) {
    report.loading = false
    loader.hide()
    toast.error({ error })
  }
}

const onSubmitAdjustment = async () => {
  const loader = loading.show()

  try {
    report.loadingSubmit = true
    const response = await ReportServices.setAdjustmentCanvasAssessment({ assement_id: route.params?.id, data: report.data })

    if (response) {
      toast.success({
        title: 'Data Adjustment',
        text: 'Berhasil Menyimpan Data Adjustment'
      })

      report.loadingSubmit = false
      loader.hide()
    }

  } catch (error) {
    report.loadingSubmit = false
    loader.hide()
    toast.error({ error })
  }
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getReportCanvasAssessment()
})


</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <div class="card">
        <div class="card-body">
          <div class="d-flex flex-row justify-content-between align-items-center">
            <h5 class="card-title mb-9 fw-semibold">Summary Assessment</h5>

            <div
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-center justify-content-md-between">
              <BaseButton @click="setHasilCanvasAssessment" class="btn btn-outline-primary" title="Refresh Data"
                :disabled="report.loading">
                <template #icon-left>
                  <TablerIcon icon="RefreshIcon" />
                </template>
              </BaseButton>

              <BaseButton @click="onSubmitAdjustment" class="btn btn-primary ms-0 mt-3 mt-md-0 ms-md-3"
                title="Simpan Perubahan" :disabled="report.loading || report.loadingSubmit"
                :is-loading="report.loadingSubmit">
                <template #icon-left>
                  <TablerIcon icon="DeviceFloppyIcon" />
                </template>
              </BaseButton>


            </div>
          </div>

          <template v-if="report.loading">
            <LoadingSpinner />
          </template>

          <template v-else>
            <div class="table-responsive rounded-2 mb-4 mt-4">
              <table class="table border text-nowrap mb-0 align-middle">
                <thead>
                  <tr>
                    <th class="bg-primary border-0" />
                    <th colspan="5" class="bg-primary text-white text-center border-0">
                      Step 2: Determine the initial scope of the Governance System
                    </th>
                    <th colspan="7" class="bg-light-dark text-white text-center border-0">
                      Step 3: Refine the scope of the Governance System
                    </th>
                    <th colspan="6" class="bg-light-primary text-primary text-center border-0">
                      Step 4: Conclude the Scope of the Governance System
                    </th>
                  </tr>

                  <!-- Design Factor Header -->
                  <tr>
                    <th class="width-200px align-middle">Design Factor</th>
                    <template v-if="Array.isArray(report.data?.df) && report.data?.df.length">
                      <template v-for="(df, indexDf) in report.data?.df" :key="`${indexDf}-${df?.id}`">
                        <th v-if="indexDf <= 3" class="width-200px align-middle">
                          <!-- Design Factor Header Section 1-->
                          <div class="d-flex flex-wrap">
                            <div class="width-150px text-break text-wrap text-center">
                              {{ df?.nama }}
                            </div>
                          </div>
                        </th>

                        <!-- Step Scope 1 -->
                        <th v-else-if="indexDf === 4" class="bg-primary text-white width-250px align-middle border-0">
                          <div class="d-flex flex-wrap">
                            <div class="width-200px text-break text-wrap text-center">
                              Initial Scope: Governance/Management Objectives Score
                            </div>
                          </div>
                        </th>

                        <!-- Design Factor Header Section 2-->
                        <th v-if="indexDf >= 4" class="width-200px align-middle">
                          <!-- Design Factor Header-->
                          <div class="d-flex flex-wrap">
                            <div class="width-150px text-break text-wrap text-center">
                              {{ df?.nama }}
                            </div>
                          </div>
                        </th>
                      </template>

                    </template>
                    <th class="bg-light-dark text-white border-0 width-250px align-middle">
                      <div class="d-flex flex-wrap">
                        <div class="width-250px text-break text-wrap text-center">
                          Refined Scope: Governance/Management Objectives Score
                        </div>
                      </div>
                    </th>
                    <th class="width-150px  align-middle border-0">
                      <div class="d-flex flex-wrap">
                        <div class="width-150px text-break text-wrap text-center">
                          Adjustment (between -100 and +100)
                        </div>
                      </div>
                    </th>
                    <th class="width-300px align-middle border-0">
                      <div class="d-flex flex-wrap">
                        <div class="width-250px text-break text-wrap text-center">
                          Reason
                        </div>
                      </div>
                    </th>
                    <th class="bg-light-primary text-primary align-middle">
                      <div class="d-flex flex-wrap">
                        <div class="width-200px text-break text-wrap text-center">
                          Concluded Scope: Governance/Management Objectives Priority
                        </div>
                      </div>
                    </th>
                    <th class="bg-light-primary text-primary align-middle">
                      <div class="d-flex flex-wrap">
                        <div class="width-150px text-break text-wrap text-center">
                          Suggested Target Capability Level
                        </div>
                      </div>
                    </th>
                    <th class="align-middle  border-0">
                      <div class="d-flex flex-wrap">
                        <div class="width-150px text-break text-wrap text-center">
                          Agreed Target Capability Level
                        </div>
                      </div>
                    </th>
                    <th class="width-300px align-middle  border-0">
                      <div class="d-flex flex-wrap">
                        <div class="width-250px text-break text-wrap text-center">
                          Reason
                        </div>
                      </div>
                    </th>
                  </tr>

                  <!-- Weight -->
                  <tr>
                    <th class="width-250px">Weight</th>
                    <template v-if="Array.isArray(report.data?.weight) && report.data?.weight.length">
                      <template v-for="(weight, indexWeight) in report.data?.weight"
                        :key="`${indexWeight}-${weight?.id}`">
                        <th v-if="indexWeight <= 3" class="text-center">
                          <div>
                            <BaseInput :id="`weight-${indexWeight}`" class="text-center form-control" type="number"
                              placeholder="Masukkan Weight" v-model="report.data.weight[indexWeight].weight" />
                          </div>

                        </th>
                        <th v-else-if="indexWeight === 4" class="bg-primary border-0 text-white width-250px" />
                        <th v-if="indexWeight >= 4" class="text-center">
                          <div>
                            <BaseInput :id="`weight-${indexWeight}`" class="text-center form-control"
                              placeholder="Masukkan Weight" v-model="report.data.weight[indexWeight].weight" />
                          </div>
                        </th>
                      </template>
                    </template>
                    <th class="bg-light-dark text-white border-0 width-250px" />
                    <th colspan="2" class=" border-0 width-250px" />
                    <th colspan="2" class="bg-light-primary order-0" />
                    <th colspan="2" class=" border-0 width-250px" />
                  </tr>
                </thead>

                <tbody>
                  <template v-if="Array.isArray(report.data?.hasil) && report.data?.hasil?.length">
                    <tr v-for="(hasil, indexHasil) in report.data?.hasil" :key="`hasil-${indexHasil}`">
                      <!-- Domain -->
                      <td>
                        <div class="d-flex flex-wrap flex-column">
                          <div v-if="hasil?.kode" class="width-250px text-break text-wrap fw-bold" v-html="hasil?.kode" />
                          <div v-if="hasil?.ket" class="width-250px text-break text-wrap" v-html="hasil?.ket" />
                        </div>
                      </td>
                      <template v-if="Array.isArray(hasil?.assesmenthasil) && hasil?.assesmenthasil?.length">
                        <!-- Domain Section 1 -->
                        <template v-for="(assessmentHasil, indexAssessmentHasil) in hasil?.assesmenthasil"
                          :key="`assessmentHasil-${indexAssessmentHasil}`">
                          <td v-if="indexAssessmentHasil <= 3" class="text-center">
                            {{ assessmentHasil?.relative_importance }}
                          </td>

                          <!-- Domain Scope 1 -->
                          <td v-else-if="indexAssessmentHasil === 4" class="bg-light fw-bold width-250px text-center">
                            {{ hasil?.assesmentcanvas?.step2_init_value }}
                          </td>

                          <!-- Domain Step 2 -->
                          <td v-if="indexAssessmentHasil >= 4" class="text-center">
                            {{ assessmentHasil?.relative_importance }}
                          </td>
                        </template>
                      </template>
                      <td class="bg-light fw-bold border-0 width-250px text-center">
                        {{ hasil?.assesmentcanvas?.step3_init_value }}
                      </td>
                      <td>
                        <BaseInput :id="`adjustment-${indexHasil}`" class="text-center form-control" type="number"
                          v-model="report.data.hasil[indexHasil].assesmentcanvas.adjustment"
                          placeholder="Masukkan Nilai Adjustment (Jika Perlu)" />
                      </td>
                      <td>
                        <BaseInput :id="`reason-adjustment-${indexHasil}`"
                          v-model="hasil.assesmentcanvas.reason_adjustment" placeholder="Masukkan Alasan (Jika Ada)" />
                      </td>
                      <td class="text-center bg-light fw-bold">
                        {{ concludedScope({
                          refinedScope: hasil?.assesmentcanvas?.step3_init_value, adjustment:
                            hasil.assesmentcanvas.adjustment
                        }) }}
                      </td>
                      <td class="text-center bg-light fw-bold">
                        {{ suggessCapabilityLevel(concludedScope({
                          refinedScope: hasil?.assesmentcanvas?.step3_init_value, adjustment:
                            hasil.assesmentcanvas.adjustment
                        })) }}
                      </td>
                      <td class="text-center">
                        {{ hasil?.assesmentcanvas?.aggreed_capability_level }}
                      </td>
                      <td class="text-center">
                        <BaseInput :id="`reason-${indexHasil}`" v-model="hasil.assesmentcanvas.reason"
                          placeholder="Masukkan Alasan (Jika Ada)" />
                      </td>
                    </tr>
                  </template>

                  <template v-else>
                    <tr>
                      <th colspan="20">
                        <NoData />
                      </th>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>