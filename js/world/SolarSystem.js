// Solar System management for Veauxalia
class SolarSystem {
    constructor() {
        this.stars = new Map();
        this.planets = new Map();
        this.time = 0;
        
        this.init();
    }
    
    init() {
        // Create stars
        this.stars.set('Hieleon', new Star(SOLAR_SYSTEM.HIELEON));
        this.stars.set('Nyxeon', new Star(SOLAR_SYSTEM.NYXEON));
        
        // Initialize stars
        this.stars.forEach(star => star.init());
        
        console.log('Solar system initialized');
    }
    
    update(deltaTime) {
        this.time += deltaTime;
        
        // Update star positions
        this.updateStarPositions();
        
        // Update stars
        this.stars.forEach(star => star.update(deltaTime));
        
        // Update planets
        this.planets.forEach(planet => planet.update(deltaTime));
    }
    
    updateStarPositions() {
        const hieleon = this.stars.get('Hieleon');
        const nyxeon = this.stars.get('Nyxeon');
        
        if (hieleon && nyxeon) {
            // Calculate binary star positions
            const separation = SOLAR_SYSTEM.NYXEON.distanceFromHieleon * 50; // Scale for visualization
            const orbitalPeriod = 100; // Years in game time
            const angle = (this.time / (orbitalPeriod * 365 * 24 * 3600)) * Math.PI * 2;
            
            // Hieleon at center
            hieleon.position = { x: 0, y: 0, z: 0 };
            
            // Nyxeon orbiting around Hieleon
            nyxeon.position = {
                x: Math.cos(angle) * separation,
                y: 0,
                z: Math.sin(angle) * separation
            };
        }
    }
    
    render(scene) {
        // Render stars
        this.stars.forEach(star => star.render(scene));
        
        // Render planets
        this.planets.forEach(planet => planet.render(scene));
    }
    
    addPlanet(name, planet) {
        this.planets.set(name, planet);
    }
    
    getStar(name) {
        return this.stars.get(name);
    }
    
    getPlanet(name) {
        return this.planets.get(name);
    }
}