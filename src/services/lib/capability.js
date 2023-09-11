import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {limit, page, search, assesment_id} payload
   * @returns
   */
  getListGamoCapability(payload) {
    return axiosClient.get(
      `domain/assesment/capability-level/list?limit=${payload?.limit || 10}&page=${
        payload?.page || 1
      }${payload?.search ? `&search=${payload?.search}` : ''}${
        payload?.assesment_id ? `&assesment_id=${payload?.assesment_id}` : ''
      }`
    )
  },

  /**
   *
   * @param {domain_id} payload
   * @returns
   */
  getListLevelCapability(payload) {
    return axiosClient.get(
      `domain/assesment/capability-level/list-by-domain?domain_id=${payload?.domain_id}`
    )
  },

  /**
   *
   * @param {level, domain_id} payload
   * @returns
   */
  getDetailLevelCapability(payload) {
    return axiosClient.get(
      `capabilityassesment/list?level=${payload?.level}&domain_id=${payload?.domain_id}&assesment_id=${payload?.assesment_id}`
    )
  },

  /**
   *
   * @param {jawaban} payload
   * @returns
   */
  answerLevelCapability(payload) {
    return axiosClient(`capabilityassesment/answer`, {
      method: 'POST',
      data: payload,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
