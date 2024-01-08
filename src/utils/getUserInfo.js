import CryptoJS from 'crypto-js'

const u = navigator.userAgent
const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

/* ios 则为获取用户的基础信息 */
function getAppBaseInfo () {
  if (isIOS) {
    // 检测是已创建script
    const getAppBaseInfoScript = document.getElementById('IOS_getAppBaseInfo')

    if (getAppBaseInfoScript) {
      document.body.removeChild(getAppBaseInfoScript)
      const scripAppBaseInfo = document.createElement('script')
      scripAppBaseInfo.id = 'IOS_getAppBaseInfo'
      scripAppBaseInfo.innerHTML =
        'try {window.webkit.messageHandlers.getAppBaseInfo.postMessage({});}catch(e){}'

      document.body.appendChild(scripAppBaseInfo)
    } else {
      const scripAppBaseInfo = document.createElement('script')
      scripAppBaseInfo.id = 'IOS_getAppBaseInfo'
      scripAppBaseInfo.innerHTML =
        'try{window.webkit.messageHandlers.getAppBaseInfo.postMessage({});}catch(e){}'

      document.body.appendChild(scripAppBaseInfo)
    }
  }
}
/** 给ios 的回调 */
function AppBaseInfoSave (cb) {
  window.receivedAppBaseInfo = function (result) {
    console.log('ios 的回调')
    if (cb) {
      cb(result)
    }
  }
}
async function waitGetIOSUid (paramFunc) {
  return new Promise(resolve => {
    paramFunc((...result) => {
      resolve(result)
    })

    // 设置5秒超时时间
    setTimeout(() => {
      resolve(null)
    }, 2000)
  })
}

// 解密
function decodeFuc (obj) {
  const key = CryptoJS.enc.Utf8.parse('2015020120200131')
  // obj = CryptoJS.enc.Base64.stringify(obj);
  const decodeAes = CryptoJS.AES.decrypt(obj, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8)
  return decodeAes
}

async function getUid () {
  // return dsBridge.call('user.getUid')
  if (isAndroid) {
    // console.log(window.dsBridge.call('user.getUid'))
    return Promise.resolve(window.dsBridge.call('user.getUid'))
    // return Promise.resolve(1234);
  }
  if (isIOS) {
    getAppBaseInfo()
    const obj = await waitGetIOSUid(AppBaseInfoSave)
    const iosCallbackInfo = decodeURIComponent(obj)
    const localInfo = JSON.parse(decodeFuc(iosCallbackInfo))
    return Promise.resolve(localInfo.uid)
  }
  return Promise.resolve(null)
}

export { getUid }
export default getUid
