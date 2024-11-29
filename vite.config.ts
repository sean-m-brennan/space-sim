import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// @ts-expect-error 'types could not be resolved when respecting package.json "exports"'
import eslint from 'vite-plugin-eslint'
import glsl from 'vite-plugin-glsl'
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets'
import { extname, relative } from 'path'
import { fileURLToPath } from 'node:url'
import { glob } from 'glob'
import * as fs from "node:fs"
import path from "node:path"


const sources = glob.sync('./{components,planetarium,util}/**/*.{ts,tsx,css}', {
    ignore: ["./{components,planetarium,util}/**/*.d.ts", "./public/**/*"],
})

const plugins = [
    react(),
    glsl(),
    libAssetsPlugin({
        outputPath: 'images',
    }),
]
// vite-plugin-eslint is incompatible with turbo
if (process.env.TURBO_HASH === undefined && !fs.existsSync('.turbo')) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-argument
    plugins.push(eslint())
}

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "locate-user/": path.resolve(__dirname, "../locate-user/src/"),
            "space-data-api/": path.resolve(__dirname, "../space-data-api/src/"),
        },
    },
    plugins: plugins,
    base: "/space-sim/",
    build: {
        sourcemap: true,
        minify: false,
        lib: {
            entry: sources,
            formats: ["es"],  // *not* cjs
        },
        cssCodeSplit: true,
        emptyOutDir: false,
        rollupOptions: {
            external: [
                'react', 'react/jsx-runtime',
                'three', 'three-stdlib',
                '@react-three/fiber', '@react-three/drei',
                '@react-three/postprocessing',
                'primereact', 'primeicons',
            ],
            input: Object.fromEntries(
                glob.sync('./{components,planetarium,util}/**/*.{ts,tsx,css}', {
                    ignore: [
                        "./{components,planetarium,util}/**/*.d.ts",
                        "./public/**/*"
                    ],
                }).map(file => [
                    relative(
                        '.',
                        file.slice(0, file.length - extname(file).length)
                    ),
                    fileURLToPath(new URL(file, import.meta.url))
                ])
            ),
        },
    },
})
