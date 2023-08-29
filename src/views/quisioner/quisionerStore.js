import { defineStore } from 'pinia'

export const useQuisionerStore = defineStore('quisioner', {
  state: () => ({
    responden: null,
    question: {
      currentQuestion: 1
    }
  }),
  getters: {
    getResponden(state) {
      return state.responden
    },

    getCurrentQuestion(state) {
      return state.question.currentQuestion
    }
  },
  actions: {
    setResponden(payload) {
      this.responden = payload
    },

    setCurrentQuestion(payload) {
      this.question.currentQuestion = payload
    },

    resetState() {
      this.$reset()
    }
  },
  persist: {
    enabled: true
  }
})
