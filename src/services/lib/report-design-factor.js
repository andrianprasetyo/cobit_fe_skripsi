import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {{ assesment_id: String, design_faktor_id: String }} payload
   * @returns
   */
  getReportDesignFactorInput(payload) {
    return axiosClient.get(
      `assesment/report/design-faktor-risk-in/list?assesment_id=${payload?.assesment_id}&design_faktor_id=${payload?.design_faktor_id}`
    )
  },

  /**
   *
   * @param {limit: Number, page: Number, search: String, sortBy: String, sortType: String, assesment_id: String, design_faktor_id: String} payload
   * @returns
   */
  getReportDesignFactorOutput(payload) {
    return axiosClient.get(
      `assesment/report/design-faktor-risk-out/list?assesment_id=${
        payload?.assesment_id
      }&design_faktor_id=${payload?.design_faktor_id}&limit=${payload?.limit || 10}&page=${
        payload?.page || 1
      }${payload?.search ? `&search=${payload?.search}` : ''}${
        payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''
      }${payload?.sortType ? `&sortType=${payload?.sortType}` : ''}`
    )
  },

  /**
   *
   * @param {{assessment_id: String, design_faktor_id: String}} payload
   * @returns
   */
  getReportChartDesignFactor(payload) {
    const assessmentIdParam = payload?.assessment_id ? `assesment_id=${payload?.assessment_id}` : ''
    const designFactorIdParam = payload?.design_faktor_id
      ? `&design_faktor_id=${payload?.design_faktor_id}`
      : ''

    return axiosClient.get(
      `assesment/report/design-faktor-risk-out/chart?${assessmentIdParam}${designFactorIdParam}`
    )
  }
}
