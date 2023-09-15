import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {{limit: Number, page: Number, search: String, sortBy: String, sortType: String}} payload
   * @returns
   */
  getListDesignFactor(payload) {
    return axiosClient.get(
      `design-faktor/list?limit=${payload?.limit || 10}&page=${payload?.page || 1}${
        payload?.search ? `&search=${payload?.search}` : ''
      }${payload?.sortBy ? `&sortBy=${payload?.sortBy}` : ''}${
        payload?.sortType ? `&sortType=${payload?.sortType}` : ''
      }`
    )
  },

  /**
   *
   * @param {{id: String}} payload
   * @returns
   */
  getDetailDesignFactor(payload) {
    return axiosClient.get(`design-faktor/detail/${payload?.id}`)
  },

  /**
   *
   * @param {{kode: String, nama: String, deskripsi: String}} payload
   * @returns object
   */
  createDesignFactor(payload) {
    return axiosClient.post(`design-faktor/add`, payload)
  },

  /**
   *
   * @param {{id: String, nama: String, kode: String, deskripsi: String}} payload
   * @returns
   */
  editDesignFactor(payload) {
    return axiosClient.put(`design-faktor/edit/${payload?.id}`, payload)
  },

  /**
   *
   * @param {{id: String}} payload
   * @returns
   */
  deleteDesignFactor(payload) {
    return axiosClient.delete(`design-faktor/remove/${payload?.id}`)
  },

  /**
   *
   * @param {{df_kode: String, df_nama: String, df_deskripsi: String, question: String | Number, df_komponen: String | Number}} payload
   */
  createDesignFactorWithQuestionAndComponent(payload) {
    return axiosClient.post(`design-faktor/quisioner/add`, payload)
  },

  /**
   *
   * @param {{id: String}} payload
   * @returns
   */
  getQuestionAndComponentDesignFactor(payload) {
    return axiosClient.get(`design-faktor/quisioner/detail/${payload?.id}`)
  },

  /**
   *
   * @param {{id: String, question: String}} payload
   * @returns
   */
  editQuestionDesignFactor({ id, question }) {
    return axiosClient.put(`design-faktor/quisioner/edit/${id}`, { question })
  },

  /**
   *
   * @param {{id: String}} payload
   * @returns
   */
  deleteQuestionDesignFactor(payload) {
    return axiosClient.delete(`design-faktor/quisioner/remove/question/${payload?.id}`)
  },

  /**
   *
   * @param {{id: String, df_komponen: String}} payload
   * @returns
   */
  editKomponenDesignFactor({ id, df_komponen }) {
    return axiosClient.put(`design-faktor/quisioner/edit/${id}`, { df_komponen })
  },

  /**
   *
   * @param {{id: String}} payload
   * @returns
   */
  deleteKomponenDesignFactor(payload) {
    return axiosClient.delete(`design-faktor/quisioner/remove/komponen/${payload?.id}`)
  }
}
