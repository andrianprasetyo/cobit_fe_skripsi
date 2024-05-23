<script setup>
import { computed } from 'vue';
import { formatDateMoments } from '@/utils/momentDateFormat';

import BaseLightBadge from '@/components/Badge/BaseLightBadge.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseButton from '@/components/Button/BaseButton.vue';

const emits = defineEmits(['handle-edit', 'handle-delete', 'handle-detail'])

const props = defineProps({
  nama: {
    type: String,
    default: ''
  },
  organisasi: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'primary'
  },
  start_date: {
    type: String,
    default: ''
  },
  end_date: {
    type: String,
    default: ''
  },
  start_date_quisioner: {
    type: String,
    default: ''
  },
  end_date_quisioner: {
    type: String,
    default: ''
  },
  minimum_target: {
    type: [String, Number],
    default: 0
  },
  users_count: {
    type: [String, Number],
    default: 0
  }
})

/* ---------------------------- STATE & COMPUTED ---------------------------- */
const variantStatus = computed(() => {
  return value => {
    if (value === 'ongoing') {
      return 'primary'
    } else if (value === 'completed') {
      return 'success'
    } else if (value === 'unstart') {
      return 'info'
    } else {
      return 'dark'
    }
  }
})

const titleStatus = computed(() => {
  return value => {
    if (value === 'ongoing') {
      return 'Ongoing'
    } else if (value === 'completed') {
      return 'Selesai'
    } else if (value === 'unstart') {
      return 'Belum Dimulai'
    } else {
      return 'Tidak Diketahui'
    }
  }
})

const formatDate = computed(() => {
  return value => {
    return formatDateMoments({ value: value?.value })
  }
})

</script>

<template>
  <div class="col-12 col-md-4 mb-2 d-flex align-items-stretch">
    <div class="card card-hover cursor-pointer rounded-4 w-100"
      @click.stop="($event) => emits('handle-detail', $event)">
      <div class="position-absolute" style="top: 20px; right: 20px">
        <div class="dropdown dropstart">
          <BaseButton v-tooltip="`Lihat Aksi`" class="btn btn-sm btn-primary" data-bs-toggle="dropdown"
            id="dropdownMenuButton" aria-expanded="false" @click.stop="">
            <template #icon-left>
              <TablerIcon icon="DotsIcon" />
            </template>
          </BaseButton>

          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <BaseButton :access="['project-edit']" @click.stop="($event) => emits('handle-edit', $event)"
              class="dropdown-item d-flex align-items-center gap-3 cursor-pointer">
              <template #icon-left>
                <TablerIcon icon="EditIcon" />
                <span class="ms-2"> Edit Project </span>
              </template>
            </BaseButton>

            <BaseButton :access="['project-edit']" @click.stop="($event) => emits('handle-delete', $event)"
              class="dropdown-item d-flex align-items-center gap-3 cursor-pointer text-danger">
              <template #icon-left>
                <TablerIcon icon="TrashIcon" />
                <span class="ms-2"> Hapus Project </span>
              </template>
            </BaseButton>
          </ul>
        </div>
      </div>

      <div class="card-body">
        <BaseLightBadge :title="titleStatus(props.status)" :variant="variantStatus(props.status)" />

        <div class="mt-2">
          <h6 class="mb-0 fs-5 fw-semibold">
            <span class="me-2 text-primary">
              {{ props.nama }}
            </span>
          </h6>
          <span>{{ props.organisasi }}</span>
        </div>
        <hr />
        <div>
          <div class="d-flex align-items-center mt-3">
            <div class="bg-primary-subtle rounded me-8 p-8 d-flex align-items-center justify-content-center">
              <TablerIcon icon="HourglassHighIcon" class="text-primary" />
            </div>
            <div class="text-truncate">
              <p class="fs-3 mb-0 fw-normal">Periode Asesmen</p>
              <h6 v-tooltip="`${formatDate({ value: props.start_date })} s/d ${formatDate({ value: props.end_date })}`"
                class="fw-semibold text-dark mb-0 text-truncate">
                {{ formatDate({ value: props.start_date }) }}
                s/d
                {{ formatDate({ value: props.end_date }) }}
              </h6>
            </div>
          </div>

          <div class="d-flex align-items-center mt-3">
            <div class="bg-secondary-subtle rounded me-8 p-8 d-flex align-items-center justify-content-center">
              <TablerIcon icon="ClockRecordIcon" class="text-primary" />
            </div>
            <div class="text-truncate">
              <p class="fs-3 mb-0 fw-normal">Periode Kuesioner</p>
              <h6 class="fw-semibold text-dark mb-0 text-truncate">
                {{ formatDate({ value: props.start_date_quisioner }) }}
                s/d
                {{ formatDate({ value: props.end_date_quisioner }) }}
              </h6>
            </div>
          </div>

          <div class="d-flex align-items-center mt-3">
            <div class="bg-warning-subtle rounded me-8 p-8 d-flex align-items-center justify-content-center">
              <TablerIcon icon="UsersIcon" class="text-primary" />
            </div>
            <div>
              <p class="fs-3 mb-0 fw-normal">Total Responden</p>
              <h6 class="fw-semibold text-dark mb-0">
                {{ props.users_count }} Responden
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.oneline-text {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>