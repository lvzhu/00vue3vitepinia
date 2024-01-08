<template>
  <div class="login-view">
    <van-form>
      <van-field
        v-model="formData.phone"
        type="tel"
        clearable
        name="phone"
        placeholder="请输入手机号"
        :border="false"
        maxlength="11"
        title=""
      ></van-field>
      <van-field
        v-model="formData.captchaCode"
        clearable
        type="digit"
        name="captchaCode"
        placeholder="短信验证码"
        :border="false"
        :maxlength="6"
        title=""
      >
        <template #button>
          <div class="yzm" @click="sendCode" :class="{ disabled: isDisabled }">
            <template v-if="isDisabled">
              重新发送{{ current.seconds }}s
            </template>
            <template v-else>发送验证码</template>
          </div>
        </template>
      </van-field>
      <div class="radio flex-start-center">
        <svg-icon
          :icon-class="checked ? 'radioselected' : 'radio'"
          @click="checked = !checked"
        ></svg-icon>
        <span @click="checked = !checked">已阅读并同意</span>
        <a href="javascript:;" @click="showAuthorization = true"
          >《隐私协议》</a
        >
      </div>
    </van-form>
    <van-button
      class="public-button"
      type="primary"
      block
      round
      @click="loginHandle"
      :disabled="btnDisabled"
      >登录/注册</van-button
    >
    <van-dialog
      v-model:show="showAuthorization"
      :show-confirm-button="false"
      class="informed-dialog"
    >
      <h2>隐私协议</h2>
      <div class="content">
        尊敬的先生/女士<br />
        感谢您对“XXXXX”专区的关注。在您浏览信息化平台的内容之前，请仔细阅读并决定是否接受以下内容。<br />
        接受个性化信息<br />
        您理解并同意，项目将通过电子化沟通渠道向您提供项目理解最适合您的信息，包括但不限于会议活动通知、研究进展、医学科学文献等等。基于您提供的不同的个人信息种类，项目与您之间的电子化沟通渠道可能包含电子邮件、微信账号平台、手机短信息等。<br />
        禁止未经授权的扩散和传播<br />
        您理解并同意，您所接收的信息系上海医米信息技术有限公司经合理许可后提供，并受到上海医米信息技术有限公司内部保密政策和中华人民共和国或其他相关地区法律的保护，
      </div>
      <div class="btn-warp flex-between-center">
        <van-button
          class="disagree"
          block
          round
          @click="checked = false, showAuthorization = false"
          >不同意</van-button
        >
        <van-button
          class="public-button"
          type="primary"
          block
          round
          @click="checked = true, showAuthorization = false"
          >同意</van-button
        >
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useCountDown } from '@vant/use'
import { showToast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { getVerificationCode, report } from '@/api'
import { useUserStore } from '@/store/modules/user'

// 验证码倒计时
const countDown = useCountDown({
  time: 60000,
  onFinish: () => {
    isDisabled.value = false
  }
})
const userStore = useUserStore()
const current = countDown.current
const formData = reactive({
  captchaCode: '',
  phone: ''
})
const isDisabled = ref(false)
const checked = ref(false)
const showAuthorization = ref(false)
const sendCode = () => {
  if (isDisabled.value) return
  if (!formData.phone || !testPhone(formData.phone)) {
    showToast({
      message: '请输入正确的手机号!',
      icon: 'warning'
    })
    return
  }
  getVerificationCode({
    mobile: formData.phone
  }).then(() => {
    showToast('验证码已发送')
    isDisabled.value = true
    countDown.reset()
    countDown.start()
  })
}
const btnDisabled = computed(() => {
  return !formData.captchaCode || !formData.phone
})
const route = useRoute()
const router = useRouter()

const testPhone = (val) => {
  // 校验手机号
  const regExp = /^[1][0-9][0-9]{9}$/
  return regExp.test(val)
}
const loginHandle = () => {
  if (!formData.phone || !testPhone(formData.phone)) {
    showToast({
      message: '请输入正确的手机号!',
      icon: 'warning'
    })
    return
  }
  if (formData.captchaCode.length !== 6) {
    showToast({
      message: '请输入6位验证码!',
      icon: 'warning'
    })
    return
  }
  if (!checked.value) {
    showToast({
      message: '请同意知情同意书!',
      icon: 'warning'
    })
    return
  }
  userStore
    .userLogin({
      mobile: formData.phone,
      msgCode: formData.captchaCode
    })
    .then(() => {
      const toPath = route.query?.redirect || '/'
      router.replace(toPath)
    })
}
onMounted(() => {
  report({
    key: 'loginburied',
    name: '登录埋点'
  })
})
</script>

<style lang="less" scoped>
.login-view {
  padding: 164px 20px 40px;
  background: url("@/assets/images/banner.png") no-repeat center 30px;
  background-size: calc(100% - 40px) auto;
  font-family: PingFangSC-Regular;
  .van-form {
    padding: 40px 0;
    .van-field {
      background: #ffffff;
      border-bottom: 1px solid #e8e8e8;
      margin-bottom: 20px;
      font-size: 15px;
      height: 48px;
      padding: 10px 0;
      font-size: 15px;
      line-height: 21px;
      /* 主要文字 */
      color: #262626;
      :deep(.van-field__button) {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: normal;
        line-height: 20px;
        letter-spacing: 0px;
        color: #0000c9;
        .disabled {
          color: #999;
        }
      }
    }
    .radio {
      font-size: 13px;
      color: #adadad;
      a {
        color: #0000c9;
      }
      .svg-icon {
        position: relative;
        top: 1px;
        font-size: 16px;
        margin-right: 5px;
      }
    }
  }
  :deep(.informed-dialog) {
    width: 315px;
    background: #fff;
    .van-dialog__content {
      padding: 24px 10px 80px;
    }
    .content {
      height: 400px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 0 10px;
      font-size: 14px;
      line-height: 24px;
      color: #262626;
      text-align: left;
    }
    h2 {
      font-size: 18px;
      text-align: center;
      color: #262626;
      margin-bottom: 20px;
    }
    p {
      font-size: 14px;
      line-height: 24px;
      color: #262626;
    }
    .btn-warp {
      position: absolute;
      left: 0;
      bottom: 24px;
      width: 100%;
      padding: 0 24px;
      .van-button {
        margin: 0 6px;
        font-size: 14px;
        &.disagree {
          background: #e0e0e1;
          color: #adadad;
        }
      }
    }
  }
}
</style>
