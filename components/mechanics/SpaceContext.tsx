import {createContext} from "react"
import {initialOrreryState, OrreryState} from "../../planetarium/orrery_impl.ts"
import {SunState} from "../../planetarium/sun_impl.ts"
import {PlanetState} from "../../planetarium/planet_impl.ts"
import {SatelliteState} from "../../planetarium/satellite_impl.ts"


export type SystemAccessors = {
    system: OrreryState
    addSun: (state: SunState) => number
    addPlanet: (state: PlanetState) => number
    addSatellite: (state: SatelliteState) => number
}

const nullAccessor = {
    system: initialOrreryState(),
    addSun: () => -1,
    addPlanet: () => -1,
    addSatellite: () => -1,
}

export const SpaceContext = createContext<SystemAccessors>(nullAccessor)
