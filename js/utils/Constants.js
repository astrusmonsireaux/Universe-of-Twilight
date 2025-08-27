// Game Constants
const GAME_CONSTANTS = {
    // Physics
    GRAVITY: 9.81,
    TERMINAL_VELOCITY: 50,
    JUMP_FORCE: 8,
    WALK_SPEED: 5,
    RUN_SPEED: 8,
    FLY_SPEED: 15,
    
    // Rendering
    FOV: 75,
    NEAR_PLANE: 0.1,
    FAR_PLANE: 1000,
    SHADOW_MAP_SIZE: 2048,
    MAX_LIGHTS: 4,
    
    // World
    CHUNK_SIZE: 16,
    WORLD_HEIGHT: 256,
    SEA_LEVEL: 64,
    
    // Player
    PLAYER_HEIGHT: 1.8,
    PLAYER_WIDTH: 0.6,
    PLAYER_EYE_HEIGHT: 1.6,
    MAX_HEALTH: 100,
    MAX_ENERGY: 100,
    ENERGY_REGEN_RATE: 1, // per second
    HEALTH_REGEN_RATE: 0.5, // per second
    
    // Inventory
    INVENTORY_SLOTS: 5,
    STACK_SIZE: 64,
    
    // Crafting
    CRAFTING_GRID_SIZE: 3,
    
    // Time
    DAY_LENGTH: 1200, // seconds
    NIGHT_LENGTH: 1200, // seconds
    
    // Weather
    WEATHER_CHANGE_INTERVAL: 300, // seconds
    RAIN_PROBABILITY: 0.3,
    STORM_PROBABILITY: 0.1,
    
    // Audio
    SOUND_VOLUME: 0.5,
    MUSIC_VOLUME: 0.3,
    
    // UI
    HUD_UPDATE_INTERVAL: 100, // milliseconds
    MENU_ANIMATION_DURATION: 300, // milliseconds
    
    // Mobile
    TOUCH_SENSITIVITY: 0.5,
    MOBILE_UI_SCALE: 1.2
};

