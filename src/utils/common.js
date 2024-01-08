const getUrlParam = function (name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) { return unescape(r[2]) }
  return null
}
const storage = {
  set (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  get (key) {
    return JSON.parse(localStorage.getItem(key))
  },
  remove (key) {
    localStorage.removeItem(key)
  }
}
// 字符串加密
const enCode = function (code = '') {
  console.log(code)
  let c = String.fromCharCode(code.charCodeAt(0) + code.length)
  for (let i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1))
  }
  return escape(c)
}
export { getUrlParam, storage, enCode }
// # sourceMappingURL=common.js.map
