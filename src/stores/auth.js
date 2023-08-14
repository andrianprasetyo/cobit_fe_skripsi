import { defineStore, getActivePinia } from 'pinia'

import AuthServices from '@/services/lib/auth'

import AccountServices from '@/services/lib/account'

import { useToast } from '@/stores/toast'

import { getCookies, removeAllCookies, setCookies } from '@/utils/cookies'

import menu from '@/data/menu.json'

export const useAuth = defineStore('auth', {
  state: () => ({
    account: null,
    access: [],
    menu: menu,
    listRole: [],
    isAuthenticated: false
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
          this.menu = menu
          this.isAuthenticated = true

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
