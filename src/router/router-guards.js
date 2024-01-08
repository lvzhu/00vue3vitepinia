import setTitle from '@/utils/setTitle'
import { getUid } from '@/utils/getUserInfo'
import { useUserStore } from '@/store/modules/user'
import { showToast } from 'vant'
// import { getVideoStatus } from '@/api'

const worker = new Worker(new URL('../utils/setTitle.js', import.meta.url), {
  type: 'module'
})
console.log(worker)
const whitePathList = ['/login']
// 校验医生站登录
async function checkYSZLogin (isLogin) {
  // 未获取标识跳过
  console.log('tempJSInteractionFlag')
  if (location.href.indexOf('tempJSInteractionFlag') < 0) {
    return false
  }
  try {
    console.log('获取uid')
    let uid
    try {
      uid = await getUid()
    } catch (error) {
      uid = null
    }
    console.log('uid:', uid)
    if (!uid || uid === -1) {
      if (isLogin) {
        console.log('已登录')
        return true
      }
      window.location.replace(`${location.origin + location.pathname}#/login`)
      return false
    }
    const userStore = useUserStore()
    // 医生站登录
    await userStore.userLogin({ yxjUserId: uid, regSource: 6 })
    // 刷新登录信息
    await userStore.setInfo()
    return true
  } catch (error) {
    console.log(`医生站登录错误${error}`)
    if (isLogin) {
      // 已经登录
      console.log('已登录')
      return true
    }
    window.location.replace(`${location.origin + location.pathname}#/login`)
    return false
  }
}
export function createRouterGuards (router) {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    if (whitePathList.includes(to.path)) {
      next()
      return
    }
    // 医生站免登录
    if (await checkYSZLogin(userStore?.userInfo?.userId)) {
      next()
      return
    }
    if (!userStore.accessToken) {
      const redirectData = {
        path: '/login',
        replace: true
      }
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.fullPath
        }
      }
      next(redirectData)
      return
    }
    if (!userStore?.userInfo?.mobile) {
      await userStore.setInfo().then((data) => {
        /* userStore.setUserId(userInfo.userId)
          userStore.setUserInfo(data) */
        if (data.userType !== 'B' && !['/login', '/userInfo'].includes(to.path)) {
          showToast({
            message: '请完善信息',
            icon: 'info-o'
          })
          next('/userInfo')
        }
      })
      next()
      return
    }
    /* if (['/videoUpload', '/uploadView'].includes(to.path)) {
      await getVideoStatus().then((res) => {
        if (res?.data[0]?.auditStatus < 2) {
          showToast({
            message: '视频审核中，请您耐心等待',
            icon: 'info-o'
          })
          next('/')
        }
        if (res?.data[0]?.auditStatus === 2) {
          showToast({
            message: '您已上传视频',
            icon: 'info-o'
          })
          next('/')
        }
      })
    } */
    /* if (userStore.userInfo.userType !== 'B' && !['/login', '/userInfo'].includes(to.path)) {
      showToast({
        message: '请完善信息',
        icon: 'info-o'
      })
      next('/userInfo')
    } */
    next()
  })

  router.afterEach((to) => {
    setTitle(to?.meta?.title)
  })

  router.onError((error) => {
    console.log(error, '路由错误')
  })
}
