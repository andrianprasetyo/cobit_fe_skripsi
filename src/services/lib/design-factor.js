import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {limit, page, search, sortBy, sortType} payload
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
   * @param {id} payload
   * @returns
   */
  getDetailDesignFactor(payload) {
    return axiosClient.get(`design-faktor/detail/${payload?.id}`)
  },

  /**
   *
   * @param {kode, nama, deskripsi} payload
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
  },

  /**
   *
   * @param {df_kode, df_nama, df_deskripsi, question, df_komponen} payload
   */
  createDesignFactorWithQuestionAndComponent(payload) {
    return axiosClient.post(`design-faktor/quisioner/add`, payload)
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  getQuestionAndComponentDesignFactor(payload) {
    return axiosClient.get(`design-faktor/quisioner/detail/${payload?.id}`)
  },

  /**
   *
   * @param {id, question} payload
   * @returns
   */
  editQuestionDesignFactor({ id, question }) {
    return axiosClient.put(`design-faktor/quisioner/edit/${id}`, { question })
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  deleteQuestionDesignFactor(payload) {
    return axiosClient.delete(`design-faktor/quisioner/remove/question/${payload?.id}`)
  },

  /**
   *
   * @param {id, df_komponen} payload
   * @returns
   */
  editKomponenDesignFactor({ id, df_komponen }) {
    return axiosClient.put(`design-faktor/quisioner/edit/${id}`, { df_komponen })
  },

  /**
   *
   * @param {id} payload
   * @returns
   */
  deleteKomponenDesignFactor(payload) {
    return axiosClient.delete(`design-faktor/quisioner/remove/komponen/${payload?.id}`)
  }
}
