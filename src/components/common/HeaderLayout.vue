<script setup>
import { ref } from 'vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import NotificationPopUp from '@/components/common/NotificationPopUp.vue'
import BaseAvatar from '@/components/Avatar/BaseAvatar.vue'

import { useAuth } from '@/stores/auth'
import { useAlert } from '@/stores/alert'
import { useAppConfig } from '@/stores/appConfig'

import { RouterLink } from 'vue-router';

const auth = useAuth();
const alert = useAlert();
const appConfig = useAppConfig()

const isLoading = ref(false)

const handleLogout = async () => {
  alert.info({
    title: "Apakah Yakin Untuk Keluar dari Aplikasi?",
  }).then(async (result) => {
    if (result.isConfirmed) {
      alert.loading()
      try {
        isLoading.value = true
        const response = await auth.logout()

        if (response) {
          isLoading.value = false
          alert.instance().close()
        }
      } catch (error) {
        alert.instance().close()
        isLoading.value = false
      }
    }
  })
}

const handleToggleMiniSidebar = () => {
  appConfig.toggleMiniSidebar()
}

</script>

<template>
  <header class="app-header">
    <nav class="navbar navbar-expand-lg navbar-light">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a @click="handleToggleMiniSidebar" class="nav-link sidebartoggler nav-icon-hover ms-n3 cursor-pointer"
            id="headerCollapse">
            <TablerIcon icon="Menu2Icon" size="24" :class="[appConfig.layouts.miniSidebar ? 'text-secondary' : '']" />
          </a>
        </li>
      </ul>
      <button class="navbar-toggler p-0 border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="p-2">
          <TablerIcon icon="DotsIcon" />
        </span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <div class="d-flex align-items-center justify-content-between">

          <!-- Open Drawer Mobile -->
          <!-- <a class="nav-link d-flex d-lg-none align-items-center justify-content-center" type="button"
            data-bs-toggle="offcanvas" data-bs-target="#mobilenavbar" aria-controls="offcanvasWithBothOptions">
            <TablerIcon icon="AlignJustifiedIcon" />
          </a> -->

          <ul class="navbar-nav flex-row ms-auto align-items-center justify-content-center">
            <li class="nav-item dropdown">
              <a class="nav-link nav-icon-hover" href="javascript:void(0)" id="drop2" data-bs-toggle="dropdown"
                aria-expanded="false">
                <TablerIcon icon="BellRingingIcon" size="20" badge="5" />
              </a>
              <NotificationPopUp />
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link pe-0" href="javascript:void(0)" id="drop1" data-bs-toggle="dropdown"
                aria-expanded="false">
                <div class="d-flex align-items-center">
                  <div class="user-profile-img">
                    <BaseAvatar :source="`${appConfig.app.appHostMedia}${auth.account?.avatar?.path}`" width="35"
                      height="35" />
                  </div>
                </div>
              </a>
              <div class="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop1">
                <div class="profile-dropdown position-relative" data-simplebar>
                  <div class="py-3 px-7 pb-0">
                    <h5 class="mb-0 fs-5 fw-semibold">User Profile</h5>
                  </div>
                  <div class="d-flex align-items-center py-9 mx-7 border-bottom">
                    <BaseAvatar :source="`${appConfig.app.appHostMedia}${auth.account?.avatar?.path}`" width="80"
                      height="80" />

                    <div class="ms-3">
                      <h5 class="mb-1 fs-3">{{ auth?.account?.nama }}</h5>
                      <span class="mb-1 d-block text-dark">{{ auth?.account?.roleaktif?.role?.nama }}</span>
                      <p v-if="auth?.account?.email" class="mb-0 d-flex text-dark align-items-center gap-2">
                        <TablerIcon icon="MailIcon" /> {{ auth?.account?.email }}
                      </p>
                    </div>
                  </div>
                  <div class="message-body border-bottom">
                    <RouterLink to="/account/setting" class="py-8 px-7 mt-8 d-flex align-items-center">
                      <span class="d-flex align-items-center justify-content-center bg-light rounded-1 p-6">
                        <TablerIcon size="24" icon="SettingsIcon" />
                      </span>
                      <div class="w-75 d-inline-block v-middle ps-3">
                        <h6 class="mb-1 bg-hover-primary fw-semibold"> Pengaturan </h6>
                        <span class="d-block text-dark">Pengaturan Account</span>
                      </div>
                    </RouterLink>
                  </div>

                  <div class="d-grid py-4 px-7 pt-8">
                    <BaseButton class="btn btn-outline-primary" title="Log Out" @click="handleLogout"
                      :isLoading="isLoading" :disabled="isLoading" />
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>