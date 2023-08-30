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
        pageTitle: 'Halaman Tidak Ditemukan',
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
            breadcrumb: [
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
            },

            {
              name: 'Domain',
              path: '/master/domain',
              component: () => import('@/views/master/domain/DomainList.vue'),
              meta: {
                pageTitle: 'Domain',
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
                    text: 'Domain',
                    disabled: true,
                    href: '/master/domain',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'TambahDomain',
              path: '/master/domain/add',
              component: () => import('@/views/master/domain/DomainAdd.vue'),
              meta: {
                pageTitle: 'Tambah Domain',
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
                    text: 'Domain',
                    disabled: false,
                    href: '/master/domain',
                    active: false
                  },
                  {
                    text: 'Tambah Domain',
                    disabled: true,
                    href: '/master/domain/add',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'EditDomain',
              path: '/master/domain/:id/edit',
              component: () => import('@/views/master/domain/DomainEdit.vue'),
              meta: {
                pageTitle: 'Edit Domain',
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
                    text: 'Domain',
                    disabled: false,
                    href: '/master/domain',
                    active: false
                  },
                  {
                    text: 'Edit Domain',
                    disabled: true,
                    href: '/master/domain/:id/edit',
                    active: true
                  }
                ]
              }
            },

            {
              name: 'Organisasi',
              path: '/master/organisasi',
              component: () => import('@/views/master/organisasi/OrganisasiList.vue'),
              meta: {
                pageTitle: 'Organisasi',
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
                    text: 'Organisasi',
                    disabled: true,
                    href: '/master/organisasi',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'TambahOrganisasi',
              path: '/master/organisasi/add',
              component: () => import('@/views/master/organisasi/OrganisasiAdd.vue'),
              meta: {
                pageTitle: 'Tambah Organisasi',
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
                    text: 'Organisasi',
                    disabled: false,
                    href: '/master/organisasi',
                    active: false
                  },
                  {
                    text: 'Tambah Organisasi',
                    disabled: true,
                    href: '/master/organisasi/add',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'EditOrganisasi',
              path: '/master/organisasi/:id/edit',
              component: () => import('@/views/master/organisasi/OrganisasiEdit.vue'),
              meta: {
                pageTitle: 'Edit Organisasi',
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
                    text: 'Organisasi',
                    disabled: false,
                    href: '/master/organisasi',
                    active: false
                  },
                  {
                    text: 'Edit Organisasi',
                    disabled: true,
                    href: '/master/organisasi/:id/edit',
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
            },
            {
              name: 'TambahUsers',
              path: '/manajemen-user/users/add',
              component: () => import('@/views/manajemen-user/users/UsersAdd.vue'),
              meta: {
                pageTitle: 'Tambah Users',
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
                    disabled: false,
                    href: '/manajemen-user/users',
                    active: false
                  },
                  {
                    text: 'Tambah Users',
                    disabled: true,
                    href: '/manajemen-user/users/add',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'EditUsers',
              path: '/manajemen-user/users/:id/edit',
              component: () => import('@/views/manajemen-user/users/UsersEdit.vue'),
              meta: {
                pageTitle: 'Edit Users',
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
                    disabled: false,
                    href: '/manajemen-user/users',
                    active: false
                  },
                  {
                    text: 'Edit Users',
                    disabled: true,
                    href: '/manajemen-user/users/:id/edit',
                    active: true
                  }
                ]
              }
            },

            {
              name: 'Roles',
              path: '/manajemen-user/roles',
              component: () => import('@/views/manajemen-user/roles/RolesList.vue'),
              meta: {
                pageTitle: 'Roles',
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
                    text: 'Roles',
                    disabled: true,
                    href: '/manajemen-user/roles',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'TambahRoles',
              path: '/manajemen-user/roles/add',
              component: () => import('@/views/manajemen-user/roles/RolesAdd.vue'),
              meta: {
                pageTitle: 'Tambah Roles',
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
                    text: 'Roles',
                    disabled: false,
                    href: '/manajemen-user/roles',
                    active: false
                  },
                  {
                    text: 'Tambah Roles',
                    disabled: true,
                    href: '/manajemen-user/roles/add',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'EditRoles',
              path: '/manajemen-user/roles/:id/edit',
              component: () => import('@/views/manajemen-user/roles/RolesEdit.vue'),
              meta: {
                pageTitle: 'Edit Roles',
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
                    text: 'Roles',
                    disabled: false,
                    href: '/manajemen-user/roles',
                    active: false
                  },
                  {
                    text: 'Edit Roles',
                    disabled: true,
                    href: '/manajemen-user/roles/:id/edit',
                    active: true
                  }
                ]
              }
            }
          ]
        },

        {
          path: '/project',
          redirect: '/project/assessment',
          children: [
            {
              name: 'Assessment',
              path: '/project/assessment',
              component: () => import('@/views/project/assessment/AssessmentList.vue'),
              meta: {
                pageTitle: 'Assessment',
                layout: 'AppLayoutAdmin',
                requiredAuth: true,
                breadcrumb: [
                  {
                    text: 'Project',
                    disabled: false,
                    href: '/project',
                    active: false
                  },
                  {
                    text: 'Asessment',
                    disabled: true,
                    href: '/project/assessment',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'TambahAssessment',
              path: '/project/assessment/add',
              component: () => import('@/views/project/assessment/AssessmentAdd.vue'),
              meta: {
                pageTitle: 'Tambah Assessment',
                layout: 'AppLayoutAdmin',
                requiredAuth: true,
                breadcrumb: [
                  {
                    text: 'Project',
                    disabled: false,
                    href: '/project',
                    active: false
                  },
                  {
                    text: 'Assessment',
                    disabled: false,
                    href: '/project/assessment',
                    active: false
                  },
                  {
                    text: 'Tambah Assessment',
                    disabled: true,
                    href: '/project/assessment/add',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'DetailAssessment',
              path: '/project/assessment/:id/detail',
              component: () => import('@/views/project/assessment/AssessmentDetail.vue'),
              meta: {
                pageTitle: 'Detail Assessment',
                layout: 'AppLayoutAdmin',
                requiredAuth: true,
                breadcrumb: [
                  {
                    text: 'Project',
                    disabled: false,
                    href: '/project',
                    active: false
                  },
                  {
                    text: 'Assessment',
                    disabled: false,
                    href: '/project/assessment',
                    active: false
                  },
                  {
                    text: 'Detail Assessment',
                    disabled: true,
                    href: '/project/assessment/:id/detail',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'EditAssessment',
              path: '/project/assessment/:id/edit',
              component: () => import('@/views/project/assessment/AssessmentEdit.vue'),
              meta: {
                pageTitle: 'Edit Assessment',
                layout: 'AppLayoutAdmin',
                requiredAuth: true,
                breadcrumb: [
                  {
                    text: 'Project',
                    disabled: false,
                    href: '/project',
                    active: false
                  },
                  {
                    text: 'Assessment',
                    disabled: false,
                    href: '/project/assessment',
                    active: false
                  },
                  {
                    text: 'Edit Assessment',
                    disabled: true,
                    href: '/project/assessment/:id/edit',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'SummaryAssessment',
              path: '/project/assessment/:id/summary',
              component: () => import('@/views/project/assessment/AssessmentSummary.vue'),
              meta: {
                pageTitle: 'Summary Assessment',
                layout: 'AppLayoutAdmin',
                requiredAuth: true,
                breadcrumb: [
                  {
                    text: 'Project',
                    disabled: false,
                    href: '/project',
                    active: false
                  },
                  {
                    text: 'Assessment',
                    disabled: false,
                    href: '/project/assessment',
                    active: false
                  },
                  {
                    text: 'Summary Assessment',
                    disabled: true,
                    href: '/project/assessment/:id/summary',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'ReportAssessment',
              path: '/project/assessment/:id/report',
              component: () => import('@/views/project/assessment/report/AssessmentReport.vue'),
              meta: {
                pageTitle: 'Report Assessment',
                layout: 'AppLayoutAdmin',
                requiredAuth: true,
                breadcrumb: [
                  {
                    text: 'Project',
                    disabled: false,
                    href: '/project',
                    active: false
                  },
                  {
                    text: 'Assessment',
                    disabled: false,
                    href: '/project/assessment',
                    active: false
                  },
                  {
                    text: 'Report Assessment',
                    disabled: true,
                    href: '/project/assessment/:id/report',
                    active: true
                  }
                ]
              }
            }
          ]
        },

        {
          path: '/quisioner',
          redirect: '/quisioner/responden',
          children: [
            {
              name: 'Quisioner',
              path: '/quisioner/responden',
              component: () => import('@/views/quisioner/responden/QuisionerResponden.vue'),
              meta: {
                pageTitle: 'Quisioner',
                layout: 'AppLayoutSideView',
                background_picture: '/assets/images/illustrations/man-choice-document.svg',
                requiredAuth: false,
                breadcrumb: [
                  {
                    text: 'Quisioner',
                    disabled: false,
                    href: '/quisioner',
                    active: false
                  },
                  {
                    text: 'Quisioner Responden',
                    disabled: true,
                    href: '/quisioner/responden',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'Question',
              path: '/quisioner/responden/question',
              component: () => import('@/views/quisioner/responden/question/QuestionResponden.vue'),
              meta: {
                pageTitle: 'Question',
                layout: 'AppLayoutSideView',
                background_picture: '/assets/images/illustrations/teamwork-activity.svg',
                requiredAuth: false,
                breadcrumb: [
                  {
                    text: 'Quisioner',
                    disabled: false,
                    href: '/quisioner',
                    active: false
                  },
                  {
                    text: 'Quisioner Responden',
                    disabled: false,
                    href: '/quisioner/responden',
                    active: false
                  },
                  {
                    text: 'Quisioner Question',
                    disabled: true,
                    href: '/quisioner/question',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'QuestionFinish',
              path: '/quisioner/responden/question/finish',
              component: () =>
                import('@/views/quisioner/responden/question/QuestionRespondenFinish.vue'),
              meta: {
                pageTitle: 'Question Selesai',
                layout: 'AppLayoutBoxed',
                background_picture: '/assets/images/illustrations/paperwork.svg',
                requiredAuth: false,
                breadcrumb: [
                  {
                    text: 'Quisioner',
                    disabled: false,
                    href: '/quisioner',
                    active: false
                  },
                  {
                    text: 'Quisioner Responden',
                    disabled: false,
                    href: '/quisioner/responden',
                    active: false
                  },
                  {
                    text: 'Quisioner Question',
                    disabled: false,
                    href: '/quisioner/responden/question',
                    active: false
                  },
                  {
                    text: 'Quisioner Question Selesai',
                    disabled: true,
                    href: '/quisioner/responden/question/finish',
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
      path: '/account',
      redirect: '/account/settings',
      children: [
        {
          name: 'Settings',
          path: '/account/settings',
          component: () => import('@/views/account/settings/AccountSettings.vue'),
          meta: {
            pageTitle: 'Settings',
            layout: 'AppLayoutAdmin',
            requiredAuth: true,
            breadcrumb: [
              {
                text: 'Account',
                disabled: false,
                href: '/account',
                active: false
              },
              {
                text: 'Settings',
                disabled: true,
                href: '/account/settings',
                active: true
              }
            ]
          }
        },
        {
          name: 'AccountVerify',
          path: '/account/verify',
          component: () => import('@/views/account/verify/AccountVerify.vue'),
          meta: {
            pageTitle: 'Verifikasi',
            layout: 'AppLayoutAuth',
            background_picture: '/assets/images/illustrations/teamwork-talking.svg',
            requiredAuth: false
          }
        },
        {
          name: 'AccountSetPassword',
          path: '/account/set-password',
          component: () => import('@/views/account/set-password/AccountSetPassword.vue'),
          meta: {
            pageTitle: 'Konfigurasi Password',
            layout: 'AppLayoutAuth',
            background_picture: '/assets/images/illustrations/woman-configuring.svg',
            requiredAuth: false
          }
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

  const isRequiredAuth = to.matched.some((record) => record?.meta?.requiredAuth)

  if (isRequiredAuth) {
    auth.getTokenFromCache()
  }

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
