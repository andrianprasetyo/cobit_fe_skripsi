<script setup>
import { reactive, onMounted } from 'vue'

import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import DesignFactorHeader from '@/views/master/design-factor/components/DesignFactorHeader.vue'

import DesignFactorServices from '@/services/lib/design-factor'

import { useToast } from '@/stores/toast'
import { useRouter, useRoute } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const loading = useLoading()

const designFactor = reactive({
  loadingSubmit: false,
  detail: {}
})

/* --------------------------------- METHODS -------------------------------- */
const getQuestionAndComponentDesignFactor = async () => {
  const loader = loading.show()

  try {
    designFactor.loading = true
    const response = await DesignFactorServices.getQuestionAndComponentDesignFactor({ id: route.params?.id })

    if (response) {
      const data = response?.data;

      designFactor.detail = data

      designFactor.loading = false
      loader.hide()
    }

  } catch (error) {
    designFactor.loading = false
    loader.hide()
    toast.error({ error })
  }
}

const handleBack = () => {
  router.back()
}

/* ---------------------------------- HOOKS --------------------------------- */
onMounted(() => {
  getQuestionAndComponentDesignFactor()
})

</script>

<template>
  <div>
    <BreadCrumb />

    <section>
      <DesignFactorHeader :nama="designFactor.detail?.nama" :deskripsi="designFactor.detail?.deskripsi" />

      <template v-if="Array.isArray(designFactor.detail?.quisioner) && designFactor.detail?.quisioner.length">
        <div v-for="(quisioner, index) in designFactor.detail?.quisioner" :key="`card-${index}`" class="card">
          <div class="card-body">
            <h5 class="card-title mb-9 fw-semibold d-flex flex-row" v-html="`${index + 1}. ${quisioner?.pertanyaan}`" />

            <div class="table-responsive rounded-2 mb-4">
              <table class="table border text-nowrap mb-0 align-middle">
                <thead class="text-primary">
                  <tr>
                    <th>Komponen</th>
                    <template v-if="Array.isArray(quisioner.grup.jawabans) && quisioner.grup.jawabans.length">
                      <th v-for="(jawaban, index) in quisioner.grup.jawabans" :key="`jawaban-${index}`">
                        <div class="text-center">
                          {{ jawaban?.jawaban }}
                        </div>
                      </th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <!-- Question Array -->
                  <!-- <template v-if="Array.isArray(quisioner?.quisioner) && quisioner?.quisioner.length">
                  <tr v-for="(item, index) in quisioner?.quisioner" :key="`komponen-${index}`">
                    {{ item?.title }}
                  </tr>
                </template>
                 -->

                  <tr>
                    <td>
                      <div class="d-flex align-items-center">
                        {{ quisioner?.quisioner?.title }}
                      </div>
                    </td>
                    <template v-if="Array.isArray(quisioner.grup.jawabans) && quisioner.grup.jawabans.length">
                      <td v-for="(_, index) in quisioner.grup.jawabans" :key="`answer-${index}`">
                        <div class="form-check form-check-inline d-flex justify-content-center align-items-center">
                          <input class="form-check-input primary check-outline outline-primary" type="radio"
                            :id="`radio-${index}`" :name="`radio-${quisioner?.quisioner?.title}`" :checked="false">
                        </div>
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </template>


      <div class="card mt-4">
        <div class="card-body">
          <div class="d-flex flex-column flex-md-row align-items-center">
            <div>
              <BaseButton @click="handleBack" class="btn btn-outline-primary me-0 me-md-3 mb-2 mb-md-0" title="Kembali">
                <template #icon-left>
                  <TablerIcon icon="ChevronLeftIcon" />
                </template>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>