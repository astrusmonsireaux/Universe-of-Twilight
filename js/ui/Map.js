// Map system for Veauxalia
class Map {
    constructor() {
        this.isVisible = false;
    }
    
    init() {
        console.log('Map system initialized');
    }
    
    show() {
        document.getElementById('map-overlay').classList.remove('hidden');
        this.isVisible = true;
    }
    
    hide() {
        document.getElementById('map-overlay').classList.add('hidden');
        this.isVisible = false;
    }
}