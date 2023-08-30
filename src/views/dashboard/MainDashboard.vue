<script setup>
import GreetingCard from '@/views/dashboard/components/GreetingCard.vue'
import SummaryCard from '@/views/dashboard/components/SummaryCard.vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue';

</script>

<template>
  <div class="row">
    <div class="col-12 col-md-12">
      <GreetingCard />
    </div>

    <SummaryCard label="Jumlah Responden" variant="primary">
      <template #icon>
        <TablerIcon icon="NotesIcon" />
      </template>
    </SummaryCard>

    <SummaryCard label="Jumlah Project / Assessment" variant="primary">
      <template #icon>
        <TablerIcon icon="ReportAnalyticsIcon" />
      </template>
    </SummaryCard>

    <SummaryCard label="Jumlah User" variant="primary">
      <template #icon>
        <TablerIcon icon="UsersIcon" />
      </template>
    </SummaryCard>

  </div>
</template>