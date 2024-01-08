import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import pxToViewport from 'postcss-px-to-viewport'
import eslintPlugin from 'vite-plugin-eslint'
import path from 'path'
// 引入svg插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const loderPxtovw = pxToViewport({
  viewportWidth: 375,
  viewportUnit: 'vw'
})
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      vue(),
      Components({ resolvers: [VantResolver()] }),
      eslintPlugin({ include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'] }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/svg-icons')],
        symbolId: 'icon-[dir]-[name]'
      })
    ],
    resolve: {
    // 设置路径别名
      alias: { '@': '/src' }
    },
    css: { postcss: { plugins: [loderPxtovw] } },
    server: {
      proxy: {
        '/api': {
          target: 'https://t.merch.yishengzhan.cn/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  }
})
