import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {limit, page, search, sortBy, sortType, domain_id} payload
   * @returns
   */
  getListCapabilityLevel(payload) {
    return axiosClient.get(
      `capabilitylevel/list?limit=${payload?.limit || 10}&page=${payload?.page || 1}${
        payload?.search ? `&search=${payload?.search}` : ''
      }${payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''}${
        payload?.sortType ? `&sortType=${payload?.sortType}` : ''
      }${payload?.domain_id ? `&domain_id=${payload?.domain_id}` : ''}${
        payload?.level ? `&level=${payload?.level}` : ''
      }`
    )
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  getDetailCapabilityLevel(payload) {
    return axiosClient.get(`capabilitylevel/detail/${payload?.id}`)
  },

  /**
   *
   * @param {kode, kegiatan, translate, level, bobot, domain_id, guidelines} payload
   * @returns
   */
  createCapabilityLevel(payload) {
    return axiosClient.post(`capabilitylevel/add`, payload)
  },

  /**
   *
   * @param {kegiatan, translate, level, bobot, domain_id, guidelines} payload
   * @returns
   */
  editCapabilityLevel(payload) {
    return axiosClient.put(`capabilitylevel/edit/${payload?.id}`, payload)
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  deleteCapabilityLevel(payload) {
    return axiosClient.delete(`capabilitylevel/remove/${payload?.id}`)
  }
}
