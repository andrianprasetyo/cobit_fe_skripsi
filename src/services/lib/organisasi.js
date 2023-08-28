import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {limit, page, search, sortBy, sortType} payload
   * @returns
   */
  getListOrganisasi(payload) {
    return axiosClient.get(
      `organisasi/list?limit=${payload?.limit || 10}&page=${payload?.page || 1}${
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
  getDetailOrganisasi(payload) {
    return axiosClient.get(`organisasi/detail/${payload?.id}`)
  },

  /**
   *
   * @param {nama, deskripsi} payload
   * @returns
   */
  createOrganisasi(payload) {
    return axiosClient.post(`organisasi/add`, payload)
  },

  /**
   *
   * @param {id, nama, deskripsi} payload
   * @returns
   */
  editOrganisasi(payload) {
    return axiosClient.put(`organisasi/edit/${payload?.id}`, payload)
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  deleteOrganisasi(payload) {
    return axiosClient.delete(`organisasi/remove/${payload?.id}`)
  }
}
