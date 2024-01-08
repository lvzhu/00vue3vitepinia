import { defineStore } from 'pinia'
import { getUserBaseInfo, login } from '@/api'
import { storage } from '@/utils/Storage'
import { ACCESS_TOKEN, COMPANYCODE, AREACODE, APPID } from '@/store/mutation-types'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    accessToken: storage.get(ACCESS_TOKEN) || '',
    userInfo: {
      openId: 1658222110320,
      companyCode: COMPANYCODE,
      areaCode: AREACODE,
      appid: APPID
    }
  }),
  getters: {
    getUserInfo (state) {
      return state.userInfo
    }
  },
  actions: {
    setAccessToken (value) {
      this.accessToken = value
    },
    setUserInfo (userInfo) {
      this.userInfo = Object.assign({}, userInfo, {
        openId: 1658222110320,
        companyCode: COMPANYCODE,
        areaCode: AREACODE,
        appid: APPID
      })
    },
    setInfo () {
      // 获取用户信息
      return new Promise((resolve, reject) => {
        getUserBaseInfo({ userId: this.userInfo.userId }).then(({ data }) => {
          this.setUserInfo(data)
          resolve(data)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    userLogin (params) {
      return new Promise((resolve, reject) => {
        login({
          ...params
        }).then((res) => {
          storage.set(ACCESS_TOKEN, res.encrypt)
          this.setUserInfo({ userId: res.data.userId })
          this.setAccessToken(res.encrypt)
          resolve(res)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    logout () {
      return new Promise((resolve) => {
        storage.remove(ACCESS_TOKEN)
        this.setUserInfo({
          openId: 1658222110320,
          companyCode: COMPANYCODE,
          areaCode: AREACODE,
          appid: APPID
        })
        this.setAccessToken('')
        resolve(true)
      })
    }
  }
})
