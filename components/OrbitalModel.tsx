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

import React, {RefObject, useContext, useState} from "react"
import {useFrame} from "@react-three/fiber"
import {
    Euler,
    Mesh,
    MeshStandardMaterial,
    Vector2,
    Vector3
} from "three"
import { GLTF } from "three-stdlib"
import { useGLTF } from "@react-three/drei"

import {SpaceContext} from "./mechanics/SpaceContext.tsx"
import {PlanetMaterial, SurfaceParameters} from "./shaders/planet_material.tsx"


export interface OrbitalSurfaceModelProps {
    surface: SurfaceParameters
    modelFile: string
    modelName: string
    textureFile: string
    surfaceSize: number
    segmentSize: Vector2
    surfaceRef: RefObject<Mesh>
    position?: Vector3
    rotation?: Euler
    wrap?: boolean
}

export const OrbitalSurfaceModel = (props: OrbitalSurfaceModelProps) => {
    const model = Symbol(props.modelName)
    const texture = Symbol(props.textureFile)
    props.wrap = true  // FIXME remove

    type GLTFResult = GLTF & {
        nodes: {
            [model]: Mesh
        }
        materials: {
            [texture]: MeshStandardMaterial
        }
    }

    const access = useContext(SpaceContext)
    const { nodes, materials } = useGLTF(props.modelFile) as GLTFResult
    const [material] = useState(new PlanetMaterial(props.surface))

    useFrame((_, delta: number) => {
        material.update(delta, access.system, props.position)
        // FIXME does position track?
        // FIXME orbital rotation
    })

    const mat = props.wrap == true ? material : materials[texture]

    return (
        <group {...props} dispose={null}>
            <mesh ref={props.surfaceRef}
                  castShadow={true} receiveShadow={true}
                  geometry={nodes[model].geometry}
                  material={mat}
                  position={props.position} rotation={props.rotation}/>
        </group>
    )
}