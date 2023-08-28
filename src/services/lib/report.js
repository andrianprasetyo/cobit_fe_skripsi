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
   * @param {id, nilai} payload
   * @returns
   */
  setAdjustmentCanvasAssessment(payload) {
    return axiosClient.post(`report/canvas/set-adjustment`, payload)
  }
}
