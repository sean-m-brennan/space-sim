import React, {Component, ContextType, createRef} from "react"
import {extend} from "@react-three/fiber"
import {DirectionalLight, Group, SphereGeometry, TextureLoader} from 'three'

import '../util/extDate'
import {SpaceContext} from "./mechanics/SpaceContext"
import {SunState} from "../planetarium/sun_impl"
import {randomSunConsts} from "../planetarium/orbital_data"
import {PropsOptional} from "../util/typing"
import {SunImpl, SunProps} from "./SunImpl"
import {SunFrame} from "./SunFrame"
import {imageFiles} from "./images.ts";


export class Sun extends Component<PropsOptional<SunProps>, SunState> {
	static classname = 'Sun'

	static contextType = SpaceContext
	declare context: ContextType<typeof SpaceContext>

	renderImpl(props: SunProps) {
		const ctx = this.context
		const impl = new SunImpl(ctx, props)
		const whole = createRef<Group>()
		const geo = createRef<SphereGeometry>()
		const light = createRef<DirectionalLight>()
		const sunSurface = new TextureLoader().load(imageFiles.stars.sun)
		//const dirLight = (props.primary) ? access.system.primarySunlight : new DirectionalLight(color, 5.0)

		impl.position.set(5, 0, 5)  // FIXME remove
		// FIXME align with sunStates [getLightDirections()]
		console.log(`Sun position == (${impl.position.x}, ${impl.position.y}, ${impl.position.z})`)


		return (
			<group ref={whole} position={impl.position}>
				<mesh userData={{ lensflare: "no-occlusion" }}>
					<sphereGeometry ref={geo} args={[impl.size, 32, 32]}/>
					<meshBasicMaterial color={impl.color} map={sunSurface}/>
				</mesh>
				<directionalLight ref={light} color={impl.color} intensity={impl.brightness}
                                  castShadow={ctx.system.consts.shadows}/>
				<SunFrame impl={impl} whole={whole} geo={geo} light={light}/>
			</group>
		)
	}

	render() {
		const props = {...randomSunConsts(), ...this.props}
		return this.renderImpl(props)
	}
}

extend({Sun})
