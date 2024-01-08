/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// import Vue from 'vue';
import axios from 'axios'
import { getUrlParam } from './common'
import enCode from './encode' // AES
import createUuid from './uuid' // uuid
export default function share (info) {
  function getJsTiket (encrypt) {
    const platform = getUrlParam('platform')
    const data = {
      body: {
        encrypt,
        appid: 'wx1a9e2a8d86b3c7ee',
        url: window.location.href.split('#')[0]
      },
      brand: platform || 'web',
      guid: createUuid(),
      model: platform || 'web',
      platform: platform || 'web',
      sysVersion: '7.1.1',
      time: parseInt((+new Date() / 1000).toString(), 10),
      uid: '',
      version: '1.2.2',
      isJailBreak: false,
      isSimulator: false,
      session: ''
    }
    console.log(data, 'data-----')
    return axios({
      method: 'post',
      url: 'https://api.yishengzhan.cn/gw/wechat/getJsticket',
      data: enCode.encodeFunc(data)
    })
  }
  const userAgent = navigator.userAgent

  if (/MicroMessenger/i.test(userAgent)) {
    getJsTiket('').then(res => {
      const data = JSON.parse(enCode.decodeFuc(res.data.data))

      console.log(data, '-------------res')
      // const signParams = Object.assign({}, res.data.data, {
      const signParams = Object.assign({}, data.body, {
        debug: false,
        jsApiList: [
          'onMenuShareAppMessage',
          'onMenuShareTimeline',
          'hideOptionMenu',
          'updateTimelineShareData',
          'updateAppMessageShareData'
        ]
      })
      signParams.appId = 'wx1a9e2a8d86b3c7ee'
      window.wx.config(signParams)
      window.wx.ready(() => {
        const params = {
          title: info.title,
          desc: info.desc,
          link: info.link,
          imgUrl: info.imgUrl,
          success (res) {
            console.log(res)
          }
        }
        window.wx.onMenuShareAppMessage(params)
        window.wx.onMenuShareTimeline(params)
      })
    })
  } else {
    const u = navigator.userAgent
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
    const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

    // const GetQueryString = function (name) {
    //   const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
    //   const r = window.location.search.substr(1).match(reg);
    //   if (r != null) return r[2];
    //   return null;
    // };
    if (isAndroid) {
      /* 方法_设置是否拦截TitleBar上面的点击事件 */
      const args = {
        flag: true
      }
      window.dsBridge.call('view.setInterceptBarEvent', JSON.stringify(args))
      const shareInfo = {
        title: info.title,
        brief: info.desc,
        shareUrl: info.link,
        shareImg: info.imgUrl
      }
      window.dsBridge.call(
        'view.setBarRightText',
        JSON.stringify({
          text: '分享'
        })
      )
      window.dsBridge.register('view', {
        tag: 'view',
        onRightClick () {
          window.dsBridge.call('share.share', JSON.stringify(shareInfo))
        }
      })
    } else if (isIOS) {
      const hasBuildScript = document.getElementById('IOS_getShareInfoOC')
      if (hasBuildScript) {
        document.body.removeChild(hasBuildScript)
        const scriptTitle = document.createElement('script')
        scriptTitle.id = 'IOS_getShareInfoOC'
        scriptTitle.innerHTML = `try{window.webkit.messageHandlers.getShareInfoOC.postMessage({title:"${info.title}",brief:"${info.desc}",shareUrl:"${info.link}",shareImage:"${info.imgUrl}"});}catch(e){}`
        document.body.appendChild(scriptTitle)
      } else {
        const scriptTitle = document.createElement('script')
        scriptTitle.id = 'IOS_getShareInfoOC'
        scriptTitle.innerHTML = `try{window.webkit.messageHandlers.getShareInfoOC.postMessage({title:"${info.title}",brief:"${info.desc}",shareUrl:"${info.link}",shareImage:"${info.imgUrl}"});}catch(e){}`
        document.body.appendChild(scriptTitle)
      }
    } else {
      console.log('pc')
    }
  }
}
