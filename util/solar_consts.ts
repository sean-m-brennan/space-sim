
export interface Celestial {
    name: string
    mass: number
    radius: number
    semimajor: number
    orbits: Celestial | null
}

export const Sun = {name: "Sun", mass: 1.9884e30, radius: 695700, semimajor: 0, orbits: null}

export const Mercury = {name: "Mercury", mass: 0.33010e24, radius: 2439.7, semimajor: 57.909e6, orbits: Sun}
export const Venus = {name: "Venus", mass: 4.8673e24, radius: 6051.8, semimajor: 108.210e6, orbits: Sun}
export const Earth = {name: "Earth", mass: 5.974e24, radius: 6371., semimajor: 149.59887e6, orbits: Sun}
export const Mars = {name: "Mars", mass: 0.64169e24, radius: 3389.5, semimajor: 227.956e6, orbits: Sun}
export const Jupiter = {name: "Jupiter", mass: 1898.13e24, radius: 71492., semimajor: 778.479e6, orbits: Sun}
export const Saturn = {name: "Saturn", mass: 568.32e24, radius: 58232., semimajor: 1432.041e6, orbits: Sun}
export const Uranus = {name: "Uranus", mass: 86.811e24, radius: 25362., semimajor: 2867.043e6, orbits: Sun}
export const Neptune = {name: "Neptune", mass: 102.409e24, radius: 24622., semimajor: 4514.953e6, orbits: Sun}
export const Pluto = {name: "Pluto", mass: 0.01303e24, radius: 1188., semimajor: 5869.656e6, orbits: Sun}
export const Planets = [Pluto, Neptune, Uranus, Saturn, Jupiter, Mars, Earth, Venus, Mercury]

export const Moon = {name: "Moon", mass: 0.007348e24, radius: 1737.4, semimajor: 38.44e6, orbits: Earth}
export const Satellites = [Moon]
