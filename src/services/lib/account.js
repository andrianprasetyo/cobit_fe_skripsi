import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @returns object
   */
  getMyAccount() {
    return axiosClient.post('account/me')
  }
}
