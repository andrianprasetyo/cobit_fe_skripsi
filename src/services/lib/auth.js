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
  },

  /**
   *
   * @param {email} payload
   * @returns
   */
  resetPassword(payload) {
    return axiosClient.post(`auth/reset-password`, payload)
  },

  /**
   *
   * @param {kode, token} payload
   * @returns
   */
  verifyKodeResetPassword(payload) {
    return axiosClient.post(`auth/verify-reset-password/otp-check`, payload)
  },

  /**
   *
   * @param {token} payload
   * @returns
   */
  verifyResetPassword(payload) {
    return axiosClient.get(`auth/verify-reset-password?token=${payload?.token}`)
  },

  /**
   *
   * @param {token, password, password_confirmation} payload
   * @returns
   */
  resetNewPassword(payload) {
    return axiosClient.post(`auth/verify-reset-password`, payload)
  }
}
