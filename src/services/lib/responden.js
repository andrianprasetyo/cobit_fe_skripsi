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
      `quisioner/responden/divisi/list?limit=${payload?.limit || 10}&page=${
        payload?.page || 1
      }&organisasi_id=${payload?.organisasi_id}${
        payload?.search ? `&search=${payload?.search}` : ''
      }${payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''}${
        payload?.sortType ? `&sortType=${payload?.sortType}` : ''
      }`
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
  }
}
