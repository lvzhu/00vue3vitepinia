import { defineStore } from 'pinia'

export const useAuthenticationStore = defineStore({
  id: 'authentication',
  state: () => ({
    name: '', // 姓名
    phone: '', // 手机号
    hospital: '', // 医院
    department: '', // 科室
    idCard: '', // 身份证号
    bankCard: '', // 银行卡号
    depositAddress: '' // 开户行（精确到支行）
  }),
  getters: {
    formData () {
      return {
        name: this.name,
        phone: this.phone,
        hospital: this.hospital,
        department: this.department,
        idCard: this.idCard,
        bankCard: this.bankCard,
        depositAddress: this.depositAddress
      }
    }
  },
  actions: {
    setFormData (data) {
      this.name = data.name
      this.phone = data.phone
      this.hospital = data.hospital
      this.department = data.department
      this.idCard = data.idCard
      this.bankCard = data.bankCard
      this.depositAddress = data.depositAddress
    }
  },
  // 开启数据缓存
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'authenticationStore' // 设置存储的key
      }
    ]
  }
})
