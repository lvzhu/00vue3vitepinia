<template>
  <div class="information-view">
    <van-form ref="formRef" @submit="handleSubmit" @failed="handleFailed" :show-error-message="false">
      <van-field
        v-model="name"
        label="姓名"
        placeholder="请输入您的真实姓名"
        autocomplete="off"
        required
        :rules="[{ required: true, message: '请输入您的真实姓名' }]"
      />
      <van-field
        v-model="phone"
        label="手机号"
        placeholder="请输入手机号"
        type="tel"
        :maxlength="11"
        autocomplete="off"
        required
        :rules="[{ required: true, message: '请输入手机号' }, { pattern: validatorPhone, message: '请输入正确的手机号' }]"
      />
      <van-field
        v-model="hospital"
        label="医院"
        placeholder="请输入您所在的医院"
        autocomplete="off"
      />
      <van-field
        v-model="department"
        label="科室"
        placeholder="请输入您所在的科室"
        autocomplete="off"
      />
      <van-field
        v-model="idCard"
        label="身份证号"
        placeholder="请输入身份证号"
        autocomplete="off"
        required
        :rules="[{ required: true, message: '请输入身份证号' }, { pattern: validatorIdCard, message: '请输入正确的身份证号' }]"
      />
      <van-field
        v-model="bankCard"
        label="银行卡号"
        placeholder="请输入银行卡号"
        label-align="top"
        autocomplete="off"
        required
        :rules="[{ required: true, message: '请输入银行卡号' }, { pattern: validatorBankCard, message: '请输入正确的银行卡号' }]"
      />
      <van-field
        v-model="depositAddress"
        label="开户行（精确到支行）"
        placeholder="请选择开户行"
        label-align="top"
        autocomplete="off"
      />
    </van-form>
    <van-button
      type="primary"
      block
      round
      @click="formRef.submit()"
    >下一步</van-button>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { showToast } from 'vant'
import { useAuthenticationStore } from '@/store/modules/authentication'

const authenticationStore = useAuthenticationStore()
const {
  name,
  phone,
  hospital,
  department,
  idCard,
  bankCard,
  depositAddress
} = storeToRefs(authenticationStore)
// 表单ref
const formRef = ref(null)
// 提交表单
const handleSubmit = () => {
  console.log(authenticationStore.formData)
}
// 提交失败
const handleFailed = ({ errors }) => {
  console.log(errors)
  showToast(errors[0].message)
}
// 校验手机号
const validatorPhone = /^[1][0-9][0-9]{9}$/
// const validatorBankCard = /^([1-9]{1})(\d{14}|\d{18})$/
// 校验银行卡号
const validatorBankCard = /^[0-9]*$/
// 校验身份证号
const validatorIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
</script>
