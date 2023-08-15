import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {limit, page, search, sortBy, sortType} payload
   * @returns
   */
  getListDesignFactor(payload) {
    return axiosClient.get(
      `design-faktor/list?limit=${payload?.limit || 10}&page=${payload?.page || 0}${
        payload?.search ? `&search=${payload?.search}` : ''
      }${payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''}${
        payload?.sortType ? `&sortType=${payload?.sortType}` : ''
      }`
    )
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  getDetailDesignFactor(payload) {
    return axiosClient.get(`design-faktor/detail/${payload?.id}`)
  },

  /**
   *
   * @param {nama, kode, deskripsi} payload
   * @returns object
   */
  createDesignFactor(payload) {
    return axiosClient.post(`design-faktor/add`, payload)
  },

  /**
   *
   * @param {id, nama, kode, deskripsi} payload
   * @returns
   */
  editDesignFactor(payload) {
    return axiosClient.put(`design-faktor/edit/${payload?.id}`, payload)
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  deleteDesignFactor(payload) {
    return axiosClient.delete(`design-faktor/remove/${payload?.id}`)
  }
}
