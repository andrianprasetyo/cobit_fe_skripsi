import { defineStore } from 'pinia'

import axios from 'axios'

import ToastificationContent from '@/components/Toastification/ToastificationContent.vue'

import { useToast as useBaseToast } from 'vue-toastification'

const toast = useBaseToast()

export const useToast = defineStore({
  id: 'toast',
  actions: {
    success(payload) {
      toast(
        {
          component: ToastificationContent,
          props: {
            title: payload.title,
            icon: payload.icon || 'CircleCheckFilledIcon',
            text: payload.text,
            variant: payload.variant || 'success'
          }
        },
        {
          toastClassName: 'bg-primary'
        }
      )
    },

    info(payload) {
      toast.info(
        {
          component: ToastificationContent,
          props: {
            title: payload.title,
            icon: payload.icon || 'InfoCircleFilledIcon',
            text: payload.text,
            variant: payload.variant || 'info'
          }
        },
        {
          toastClassName: 'bg-info'
        }
      )
    },

    error(payload) {
      const isCanceled = axios.isCancel(payload?.error)

      const isTimeout =
        payload?.error?.code === 'ECONNABORTED' && payload?.error?.message.includes('timeout')

      const isNetworkError =
        payload?.error?.code === 'ERR_NETWORK' && payload?.error?.message?.includes('Network Error')

      if (!isCanceled && !isTimeout && !isNetworkError) {
        if (
          payload?.error?.response &&
          payload?.error?.response?.status !== 404 &&
          payload?.error?.response?.status !== 401
        ) {
          toast.error(
            {
              component: ToastificationContent,
              props: {
                title: payload.title || 'Terjadi Kesalahan',
                icon: payload.icon || 'AlertTriangleFilledIcon',
                text:
                  payload?.text ||
                  payload.title ||
                  payload?.error?.response?.data?.message ||
                  payload?.error?.message,
                variant: payload.variant || 'danger'
              }
            },
            {
              toastClassName: 'bg-danger'
            }
          )
        } else if (!isNetworkError) {
          if (payload?.error?.response?.status && payload?.error?.response?.status >= 500) {
            toast.error({
              component: ToastificationContent,
              props: {
                title: 'Terjadi Kesalahan',
                icon: 'AlertTriangleIcon',
                text: 'Oops.. Terjadi kesalahan pada sistem kami',
                variant: 'danger'
              }
            })
          } else {
            toast.error(
              {
                component: ToastificationContent,
                props: {
                  title: payload.title || 'Terjadi Kesalahan',
                  icon: payload.icon || 'AlertTriangleFilledIcon',
                  text:
                    payload?.text ||
                    payload.title ||
                    payload?.error?.response?.data?.message ||
                    payload?.error?.message,
                  variant: payload.variant || 'danger'
                }
              },
              {
                toastClassName: 'bg-danger'
              }
            )
          }
          throw payload?.error
        }
      }
    },

    topCenter(payload) {
      toast(payload.title || 'Terjadi Kesalahan', {
        toastClassName: 'bg-dark',
        timeout: false,
        position: 'top-center',
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: 'button',
        icon: true,
        rtl: false
      })
    }
  }
})
