
/**
 1. 设置title，解决微信改不了title的bug
 */
export const setTitle = (title) => {
  document.title = title
  const userAgent = window.navigator.userAgent.toLowerCase()
  const isiOS = userAgent.indexOf('applewebkit') >= 0
  const isWechat = userAgent.indexOf('micromessenger') >= 0
  if (isiOS && isWechat) {
    const iframe = document.createElement('iframe')
    iframe.src = 'https://www.baidu.com/favicon.ico'
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    iframe.onload = function () {
      setTimeout(function () {
        iframe.remove()
      }, 0)
    }
  }
}
