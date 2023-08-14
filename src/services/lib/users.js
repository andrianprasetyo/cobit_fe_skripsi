import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {limit, offset, search} payload
   * @returns
   */
  getListUsers(payload) {
    return axiosClient.get(
      `users/list?limit=${payload?.limit || 10}&offset=${payload?.offset || 0}${
        payload?.search ? `&search=${payload?.search}` : ''
      }`
    )
  }
}
