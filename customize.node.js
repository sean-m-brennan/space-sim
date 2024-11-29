#!/usr/bin/env node

import {glob} from "glob"
import {unlink, rm, cp} from "node:fs/promises"
import {relative} from "path"

async function clean() {
    const generatedFiles = glob.sync(
        './{.,components,planetarium,util}/**/*.{d.ts,js,css,js.map}',
        { ignore: [
                "./{.,components,planetarium,util}/**/global.d.ts",
                "./{.,components,planetarium,util}/**/*.module.css",
                "./{.,components,planetarium,util}/**/*.node.js",
                "./{.,components,planetarium,util}/**/*.config.{js,ts}",
                "./node_modules/**/*"
            ], }
    )

    const p = []
    for (const file of generatedFiles) {
        p.push(unlink(file))
    }
    p.push(unlink("./orrery_config.json"))
    p.push(rm("./dist", { recursive: true, force: true }))
    p.push(rm("./images", { recursive: true, force: true }))
    await Promise.allSettled(p)
}

async function copy() {
    const distFiles = glob.sync('./dist/**/*')

    const p = []
    for (const file of distFiles) {
        const dest = relative("dist", file)
        p.push(cp(file, dest, {recursive: true}))
    }
    await Promise.allSettled(p)
}


if (process.argv.includes("--clean")) {
    clean().catch((err) => { console.error(err) })
}
else if (process.argv.includes("--postbuild")) {
    copy().catch((err) => { console.error(err) })
}
