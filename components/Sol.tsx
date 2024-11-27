import {extend} from "@react-three/fiber"

import {Sun} from "./Sun.tsx"
import {solConsts} from "../planetarium/constants.ts"

export class Sol extends Sun {
    render() {
        return super.renderImpl(solConsts)
    }
}

extend({Sol})
