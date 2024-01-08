import axios from 'axios'
import { showToast, showSuccessToast } from 'vant'
import { useUserStore } from '@/store/modules/user'
import { storage } from '@/utils/Storage'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const loadingInstance = {
  target: null,
  count: 0
}

/**
 * 关闭Loading层实例
 */
function closeLoading (options) {
  if (options.loading && loadingInstance.count > 0) loadingInstance.count--
  if (loadingInstance.count === 0) {
    loadingInstance.target.close()
    loadingInstance.target = null
  }
}

function createAxios (axiosConfig, options, loading) {
  const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL, // api的base_url
    timeout: 20000, // request timeout
    headers: {
      'Content-Type': options.formData ? 'application/x-www-form-urlencoded' : 'application/json'
    },
    // 跨域是否带Token
    withCredentials: true,
    // 响应的数据格式 json / blob /document /arraybuffer / text / stream
    responseType: 'json',
    // XSRF 设置
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
  })
  options = Object.assign(
    {
      CancelDuplicateRequest: false, // 是否开启取消重复请求, 默认为 true
      loading: false, // 是否开启loading层效果, 默认为false
      interceptors: true, // 是否需要拦截
      showErrorMessage: true, // 是否开启接口错误信息展示,默认为true
      showSuccessMessage: false // 是否开启code为1时的信息提示, 默认为false
    },
    options
  )
  // 请求拦截
  service.interceptors.request.use(
    (config) => {
      const userStore = useUserStore()
      config.headers.encrypt = userStore.accessToken
      // 创建loading实例
      if (options.loading) {
        loadingInstance.count++
        if (loadingInstance.count === 1) {
          loadingInstance.target = showToast({
            type: 'loading',
            overlay: true,
            forbidClick: true,
            duration: 0,
            ...loading
          })
        }
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
    */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
      if (options.interceptors === false) return response.data
      options.loading && closeLoading(options) // 关闭loading
      const res = response.data
      if (Number(res.code) === 1001001011) {
        showToast({
          message: '登录失效',
          icon: 'warning-o'
        })
        storage.remove(ACCESS_TOKEN)
        location.reload()
      }
      if (res.msg !== 'success') {
        showToast({
          message: res.msg,
          icon: 'warning-o'
        })
        return Promise.reject(new Error(res.msg || 'Error'))
      } else {
        if (options.showSuccessMessage) {
          showSuccessToast(res.msg)
        }
        return res
      }
    },
    error => {
      if (error && error.response) {
        const errors = new Map([
          [400, '错误请求'],
          [401, '未授权，请重新登录'],
          [403, '拒绝访问'],
          [404, '请求接口未找到'],
          [405, '请求方法未允许'],
          [408, '请求超时'],
          [500, '服务器端出错'],
          [501, '网络未实现'],
          [502, '网络错误'],
          [503, '服务不可用'],
          [504, '网络超时'],
          [505, 'http版本不支持该请求']
        ])
        error.message = errors.get(error.response.status) || `连接错误${error.response.status}`
      } else {
        error.message = '连接到服务器失败'
      }
      console.log(error.response.status)
      options.loading && closeLoading(options) // 关闭loading
      showToast({
        message: error.message,
        icon: 'warning-o'
      })
      return Promise.reject(error)
    }
  )
  return service(axiosConfig)
}

export default {
  post (url, data, options, loadingConfig) {
    console.log('get request url', url)
    return createAxios({
      method: 'post',
      url,
      data
    },
    {
      ...options
    },
    {
      message: '加载中...',
      forbidClick: true,
      ...loadingConfig
    })
  },
  get (url, data, options, loadingConfig) {
    console.log('get request url', url)
    return createAxios({
      method: 'get',
      url,
      params: data
    },
    {
      ...options
    },
    {
      message: '加载中...',
      forbidClick: true,
      ...loadingConfig
    })
  }
}
