import * as fs from "node:fs"
import path from "path"
import {execSync} from "node:child_process"
import download from 'download'
import {Open} from 'unzipper'

// Requires blender in the $PATH

const baseDir = import.meta.dirname

const downloadFile = async (url, filename) => {
    fs.writeFileSync(filename, await download(url))
}

const extract = async (from, to) => {
    const directory = await Open.file(from);
    await directory.extract({ path: to })
}

const models = async (forceDownload=false, forceConvert=false, debug=false) => {
    const modelInfo = {
        phobos: ["https://planetpixelemporium.com/download/download.php?phobos.zip",
            "https://planetpixelemporium.com/download/download.php?phobosbump.jpg"],
        deimos: ["https://planetpixelemporium.com/download/download.php?deimos.zip",
            "https://planetpixelemporium.com/download/download.php?deimosbump.jpg"],
    }

    for (const key of Object.keys(modelInfo)) {
        if (debug)
            console.debug(`Converting gltf for ${key}`)
        let dest = path.join(baseDir, `${key}.jpg`)
        if (forceDownload || !fs.existsSync(dest))
            await downloadFile(modelInfo[key][1], dest)

        dest = path.join(baseDir, `${key}.zip`)
        if (forceDownload || !fs.existsSync(dest))
            await downloadFile(modelInfo[key][0], dest)

        dest = path.join(baseDir, `${key}.glb`)
        if (forceConvert || ! fs.existsSync(dest)) {
            await extract(path.join(baseDir, `${key}.zip`), baseDir)
            fs.renameSync(path.join(baseDir, `${key}.obj.bin`), path.join(baseDir, `${key}.obj`))
            execSync(`blender --background --python ${path.join(baseDir, 'obj2gltf.py')} -- ${baseDir}/${key}.glb ${baseDir}/${key}.obj ${baseDir}/${key}.jpg`)
        }
    }
}
export default models
