import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @returns object
   */
  getMyAccount() {
    return axiosClient.get('account/me')
  },

  /**
   *
   * @param {nama, email, username, status, avatar} payload
   * @returns
   */
  editAccount(payload) {
    return axiosClient(`account/edit`, {
      method: 'POST',
      data: payload,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   *
   * @param {old_password, password, password_confirmation} payload
   * @returns
   */
  changePassword(payload) {
    return axiosClient.post(`account/ubah-password`, payload)
  },

  /**
   *
   * @param {token} payload
   * @returns
   */
  verifyToken(payload) {
    return axiosClient.get(`auth/verify-token?token=${payload?.token}`)
  },

  /**
   *
   * @param {id, token, password, password_confirmation} payload
   * @returns
   */
  aktivasiToken(payload) {
    return axiosClient.post('auth/verify-token', payload)
  }
}
