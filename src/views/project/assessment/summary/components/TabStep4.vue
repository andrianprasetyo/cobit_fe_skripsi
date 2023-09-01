<script setup>
import { computed } from 'vue'

import BaseInput from '@/components/Input/BaseInput.vue'

import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const assessment = useAssessmentStore()

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

</script>

<template>
  <div>
    <h5 class="card-title fw-semibold">Step 4: Conclude the Scope of the Governance System</h5>

    <div class="table-responsive rounded-2 mb-4 mt-4">
      <div class="mh-100vh">
        <table class="table border text-nowrap mb-0 align-middle">
          <thead class="position-sticky top-0 bg-white" style="z-index: 5 !important;">
            <tr>
              <th class="width-200px align-middle">Design Factor</th>
              <th class="bg-primary text-white border-0 width-250px align-middle">
                <div class="d-flex flex-wrap">
                  <div class="width-225px text-break text-wrap text-center">
                    Refined Scope: Governance/Management Objectives Score
                  </div>
                </div>
              </th>
              <th class="width-150px align-middle border-0">
                <div class="d-flex flex-wrap">
                  <div class="width-125px text-break text-wrap text-center">
                    Adjustment (between -100 and +100)
                  </div>
                </div>
              </th>
              <th class="width-250px align-middle border-0">
                <div class="d-flex flex-wrap">
                  <div class="width-225px text-break text-wrap text-center">
                    Reason
                  </div>
                </div>
              </th>
              <th class="bg-primary text-white border-0 align-middle">
                <div class="d-flex flex-wrap">
                  <div class="width-200px text-break text-wrap text-center">
                    Concluded Scope: Governance/Management Objectives Priority
                  </div>
                </div>
              </th>
              <th class="bg-primary text-white border-0 align-middle">
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
              <th class="width-250px align-middle  border-0">
                <div class="d-flex flex-wrap">
                  <div class="width-225px text-break text-wrap text-center">
                    Reason
                  </div>
                </div>
              </th>
            </tr>

            <!-- Weight -->
            <tr>
              <th>
                <div class="width-250px d-flex align-items-center mb-2">Weight</div>
              </th>
              <th colspan="1" class="bg-primary border-0 width-250px" />
              <th colspan="2" class="border-0 width-250px" />
              <th colspan="2" class="bg-primary" />
              <th colspan="2" class="border-0 width-250px" />
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
                  <td class="bg-light fw-bold border-0 width-250px text-center">
                    <span :class="[hasil?.assesmentcanvas?.step3_init_value < 0 ? 'text-danger' : 'text-primary']">
                      {{ hasil?.assesmentcanvas?.step3_init_value }}
                    </span>
                  </td>
                  <td>
                    <BaseInput :id="`adjustment-${indexHasil}`" class="text-center form-control" type="number"
                      v-model="assessment.reportCanvasSummary.hasil[indexHasil].assesmentcanvas.adjustment"
                      placeholder="Masukkan Nilai Adjustment (Jika Perlu)" />
                  </td>
                  <td>
                    <BaseInput :id="`reason-adjustment-${indexHasil}`" v-model="hasil.assesmentcanvas.reason_adjustment"
                      placeholder="Masukkan Alasan (Jika Ada)" />
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
                    {{ suggessCapabilityLevel(concludedScope({
                      refinedScope: hasil?.assesmentcanvas?.step3_init_value, adjustment:
                        hasil.assesmentcanvas.adjustment
                    })) }}
                  </td>
                  <td class="text-center">
                    <BaseInput :id="`reason-${indexHasil}`" v-model="hasil.assesmentcanvas.reason"
                      placeholder="Masukkan Alasan (Jika Ada)" />
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