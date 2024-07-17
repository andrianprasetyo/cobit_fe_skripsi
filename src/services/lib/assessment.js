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
   * @param {{assesment_id: String, organisasi_id: String, users: Array}} payload
   * @returns
   */
  invitePic(payload) {
    return axiosClient.post(`assesment/pic/invite`, payload)
  },

  /**
   *
   * @param {{id: String}} payload
   * @returns
   */
  deletePic(payload){
    return axiosClient.delete(`assesment/remove-pic/${payload?.id}`)
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
   * @param {{id: String, organisasi_id: String}} payload
   * @returns
   */
  editOrganisasi(payload) {
    return axiosClient.put(`assesment/org/${payload?.id}/change`, payload)
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
      },
      timeout: 3000 * 60 // 3 Minutes (60 x 3000)
    })
  },

  /**
   *
   * @param {{parent_id: String, assessment_id: String}} payload
   * @returns
   */
  getHistoryLaporan(payload) {
    return axiosClient.get(
      `assesment/docs/list?parent_id=${payload?.parent_id}&assesment_id=${payload?.assessment_id}`
    )
  },

  /**
   *
   * @param {{id: String}} payload
   * @returns
   */
  deleteLaporan(payload) {
    return axiosClient.delete(`assesment/docs/remove/${payload?.id}`)
  },

  /**
   *
   * @param {{assessment_id: String}} payload
   * @returns
   */
  getListLaporan(payload) {
    return axiosClient.get(`assesment/docs/list?assesment_id=${payload?.assessment_id}`)
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
  getReportChartLegacyAssessment(payload) {
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
   * @param {{limit: Number | String, page: Number | String, search: String, sortBy: String, sortType: String, assesment_id: String}} payload
   * @returns
   */
  getReportChartAssessment(payload) {
    return axiosClient.get(
      `assesment/report/chart/all-target?limit=${payload?.limit || 10}&page=${payload?.page || 1}${
        payload?.search ? `&search=${payload?.search}` : ''
      }${payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''}${
        payload?.sortType ? `&sortType=${payload?.sortType}` : ''
      }${payload?.assesment_id ? `&assesment_id=${payload?.assesment_id}` : ''}${
        payload?.target ? `&target=${payload?.target}` : ''
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
        payload?.capability_target
          ? `&capability_target_id=${payload?.capability_target_id}`
          : ''
      }${
        payload?.capability_assesment_id
          ? `&capability_assesment_id=${payload?.capability_assesment_id}`
          : ''
      }`
    )
  },

  /**
   *
   * @param {{assesment_id: String}} payload
   * @returns
   */
  getDashboardAssessment(payload) {
    return axiosClient.get(`dashboard/assesment/report?assesment_id=${payload?.assesment_id}`)
  },

  /**
   *
   * @param {{assesment_id: String, step: Number}} payload
   * @returns
   */
  recalculateAssessment(payload) {
    return axiosClient.post(`assesment/manual-kalkulasi`, payload)
  },
}
