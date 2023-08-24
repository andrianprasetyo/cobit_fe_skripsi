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
  }
}
