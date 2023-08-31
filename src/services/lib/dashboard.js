import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @returns object
   */
  getAssessment() {
    return axiosClient.get(`dashboard/assesment`)
  },

  /**
   *
   * @param {assessment_id} payload
   * @returns
   */
  getAssessmentChart(payload) {
    return axiosClient.get(
      `dashboard/assesment-chart?${payload?.assessment_id ? `id=${payload?.assessment_id}` : ''}`
    )
  }
}
