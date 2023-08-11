<script setup>
import { ref } from 'vue'
import TablerIcon from '@/components/TablerIcon/TablerIcon.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import NotificationPopUp from '@/components/common/NotificationPopUp.vue'


import { useAuth } from '@/stores/auth'
import { useAlert } from '@/stores/alert'

import { RouterLink } from 'vue-router';

const auth = useAuth();
const alert = useAlert()

const isLoading = ref(false)

const handleLogout = async () => {
  alert.info({
    title: "Apakah Yakin Untuk Keluar dari Aplikasi?",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        isLoading.value = true
        const response = await auth.logout()

        if (response) {
          isLoading.value = false
        }
      } catch (error) {
        isLoading.value = false
      }
    }
  })
}

</script>

<template>
  <header class="app-header">
    <nav class="navbar navbar-expand-lg navbar-light">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link sidebartoggler nav-icon-hover ms-n3 " id="headerCollapse" href="javascript:void(0)">
            <TablerIcon icon="Menu2Icon" />
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
          <a href="javascript:void(0)" class="nav-link d-flex d-lg-none align-items-center justify-content-center"
            type="button" data-bs-toggle="offcanvas" data-bs-target="#mobilenavbar"
            aria-controls="offcanvasWithBothOptions">
            <TablerIcon icon="AlignJustifiedIcon" />
          </a>
          <ul class="navbar-nav flex-row ms-auto align-items-center justify-content-center">
            <li class="nav-item dropdown">
              <a class="nav-link nav-icon-hover" href="javascript:void(0)" id="drop2" data-bs-toggle="dropdown"
                aria-expanded="false">
                <TablerIcon icon="BellRingingIcon" size="20" badge="1" />
              </a>
              <NotificationPopUp />
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link pe-0" href="javascript:void(0)" id="drop1" data-bs-toggle="dropdown"
                aria-expanded="false">
                <div class="d-flex align-items-center">
                  <div class="user-profile-img">
                    <img src="/assets/images/profile/user-1.jpg" class="rounded-circle" width="35" height="35" alt="" />
                  </div>
                </div>
              </a>
              <div class="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop1">
                <div class="profile-dropdown position-relative" data-simplebar>
                  <div class="py-3 px-7 pb-0">
                    <h5 class="mb-0 fs-5 fw-semibold">User Profile</h5>
                  </div>
                  <div class="d-flex align-items-center py-9 mx-7 border-bottom">
                    <img src="/assets/images/profile/user-1.jpg" class="rounded-circle" width="80" height="80" alt="" />
                    <div class="ms-3">
                      <h5 class="mb-1 fs-3">{{ auth?.account?.nama }}</h5>
                      <span class="mb-1 d-block text-dark">{{ auth?.account?.role?.role?.nama }}</span>
                      <p v-if="auth?.account?.email" class="mb-0 d-flex text-dark align-items-center gap-2">
                        <TablerIcon icon="MailIcon" /> {{ auth?.account?.email }}
                      </p>
                    </div>
                  </div>
                  <div class="message-body border-bottom">
                    <RouterLink to="/account/profile" class="py-8 px-7 mt-8 d-flex align-items-center">
                      <span class="d-flex align-items-center justify-content-center bg-light rounded-1 p-6">
                        <TablerIcon size="24" icon="UserIcon" />
                      </span>
                      <div class="w-75 d-inline-block v-middle ps-3">
                        <h6 class="mb-1 bg-hover-primary fw-semibold"> My Profile </h6>
                        <span class="d-block text-dark">Lihat Detail Profile</span>
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