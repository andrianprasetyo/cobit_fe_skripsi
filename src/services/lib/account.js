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
    return axiosClient.post(`account/edit`, payload)
  },

  /**
   * 
   * @param {old_password, password, password_confirmation} payload 
   * @returns 
   */
  changePassword(payload){
    return axiosClient.post(`account/ubah-password`, payload)
  }
}
