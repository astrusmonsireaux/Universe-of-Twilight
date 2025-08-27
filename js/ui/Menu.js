// Menu system for Veauxalia
class Menu {
    constructor() {
        this.isVisible = false;
    }
    
    init() {
        console.log('Menu system initialized');
    }
    
    show() {
        document.getElementById('menu-overlay').classList.remove('hidden');
        this.isVisible = true;
    }
    
    hide() {
        document.getElementById('menu-overlay').classList.add('hidden');
        this.isVisible = false;
    }
}