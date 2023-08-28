<script setup>
import { reactive, onMounted } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseInput from '@/components/Input/BaseInput.vue'
// import BaseButton from '@/components/Button/BaseButton.vue'
// import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import ReportServices from '@/services/lib/report'

import { useToast } from '@/stores/toast'
import { useRoute } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'
import { computed } from 'vue'

const toast = useToast()
const route = useRoute()
const loading = useLoading()

/* ---------------------------------- STATE --------------------------------- */
const report = reactive({
  loading: false,
  data: null
})

/* -------------------------------- COMPUTED -------------------------------- */
const concludedScope = computed(() => {
  return ({ refinedScope, adjustment }) => {
    return refinedScope + adjustment
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
          <h5 class="card-title mb-9 fw-semibold">Report / Hasil Assessment</h5>

          <div class="table-responsive rounded-2 mb-4 mt-4">
            <table class="table border text-nowrap mb-0 align-middle">
              <thead>
                <tr>
                  <th class="bg-primary border-0" />
                  <th colspan="5" class="bg-primary text-white text-center border-0 rounded-top-3 rounded-start-0">
                    Step 2: Determine the initial scope of the Governance System
                  </th>
                  <th colspan="7"
                    class="bg-light-dark text-white text-center border-0 rounded-bottom-0 rounded-start-0 rounded-top-3 ">
                    Step 3: Refine the scope of the Governance System
                  </th>
                  <th colspan="6" class="bg-light-primary text-primary text-center border-0">
                    Step 4: Conclude the Scope of the Governance System
                  </th>
                </tr>

                <!-- Design Factor Header -->
                <tr>
                  <th class="width-250px align-middle">Design Factor</th>
                  <template v-if="Array.isArray(report.data?.df) && report.data?.df.length">
                    <template v-for="(df, indexDf) in report.data?.df" :key="`${indexDf}-${df?.id}`">
                      <th v-if="indexDf <= 3" class="width-250px align-middle">
                        <!-- Design Factor Header Section 1-->
                        <div class="d-flex flex-wrap">
                          <div class="width-250px text-break text-wrap text-center">
                            {{ df?.nama }}
                          </div>
                        </div>
                      </th>

                      <!-- Step Scope 1 -->
                      <th v-else-if="indexDf === 4" class="bg-primary text-white width-250px align-middle border-0">
                        <div class="d-flex flex-wrap">
                          <div class="width-250px text-break text-wrap text-center">
                            Initial Scope: Governance/Management Objectives Score
                          </div>
                        </div>
                      </th>

                      <!-- Design Factor Header Section 2-->
                      <th v-if="indexDf >= 4" class="width-250px align-middle">
                        <!-- Design Factor Header-->
                        <div class="d-flex flex-wrap">
                          <div class="width-250px text-break text-wrap text-center">
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
                  <th class="width-150px  align-middle border-0">
                    <div class="d-flex flex-wrap">
                      <div class="width-150px text-break text-wrap text-center">
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
                  <th class="width-150px align-middle  border-0">
                    <div class="d-flex flex-wrap">
                      <div class="width-150px text-break text-wrap text-center">
                        Reason
                      </div>
                    </div>
                  </th>
                </tr>

                <!-- Weight -->
                <tr>
                  <th class="width-250px">Weight</th>
                  <template v-if="Array.isArray(report.data?.weight) && report.data?.weight.length">
                    <template v-for="(weight, indexWeight) in report.data?.weight" :key="`${indexWeight}-${weight?.id}`">
                      <th v-if="indexWeight <= 3" class="text-center">
                        <div>
                          <BaseInput :id="`weight-${indexWeight}`" type="number" placeholder="Masukkan Weight"
                            v-model="report.data.weight[indexWeight].weight" />
                        </div>

                      </th>
                      <th v-else-if="indexWeight === 4" class="bg-primary border-0 text-white width-250px" />
                      <th v-if="indexWeight >= 4" class="text-center">
                        <div>
                          <BaseInput :id="`weight-${indexWeight}`" placeholder="Masukkan Weight"
                            v-model="report.data.weight[indexWeight].weight" />
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
                        <td v-else-if="indexAssessmentHasil === 4"
                          class="bg-primary text-white border-0 width-250px text-center">
                          {{ hasil?.assesmentcanvas?.step2_init_value }}
                        </td>

                        <!-- Domain Step 2 -->
                        <td v-if="indexAssessmentHasil >= 4">
                          {{ assessmentHasil?.relative_importance }}
                        </td>
                      </template>
                    </template>
                    <td class="bg-light-dark text-white border-0 width-250px text-center">
                      {{ hasil?.assesmentcanvas?.step3_init_value }}
                    </td>
                    <td>
                      <BaseInput :id="`adjustment-${indexHasil}`" type="number" v-model="hasil.assesmentcanvas.adjustment"
                        placeholder="Masukkan Nilai Adjustment (Jika Perlu)" />
                    </td>
                    <td>
                      <BaseInput :id="`reason-adjustment-${indexHasil}`" v-model="hasil.assesmentcanvas.reason"
                        placeholder="Masukkan Alasan (Jika Ada)" />
                    </td>
                    <td class="text-center bg-light-primary text-primary">
                      {{ concludedScope({
                        refinedScope: hasil?.assesmentcanvas?.step3_init_value, adjustment:
                          hasil.assesmentcanvas.adjustment
                      }) }}
                    </td>
                    <td class="text-center bg-light-primary text-primary">
                      {{ hasil?.assesmentcanvas?.suggest_capability_level }}
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>