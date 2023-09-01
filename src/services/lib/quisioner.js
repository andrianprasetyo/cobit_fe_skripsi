import axiosClient from '@/services/axiosClient'

export default {
  /**
   *
   * @param {code} payload
   * @returns
   */
  getDetailQuisionerRespondenByCode(payload) {
    return axiosClient.get(`quisioner/responden/detail?code=${payload?.code}`)
  },

  /**
   *
   * @param {id, nama, divisi, jabatan} payload
   * @returns
   */
  saveResponden(payload) {
    return axiosClient.post(`quisioner/responden/save`, payload)
  },

  /**
   *
   * @param {id, question} payload.id
   * @returns
   */
  getListQuestion(payload) {
    return axiosClient.get(`quisioner/responden/list/${payload?.id}?question=${payload?.question}`)
  },

  /**
   *
   * @param {assessment_id, responden_id} payload
   * @returns
   */
  getNavigationQuestion(payload) {
    return axiosClient.get(
      `quisioner/responden/navigation/list?assesment_id=${payload?.assesment_id}&responden_id=${payload?.responden_id}`
    )
  },

  /**
   *
   * @param {hasil} payload
   * @returns
   */
  saveJawaban(payload) {
    return axiosClient.post(`quisioner/responden/save-jawaban`, payload)
  },

  /**
   *
   * @param {assesment_user_id} payload
   * @returns
   */
  finishQuisioner(payload) {
    return axiosClient.post(`quisioner/responden/finish`, payload)
  }
}
