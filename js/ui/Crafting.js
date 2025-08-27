// Crafting system for Veauxalia
class Crafting {
    constructor() {
        this.isVisible = false;
        this.recipes = this.initializeRecipes();
    }
    
    init() {
        console.log('Crafting system initialized');
    }
    
    initializeRecipes() {
        return {
            // Basic Tools
            'wooden_pickaxe': {
                name: 'Wooden Pickaxe',
                ingredients: [
                    { item: 'wood', count: 3 },
                    { item: 'stick', count: 2 }
                ],
                result: { item: 'wooden_pickaxe', count: 1 },
                category: 'tools',
                description: 'Basic tool for mining stone and ores'
            },
            'stone_pickaxe': {
                name: 'Stone Pickaxe',
                ingredients: [
                    { item: 'stone', count: 3 },
                    { item: 'stick', count: 2 }
                ],
                result: { item: 'stone_pickaxe', count: 1 },
                category: 'tools',
                description: 'Improved mining tool'
            },
            'iron_pickaxe': {
                name: 'Iron Pickaxe',
                ingredients: [
                    { item: 'iron_ore', count: 3 },
                    { item: 'stick', count: 2 }
                ],
                result: { item: 'iron_pickaxe', count: 1 },
                category: 'tools',
                description: 'Advanced mining tool'
            },
            'wooden_axe': {
                name: 'Wooden Axe',
                ingredients: [
                    { item: 'wood', count: 3 },
                    { item: 'stick', count: 2 }
                ],
                result: { item: 'wooden_axe', count: 1 },
                category: 'tools',
                description: 'Tool for chopping wood'
            },
            'stone_axe': {
                name: 'Stone Axe',
                ingredients: [
                    { item: 'stone', count: 3 },
                    { item: 'stick', count: 2 }
                ],
                result: { item: 'stone_axe', count: 1 },
                category: 'tools',
                description: 'Improved wood cutting tool'
            },
            
            // Structures
            'campfire': {
                name: 'Campfire',
                ingredients: [
                    { item: 'stone', count: 8 },
                    { item: 'wood', count: 4 }
                ],
                result: { item: 'campfire', count: 1 },
                category: 'structures',
                description: 'Provides light and warmth'
            },
            'shelter': {
                name: 'Basic Shelter',
                ingredients: [
                    { item: 'wood', count: 10 },
                    { item: 'stone', count: 5 }
                ],
                result: { item: 'shelter', count: 1 },
                category: 'structures',
                description: 'Protection from weather'
            },
            'advanced_shelter': {
                name: 'Advanced Shelter',
                ingredients: [
                    { item: 'wood', count: 15 },
                    { item: 'stone', count: 10 },
                    { item: 'iron_ore', count: 3 }
                ],
                result: { item: 'advanced_shelter', count: 1 },
                category: 'structures',
                description: 'Enhanced protection and comfort'
            },
            
            // Consumables
            'medicine': {
                name: 'Basic Medicine',
                ingredients: [
                    { item: 'herb', count: 3 },
                    { item: 'water', count: 1 }
                ],
                result: { item: 'medicine', count: 1 },
                category: 'consumables',
                description: 'Restores health'
            },
            'energy_potion': {
                name: 'Energy Potion',
                ingredients: [
                    { item: 'herb', count: 2 },
                    { item: 'fruit', count: 2 },
                    { item: 'water', count: 1 }
                ],
                result: { item: 'energy_potion', count: 1 },
                category: 'consumables',
                description: 'Restores energy'
            },
            'enhanced_medicine': {
                name: 'Enhanced Medicine',
                ingredients: [
                    { item: 'herb', count: 5 },
                    { item: 'rare_herb', count: 1 },
                    { item: 'water', count: 2 }
                ],
                result: { item: 'enhanced_medicine', count: 1 },
                category: 'consumables',
                description: 'Significantly restores health'
            },
            
            // Homo Kaylex Special Items
            'photosynthesis_enhancer': {
                name: 'Photosynthesis Enhancer',
                ingredients: [
                    { item: 'herb', count: 4 },
                    { item: 'crystal', count: 1 },
                    { item: 'water', count: 2 }
                ],
                result: { item: 'photosynthesis_enhancer', count: 1 },
                category: 'special',
                description: 'Enhances photosynthetic efficiency'
            },
            'telepathy_crystal': {
                name: 'Telepathy Crystal',
                ingredients: [
                    { item: 'crystal', count: 3 },
                    { item: 'rare_crystal', count: 1 },
                    { item: 'herb', count: 2 }
                ],
                result: { item: 'telepathy_crystal', count: 1 },
                category: 'special',
                description: 'Unlocks telepathy ability'
            },
            'time_crystal': {
                name: 'Time Crystal',
                ingredients: [
                    { item: 'rare_crystal', count: 2 },
                    { item: 'crystal', count: 5 },
                    { item: 'herb', count: 3 }
                ],
                result: { item: 'time_crystal', count: 1 },
                category: 'special',
                description: 'Unlocks time perception ability'
            }
        };
    }
    
    show() {
        document.getElementById('crafting-overlay').classList.remove('hidden');
        this.isVisible = true;
        this.populateCraftingGrid();
    }
    
    hide() {
        document.getElementById('crafting-overlay').classList.add('hidden');
        this.isVisible = false;
    }
    
