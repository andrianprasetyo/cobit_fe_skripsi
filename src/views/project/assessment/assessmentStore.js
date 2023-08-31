import { defineStore } from 'pinia'

import AssessmentServices from '@/services/lib/assessment'
import ReportServices from '@/services/lib/report'

import { useLoading } from 'vue-loading-overlay'
import { useToast } from '@/stores/toast'

const loading = useLoading()

export const useAssessmentStore = defineStore('assessment', {
  state: () => ({
    selectedAssessment: null,
    detail: null,
    reportChart: {
      nonAdjustment: null,
      adjustment: null
    },
    reportSummary: null
  }),
  getters: {
    getSelectedAssessment(state) {
      return state.selectedAssessment
    },

    getDetail(state) {
      return state.detail
    },

    getReportChartNonAdjustment(state) {
      return state.reportChart.nonAdjustment
    },

    getReportChartAdjustment(state) {
      return state.reportChart.adjustment
    },

    getReportSummary(state) {
      return state.summary
    }
  },
  actions: {
    setSeletedAssessment(payload) {
      this.selectedAssessment = payload
    },

    setReportChartNonAdjustment(payload) {
      this.reportChart.nonAdjustment = payload
    },

    setReportChartAdjustment(payload) {
      this.reportChart.adjustment = payload
    },

    async getDetailAssessment(payload) {
      const toast = useToast()
      const loader = loading.show()

      try {
        const response = await AssessmentServices.getDetailAssessment({ id: payload?.id })

        if (response) {
          const data = response?.data

          this.detail = data
          loader.hide()

          return response
        }
      } catch (error) {
        loader.hide()
        toast.error({ error })
        throw error
      }
    },

    async inviteResponden(payload) {
      const toast = useToast()
      const loader = loading.show()

      try {
        const response = await AssessmentServices.inviteResponden({
          id: payload?.id,
          email: payload?.email
        })

        if (response) {
          toast.success({
            title: 'Undang Responden',
            text: 'Berhasil Mengundang Responden'
          })
          loader.hide()

          return response
        }
      } catch (error) {
        loader.hide()
        toast.error({ error })
        throw error
      }
    },

    async inviteRespondenByExcel(payload) {
      const toast = useToast()
      const loader = loading.show()

      try {
        const formData = new FormData()

        formData.append('id', payload?.id)
        formData.append('file', payload?.file)

        const response = await AssessmentServices.inviteRespondenByExcel(formData)

        if (response) {
          toast.success({
            title: 'Undang Responden',
            text: 'Berhasil Mengundang Responden'
          })
          loader.hide()

          return response
        }
      } catch (error) {
        loader.hide()
        toast.error({ error })
        throw error
      }
    },

    async getReportChartNonAdjustmentAssessment(payload) {
      const toast = useToast()
      const loader = loading.show()

      try {
        const response = await ReportServices.getReportChartNonAdjustmentAssessment({
          assessment_id: payload?.assessment_id
        })

        if (response) {
          const data = response?.data

          this.reportChart.nonAdjustment = data
          loader.hide()

          return response
        }
      } catch (error) {
        loader.hide()
        toast.error({ error })
        throw error
      }
    },

    async getReportChartAdjustmentAssessment(payload) {
      const toast = useToast()
      const loader = loading.show()

      try {
        const response = await ReportServices.getReportChartAdjustmentAssessment({
          assessment_id: payload?.assessment_id
        })

        if (response) {
          const data = response?.data

          this.reportChart.adjustment = data
          loader.hide()

          return response
        }
      } catch (error) {
        loader.hide()
        toast.error({ error })
        throw error
      }
    },

    async getReportCanvasAssessment(payload) {
      const toast = useToast()
      const loader = loading.show()

      try {
        const response = await ReportServices.getReportCanvasAssessment({
          assessment_id: payload?.assessment_id
        })

        if (response) {
          const data = response?.data

          this.reportSummary = data

          loader.hide()
          return response
        }
      } catch (error) {
        loader.hide()
        toast.error({ error })
        throw error
      }
    },

    resetState() {
      this.$reset()
    }
  }
})
