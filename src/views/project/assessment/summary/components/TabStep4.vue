<script setup>
import { computed } from 'vue'

import BaseInput from '@/components/Input/BaseInput.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const assessment = useAssessmentStore()

/* -------------------------------- COMPUTED -------------------------------- */
const concludedScope = computed(() => {
  return ({ refinedScope, adjustment }) => {
    return refinedScope + adjustment
  }
})


const agreedCapabilityLevel = computed(() => {
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

</script>

<template>
  <div>
    <h5 class="card-title fw-semibold">Step 4: Conclude the Scope of the Governance System</h5>

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
              <th class="bg-primary text-white border-0 width-250px align-middle" rowspan="2">
                <div class="d-flex flex-wrap justify-content-center align-items-center">
                  <div class="width-225px text-break text-wrap text-center">
                    <h6 class="fs-3 fw-semibold mb-0 text-white">
                      Refined Scope: Governance/Management Objectives Score
                    </h6>
                  </div>
                </div>
              </th>
              <th class="width-150px align-middle border-0" rowspan="2">
                <div class="d-flex flex-wrap justify-content-center align-items-center">
                  <div class="width-125px text-break text-wrap text-center">
                    <h6 class="fs-3 fw-semibold mb-0">
                      Adjustment (between -100 and +100)
                    </h6>
                  </div>
                </div>
              </th>
              <th class="width-250px align-middle border-0" rowspan="2">
                <div class="d-flex flex-wrap justify-content-center align-items-center">
                  <div class="width-225px text-break text-wrap text-center">
                    <h6 class="fs-3 fw-semibold mb-0">
                      Reason
                    </h6>
                  </div>
                </div>
              </th>
              <th class="bg-primary text-white border-0 align-middle" rowspan="2">
                <div class="d-flex flex-wrap justify-content-center align-items-center">
                  <div class="width-200px text-break text-wrap text-center">
                    <h6 class="fs-3 fw-semibold mb-0 text-white">
                      Concluded Scope: Governance/Management Objectives Priority
                    </h6>
                  </div>
                </div>
              </th>
              <th class="bg-primary text-white border-0 align-middle" rowspan="2">
                <div class="d-flex flex-wrap justify-content-center align-items-center">
                  <div class="width-150px text-break text-wrap text-center">
                    <h6 class="fs-3 fw-semibold mb-0 text-white">
                      Suggested Target Capability Level
                    </h6>
                  </div>
                </div>
              </th>
              <th class="align-middle border-0" rowspan="2">
                <div class="d-flex flex-wrap justify-content-center align-items-center">
                  <div class="width-150px text-break text-wrap text-center">
                    <h6 class="fs-3 fw-semibold mb-0">
                      Agreed Target Capability Level
                    </h6>
                  </div>
                </div>
              </th>
              <th class="width-250px align-middle border-0" rowspan="2">
                <div class="d-flex flex-wrap justify-content-center align-items-center">
                  <div class="width-225px text-break text-wrap text-center">
                    <h6 class="fs-3 fw-semibold mb-0">
                      Reason
                    </h6>
                  </div>
                </div>
              </th>
            </tr>

            <!-- Weight -->
            <tr>
              <th>
                <div class="width-250px d-flex align-items-center mb-2">Weight</div>
              </th>
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
                 <!-- Domain Section 3 -->
                  <td class="bg-light fw-bold border-0 width-250px text-center">
                    <span :class="[hasil?.assesmentcanvas?.step3_value < 0 ? 'text-danger' : 'text-primary']">
                      {{ hasil?.assesmentcanvas?.step3_value }}
                    </span>
                  </td>
                  <td>
                    <BaseInput :id="`adjustment-${indexHasil}`" class="text-center form-control" type="number"
                      v-model="assessment.reportCanvasSummary.hasil[indexHasil].assesmentcanvas.adjustment"
                      placeholder="Masukkan Nilai Adjustment (Jika Perlu)" />
                  </td>
                  <td>
                    <BaseInput type="text-area" :id="`reason-adjustment-${indexHasil}`"
                      v-model="hasil.assesmentcanvas.reason_adjustment" placeholder="Masukkan Alasan (Jika Ada)" />
                  </td>
                  <td class="text-center bg-light fw-bold">
                    {{ concludedScope({
                refinedScope: hasil?.assesmentcanvas?.step3_value, adjustment:
                  hasil.assesmentcanvas.adjustment
              }) }}
                  </td>
                  <td class="text-center bg-light fw-bold">
                    {{ hasil?.assesmentcanvas?.suggest_capability_level }}
                  </td>
                  <td class="text-center">
                    <span>
                      {{ hasil?.assesmentcanvas?.suggest_capability_level }}
                    </span>
                    <template v-if="assessment.reportCanvasSummary.hasil[indexHasil].assesmentcanvas.adjustment">
                      <TablerIcon icon="ArrowRightIcon" size="14" class="mx-1 mb-2" />
                      <span class="text-primary fw-bold">
                        {{ agreedCapabilityLevel(concludedScope({
                refinedScope: hasil?.assesmentcanvas?.step3_value, adjustment:
                  hasil.assesmentcanvas.adjustment
              })) }}
                      </span>
                    </template>
                  </td>
                  <td class="text-center">
                    <BaseInput type="text-area" :id="`reason-${indexHasil}`" v-model="hasil.assesmentcanvas.reason"
                      placeholder="Masukkan Alasan (Jika Ada)" />
                  </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>