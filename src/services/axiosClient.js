import axios from 'axios'

import { getCookies } from '@/utils/cookies'
import { useToast } from '@/stores/toast'
import { useAuth } from '@/stores/auth'

const HOST = import.meta.env.VITE_HOST

const APP_ID = import.meta.env.VITE_APP_ID

const axiosClient = axios.create({
  baseURL: HOST,
  timeout: 1000 * 60, // 1 Minutes (60 x 1000)
  headers: {
    'APP-ID': APP_ID
  }
})

let pendingRequests = []

axiosClient.interceptors.request.use(
  (config) => {
    let source = axios.CancelToken.source()

    // Add the request to the pending requests array
    pendingRequests.push({ source, url: config.url })

    config.cancelToken = source.token

    const token = getCookies('token')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
  (response) => {
    pendingRequests.filter((req) => req.url != response.config.url)

    return response.data
  },
  async (error) => {
    pendingRequests.forEach((item) => {
      item.source.cancel(`${item?.url} Operation canceled`)

      return
    })

    const auth = useAuth()

    const toast = useToast()

    console.error('ERROR INTERCEPTORS', error)

    const messageTokenExpired = 'User tidak dikenal / Token has expired'

    const isNetworkError =
      error?.code === 'ERR_NETWORK' && error?.message?.includes('Network Error')

    const isTimeout = error?.code === 'ECONNABORTED' && error?.message.includes('timeout')

    // Check Network
    if (isNetworkError) {
      toast.topCenter({ title: 'Koneksi Error. Silahkan Cek Koneksi Anda' })
    }

    // Check Timeout
    if (isTimeout) {
      toast.topCenter({ title: 'Aplikasi terlalu lama merespon request' })
    }

    if (error?.response?.status === 401 && error?.response?.data?.message == messageTokenExpired) {
      auth.resetState()
      auth.redirectToLogin()

      // Kalau Maintenance
    } else if (error?.response?.status == 503) {
      toast.error({
        title: 'Aplikasi Sedang Maintenance',
        icon: 'AlertTriangleIcon',
        text: error?.response?.data?.message || 'Sistem kami sedang maintenance harap bersabar',
        variant: 'danger'
      })
    }

    return Promise.reject(error)
  }
)

export default axiosClient
