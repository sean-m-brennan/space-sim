import starsLarge from "../public/images/stars/TychoSkymapII.t5_16384x08192.jpg"
import starsSmall from "../public/images/stars/TychoSkymapII.t4_04096x02048.jpg"

import moonLarge from "../public/images/moon/lroc_color_poles_4k.jpg"
import moonSmall from "../public/images/moon/lroc_color_poles_1k.jpg"
import moonNormal from "../public/images/moon/ldem_3_8bit.jpg"
import moonNight from "../public/images/moon/darkside_2048.jpg"

import earthNightLarge from "../public/images/earth/earth_vir_2016_lrg.jpg"
import earthNightLargeAlt from "../public/images/earth/earth_vir_2016_lrg_2.jpg"
import earthNightSmall from "../public/images/earth/earth_vir_2016.jpg"
import earthNightSmallAlt from "../public/images/earth/earth_vir_2016_2.jpg"
import earthNormal from "../public/images/earth/gebco_08_rev_elev_21600x10800.png"
import earthNormalAlt from "../public/images/earth/8k_earth_normal_map.jpg"
import earthSpecular from "../public/images/earth/gebco_08_rev_bath_3600x1800_color.jpg"
import earthSpecularAlt from "../public/images/earth/8k_earth_specular_map.jpg"
import earthClouds from "../public/images/earth/cloud_combined_2048.png"
import earthCloudsAlt from "../public/images/earth/Transparent_Fair_Weather_Clouds_Mapx2048x1024.png"

import earthLargeJan from "../public/images/earth/world.200401.3x5400x2700.jpg"
import earthLargeFeb from "../public/images/earth/world.200402.3x5400x2700.jpg"
import earthLargeMar from "../public/images/earth/world.200403.3x5400x2700.jpg"
import earthLargeApr from "../public/images/earth/world.200404.3x5400x2700.jpg"
import earthLargeMay from "../public/images/earth/world.200405.3x5400x2700.jpg"
import earthLargeJun from "../public/images/earth/world.200406.3x5400x2700.jpg"
import earthLargeJul from "../public/images/earth/world.200407.3x5400x2700.jpg"
import earthLargeAug from "../public/images/earth/world.200408.3x5400x2700.jpg"
import earthLargeSep from "../public/images/earth/world.200409.3x5400x2700.jpg"
import earthLargeOct from "../public/images/earth/world.200410.3x5400x2700.jpg"
import earthLargeNov from "../public/images/earth/world.200411.3x5400x2700.jpg"
import earthLargeDec from "../public/images/earth/world.200412.3x5400x2700.jpg"

import earthSmallJan from "../public/images/earth/world.200401.3x2048x1024.jpg"
import earthSmallFeb from "../public/images/earth/world.200402.3x2048x1024.jpg"
import earthSmallMar from "../public/images/earth/world.200403.3x2048x1024.jpg"
import earthSmallApr from "../public/images/earth/world.200404.3x2048x1024.jpg"
import earthSmallMay from "../public/images/earth/world.200405.3x2048x1024.jpg"
import earthSmallJun from "../public/images/earth/world.200406.3x2048x1024.jpg"
import earthSmallJul from "../public/images/earth/world.200407.3x2048x1024.jpg"
import earthSmallAug from "../public/images/earth/world.200408.3x2048x1024.jpg"
import earthSmallSep from "../public/images/earth/world.200409.3x2048x1024.jpg"
import earthSmallOct from "../public/images/earth/world.200410.3x2048x1024.jpg"
import earthSmallNov from "../public/images/earth/world.200411.3x2048x1024.jpg"
import earthSmallDec from "../public/images/earth/world.200412.3x2048x1024.jpg"

import habitatLarge from "../public/images/habitat/photos_2015_12_8_fst_785695bfe87-bef4-482a-8fd7-9543ccc63873.jpg"  // FIXME
//import habitatLarge from "./habitat/photos_2017_11_10_fst_grass-lawn-texture.jpg"  // FIXME
import habitatNormal from "../public/images/moon/ldem_3_8bit.jpg"  // FIXME
import habitatNight from "../public/images/moon/darkside_2048.jpg"  // FIXME

//import asteroidIcon from "../public/images/icons/asteroid.png"
import earthIcon from "../public/images/icons/earth.png"
import jupiterIcon from "../public/images/icons/jupiter.png"
import marsIcon from "../public/images/icons/mars.png"
import mercuryIcon from "../public/images/icons/mercury.png"
import moonIcon from "../public/images/icons/moon.png"
import neptuneIcon from "../public/images/icons/neptune.png"
//import plutoIcon from "../public/images/icons/pluto.png"
import saturnIcon from "../public/images/icons/saturn.png"
import sunIcon from "../public/images/icons/sun.png"
import uranusIcon from "../public/images/icons/uranus.png"
import venusIcon from "../public/images/icons/venus.png"

import hudMask from "../public/images/hud_mask.png"

export const credits= [
  {url: "https://svs.gsfc.nasa.gov", label: "NASA Scientific Visualization Studio"},
  {url: "https://eoimages.gsfc.nasa.gov", label: "NASA Earth Observatory"},
  {url: "https://www.freepik.com/free-vector/planets-galaxy_4228290.htm", label: "Icons designed by Freepik"}
]

export const imageFiles = {
    stars: {
        large: starsLarge,
        small: starsSmall,
    },

    earth: {
        night: {
            large: earthNightLarge,
            small: earthNightSmall,
        },
        normal: earthNormal,
        specular: earthSpecular,
        clouds: earthClouds,

        large: [
            earthLargeJan, earthLargeFeb, earthLargeMar, earthLargeApr,
            earthLargeMay, earthLargeJun, earthLargeJul, earthLargeAug,
            earthLargeSep, earthLargeOct, earthLargeNov, earthLargeDec,
        ],
        small: [
            earthSmallJan, earthSmallFeb, earthSmallMar, earthSmallApr,
            earthSmallMay, earthSmallJun, earthSmallJul, earthSmallAug,
            earthSmallSep, earthSmallOct, earthSmallNov, earthSmallDec,
        ],
    },

    earthAlt: {
        night: {
            large: earthNightLargeAlt,
            small: earthNightSmallAlt,
        },
        normal: earthNormalAlt,
        specular: earthSpecularAlt,
        clouds: earthCloudsAlt,

        large: [
            earthLargeJan, earthLargeFeb, earthLargeMar, earthLargeApr,
            earthLargeMay, earthLargeJun, earthLargeJul, earthLargeAug,
            earthLargeSep, earthLargeOct, earthLargeNov, earthLargeDec,
        ],
        small: [
            earthSmallJan, earthSmallFeb, earthSmallMar, earthSmallApr,
            earthSmallMay, earthSmallJun, earthSmallJul, earthSmallAug,
            earthSmallSep, earthSmallOct, earthSmallNov, earthSmallDec,
        ],
    },

    moon: {
        large: moonLarge,
        small: moonSmall,
        normal: moonNormal,
        night: moonNight,
    },

    habitats: [
        {
            large: habitatLarge,
            normal: habitatNormal,
            night: habitatNight,
        }
    ],

    icons: {
        //asteroid: asteroidIcon,
        earth: earthIcon,
        jupiter: jupiterIcon,
        mars: marsIcon,
        mercury: mercuryIcon,
        moon: moonIcon,
        neptune: neptuneIcon,
        //pluto: plutoIcon,
        saturn: saturnIcon,
        sun: sunIcon,
        uranus: uranusIcon,
        venus: venusIcon,
    },

    hud: hudMask,
}