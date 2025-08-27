// Map system for Veauxalia
class Map {
    constructor() {
        this.isVisible = false;
        this.canvas = null;
        this.ctx = null;
        this.planets = [];
        this.selectedPlanet = null;
    }
    
    init() {
        console.log('Map system initialized');
        this.createMapCanvas();
        this.initializePlanets();
    }
    
    createMapCanvas() {
        const mapContainer = document.getElementById('system-map');
        this.canvas = document.createElement('canvas');
        this.canvas.width = 600;
        this.canvas.height = 400;
        this.canvas.style.cssText = `
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, #000033 0%, #000066 50%, #000099 100%);
            border-radius: 8px;
            cursor: pointer;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        mapContainer.appendChild(this.canvas);
        
        // Add click event listener
        this.canvas.addEventListener('click', (event) => {
            this.handleMapClick(event);
        });
    }
    
    initializePlanets() {
        // Create planet objects for the map
        this.planets = [
            {
                name: 'Hieleon',
                x: 300,
                y: 200,
                radius: 15,
                color: '#ffff00',
                type: 'star',
                data: SOLAR_SYSTEM.HIELEON
            },
            {
                name: 'Nyxeon',
                x: 350,
                y: 200,
                radius: 10,
                color: '#ff6600',
                type: 'star',
                data: SOLAR_SYSTEM.NYXEON
            },
            {
                name: 'Neflaym',
                x: 250,
                y: 150,
                radius: 8,
                color: '#4CAF50',
                type: 'planet',
                data: SOLAR_SYSTEM.NEFLAYM
            },
            {
                name: 'Phantom',
                x: 280,
                y: 180,
                radius: 3,
                color: '#9E9E9E',
                type: 'dwarf',
                data: SOLAR_SYSTEM.PHANTOM
            },
            {
                name: 'Elisium',
                x: 380,
                y: 160,
                radius: 8,
                color: '#8BC34A',
                type: 'planet',
                data: SOLAR_SYSTEM.ELISIUM
            },
            {
                name: 'Titan',
                x: 370,
                y: 190,
                radius: 4,
                color: '#607D8B',
                type: 'dwarf',
                data: SOLAR_SYSTEM.TITAN
            },
            {
                name: 'Chimera',
                x: 200,
                y: 100,
                radius: 10,
                color: '#9C27B0',
                type: 'planet',
                data: SOLAR_SYSTEM.CHIMERA
            },
            {
                name: 'Baylephon',
                x: 150,
                y: 80,
                radius: 12,
                color: '#FF9800',
                type: 'gas_giant',
                data: SOLAR_SYSTEM.BAYLEPHON
            },
            {
                name: 'Dimetrian',
                x: 100,
                y: 60,
                radius: 14,
                color: '#FF5722',
                type: 'gas_giant',
                data: SOLAR_SYSTEM.DIMETRIAN
            },
            {
                name: 'Sufreign',
                x: 50,
                y: 40,
                radius: 14,
                color: '#E91E63',
                type: 'gas_giant',
                data: SOLAR_SYSTEM.SUFREIGN
            },
            {
                name: 'Areon',
                x: 30,
                y: 30,
                radius: 2,
                color: '#00BCD4',
                type: 'ice_dwarf',
                data: SOLAR_SYSTEM.AREON
            },
            {
                name: 'Gallian',
                x: 20,
                y: 20,
                radius: 2,
                color: '#00BCD4',
                type: 'ice_dwarf',
                data: SOLAR_SYSTEM.GALLIAN
            },
            {
                name: 'Lagnia',
                x: 10,
                y: 10,
                radius: 2,
                color: '#00BCD4',
                type: 'ice_dwarf',
                data: SOLAR_SYSTEM.LAGNIA
            }
        ];
    }
    
    show() {
        document.getElementById('map-overlay').classList.remove('hidden');
        this.isVisible = true;
        this.renderMap();
    }
    
    hide() {
        document.getElementById('map-overlay').classList.add('hidden');
        this.isVisible = false;
    }
    
    renderMap() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background stars
        this.drawBackgroundStars();
        
        // Draw orbital paths
        this.drawOrbitalPaths();
        
        // Draw planets
        this.planets.forEach(planet => {
            this.drawPlanet(planet);
        });
        
        // Draw selected planet info
        if (this.selectedPlanet) {
            this.drawPlanetInfo(this.selectedPlanet);
        }
        
        // Draw legend
        this.drawLegend();
    }
    
    drawBackgroundStars() {
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 2;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawOrbitalPaths() {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.3;
        
        // Draw some orbital paths
        this.ctx.beginPath();
        this.ctx.arc(300, 200, 50, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.arc(300, 200, 100, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.arc(300, 200, 150, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.globalAlpha = 1;
    }
    
    drawPlanet(planet) {
        // Draw planet
        this.ctx.fillStyle = planet.color;
        this.ctx.beginPath();
        this.ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw planet name
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(planet.name, planet.x, planet.y + planet.radius + 15);
        
        // Highlight if selected
        if (this.selectedPlanet === planet) {
            this.ctx.strokeStyle = '#00ff00';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(planet.x, planet.y, planet.radius + 5, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    drawPlanetInfo(planet) {
        const infoX = 20;
        const infoY = 20;
        
        // Draw info box
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(infoX, infoY, 200, 120);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(planet.name, infoX + 10, infoY + 20);
        
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`Type: ${planet.data.type}`, infoX + 10, infoY + 40);
        this.ctx.fillText(`Mass: ${planet.data.mass} Earth masses`, infoX + 10, infoY + 55);
        this.ctx.fillText(`Radius: ${planet.data.radius} Earth radii`, infoX + 10, infoY + 70);
        this.ctx.fillText(`Host: ${planet.data.host}`, infoX + 10, infoY + 85);
        this.ctx.fillText(`Moons: ${planet.data.moons.length || 0}`, infoX + 10, infoY + 100);
        
        // Add travel button
        if (planet.type === 'planet' && window.game) {
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillRect(infoX + 10, infoY + 110, 80, 25);
            this.ctx.fillStyle = '#000000';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Travel', infoX + 50, infoY + 125);
        }
    }
    
    drawLegend() {
        const legendX = this.canvas.width - 150;
        const legendY = 20;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(legendX, legendY, 130, 100);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Legend:', legendX + 10, legendY + 15);
        
        this.ctx.font = '10px Arial';
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillRect(legendX + 10, legendY + 25, 8, 8);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('Star', legendX + 25, legendY + 32);
        
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(legendX + 10, legendY + 40, 8, 8);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('Rock Planet', legendX + 25, legendY + 47);
        
        this.ctx.fillStyle = '#FF9800';
        this.ctx.fillRect(legendX + 10, legendY + 55, 8, 8);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('Gas Giant', legendX + 25, legendY + 62);
        
        this.ctx.fillStyle = '#9E9E9E';
        this.ctx.fillRect(legendX + 10, legendY + 70, 8, 8);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('Dwarf Planet', legendX + 25, legendY + 77);
        
        this.ctx.fillStyle = '#00BCD4';
        this.ctx.fillRect(legendX + 10, legendY + 85, 8, 8);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('Ice Dwarf', legendX + 25, legendY + 92);
    }
    
    handleMapClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Check if clicked on a planet
        for (const planet of this.planets) {
            const distance = Math.sqrt((x - planet.x) ** 2 + (y - planet.y) ** 2);
            if (distance <= planet.radius + 5) {
                this.selectedPlanet = planet;
                this.renderMap();
                return;
            }
        }
        
        // Check if clicked on travel button
        if (this.selectedPlanet && this.selectedPlanet.type === 'planet') {
            const infoX = 20;
            const infoY = 20;
            if (x >= infoX + 10 && x <= infoX + 90 && y >= infoY + 110 && y <= infoY + 135) {
                this.travelToPlanet(this.selectedPlanet.name);
            }
        }
        
        this.selectedPlanet = null;
        this.renderMap();
    }
    
    travelToPlanet(planetName) {
        if (window.game && window.game.loadPlanet) {
            window.game.loadPlanet(planetName);
            this.hide();
            if (window.game.hud) {
                window.game.hud.showMessage(`Traveling to ${planetName}...`);
            }
        }
    }
    
    getPlanetInfo(planetName) {
        return this.planets.find(planet => planet.name === planetName);
    }
}