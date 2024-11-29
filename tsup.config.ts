import { defineConfig } from 'tsup'
import { glob } from 'glob'

const sources = glob.sync('./{components,planetarium,util}/*.{ts,tsx}', {
    ignore: ["components/**/*.css", "public/**/*", "./{components,planetarium,util}/*.d.ts"],
})

export default defineConfig({
    entry: sources,
    splitting: false,
    tsconfig: './tsconfig.app.json',
    sourcemap: true,
    clean: true,
    dts: {only: true},
    format: "esm"
})
