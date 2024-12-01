import React, {RefObject} from "react";
import {useFrame} from "@react-three/fiber"
import {EffectComposer} from "@react-three/postprocessing"
import {DirectionalLight, Group, SphereGeometry} from "three"
import {folder, useControls } from "leva"

import {LensFlare} from "@andersonmancini/lens-flare"

import {SunImpl} from "./SunImpl.tsx"
import {euler2array, vector2array} from "../util/coordinates.ts"

import lensDirt from "../public/images/lens_dirt.png"

const makeAdjustments = false

interface SunFrameProps {
    impl: SunImpl
    whole: RefObject<Group>
    geo: RefObject<SphereGeometry>
    light: RefObject<DirectionalLight>
    animate: boolean
}

export const SunFrame = (props: SunFrameProps) => {
    let lensFlarePropsDev = null
    /* uncomment for devel debugging
    lensFlarePropsDev = useControls({
        LensFlare: folder(
            {
                enabled: {value: true, label: "enabled?"},
                opacity: {value: 0.1, min: 0.0, max: 1.0, label: "opacity"},
                position: {
                    value: props.impl.position,
                    // @ts-expect-error("'step' does not exist in type")
                    step: 1,
                    label: "position",
                },
                glareSize: {value: 0.35, min: 0.01, max: 1.0, label: "glareSize"},
                starPoints: {
                    value: 6.0,
                    step: 1.0,
                    min: 0,
                    max: 32.0,
                    label: "starPoints",
                },
                animated: {value: true, label: "animated?"},
                followMouse: {value: false, label: "followMouse?"},
                anamorphic: {value: false, label: "anamorphic?"},
                // @ts-expect-error("Doesn't like Color obj")
                colorGain: { value: props.impl.color, label: "colorGain" },

                Flare: folder({
                    flareSpeed: {
                        value: 0.4,
                        step: 0.001,
                        min: 0.0,
                        max: 1.0,
                        label: "flareSpeed",
                    },
                    flareShape: {
                        value: 0.1,
                        step: 0.001,
                        min: 0.0,
                        max: 1.0,
                        label: "flareShape",
                    },
                    flareSize: {
                        value: 0.005,
                        step: 0.001,
                        min: 0.0,
                        max: 0.01,
                        label: "flareSize",
                    },
                }),

                SecondaryGhosts: folder({
                    secondaryGhosts: {value: true, label: "secondaryGhosts?"},
                    ghostScale: {value: 0.1, min: 0.01, max: 1.0, label: "ghostScale"},
                    aditionalStreaks: {value: true, label: "aditionalStreaks?"},
                }),

                StartBurst: folder({
                    starBurst: {value: true, label: "starBurst?"},
                    haloScale: {value: 0.5, step: 0.01, min: 0.3, max: 1.0},
                }),
            },
            {collapsed: true}
        )
    })
    */

    const lensFlarePropsProd = {
        opacity: 0.1,
        glareSize: 1.0,
        starPoints: 7,
        animated: props.animate,
        position: props.impl.position,
        colorGain: props.impl.color.multiplyScalar(0.50),
        flareSpeed: 0.001,
        flareShape: 0.0,
        flareSize: 0.01,
        secondaryGhosts: true,
        ghostScale: 0.1,
        aditionalStreaks: true,
        starBurst: true,
        haloScale: 0.5,
        move: () => {
            if (props.whole.current)
                return props.whole.current.position
            return null
        }
    }
    if (!lensFlarePropsDev)
        lensFlarePropsDev = lensFlarePropsProd

    const lensFlareProps =
        (makeAdjustments && import.meta.env.DEV) ? lensFlarePropsDev : lensFlarePropsProd

    const effects = (
        <>
            <EffectComposer >
                <LensFlare dirtTextureFile={lensDirt}
                           {...lensFlareProps}/>
            </EffectComposer>
        </>
    )

    useFrame(({clock}) => {
        if (props.impl.update(clock)) {
            if (props.whole.current) {
                props.whole.current.position.set(...vector2array(props.impl.position))
                props.whole.current.rotation.set(...euler2array(props.impl.rotation))
            }
            if (props.geo.current)
                props.geo.current.scale(props.impl.scaling, props.impl.scaling, props.impl.scaling)
            if (props.light.current)
                props.light.current.intensity = props.impl.brightness
        }
    })

    return effects
}
