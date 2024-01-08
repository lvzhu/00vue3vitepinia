import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import router, { setupRouter } from '@/router'
import { setupStore } from '@/store'
// svg
import 'virtual:svg-icons-register'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import '@/assets/less/base.less'
import {
  Lazyload
} from 'vant'
/* import VConsole from 'vconsole'
// eslint-disable-next-line
let vConsole = new VConsole(); */

// window.dsBridge.call('base.register', '[1,2,5,6,7]')
const bootstrap = async () => {
  const app = createApp(App)
  app.use(setupStore)
  setupRouter(app)
  app.component('svg-icon', defineAsyncComponent(() =>
    import('@/components/svgIcon/index.vue')
  ))
  app.use(Lazyload)
  await router.isReady()
  app.mount('#app')
}

bootstrap()
