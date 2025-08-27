// HUD (Heads-Up Display) for Veauxalia
class HUD {
    constructor() {
        this.healthElement = document.getElementById('health-fill');
        this.energyElement = document.getElementById('energy-fill');
        this.healthText = document.getElementById('health-text');
        this.energyText = document.getElementById('energy-text');
        this.locationElement = document.getElementById('current-location');
        this.coordinatesElement = document.getElementById('coordinates');
    }
    
    init() {
        console.log('HUD initialized');
    }
    
    update(deltaTime) {
        // HUD updates
    }
    
    updateHealth(health) {
        const percentage = (health / GAME_CONSTANTS.MAX_HEALTH) * 100;
        this.healthElement.style.width = `${percentage}%`;
        this.healthText.textContent = `${Math.round(percentage)}%`;
    }
    
    updateEnergy(energy) {
        const percentage = (energy / GAME_CONSTANTS.MAX_ENERGY) * 100;
        this.energyElement.style.width = `${percentage}%`;
        this.energyText.textContent = `${Math.round(percentage)}%`;
    }
    
    updateLocation(location) {
        this.locationElement.textContent = location;
    }
    
    updateCoordinates(x, y, z) {
        this.coordinatesElement.textContent = `${Math.round(x)}, ${Math.round(y)}, ${Math.round(z)}`;
    }
    
    updateInventory(inventory) {
        // Update inventory display
    }
    
    render() {
        // HUD rendering
    }
}