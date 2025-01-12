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
      `capabilityassesment/kalkulasi-by-domain?domain_id=${payload?.domain_id}&assesment_id=${payload?.assesment_id}`
    )
  },

  /**
   *
   * @param {{assesment_id: String, target_id: String}} payload
   * @returns
   */
  getSummaryCapability(payload) {
    return axiosClient.get(
      `capabilityassesment/summary-by-domain?assesment_id=${payload?.assesment_id}${payload?.target_id ? `&target_id=${payload?.target_id}` : ''}`
    )
  },

  /**
   *
   * @param {{assesment_id: String}} payload
   * @returns
   */
  getSummaryStatusPBCCapability(payload) {
    return axiosClient.get(`capabilityassesment/pbc/summary?assesment_id=${payload?.assesment_id}`)
  },

  /**
   *
   * @param {{assesment_id: String}} payload
   * @returns
   */
  getSummaryChartStatusPBCCapability(payload) {
    return axiosClient.get(
      `capabilityassesment/pbc/summary/chart?assesment_id=${payload?.assesment_id}`
    )
  },

  /**
   *
   * @param {{assesment_id: String}} payload
   * @returns
   */
  getProgressCapability(payload) {
    return axiosClient.get(`capabilityassesment/progress?assesment_id=${payload?.assesment_id}`)
  },

  /**
   *
   * @param {{assesment_id: String}} payload
   * @returns
   */
  getProgressListCapability(payload) {
    return axiosClient.get(
      `capabilityassesment/progress/list?assesment_id=${payload?.assesment_id}`
    )
  },

  /**
   * @param {{assesment_id: String, domain_id: String, limit: String | Number, page: String | Number}} payload
   * @returns
   */
  getHistoryGamoCapability(payload) {
    return axiosClient.get(
      `capabilityassesment/answer/history?assesment_id=${payload?.assesment_id}&domain_id=${
        payload?.domain_id
      }&limit=${payload?.limit || 10}&page=${payload?.page || 1}`
    )
  },

  /**
   * @param {{assesment_id: String, domain_id: String, level: String | Number}} payload
   * @returns
   */
  getPenilaianNoteCapability(payload) {
    return axiosClient.get(
      `capabilityassesment/answer/note?assesment_id=${payload?.assesment_id}&domain_id=${
        payload?.domain_id
      }${payload?.level ? `&level=${payload?.level}` : ''}`
    )
  },

  /**
   * @param {{assesment_id: String, domain_id: String, level: String | Number}} payload
   * @returns
   */
  getEvidenceCapability(payload) {
    return axiosClient.get(
      `capabilityassesment/answer/evidence?assesment_id=${payload?.assesment_id}&domain_id=${
        payload?.domain_id
      }${payload?.level ? `&level=${payload?.level}` : ''}`
    )
  },

  /**
   * @param {{assesment_id: String, domain_id: String, level: String | Number}} payload
   * @returns
   */
  getPBCCapability(payload) {
    return axiosClient.get(
      `capabilityassesment/pbc/list?domain_id=${payload?.domain_id}&assesment_id=${payload?.assesment_id}${payload?.level ? `&level=${payload?.level}` : ''}`
    )
  },

  /**
   *
   * @param {{jawaban: Array}} payload
   * @returns
   */
  answerPBCCapability(payload) {
    return axiosClient(`capabilityassesment/answer/pbc`, {
      method: 'POST',
      data: payload,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   *
   * @param {{limit: Number; page: Number; search: String | Number, assesment_id: String}} payload
   * @returns
   */
  getPBCListCapability(payload) {
    return axiosClient.get(
      `capabilityassesment/pbc/summary/list?limit=${payload?.limit || 10}&page=${
        payload?.page || 1
      }&assesment_id=${payload?.assesment_id}`
    )
  }
}
