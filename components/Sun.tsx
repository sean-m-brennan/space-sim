import React, {Component, ContextType, createRef} from "react";
import {extend} from "@react-three/fiber"
import {DirectionalLight, Group, SphereGeometry} from 'three'

import '../util/extDate'
import {SpaceContext} from "./SpaceContext"
import {SunState} from "../planetarium/sun"
import {randomSunConsts} from "../planetarium/orbital_data"
import {PropsOptional} from "../util/typing"
import {SunFrame, SunImpl, SunProps} from "./SunImpl"


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
		//const dirLight = (props.primary) ? access.system.primarySunlight : new DirectionalLight(color, 5.0)

		const effects = <></>  // FIXME
		impl.position.set(4, 0, 4)  // FIXME remove
		// FIXME align with sunStates [getLightDirections()]
		console.log(`Sun position == (${impl.position.x}, ${impl.position.y}, ${impl.position.z})`)
		return (
			<group ref={whole} position={impl.position}>
				{effects}
				<mesh>
					<sphereGeometry ref={geo} args={[impl.size, 32, 32]}/>
					<meshBasicMaterial color={impl.color}/>
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
