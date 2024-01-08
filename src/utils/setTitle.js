/*
 * @Author: minqiuping <minqiuping@yxj.org.cn>
 * @version: 1.0.0
 * @Date: 2020-05-13 14:38:34
 * @LastEditTime: 2020-05-20 15:32:31
 * @LastEditors: minqiuping <minqiuping@yxj.org.cn>
 * @Descripttion:
 * @FilePath: \merch-amyxy-v4d:\project_vpn\asco\asco\src\utils\bridge\setTitle.js
 */
/* eslint-disable vars-on-top */
const userAgent = navigator.userAgent
const isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1
const isIOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
// const isWechat = /MicroMessenger/i.test(userAgent)
export default function setTitle (title) { // 设置标题  title：字符串
  try {
    if (isAndroid) {
      window.dsBridge.call('view.setBarTitle', JSON.stringify({ title }))
      window.dsBridge.call('view.hiddenTitleBar', JSON.stringify({ isHide: false }))
    } else if (isIOS) {
      window.webkit.messageHandlers.setTitle.postMessage({ title })
    } else {
      document.title = title
      document.getElementsByTagName('title')[0].innerText = title
    }
  } catch (error) {
    document.title = title
    document.getElementsByTagName('title')[0].innerText = title
  }
}
