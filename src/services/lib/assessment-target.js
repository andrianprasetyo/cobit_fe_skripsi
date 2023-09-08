import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {limit, page, search, sortBy, sortType, assessment_id} payload
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
   * @param {id} payload
   * @returns
   */
  getDetailTarget(payload) {
    return axiosClient.get(`capabilitytarget/detail/${payload?.id}`)
  },

  /**
   *
   * @param {nama, assessment_id} payload
   * @returns
   */
  createTarget(payload) {
    return axiosClient.post(`capabilitytarget/add`, payload)
  },

  /**
   *
   * @param {id, nama} payload
   * @returns
   */
  editTarget(payload) {
    return axiosClient.put(`capabilitytarget/edit/${payload?.id}`, payload)
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  deleteTarget(payload) {
    return axiosClient.delete(`capabilitytarget/remove/${payload?.id}`)
  },

  /**
   *
   * @param {target_id} payload
   * @returns
   */
  getListTargetGamoByTargetId(payload) {
    return axiosClient.get(`capabilitytargetlevel/list?target_id=${payload?.target_id}`)
  },

  /**
   *
   * @param {assesment_id} payload
   * @returns
   */
  getListTargetGamoByAssessmentId(payload) {
    return axiosClient.get(
      `capabilitytargetlevel/list-target?assesment_id=${payload?.assesment_id}`
    )
  },

  /**
   *
   * @param {id, nama, target} payload
   * @returns
   */
  saveTarget(payload) {
    return axiosClient.post(`capabilitytargetlevel/save-target`, payload)
  }
}