    populateCraftingGrid() {
        const grid = document.getElementById('crafting-grid');
        grid.innerHTML = '';
        
        // Group recipes by category
        const categories = {};
        Object.keys(this.recipes).forEach(recipeId => {
            const recipe = this.recipes[recipeId];
            if (!categories[recipe.category]) {
                categories[recipe.category] = [];
            }
            categories[recipe.category].push({ id: recipeId, ...recipe });
        });
        
        // Create category tabs
        const categoryTabs = document.createElement('div');
        categoryTabs.className = 'crafting-categories';
        categoryTabs.innerHTML = Object.keys(categories).map(category => 
            `<button class="category-tab" data-category="${category}">${category.charAt(0).toUpperCase() + category.slice(1)}</button>`
        ).join('');
        
        grid.appendChild(categoryTabs);
        
        // Create recipe containers for each category
        Object.keys(categories).forEach(category => {
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'category-container';
            categoryContainer.dataset.category = category;
            categoryContainer.style.display = category === 'tools' ? 'grid' : 'none';
            
            categories[category].forEach(recipe => {
                const canCraft = this.canCraftRecipe(recipe);
                
                const recipeElement = document.createElement('div');
                recipeElement.className = 'crafting-item';
                recipeElement.style.cssText = `
                    background: ${canCraft ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'};
                    border: 1px solid ${canCraft ? '#00ff00' : '#ff0000'};
                    border-radius: 8px;
                    padding: 15px;
                    cursor: ${canCraft ? 'pointer' : 'not-allowed'};
                    transition: all 0.2s ease;
                    margin: 5px;
                `;
            
            recipeElement.innerHTML = `
                <h4 style="color: ${canCraft ? '#00ff00' : '#ff0000'}; margin: 0 0 5px 0;">${recipe.name}</h4>
                <div style="font-size: 11px; color: #aaa; font-style: italic; margin-bottom: 8px;">
                    ${recipe.description}
                </div>
                <div style="font-size: 10px; color: #888; margin-bottom: 5px;">
                    <strong>Ingredients:</strong> ${recipe.ingredients.map(ing => `${ing.count}x ${ing.item}`).join(', ')}
                </div>
                <div style="font-size: 10px; color: #00ff00; font-weight: bold;">
                    Creates: ${recipe.result.count}x ${recipe.result.item}
                </div>
            `;
            
            if (canCraft) {
                recipeElement.addEventListener('click', () => {
                    this.craftItem(recipe.id);
                });
                
                recipeElement.addEventListener('mouseenter', () => {
                    recipeElement.style.transform = 'scale(1.05)';
                });
                
                recipeElement.addEventListener('mouseleave', () => {
                    recipeElement.style.transform = 'scale(1)';
                });
            }
            
            categoryContainer.appendChild(recipeElement);
        });
        
        grid.appendChild(categoryContainer);
    });
    
    // Add category tab functionality
    this.setupCategoryTabs();
}

setupCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    const containers = document.querySelectorAll('.category-container');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show selected category
            containers.forEach(container => {
                container.style.display = container.dataset.category === category ? 'grid' : 'none';
            });
        });
    });
    
    // Set first tab as active
    if (tabs.length > 0) {
        tabs[0].classList.add('active');
    }
}
    
    canCraftRecipe(recipe) {
        if (!window.game || !window.game.playerData) return false;
        
        const inventory = window.game.playerData.inventory;
        
        // Check if player has all required ingredients
        for (const ingredient of recipe.ingredients) {
            let hasEnough = false;
            let totalCount = 0;
            
            for (const item of inventory) {
                if (item && item.name === ingredient.item) {
                    totalCount += item.count || 1;
                }
            }
            
            if (totalCount >= ingredient.count) {
                hasEnough = true;
            }
            
            if (!hasEnough) return false;
        }
        
        return true;
    }
    
    craftItem(recipeId) {
        const recipe = this.recipes[recipeId];
        if (!recipe || !this.canCraftRecipe(recipe)) {
            this.showMessage('Cannot craft this item - missing ingredients!');
            return;
        }
        
        // Remove ingredients from inventory
        for (const ingredient of recipe.ingredients) {
            let remainingToRemove = ingredient.count;
            
            for (let i = 0; i < window.game.playerData.inventory.length && remainingToRemove > 0; i++) {
                const item = window.game.playerData.inventory[i];
                if (item && item.name === ingredient.item) {
                    const itemCount = item.count || 1;
                    const toRemove = Math.min(remainingToRemove, itemCount);
                    
                    if (toRemove >= itemCount) {
                        window.game.playerData.inventory[i] = null;
                    } else {
                        item.count = itemCount - toRemove;
                    }
                    
                    remainingToRemove -= toRemove;
                }
            }
        }
        
        // Add crafted item to inventory
        const craftedItem = {
            name: recipe.result.item,
            count: recipe.result.count,
            type: 'crafted'
        };
        
        const success = window.game.addItemToInventory(craftedItem);
        
        if (success) {
            this.showMessage(`Successfully crafted ${recipe.name}!`);
            this.populateCraftingGrid(); // Refresh the grid
        } else {
            this.showMessage('Inventory is full!');
        }
    }
    
    showMessage(message) {
        if (window.game && window.game.hud) {
            window.game.hud.showMessage(message);
        } else {
            console.log(message);
        }
    }
    
    getRecipe(recipeId) {
        return this.recipes[recipeId];
    }
    
    getAllRecipes() {
        return this.recipes;
    }
    
    getRecipesByCategory(category) {
        return Object.keys(this.recipes).filter(recipeId => 
            this.recipes[recipeId].category === category
        ).map(recipeId => this.recipes[recipeId]);
    }
}