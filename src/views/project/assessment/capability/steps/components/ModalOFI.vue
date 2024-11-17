<script setup>
import { reactive, computed, watch } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import CKEditor from '@/components/CKEditor/CKEditor.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import NoOptions from '@/components/EmptyPlaceholder/NoOptions.vue'

/*
import BaseSelect from '@/components/Select/BaseSelect.vue'
*/

import { useAlert } from '@/stores/alert'
import { useVuelidate } from "@vuelidate/core";
import { helpers, requiredIf } from "@vuelidate/validators";
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'refresh'])

const assessmentStore = useAssessmentStore()
const alert = useAlert()

/* ---------------------------------- STATE & COMPUTED --------------------------------- */
const formState = reactive({
  ofi: [],
  listTarget: {
    loading: false,
    data: [],
  }
})

const rules = computed(() => {
  return {
    ofi: {
      $each: helpers.forEach({
        capability_target_id: {
          // required: helpers.withMessage('Silahkan pilih Target', requiredIf(false)),
          required: helpers.withMessage('Silahkan pilih Target', requiredIf(props.isShow)),
        },
        ofi: {
          required: helpers.withMessage('Silahkan isi Opportunity for Improvement', requiredIf(props.isShow)),
        }
      }),
    }
  }
})

const v$ = useVuelidate(rules, formState, { $rewardEarly: true })

/* --------------------------------- METHODS -------------------------------- */
const handleTambahOFI = () => {
  formState.ofi.push({
    ofi: "",
    capability_target_id: '',
    domain_id: assessmentStore.capability.selectedGamo?.id
  })

  const idsToFilter = formState.ofi.map(item => item.capability_target_id);

  const filteredTarget = assessmentStore.capability.listTarget.filter(target => !idsToFilter.includes(target?.id))

  formState.listTarget.data.push({
    loading: false,
    data: filteredTarget || []
  })
}

const handleClose = () => {
  emits('close', true)
  formState.ofi = []
  formState.listTarget.data = []
}

const filterOFI = (index) => {
  const filtered = formState.ofi.filter((_, itemIndex) => itemIndex !== index)

  const filteredListTarget = formState.listTarget.data.filter((_, itemIndex) => itemIndex !== index)

  formState.ofi = filtered
  formState.listTarget.data = filteredListTarget
}

const handleHapusOFI = ({ title, index }) => {
  alert.info({
    title: `Apakah Anda Yakin untuk Menghapus Opportunity for Improvement ${title}`
  }).then(async (result) => {
    if (result.isConfirmed) {
      filterOFI(index)
    }
  })
}

const setValueToForm = () => {
  if (Array.isArray(assessmentStore.capability.selectedSubGamo?.capabilityass?.ofi) && assessmentStore.capability.selectedSubGamo?.capabilityass?.ofi.length) {
    const list = []
    assessmentStore.capability.selectedSubGamo?.capabilityass?.ofi.map((item, index) => {

      list.push({
        // capability_target_id: item?.capability_target_id || '',
        capability_target_id: '',
        ofi: item.ofi,
        domain_id: assessmentStore.capability.selectedGamo?.id
      })

      if (index != 0) {
        const filteredTarget = assessmentStore.capability.listTarget.filter(target => target?.id != item?.capability_target_id)
        formState.listTarget.data.push({
          loading: false,
          data: filteredTarget || []
        })
      } else {
        formState.listTarget.data.push({
          loading: false,
          data: assessmentStore.capability.listTarget || []
        })
      }
    })

    formState.ofi = list
  }
}

const handleSubmit = async () => {
  const result = await v$.value.$validate()
  if (result) {
    const payload = {
      ...assessmentStore.capability.selectedSubGamo,
      capabilityass: {
        ...assessmentStore.capability.selectedSubGamo.capabilityass,
        ofi: formState.ofi,
        isEdited: true,
      },

    }
    assessmentStore.saveCapabilityPenilaianSubGamo(payload)
    handleClose()
  }
}

watch(() => [props.isShow], () => {
  if (props.isShow) {
    setValueToForm()
  } else {
    formState.ofi = [];
    formState.listTarget.data = [];
  }
}, { deep: true })

