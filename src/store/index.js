import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

const store = createPinia()
// 持久化存储
store.use(piniaPluginPersist)

export function setupStore (app) {
  app.use(store)
}

export { store }
