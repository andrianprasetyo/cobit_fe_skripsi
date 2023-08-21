import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {limit, page, search, sortBy, sortType, status, role} payload
   * @returns
   */
  getListUsers(payload) {
    return axiosClient.get(
      `users/list?limit=${payload?.limit || 10}&page=${payload?.page || 0}${
        payload?.search ? `&search=${payload?.search}` : ''
      }${payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''}${
        payload?.sortType ? `&sortType=${payload?.sortType}` : ''
      }${payload?.status ? `&status=${payload?.status}` : ''}${
        payload?.role ? `&role=${payload?.role}` : ''
      }`
    )
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  getDetailUsers(payload) {
    return axiosClient.get(`users/detail/${payload?.id}`, payload)
  },

  /**
   *
   * @param {nama, username, email, divisi, posisi, role_id} payload
   * @returns
   */
  createUsers(payload) {
    return axiosClient.post(`users/add`, payload)
  },

  /**
   *
   * @param {id, status} payload
   * @returns
   */
  editUsers(payload) {
    return axiosClient.put(`users/edit/${payload?.id}`, payload)
  }
}
