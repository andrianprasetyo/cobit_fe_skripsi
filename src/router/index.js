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
      component: () => import('@/views/error/NotFound.vue'),
      meta: {
        layout: 'AppLayoutBlank',
        requiredAuth: false,
        background_picture: '/assets/images/illustrations/not-found.svg'
      }
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
      children: [
        {
          name: 'Dashboard',
          path: '/dashboard',
          component: () => import('@/views/dashboard/MainDashboard.vue'),
          meta: {
            pageTitle: 'Dashboard',
            layout: 'AppLayoutAdmin',
            requiredAuth: true,
            breadcrumbs: [
              {
                text: 'Dashboard',
                disabled: false,
                href: '/dashboard',
                active: true
              }
            ]
          }
        },

        {
          path: '/master',
          redirect: '/master/design-factor',
          children: [
            {
              name: 'Design Factor',
              path: '/master/design-factor',
              component: () => import('@/views/master/design-factor/DesignFactor.vue'),
              meta: {
                pageTitle: 'Design Factor',
                layout: 'AppLayoutAdmin',
                requiredAuth: true,
                breadcrumb: [
                  {
                    text: 'Master',
                    disabled: false,
                    href: '/master',
                    active: false
                  },
                  {
                    text: 'Design Factor',
                    disabled: true,
                    href: '/master/design-factor',
                    active: true
                  }
                ]
              }
            }
          ]
        },

        {
          path: '/manajemen-user',
          redirect: '/manajemen-user/users',
          children: [
            {
              name: 'Users',
              path: '/manajemen-user/users',
              component: () => import('@/views/manajemen-user/users/UsersList.vue'),
              meta: {
                pageTitle: 'Users',
                layout: 'AppLayoutAdmin',
                requiredAuth: true,
                breadcrumb: [
                  {
                    text: 'Manajemen User',
                    disabled: false,
                    href: '/manajemen-user',
                    active: false
                  },
                  {
                    text: 'Users',
                    disabled: true,
                    href: '/manajemen-user/users',
                    active: true
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      path: '/auth',
      redirect: '/auth/login',
      children: [
        {
          name: 'Login',
          path: '/auth/login',
          component: () => import('@/views/auth/login/AuthLogin.vue'),
          meta: {
            pageTitle: 'Login',
            layout: 'AppLayoutAuth',
            background_picture: '/assets/images/illustrations/discussion.svg',
            requiredAuth: false
          }
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
router.afterEach((to) => {
  const { app } = useAppConfig()
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }

  document.title = `${to.meta?.pageTitle} | ${app.appName || ''}` || `${app.appName || ''}`
})

export default router
