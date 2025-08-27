// Enhanced Item data for Veauxalia with United Empire lore
const ITEM_DATA = {
    // Basic materials
    rock: {
        name: "Rock",
        type: "material",
        stackable: true,
        maxStack: 64,
        description: "Basic building material",
        lore: "Common mineral found throughout the Veauxalia system",
        icon: "🪨"
    },
    
    stone: {
        name: "Stone",
        type: "material",
        stackable: true,
        maxStack: 64,
        description: "Refined stone for construction",
        lore: "Processed rock used in Imperial construction projects",
        icon: "🧱"
    },
    
    wood: {
        name: "Wood",
        type: "material",
        stackable: true,
        maxStack: 64,
        description: "Harvested from trees",
        lore: "Organic material from Chimera's diverse forests",
        icon: "🪵"
    },
    
    stick: {
        name: "Stick",
        type: "material",
        stackable: true,
        maxStack: 64,
        description: "Basic crafting material",
        lore: "Simple wooden implement used in traditional crafting",
        icon: "🦯"
    },
    
    iron_ore: {
        name: "Iron Ore",
        type: "material",
        stackable: true,
        maxStack: 64,
        description: "Raw iron for smelting",
        lore: "Essential metal ore for Imperial technology",
        icon: "⛏️"
    },
    
    // Natural resources
    herb: {
        name: "Herb",
        type: "material",
        stackable: true,
        maxStack: 32,
        description: "Medicinal plant",
        lore: "Traditional healing plant used by Homo Kaylex for generations",
        icon: "🌿"
    },
    
    rare_herb: {
        name: "Rare Herb",
        type: "material",
        stackable: true,
        maxStack: 16,
        description: "Uncommon medicinal plant",
        lore: "Scarce healing plant with enhanced properties",
        icon: "🌱"
    },
    
    crystal: {
        name: "Crystal",
        type: "material",
        stackable: true,
        maxStack: 16,
        description: "Mystical crystal with special properties",
        lore: "Energy-conducting crystal used in Imperial technology",
        icon: "💎"
    },
    
    rare_crystal: {
        name: "Rare Crystal",
        type: "material",
        stackable: true,
        maxStack: 8,
        description: "Rare mystical crystal",
        lore: "Precious crystal with exceptional energy properties",
        icon: "🔮"
    },
    
    water: {
        name: "Water",
        type: "material",
        stackable: true,
        maxStack: 16,
        description: "Essential for survival",
        lore: "Life-sustaining liquid found on habitable worlds",
        icon: "💧"
    },
    
    // Tools
    wooden_pickaxe: {
        name: "Wooden Pickaxe",
        type: "tool",
        durability: 100,
        efficiency: 1.0,
        description: "Basic mining tool",
        lore: "Traditional mining implement used by early settlers",
        icon: "⛏️"
    },
    
    stone_pickaxe: {
        name: "Stone Pickaxe",
        type: "tool",
        durability: 200,
        efficiency: 1.5,
        description: "Improved mining tool",
        lore: "Enhanced mining tool with better durability",
        icon: "⛏️"
    },
    
    iron_pickaxe: {
        name: "Iron Pickaxe",
        type: "tool",
        durability: 400,
        efficiency: 2.0,
        description: "Advanced mining tool",
        lore: "Imperial-grade mining equipment for efficient resource extraction",
        icon: "⛏️"
    },
    
    wooden_axe: {
        name: "Wooden Axe",
        type: "tool",
        durability: 100,
        efficiency: 1.0,
        description: "Basic wood cutting tool",
        lore: "Traditional tool for harvesting organic materials",
        icon: "🪓"
    },
    
    stone_axe: {
        name: "Stone Axe",
        type: "tool",
        durability: 200,
        efficiency: 1.5,
        description: "Improved wood cutting tool",
        lore: "Enhanced wood cutting tool with better efficiency",
        icon: "🪓"
    },
    
    // Structures
    campfire: {
        name: "Campfire",
        type: "structure",
        durability: 1000,
        description: "Provides light, warmth, and cooking capability",
        lore: "Ancient technology still useful in modern exploration",
        icon: "🔥"
    },
    
    shelter: {
        name: "Basic Shelter",
        type: "structure",
        durability: 2000,
        description: "Protection from weather and environmental hazards",
        lore: "Standard survival structure used by Empire explorers",
        icon: "🏠"
    },
    
    advanced_shelter: {
        name: "Advanced Shelter",
        type: "structure",
        durability: 5000,
        description: "Enhanced protection with energy systems",
        lore: "Modern Imperial technology for long-term habitation",
        icon: "🏢"
    },
    
    // Consumables
    fruit: {
        name: "Fruit",
        type: "food",
        nutrition: 10,
        energy: 5,
        description: "Fresh fruit for sustenance",
        lore: "Nutritious organic food from Chimera's orchards",
        icon: "🍎"
    },
    
    medicine: {
        name: "Basic Medicine",
        type: "consumable",
        healthRestore: 25,
        description: "Restores health and treats minor injuries",
        lore: "Traditional healing knowledge preserved by Homo Kaylex",
        icon: "💊"
    },
    
    energy_potion: {
        name: "Energy Potion",
        type: "consumable",
        energyRestore: 30,
        description: "Boosts energy and enhances photosynthesis",
        lore: "Specially formulated for Homo Kaylex physiology",
        icon: "🧪"
    },
    
    enhanced_medicine: {
        name: "Enhanced Medicine",
        type: "consumable",
        healthRestore: 50,
        description: "Advanced healing with rapid recovery",
        lore: "Imperial medical technology enhanced with natural compounds",
        icon: "💉"
    },
    
    // Homo Kaylex Special Items
    photosynthesis_enhancer: {
        name: "Photosynthesis Enhancer",
        type: "special",
        effect: "enhances_photosynthesis",
        duration: 300,
        description: "Temporarily enhances photosynthetic efficiency",
        lore: "Advanced biotechnology developed by Imperial scientists",
        icon: "☀️"
    },
    
    telepathy_crystal: {
        name: "Telepathy Crystal",
        type: "special",
        effect: "unlocks_telepathy",
        description: "Unlocks telepathic abilities",
        lore: "Ancient technology rediscovered by the United Empire",
        icon: "🧠"
    },
    
    time_crystal: {
        name: "Time Crystal",
        type: "special",
        effect: "unlocks_time_perception",
        description: "Unlocks time perception abilities",
        lore: "Mystical artifact of unknown origin, studied by Imperial researchers",
        icon: "⏰"
    },
    
    // Imperial Technology
    energy_core: {
        name: "Energy Core",
        type: "technology",
        description: "Advanced power source for technological devices",
        lore: "Core component of Imperial technology systems",
        icon: "⚡"
    },
    
    communication_device: {
        name: "Communication Device",
        type: "technology",
        description: "Long-range communication system",
        lore: "Standard Imperial communication technology",
        icon: "📡"
    },
    
    environmental_scanner: {
        name: "Environmental Scanner",
        type: "technology",
        description: "Analyzes environmental conditions and resources",
        lore: "Essential tool for Imperial exploration missions",
        icon: "🔍"
    },
    
    research_station: {
        name: "Research Station",
        type: "structure",
        durability: 10000,
        description: "Advanced facility for scientific research",
        lore: "Mobile research facility used by Imperial scientists",
        icon: "🔬"
    },
    
    power_generator: {
        name: "Power Generator",
        type: "technology",
        description: "Generates power for advanced structures",
        lore: "Industrial power generation technology",
        icon: "⚙️"
    },
    
    // Advanced Materials
    refined_iron: {
        name: "Refined Iron",
        type: "material",
        stackable: true,
        maxStack: 64,
        description: "Processed iron for advanced crafting",
        lore: "High-quality iron refined using Imperial smelting techniques",
        icon: "🔩"
    },
    
    composite_alloy: {
        name: "Composite Alloy",
        type: "material",
        stackable: true,
        maxStack: 32,
        description: "Advanced material for high-tech construction",
        lore: "Imperial alloy combining multiple metals for superior properties",
        icon: "🔧"
    },
    
    energy_cell: {
        name: "Energy Cell",
        type: "material",
        stackable: true,
        maxStack: 16,
        description: "Portable energy storage unit",
        lore: "Compact energy storage technology developed by Imperial engineers",
        icon: "🔋"
    },
    
    // Advanced Tools
    plasma_cutter: {
        name: "Plasma Cutter",
        type: "tool",
        durability: 1000,
        efficiency: 5.0,
        description: "Advanced cutting tool using plasma technology",
        lore: "High-tech cutting tool used in Imperial construction",
        icon: "⚡"
    },
    
    molecular_scanner: {
        name: "Molecular Scanner",
        type: "tool",
        durability: 500,
        efficiency: 1.0,
        description: "Analyzes molecular composition of materials",
        lore: "Advanced analysis tool for scientific research",
        icon: "🔬"
    },
    
    // Advanced Consumables
    nanite_repair_kit: {
        name: "Nanite Repair Kit",
        type: "consumable",
        healthRestore: 100,
        description: "Advanced healing using nanotechnology",
        lore: "Cutting-edge medical technology using microscopic repair units",
        icon: "🔧"
    },
    
    quantum_energy_pack: {
        name: "Quantum Energy Pack",
        type: "consumable",
        energyRestore: 100,
        description: "Maximum energy restoration using quantum technology",
        lore: "Advanced energy technology based on quantum principles",
        icon: "⚛️"
    },
    
    // Special Imperial Items
    imperial_medal: {
        name: "Imperial Medal",
        type: "special",
        description: "Symbol of service to the United Empire",
        lore: "Honorary decoration awarded for exceptional service to the Empire",
        icon: "🏅"
    },
    
    gaulsais_translator: {
        name: "Gaulsais Translator",
        type: "technology",
        description: "Real-time translation device for Gaulsais language",
        lore: "Advanced linguistic technology for communication across the Empire",
        icon: "📝"
    },
    
    temporal_stabilizer: {
        name: "Temporal Stabilizer",
        type: "technology",
        description: "Stabilizes time perception abilities",
        lore: "Experimental technology for controlling temporal phenomena",
        icon: "⏱️"
    },
    
    // Planetary Resources
    chimera_essence: {
        name: "Chimera Essence",
        type: "material",
        stackable: true,
        maxStack: 8,
        description: "Rare essence from Chimera's unique ecosystem",
        lore: "Mystical substance unique to the homeworld of Homo Kaylex",
        icon: "🌟"
    },
    
    neflaym_ore: {
        name: "Neflaym Ore",
        type: "material",
        stackable: true,
        maxStack: 32,
        description: "Mineral ore unique to Neflaym",
        lore: "Rare mineral found only on the temperate world of Neflaym",
        icon: "💎"
    },
    
    elisium_wood: {
        name: "Elisium Wood",
        type: "material",
        stackable: true,
        maxStack: 32,
        description: "Dense wood from Elisium's ancient forests",
        lore: "Ancient wood from the forest world of Elisium",
        icon: "🌳"
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ITEM_DATA;
}