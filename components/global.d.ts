import {PlanetMaterial, PlanetMaterialProps} from "./shaders/planet_material.tsx"
import {AtmosphereMaterial, AtmosphereMaterialProps} from "./shaders/atmosphere_material.tsx"
import {CloudMaterial, CloudMaterialProps} from "./shaders/cloud_material.tsx"
import {Orrery, OrreryProps} from "./mechanics/Orrery.tsx"
import {Sun} from "./Sun.tsx"
import {SunProps} from "./SunImpl.tsx"
import {Planet, PlanetProps} from "./Planet.tsx"
import {Satellite, SatelliteProps} from "./Satellite.tsx"
import {Earth, EarthProps} from "./Earth.tsx"
import {Moon, MoonProps} from "./Moon.tsx"
import {Sol} from "./Sol.tsx"
import {EmptyProps, PropsOptional} from "../util/typing.ts"

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'planetMaterial': PlanetMaterial<PlanetMaterialProps>
            'atmosphereMaterial': AtmosphereMaterial<AtmosphereMaterialProps>
            'cloudMaterial': CloudMaterial<CloudMaterialProps>
            'orrery': Orrery<OrreryProps>
            'planet': Planet<PlanetProps>
            'satellite': Satellite<SatelliteProps>
            'sun': Sun<PropsOptional<SunProps>>
            'earth': Earth<EarthProps>
            'moon': Moon<MoonProps>
            'sol': Sol<EmptyProps>
        }
    }
}
