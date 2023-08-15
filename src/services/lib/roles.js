import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   *
   * @returns Array
   */
  getListRoles() {
    return axiosClient.get('roles/list')
  }
}
