import React, {Children, ReactElement, useEffect, useMemo, useState} from "react"
import {useThree} from "@react-three/fiber"
import {Vector3} from "three"

import {defaultOrreryParams, orreryDataConfig, orreryDataServe} from "../../planetarium/orrery_impl.ts"
import Stars from "../Stars.tsx"
import {PlanetState} from "../../planetarium/planet_impl.ts"
import {SunState} from "../../planetarium/sun_impl.ts"
import {SatelliteState} from "../../planetarium/satellite_impl.ts"
import {SatelliteProps} from "../Satellite.tsx"
import {PlanetProps} from "../Planet.tsx"
import {SunProps} from "../SunImpl.tsx"
import {SpaceContext} from "./SpaceContext.tsx"
import {j2kToThreeJs} from "../../util/coordinates.ts"
import {earthConsts} from "../../planetarium/constants.ts"

import {getBrowserLocation} from "locate-user"
import {getApproximateBrowserLocation} from "locate-user"
import SpaceData from "space-data-api"



type GenericProps = SatelliteProps | PlanetProps | SunProps

export interface OrreryProps {
    children: ReactElement<GenericProps>[]
    suns?: number
    // eslint-disable-next-line
    cameras?: any //Cameras
    start?: Date
    duration?: number
    askLocation?: boolean
}

export function Orrery(props: OrreryProps) {
    const params = {...defaultOrreryParams}
    if (props.start)
        params.startAt = props.start
    if (props.duration)
        params.duration = props.duration

    const [ready, setReady] = useState(false)
    //const [system, setSystem] = useState<OrreryState>(initialOrreryState(params))
    // eslint-disable-next-line
    const [camPos, setCamPos] = useState<Vector3>(new Vector3(0, 0, 1))
    const propagator = useMemo(orreryDataServe, [])

    useEffect(() => {
        //if (!ready)
        //    return

        const sd = new SpaceData(orreryDataConfig);

        (async() => {
            // FIXME tz for debugging only
            const [lat, lon, alt] = props.askLocation ? getBrowserLocation("America/Denver") : getApproximateBrowserLocation()
            const altitude = alt + earthConsts.radius
            console.debug(`Location at ${lat} lat, ${lon} lon, ${altitude} m`)

            if (await sd.check() === null) {
                console.error("Unable to convert coordinates")
                return
            }
            // FIXME deal with units/magnitude
            const coords = await sd.fixedToJ2000(propagator.state.consts.start, lat, lon, altitude)
            console.log(coords)
            const cart = j2kToThreeJs(coords.x, coords.y, coords.z, coords.units, propagator.state.consts.scale)
            camera.position.set(cart.x, cart.y, cart.z)
            console.log(`Coords at ${cart.x}, ${cart.y}, ${cart.z}`)  // FIXME
        })()
            .catch((error: unknown) => {
                console.error(error)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])  //ready])

    useEffect(() => {
        document.addEventListener('keydown', propagator.onKeyDown)
        return () => {
            document.removeEventListener('keydown', propagator.onKeyDown);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const addSun = (state: SunState): number => {
        return propagator.addSun(state)  //flux in this thread updated asynchronously
    }

    const addPlanet = (state: PlanetState): number => {
        return propagator.addPlanet(state)
    }

    const addSatellite = (state: SatelliteState): number => {
        return propagator.addSatellite(state)
    }

    const {camera} = useThree()
    useEffect(() => {
        camera.position.set(camPos.x, camPos.y, camPos.z)
        console.log(`Cam pos ${camPos.x},${camPos.y},${camPos.z}`)  // FIXME
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        (async () =>
            await new Promise<boolean>((resolve, reject) => {
                const interval = 200  // check freq
                let timeOut = 10000  // total time before error
                const timer = setInterval(() => {
                    timeOut -= interval
                    if (timeOut < 1) {
                        clearInterval(timer)
                        reject(new Error('Timeout on initialization'))
                    }
                    if (propagator.state.flux.initialized && propagator.state.flux.sunStates.length>0) {
                        clearInterval(timer)
                        console.log("************ ready")  // FIXME
                        resolve(true)
                    }
                }, interval)
            })
        )()
            .then(() => { setReady(true) })  // should trigger re-render
            .catch((e) => { console.error(e)})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propagator.state.flux.initialized])

    //state.activeCamera = useThree().camera  // FIXME not working
    // FIXME use OrreryState camera
    //useThree.camera = system.flux.camera  // No

    const stars = Stars({size: propagator.state.consts.skymapSize})

    const suns: ReactElement<SunProps>[] = []
    const orbitals: ReactElement<GenericProps>[] = []
    Children.forEach(props.children, (child: ReactElement<SunProps> | ReactElement<GenericProps>) => {
        if (typeof child.type !== 'string' && 'classname' in child.type &&
            child.type['classname'] === "Sun") {
            suns.push(child as ReactElement<SunProps>)
        } else if (ready) {
            orbitals.push(child)
        }
    })

    // FIXME <OrbitControls minDistance={.77}/>
    const system = propagator.state
    console.log("Render Orrery")
    console.log(suns)
    console.log(props.children)
    return (
        <SpaceContext.Provider value={{ system, addSun, addPlanet, addSatellite }}>
            {stars}
            {suns}
            {orbitals}
        </SpaceContext.Provider>
    )
}
