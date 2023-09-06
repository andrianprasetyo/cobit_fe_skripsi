import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @returns
   */
  getCapabilityAnswer() {
    return axiosClient.get(`capabilityanswer/list`)
  },

  /**
   *
   * @param {jawaban} payload
   * @returns
   */
  createCapabilityAnswer(payload) {
    return axiosClient.post(`capabilityanswer/add`, payload)
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  deleteCapabilityAnswer(payload) {
    return axiosClient.delete(`capabilityanswer/remove/${payload?.id}`)
  }
}
