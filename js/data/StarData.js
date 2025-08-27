// Star data for Veauxalia
const STAR_DATA = {
    Veauxalia: {
        name: "Veauxalia",
        type: "G2V",
        mass: 1.0,
        radius: 696340,
        temperature: 5778,
        luminosity: 1.0,
        age: 4.6e9,
        spectral_class: "G2V",
        color: 0xffff00,
        position: { x: 0, y: 0, z: 0 },
        planets: ["Chimera", "Vespera", "Aurelia"],
        habitable_zone: {
            inner: 0.95,
            outer: 1.37
        },
        solar_wind: {
            speed: 400,
            density: 5,
            temperature: 100000
        },
        magnetic_field: {
            strength: 25e-6,
            polarity: "north"
        }
    },
    
    Nova: {
        name: "Nova",
        type: "A0V",
        mass: 2.5,
        radius: 1200000,
        temperature: 9500,
        luminosity: 25.0,
        age: 1.2e8,
        spectral_class: "A0V",
        color: 0x87ceeb,
        position: { x: 1000, y: 0, z: 0 },
        planets: [],
        habitable_zone: {
            inner: 5.0,
            outer: 7.0
        },
        solar_wind: {
            speed: 800,
            density: 2,
            temperature: 200000
        },
        magnetic_field: {
            strength: 50e-6,
            polarity: "south"
        }
    },
    
    Twilight: {
        name: "Twilight",
        type: "M3V",
        mass: 0.3,
        radius: 200000,
        temperature: 3200,
        luminosity: 0.02,
        age: 8.5e9,
        spectral_class: "M3V",
        color: 0xff4500,
        position: { x: -800, y: 0, z: 0 },
        planets: ["Shadow"],
        habitable_zone: {
            inner: 0.14,
            outer: 0.20
        },
        solar_wind: {
            speed: 200,
            density: 10,
            temperature: 50000
        },
        magnetic_field: {
            strength: 10e-6,
            polarity: "north"
        }
    }
};