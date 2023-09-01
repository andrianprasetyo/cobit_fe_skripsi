<script setup>

import BaseInput from '@/components/Input/BaseInput.vue'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const assessment = useAssessmentStore()

</script>

<template>
  <div>
    <h5 class="card-title fw-semibold">Step 3 : Refine the scope of the Governance System</h5>

    <div class="table-responsive rounded-2 mb-4 mt-4">
      <div class="mh-100vh">
        <table class="table border text-nowrap mb-0 align-middle">
          <thead class="position-sticky top-0 bg-white" style="z-index: 5 !important;">
            <tr>
              <th class="width-200px align-middle">Design Factor</th>
              <template
                v-if="Array.isArray(assessment.reportCanvasSummary?.df) && assessment.reportCanvasSummary?.df.length">
                <template v-for="(df, indexDf) in assessment.reportCanvasSummary?.df" :key="`${indexDf}-${df?.id}`">
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

                <th class="bg-primary text-white border-0 width-250px align-middle">
                  <div class="d-flex flex-wrap">
                    <div class="width-225px text-break text-wrap text-center">
                      Refined Scope: Governance/Management Objectives Score
                    </div>
                  </div>
                </th>
              </template>
            </tr>

            <!-- Weight -->
            <tr>
              <th>
                <div class="width-250px d-flex align-items-center mb-2">
                  Weight
                </div>
              </th>
              <template
                v-if="Array.isArray(assessment.reportCanvasSummary?.df) && assessment.reportCanvasSummary?.df.length">
                <template v-for="(weightDf, indexWeight) in assessment.reportCanvasSummary.df"
                  :key="`${indexWeight}-${weightDf?.id}`">
                  <th v-if="indexWeight >= 4" class="text-center">
                    <div>
                      <BaseInput :id="`weight-${indexWeight}`" class="text-center form-control" type="number"
                        placeholder="Masukkan Weight"
                        v-model="assessment.reportCanvasSummary.df[indexWeight].assesmentweight.weight" />
                    </div>
                  </th>
                </template>
                <th class="bg-primary text-white border-0 width-250px" />
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
                  <!-- Domain Section 3 -->
                  <template v-for="(assessmentHasil, indexAssessmentHasil) in hasil?.assesmenthasil"
                    :key="`assessmentHasil-${indexAssessmentHasil}`">
                    <td v-if="indexAssessmentHasil >= 4" class="text-center">
                      {{ assessmentHasil?.relative_importance }}
                    </td>
                  </template>
                  <td class="bg-light fw-bold border-0 width-250px text-center">
                    <span :class="[hasil?.assesmentcanvas?.step3_init_value < 0 ? 'text-danger' : 'text-primary']">
                      {{ hasil?.assesmentcanvas?.step3_init_value }}
                    </span>
                  </td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>