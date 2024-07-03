import { acceptHMRUpdate, defineStore, getActivePinia } from 'pinia'

import AuthServices from '@/services/lib/auth'

import AccountServices from '@/services/lib/account'

import { useToast } from '@/stores/toast'

import { getCookies, removeAllCookies, setCookies } from '@/utils/cookies'

import { filterMenu } from '@/utils/filterMenuByRoleType'

import menu from '@/data/menu.json'
import menuAssessor from '@/data/menuAssessor.json'
import menuExternal from '@/data/menuExternal.json'
import menuProject from '@/data/menuProject.json'

import accessAdministrator from '@/data/accessAdministrator.json'
import accessAssessor from '@/data/accessAssessor.json'
import accessExternal from '@/data/accessExternal.json'

export const useAuth = defineStore('auth', {
  state: () => ({
    account: null,
    access: [],
    menu: [],
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
    getIsAssessor(state) {
      return state.account?.roleaktif?.role?.code === 'assesor'
    },
    getIsEksternal(state) {
      return state.account?.roleaktif?.role?.code === 'eksternal'
    },
    getIsTokenAlmostExpired(state) {
      const currentDateEpoch = new Date().getTime()

      const expiresIn = state.expiresIn
      const loggedInAt = state.loggedInAt

      if (expiresIn && loggedInAt) {
        const epochLoggedIn = new Date(loggedInAt).getTime()
        const epochExpired = epochLoggedIn + expiresIn

        if (currentDateEpoch < epochExpired) {
          return true
        }
      } else {
        return false
      }
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
    setMenuToDefault() {
      if (this.account?.roleaktif?.role?.code === 'administrator') {
        this.menu = menu
      } else if (this.account?.roleaktif?.role?.code === 'assesor') {
        this.menu = menuAssessor
      } else if (this.account?.roleaktif?.role?.code === 'eksternal') {
        this.menu = menuExternal
      }
    },
    setMenuToProject() {
      this.menu = menuProject
    },
    setAccessToDefault() {
      this.access = accessAdministrator
    },
    setAccessToAssessor() {
      this.access = accessAssessor
    },
    setAccessToExternal() {
      this.access = accessExternal
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
          } else if (role_type === 'eksternal') {
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

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
