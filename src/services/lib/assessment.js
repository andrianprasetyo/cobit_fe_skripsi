import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {{limit: String | Number, page : String | Number, search: String, sortBy: String, sortType: String, organisasi_id: String}} payload
   * @returns
   */
  getListAssessment(payload) {
    return axiosClient.get(
      `assesment/list?limit=${payload?.limit || 10}&page=${payload?.page || 1}${
        payload?.search ? `&search=${payload?.search}` : ''
      }${payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''}${
        payload?.sortType ? `&sortType=${payload?.sortType}` : ''
      }${payload?.organisasi_id ? `&organisasi_id=${payload?.organisasi_id}` : ''}`
    )
  },

  /**
   *
   * @param {id: String} payload
   * @returns
   */
  getDetailAssessment(payload) {
    return axiosClient.get(`assesment/detail/${payload?.id}`)
  },

  /**
   *
   * @param {{asessment: String, deskripsi: String, tahun: String, pic_nama: String, pic_email: String, pic_divisi: String, pic_jabatan: String, organisasi_id: String, organisasi_nama: String, organisasi_deskripsi: String, pic_divisi_id: String, pic_jabatan_id : String}} payload
   * @returns
   */
  createAssessment(payload) {
    return axiosClient.post(`assesment/add`, payload)
  },

  /**
   *
   * @param {id: String, asessment: String, deskripsi: String} payload
   * @returns
   */
  editAssessment(payload) {
    return axiosClient.put(`assesment/edit/${payload?.id}`, payload)
  },

  /**
   *
   * @param {{id: String}} payload
   * @returns
   */
  deleteAssessment(payload) {
    return axiosClient.delete(`assesment/remove/${payload?.id}`)
  },

  /**
   *
   * @param {{id: String, email: String}} payload
   * @returns
   */
  inviteResponden(payload) {
    return axiosClient.post(`assesment/responden/invite`, payload)
  },

  /**
   *
   * @param {{id: String, file: Object | BinaryData}} data
   * @returns
   */
  inviteRespondenByExcel(data) {
    return axiosClient('assesment/responden/invite-by-excel', {
      method: 'POST',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   *
   * @param {{id: String, status: String}} payload
   * @returns
   */
  setStatusAssessment(payload) {
    return axiosClient.put(`assesment/set-status/${payload?.id}`, payload)
  },

  /**
   *
   * @param {{pic_nama: String, pic_email: String, pic_divisi: String, pic_jabatan: String}} payload
   * @returns
   */
  editPic(payload) {
    return axiosClient.put(`assesment/pic/edit/${payload?.id}`, payload)
  },

  /**
   *
   * @param {{id: String, expire_at: String}} payload
   * @returns
   */
  editTanggalKadaluarsaPic(payload) {
    return axiosClient.put(`assesment/pic/expire/${payload?.id}`, payload)
  },

  /**
   *
   * @param {{id: String, docs: String}} payload
   * @returns
   */
  uploadLaporan(payload) {
    return axiosClient(`assesment/upload/report`, {
      method: 'POST',
      data: payload,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   *
   * @param {{limit: Number | String, page: Number | String, search: String, sortBy: String, sortType: String, assesment_id: String}} payload
   * @returns
   */
  getReportAssessment(payload) {
    return axiosClient.get(
      `assesment/report/list?limit=${payload?.limit || 10}&page=${payload?.page || 1}${
        payload?.search ? `&search=${payload?.search}` : ''
      }${payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''}${
        payload?.sortType ? `&sortType=${payload?.sortType}` : ''
      }${payload?.assesment_id ? `&assesment_id=${payload?.assesment_id}` : ''}${
        payload?.target_id ? `&target_id=${payload?.target_id}` : ''
      }${payload?.domain_id ? `&domain_id=${payload?.domain_id}` : ''}`
    )
  },

  /**
   *
   * @param {{limit: Number | String, page: Number | String, search: String, sortBy: String, sortType: String, assesment_id: String}} payload
   * @returns
   */
  getReportChartAssessment(payload) {
    return axiosClient.get(
      `assesment/report/chart?limit=${payload?.limit || 10}&page=${payload?.page || 1}${
        payload?.search ? `&search=${payload?.search}` : ''
      }${payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''}${
        payload?.sortType ? `&sortType=${payload?.sortType}` : ''
      }${payload?.assesment_id ? `&assesment_id=${payload?.assesment_id}` : ''}${
        payload?.target_id ? `&target_id=${payload?.target_id}` : ''
      }${payload?.domain_id ? `&domain_id=${payload?.domain_id}` : ''}`
    )
  },

  /**
   *
   * @param {{domain_id: String, assesment_id: String}} payload
   * @returns
   */
  getReportDetailOFIAssessment(payload) {
    return axiosClient.get(
      `assesment/report/detail-ofi?domain_id=${payload?.domain_id}&assesment_id=${
        payload?.assesment_id
      }${
        payload?.capability_target_id
          ? `&capability_target_id=${payload?.capability_target_id}`
          : ''
      }`
    )
  }
}
