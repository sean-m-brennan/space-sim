import {useEffect, useState } from 'react'
import { ResponsiveLine, Serie as LineSerie } from '@nivo/line'
import { ResponsiveScatterPlot, ScatterPlotRawSerie } from '@nivo/scatterplot'
import { SelectButton } from 'primereact/selectbutton'

import {Lagrangian, PositionMapping} from "../util/rocheLagrangian"
import {Planets, Satellites} from "../util/solar_consts"
import SpaceData from "space-data-api"
import {orreryDataConfig} from "../planetarium/orrery_impl.ts"


export type ITNProps = {
    energy?: number  // FIXME require (dump selector from here)
    includes?: string[]
    excludes?: string[]
}

type LPt = {
    id: string
    x: number
    y: number
}

type EnergyLevel = {
    name: string
    value: number
}


export default function ITN(props: ITNProps) {
    const [contours, setContours] = useState<LineSerie[]>([])
    const [points, setPoints] = useState<ScatterPlotRawSerie<LPt>[]>([])
    const energies: EnergyLevel[] = [
        { name: 'Low', value: 1 },
        { name: 'Medium', value: 2 },
        { name: 'High', value: 3 },
    ]
    const [energy, setEnergy] = useState<EnergyLevel>(energies[0])

    useEffect(() => {
        const sd = new SpaceData(orreryDataConfig);

        (async() => {
            if (await sd.check() === null) {
                console.error("Unable to obtain coordinates")
                return
            }
            const positions: PositionMapping = {};
            const now = new Date()
            const names = Planets.map(planet=>planet.name).concat(Satellites.map(sat=>sat.name))
            for (const name of names) {
                if (props.includes && !props.includes.includes(name))
                    continue
                if (props.excludes && props.excludes.includes(name))
                    continue
                const v = await sd.currentPosition(now, name)
                positions[name] = {x: v.x, y: v.y, z: v.z}
                console.log(`${name} coords at ${v.x}, ${v.y}, ${v.z}`)  // FIXME remove
            }

            const curContours = []
            const curPoints = []
            for (const planet of Planets) {
                if (!positions[planet.name])
                    continue
                const pos = positions[planet.name]
                const orbPos = positions[planet.orbits.name]
                // FIXME Cannot read properties of undefined (reading 'x')
                const l = new Lagrangian(planet.name, planet.mass, planet.orbits.mass, [pos.x, pos.y], [orbPos.x, orbPos.y])
                curContours.push({id: planet.name, data: l.plotRoche()})  // FIXME specific to energy
                curPoints.push({id: planet.name, data: l.plotLagrangians()})
            }
            for (const sat of Satellites) {
                const pos = positions[sat.name]
                const orbPos = positions[sat.orbits.name]
                const l = new Lagrangian(sat.name, sat.mass, sat.orbits.mass, [pos.x, pos.y], [orbPos.x, orbPos.y])
                curContours.push({id: sat.name, data: l.plotRoche()})
                curPoints.push({id: sat.name, data: l.plotLagrangians()})
            }
            setContours(curContours)
            setPoints(curPoints)
        })()
            .catch((error: unknown) => {
                console.error(error)
            })
    }, [energy])

    return (
        <>
            <SelectButton value={energy} onChange={(e) => setEnergy(e.value as EnergyLevel)}
                          optionLabel="name" options={energies} multiple />
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