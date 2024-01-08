/**
 * ClassName: CryptoJS - encode
 * Description: 加密解密 AES
 * @author XuHongLi
 * @date 2018-07-23
 *  加密解密文档 https://github.com/sytelus/CryptoJS
 *  encodeFunc 加密
 *  decodeFuc 解密 enCode.decodeFuc(data.data) 对{data:dwfwefwfw,md5:e342342}
 */
import CryptoJS from 'crypto-js' // AES

const bigKey = CryptoJS.enc.Utf8.parse('2015020120200131')

const encode = {
  encodeFunc (obj) {
    // obj = JSON.stringify(obj)
    const key = bigKey

    const enCodeAes = CryptoJS.AES.encrypt(JSON.stringify(obj), key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString()
    // let enCodeMd5 = Md5(JSON.stringify(obj))
    const enCodeMd5 = CryptoJS.MD5(JSON.stringify(obj)).toString()
    const sendData = {
      data: enCodeAes,
      md5: enCodeMd5
    }
    // console.log(sendData);
    return sendData
  },
  decodeFuc (obj) {
    console.log(obj)
    const key = bigKey
    // obj = CryptoJS.enc.Base64.stringify(obj);
    const decodeAes = CryptoJS.AES.decrypt(obj, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8)
    console.log(decodeAes, 'decodeFuc')
    return decodeAes
  }
}
export default encode
