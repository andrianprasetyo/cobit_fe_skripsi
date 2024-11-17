import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {limit, page, search, sortBy, sortType} payload
   * @returns
   */
  getListDomain(payload) {
    return axiosClient.get(
      `domain/list?limit=${payload?.limit || 10}&page=${payload?.page || 1}${
        payload?.search ? `&search=${payload?.search}` : ''
      }${payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''}${
        payload?.sortType ? `&sortType=${payload?.sortType}` : ''
      }`
    )
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  getDetailDomain(payload) {
    return axiosClient.get(`domain/detail/${payload?.id}`)
  },

  /**
   *
   * @param { kode, deskripsi, translate } payload
   * @returns
   */
  createDomain(payload) {
    return axiosClient.post(`domain/add`, payload)
  },

  /**
   *
   * @param {id, kode, deskripsi, translate } payload
   * @returns
   */
  editDomain(payload) {
    return axiosClient.put(`domain/edit/${payload?.id}`, payload)
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  deleteDomain(payload) {
    return axiosClient.delete(`domain/remove/${payload?.id}`)
  },

  /**
   *
   * @param {{limit: String | Number, page: String | Number, assessment_id: String, sortBy: String, sortType: String, target_id: String }} payload
   * @returns
   */
  getSummaryGamo(payload) {
    return axiosClient.get(
      `domain/assesment/list?limit=${payload?.limit || 10}&page=${
        payload?.page || 1
      }&assesment_id=${payload?.assessment_id}${payload?.target_id ? `&target_id=${payload?.target_id}` : ''}${
        payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''
      }${payload?.sortType ? `&sortType=${payload?.sortType}` : ''}
      `
    )
  },

  /**
   *
   * @param {{limit: String | Number, page: String | Number, assessment_id: String, sortBy: String, sortType: String, target_id: String, assessment: String }} payload
   * @returns
   */
  getGamoByTarget(payload) {
    return axiosClient.get(
      `domain/assesment/list-by-target?limit=${payload?.limit || 10}&page=${
        payload?.page || 1
      }&assesment_id=${payload?.assessment_id}${payload?.target_id ? `&target_id=${payload?.target_id}` : ''}${
        payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''
      }${payload?.sortType ? `&sortType=${payload?.sortType}` : ''}${payload?.assessment ? `&assessment=${payload?.assessment}` : ''}`
    )
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  exportSummaryGamo(payload) {
    return axiosClient.get(`domain/assesment/download?id=${payload?.id}`)
  }
}
