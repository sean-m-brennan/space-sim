import {Planets, Satellites} from "./solar_consts"


export enum LagrangePoint {
    L1 = 1,
    L2,
    L3,
    L4,
    L5,
}

const polar2cartesian = (phi: number, rho: number): [number, number] => {
    return [rho * Math.cos(phi), rho * Math.sin(phi)]
}

export type Mesh =
    {
        x: number
        y: number
        z: number
    }[]

export type Points =
    {
        id: string
        x: number
        y: number
    }[]


export class Lagrangian {
    public static Point = LagrangePoint
    private name: string
    private readonly x1: number
    private readonly x2: number
    private readonly p1?: [number, number]
    private readonly p2?: [number, number]

    constructor(id: string, m1: number, m2: number, p1?: [number, number], p2?: [number, number]) {
        const q = m1 < m2 ? m1 / m2 : m2 / m1
        //const m = m1 + m2
        //this.x1 = m / (q + 1)
        //this.x2 = m * q / (q + 1)
        // improve computability
        this.x1 = -1 / (q + 1)
        this.x2 = q / (q + 1)
        this.p1 = p1
        this.p2 = p2
        this.name = id
    }

    newtonianSolver (low: number, high: number, deriv: (n:number)=>number) {
        let x = 0
        while (Math.abs(low - high) > 1e-10) {
            x = 0.5 * (low + high)
            if (deriv(x) > 0.)
                low = x
            else
                high = x
        }
        return x
    }

    lagrangianCoords = (l: LagrangePoint): [number, number] => {
        const derivative = (x: number) =>
            +this.x2 / Math.pow(x - this.x1, 2) * Math.sign(x - this.x1) -
            this.x1 / Math.pow(x - this.x2, 2) * Math.sign(x - this.x2) - x

        // L1:
        let unitPoint = [this.newtonianSolver(this.x1 * 0.99, this.x2 * 0.99, derivative), 0.]
        if (l === LagrangePoint.L2)
            unitPoint = [this.newtonianSolver(this.x2 * 1.01, 2, derivative), 0.]
        if (l === LagrangePoint.L3)
            unitPoint = [this.newtonianSolver(-2, this.x1 * 1.01, derivative), 0.]
        if (l === LagrangePoint.L4)
            unitPoint = [0.5 * (this.x1 + this.x2), Math.sqrt(3) / 2 * Math.abs(this.x1 - this.x2)]
        if (l === LagrangePoint.L5)
            unitPoint = [0.5 * (this.x1 + this.x2), -(Math.sqrt(3) / 2 * Math.abs(this.x1 - this.x2))]
        if (!this.p1 || !this.p2)
            return unitPoint as [number, number]
        // FIXME convert
        return unitPoint as [number, number]
    }
    
    rochePotential(x: number, y: number): number {
        return (-this.x2 / Math.sqrt(Math.pow(x - this.x1, 2) + Math.pow(y, 2)))
            +(this.x1 / Math.sqrt(Math.pow(x - this.x2, 2) + Math.pow(y, 2)))
            -0.5 * (Math.pow(x, 2) + Math.pow(y, 2))
    }

    private linspace(startValue: number, stopValue: number, cardinality: number) {
        const arr = [];
        const step = (stopValue - startValue) / (cardinality - 1);
        for (let i = 0; i < cardinality; i++) {
            arr.push(startValue + (step * i));
        }
        return arr;
    }

    private meshgrid(x: number[], y: number[]): [number[][], number[][]] {
        const xx: number[][] = [], yy: number[][] = []
        for (let i = 0; i < y.length; i++) {
            xx.push(x)
            const y_row: number[] = []
            for (let _j = 0; _j < x.length; _j++) {
                y_row.push(y[i]);
            }
            yy.push(y_row)
        }
        return [xx, yy]
    }

    private alter_raw_z(z_val: number): number {
        return z_val //Math.log10(Math.log10(Math.abs(z_val)))
    }

    private compute_z_val(x_val: number, y_val: number): number {
        const z_val = this.rochePotential(x_val, y_val)
        return this.alter_raw_z(z_val)
    }

    private mesh(points: number = 1024, radius: number | null = null, limit: number = 0., columnar: boolean = false): Mesh | [number[][], number[][], number[][]] {
        points = Math.floor(points * Math.PI)
        let start = .75
        let end = Math.PI / 2.5
        if (radius) {
            start = limit
            end = radius
        }
        const extra = 2. * Math.PI / points + 0.01
        const phi = this.linspace(0, 2. * Math.PI + extra, points)
        const rho = this.linspace(start, end, points)
        const [rho2, phi2] = this.meshgrid(rho, phi)  // matrices
        const mesh :Mesh = []

        const x: number[][] = [], y: number[][] = []
        for (let i=0; i<phi2.length; i++) {
            const x_row: number[] = []
            const y_row: number[] = []
            for (let j=0; j<rho2.length; j++) {
                const [p, q] = polar2cartesian(phi2[i][j], rho2[i][j])
                x_row.push(p)
                y_row.push(q)
            }
            x.push(x_row)
            y.push(y_row)
        }
        const z: number[][] = []
        for (let i=0; i<x.length; i++) {
            const z_row: number[] = []
            for (let j = 0; j < y.length; j++) {
                const z_val = this.compute_z_val(x[i][j], y[i][j])
                z_row.push(z_val)
                mesh.push({x: x[i][j], y: y[i][j], z: z_val})
            }
            z.push(z_row)
        }
        // FIXME convert x, y, (z?)
        if (columnar)
            return [x, y, z]
        return mesh
    }

    plotRoche() {
        return this.mesh()
    }

    plotLagrangians(): Points {
        const points: Points = []
        Object.keys(LagrangePoint).forEach((pt, index) => {
            const [x, y] = this.lagrangianCoords(index)
            points.push({id: `${this.name}:${pt}`, x: x, y: y})
        })
        return points
    }
}

export interface EclipticPosition {
    x: number
    y: number
    z: number
}

export type PositionMapping = {[name: string]: EclipticPosition}


export const InterplanetaryData = (positions: PositionMapping): [Mesh[], Points[]] => {
    const contours: Mesh[] = []
    const points: Points[] = []
    for (const planet of Planets) {
        const pos = positions[planet.name]
        const orbPos = positions[planet.orbits.name]
        const l = new Lagrangian(planet.name, planet.mass, planet.orbits.mass, [pos.x, pos.y], [orbPos.x, orbPos.y])
        contours.push(l.plotRoche() as Mesh)
        points.push(l.plotLagrangians())
    }
    for (const sat of Satellites) {
        const pos = positions[sat.name]
        const orbPos = positions[sat.orbits.name]
        const l = new Lagrangian(sat.name, sat.mass, sat.orbits.mass, [pos.x, pos.y], [orbPos.x, orbPos.y])
        contours.push(l.plotRoche() as Mesh)
        points.push(l.plotLagrangians())
    }
    return [contours, points]
}