import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {assessment_id} payload
   * @returns
   */
  getReportCanvasAssessment(payload) {
    return axiosClient.get(`report/canvas/list?assesment_id=${payload?.assessment_id}`)
  },

  /**
   *
   * @param {assement_id, data} payload
   * @returns
   */
  setAdjustmentCanvasAssessment(payload) {
    return axiosClient.post(`report/canvas/set-adjustment`, payload)
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  setHasilCanvasAssessment(payload) {
    return axiosClient.post(`report/canvas/result/${payload?.id}`)
  },

  /**
   *
   * @param {assesment_id, design_faktor_id, weight} payload
   * @returns
   */
  setWeightCanvasAssessment(payload) {
    return axiosClient.post(`report/canvas/set-weight`, payload)
  },

  /**
   *
   * @param {assessment_id} payload
   * @returns
   */
  getReportChartNonAdjustmentAssessment(payload) {
    return axiosClient.get(`domain/chart/list?assesment_id=${payload?.assessment_id}`)
  },

  /**
   *
   * @param {assessment_id} payload
   * @returns
   */
  getReportChartAdjustmentAssessment(payload) {
    return axiosClient.get(`domain/chart/list-adjustment?assesment_id=${payload?.assessment_id}`)
  }
}
