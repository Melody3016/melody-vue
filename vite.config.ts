import { fileURLToPath, URL } from 'node:url';
import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

const pathSrc = path.resolve(__dirname, 'src');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue'],
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon'
        })
      ],
      dts: path.resolve(pathSrc, 'auto-imports.d.ts')
      // dts: fileURLToPath(new URL('./src/auto-imports.d.ts'))
    }),
    Components({
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep']
        }),
        // 自动导入 Element Plus 组件
        ElementPlusResolver()
      ],
      dts: path.resolve(pathSrc, 'components.d.ts')
    }),
    Icons({
      autoInstall: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
      '/my-web': {
        target: 'http://localhost:4000',
        changeOrigin: true
        // rewrite: (path) => path.replace(/^\/api/, "")
      },
      '/xboot': {
        target: 'http://139.180.190.62:8888',
        changeOrigin: true
        // rewrite: (path) => path.replace(/^\/api/, "")
      }
    },
    host: '192.168.31.199',
    port: 5173
  }
});
