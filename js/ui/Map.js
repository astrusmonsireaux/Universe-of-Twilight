// Enhanced Map System for Veauxalia Solar System
class GameMap {
    constructor() {
        this.isVisible = false;
        this.currentView = 'system'; // system, planet, local
        this.selectedBody = null;
        this.zoomLevel = 1;
        this.camera = { x: 0, y: 0, z: 0 };
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.createMapInterface();
        console.log('Enhanced map system initialized');
    }
    
    createMapInterface() {
        const mapContainer = document.getElementById('system-map');
        if (!mapContainer) return;
        
        // Create canvas for interactive map
        const canvas = document.createElement('canvas');
        canvas.id = 'map-canvas';
        canvas.width = 800;
        canvas.height = 600;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.cursor = 'pointer';
        
        mapContainer.appendChild(canvas);
        
        // Initialize canvas context
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        
        // Add map controls
        this.addMapControls(mapContainer);
    }
    
    addMapControls(container) {
        const controls = document.createElement('div');
        controls.className = 'map-controls';
        controls.innerHTML = `
            <div class="map-view-buttons">
                <button id="system-view" class="map-btn active">Solar System</button>
                <button id="planet-view" class="map-btn">Planet View</button>
                <button id="local-view" class="map-btn">Local Map</button>
            </div>
            <div class="map-zoom-controls">
                <button id="zoom-in" class="map-btn">+</button>
                <button id="zoom-out" class="map-btn">-</button>
                <button id="reset-view" class="map-btn">Reset</button>
            </div>
            <div class="map-info">
                <div id="map-info-panel" class="info-panel">
                    <h4>Veauxalia System</h4>
                    <p>Binary star system with 9 planets</p>
                </div>
            </div>
        `;
        
        container.appendChild(controls);
    }
    
