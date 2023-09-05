import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {limit, page, search, sortBy, sortType} payload
   * @returns
   */
  getListOrganisasi(payload) {
    return axiosClient.get(
      `organisasi/list?limit=${payload?.limit || 10}&page=${payload?.page || 1}${
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
  getDetailOrganisasi(payload) {
    return axiosClient.get(`organisasi/detail/${payload?.id}`)
  },

  /**
   *
   * @param {nama, deskripsi, divisi_jabatan} payload
   * @returns
   */
  createOrganisasi(payload) {
    return axiosClient.post(`organisasi/add`, payload)
  },

  /**
   *
   * @param {id, nama, deskripsi} payload
   * @returns
   */
  editOrganisasi(payload) {
    return axiosClient.put(`organisasi/edit/${payload?.id}`, payload)
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  deleteOrganisasi(payload) {
    return axiosClient.delete(`organisasi/remove/${payload?.id}`)
  },

  /**
   *
   * @param {limit, page, search, sortBy, sortType, organisasi_id} payload
   * @returns
   */
  getListDivisi(payload) {
    return axiosClient.get(
      `organisasi-divisi/list?limit=${payload?.limit || 10}&page=${
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
   * @param {nama, jenis, organisasi_id} payload
   * @returns
   */
  createDivisi(payload) {
    return axiosClient.post(`organisasi-divisi/add`, payload)
  },

  /**
   *
   * @param {id, nama} payload
   * @returns
   */
  editDivisi(payload) {
    return axiosClient.put(`organisasi-divisi/edit/${payload?.id}`, payload)
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  deleteDivisi(payload) {
    return axiosClient.delete(`organisasi-divisi/remove/${payload?.id}`)
  },

  /**
   *
   * @param {limit, page, search, sortBy, sortType, organisasi_id} payload
   * @returns
   */
  getListJabatan(payload) {
    return axiosClient.get(
      `organisasi-jabatan/list?limit=${payload?.limit || 10}&page=${payload?.page || 1}${
        payload?.organisasi_id ? `&organisasi_id=${payload?.organisasi_id}` : ''
      }${
        payload?.organisasi_divisi_id
          ? `&organisasi_divisi_id=${payload?.organisasi_divisi_id}`
          : ''
      }${payload?.search ? `&search=${payload?.search}` : ''}${
        payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''
      }${payload?.sortType ? `&sortType=${payload?.sortType}` : ''}`
    )
  },

  /**
   *
   * @param {nama, jenis, organisasi_id, organisasi_divisi_id} payload
   * @returns
   */
  createJabatan(payload) {
    return axiosClient.post(`organisasi-jabatan/add`, payload)
  },

  /**
   *
   * @param {id, nama, organisasi_divisi_id} payload
   * @returns
   */
  editJabatan(payload) {
    return axiosClient.put(`organisasi-jabatan/edit/${payload?.id}`, payload)
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  deleteJabatan(payload) {
    return axiosClient.delete(`organisasi-jabatan/remove/${payload?.id}`)
  }
}
