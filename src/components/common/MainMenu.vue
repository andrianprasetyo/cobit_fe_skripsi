<script setup>
import { computed, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import LinkMenuItem from '@/components/Link/LinkMenuItem.vue'


import { useAuth } from '@/stores/auth'
import { useAppConfig } from '@/stores/appConfig'
import { useWindowSize } from '@vueuse/core';

const route = useRoute()
const appConfig = useAppConfig()
const auth = useAuth()
const { width } = useWindowSize()

/* ---------------------------------- STATE --------------------------------- */
const stateSidebar = reactive({
  activeGroupId: '',
  activeChildrenGroupId: "",
})

/* -------------------------------- COMPUTED -------------------------------- */
const isHasChildren = computed(() => {
  return (item) => item?.children
})

const isHasURL = computed(() => {
  return item => item?.url && item?.url !== "-";
})

const currentRouteHash = computed(() => {
  return route.hash
})

const currentRoutePath = computed(() => {
  return route.path
})

const isActiveNav = computed(() => {
  return item => {
    if (item?.type === 'navigation') {
      return false
    } else if (item?.hash) {
      return !item?.parent_id && !item?.children && currentRoutePath.value.toString() === item?.url && item?.hash === currentRouteHash.value
    } else {
      return !item?.parent_id && !item?.children && currentRoutePath.value.toString() === item?.url
    }
  }
})

const isActiveCollapsedNav = computed(() => {
  return (children) => {
    if (children && Array.isArray(children)) {
      for (let i in children) {
        let isIncluded = stateSidebar.activeGroupId === children[i]?.parent_id;

        if (isIncluded) {
          return true;
        } else {
          return false;
        }
      }
    }

    return false
  };
})

/*
const isChildrenActiveMenu = computed(() => {
  return (children) => {
    const isHasParams = Object.getOwnPropertyNames(route?.params).length > 0

    let isIncluded = false;

    if (isHasParams) {
      isIncluded = currentRoutePath.value.startsWith(children?.url)
    } else {
      isIncluded = currentRoutePath.value.endsWith(children?.url)
    }

    if (isIncluded) {
      return true;
    } else {
      return false;
    }
  };
})
*/

const isChildrenActiveMenu = computed(() => {
  return (children) => {
    let isIncluded = currentRoutePath.value.startsWith(children?.url);

    if (isIncluded) {
      return true;
    } else {
      return false;
    }
  };
})

const isHasURLAndURLStartsFromAndSpecialCase = computed(() => {
  return item => {
    if (item?.type === 'navigation') {
      return false
    } else if (item?.hash) {
      return !item?.parent_id && !item?.children && currentRoutePath.value.startsWith(hrefWithParams.value(item?.url)) && currentRouteHash.value === item?.hash
    } else {
      return !item?.parent_id && !item?.children && currentRoutePath.value.startsWith(hrefWithParams.value(item?.url)) && !currentRouteHash.value
    }
  }
})

const hrefWithParams = computed(() => {
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

/* --------------------------------- METHODS -------------------------------- */
const setActiveGroupId = value => {
  if (stateSidebar.activeGroupId !== value) {
    stateSidebar.activeGroupId = value
  } else {
    stateSidebar.activeGroupId = ""
  }
}

const setActiveChildrenGroupId = value => {
  if (stateSidebar.activeChildrenGroupId !== value) {
    stateSidebar.activeChildrenGroupId = value;
  } else {
    stateSidebar.activeChildrenGroupId = "";
  }
}

const resetStateSidebar = () => {
  stateSidebar.activeGroupId = ''
  stateSidebar.activeChildrenGroupId = ''
}

onMounted(() => {
  if (auth.menu && Array.isArray(auth.menu)) {
    auth.menu.map(item => {
      const children = item?.children;

      if (children && Array.isArray(children)) {
        for (let i in children) {
          let currentActiveChildren = currentRoutePath.value
            .toString().startsWith(children[i]?.url)

          if (currentActiveChildren) {
            stateSidebar.activeGroupId = children[i]?.parent_id;
          }

          const subChildren = children[i]?.children

          if (subChildren && Array.isArray(subChildren)) {
            for (let indexSub in subChildren) {
              let currentSubActiveChildren = currentRoutePath.value
                .toString()
                == subChildren[indexSub]?.url;

              if (currentSubActiveChildren) {
                if (!this.activeGroupId) {
                  stateSidebar.activeGroupId = children[i]?.parent_id;
                }

                if (!this.activeChildrenGroupId) {
                  stateSidebar.activeChildrenGroupId = children[i]?.id;
                }

                return
              }
            }
          }
        }
      }
    })
  }

  // Check Is Mobile
  if (width.value < 550) {
    appConfig.$patch({
      layouts: {
        ...appConfig.layouts, miniSidebar: true,
      }
    })
  }
})

defineExpose({
  resetStateSidebar
})

</script>

<template>
  <nav class="sidebar-nav scroll-sidebar my-3" data-simplebar>
    <ul id="sidebarnav">
      <!-- Menu Level 1 -->
      <template v-for="menuItem in auth.menu" :key="menuItem.id">
        <!-- Navigation Header -->
        <li v-if="menuItem.menu_key.includes('header')" class="nav-small-cap">
          <TablerIcon size="21" icon="DotsIcon" class="nav-small-cap-icon fs-4" />
          <span class="hide-menu">{{ menuItem.title }}</span>
        </li>

        <!-- Navigation Item  -->
        <li v-else class="sidebar-item" :class="[isActiveNav(menuItem) ? 'selected' : '']">
          <!-- Navigation Item With URL -->
          <LinkMenuItem v-if="isHasURL(menuItem)" :hash="menuItem.hash"
            :to="menuItem?.url ? hrefWithParams(menuItem?.url) : '-'" class="sidebar-link"
            :class="[isHasChildren(menuItem?.children) ? 'has-arrow' : '', isActiveNav(menuItem) || isHasURLAndURLStartsFromAndSpecialCase(menuItem) ? 'active' : '']"
            @click="setActiveGroupId('')">
            <TablerIcon size=" 21" :icon="menuItem?.icon" class="nav-small-cap-icon fs-4"
              :class="[isActiveNav(menuItem) || isHasURLAndURLStartsFromAndSpecialCase(menuItem) ? 'text-white' : '']" />
            <span class="hide-menu">{{ menuItem?.title }}</span>
          </LinkMenuItem>

          <!-- Navigation Item Hasn't URL -->
          <!-- Header Group -->
          <a v-else class="sidebar-link has-arrow cursor-pointer"
            :class="[isActiveCollapsedNav(menuItem?.children) ? 'active' : '']" aria-expanded="false"
            @click="setActiveGroupId(menuItem?.id)">
            <TablerIcon size="21" :icon="menuItem?.icon" class="nav-small-cap-icon fs-4"
              :class="[isActiveCollapsedNav(menuItem?.children) ? 'text-white' : '']" />
            <span class="hide-menu">{{ menuItem?.title }}</span>
          </a>

          <ul aria-expanded="false" class="collapse first-level"
            :class="[isActiveCollapsedNav(menuItem?.children) ? 'in' : '']">
            <!-- Menu Level Ke 2 -->
            <template v-for="children in menuItem?.children" :key="children?.id">
              <LinkMenuItem v-if="isHasURL(children)" :hash="menuItem.hash" :to="hrefWithParams(children?.url) || '-'"
                class="sidebar-link ms-1 d-flex align-items-center"
                :class="[isHasChildren(children?.children) ? 'has-arrow' : '', isChildrenActiveMenu(children) ? 'active fw-bolder' : '']"
                @click="setActiveChildrenGroupId(children?.id)">
                <!-- With Icons -->
                <!-- <TablerIcon size="14" :icon="children?.icon" class="nav-small-cap-icon fs-4 icon-children" /> -->

                <!-- Static Icons -->
                <TablerIcon size="8" :icon="isChildrenActiveMenu(children) ? 'CircleFilledIcon' : 'CircleIcon'"
                  class="nav-small-cap-icon fs-4" :class="[isChildrenActiveMenu(children) ? 'text-white' : '']" />
                <span class="hide-menu">{{ children?.title }}</span>
              </LinkMenuItem>

              <!-- Header Group Level 2 -->
              <a v-else class="sidebar-link has-arrow cursor-pointer " aria-expanded="false"
                @click="setActiveChildrenGroupId(children?.id)">
                <TablerIcon :icon="children?.icon" class="nav-small-cap-icon fs-4 icon-children" />
                <span class="hide-menu">{{ children?.title }}</span>
              </a>
            </template>
          </ul>
        </li>
      </template>
    </ul>
  </nav>
</template>

<style scoped>
.icon-children {
  font-size: 16px !important;
  height: 16px !important;
  width: 16px !important;
}
</style>