    setupEventListeners() {
        // View buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'system-view') {
                this.setView('system');
            } else if (e.target.id === 'planet-view') {
                this.setView('planet');
            } else if (e.target.id === 'local-view') {
                this.setView('local');
            } else if (e.target.id === 'zoom-in') {
                this.zoomIn();
            } else if (e.target.id === 'zoom-out') {
                this.zoomOut();
            } else if (e.target.id === 'reset-view') {
                this.resetView();
            }
        });
        
        // Canvas interactions
        if (this.canvas) {
            this.canvas.addEventListener('click', (e) => this.handleMapClick(e));
            this.canvas.addEventListener('mousemove', (e) => this.handleMapHover(e));
        }
        
        // Back button
        const backBtn = document.getElementById('map-back');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.hide());
        }
    }
    
    setView(view) {
        this.currentView = view;
        
        // Update active button
        document.querySelectorAll('.map-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${view}-view`).classList.add('active');
        
        this.render();
    }
    
    zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel * 1.5, 5);
        this.render();
    }
    
    zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel / 1.5, 0.1);
        this.render();
    }
    
    resetView() {
        this.zoomLevel = 1;
        this.camera = { x: 0, y: 0, z: 0 };
        this.selectedBody = null;
        this.render();
    }
    
    handleMapClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        
        const clickedBody = this.getBodyAtPosition(x, y);
        if (clickedBody) {
            this.selectBody(clickedBody);
        }
    }
    
    handleMapHover(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        
        const hoveredBody = this.getBodyAtPosition(x, y);
        this.canvas.style.cursor = hoveredBody ? 'pointer' : 'default';
        
        if (hoveredBody) {
            this.showTooltip(hoveredBody, e.clientX, e.clientY);
        } else {
            this.hideTooltip();
        }
    }
    
    getBodyAtPosition(x, y) {
        const bodies = this.getMapBodies();
        
        for (const body of bodies) {
            const distance = Math.sqrt(
                Math.pow(x - body.screenX, 2) + Math.pow(y - body.screenY, 2)
            );
            
            if (distance <= body.radius) {
                return body;
            }
        }
        
        return null;
    }
    
    selectBody(body) {
        this.selectedBody = body;
        this.updateInfoPanel(body);
        
        // If it's a planet and we're in planet view, show planet details
        if (this.currentView === 'planet' && body.type === 'planet') {
            this.showPlanetDetails(body);
        }
    }
    
    updateInfoPanel(body) {
        const infoPanel = document.getElementById('map-info-panel');
        if (!infoPanel) return;
        
        if (body) {
            infoPanel.innerHTML = `
                <h4>${body.name}</h4>
                <p><strong>Type:</strong> ${body.type}</p>
                <p><strong>Host:</strong> ${body.host}</p>
                <p><strong>Distance:</strong> ${body.distance} AU</p>
                <p><strong>Temperature:</strong> ${body.temperature}°C</p>
                <p><strong>Atmosphere:</strong> ${body.atmosphere}</p>
                ${body.civilization ? `<p><strong>Civilization:</strong> ${body.civilization}</p>` : ''}
            `;
        } else {
            infoPanel.innerHTML = `
                <h4>Veauxalia System</h4>
                <p>Binary star system with 9 planets</p>
                <p>Click on a celestial body for details</p>
            `;
        }
    }
    
    showPlanetDetails(planet) {
        // Create detailed planet view
        const details = document.createElement('div');
        details.className = 'planet-details';
        details.innerHTML = `
            <h3>${planet.name}</h3>
            <div class="planet-info">
                <div class="planet-stats">
                    <p><strong>Mass:</strong> ${planet.mass} Earth masses</p>
                    <p><strong>Radius:</strong> ${planet.radius} Earth radii</p>
                    <p><strong>Gravity:</strong> ${planet.gravity}g</p>
                    <p><strong>Day Length:</strong> ${planet.dayLength} hours</p>
                    <p><strong>Year Length:</strong> ${planet.yearLength} days</p>
                </div>
                <div class="planet-biomes">
                    <h4>Biomes:</h4>
                    <ul>
                        ${planet.biomes.map(biome => `<li>${biome}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="planet-actions">
                <button class="map-btn" onclick="window.game.loadPlanet('${planet.name}')">Travel to ${planet.name}</button>
            </div>
        `;
        
        // Replace info panel content
        const infoPanel = document.getElementById('map-info-panel');
        if (infoPanel) {
            infoPanel.innerHTML = '';
            infoPanel.appendChild(details);
        }
    }
    
    getMapBodies() {
        const bodies = [];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const scale = 50 * this.zoomLevel;
        
        // Add stars
        const hieleon = {
            name: 'Hieleon',
            type: 'star',
            host: 'Primary',
            distance: 0,
            temperature: '5778K',
            atmosphere: 'Plasma',
            screenX: centerX,
            screenY: centerY,
            radius: 20,
            color: '#FFFF00'
        };
        
        const nyxeon = {
            name: 'Nyxeon',
            type: 'star',
            host: 'Secondary',
            distance: 5,
            temperature: '4000K',
            atmosphere: 'Plasma',
            screenX: centerX + 5 * scale,
            screenY: centerY,
            radius: 15,
            color: '#FF6600'
        };
        
        bodies.push(hieleon, nyxeon);
        
        // Add planets
        const planets = [
            { name: 'Neflaym', distance: 1.5, host: 'Hieleon', type: 'Rock', mass: 1, radius: 1, gravity: 1, dayLength: 24, yearLength: 365, temperature: '0°C', atmosphere: 'Nitrogen-Oxygen', biomes: ['temperate', 'tropical', 'desert', 'arctic'] },
            { name: 'Phantom', distance: 1, host: 'Hieleon', type: 'Dwarf Planet', mass: 0.00016, radius: 0.00016, gravity: 0.00016, dayLength: 9, yearLength: 365, temperature: '-50°C', atmosphere: 'None', biomes: ['asteroid', 'cratered'] },
            { name: 'Elisium', distance: 0.4, host: 'Nyxeon', type: 'Rock', mass: 1, radius: 1, gravity: 0.9, dayLength: 28, yearLength: 180, temperature: '5°C', atmosphere: 'Nitrogen-Oxygen', biomes: ['temperate', 'forest', 'mountain', 'ocean'] },
            { name: 'Titan', distance: 0.6, host: 'Nyxeon', type: 'Dwarf Planet', mass: 0.015, radius: 0.18, gravity: 0.015, dayLength: 16, yearLength: 200, temperature: '-140°C', atmosphere: 'Nitrogen-Methane', biomes: ['ice', 'methane', 'cryogenic'] },
            { name: 'Chimera', distance: 10, host: 'Both', type: 'Rock', mass: 1.5, radius: 1.2, gravity: 1.2, dayLength: 26, yearLength: 500, temperature: '20°C', atmosphere: 'Nitrogen-Oxygen', biomes: ['temperate', 'tropical', 'desert', 'arctic', 'ocean', 'forest', 'mountain', 'swamp', 'tundra', 'volcanic'], civilization: 'United Empire of Gauletria' },
            { name: 'Baylephon', distance: 15, host: 'Both', type: 'Gas Giant', mass: 8, radius: 3, gravity: 2.5, dayLength: 12, yearLength: 800, temperature: '-100°C', atmosphere: 'Hydrogen-Helium', biomes: ['gas', 'storm', 'aurora'] },
            { name: 'Dimetrian', distance: 25, host: 'Both', type: 'Gas Giant', mass: 159, radius: 8, gravity: 2.8, dayLength: 10, yearLength: 1500, temperature: '-150°C', atmosphere: 'Hydrogen-Helium', biomes: ['gas', 'storm', 'aurora', 'ring'] },
            { name: 'Sufreign', distance: 35, host: 'Both', type: 'Gas Giant', mass: 159, radius: 8, gravity: 2.8, dayLength: 8, yearLength: 2500, temperature: '-200°C', atmosphere: 'Hydrogen-Helium', biomes: ['gas', 'storm', 'aurora', 'ring'] },
            { name: 'Areon', distance: 40, host: 'Both', type: 'Ice Dwarf', mass: 0.0022, radius: 0.2, gravity: 0.0022, dayLength: 6, yearLength: 4000, temperature: '-235°C', atmosphere: 'None', biomes: ['ice', 'cryogenic', 'comet'] },
            { name: 'Gallian', distance: 45, host: 'Both', type: 'Ice Dwarf', mass: 0.0022, radius: 0.2, gravity: 0.0022, dayLength: 6, yearLength: 5000, temperature: '-235°C', atmosphere: 'None', biomes: ['ice', 'cryogenic', 'comet'] },
            { name: 'Lagnia', distance: 50, host: 'Both', type: 'Ice Dwarf', mass: 0.0022, radius: 0.2, gravity: 0.0022, dayLength: 6, yearLength: 6000, temperature: '-235°C', atmosphere: 'None', biomes: ['ice', 'cryogenic', 'comet'] }
        ];
        
        planets.forEach(planet => {
            const angle = Math.random() * Math.PI * 2; // Random orbital position
            const distance = planet.distance * scale;
            
            bodies.push({
                ...planet,
                screenX: centerX + Math.cos(angle) * distance,
                screenY: centerY + Math.sin(angle) * distance,
                radius: Math.max(5, planet.mass * 3),
                color: this.getPlanetColor(planet.type)
            });
        });
        
        return bodies;
    }
    
    getPlanetColor(type) {
        const colors = {
            'Rock': '#8B4513',
            'Gas Giant': '#FFD700',
            'Ice Dwarf': '#87CEEB',
            'Dwarf Planet': '#696969'
        };
        return colors[type] || '#808080';
    }
    
    render() {
        if (!this.ctx || !this.canvas) return;
        
        // Clear canvas
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw starfield background
        this.drawStarfield();
        
        // Draw orbital paths
        this.drawOrbitalPaths();
        
        // Draw celestial bodies
        const bodies = this.getMapBodies();
        bodies.forEach(body => {
            this.drawBody(body);
        });
        
        // Draw labels
        bodies.forEach(body => {
            this.drawLabel(body);
        });
        
        // Draw selection indicator
        if (this.selectedBody) {
            this.drawSelectionIndicator(this.selectedBody);
        }
    }
    
    drawStarfield() {
        this.ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 2;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawOrbitalPaths() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const scale = 50 * this.zoomLevel;
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Draw circular orbits
        [1, 5, 10, 15, 25, 35, 40, 45, 50].forEach(distance => {
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, distance * scale, 0, Math.PI * 2);
            this.ctx.stroke();
        });
    }
    
    drawBody(body) {
        // Draw glow effect for stars
        if (body.type === 'star') {
            const gradient = this.ctx.createRadialGradient(
                body.screenX, body.screenY, 0,
                body.screenX, body.screenY, body.radius * 2
            );
            gradient.addColorStop(0, body.color);
            gradient.addColorStop(0.5, body.color + '80');
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(body.screenX, body.screenY, body.radius * 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Draw body
        this.ctx.fillStyle = body.color;
        this.ctx.beginPath();
        this.ctx.arc(body.screenX, body.screenY, body.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw border
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
    
    drawLabel(body) {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        
        const labelY = body.screenY + body.radius + 15;
        this.ctx.fillText(body.name, body.screenX, labelY);
    }
    
    drawSelectionIndicator(body) {
        this.ctx.strokeStyle = '#00FFFF';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([5, 5]);
        
        this.ctx.beginPath();
        this.ctx.arc(body.screenX, body.screenY, body.radius + 5, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }
    
    showTooltip(body, x, y) {
        // Remove existing tooltip
        this.hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        tooltip.innerHTML = `
            <strong>${body.name}</strong><br>
            Type: ${body.type}<br>
            Distance: ${body.distance} AU
        `;
        tooltip.style.cssText = `
            position: fixed;
            left: ${x + 10}px;
            top: ${y - 10}px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(tooltip);
        this.currentTooltip = tooltip;
    }
    
    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }
    
    show() {
        const overlay = document.getElementById('map-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            this.render();
        }
    }
    
    hide() {
        const overlay = document.getElementById('map-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
        this.hideTooltip();
    }
    
    update(deltaTime) {
        // Animate orbital positions
        if (this.isVisible) {
            this.render();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Map;
}