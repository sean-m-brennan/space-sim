#!/usr/bin/env node

import {glob} from "glob"
import * as fs from "node:fs"
import {relative} from "path"

if (process.argv.includes("--clean")) {
    const generatedFiles = glob.sync(
        './{.,components,planetarium,util}/**/*.{d.ts,js,css}',
        { ignore: [
                "./{.,components,planetarium,util}/**/global.d.ts",
                "./{.,components,planetarium,util}/**/*.module.css",
                "./{.,components,planetarium,util}/**/*.node.js",
                "./{.,components,planetarium,util}/**/*.config.{js,ts}",
                "./node_modules/**/*"
            ], }
    )
    for (const file of generatedFiles) {
        fs.unlink(file, () => {})
    }
    fs.unlink("./orrery_config.json", () => {})
    fs.rmSync("./dist", { recursive: true, force: true })
    fs.rmSync("./images", { recursive: true, force: true })
}
else if (process.argv.includes("--postbuild")) {
    const distFiles = glob.sync('./dist/**/*')
    for (const file of distFiles) {
        const dest = relative("dist", file)
        fs.cpSync(file, dest, {recursive: true})
    }
}
