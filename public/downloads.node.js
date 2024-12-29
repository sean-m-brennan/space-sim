#!/usr/bin/env node

import images from "./images/download_images.node.js"
import models from "./models/download_models.node.js"

const forceDownload = process.argv.includes("--force-download") || process.argv.includes("--force")
const forceConvert = process.argv.includes("--force-conversion") || process.argv.includes("--force")
const debug = process.argv.includes("--debug")

await images(4, forceDownload, forceConvert, debug)
await models(forceDownload, forceConvert, debug)
