import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {{limit: Number, page: Number, search: String, sortBy: String, sortType: String, assesment_id: String}} payload
   * @returns
   */
  getListTarget(payload) {
    return axiosClient.get(
      `capabilitytarget/list?limit=${payload?.limit || 10}&page=${payload?.page || 1}${
        payload?.search ? `&search=${payload?.search}` : ''
      }${payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''}${
        payload?.sortType ? `&sortType=${payload?.sortType}` : ''
      }${payload?.assesment_id ? `&assesment_id=${payload?.assesment_id}` : ''}`
    )
  },

  /**
   *
   * @param {{id: String}} payload
   * @returns
   */
  getDetailTarget(payload) {
    return axiosClient.get(`capabilitytarget/detail/${payload?.id}`)
  },

  /**
   *
   * @param {{nama: String, assessment_id: String}} payload
   * @returns
   */
  createTarget(payload) {
    return axiosClient.post(`capabilitytarget/add`, payload)
  },

  /**
   *
   * @param {{id: String, nama: String}} payload
   * @returns
   */
  editTarget(payload) {
    return axiosClient.put(`capabilitytarget/edit/${payload?.id}`, payload)
  },

  /**
   *
   * @param {{id: String}} payload
   * @returns
   */
  deleteTarget(payload) {
    return axiosClient.delete(`capabilitytarget/remove/${payload?.id}`)
  },

  /**
   *
   * @param {{assesment_id: String, target_id: String, assesment: Number}} payload
   * @returns
   */
  getListTargetGamoByTargetId(payload) {
    return axiosClient.get(
      `capabilitytargetlevel/list?assesment_id=${payload?.assesment_id}${payload?.target_id ? `&target_id=${payload?.target_id}` : ''}${payload?.assesment ? `&assesment=${payload?.assesment}` : ''}`
    )
  },

  /**
   *
   * @param {{assesment_id: String, assesment: Number}} payload
   * @returns
   */
  getListTargetGamoByAssessmentId(payload) {
    return axiosClient.get(
      `capabilitytargetlevel/list-target?assesment_id=${payload?.assesment_id}${payload?.assesment ? `&assesment=${payload?.assesment}` : ''}`
    )
  },

  /**
   *
   * @param {{id: String, nama: String, target: String}} payload
   * @returns
   */
  saveTarget(payload) {
    return axiosClient.post(`capabilitytargetlevel/save-target`, payload)
  }
}
