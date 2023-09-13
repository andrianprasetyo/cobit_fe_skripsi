import axiosClient from '@/services/axiosClient'

export default {
  /**
   * @param {limit, page, assesment_id, search} payload
   * @returns
   */
  getListMediaRepository(payload) {
    return axiosClient.get(
      `repository/list?limit=${payload?.limit || 10}&page=${payload?.page || 1}${
        payload?.assesment_id ? `&assesment_id=${payload?.assesment_id}` : ''
      }${payload?.search ? `&search=${payload?.search}` : ''}`
    )
  },

  /**
   *
   * @param {assesment_id, docs, deskripsi} payload
   * @returns
   */
  createMediaRepository(payload) {
    return axiosClient(`repository/add`, {
      method: 'POST',
      data: payload,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  getDetailMediaRepository(payload) {
    return axiosClient.get(`repository/detail/${payload?.id}`)
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  deleteMediaRepository(payload) {
    return axiosClient.delete(`repository/remove/${payload?.id}`)
  }
}
