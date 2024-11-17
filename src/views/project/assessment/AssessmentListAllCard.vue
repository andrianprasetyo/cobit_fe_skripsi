<script setup>
import AssessmentListCard from '@/views/project/assessment/AssessmentListCard.vue'
</script>

<template>
  <div>
    <AssessmentListCard status="ongoing" label="Ongoing" sublabel="Project yang sedang Aktif / Berjalan"
      icon="ActivityIcon" variant="primary" />
      
    <AssessmentListCard status="completed" label="Selesai" sublabel="Project yang sudah selesai" icon="CheckboxIcon"
      variant="success" />
  </div>
</template>