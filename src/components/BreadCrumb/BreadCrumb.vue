<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()

const name = computed(() => {
  return route.meta?.pageTitle || route?.name
})

const breadcrumbMeta = computed(() => {
  return route.meta?.breadcrumb
})

const link = computed(() => {
  return value => {
    if (typeof value === 'string') {
      let replaceLink = value.replace(
        /:(\w+)/g,
        (match, key) => route.params[key] || match
      );

      return replaceLink;
    }
  }
})

</script>

<template>
  <div class="card bg-light-primary shadow-none position-relative overflow-hidden">
    <div class="card-body px-4 py-3">
      <div class="row align-items-center">
        <div class="col-9">
          <h4 class="fw-semibold mb-8">{{ name }}</h4>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item" v-for="(item, index) in breadcrumbMeta" :key="`route-${index}`">
                <RouterLink :to="link(item.href)" :class="[item?.active ? '' : 'text-muted']">
                  {{ item?.text || "" }}
                </RouterLink>
              </li>
            </ol>
          </nav>
        </div>
        <div class="col-3">
          <div class="text-center mt-1">
            <img src="/assets/images/illustrations/teamwork.svg" alt="breadcrumb-image" height="150"
              class="mb-0 mb-md-n4 d-none d-md-block">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>