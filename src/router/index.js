import { createRouter, createWebHistory } from 'vue-router'
import { useAppConfig } from '@/stores/appConfig'
import { useAuth } from '@/stores/auth'

/* Check Access Meta

import { useAuth } from '@/stores/auth'
import { useToast } from 'vue-toastification'


function userHasMenuAccess(to, from, next) {
  const { key } = to.meta
  const auth = useAuth()
  const toast = useToast()

  if (Array.isArray(key)) {
    for (let i in key) {
      let isIncluded = auth.access.includes(key[i])

      if (isIncluded) {
        return next
      } else {
        toast.error({ title: 'Akses Ditolak', text: `Anda Tidak Memiliki Akses` })

        return next(from.fullPath)
      }
    }
  }
}
*/

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: (to, from) => {
    if (to.path !== from.path) return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/error/NotFound.vue')
    },
    {
      path: '/',
      redirect: () => {
        return { path: '/main' }
      }
    },
    {
      path: '/main',
      redirect: '/dashboard',
      component: () => import('@/layouts/AppLayoutAdmin.vue'),
      meta: {
        requiredAuth: true
      },
      children: [
        {
          name: 'Dashboard',
          path: '/dashboard',
          component: () => import('@/views/dashboard/MainDashboard.vue')
        },
        {
          name: 'Design Factor',
          path: '/design-factor',
          component: () => import('@/views/design-factor/DesignFactor.vue')
        }
      ]
    },
    {
      path: '/auth',
      redirect: '/auth/login',
      component: () => import('@/layouts/AppLayoutAuth.vue'),
      meta: {
        requiredAuth: false
      },
      children: [
        {
          name: 'Login',
          path: '/auth/login',
          component: () => import('@/views/auth/login/AuthLogin.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const auth = useAuth()

  auth.getTokenFromCache()

  const isRequiredAuth = to.matched.some((record) => record?.meta?.requiredAuth)

  if (isRequiredAuth && !auth.isAuthenticated) {
    return next({ path: '/auth/login' })
  } else {
    return next()
  }
})

// For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  const { app } = useAppConfig()
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }

  document.title = `${app.appName}`
})

export default router
