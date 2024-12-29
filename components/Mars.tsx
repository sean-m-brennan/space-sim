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
import {Color, Euler, Vector2} from "three"
import {extend} from "@react-three/fiber"

import "../util/extDate.ts"
import {OrbitalImages} from "../planetarium/orbital_data.ts"
import {Planet, PlanetChildren} from "./Planet.tsx"
import {EarthConsts} from "../planetarium/constants.ts"
import {SpaceContext} from "./mechanics/SpaceContext.tsx"
import {SurfaceParameters} from "./shaders/planet_material.tsx"
import {AtmosphereParameters, defaultAtmosphere} from "./shaders/atmosphere_material.tsx"
import {CloudParameters, defaultClouds} from "./shaders/cloud_material.tsx"
import {defaultHaze, HazeParameters} from "./shaders/haze_material.tsx"
import {getLightDirections} from "../planetarium/orrery_impl.ts"
import {imageFiles} from './images.ts'


export interface MarsProps {
    children?: PlanetChildren
}

export default function Mars(props: MarsProps) {
    const access = useContext(SpaceContext)
    const imgSrc = imageFiles.mars
    const images: OrbitalImages = {  // monthly
        daytime: {
            low: [imgSrc.day.small],
            high: [imgSrc.day.large],
        },
        elevation: imgSrc.normal,
        //clouds: imgSrc.clouds,
    }
    const surfParams: SurfaceParameters = {
        indexer: ()=> 0,  // FIXME seasonal diff?
        images: images,
        normalScale: new Vector2(0.5, 0.5),
        roughness: 1.0,
        metalness: 0.0,
        emissiveColor: new Color('#000'),
        emissiveIntensity: 0,
        highRes: false,
        lightDirections: getLightDirections(access.system),
        hasAtmosphere: true,
    }
    const atmoParams: AtmosphereParameters = {
        ...defaultAtmosphere(access.system),
        enable: true,
        color: new Color(0xaaaaff),
        coefficient: 1.8,
        power: 0.8,
        opacity: 0.4,
        transmission: 0.80,
    }
    const cloudParams: CloudParameters = {
        ...defaultClouds,
        enable: true,
        image: images.clouds,  // images must have alpha channel
        shadows: true,
        transparent: true,
        speed: 50,  // FIXME
    }
    const hazeParams: HazeParameters = {
        ...defaultHaze,
        enable: true,
        color: new Color(0xfffff88), //(0x9999cc),
        intensity: 2.5,
    }
    // map texture is misaligned by 67 degrees
    const rotation = useRef(new Euler(0, -Math.PI*3.0/8.0, 0))

    return Planet({...props, orbit: new EarthConsts(),
        surfParams: surfParams, atmoParams: atmoParams, cloudParams: cloudParams,
        hazeParams: hazeParams, rotation: rotation.current})
}

extend({Mars})
