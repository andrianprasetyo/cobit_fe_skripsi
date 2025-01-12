import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {limit, page, search, sortBy, sortType} payload
   * @returns Array
   */
  getListRoles(payload) {
    return axiosClient.get(
      `roles/list?limit=${payload?.limit || 10}&page=${payload?.page || 0}${
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
  getDetailRoles(payload) {
    return axiosClient.get(`roles/detail/${payload?.id}`)
  },

  /**
   * @param {nama} payload
   * @returns
   */
  createRoles(payload) {
    return axiosClient.post(`roles/add`, payload)
  },

  /**
   *
   * @param {id, nama, deskripsi, aktif} payload
   * @returns
   */
  editRoles(payload) {
    return axiosClient.put(`roles/edit/${payload?.id}`, payload)
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  deleteRoles(payload) {
    return axiosClient.delete(`roles/remove/${payload?.id}`)
  }
}
