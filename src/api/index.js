import request from '@/utils/request'
import { useUserStore } from '@/store/modules/user'

const baseData = () => {
  const store = useUserStore()
  // 接口公共数据
  return {
    areaCode: store.userInfo.areaCode,
    companyCode: store.userInfo.companyCode,
    userId: store.userInfo.userId
  }
}
/**
 * @description: 获取验证码
 */

export function getVerificationCode (query) {
  return request.post('/common/getVerificationCode', query, { formData: true })
}

/**
 * @description: 用户登录
 */
export function login (query) {
  const store = useUserStore()
  return request.post('/accounts/login', {
    ...baseData(),
    openId: store.userInfo.openId,
    ...query
  })
}

/**
 * @description: 获取科室，职称列表
 */
export function getPositionList () {
  return request.post('/query/common/city/list', {
    ...baseData()
  })
}

/**
 * @description: 获取医院列表
 */
export function getHospitalList () {
  return request.get('/perfect/hospital/list', {
    ...baseData()
  })
}

/**
 * @description: 获取用户基本信息
 */
export function getUserBaseInfo (query) {
  return request.post('/accounts/mobile/base/info', {
    ...baseData(),
    ...query
  })
}

/**
 * @description: 用户基本信息保存
 */
export function saveUserBaseInfo (query) {
  return request.post('/accounts/mobile/realname', {
    ...baseData(),
    ...query
  })
}

/**
 * @description: 首页视频列表
 */
export function getVideoList (query) {
  return request.post('/zl/video/qxdb/list', {
    ...baseData(),
    ...query
  })
}

/**
 * @description: 文件上传获取七牛云token
 */
export function getQiNiuToken () {
  return request.get('/upload/token/video/get', {}, { interceptors: false })
}

/**
 * @description: 获取视频上传状态
 */
export function getVideoStatus () {
  return request.get('/perfect/user/video/list', {
    ...baseData()
  })
}

/**
 * @description: 首页视频列表
 */
export function videoSave (query) {
  return request.post('/perfect/user/video/save', {
    ...baseData(),
    ...query
  })
}

/**
 * @description: 视频详情
 */
export function getVideoInfo (query) {
  return request.post('/query/video/code/info', {
    ...baseData(),
    ...query
  })
}

/**
 * @description: 埋点上报
 */
export function report (query) {
  return request.post('/common/report/global/save', {
    ...baseData(),
    browser: window.location.href,
    deviceTime: new Date(),
    appVersion: navigator.userAgent,
    ...query
  })
}

/**
 * @description: 添加预约录制
 */
export function addAppointment (query) {
  return request.post('/appointment/add', {
    ...baseData(),
    ...query
  })
}

/**
 * @description: 判断用户是否已经预约录制
 */
export function checkAppointment (query) {
  return request.get('/appointment/user/check', {
    ...baseData(),
    ...query
  })
}

/**
 * @description: 预约记录
 */
export function appointmentList (query) {
  const store = useUserStore()
  return request.get('/appointment/list', {
    userId: store.userInfo.userId,
    ...query
  })
}

/**
 * @description: 判断版权审核白名单
 */
export function copyrightCheck (query) {
  const store = useUserStore()
  return request.get('/copyright/whitelist/check', {
    userId: store.userInfo.userId,
    ...query
  })
}

/**
 * @description: 判断版权审核白名单
 */
export function applyCopyrightApi (query) {
  return request.post('/copyright/apply', {
    ...baseData(),
    ...query
  })
}

/**
 * @description: 版权记录
 */
export function copyrightListApi (query) {
  const store = useUserStore()
  return request.get('/copyright/list', {
    userId: store.userInfo.userId,
    ...query
  })
}

/**
 * @description: 视频详情
 */
export function getVideoDetail (query) {
  return request.get('/video/audit/detail', {
    ...baseData(),
    ...query
  })
}
