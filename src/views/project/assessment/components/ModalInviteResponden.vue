<script setup>
import { reactive, computed } from 'vue'
/*
import BaseInput from '@/components/Input/BaseInput.vue'
*/
import BaseButton from '@/components/Button/BaseButton.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import BaseSelect from '@/components/Select/BaseSelect.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue'
import FilePond from '@/components/FilePond/FilePond.vue'

import { useVuelidate } from "@vuelidate/core";
import { helpers, required, requiredIf, email } from "@vuelidate/validators";
import { useAssessmentStore } from '@/views/project/assessment/assessmentStore'
import { useAppConfig } from '@/stores/appConfig'

const assessment = useAssessmentStore()
const appConfig = useAppConfig()

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
  inviteBy: '',
  emails: [],
  file: null,
  filename: '',
  files: [],
  inviteByList: [
    {
      label: 'Kirim Lewat Email',
      value: 'email'
    },
    {
      label: 'Import dari Excel',
      value: 'excel'
    }
  ]
})

const rules = computed(() => {
  return {
    inviteBy: {
      required: helpers.withMessage('Silahkan pilih cara untuk mengundang responden', required),
    },
    emails: {
      requiredIf: helpers.withMessage('Silahkan alamat email yang ingin diundang', requiredIf(formState.inviteBy === 'email')),
    },
    /*
    file: {
      requiredIf: helpers.withMessage('Silahkan upload file excel yang sudah diisi', requiredIf(formState.inviteBy === 'excel')),
      fileExtension: helpers.withMessage('File yang diizinkan hanya .xlsx', value => {
        if (!value) return true; // Allow no file to be selected

        const allowedExtensions = ['xlsx']; // Add your allowed extensions here
        const fileExtension = value.name.split('.').pop().toLowerCase();

        return allowedExtensions.includes(fileExtension);
      })
    }
    */
    files: {
      requiredIf: helpers.withMessage('Silahkan upload file excel yang sudah diisi', requiredIf(formState.inviteBy === 'email')),
    }
  }
})

const isInviteByEmail = computed(() => {
  return formState.inviteBy === 'email'
})

const isInviteByExcel = computed(() => {
  return formState.inviteBy === 'excel'
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

/*
const handleChangeFile = (event) => {
  const files = event?.target?.files

  if (files && files?.length) {
    const file = files[0]
    formState.file = file
    formState.filename = file.name

    v$.value.file.$touch()
  }
}
*/

const onUpdateFiles = (files) => {
  if (files && files?.length) {
    const listFile = []
    files.map((item) => listFile.push(item.file))
    formState.files = listFile
  } else {
    formState.files = []
  }
}

const handleClose = () => {
  emits('close', true)
}

const handleRefreshList = () => {
  emits('refresh')
}

const inviteRespondenByEmail = async () => {
  try {
    formState.loadingSubmit = true
    const response = await assessment.inviteResponden({ id: assessment.selectedAssessment?.id, email: formState.emails })

    if (response) {
      formState.loadingSubmit = false
      v$.value.$reset()
      handleClose()
      handleRefreshList()
    }
  } catch (error) {
    formState.loadingSubmit = false
  }
}

const inviteRespondenByExcel = async () => {
  try {
    formState.loadingSubmit = true

    let payload = {
      id: assessment?.selectedAssessment?.id,
      file: formState?.files.length ? formState.files[0] : null
    }

    const response = await assessment.inviteRespondenByExcel(payload)

    if (response) {
      formState.loadingSubmit = false
      v$.value.$reset()
      handleClose()
      handleRefreshList()
    }
  } catch (error) {
    formState.loadingSubmit = false
  }
}

const handleSubmit = () => {
  if (formState.inviteBy === 'email') {
    inviteRespondenByEmail()
  } else if (formState.inviteBy === 'excel') {
    inviteRespondenByExcel()
  }
}


</script>

<template>
  <BaseModal id="invite_responden" :order="1" :open="props.isShow" :showBtnCloseFooter="false" classNameModal="modal-lg"
    @close="handleClose">
    <template #header>
      <h4 class="modal-title">
        Undang Responden
      </h4>
    </template>

    <template #body>
      <div class="mb-3">
        <BaseSelect id="invite_by" v-model="v$.inviteBy.$model" label="Undang Melalui" tabindex="1"
          default-option="Pilih Cara Undang" :options="formState.inviteByList" options-label="label" options-value="value"
          :disabled="formState.loadingSubmit" :isInvalid="!!v$.inviteBy.$errors?.length" />

        <ErrorMessage :errors="v$.inviteBy.$errors" />
      </div>


      <template v-if="formState.inviteBy === 'email'">
        <hr />

        <div class="mb-3">
          <label class="form-label" for="email_responden">Email Responden</label>

          <v-select id="email_responden" label="value" v-model="v$.emails.$model"
            placeholder="Masukkan email yang ingin diundang" :taggable="true" :multiple="true" :no-drop="true"
            :tabindex="2" :dropdown-should-open="dropdownEmailShouldOpen" :disabled="formState.loadingSubmit"
            :select-on-key-codes="[]" :class="{ 'invalid-v-select': !!v$.emails.$errors?.length }">
            <template v-slot:option="option">
              Undang alamat email <strong>{{ option?.value }}</strong>
            </template>
          </v-select>

          <ErrorMessage :errors="v$.emails.$errors" />
        </div>
      </template>

      <template v-if="formState.inviteBy === 'excel'">
        <hr />

        <div class="mb-3">
          <FilePond id="input-file-excel" label="File" name="file-excel"
            accepted=".xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            :files="formState.files" v-on:updatefiles="onUpdateFiles">
            <template #extra-label>
              <div class="d-flex align-items-center mb-1 badge font-medium bg-light-primary text-primary">
                <TablerIcon icon="DownloadIcon" class="me-1 text-primary" size="14" />

                <a class="link-primary fw-bold"
                  :href="`${appConfig.app.appHostDownload}sample/template-invite-respondent`">
                  Download Template
                </a>
              </div>

            </template>
          </FilePond>

          <!-- <BaseInput id="input-file-excel" type="file" label="File" accept=".xlsx" :isInvalid="!!v$.file.$errors?.length"
            :disabled="formState.loadingSubmit" @change="handleChangeFile">

            <template #extra-label>
              <div class="d-flex align-items-center mb-1 badge font-medium bg-light-primary text-primary">
                <TablerIcon icon="DownloadIcon" class="me-1 text-primary" size="14" />

                <a class="link-primary fw-bold"
                  :href="`${appConfig.app.appHostDownload}sample/template-invite-respondent`">
                  Download Template
                </a>
              </div>

            </template>

          </BaseInput> -->

          <div class="mt-1">
            <small>
              <span class="text-danger fw-bold">Perhatian!</span> Mohon <span class="fw-bold">Pastikan
                File</span> Yang Diupload sudah menggunakan template yang disediakan.
            </small>
          </div>


          <ErrorMessage :errors="v$.files.$errors" />
        </div>
      </template>

    </template>

    <template #footer>
      <BaseButton @click="handleSubmit" title="Simpan"
        :disabled="formState.loadingSubmit || (isInviteByEmail && !formState.emails.length) || (isInviteByExcel && !formState.files.length)"
        :is-loading="formState.loadingSubmit">
        <template #icon-left>
          <TablerIcon icon="DeviceFloppyIcon" />
        </template>
      </BaseButton>
    </template>
  </BaseModal>
</template>