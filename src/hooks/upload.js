import * as Qiniu from 'qiniu-js'
import { ref, onUnmounted } from 'vue'

const getKeyFile = (file) => {
  const index1 = file.name.lastIndexOf('.')
  const index2 = file.name.length
  const suffix = file.name.substring(index1, index2) // 后缀名
  const date = new Date()
  return Date.parse(date) + Math.floor(Math.random() * 1000) + suffix
}
const upFileUrl = 'https://studioyszimg.yxj.org.cn' // 自定义访问域名
export function useUpload () {
  let observable = null
  const percent = ref(0)
  const subscription = ref(null)
  const fileLoading = ref(false)
  const upload = (file, qiqiutoken, maxFileSize, compressImage) => {
    return new Promise((resolve, reject) => {
      if (!file) return
      percent.value = 0
      fileLoading.value = true
      const key = getKeyFile(file) // 文件资源名
      const size = file.size / 1024
      if (maxFileSize && size > Number(maxFileSize.replace('M', '')) * 1000) {
        fileLoading.value = false
        reject(new Error('不能大于' + maxFileSize))
        return false
      }
      /*
      * config.useCdnDomain: 是否使用 cdn 加速域名，true or false，默认为 false。
      * config.disableStatisticsReport: 是否禁用日志报告，为布尔值，默认为false。
      * config.region: 选择上传域名区域；当为 null 或 undefined 时，自动分析上传域名区域
      * config.retryCount: 上传自动重试次数（整体重试次数）；默认3次（即上传失败后最多重试两次）；
      * config.concurrentRequestLimit: 分片上传的并发请求量，number，默认为3；
      * config.checkByMD5: 是否开启 MD5 校验，在断点续传时校验分片，默认为 false，不开启。
      */
      const config = {
        useCdnDomain: true,
        concurrentRequestLimit: 6,
        retryCount: 7
      }

      /*
      * fname: string，文件原文件名.
      * params: object，用来放置自定义变量;
      * mimeType: null || array，用来限制上传文件类型，为 null 时表示不对文件类型限制；
      * 限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
      */
      const putExtra = {
        fname: key
      }
      const observe = {
        next (res) {
          /* console.log('已上传大小，单位为字节：' + res.total.loaded)
          console.log('本次上传的总量控制信息，单位为字节：' + res.total.size)
          console.log('当前上传进度，范围：0～100：' + res.total.percent) */
          percent.value = Number(res.total.percent > percent.value ? res.total.percent.toFixed(1) : percent.value)
        },
        error (err) {
          console.log(err)
          fileLoading.value = false
          reject(err.message)
        },
        complete (res) {
          console.log(res)
          fileLoading.value = false
          resolve(upFileUrl + '/' + res.key)
        }
      }
      if (compressImage?.open) {
        Qiniu.compressImage(file, compressImage).then((data) => {
          observable = Qiniu.upload(data.dist, key, qiqiutoken, putExtra, config)
          subscription.value = observable.subscribe(observe)
        }).catch(() => {
          // 失败就上传原图
          observable = Qiniu.upload(file, key, qiqiutoken, putExtra, config)
          subscription.value = observable.subscribe(observe)
        })
      } else {
        observable = Qiniu.upload(file, key, qiqiutoken, putExtra, config)
        subscription.value = observable.subscribe(observe)
      }
    })
  }
  onUnmounted(() => {
    subscription.value && subscription.value.unsubscribe()
  })
  return {
    upload,
    percent,
    fileLoading
  }
}
