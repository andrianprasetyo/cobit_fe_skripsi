import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {{limit: Number; page: Number; search: String | Number, assesment_id: String}} payload
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
   * @param {{domain_id: String}} payload
   * @returns
   */
  getListLevelCapability(payload) {
    return axiosClient.get(
      `domain/assesment/capability-level/list-by-domain?domain_id=${payload?.domain_id}${
        payload?.capability_target_id
          ? `&capability_target_id=${payload?.capability_target_id}`
          : ''
      }`
    )
  },

  /**
   *
   * @param {{level: String; domain_id: String; assesment_id: String}} payload
   * @returns
   */
  getDetailLevelCapability(payload) {
    return axiosClient.get(
      `capabilityassesment/list?level=${payload?.level}&domain_id=${payload?.domain_id}&assesment_id=${payload?.assesment_id}`
    )
  },

  /**
   *
   * @param {{jawaban: Array}} payload
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
  },

  /**
   *
   * @param {{domain_id: String; assesment_id: String}} payload
   * @returns
   */
  getAverageComplianceLevelCapability(payload) {
    return axiosClient.get(
      `capabilityassesment/kalkulasi-by-domain?domain_id=${payload?.domain_id}&assesment_id=${
        payload?.assesment_id
      }`
    )
  },

  /**
   *
   * @param {{assesment_id: String}} payload
   * @returns
   */
  getSummaryCapability(payload) {
    return axiosClient.get(
      `capabilityassesment/summary-by-domain?assesment_id=${payload?.assesment_id}`
    )
  }
}
