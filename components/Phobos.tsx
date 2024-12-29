/*
  Copyright 2024 Sean M. Brennan and contributors

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

import {useContext, useRef} from "react"
import {extend, useFrame,} from "@react-three/fiber"
import {Mesh, Vector3} from "three"
import path from "path-browserify"

import {Satellite} from "./Satellite.tsx"
import {OrbitalImages} from "../planetarium/orbital_data.ts"
import {SpaceContext} from "./mechanics/SpaceContext.tsx"
import {MoonConsts} from "../planetarium/constants.ts"
import {bareSurface, SurfaceParameters} from "./shaders/planet_material.tsx"
import {imageFiles} from './images.ts'


export interface PhobosProps {
    planetIdx?: number
}

export default function Phobos(props: PhobosProps) {
    const access = useContext(SpaceContext)

    const images: OrbitalImages = {
        daytime: {low: [imageFiles.mars.phobos.day],},
    }
    const surfParams = {
        ...bareSurface(access.system),
        images: images,
        highRes: false,
    } as SurfaceParameters
    const surfaceMeshRef = useRef<Mesh>(null)
    const positionRef = useRef<Vector3>(new Vector3(3,0,3))

    useFrame(() => {
        if (!access.system.flux.paused) {
            // FIXME
            //setUniforms(updateLights(system.sunStates, uniforms))
            // Note: satellite useFrame takes care of position

            // convert cartesian to polar coords plus initial turn for lunar face
            if (surfaceMeshRef.current && positionRef.current)
                surfaceMeshRef.current.rotation.y = Math.PI - Math.atan2(positionRef.current.z, positionRef.current.x)
        }
    })
    const orbit = new MoonConsts() // FIXME
    console.log(`Phobos of size ${orbit.radius}`)
    return Satellite({...props, orbit: orbit, position: positionRef.current,
        modelFile: imageFiles.mars.phobos.model, modelName: "phobos", textureFile: path.basename(imageFiles.mars.phobos.day),
        surfParams: surfParams,surfaceMeshRef: surfaceMeshRef, rotationOverride: true})
}

extend({Phobos})
