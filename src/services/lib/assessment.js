import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {limit, page, search, sortBy, sortType} payload
   * @returns
   */
  getListAssessment(payload) {
    return axiosClient.get(
      `assesment/list?limit=${payload?.limit || 10}&page=${payload?.page || 1}${
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
  getDetailAssessment(payload) {
    return axiosClient.put(`assessment/detail/${payload?.id}`)
  },

  /**
   *
   * @param {asessment, deskripsi, tahun, pic_nama, pic_email, pic_divisi, pic_jabatan, organisasi_id, organisasi_nama, organisasi_deskripsi} payload
   * @returns
   */
  createAssessment(payload) {
    return axiosClient.post(`assesment/add`, payload)
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  deleteAssessment(payload) {
    return axiosClient.delete(`assesment/remove/${payload?.id}`)
  }
}