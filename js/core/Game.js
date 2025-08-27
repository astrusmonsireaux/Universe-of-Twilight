// Main Game Engine for Veauxalia
class Game {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.gameTime = 0;
        this.deltaTime = 0;
        this.lastFrameTime = 0;
        
        // Core systems
        this.scene = null;
        this.player = null;
        this.camera = null;
        this.controls = null;
        
        // World systems
        this.currentPlanet = null;
        this.solarSystem = null;
        this.weather = null;
        this.physics = null;
        
        // UI systems
        this.hud = null;
        this.menu = null;
        this.crafting = null;
        this.map = null;
        
        // Game state
        this.gameMode = 'survival'; // survival, creative, adventure, sandbox
        this.currentLocation = 'Chimera';
        this.playerData = {
            health: GAME_CONSTANTS.MAX_HEALTH,
            energy: GAME_CONSTANTS.MAX_ENERGY,
            inventory: new Array(GAME_CONSTANTS.INVENTORY_SLOTS).fill(null),
            position: { x: 0, y: 100, z: 0 },
            rotation: { x: 0, y: 0, z: 0 }
        };
        
        // Settings
        this.settings = {
            graphicsQuality: 'medium',
            soundVolume: 0.5,
            musicVolume: 0.3,
            mouseSensitivity: 1.0,
            showInstructions: true
        };
        
        // Event listeners
        this.eventListeners = new Map();
        
