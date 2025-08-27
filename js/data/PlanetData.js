// Planet data for Veauxalia
const PLANET_DATA = {
    Chimera: {
        name: "Chimera",
        type: "terrestrial",
        radius: 6371,
        gravity: 9.81,
        atmosphere: {
            composition: { nitrogen: 0.78, oxygen: 0.21, argon: 0.01 },
            pressure: 101.325,
            temperature: 288
        },
        terrain: {
            heightMap: "chimera_height",
            textureMap: "chimera_texture",
            features: ["mountains", "oceans", "forests", "deserts"]
        },
        resources: ["iron", "copper", "gold", "water", "organic_matter"],
        population: 7500000000,
        settlements: ["Nova Roma", "Chimera Prime", "Aurelia", "Vespera"]
    },
    
    Vespera: {
        name: "Vespera",
        type: "terrestrial",
        radius: 5432,
        gravity: 8.2,
        atmosphere: {
            composition: { carbon_dioxide: 0.95, nitrogen: 0.03, oxygen: 0.02 },
            pressure: 45.2,
            temperature: 245
        },
        terrain: {
            heightMap: "vespera_height",
            textureMap: "vespera_texture",
            features: ["volcanoes", "canyons", "ice_caps"]
        },
        resources: ["sulfur", "iron", "water_ice", "rare_metals"],
        population: 1200000000,
        settlements: ["Vespera Station", "Mining Colony Alpha", "Research Base Beta"]
    },
    
    Aurelia: {
        name: "Aurelia",
        type: "gas_giant",
        radius: 71492,
        gravity: 24.79,
        atmosphere: {
            composition: { hydrogen: 0.89, helium: 0.10, methane: 0.01 },
            pressure: 1000000,
            temperature: 165
        },
        terrain: {
            heightMap: "aurelia_height",
            textureMap: "aurelia_texture",
            features: ["storm_systems", "gas_layers", "magnetic_fields"]
        },
        resources: ["hydrogen", "helium", "methane", "ammonia"],
        population: 50000000,
        settlements: ["Aurelia Orbital", "Gas Mining Platform", "Research Station"]
    }
};