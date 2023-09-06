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
          redirect: '/master/grup-jawaban',
          children: [
            {
              name: 'GrupJawaban',
              path: '/master/grup-jawaban',
              component: () => import('@/views/master/grup-jawaban/GrupJawabanList.vue'),
              meta: {
                pageTitle: 'Grup Jawaban',
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
                    text: 'Grup Jawaban',
                    disabled: true,
                    href: '/master/grup-jawaban',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'TambahGrupJawaban',
              path: '/master/grup-jawaban/add',
              component: () => import('@/views/master/grup-jawaban/GrupJawabanAdd.vue'),
              meta: {
                pageTitle: 'Tambah Grup Jawaban',
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
                    text: 'Grup Jawaban',
                    disabled: false,
                    href: '/master/grup-jawaban',
                    active: false
                  },
                  {
                    text: 'Tambah Grup Jawaban',
                    disabled: true,
                    href: '/master/grup-jawaban/add',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'EditGrupJawaban',
              path: '/master/grup-jawaban/:id/edit',
              component: () => import('@/views/master/grup-jawaban/GrupJawabanEdit.vue'),
              meta: {
                pageTitle: 'Edit Grup Jawaban',
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
                    text: 'Grup Jawaban',
                    disabled: false,
                    href: '/master/grup-jawaban',
                    active: false
                  },
                  {
                    text: 'Edit Grup Jawaban',
                    disabled: true,
                    href: '/master/grup-jawaban/:id/edit',
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
              name: 'GAMO',
              path: '/master/gamo',
              component: () => import('@/views/master/gamo/GamoList.vue'),
              meta: {
                pageTitle: 'Governance and Management Objectives (GAMO)',
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
                    text: 'Governance and Management Objectives (GAMO)',
                    disabled: true,
                    href: '/master/gamo',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'TambahGAMO',
              path: '/master/gamo/add',
              component: () => import('@/views/master/gamo/GamoAdd.vue'),
              meta: {
                pageTitle: 'Tambah Governance and Management Objectives (GAMO)',
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
                    text: 'Governance and Management Objectives (GAMO)',
                    disabled: false,
                    href: '/master/gamo',
                    active: false
                  },
                  {
                    text: 'Tambah Governance and Management Objectives (GAMO)',
                    disabled: true,
                    href: '/master/gamo/add',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'EditGAMO',
              path: '/master/gamo/:id/edit',
              component: () => import('@/views/master/gamo/GamoEdit.vue'),
              meta: {
                pageTitle: 'Edit Governance and Management Objectives (GAMO)',
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
                    text: 'Governance and Management Objectives (GAMO)',
                    disabled: false,
                    href: '/master/gamo',
                    active: false
                  },
                  {
                    text: 'Edit Governance and Management Objectives (GAMO)',
                    disabled: true,
                    href: '/master/gamo/:id/edit',
                    active: true
                  }
                ]
              }
            },

            {
              name: 'CapabilityAnswer',
              path: '/master/gamo/capability-answer',
              component: () => import('@/views/master/gamo/capability-answer/CapabilityAnswer.vue'),
              meta: {
                pageTitle: 'Jawaban Capability',
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
                    text: 'Governance and Management Objectives (GAMO)',
                    disabled: false,
                    href: '/master/gamo',
                    active: false
                  },
                  {
                    text: 'Jawaban Capability',
                    disabled: true,
                    href: '/master/gamo/capability-answer',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'CapabilityLevel',
              path: '/master/gamo/:id/capability-level',
              component: () =>
                import('@/views/master/gamo/capability-level/CapabilityLevelList.vue'),
              meta: {
                pageTitle: 'Capability Level',
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
                    text: 'Governance and Management Objectives (GAMO)',
                    disabled: false,
                    href: '/master/gamo',
                    active: false
                  },
                  {
                    text: 'Capability Level',
                    disabled: true,
                    href: '/master/gamo/:id/capability-level',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'TambahCapabilityLevel',
              path: '/master/gamo/:id/capability-level/add',
              component: () =>
                import('@/views/master/gamo/capability-level/CapabilityLevelAdd.vue'),
              meta: {
                pageTitle: 'Tambah Capability Level',
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
                    text: 'Governance and Management Objectives (GAMO)',
                    disabled: false,
                    href: '/master/gamo',
                    active: false
                  },
                  {
                    text: 'Capability Level',
                    disabled: false,
                    href: '/master/gamo/:id/capability-level',
                    active: false
                  },
                  {
                    text: 'Tambah Capability Level',
                    disabled: true,
                    href: '/master/gamo/:id/capability-level/add',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'EditCapabilityLevel',
              path: '/master/gamo/:id/capability-level/:capability_level_id/edit',
              component: () =>
                import('@/views/master/gamo/capability-level/CapabilityLevelEdit.vue'),
              meta: {
                pageTitle: 'Edit Capability Level',
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
                    text: 'Governance and Management Objectives (GAMO)',
                    disabled: false,
                    href: '/master/gamo',
                    active: false
                  },
                  {
                    text: 'Capability Level',
                    disabled: false,
                    href: '/master/gamo/:id/capability-level',
                    active: false
                  },
                  {
                    text: 'Edit Capability Level',
                    disabled: true,
                    href: '/master/gamo/:id/capability-level/:capability_level_id/edit',
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
            },
            {
              name: 'DivisiOrganisasi',
              path: '/master/organisasi/:id/divisi-dan-jabatan',
              component: () => import('@/views/master/organisasi/OrganisasiDivisiDanJabatan.vue'),
              meta: {
                pageTitle: 'Divisi & Jabatan Organisasi',
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
                    text: 'Divisi & Jabatan Organisasi',
                    disabled: true,
                    href: '/master/organisasi/:id/divisi-dan-jabatan',
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
                pageTitle: 'Asesmen',
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
                    text: 'Asesmen',
                    disabled: true,
                    href: '/project/assessment',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'TambahAsesmen',
              path: '/project/assessment/add',
              component: () => import('@/views/project/assessment/AssessmentAdd.vue'),
              meta: {
                pageTitle: 'Tambah Asesmen',
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
                    text: 'Asesmen',
                    disabled: false,
                    href: '/project/assessment',
                    active: false
                  },
                  {
                    text: 'Tambah Asesmen',
                    disabled: true,
                    href: '/project/assessment/add',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'DetailAsesmen',
              path: '/project/assessment/:id/detail',
              component: () => import('@/views/project/assessment/AssessmentDetail.vue'),
              meta: {
                pageTitle: 'Detail Asesmen',
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
                    text: 'Asesmen',
                    disabled: false,
                    href: '/project/assessment',
                    active: false
                  },
                  {
                    text: 'Detail Asesmen',
                    disabled: true,
                    href: '/project/assessment/:id/detail',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'EditAsesmen',
              path: '/project/assessment/:id/edit',
              component: () => import('@/views/project/assessment/AssessmentEdit.vue'),
              meta: {
                pageTitle: 'Edit Asesmen',
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
                    text: 'Asesmen',
                    disabled: false,
                    href: '/project/assessment',
                    active: false
                  },
                  {
                    text: 'Edit Asesmen',
                    disabled: true,
                    href: '/project/assessment/:id/edit',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'SummaryGAMO',
              path: '/project/assessment/:id/summary',
              component: () => import('@/views/project/assessment/summary/AssessmentSummary.vue'),
              meta: {
                pageTitle: 'Summary GAMO',
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
                    text: 'Asesmen',
                    disabled: false,
                    href: '/project/assessment',
                    active: false
                  },
                  {
                    text: 'Summary GAMO',
                    disabled: true,
                    href: '/project/assessment/:id/summary',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'ReportGAMO',
              path: '/project/assessment/:id/report',
              component: () => import('@/views/project/assessment/report/AssessmentReport.vue'),
              meta: {
                pageTitle: 'Report GAMO',
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
                    text: 'Asesmen',
                    disabled: false,
                    href: '/project/assessment',
                    active: false
                  },
                  {
                    text: 'Report GAMO',
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
          path: '/kuesioner',
          redirect: '/kuesioner/responden',
          children: [
            {
              name: 'Kuesioner',
              path: '/kuesioner/responden',
              component: () => import('@/views/kuesioner/responden/KuesionerResponden.vue'),
              meta: {
                pageTitle: 'Kuesioner',
                layout: 'AppLayoutSideView',
                background_picture: '/assets/images/illustrations/man-choice-document.svg',
                requiredAuth: false,
                breadcrumb: [
                  {
                    text: 'Kuesioner',
                    disabled: false,
                    href: '/kuesioner',
                    active: false
                  },
                  {
                    text: 'Kuesioner Responden',
                    disabled: true,
                    href: '/kuesioner/responden',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'Question',
              path: '/kuesioner/responden/question',
              component: () => import('@/views/kuesioner/responden/question/QuestionResponden.vue'),
              meta: {
                pageTitle: 'Question',
                layout: 'AppLayoutSideView',
                background_picture: '/assets/images/illustrations/teamwork-activity.svg',
                requiredAuth: false,
                breadcrumb: [
                  {
                    text: 'Kuesioner',
                    disabled: false,
                    href: '/kuesioner',
                    active: false
                  },
                  {
                    text: 'Kuesioner Responden',
                    disabled: false,
                    href: '/kuesioner/responden',
                    active: false
                  },
                  {
                    text: 'Kuesioner Question',
                    disabled: true,
                    href: '/kuesioner/responden/question',
                    active: true
                  }
                ]
              }
            },
            {
              name: 'KuesionerFinish',
              path: '/kuesioner/responden/question/finish',
              component: () =>
                import('@/views/kuesioner/responden/question/QuestionRespondenFinish.vue'),
              meta: {
                pageTitle: 'Question Selesai',
                layout: 'AppLayoutBoxed',
                background_picture: '/assets/images/illustrations/paperwork.svg',
                requiredAuth: false,
                breadcrumb: [
                  {
                    text: 'Kuesioner',
                    disabled: false,
                    href: '/kuesioner',
                    active: false
                  },
                  {
                    text: 'Kuesioner Responden',
                    disabled: false,
                    href: '/kuesioner/responden',
                    active: false
                  },
                  {
                    text: 'Kuesioner Question',
                    disabled: false,
                    href: '/kuesioner/responden/question',
                    active: false
                  },
                  {
                    text: 'Kuesioner Question Selesai',
                    disabled: true,
                    href: '/kuesioner/responden/question/finish',
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
