import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {username, password} payload
   * @returns
   */
  login(payload) {
    return axiosClient.post('auth/login', payload)
  },

  /**
   * @returns string
   */
  refreshToken() {
    return axiosClient.get('account/token-refresh')
  },

  /**
   *
   * @returns string
   */
  logout() {
    return axiosClient.post('account/logout')
  }
}
