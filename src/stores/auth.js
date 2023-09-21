import { defineStore, getActivePinia } from 'pinia'

import AuthServices from '@/services/lib/auth'

import AccountServices from '@/services/lib/account'

import { useToast } from '@/stores/toast'

import { getCookies, removeAllCookies, setCookies } from '@/utils/cookies'

import { filterMenu } from '@/utils/filterMenuByRoleType'

import menu from '@/data/menu.json'

import accessAdministrator from '@/data/accessAdministrator.json'
import accessAssessor from '@/data/accessAssessor.json'
import accessExternal from '@/data/accessExternal.json'

export const useAuth = defineStore('auth', {
  state: () => ({
    account: null,
    access: [],
    menu: menu,
    listRole: [],
    isAuthenticated: false,
    expiresIn: null,
    loggedInAt: null
  }),
  getters: {
    getIsAuthenticated(state) {
      return state.isAuthenticated
    },
    getAccount(state) {
      return state.account
    },
    getAccess(state) {
      return state.access
    },
    getMenu(state) {
      return state.menu
    },
    getListRole(state) {
      return state.listRole
    },
    getExpiresIn(state) {
      return state.expiresIn
    },
    getLoggedInAt(state) {
      return state.loggedInAt
    },
    getIsAdministrator(state) {
      return state.account?.roleaktif?.role?.code === 'administrator'
    },
    getIsEksternal(state) {
      return state.account?.roleaktif?.role?.code === 'eksternal'
    }
  },
  actions: {
    setAuthenticated(payload) {
      this.isAuthenticated = payload
    },
    setAccount(payload) {
      this.account = payload
    },
    setAccess(payload) {
      this.access = payload
    },
    setMenu(payload) {
      this.menu = payload
    },
    setExpiresIn(payload) {
      this.expiresIn = payload
    },
    setLoggedInAt(payload) {
      this.loggedInAt = payload
    },

    async getTokenFromCache() {
      const token = getCookies('token')

      if (token) {
        this.isAuthenticated = true

        return true
      } else {
        removeAllCookies()
        this.resetState()

        return false
      }
    },

    async getMyAccount() {
      const toast = useToast()
      try {
        const response = await AccountServices.getMyAccount()
        if (response) {
          const data = response?.data

          this.account = data?.user
        }
      } catch (error) {
        this.resetState()
        toast.error({ error })
        throw error
      }
    },

    async login(payload) {
      const toast = useToast()
      try {
        const response = await AuthServices.login(payload)

        if (response) {
          const data = response?.data
          this.account = data?.user
          this.listRole = data?.user?.roles || []
          this.expiresIn = data.expires_in
          this.loggedInAt = new Date()
          this.isAuthenticated = true

          const role_type = data?.user?.roleaktif?.role?.code

          const filteredMenu = filterMenu({
            menuData: menu,
            role_type: role_type
          })

          this.menu = filteredMenu

          if (role_type === 'administrator') {
            this.setAccess(accessAdministrator)
          } else if (role_type === 'assesor') {
            this.setAccess(accessAssessor)
          } else if (role_type === 'external') {
            this.setAccess(accessExternal)
          }

          setCookies({ cookies: { token: data?.access_token }, expires: data?.expires_in })

          toast.success({
            title: 'Login Berhasil',
            text: `Selamat Datang ${data?.user?.nama || data?.user?.username || ''}`
          })
          this.router.push('/dashboard')
        }
      } catch (error) {
        toast.error({ error })
        throw error
      }
    },

    async refreshToken() {
      const toast = useToast()
      try {
        const response = await AuthServices.refreshToken()

        if (response) {
          const data = response?.data
          this.expiresIn = data.expires_in
          this.loggedInAt = new Date()
          this.isAuthenticated = true

          setCookies({ cookies: { token: data?.access_token }, expires: data?.expires_in })
        }
      } catch (error) {
        toast.error({ error })
        removeAllCookies()
        this.resetState()
        this.redirectToLogin()
        throw error
      }
    },

    async logout() {
      try {
        const response = await AuthServices.logout()
        return response
      } catch (error) {
        return error
      } finally {
        removeAllCookies()
        this.resetState()
        this.router.push('/auth/login')
      }
    },

    async resetState() {
      getActivePinia()._s.forEach((store) => store.$reset())
    },

    async redirectToLogin() {
      this.router.push('/auth/login')
    }
  },
  persist: {
    enabled: true
  }
})
