import { defineStore } from 'pinia'

export const useQuisionerStore = defineStore('quisioner', {
  state: () => ({
    responden: null
  }),
  getters: {
    getResponden(state) {
      return state.responden
    }
  },
  actions: {
    setResponden(payload) {
      this.responden = payload
    },

    resetState() {
      this.$reset()
    }
  },
  persist: {
    enabled: true
  }
})
