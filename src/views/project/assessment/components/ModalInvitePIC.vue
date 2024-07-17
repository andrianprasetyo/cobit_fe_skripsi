<script setup>
import { reactive, computed } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'

import { useRoute } from 'vue-router'
import { useVuelidate } from "@vuelidate/core";
import { helpers, required, email } from "@vuelidate/validators";
import { useToast } from '@/stores/toast'
import { useLoading } from 'vue-loading-overlay'
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'

import AssessmentServices from '@/services/lib/assessment'

const assessment = useAssessmentStore()
const toast = useToast()
const route = useRoute()
const loading = useLoading()

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'refresh'])

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const formState = reactive({
  loadingSubmit: false,
  users: [],
})

const assessmentId = computed(() => route.params?.id)

const rules = computed(() => {
  return {
    users: {
      required: helpers.withMessage('Silahkan alamat email yang ingin diundang', required)
    },
  }
})

const v$ = useVuelidate(rules, formState, { $autoDirty: false })

/* --------------------------------- METHODS -------------------------------- */
const dropdownEmailShouldOpen = (VueSelect) => {
  if (VueSelect.search.length && email.$validator(VueSelect.search)) {
    return VueSelect.open;
  } else {
    return false;
  }
}

const handleResetState = () => {
  formState.users = [];
  v$.value.$reset()
}

const handleClose = () => {
  handleResetState();
  emits('close', true)
}

const handleRefresh = () => {
  emits('refresh')
}

const handleSubmit = async () => {
  const result = await v$.value.$validate()

  if (result) {
    const loader = loading.show()

    try {
      formState.loadingSubmit = true

      let users = [];

      if (Array.isArray(formState.users) && formState.users.length) {
        formState.users.map(user => users.push({
          email: user
        }))
      }

      let payload = {
        assesment_id: assessment?.detail?.id || assessmentId.value,
        organisasi_id: assessment?.detail?.organisasi_id,
        users: users
      }

      const response = await AssessmentServices.invitePic(payload)

      if (response) {
        loader.hide()
        formState.loadingSubmit = false
        toast.success({
          title: 'Tambah PIC',
          text: 'Berhasil Menambahkan Data PIC'
        })
        handleRefresh()
        handleClose()
      }
    } catch (error) {
      loader.hide()
      formState.loadingSubmit = false
      toast.error({ error })
    }
  }
}
</script>

<template>
  <BaseModal id="add_new_pic" :order="7" :open="props.isShow" :showBtnCloseFooter="false" classNameModal="modal-lg"
    @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Tambah PIC
      </h4>
    </template>

    <template #body>
      <div class="mb-3">
        <label class="form-label" for="email_pic">Email PIC</label>

        <v-select id="email_pic" label="value" v-model="v$.users.$model"
          placeholder="Masukkan email pic yang ingin diundang" :taggable="true" :multiple="true" :no-drop="true"
          :dropdown-should-open="dropdownEmailShouldOpen" :disabled="formState.loadingSubmit" :select-on-key-codes="[]"
          :class="{ 'invalid-v-select': !!v$.users.$errors?.length }">
          <template v-slot:option="option">
            Undang alamat email <strong>{{ option?.value }}</strong>
          </template>
        </v-select>

        <ErrorMessage :errors="v$.users.$errors" />
      </div>
    </template>

    <template #footer>
      <BaseButton @click="handleSubmit" title="Simpan" :disabled="formState.loadingSubmit"
        :is-loading="formState.loadingSubmit" :access="['project-add', 'project-edit']">
        <template #icon-left>
          <TablerIcon icon="DeviceFloppyIcon" />
        </template>
      </BaseButton>
    </template>
  </BaseModal>
</template>