import { ResponsiveLine, Serie as LineSerie } from '@nivo/line'
import { ResponsiveScatterPlot, ScatterPlotRawSerie } from '@nivo/scatterplot'

import {Lagrangian, PositionMapping} from "../util/rocheLagrangian"
import {Planets, Satellites} from "../util/solar_consts"


export type ITNProps = {
    positions: PositionMapping
}

type LPt = {
    id: string
    x: number
    y: number
}

export default function ITN({positions}: ITNProps) {
    const contours: LineSerie[] = []
    const points: ScatterPlotRawSerie<LPt>[] = []

    for (const planet of Planets) {
        const pos = positions[planet.name]
        const orbPos = positions[planet.orbits.name]
        const l = new Lagrangian(planet.name, planet.mass, planet.orbits.mass, [pos.x, pos.y], [orbPos.x, orbPos.y])
        contours.push({id: planet.name, data: l.plotRoche()})
        points.push({id: planet.name, data: l.plotLagrangians()})
    }
    for (const sat of Satellites) {
        const pos = positions[sat.name]
        const orbPos = positions[sat.orbits.name]
        const l = new Lagrangian(sat.name, sat.mass, sat.orbits.mass, [pos.x, pos.y], [orbPos.x, orbPos.y])
        contours.push({id: sat.name, data: l.plotRoche()})
        points.push({id: sat.name, data: l.plotLagrangians()})
    }

    return (
        <>
            <ResponsiveLine
                data={contours}
                curve="natural"
            />
            <ResponsiveScatterPlot
                data={points}
            />
        </>
    )
}