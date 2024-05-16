<script setup>

import BaseInput from '@/components/Input/BaseInput.vue'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const assessment = useAssessmentStore()

</script>

<template>
  <div>
    <h5 class="card-title fw-semibold">Step 2: Determine the initial scope of the Governance System</h5>

    <div class="table-responsive rounded-2 mb-4 mt-4">
      <div class="mh-100vh">
        <table class="table border text-nowrap mb-0 align-middle">
          <thead class="position-sticky top-0 bg-white" style="z-index: 5 !important;">
            <tr>
              <th class="width-200px align-middle">
                <h6 class="fs-3 fw-semibold mb-0">
                  Design Factor
                </h6>
              </th>
              <template
                v-if="Array.isArray(assessment.reportCanvasSummary?.df) && assessment.reportCanvasSummary?.df.length">
                <template v-for="(df, indexDf) in assessment.reportCanvasSummary?.df" :key="`${indexDf}-${df?.id}`">
                  <th v-if="indexDf <= 3" class="width-200px align-middle position-sticky top-0" rowspan="1">
                    <!-- Design Factor Header Section 2-->
                    <div class="d-flex flex-wrap justify-content-center align-items-center">
                      <div class="width-150px d-flex text-break text-wrap text-center">
                        <h6 class="fs-3 fw-semibold mb-0">
                          {{ df?.nama }}
                        </h6>
                      </div>
                    </div>
                  </th>

                  <!-- Step Scope 2 -->
                  <th v-else-if="indexDf === 4" rowspan="2" colspan="1"
                    class="bg-primary text-white width-250px align-middle border-0 position-sticky top-0">
                    <div class="d-flex flex-wrap">
                      <div class="width-225px text-break text-wrap text-center ">
                        <h6 class="fs-3 fw-semibold mb-0 text-white">
                          Initial Scope: Governance/Management Objectives Score
                        </h6>
                      </div>
                    </div>
                  </th>
                </template>
              </template>
            </tr>

            <!-- Weight -->
            <tr>
              <th>
                <div class="width-250px d-flex align-items-center mb-2">
                  <h6 class="fs-3 fw-semibold mb-0">
                    Weight
                  </h6>
                </div>
              </th>
              <template
                v-if="Array.isArray(assessment.reportCanvasSummary?.df) && assessment.reportCanvasSummary?.df.length">
                <template v-for="(weightDf, indexWeight) in assessment.reportCanvasSummary.df"
                  :key="`${indexWeight}-${weightDf?.id}`">
                  <th v-if="indexWeight <= 3" class="text-center">
                    <div>
                      <BaseInput :id="`weight-${indexWeight}`" class="text-center form-control" type="number"
                        placeholder="Masukkan Weight"
                        v-model="assessment.reportCanvasSummary.df[indexWeight].assesmentweight.weight" />
                    </div>
                  </th>
                </template>
              </template>
            </tr>
          </thead>

          <tbody>
            <template
              v-if="Array.isArray(assessment.reportCanvasSummary?.hasil) && assessment.reportCanvasSummary?.hasil?.length">
              <tr v-for="(hasil, indexHasil) in assessment.reportCanvasSummary?.hasil" :key="`hasil-${indexHasil}`">
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
                      <span :class="[hasil?.assesmentcanvas?.step2_init_value < 0 ? 'text-danger' : 'text-primary']">
                        {{ hasil?.assesmentcanvas?.step2_value }}
                      </span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>