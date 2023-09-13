import { defineStore } from 'pinia'

import AssessmentServices from '@/services/lib/assessment'
import ReportServices from '@/services/lib/report'
import CapabilityServices from '@/services/lib/capability'
import RepositoryServices from '@/services/lib/repository'

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
    reportCanvasSummary: null,
    capability: {
      listGamo: [],
      selectedGamo: null,
      listLevel: [],
      selectedSubGamo: null,
      selectedLevel: '2',
      detailListLevel: [],
      detailListAnswer: [],
      detailTotalBobot: null,
      listMediaFile: [],
      selectedMediaFile: null,
      averageComplianceLevel: null,
      listSummary: [],
      listSummaryLevel: []
    },
    report: {
      selectedGamo: null
    }
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

    getReportCanvasSummary(state) {
      return state.reportCanvasSummary
    },

    getCapabilitySelectedGamo(state) {
      return state.capability.selectedGamo
    },

    getCapabilityListLevel(state) {
      return state.capability.listLevel
    },

    getCapabilitySelectedLevel(state) {
      return state.capability.selectedLevel
    },

    getCapabilityIsEditedPenilaianSubGamo(state) {
      const indexEdited = state.capability.detailListLevel.findIndex((level) => {
        return level?.capabilityass?.isEdited
      })

      if (indexEdited !== -1) {
        return true
      } else {
        return false
      }
    },

    getCapabilityIsComplianceEnough(state) {
      return state.capability.detailTotalBobot?.result >= 0.85
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

    setCapabilitySelectedLevel(payload) {
      this.capability.selectedLevel = payload
    },

    setCapabilitySelectedSubGamo(payload) {
      this.capability.selectedSubGamo = payload
    },

    saveCapabilityPenilaianSubGamo(payload) {
      const indexSaved = this.capability.detailListLevel.findIndex(
        (item) => item?.id === payload?.id
      )

      if (indexSaved != -1) {
        const patched = this.capability.detailListLevel
        patched[indexSaved] = payload
        this.capability.detailListLevel = patched
      }
    },

    setCapabilityListMediaFile(payload) {
      this.capability.listMediaFile = payload
    },

    setCapabilitySelectedMediaFile(payload) {
      this.capability.selectedMediaFile = payload
    },

    setCapabilityAverageComplianceLevel(payload) {
      this.capability.averageComplianceLevel = payload
    },

    setReportSelectedGamo(payload) {
      this.report.selectedGamo = payload
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

          this.reportCanvasSummary = data

          loader.hide()
          return response
        }
      } catch (error) {
        loader.hide()
        toast.error({ error })
        throw error
      }
    },

    async setAdjustmentCanvasAssessment(payload) {
      const toast = useToast()
      const loader = loading.show()

      try {
        const response = await ReportServices.setAdjustmentCanvasAssessment({
          assement_id: payload.assement_id,
          data: payload.data
        })

        if (response) {
          toast.success({
            title: 'Data Adjustment',
            text: 'Berhasil Menyimpan Data Adjustment'
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

    async getCapabilityListGamoAssessment(payload) {
      const toast = useToast()
      const loader = loading.show()

      try {
        const response = await CapabilityServices.getListGamoCapability({
          assesment_id: payload?.assesment_id
        })

        if (response) {
          const data = response.data
          this.capability.listGamo = data?.list || []

          loader.hide()
          return response
        }
      } catch (error) {
        loader.hide()
        toast.error({ error })
        throw error
      }
    },

    async getCapabilityListLevelAssessment(payload) {
      const toast = useToast()
      const loader = loading.show()

      try {
        const response = await CapabilityServices.getListLevelCapability({
          domain_id: payload?.domain_id
        })

        if (response) {
          const data = response.data
          const list = data || []

          /*
            Sorting Value

          if (Array.isArray(list) && list.length) {
            const sorted = list.sort((a, b) => a?.level - b?.level)

            this.capability.listLevel = sorted
          }
          */

          this.capability.listLevel = list

          loader.hide()
          return response
        }
      } catch (error) {
        loader.hide()
        toast.error({ error })
        throw error
      }
    },

    async getCapabilityDetailLevelAssessment(payload) {
      const toast = useToast()

      try {
        const response = await CapabilityServices.getDetailLevelCapability({
          level: payload.level,
          domain_id: payload.domain_id,
          assesment_id: payload.assesment_id
        })

        if (response) {
          const data = response?.data

          this.capability.detailListLevel = data?.list || []
          this.capability.detailListAnswer = data?.answer || []
          this.capability.detailTotalBobot = data?.total_bobot || null

          return response
        }
      } catch (error) {
        toast.error({ error })
        throw error
      }
    },

    async getCapabilityListMediaRepositoryAssessment(payload) {
      const toast = useToast()

      try {
        const response = await RepositoryServices.getListMediaRepository({
          assesment_id: payload.assesment_id,
          search: payload?.search,
          limit: payload?.limit
        })

        if (response) {
          const data = response?.data

          this.capability.listMediaFile = data?.list || []

          return response
        }
      } catch (error) {
        toast.error({ error })
        throw error
      }
    },

    async deleteCapabilityMediaRepositoryAssessment(payload) {
      const toast = useToast()

      try {
        const response = await RepositoryServices.deleteMediaRepository({
          id: payload.id
        })

        if (response) {
          toast.success({
            title: 'Delete File Repository',
            text: 'Berhasil Menghapus Data File Repository'
          })

          return response
        }
      } catch (error) {
        toast.error({ error })
        throw error
      }
    },

    async getCapabilityAverageAverageComplianceLevel(payload) {
      const toast = useToast()

      try {
        const response = await CapabilityServices.getAverageComplianceLevelCapability({
          domain_id: payload.domain_id,
          assesment_id: payload.assesment_id
        })

        if (response) {
          const data = response?.data

          this.capability.averageComplianceLevel = data

          return response
        }
      } catch (error) {
        toast.error({ error })
        throw error
      }
    },

    async getCapabilitySummaryAssessment(payload) {
      const toast = useToast()

      try {
        const response = await CapabilityServices.getSummaryCapability({
          assesment_id: payload.assesment_id
        })

        if (response) {
          const data = response?.data

          this.capability.listSummary = data?.list || []
          this.capability.listSummaryLevel = data?.level || []

          return response
        }
      } catch (error) {
        toast.error({ error })
        throw error
      }
    },

    resetState() {
      this.$reset()
    }
  },
  persist: {
    enabled: true
  }
})
