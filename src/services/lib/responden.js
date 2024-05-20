import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {limit, page, search, sortBy, sortType, assesment_id} payload
   * @returns
   */
  getListResponden(payload) {
    return axiosClient.get(
      `responden/list?limit=${payload?.limit || 10}&page=${payload?.page || 1}${
        payload?.search ? `&search=${payload?.search}` : ''
      }${payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''}${
        payload?.sortType ? `&sortType=${payload?.sortType}` : ''
      }${payload?.assesment_id ? `&assesment_id=${payload?.assesment_id}` : ''}`
    )
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  deleteResponden(payload) {
    return axiosClient.delete(`responden/remove/${payload?.id}`)
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  reinviteResponden(payload) {
    return axiosClient.put(`assesment/responden/reinvite/${payload?.id}`)
  },

  /**
   *
   * @param {limit, page, search, sortBy, sortType, organisasi_id} payload
   * @returns
   */
  getListDivisi(payload) {
    return axiosClient.get(
      `quisioner/responden/divisi/list?limit=${payload?.limit || 10}&page=${payload?.page || 1}${
        payload?.organisasi_id ? `&organisasi_id=${payload?.organisasi_id}` : ''
      }${payload?.search ? `&search=${payload?.search}` : ''}${
        payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''
      }${payload?.sortType ? `&sortType=${payload?.sortType}` : ''}`
    )
  },

  /**
   *
   * @param {limit, page, search, sortBy, sortType, divisi_id} payload
   * @returns
   */
  getListJabatan(payload) {
    return axiosClient.get(
      `quisioner/responden/jabatan/list?limit=${payload?.limit || 10}&page=${
        payload?.page || 1
      }&divisi_id=${payload?.divisi_id}${payload?.search ? `&search=${payload?.search}` : ''}${
        payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''
      }${payload?.sortType ? `&sortType=${payload?.sortType}` : ''}`
    )
  },

  /**
   *
   * @param {{assesment_id: String, assesment_users_id: String}} payload
   * @returns
   */
  getResultKuesioner(payload) {
    const assesmentIdParam = payload?.assesment_id ? `?assesment_id=${payload?.assesment_id}` : ''
    const assesmentUsersIdParam = payload?.assesment_users_id
      ? `?assesment_users_id=${payload?.assesment_users_id}`
      : ''

    return axiosClient.get(`responden/quisioner/list${assesmentIdParam}${assesmentUsersIdParam}`)
  },

  /**
   *
   * @param {{assesment_id: String, assesment_user_id: Array}} payload
   * @return
   */
  setProcessedKuesioner(payload) {
    return axiosClient.put(`quisioner/responden/update-all`, payload)
  }
}
