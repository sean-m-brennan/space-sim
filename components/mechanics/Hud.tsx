import React from "react"
import {Html} from "@react-three/drei"

import {Sidebar} from "primereact/sidebar"

import {imageFiles} from "../images"
import css from "./hud.module.css"

export interface HudProps {
    children?: React.ReactNode
    action: (evt: React.MouseEvent<HTMLDivElement>) => void
}

export function Hud(props: HudProps) {
    return (
        <Html occlude  userData={{ lensflare: "no-occlusion" }}> {/* occlude transform distanceFactor  position */}
            <Sidebar visible fullScreen
                     onHide={()=>{}}
                     showCloseIcon={false}>
                <img src={imageFiles.hud} alt="" className={css.mask}/>
                <div className={css.hud}>
                    {props.children}
                </div>
                <div className={css.action} onClick={props.action}/>
            </Sidebar>
        </Html>
    )
}