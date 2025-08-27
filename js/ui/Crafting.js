// Crafting system for Veauxalia
class Crafting {
    constructor() {
        this.isVisible = false;
    }
    
    init() {
        console.log('Crafting system initialized');
    }
    
    show() {
        document.getElementById('crafting-overlay').classList.remove('hidden');
        this.isVisible = true;
    }
    
    hide() {
        document.getElementById('crafting-overlay').classList.add('hidden');
        this.isVisible = false;
    }
}