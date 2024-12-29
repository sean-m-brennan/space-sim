import path from "path"
import {globSync} from "glob"
import sharp from "sharp"
import {Queue} from "async-await-queue"
import * as fs from "node:fs"
import replaceColor from "replace-color"
import download from 'download'

import {imageSources} from "./urls.config.js"
import PromisedTimeout from "../timeout.node.js"

// Credits
// https://planetpixelemporium.com - Copyright (c) by James Hastings-Trew
// https://www.solarsystemscope.com - CC BY 4.0 INOVE
// https://svs.gsfc.nasa.gov
// https://eoimages.gsfc.nasa.gov -


const baseDir = import.meta.dirname


const downloadFile = async (url, filename) => {
    fs.writeFileSync(filename, await download(url))
}

const leaves = (obj) => {
    let children = []
    for (let key in obj) {
        let sub = obj[key]
        if (typeof sub == 'object')
            children = children.concat(leaves(sub))
        else if (Array.isArray(sub))
            children = children.concat(sub)
        else
            children.push(sub)
    }
    return children
}

async function downloadImages(force=false, debug=false){
    const urlSpec = {}
    for (let key in imageSources)
        urlSpec[key] = leaves(imageSources[key])

    // limit download concurrency
    const queue = new Queue(10, 100)
    const p = []
    for (const key in urlSpec) {
        const destDir = path.join(baseDir, key)
        if (!fs.existsSync(destDir))
            fs.mkdirSync(destDir)
        if (debug)
            console.debug(key)
        for (let url of urlSpec[key]) {
            if (debug)
                console.debug(url)
            let filename = path.basename(url)
            if (filename.includes("?"))
                filename = filename.substring(filename.indexOf("?") + 1)
            const dest = path.join(destDir, filename)
            if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 0)
                continue
            p.push((async () => {
                const q = Symbol()
                await queue.wait(q, 0)
                try {
                    console.debug(`Fetch ${url} ...`)
                    await downloadFile(url, dest)
                } catch (e) {
                    console.error(e)
                } finally {
                    console.debug(`... downloaded to ${dest}`)
                    queue.end(q)
                }
            })());
        }
    }
    await Promise.allSettled(p)
    if (debug)
        console.log('All images downloaded')
}

const convertImages = (force=false, debug=false) => {
    const dirs = Object.keys(imageSources)
    for (const dir of dirs) {
        const destDir = path.join(baseDir, dir)
        // convert tiff to jpeg
        globSync(`${destDir}/*.tif`).forEach((inFile) => {
            if (debug)
                console.debug(inFile)
            const dest = path.join(destDir, path.basename(inFile, path.extname(inFile)) + '.jpg')
            if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 0)
                return  // goes to next in forEach
            console.debug(`Convert ${inFile} to ${dest}`)
            sharp(inFile)
                .jpeg({quality: 100, force: true})
                .toFile(dest)
                .catch((e) => {
                    console.error(e)
                })
        })
        // resize hi-res earth images
        globSync(`${destDir}/world.2004*x5400x2700.jpg`).forEach((inFile) => {
            if (debug)
                console.debug(inFile)
            const dest = path.join(destDir, path.basename(inFile, 'x5400x2700.jpg') + 'x2048x1024.jpg')
            if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 0)
                return  // goes to next in forEach
            console.debug(`Convert ${inFile} to ${dest}`)
            sharp(inFile)
                .resize(2048, 1024)
                .jpeg({quality: 100, force: true})
                .toFile(dest)
                .catch((e) => console.error(e))
        })
        // resize large cloud image
        globSync(`${destDir}/Transparent_Fair_Weather_Clouds_Map.png`).forEach((inFile) => {
            if (debug)
                console.debug(inFile)
            const dest = path.join(destDir, path.basename(inFile, '.png') + 'x2048x1024.png')
            if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 0)
                return  // goes to next in forEach
            console.debug(`Convert ${inFile} to ${dest}`)
            sharp(inFile)
                .resize(2048, 1024)
                .png()
                .toFile(dest)
                .catch((e) => console.error(e))
        })
    }
    // adjust contrast on night-side
    const destDir = path.join(baseDir, 'earth')
    const nights = [`${destDir}/earth_vir_2016.jpg`, `${destDir}/earth_vir_2016_lrg.jpg`]
    nights.forEach((inFile) => {
        if (debug)
            console.debug(inFile)
        const dest = path.join(destDir, path.basename(inFile, '.jpg') + '_2.jpg')
        if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 0)
            return  // goes to next in forEach
        console.debug(`Adjust ${inFile} to ${dest}`)
        const contrast = 2.8
        sharp(inFile)
            .linear(contrast, -(128 * contrast) + 128)
            .toFile(dest)
            .catch((e) => console.error(e))
    })
    // color-to-transparency
    const nonAlphas = [`${destDir}/cloud_combined_2048.jpg`]
    nonAlphas.forEach((inFile) => {
        if (debug)
            console.debug(inFile)
        const dest = path.join(destDir, path.basename(inFile, '.jpg') + '.png')
        if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 0)
            return  // goes to next in forEach
        console.debug(`Convert ${inFile} to alpha ${dest}`)
        const color = '#000000'
        replaceColor({
            image: inFile,
            colors: {
                type: 'hex',
                targetColor: color,
                replaceColor: '#00000000',
            },
            deltaE: 15,
        })
            .then((img) => {
                img.write(dest)
            })
            .catch((err) => { console.error(err) })
    })
    if (debug)
        console.debug("Conversions complete")
}


const images = async (timeOutMinutes=4, forceDownload=false, forceConvert=false, debug=false) => {
    const tmo = new PromisedTimeout(timeOutMinutes * 60 * 1000)
    let complete = false

    while (!complete) {
        try {
            await tmo.wait(downloadImages(forceDownload, debug))
            convertImages(forceConvert, debug)
            complete = true
        } catch (err) {
            console.error(err)
        }
        if (complete)
            tmo.cancel()
    }
}
export default images
