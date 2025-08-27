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
            'wooden_pickaxe': {
                name: 'Wooden Pickaxe',
                ingredients: [
                    { item: 'wood', count: 3 },
                    { item: 'stick', count: 2 }
                ],
                result: { item: 'wooden_pickaxe', count: 1 },
                category: 'tools'
            },
            'stone_pickaxe': {
                name: 'Stone Pickaxe',
                ingredients: [
                    { item: 'stone', count: 3 },
                    { item: 'stick', count: 2 }
                ],
                result: { item: 'stone_pickaxe', count: 1 },
                category: 'tools'
            },
            'wooden_axe': {
                name: 'Wooden Axe',
                ingredients: [
                    { item: 'wood', count: 3 },
                    { item: 'stick', count: 2 }
                ],
                result: { item: 'wooden_axe', count: 1 },
                category: 'tools'
            },
            'campfire': {
                name: 'Campfire',
                ingredients: [
                    { item: 'stone', count: 8 },
                    { item: 'wood', count: 4 }
                ],
                result: { item: 'campfire', count: 1 },
                category: 'structures'
            },
            'shelter': {
                name: 'Basic Shelter',
                ingredients: [
                    { item: 'wood', count: 10 },
                    { item: 'stone', count: 5 }
                ],
                result: { item: 'shelter', count: 1 },
                category: 'structures'
            },
            'medicine': {
                name: 'Basic Medicine',
                ingredients: [
                    { item: 'herb', count: 3 },
                    { item: 'water', count: 1 }
                ],
                result: { item: 'medicine', count: 1 },
                category: 'consumables'
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
        
        Object.keys(this.recipes).forEach(recipeId => {
            const recipe = this.recipes[recipeId];
            const canCraft = this.canCraftRecipe(recipe);
            
            const recipeElement = document.createElement('div');
            recipeElement.className = 'crafting-item';
            recipeElement.style.cssText = `
                background: ${canCraft ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'};
                border: 1px solid ${canCraft ? '#00ff00' : '#ff0000'};
                border-radius: 8px;
                padding: 10px;
                cursor: ${canCraft ? 'pointer' : 'not-allowed'};
                transition: all 0.2s ease;
            `;
            
            recipeElement.innerHTML = `
                <h4 style="color: ${canCraft ? '#00ff00' : '#ff0000'}; margin: 0 0 5px 0;">${recipe.name}</h4>
                <p style="font-size: 10px; color: #888; margin: 0 0 5px 0;">Category: ${recipe.category}</p>
                <p style="font-size: 10px; color: #888; margin: 0 0 5px 0;">Ingredients:</p>
                <ul style="font-size: 10px; color: #888; margin: 0; padding-left: 15px;">
                    ${recipe.ingredients.map(ing => 
                        `<li>${ing.count}x ${ing.item}</li>`
                    ).join('')}
                </ul>
                <p style="font-size: 10px; color: #00ff00; margin: 5px 0 0 0;">
                    Result: ${recipe.result.count}x ${recipe.result.item}
                </p>
            `;
            
            if (canCraft) {
                recipeElement.addEventListener('click', () => {
                    this.craftItem(recipeId);
                });
                
                recipeElement.addEventListener('mouseenter', () => {
                    recipeElement.style.transform = 'scale(1.05)';
                });
                
                recipeElement.addEventListener('mouseleave', () => {
                    recipeElement.style.transform = 'scale(1)';
                });
            }
            
            grid.appendChild(recipeElement);
        });
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