// Item data for Veauxalia
const ITEM_DATA = {
    // Basic materials
    rock: {
        name: "Rock",
        type: "material",
        stackable: true,
        maxStack: 64,
        description: "Basic building material"
    },
    
    stone: {
        name: "Stone",
        type: "material",
        stackable: true,
        maxStack: 64,
        description: "Refined stone for construction"
    },
    
    wood: {
        name: "Wood",
        type: "material",
        stackable: true,
        maxStack: 64,
        description: "Harvested from trees"
    },
    
    stick: {
        name: "Stick",
        type: "material",
        stackable: true,
        maxStack: 64,
        description: "Basic crafting material"
    },
    
    iron_ore: {
        name: "Iron Ore",
        type: "material",
        stackable: true,
        maxStack: 64,
        description: "Raw iron for smelting"
    },
    
    // Natural resources
    herb: {
        name: "Herb",
        type: "material",
        stackable: true,
        maxStack: 32,
        description: "Medicinal plant"
    },
    
    rare_herb: {
        name: "Rare Herb",
        type: "material",
        stackable: true,
        maxStack: 16,
        description: "Uncommon medicinal plant"
    },
    
    crystal: {
        name: "Crystal",
        type: "material",
        stackable: true,
        maxStack: 16,
        description: "Mystical crystal with special properties"
    },
    
    rare_crystal: {
        name: "Rare Crystal",
        type: "material",
        stackable: true,
        maxStack: 8,
        description: "Rare mystical crystal"
    },
    
    water: {
        name: "Water",
        type: "material",
        stackable: true,
        maxStack: 16,
        description: "Essential for survival"
    },
    
    // Tools
    wooden_pickaxe: {
        name: "Wooden Pickaxe",
        type: "tool",
        durability: 100,
        efficiency: 1.0,
        description: "Basic mining tool"
    },
    
    stone_pickaxe: {
        name: "Stone Pickaxe",
        type: "tool",
        durability: 200,
        efficiency: 1.5,
        description: "Improved mining tool"
    },
    
    iron_pickaxe: {
        name: "Iron Pickaxe",
        type: "tool",
        durability: 400,
        efficiency: 2.0,
        description: "Advanced mining tool"
    },
    
    wooden_axe: {
        name: "Wooden Axe",
        type: "tool",
        durability: 100,
        efficiency: 1.0,
        description: "Basic wood cutting tool"
    },
    
    stone_axe: {
        name: "Stone Axe",
        type: "tool",
        durability: 200,
        efficiency: 1.5,
        description: "Improved wood cutting tool"
    },
    
    // Structures
    campfire: {
        name: "Campfire",
        type: "structure",
        durability: 1000,
        description: "Provides light and warmth"
    },
    
    shelter: {
        name: "Basic Shelter",
        type: "structure",
        durability: 2000,
        description: "Protection from weather"
    },
    
    advanced_shelter: {
        name: "Advanced Shelter",
        type: "structure",
        durability: 5000,
        description: "Enhanced protection and comfort"
    },
    
    // Consumables
    fruit: {
        name: "Fruit",
        type: "food",
        nutrition: 10,
        energy: 5,
        description: "Fresh fruit for sustenance"
    },
    
    medicine: {
        name: "Basic Medicine",
        type: "consumable",
        healthRestore: 25,
        description: "Restores health"
    },
    
    energy_potion: {
        name: "Energy Potion",
        type: "consumable",
        energyRestore: 30,
        description: "Restores energy"
    },
    
    enhanced_medicine: {
        name: "Enhanced Medicine",
        type: "consumable",
        healthRestore: 50,
        description: "Significantly restores health"
    },
    
    // Homo Kaylex Special Items
    photosynthesis_enhancer: {
        name: "Photosynthesis Enhancer",
        type: "special",
        effect: "enhances_photosynthesis",
        duration: 300,
        description: "Enhances photosynthetic efficiency"
    },
    
    telepathy_crystal: {
        name: "Telepathy Crystal",
        type: "special",
        effect: "unlocks_telepathy",
        description: "Unlocks telepathy ability"
    },
    
    time_crystal: {
        name: "Time Crystal",
        type: "special",
        effect: "unlocks_time_perception",
        description: "Unlocks time perception ability"
    }
};