// Solar System Constants
const SOLAR_SYSTEM = {
    // Stars
    HIELEON: {
        name: "Hieleon",
        type: "G2V",
        mass: 1, // Solar masses
        radius: 1, // Solar radii
        temperature: 5778, // Kelvin
        luminosity: 1, // Solar luminosities
        distanceFromBarycenter: 1.67, // AU
        habitableZone: { inner: 0.8, outer: 1.6 }
    },
    
    NYXEON: {
        name: "Nyxeon",
        type: "K5V",
        mass: 0.5,
        radius: 0.7,
        temperature: 4000,
        luminosity: 0.1,
        distanceFromHieleon: 5, // AU
        distanceFromBarycenter: 3.33, // AU
        habitableZone: { inner: 0.3, outer: 0.6 }
    },
    
    // Planets
    NEFLAYM: {
        name: "Neflaym",
        type: "Rock",
        mass: 1, // Earth masses
        radius: 1, // Earth radii
        distanceFromHieleon: 1.5, // AU
        distanceFromNyxeon: 3.5, // AU
        host: "Hieleon",
        moons: ["Looneet"],
        atmosphere: { pressure: 1, composition: { N2: 0.78, O2: 0.21, Ar: 0.01 } },
        gravity: 1, // Earth gravity
        dayLength: 24, // hours
        yearLength: 365, // days
        temperature: { min: -50, max: 50 }, // Celsius
        biomes: ["temperate", "tropical", "desert", "arctic"]
    },
    
    PHANTOM: {
        name: "Phantom",
        type: "Dwarf Planet",
        mass: 0.00016, // Ceres mass
        radius: 0.00016, // Ceres radius
        distanceFromHieleon: 1, // AU
        distanceFromNyxeon: 4, // AU
        host: "Hieleon",
        moons: [],
        atmosphere: { pressure: 0, composition: {} },
        gravity: 0.00016,
        dayLength: 9, // hours
        yearLength: 365, // days
        temperature: { min: -200, max: 100 },
        biomes: ["asteroid", "cratered"]
    },
    
    ELISIUM: {
        name: "Elisium",
        type: "Rock",
        mass: 1,
        radius: 1,
        distanceFromHieleon: 4.6, // AU
        distanceFromNyxeon: 0.4, // AU
        host: "Nyxeon",
        moons: [],
        atmosphere: { pressure: 0.8, composition: { N2: 0.75, O2: 0.23, CO2: 0.02 } },
        gravity: 0.9,
        dayLength: 28, // hours
        yearLength: 180, // days
        temperature: { min: -30, max: 40 },
        biomes: ["temperate", "forest", "mountain", "ocean"]
    },
    
    TITAN: {
        name: "Titan",
        type: "Dwarf Planet",
        mass: 0.015, // Earth masses
        radius: 0.18, // Pluto radius
        distanceFromHieleon: 4.4, // AU
        distanceFromNyxeon: 0.6, // AU
        host: "Nyxeon",
        moons: [],
        atmosphere: { pressure: 0.1, composition: { N2: 0.95, CH4: 0.05 } },
        gravity: 0.015,
        dayLength: 16, // hours
        yearLength: 200, // days
        temperature: { min: -180, max: -100 },
        biomes: ["ice", "methane", "cryogenic"]
    },
    
    CHIMERA: {
        name: "Chimera",
        type: "Rock",
        mass: 1.5, // Earth masses
        radius: 1.2, // Earth radii
        distanceFromHieleon: 10, // AU
        distanceFromNyxeon: 5, // AU
        host: "Both",
        moons: ["Venairum", "Hybros"],
        atmosphere: { pressure: 1.2, composition: { N2: 0.75, O2: 0.22, CO2: 0.03 } },
        gravity: 1.2,
        dayLength: 26, // hours
        yearLength: 500, // days
        temperature: { min: -20, max: 60 },
        biomes: ["temperate", "tropical", "desert", "arctic", "ocean", "forest", "mountain", "swamp", "tundra", "volcanic"],
        continents: 10,
        civilization: "United Empire of Gauletria"
    },
    
    // Gas Giants
    BAYLEPHON: {
        name: "Baylephon",
        type: "Gas Giant",
        mass: 8, // Earth masses
        radius: 3, // Earth radii
        distanceFromHieleon: 15, // AU
        distanceFromNyxeon: 10, // AU
        host: "Both",
        moons: 4,
        atmosphere: { pressure: 100, composition: { H2: 0.75, He: 0.24, CH4: 0.01 } },
        gravity: 2.5,
        dayLength: 12, // hours
        yearLength: 800, // days
        temperature: { min: -150, max: -50 },
        biomes: ["gas", "storm", "aurora"]
    },
    
    DIMETRIAN: {
        name: "Dimetrian",
        type: "Gas Giant",
        mass: 159, // 0.5 Jupiter masses
        radius: 8, // Earth radii
        distanceFromHieleon: 25, // AU
        distanceFromNyxeon: 20, // AU
        host: "Both",
        moons: 5,
        atmosphere: { pressure: 1000, composition: { H2: 0.75, He: 0.24, CH4: 0.01 } },
        gravity: 2.8,
        dayLength: 10, // hours
        yearLength: 1500, // days
        temperature: { min: -200, max: -100 },
        biomes: ["gas", "storm", "aurora", "ring"]
    },
    
    SUFREIGN: {
        name: "Sufreign",
        type: "Gas Giant",
        mass: 159, // 0.5 Jupiter masses
        radius: 8, // Earth radii
        distanceFromHieleon: 35, // AU
        distanceFromNyxeon: 30, // AU
        host: "Both",
        moons: 5,
        atmosphere: { pressure: 1000, composition: { H2: 0.75, He: 0.24, CH4: 0.01 } },
        gravity: 2.8,
        dayLength: 8, // hours
        yearLength: 2500, // days
        temperature: { min: -250, max: -150 },
        biomes: ["gas", "storm", "aurora", "ring"]
    },
    
    // Ice Dwarf Planets
    AREON: {
        name: "Areon",
        type: "Ice Dwarf",
        mass: 0.0022, // Pluto mass
        radius: 0.2, // Earth radii
        distanceFromHieleon: 40, // AU
        distanceFromNyxeon: 35, // AU
        host: "Both",
        moons: [],
        atmosphere: { pressure: 0, composition: {} },
        gravity: 0.0022,
        dayLength: 6, // hours
        yearLength: 4000, // days
        temperature: { min: -270, max: -200 },
        biomes: ["ice", "cryogenic", "comet"]
    },
    
    GALLIAN: {
        name: "Gallian",
        type: "Ice Dwarf",
        mass: 0.0022,
        radius: 0.2,
        distanceFromHieleon: 45, // AU
        distanceFromNyxeon: 40, // AU
        host: "Both",
        moons: [],
        atmosphere: { pressure: 0, composition: {} },
        gravity: 0.0022,
        dayLength: 6,
        yearLength: 5000, // days
        temperature: { min: -270, max: -200 },
        biomes: ["ice", "cryogenic", "comet"]
    },
    
    LAGNIA: {
        name: "Lagnia",
        type: "Ice Dwarf",
        mass: 0.0022,
        radius: 0.2,
        distanceFromHieleon: 50, // AU
        distanceFromNyxeon: 45, // AU
        host: "Both",
        moons: [],
        atmosphere: { pressure: 0, composition: {} },
        gravity: 0.0022,
        dayLength: 6,
        yearLength: 6000, // days
        temperature: { min: -270, max: -200 },
        biomes: ["ice", "cryogenic", "comet"]
    }
};

// Species Constants
const HOMO_KAYLEX = {
    name: "Homo Kaylex",
    origin: "Chimera",
    lifespan: { min: 0, max: 250 }, // years
    bodyPlan: "Humanoid and Elfish",
    energySource: "Photosynthesis + Consumption",
    entityType: "Animal (Primate-like)",
    language: "Gaulsais",
    culture: "United Empire of Gauletria",
    government: "Imperial Elastic Democracy",
    religion: "Atheism",
    technology: "Type 1 Civilization",
    specialTraits: ["Biologically incapable of lying", "Hermaphroditic", "Photosynthetic skin"],
    appearance: {
        skinColors: ["purple", "violet", "mauve"],
        eyeColors: ["black", "blue", "green", "crimson"],
        height: { min: 1.6, max: 2.0 }, // meters
        build: "Physically fit and strong"
    }
};

// Time System
const TIME_SYSTEM = {
    yearLength: 500, // days
    monthLength: 25, // days
    weekLength: 5, // days
    dayLength: 26, // hours (Chimera)
    months: [
        "Primus", "Secundus", "Tertius", "Quartus", "Quintus",
        "Sextus", "Septimus", "Octavus", "Nonus", "Decimus",
        "Undecimus", "Duodecimus", "Tertius Decimus", "Quartus Decimus", "Quintus Decimus",
        "Sextus Decimus", "Septimus Decimus", "Octavus Decimus", "Nonus Decimus", "Vicesimus"
    ]
};

// Export constants for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GAME_CONSTANTS, SOLAR_SYSTEM, HOMO_KAYLEX, TIME_SYSTEM };
}