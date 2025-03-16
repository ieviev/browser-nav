import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { isDev, port, r } from './scripts/utils'
import packageJson from './package.json'

export const sharedConfig: UserConfig = {
    base: '',
    root: r('src'),
    resolve: {
        alias: {
            '~/': `${r('src')}/`,
        },
    },
    define: {
        __DEV__: isDev,
        __NAME__: JSON.stringify(packageJson.name),
    },
    plugins: [
        Vue(),
        AutoImport({
            imports: [
                'vue',
                {
                    'webextension-polyfill': [
                        ['=', 'browser'],
                    ],
                },
            ],
            dts: r('src/auto-imports.d.ts'),
        }),
    ],
    optimizeDeps: {
        include: [
            'vue',
            '@vueuse/core',
            'webextension-polyfill',
        ]
    },
}

export default defineConfig(({ command }) => ({
    ...sharedConfig,
    base: command === 'serve' ? `http://localhost:${port}/` : '/dist/',
    server: {
        port,
        hmr: {
            host: 'localhost',
        },
        origin: `http://localhost:${port}`,
    },
    build: {
        watch: isDev
            ? {}
            : undefined,
        outDir: r('extension/dist'),
        emptyOutDir: false,
        // sourcemap: isDev ? 'inline' : false,
        // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
        terserOptions: {
            mangle: false,
        },
        rollupOptions: {
            input: {
                options: r('src/options/index.html'),
                popup: r('src/popup/index.html')
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
    },
}))
