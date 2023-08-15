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
  }
}