        this.init();
    }
    
    async init() {
        try {
            console.log('Initializing Veauxalia game...');
            
            // Initialize core systems
            this.scene = new Scene();
            this.camera = new Camera();
            this.player = new Player();
            this.controls = new Controls();
            
            // Initialize world systems
            this.physics = new Physics();
            this.weather = new Weather();
            this.solarSystem = new SolarSystem();
            
            // Initialize UI systems
            this.hud = new HUD();
            this.menu = new Menu();
            this.crafting = new Crafting();
            this.map = new Map();
            
            // Load initial planet (Chimera)
            await this.loadPlanet('Chimera');
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize UI
            this.hud.init();
            this.menu.init();
            this.crafting.init();
            this.map.init();
            
            // Hide loading screen and show game
            this.hideLoadingScreen();
            
            console.log('Game initialization complete!');
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showError('Failed to initialize game. Please refresh the page.');
        }
    }
    
    async loadPlanet(planetName) {
        console.log(`Loading planet: ${planetName}`);
        
        // Create planet instance
        this.currentPlanet = new Planet(planetName);
        await this.currentPlanet.init();
        
        // Update player position to planet surface
        const spawnPoint = this.currentPlanet.getSpawnPoint();
        this.player.setPosition(spawnPoint.x, spawnPoint.y, spawnPoint.z);
        
        // Update camera
        this.camera.follow(this.player);
        
        // Update HUD
        this.hud.updateLocation(planetName);
        
        this.currentLocation = planetName;
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.gameLoop();
        
        console.log('Game started!');
    }
    
    pause() {
        this.isPaused = true;
        this.menu.show();
    }
    
    resume() {
        this.isPaused = false;
        this.menu.hide();
    }
    
    stop() {
        this.isRunning = false;
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;
        
        if (!this.isPaused) {
            this.update(this.deltaTime);
        }
        
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update(deltaTime) {
        this.gameTime += deltaTime;
        
        // Update player movement based on controls
        this.player.move(this.controls, deltaTime);
        
        // Handle jumping
        if (this.controls.jump) {
            this.player.jump();
        }
        
        // Update core systems
        this.player.update(deltaTime);
        this.camera.update(deltaTime);
        this.controls.update(deltaTime);
        
        // Update world systems
        if (this.currentPlanet) {
            this.currentPlanet.update(deltaTime);
        }
        this.physics.update(deltaTime);
        this.weather.update(deltaTime);
        this.solarSystem.update(deltaTime);
        
        // Update UI
        this.hud.update(deltaTime);
        
        // Update player stats
        this.updatePlayerStats(deltaTime);
        
        // Update HUD with player position and biome
        const playerPos = this.player.getPosition();
        this.hud.updateCoordinates(playerPos.x, playerPos.y, playerPos.z);
        
        // Update biome display
        if (this.currentPlanet) {
            const biome = this.currentPlanet.getBiomeAt(playerPos.x, playerPos.z);
            this.hud.updateBiome(biome);
        }
        
        // Update weather display
        if (this.weather) {
            this.hud.updateWeather(this.weather);
        }
    }
    
    render() {
        // Clear scene
        this.scene.clear();
        
        // Render world
        if (this.currentPlanet) {
            this.currentPlanet.render(this.scene);
        }
        this.solarSystem.render(this.scene);
        
        // Render player
        this.player.render(this.scene);
        
        // Render UI
        this.hud.render();
        
        // Present to screen
        this.scene.render(this.camera);
    }
    
    updatePlayerStats(deltaTime) {
        // Energy regeneration (photosynthesis)
        if (this.playerData.energy < GAME_CONSTANTS.MAX_ENERGY) {
            this.playerData.energy += GAME_CONSTANTS.ENERGY_REGEN_RATE * deltaTime;
            this.playerData.energy = Math.min(this.playerData.energy, GAME_CONSTANTS.MAX_ENERGY);
        }
        
        // Health regeneration
        if (this.playerData.health < GAME_CONSTANTS.MAX_HEALTH) {
            this.playerData.health += GAME_CONSTANTS.HEALTH_REGEN_RATE * deltaTime;
            this.playerData.health = Math.min(this.playerData.health, GAME_CONSTANTS.MAX_HEALTH);
        }
        
        // Update HUD
        this.hud.updateHealth(this.playerData.health);
        this.hud.updateEnergy(this.playerData.energy);
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });
        
        document.addEventListener('keyup', (event) => {
            this.handleKeyUp(event);
        });
        
        // Mouse events
        document.addEventListener('mousemove', (event) => {
            this.handleMouseMove(event);
        });
        
        document.addEventListener('click', (event) => {
            this.handleClick(event);
        });
        
        // Touch events for mobile
        document.addEventListener('touchstart', (event) => {
            this.handleTouchStart(event);
        });
        
        document.addEventListener('touchmove', (event) => {
            this.handleTouchMove(event);
        });
        
        // Window events
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // UI events
        this.setupUIEventListeners();
    }
    
    setupUIEventListeners() {
        // Menu buttons
        document.getElementById('menu-btn').addEventListener('click', () => {
            this.pause();
        });
        
        document.getElementById('resume-btn').addEventListener('click', () => {
            this.resume();
        });
        
        document.getElementById('map-btn').addEventListener('click', () => {
            this.map.show();
        });
        
        document.getElementById('craft-btn').addEventListener('click', () => {
            this.crafting.show();
        });
        
        // Settings
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.menu.hide();
            document.getElementById('settings-overlay').classList.remove('hidden');
        });
        
        document.getElementById('settings-back').addEventListener('click', () => {
            document.getElementById('settings-overlay').classList.add('hidden');
            this.menu.show();
        });
        
        // Instructions
        document.getElementById('close-instructions').addEventListener('click', () => {
            document.getElementById('instructions').classList.add('hidden');
            this.settings.showInstructions = false;
        });
        
        // Inventory slots
        const inventorySlots = document.querySelectorAll('.inventory-slot');
        inventorySlots.forEach((slot, index) => {
            slot.addEventListener('click', () => {
                this.selectInventorySlot(index);
            });
        });
    }
    
    handleKeyDown(event) {
        if (this.isPaused) return;
        
        switch (event.code) {
            case 'KeyW':
                this.controls.setForward(true);
                break;
            case 'KeyS':
                this.controls.setBackward(true);
                break;
            case 'KeyA':
                this.controls.setLeft(true);
                break;
            case 'KeyD':
                this.controls.setRight(true);
                break;
            case 'Space':
                this.controls.setJump(true);
                break;
            case 'KeyE':
                this.interact();
                break;
            case 'KeyQ':
                this.dropItem();
                break;
            case 'Digit1':
            case 'Digit2':
            case 'Digit3':
            case 'Digit4':
            case 'Digit5':
                const slot = parseInt(event.code.replace('Digit', '')) - 1;
                this.selectInventorySlot(slot);
                break;
            case 'KeyM':
                this.map.show();
                break;
            case 'Escape':
                this.pause();
                break;
        }
    }
    
    handleKeyUp(event) {
        switch (event.code) {
            case 'KeyW':
                this.controls.setForward(false);
                break;
            case 'KeyS':
                this.controls.setBackward(false);
                break;
            case 'KeyA':
                this.controls.setLeft(false);
                break;
            case 'KeyD':
                this.controls.setRight(false);
                break;
            case 'Space':
                this.controls.setJump(false);
                break;
        }
    }
    
    handleMouseMove(event) {
        if (this.isPaused) return;
        
        const sensitivity = this.settings.mouseSensitivity * 0.002;
        const deltaX = event.movementX * sensitivity;
        const deltaY = event.movementY * sensitivity;
        
        this.camera.rotate(deltaX, deltaY);
    }
    
    handleClick(event) {
        if (this.isPaused) return;
        
        // Handle interaction with objects
        this.interact();
    }
    
    handleTouchStart(event) {
        // Mobile touch handling
        event.preventDefault();
    }
    
    handleTouchMove(event) {
        // Mobile touch handling
        event.preventDefault();
    }
    
    handleResize() {
        // Update camera and renderer
        this.camera.updateAspect();
        this.scene.updateSize();
    }
    
    interact() {
        // Raycast to find interactable objects
        const ray = this.camera.getRay();
        const hit = this.currentPlanet.raycast(ray);
        
        if (hit && hit.object.interactable) {
            hit.object.interact(this.player);
        }
    }
    
    dropItem() {
        const selectedSlot = this.getSelectedInventorySlot();
        if (selectedSlot !== null && this.playerData.inventory[selectedSlot]) {
            const item = this.playerData.inventory[selectedSlot];
            this.playerData.inventory[selectedSlot] = null;
            
            // Create dropped item in world
            this.currentPlanet.dropItem(item, this.player.getPosition());
        }
    }
    
    selectInventorySlot(index) {
        // Update UI
        document.querySelectorAll('.inventory-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        document.querySelector(`[data-slot="${index}"]`).classList.add('selected');
        
        // Update player
        this.player.setSelectedSlot(index);
    }
    
    getSelectedInventorySlot() {
        const selectedSlot = document.querySelector('.inventory-slot.selected');
        return selectedSlot ? parseInt(selectedSlot.dataset.slot) : 0;
    }
    
    addItemToInventory(item) {
        const emptySlot = this.playerData.inventory.findIndex(slot => slot === null);
        if (emptySlot !== -1) {
            this.playerData.inventory[emptySlot] = item;
            this.hud.updateInventory(this.playerData.inventory);
            return true;
        }
        return false;
    }
    
    removeItemFromInventory(slot) {
        if (this.playerData.inventory[slot]) {
            const item = this.playerData.inventory[slot];
            this.playerData.inventory[slot] = null;
            this.hud.updateInventory(this.playerData.inventory);
            return item;
        }
        return null;
    }
    
    takeDamage(amount) {
        this.playerData.health -= amount;
        this.playerData.health = Math.max(0, this.playerData.health);
        this.hud.updateHealth(this.playerData.health);
        
        if (this.playerData.health <= 0) {
            this.gameOver();
        }
    }
    
    heal(amount) {
        this.playerData.health += amount;
        this.playerData.health = Math.min(GAME_CONSTANTS.MAX_HEALTH, this.playerData.health);
        this.hud.updateHealth(this.playerData.health);
    }
    
    consumeEnergy(amount) {
        this.playerData.energy -= amount;
        this.playerData.energy = Math.max(0, this.playerData.energy);
        this.hud.updateEnergy(this.playerData.energy);
    }
    
    gameOver() {
        console.log('Game Over!');
        this.stop();
        // Show game over screen
        this.showGameOver();
    }
    
    showGameOver() {
        // Create game over overlay
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        overlay.innerHTML = `
            <div class="menu-content">
                <h2>Game Over</h2>
                <p>You have perished in the harsh environment of ${this.currentLocation}.</p>
                <div class="menu-buttons">
                    <button id="restart-btn" class="menu-btn">Restart</button>
                    <button id="main-menu-btn" class="menu-btn">Main Menu</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Add event listeners
        document.getElementById('restart-btn').addEventListener('click', () => {
            location.reload();
        });
        
        document.getElementById('main-menu-btn').addEventListener('click', () => {
            location.reload();
        });
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const gameContainer = document.getElementById('game-container');
        
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            gameContainer.classList.remove('hidden');
            
            // Show instructions if first time
            if (this.settings.showInstructions) {
                document.getElementById('instructions').classList.remove('hidden');
            }
            
            // Start the game
            this.start();
        }, 500);
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
        `;
        document.body.appendChild(errorDiv);
    }
    
    // Save/Load functionality
    saveGame() {
        const saveData = {
            playerData: this.playerData,
            currentLocation: this.currentLocation,
            gameTime: this.gameTime,
            settings: this.settings
        };
        
        localStorage.setItem('veauxalia_save', JSON.stringify(saveData));
        console.log('Game saved!');
    }
    
    loadGame() {
        const saveData = localStorage.getItem('veauxalia_save');
        if (saveData) {
            const data = JSON.parse(saveData);
            this.playerData = data.playerData;
            this.currentLocation = data.currentLocation;
            this.gameTime = data.gameTime;
            this.settings = data.settings;
            
            // Reload current planet
            this.loadPlanet(this.currentLocation);
            
            console.log('Game loaded!');
            return true;
        }
        return false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Game;
}