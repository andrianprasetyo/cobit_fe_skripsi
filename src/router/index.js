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
    if (to.path !== from.path) return { top: 0 }
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
          redirect: '/master/group-answer',
          children: [
            {
              name: 'GroupAnswer',
              path: '/master/group-answer',
              component: () => import('@/views/master/group-answer/GroupAnswerList.vue'),
              meta: {
                pageTitle: 'Group Answer',
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
                    text: 'Group Answer',
                    disabled: true,
                    href: '/master/group-answer',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'TambahGroupAnswer',
              path: '/master/group-answer/add',
              component: () => import('@/views/master/group-answer/GroupAnswerAdd.vue'),
              meta: {
                pageTitle: 'Tambah Group Answer',
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
                    text: 'Group Answer',
                    disabled: false,
                    href: '/master/group-answer',
                    active: false
                  },
                  {
                    text: 'Tambah Group Answer',
                    disabled: true,
                    href: '/master/group-answer/add',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'EditGroupAnswer',
              path: '/master/group-answer/:id/edit',
              component: () => import('@/views/master/group-answer/GroupAnswerEdit.vue'),
              meta: {
                pageTitle: 'Edit Group Answer',
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
                    text: 'Group Answer',
                    disabled: false,
                    href: '/master/group-answer',
                    active: false
                  },
                  {
                    text: 'Edit Group Answer',
                    disabled: true,
                    href: '/master/group-answer/:id/edit',
                    active: true
                  }
                ]
              }
            },

            {
              name: 'DesignFactor',
              path: '/master/design-factor',
              component: () => import('@/views/master/design-factor/DesignFactorList.vue'),
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
            },
            {
              name: 'TambahDesignFactor',
              path: '/master/design-factor/add',
              component: () => import('@/views/master/design-factor/DesignFactorAdd.vue'),
              meta: {
                pageTitle: 'Tambah Design Factor',
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
                    disabled: false,
                    href: '/master/design-factor',
                    active: false
                  },
                  {
                    text: 'Tambah Design Factor',
                    disabled: true,
                    href: '/master/design-factor/add',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'EditDesignFactor',
              path: '/master/design-factor/:id/edit',
              component: () => import('@/views/master/design-factor/DesignFactorEdit.vue'),
              meta: {
                pageTitle: 'Edit Design Factor',
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
                    disabled: false,
                    href: '/master/design-factor',
                    active: false
                  },
                  {
                    text: 'Edit Design Factor',
                    disabled: true,
                    href: '/master/design-factor/:id/edit',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'QuestionDesignFactor',
              path: '/master/design-factor/:id/question',
              component: () => import('@/views/master/design-factor/DesignFactorQuestion.vue'),
              meta: {
                pageTitle: 'Question Design Factor',
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
                    disabled: false,
                    href: '/master/design-factor',
                    active: false
                  },
                  {
                    text: 'Question Design Factor',
                    disabled: true,
                    href: '/master/design-factor/:id/question',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'KomponenDesignFactor',
              path: '/master/design-factor/:id/component',
              component: () => import('@/views/master/design-factor/DesignFactorComponent.vue'),
              meta: {
                pageTitle: 'Komponen Design Factor',
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
                    disabled: false,
                    href: '/master/design-factor',
                    active: false
                  },
                  {
                    text: 'Komponen Design Factor',
                    disabled: true,
                    href: '/master/design-factor/:id/component',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'OverviewDesignFactor',
              path: '/master/design-factor/:id/overview',
              component: () => import('@/views/master/design-factor/DesignFactorOverview.vue'),
              meta: {
                pageTitle: 'Overview Design Factor',
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
                    disabled: false,
                    href: '/master/design-factor',
                    active: false
                  },
                  {
                    text: 'Overview Design Factor',
                    disabled: true,
                    href: '/master/design-factor/:id/overview',
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
        },
        {
          name: 'ForgotPassword',
          path: '/auth/forgot-password',
          component: () => import('@/views/auth/forgot-password/AuthForgotPassword.vue'),
          meta: {
            pageTitle: 'Lupa Password',
            layout: 'AppLayoutAuth',
            background_picture: '/assets/images/illustrations/no-data.svg',
            requiredAuth: false
          }
        },
        {
          name: 'ForgotPasswordVerify',
          path: '/auth/forgot-password/verify',
          component: () =>
            import('@/views/auth/forgot-password/verify/AuthForgotPasswordVerify.vue'),
          meta: {
            pageTitle: 'Verifikasi Kode',
            layout: 'AppLayoutAuth',
            background_picture: '/assets/images/illustrations/making-choice.svg',
            requiredAuth: false
          }
        },
        {
          name: 'ForgotPasswordReset',
          path: '/auth/forgot-password/reset',
          component: () => import('@/views/auth/forgot-password/reset/AuthForgotPasswordReset.vue'),
          meta: {
            pageTitle: 'Reset Password',
            layout: 'AppLayoutAuth',
            background_picture: '/assets/images/illustrations/woman-choice-document.svg',
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
