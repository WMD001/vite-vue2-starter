import {fileURLToPath, URL} from "node:url";
import {defineConfig, loadEnv} from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {

    const env = loadEnv(mode, process.cwd());
    const {VITE_APP_ENV, VITE_APP_BASE_API} = env;

    return {
        plugins: [
            vue(),
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        ],
        base: './',
        build: {
            outDir: `dist-${mode}`,
        },

        //配置服务器信息
        server: {
            cors: true, // 默认启用并允许任何源
            open: true,
            host: "0.0.0.0",
            port: '4000',
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            proxy: {
                "/api": {
                    target: VITE_APP_BASE_API,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                }
            },
        },
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
    }
})
