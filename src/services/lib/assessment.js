import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {limit, page, search, sortBy, sortType, organisasi_id} payload
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
   * @param {id} payload
   * @returns
   */
  getDetailAssessment(payload) {
    return axiosClient.get(`assesment/detail/${payload?.id}`)
  },

  /**
   *
   * @param {asessment, deskripsi, tahun, pic_nama, pic_email, pic_divisi, pic_jabatan, organisasi_id, organisasi_nama, organisasi_deskripsi, pic_divisi_id, pic_jabatan_id} payload
   * @returns
   */
  createAssessment(payload) {
    return axiosClient.post(`assesment/add`, payload)
  },

  /**
   *
   * @param {id, asessment, deskripsi} payload
   * @returns
   */
  editAssessment(payload) {
    return axiosClient.put(`assesment/edit/${payload?.id}`, payload)
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  deleteAssessment(payload) {
    return axiosClient.delete(`assesment/remove/${payload?.id}`)
  },

  /**
   *
   * @param {id, email} payload
   * @returns
   */
  inviteResponden(payload) {
    return axiosClient.post(`assesment/responden/invite`, payload)
  },

  /**
   *
   * @param {id, file} data
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
   * @param {id, status} payload
   * @returns
   */
  setStatusAssessment(payload) {
    return axiosClient.put(`assesment/set-status/${payload?.id}`, payload)
  },

  /**
   *
   * @param {pic_nama, pic_email, pic_divisi, pic_jabatan} payload
   * @returns
   */
  editPic(payload) {
    return axiosClient.put(`assesment/pic/edit/${payload?.id}`, payload)
  },

  /**
   *
   * @param {id, docs} payload
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
   * @param {limit, page, search, sortBy, sortType, assesment_id} payload
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
   * @param {domain_id, assesment_id} payload
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
