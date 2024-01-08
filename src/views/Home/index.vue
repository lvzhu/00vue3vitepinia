<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    class="home-view"
  >
    <div class="home-view-header">
      <van-steps :active="active">
        <van-step>填写信息</van-step>
        <van-step>签署协议</van-step>
        <van-step>完成签署</van-step>
      </van-steps>
    </div>
    <RouterView>
      <template #default="{ Component, route }">
        <transition :name="route.name === 'doctorList' ? 'slide-left' : 'slide-right'" mode="out-in" appear>
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </template>
    </RouterView>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const active = ref(0)
</script>

<style lang="less" scoped>
.home-view {
  padding: 24px 16px 0;
  background: #f3f4f7;
  min-height: 100vh;
  .home-view-header {
    border-radius: 15px;
    background: #fff;
    padding: 15px;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    h2 {
      font-size: 16px;
      color: var(--text-color);
      padding-left: 15px;
      font-weight: normal;
    }
    span {
      font-size: 14px;
      color: var(--text-color2);
    }
    .bottom {
      padding-top: 20px;
      padding-bottom: 7px;
      p {
        font-size: 14px;
        color: #fff;
        text-align: center;
      }
      h3 {
        font-family: PingFangSC-Medium;
        font-size: 22px;
        font-weight: 900;
        color: #fff;
        text-align: center;
        padding-bottom: 5px;
      }
    }
  }
}
</style>
