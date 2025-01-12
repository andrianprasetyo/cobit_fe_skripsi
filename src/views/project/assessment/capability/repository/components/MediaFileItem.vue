<script setup>
import { computed } from 'vue'

import BaseButton from '@/components/Button/BaseButton.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'

import { formatDateMoments } from "@/utils/momentDateFormat";

import formatBytes from "@/utils/formatBytes";

const props = defineProps({
  id: {
    type: String
  },
  name: {
    type: [String, Number]
  },
  classBody: {
    type: [String],
    default: 'col-12 col-lg-3 col-md-4'
  },
  size: {
    type: [String, Number]
  },
  ext: {
    type: String
  },
  lastUpdate: {
    type: [String,]
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  isShowDropdown: {
    type: Boolean,
    default: true
  },
  isShowChecklist: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['delete', 'edit', 'click', 'double-click'])

const formatDate = computed(() => {
  return value => {
    return formatDateMoments({ value: value?.value, format: "LLL" })
  }
})

const isExcel = computed(() => {
  return value => {
    return value === 'xlsx'
  }
})

const isPdf = computed(() => {
  return value => {
    return value === 'pdf'
  }
})

/* --------------------------------- METHODS -------------------------------- */
const handleDelete = () => {
  emits('delete')
  handleToggleDropdown()
}

/*
const handleEdit = () => {
  emits('edit')
  handleToggleDropdown()
}
*/

const handleClick = () => {
  emits('click')
}

const handleDoubleClick = () => {
  emits('double-click')
}

const handleToggleDropdown = () => {
  if (!props.isDisabled) {
    const element = document.querySelector(`#dropdownMenuLink-${props.id}`);
    if (element) {
      element.click()
    }

  }
}

</script>

<template>
  <div :class="props.classBody">
    <div class="card shadow-none border cursor-pointer" @dblclick.stop="handleDoubleClick" @click.stop="handleClick"
      @contextmenu.stop.prevent="handleToggleDropdown" v-bind="$attrs">
      <div class="card-img-top bg-dark bg-opacity-10 py-3">
        <div class="d-flex justify-content-center position-relative">
          <div v-if="props.isShowChecklist">
            <TablerIcon :icon="'CircleCheckIcon'" size="25" class="text-primary position-absolute" style="top: 0; right: 15px;" />
          </div>
          <div class="thumbnail-files d-flex justify-content-center align-items-center">
            <!-- Excel -->
            <template v-if="isExcel(props.ext)">
              <img src="/assets/images/icons/xls.png" alt="file-icon" height="40">
            </template>

            <!-- PDF -->
            <template v-else-if="isPdf(props.ext)">
              <img src="/assets/images/icons/doc.png" alt="file-icon" height="40">
            </template>

            <!-- Other -->
            <TablerIcon v-else :icon="'FileIcon'" size="40" />
          </div>

          <div v-if="!props.isDisabled && props.isShowDropdown" class="dropdown-button-wrapper">
            <BaseButton @click.stop="" class="btn btn-icon p-0" data-bs-toggle="dropdown" aria-expanded="false"
              :id="`dropdownMenuLink-${props.id}`" role="button">
              <TablerIcon icon="DotsVerticalIcon" size="22" />
            </BaseButton>

            <div class="dropdown-menu dropdown-menu-end" :aria-labelledby="`dropdownMenuLink-${props.id}`">
              <li>
                <BaseButton @click.stop="handleDoubleClick" class="dropdown-item w-100" title="Lihat File">
                  <template #icon-left>
                    <TablerIcon icon="EyeIcon" size="16" />
                  </template>
                </BaseButton>
              </li>

              <!-- <li>
                <BaseButton @click.stop="handleEdit" class="dropdown-item w-100" title="Edit File">
                  <template #icon-left>
                    <TablerIcon icon="EditIcon" size="16" />
                  </template>
                </BaseButton>
              </li> -->

              <li>
                <hr class="dropdown-divider">
              </li>

              <li>
                <BaseButton @click.stop="handleDelete" class="dropdown-item w-100 text-danger" title="Hapus File">
                  <template #icon-left>
                    <tabler-icon icon="TrashIcon" size="16" />
                  </template>
                </BaseButton>
              </li>
            </div>
          </div>
        </div>
      </div>

      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-50">
          <h6 v-tooltip="`${props.name}`" class="mb-25 fw-bolder text-truncate">{{ props.name }}</h6>
        </div>
        <div class="d-flex justify-content-between mb-1">
          <small class="text-muted fw-light text-truncate">
            Ukuran File :
            <span v-tooltip="`${formatBytes(props.size)}`" class="fw-bold">
              {{ formatBytes(props.size) }}
            </span>
          </small>
        </div>
        <div class="d-flex justify-content-between">
          <small class="text-muted fw-light text-truncate">
            Terakhir Update :
            <span v-tooltip="`${formatDate({ value: props.lastUpdate })}`" class="fw-bold">
              {{ formatDate({ value: props.lastUpdate }) }}
            </span>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-button-wrapper {
  position: absolute;
  top: 0px;
  right: 14px;
}

.checkbox-file-wrapper {
  position: absolute;
  top: 0px;
  left: 16px;
}

.checkbox-file-lg {
  transform: scale(1.2)
}

.thumbnail-files {
  height: 150px !important;
  object-fit: cover;
  object-position: center;
}
</style>