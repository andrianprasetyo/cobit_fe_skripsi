import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {limit, page, search, sortBy, sortType} payload
   * @returns
   */
  getListGroupAnswer(payload) {
    return axiosClient.get(
      `quisioner-grup-jawaban/list?limit=${payload?.limit || 10}&page=${payload?.page || 0}${
        payload?.search ? `&search=${payload?.search}` : ''
      }${payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''}${
        payload?.sortType ? `&sortType=${payload?.sortType}` : ''
      }`
    )
  },

  /**
   *
   * @param {nama, jenis, jawaban} payload
   * @returns object
   */
  createGroupAnswer(payload) {
    return axiosClient.post(`quisioner-grup-jawaban`, payload)
  },

  /**
   *
   * @param {id, nama, jenis} payload
   * @returns
   */
  editGroupAnswer(payload) {
    return axiosClient.put(`quisioner-grup-jawaban/edit/${payload?.id}`, payload)
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  deleteGroupAnswer(payload) {
    return axiosClient.delete(`quisioner-grup-jawaban/remove/${payload?.id}`)
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  getDetailGroupAnswer(payload) {
    return axiosClient.get(`quisioner-grup-jawaban/detail/${payload?.id}`)
  },

  /**
   *
   * @param {id, jawabans} payload
   * @returns
   */
  editSemuaJawabanGroupAnswer(payload) {
    return axiosClient.put(`quisioner-grup-jawaban/edit/${payload?.id}`, payload)
  },

  /**
   *
   * @param {grupid, nama, bobot} payload
   * @returns
   */
  addJawabanGroupAnswer(payload) {
    return axiosClient.post(`quisioner-jawaban/add`, payload)
  },

  /**
   *
   * @param {id, nama, bobot} payload
   * @returns
   */
  editJawabanGroupAnswer(payload) {
    return axiosClient.put(`quisioner-jawaban/edit/${payload?.id}`, payload)
  },

  /**
   *
   * @param {grupid} payload
   * @returns
   */
  deleteJawabanGroupAnswer(payload) {
    return axiosClient.delete(`quisioner-jawaban/remove/${payload?.id}`)
  },

  /**
   *
   * @param {id} payload
   */
  deleteSemuaJawabanGroupAnswer(payload) {
    return axiosClient.delete(`quisioner-jawaban/remove-all/${payload?.id}`)
  }
}
