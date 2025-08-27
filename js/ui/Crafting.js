// Enhanced Crafting System for Veauxalia
class Crafting {
    constructor() {
        this.recipes = this.initializeRecipes();
        this.currentCategory = 'all';
        this.categories = ['all', 'tools', 'structures', 'consumables', 'special', 'technology'];
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.populateCraftingGrid();
        console.log('Enhanced crafting system initialized');
    }
    
    initializeRecipes() {
        return {
            // Basic Tools
            wooden_pickaxe: {
                name: "Wooden Pickaxe",
                category: "tools",
                ingredients: { wood: 3, stick: 2 },
                result: { item: "wooden_pickaxe", count: 1 },
                description: "Basic mining tool for extracting resources",
                lore: "Essential tool for resource gathering in the Veauxalia system"
            },
            
            stone_pickaxe: {
                name: "Stone Pickaxe",
                category: "tools",
                ingredients: { stone: 3, stick: 2 },
                result: { item: "stone_pickaxe", count: 1 },
                description: "Improved mining tool with better durability",
                lore: "Advanced mining technology from the United Empire"
            },
            
            iron_pickaxe: {
                name: "Iron Pickaxe",
                category: "tools",
                ingredients: { iron_ore: 3, stick: 2 },
                result: { item: "iron_pickaxe", count: 1 },
                description: "High-quality mining tool for advanced extraction",
                lore: "Imperial-grade mining equipment"
            },
            
            wooden_axe: {
                name: "Wooden Axe",
                category: "tools",
                ingredients: { wood: 3, stick: 2 },
                result: { item: "wooden_axe", count: 1 },
                description: "Basic wood cutting tool",
                lore: "Traditional tool for harvesting organic materials"
            },
            
            // Structures
            campfire: {
                name: "Campfire",
                category: "structures",
                ingredients: { rock: 8, wood: 4 },
                result: { item: "campfire", count: 1 },
                description: "Provides light, warmth, and cooking capability",
                lore: "Ancient technology still useful in modern exploration"
            },
            
            shelter: {
                name: "Basic Shelter",
                category: "structures",
                ingredients: { wood: 10, stone: 5 },
                result: { item: "shelter", count: 1 },
                description: "Protection from weather and environmental hazards",
                lore: "Standard survival structure used by Empire explorers"
            },
            
            advanced_shelter: {
                name: "Advanced Shelter",
                category: "structures",
                ingredients: { shelter: 1, iron_ore: 5, crystal: 2 },
                result: { item: "advanced_shelter", count: 1 },
                description: "Enhanced protection with energy systems",
                lore: "Modern Imperial technology for long-term habitation"
            },
            
            // Consumables
            medicine: {
                name: "Basic Medicine",
                category: "consumables",
                ingredients: { herb: 3, water: 1 },
                result: { item: "medicine", count: 1 },
                description: "Restores health and treats minor injuries",
                lore: "Traditional healing knowledge preserved by Homo Kaylex"
            },
            
            enhanced_medicine: {
                name: "Enhanced Medicine",
                category: "consumables",
                ingredients: { medicine: 1, rare_herb: 2, crystal: 1 },
                result: { item: "enhanced_medicine", count: 1 },
                description: "Advanced healing with rapid recovery",
                lore: "Imperial medical technology enhanced with natural compounds"
            },
            
            energy_potion: {
                name: "Energy Potion",
                category: "consumables",
                ingredients: { herb: 2, rare_herb: 1, water: 1 },
                result: { item: "energy_potion", count: 1 },
                description: "Boosts energy and enhances photosynthesis",
                lore: "Specially formulated for Homo Kaylex physiology"
            },
            
            // Special Items
            photosynthesis_enhancer: {
                name: "Photosynthesis Enhancer",
                category: "special",
                ingredients: { rare_crystal: 2, herb: 5, water: 2 },
                result: { item: "photosynthesis_enhancer", count: 1 },
                description: "Temporarily enhances photosynthetic efficiency",
                lore: "Advanced biotechnology developed by Imperial scientists"
            },
            
            telepathy_crystal: {
                name: "Telepathy Crystal",
                category: "special",
                ingredients: { rare_crystal: 3, crystal: 5, herb: 10 },
                result: { item: "telepathy_crystal", count: 1 },
                description: "Unlocks telepathic abilities",
                lore: "Ancient technology rediscovered by the United Empire"
            },
            
            time_crystal: {
                name: "Time Crystal",
                category: "special",
                ingredients: { rare_crystal: 5, telepathy_crystal: 1, crystal: 10 },
                result: { item: "time_crystal", count: 1 },
                description: "Unlocks time perception abilities",
                lore: "Mystical artifact of unknown origin, studied by Imperial researchers"
            },
            
            // Technology
            energy_core: {
                name: "Energy Core",
                category: "technology",
                ingredients: { iron_ore: 8, crystal: 4, rare_crystal: 2 },
                result: { item: "energy_core", count: 1 },
                description: "Advanced power source for technological devices",
                lore: "Core component of Imperial technology systems"
            },
            
            communication_device: {
                name: "Communication Device",
                category: "technology",
                ingredients: { energy_core: 1, crystal: 3, iron_ore: 5 },
                result: { item: "communication_device", count: 1 },
                description: "Long-range communication system",
                lore: "Standard Imperial communication technology"
            },
            
            environmental_scanner: {
                name: "Environmental Scanner",
                category: "technology",
                ingredients: { energy_core: 1, crystal: 2, rare_crystal: 1 },
                result: { item: "environmental_scanner", count: 1 },
                description: "Analyzes environmental conditions and resources",
                lore: "Essential tool for Imperial exploration missions"
            },
            
            // Advanced Structures
            research_station: {
                name: "Research Station",
                category: "structures",
                ingredients: { advanced_shelter: 1, energy_core: 2, environmental_scanner: 1 },
                result: { item: "research_station", count: 1 },
                description: "Advanced facility for scientific research",
                lore: "Mobile research facility used by Imperial scientists"
            },
            
            power_generator: {
                name: "Power Generator",
                category: "technology",
                ingredients: { energy_core: 3, iron_ore: 10, crystal: 5 },
                result: { item: "power_generator", count: 1 },
                description: "Generates power for advanced structures",
                lore: "Industrial power generation technology"
            }
        };
    }
    
