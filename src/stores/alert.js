import { defineStore } from 'pinia'

import Swal from 'sweetalert2'

export const useAlert = defineStore({
  id: 'alert',
  actions: {
    /**
     *
     * @param {title, icon, showCloseButton, showCancelButton, confirmButtonText, cancelButtonText} payload
     * @returns Promise
     */
    success(payload) {
      return Swal.fire({
        title: payload.title,
        icon: payload.icon || 'success',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonColor: '#203058',
        confirmButtonText: payload?.confirmButtonText || 'Ya!',
        cancelButtonText: payload?.cancelButtonText || 'Batalkan',
        ...payload
      })
    },

    /**
     *
     * @param {title, icon, showCloseButton, showCancelButton, confirmButtonText, cancelButtonText} payload
     * @returns Promise
     */
    info(payload) {
      return Swal.fire({
        title: payload.title,
        icon: payload.icon || 'info',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonColor: '#203058',
        confirmButtonText: payload?.confirmButtonText || 'Ya!',
        cancelButtonText: payload?.cancelButtonText || 'Batalkan',
        ...payload
      })
    },

    /**
     *
     * @param {title, text} payload
     * @returns
     */
    loading(payload) {
      return Swal.fire({
        title: payload?.title || 'Loading',
        text: payload?.text || 'Harap Tunggu...',
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        },
        willClose: () => {
          Swal.hideLoading()
        }
      })
    },

    /**
     *
     * @returns Promise
     */
    instance() {
      return Swal
    }
  }
})