</script>

<template>
  <BaseModal id="ofi_input" :order="5" :open="props.isShow" :showBtnCloseFooter="false" classNameModal="modal-lg"
    @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Opportunity for Improvement
      </h4>
    </template>

    <template #body>
      <div class="mb-4 rounded border p-4">
        <h6 class="text-center">
          Management Practice Code
        </h6>
        <h4 class="fw-bolder text-center">
          {{ assessmentStore.capability?.selectedSubGamo?.subkode }}
        </h4>
        <hr />
        <p class="mb-1 fs-2">Activities</p>
        <div style="font-weight: bold !important;" v-html="assessmentStore.capability.selectedSubGamo?.translate" />
        <p class="mb-1 fs-2">Translate</p>
        <div style="font-weight: bold !important; font-style: italic !important;"
          v-html="assessmentStore.capability.selectedSubGamo?.kegiatan" />
        <p class="mb-1 fs-2">Kebutuhan Dokumen</p>
        <div style="font-weight: bold !important; font-style: italic !important;"
          v-html="assessmentStore.capability.selectedSubGamo?.guidelines || '-'" />
      </div>

      <template v-if="formState.ofi.length">
        <template v-for="(ofi, index) in formState.ofi" :key="`ofi-form-${index}`">
          <hr v-if="index > 0" />

          <div class="mb-9 d-flex flex-column flex-md-row justify-content-md-between align-items-md-center my-4">
            <h5 class="fw-semibold">Opportunity for Improvement {{ index + 1 }}</h5>

            <div>
              <BaseButton @click="handleHapusOFI({ title: index + 1, index: index })" class="btn btn-outline-danger"
                title="Hapus Opportunity for Improvement" :access="['project-add', 'project-edit']">
                <template #icon-left>
                  <TablerIcon icon="TrashIcon" />
                </template>
              </BaseButton>
            </div>
          </div>

          <!-- <div class="mb-3">  
            <BaseSelect :id="`list-target-ofi-${index}`" v-model="ofi.capability_target_id" label="Target"
              default-option="Pilih Target" :options="formState.listTarget.data[index].data" options-label="nama"
              options-value="id"
              :is-invalid="!!v$.ofi.$each?.$response?.$errors[index]?.capability_target_id?.length" />

            <ErrorMessage
              v-if="Array.isArray(v$.ofi.$each?.$response?.$errors) && v$.ofi.$each?.$response?.$errors.length"
              :errors="v$.ofi.$each?.$response?.$errors[index]?.capability_target_id" />
          </div> -->

          <div class="mb-3">
            <label class="form-label" :for="`ofi-input-${index}`">Opportunity for Improvement</label>

            <CKEditor :id="`ofi-input-${index}`" placeholder="Masukkan Opportunity for Improvement" v-model="ofi.ofi"
              :isInvalid="!!v$.ofi.$each?.$response?.$errors[index]?.ofi?.length" />

            <ErrorMessage
              v-if="Array.isArray(v$.ofi.$each?.$response?.$errors) && v$.ofi.$each?.$response?.$errors.length"
              :errors="v$.ofi.$each?.$response?.$errors[index]?.ofi" />
          </div>
        </template>
      </template>

      <template v-else>
        <NoOptions title="Belum Ada Opportunity for Improvement" />
      </template>


      <div v-if="formState.ofi.length < assessmentStore.capability.listTarget?.length"
        class="mt-5 d-flex justify-content-center align-items-center">
        <BaseButton @click="handleTambahOFI" title="Tambah Opportunity for Improvement"
          :access="['project-add', 'project-edit']">
          <template #icon-left>
            <TablerIcon icon="PlusIcon" />
          </template>
        </BaseButton>
      </div>
    </template>

    <template #footer>
      <BaseButton @click="handleSubmit" title="Simpan Sebagai Draft Opportunity for Improvement"
        :access="['project-add', 'project-edit']">
        <template #icon-left>
          <TablerIcon icon="CheckboxIcon" />
        </template>
      </BaseButton>
    </template>
  </BaseModal>
</template>