    setupEventListeners() {
        // Category tabs
        this.categories.forEach(category => {
            const tab = document.createElement('div');
            tab.className = 'category-tab';
            tab.textContent = this.getCategoryDisplayName(category);
            tab.addEventListener('click', () => this.selectCategory(category));
            
            const categoryContainer = document.querySelector('.crafting-categories');
            if (categoryContainer) {
                categoryContainer.appendChild(tab);
            }
        });
        
        // Back button
        const backBtn = document.getElementById('crafting-back');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.hide());
        }
    }
    
    getCategoryDisplayName(category) {
        const names = {
            'all': 'All Items',
            'tools': 'Tools',
            'structures': 'Structures',
            'consumables': 'Consumables',
            'special': 'Special Items',
            'technology': 'Technology'
        };
        return names[category] || category;
    }
    
    selectCategory(category) {
        this.currentCategory = category;
        
        // Update active tab
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`.category-tab:nth-child(${this.categories.indexOf(category) + 1})`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        this.populateCraftingGrid();
    }
    
    populateCraftingGrid() {
        const grid = document.getElementById('crafting-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        // Filter recipes by category
        const filteredRecipes = Object.entries(this.recipes).filter(([key, recipe]) => {
            return this.currentCategory === 'all' || recipe.category === this.currentCategory;
        });
        
        // Group by category if showing all
        if (this.currentCategory === 'all') {
            this.categories.slice(1).forEach(category => {
                const categoryRecipes = filteredRecipes.filter(([key, recipe]) => recipe.category === category);
                if (categoryRecipes.length > 0) {
                    this.addCategorySection(grid, category, categoryRecipes);
                }
            });
        } else {
            // Show all recipes in current category
            filteredRecipes.forEach(([key, recipe]) => {
                this.addRecipeItem(grid, key, recipe);
            });
        }
    }
    
    addCategorySection(container, category, recipes) {
        const section = document.createElement('div');
        section.className = 'category-section';
        section.innerHTML = `
            <h3 class="category-title">${this.getCategoryDisplayName(category)}</h3>
            <div class="category-container"></div>
        `;
        
        const categoryContainer = section.querySelector('.category-container');
        recipes.forEach(([key, recipe]) => {
            this.addRecipeItem(categoryContainer, key, recipe);
        });
        
        container.appendChild(section);
    }
    
    addRecipeItem(container, key, recipe) {
        const item = document.createElement('div');
        item.className = 'crafting-item';
        
        const canCraft = this.canCraftRecipe(recipe);
        if (canCraft) {
            item.classList.add('craftable');
        }
        
        item.innerHTML = `
            <h4>${recipe.name}</h4>
            <div class="description">${recipe.description}</div>
            <div class="lore">${recipe.lore}</div>
            <div class="ingredients">
                <strong>Ingredients:</strong><br>
                ${this.formatIngredients(recipe.ingredients)}
            </div>
            <div class="result">
                <strong>Result:</strong> ${recipe.result.count}x ${recipe.result.item}
            </div>
        `;
        
        item.addEventListener('click', () => this.craftItem(key, recipe));
        container.appendChild(item);
    }
    
    formatIngredients(ingredients) {
        return Object.entries(ingredients)
            .map(([item, count]) => `${count}x ${item.replace('_', ' ')}`)
            .join(', ');
    }
    
    canCraftRecipe(recipe) {
        if (!window.game || !window.game.playerData) return false;
        
        const inventory = window.game.playerData.inventory;
        const itemCounts = {};
        
        // Count items in inventory
        inventory.forEach(item => {
            if (item) {
                itemCounts[item.name] = (itemCounts[item.name] || 0) + (item.count || 1);
            }
        });
        
        // Check if we have all required ingredients
        for (const [ingredient, requiredCount] of Object.entries(recipe.ingredients)) {
            const availableCount = itemCounts[ingredient] || 0;
            if (availableCount < requiredCount) {
                return false;
            }
        }
        
        return true;
    }
    
    showMessage(message) {
        if (window.game && window.game.hud) {
            window.game.hud.showMessage(message);
        }
    }
    
    showTranslatedMessage(key, params = {}) {
        if (window.game && window.game.hud) {
            window.game.hud.showTranslatedMessage(key, params);
        }
    }
    
    craftItem(recipeKey, recipe) {
        if (!this.canCraftRecipe(recipe)) {
            this.showTranslatedMessage('insufficient_materials');
            return;
        }
        
        // Remove ingredients from inventory
        for (const [ingredient, count] of Object.entries(recipe.ingredients)) {
            window.game.removeItemFromInventory(ingredient, count);
        }
        
        // Add crafted item to inventory
        const success = window.game.addItemToInventory({
            name: recipe.result.item,
            count: recipe.result.count,
            type: ITEM_DATA[recipe.result.item]?.type || 'crafted'
        });
        
        if (success) {
            this.showTranslatedMessage('crafting_success', { item: recipe.name });
            this.populateCraftingGrid(); // Refresh the grid
        } else {
            this.showTranslatedMessage('inventory_full');
        }
    }
    
    show() {
        const overlay = document.getElementById('crafting-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            this.populateCraftingGrid();
        }
    }
    
    hide() {
        const overlay = document.getElementById('crafting-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Crafting;
}