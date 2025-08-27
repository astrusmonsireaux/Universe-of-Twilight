// Main Game Engine for Veauxalia
class Game {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.gameTime = 0;
        this.deltaTime = 0;
        this.lastFrameTime = 0;
        this.timeScale = 1.0;
        
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
        
        // Language system
        this.languageSystem = null;
        
        // Political and Cultural systems
        this.politicalSystem = null;
        this.culturalSystem = null;
        this.imperialUI = null;
        
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
            showInstructions: true,
            language: 'english'
        };
        
        // Event listeners
        this.eventListeners = new Map();
        
        this.init();
    }
    
    async init() {
        try {
            console.log('Initializing Veauxalia game...');
            
            // Check if required classes are available
            if (typeof LanguageSystem === 'undefined') {
                throw new Error('LanguageSystem not loaded');
            }
            if (typeof PoliticalSystem === 'undefined') {
                throw new Error('PoliticalSystem not loaded');
            }
            if (typeof CulturalSystem === 'undefined') {
                throw new Error('CulturalSystem not loaded');
            }
            if (typeof Scene === 'undefined') {
                throw new Error('Scene not loaded');
            }
            if (typeof Player === 'undefined') {
                throw new Error('Player not loaded');
            }
            if (typeof Camera === 'undefined') {
                throw new Error('Camera not loaded');
            }
            if (typeof Controls === 'undefined') {
                throw new Error('Controls not loaded');
            }
            if (typeof Planet === 'undefined') {
                throw new Error('Planet not loaded');
            }
            
            // Initialize language system first
            this.languageSystem = new LanguageSystem();
            this.languageSystem.setLanguage(this.settings.language);
            
            // Initialize political and cultural systems
            this.politicalSystem = new PoliticalSystem();
            this.culturalSystem = new CulturalSystem();
            this.imperialUI = new ImperialUI();
            this.imperialUI.setSystems(this.politicalSystem, this.culturalSystem, this.languageSystem);
            
            // Initialize core systems
            this.scene = new Scene();
            this.camera = new Camera();
            this.player = new Player();
            this.controls = new Controls();
            
            // Initialize world systems
            this.physics = new Physics();
            this.weather = new Weather();
            this.solarSystem = new SolarSystem();
            this.orbitalMechanics = new OrbitalMechanics();
            
            // Initialize UI systems
            this.hud = new HUD();
            this.menu = new Menu();
            this.crafting = new Crafting();
            this.map = new Map();
            
            // Connect systems
            this.connectSystems();
            
            // Load initial planet (Chimera)
            await this.loadPlanet('Chimera');
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize UI
            this.hud.init();
            this.menu.init();
            this.crafting.init();
            this.map.init();
            
                    // Show welcome message
        this.showWelcomeMessage();
        
        // Show imperial decree
        setTimeout(() => {
            this.imperialUI.showImperialDecree();
        }, 2000);
        
        // Show cultural event
        setTimeout(() => {
            this.imperialUI.showCulturalEvent();
        }, 4000);
            
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
        
        // Unload current planet
        if (this.currentPlanet) {
            this.currentPlanet = null;
        }
        
        // Create new planet
        this.currentPlanet = new Planet(planetName);
        await this.currentPlanet.init();
        
        // Set player spawn point
        const spawnPoint = this.currentPlanet.getSpawnPoint();
        this.player.setPosition(spawnPoint.x, spawnPoint.y, spawnPoint.z);
        
        // Update camera target
        this.camera.setTarget(this.player);
        
        // Update current location
        this.currentLocation = planetName;
        
        // Update HUD
        this.hud.updateLocation(planetName);
        
        // Add planet to scene
        this.currentPlanet.render(this.scene);
        
        console.log(`Planet ${planetName} loaded successfully`);
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
        // Apply time scale
        const scaledDeltaTime = deltaTime * this.timeScale;
        
        this.gameTime += scaledDeltaTime;
        
        // Update player movement based on controls
        this.player.move(this.controls, scaledDeltaTime);
        
        // Handle jumping
        if (this.controls.jump) {
            this.player.jump();
        }
        
        // Update core systems
        this.player.update(scaledDeltaTime);
        this.camera.update(scaledDeltaTime);
        this.controls.update(scaledDeltaTime);
        
        // Update world systems
        if (this.currentPlanet) {
            this.currentPlanet.update(scaledDeltaTime);
        }
        
        // Update enhanced systems
        this.physics.update(scaledDeltaTime);
        this.weather.update(scaledDeltaTime);
        this.solarSystem.update(scaledDeltaTime);
        
        // Update orbital mechanics
        this.orbitalMechanics.update(scaledDeltaTime);
        
        // Update political and cultural systems
        this.politicalSystem.update(scaledDeltaTime);
        this.culturalSystem.update(scaledDeltaTime);
        this.imperialUI.update(scaledDeltaTime);
        
        // Update UI
        this.hud.update(deltaTime); // UI updates at normal speed
        
        // Update player stats
        this.updatePlayerStats(scaledDeltaTime);
        
        // Update HUD with player position
        const playerPos = this.player.getPosition();
        this.hud.updateCoordinates(playerPos.x, playerPos.y, playerPos.z);
        
        // Handle player interactions
        this.handlePlayerInteractions();
        
        // Check for warnings
        this.checkPlayerWarnings();
    }
    
    render() {
        if (!this.isRunning) return;
        
        // Render scene
        this.scene.render();
        
        // Render current planet
        if (this.currentPlanet) {
            this.currentPlanet.render(this.scene);
        }
        
        // Render solar system
        if (this.solarSystem) {
            this.solarSystem.render(this.scene);
        }
        
        // Render weather effects
        if (this.weather) {
            this.weather.render(this.scene);
        }
        
        // Render physics objects
        if (this.physics) {
            this.physics.render(this.scene);
        }
        
        // Render orbital mechanics
        if (this.orbitalMechanics) {
            this.orbitalMechanics.render(this.scene);
        }
        
        // Render atmospheric effects
        if (this.currentPlanet && this.currentPlanet.atmosphere) {
            this.currentPlanet.atmosphere.render(this.scene);
        }
        
        // Render UI
        this.hud.render();
    }
    
    updatePlayerStats(deltaTime) {
        // Update player data for save/load
        this.playerData.health = this.player.getHealth();
        this.playerData.energy = this.player.getEnergy();
        this.playerData.position = this.player.getPosition();
        this.playerData.rotation = this.player.rotation;
        
        // Update HUD with current stats
        this.hud.updateHealthBar();
        this.hud.updateEnergyBar();
        this.hud.updateAbilityIndicators();
        this.hud.updatePhotosynthesisStatus();
    }
    
    checkPlayerWarnings() {
        const player = this.player;
        
        // Check for low energy warning
        if (player.getEnergy() < 20 && !this.energyWarningShown) {
            this.hud.showEnergyWarning();
            this.energyWarningShown = true;
        } else if (player.getEnergy() > 30) {
            this.energyWarningShown = false;
        }
        
        // Check for low health warning
        if (player.getHealth() < 30 && !this.healthWarningShown) {
            this.hud.showHealthWarning();
            this.healthWarningShown = true;
        } else if (player.getHealth() > 50) {
            this.healthWarningShown = false;
        }
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
        
        // Language settings
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
        
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
        
        // Keyboard shortcuts for language switching
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.shiftKey) {
                switch (event.code) {
                    case 'KeyE':
                        event.preventDefault();
                        this.setLanguage('english');
                        break;
                    case 'KeyG':
                        event.preventDefault();
                        this.setLanguage('gaulsais');
                        break;
                }
            }
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
            case 'KeyI':
                this.imperialUI.showOverlay('imperial-status');
                break;
            case 'KeyP':
                this.imperialUI.showOverlay('political');
                break;
            case 'KeyC':
                this.imperialUI.showOverlay('cultural');
                break;
            case 'KeyR':
                this.imperialUI.showOverlay('citizen-rights');
                break;
            case 'KeyF':
                this.imperialUI.showOverlay('festival');
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
        // Handle special items that unlock abilities
        if (item.name === 'Telepathy Crystal') {
            this.unlockPlayerAbility('telepathy');
            this.hud.showMessage('Telepathy ability unlocked!');
            return true;
        }
        
        if (item.name === 'Time Crystal') {
            this.unlockPlayerAbility('timePerception');
            this.hud.showMessage('Time perception ability unlocked!');
            return true;
        }
        
        // Handle consumable items
        if (item.type === 'consumable') {
            this.useConsumable(item);
            return true;
        }
        
        // Find empty slot
        for (let i = 0; i < this.playerData.inventory.length; i++) {
            if (!this.playerData.inventory[i]) {
                this.playerData.inventory[i] = { ...item };
                this.hud.updateInventory(this.playerData.inventory);
                return true;
            }
        }
        
        // Check if item can be stacked
        for (let i = 0; i < this.playerData.inventory.length; i++) {
            const existingItem = this.playerData.inventory[i];
            if (existingItem && existingItem.name === item.name) {
                const maxStack = ITEM_DATA[item.name]?.maxStack || 64;
                if (existingItem.count < maxStack) {
                    existingItem.count = (existingItem.count || 1) + (item.count || 1);
                    this.hud.updateInventory(this.playerData.inventory);
                    return true;
                }
            }
        }
        
        return false; // Inventory full
    }
    
    useConsumable(item) {
        const itemData = ITEM_DATA[item.name];
        if (!itemData) return;
        
        if (itemData.healthRestore) {
            this.player.heal(itemData.healthRestore);
            this.hud.showMessage(`Restored ${itemData.healthRestore} health!`);
        }
        
        if (itemData.energyRestore) {
            this.player.restoreEnergy(itemData.energyRestore);
            this.hud.showMessage(`Restored ${itemData.energyRestore} energy!`);
        }
        
        if (itemData.effect === 'enhances_photosynthesis') {
            this.player.sunlightBonus *= 1.5; // Enhance photosynthesis
            this.hud.showMessage('Photosynthesis enhanced!');
        }
    }
    
    removeItemFromInventory(itemName, count = 1) {
        for (let i = 0; i < this.playerData.inventory.length; i++) {
            const item = this.playerData.inventory[i];
            if (item && item.name === itemName) {
                if (item.count <= count) {
                    this.playerData.inventory[i] = null;
                } else {
                    item.count -= count;
                }
                this.hud.updateInventory(this.playerData.inventory);
                return true;
            }
        }
        return false;
    }
    
    hasItem(itemName, count = 1) {
        let totalCount = 0;
        for (const item of this.playerData.inventory) {
            if (item && item.name === itemName) {
                totalCount += item.count || 1;
            }
        }
        return totalCount >= count;
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
    
    // Enhanced save/load with abilities
    saveGame() {
        const saveData = {
            playerData: this.playerData,
            currentLocation: this.currentLocation,
            gameTime: this.gameTime,
            settings: this.settings,
            playerAbilities: this.player.abilities,
            unlockedAbilities: Object.keys(this.player.abilities).filter(key => this.player.abilities[key])
        };
        
        localStorage.setItem('veauxalia_save', JSON.stringify(saveData));
        console.log('Game saved with abilities!');
    }
    
    loadGame() {
        const saveData = localStorage.getItem('veauxalia_save');
        if (saveData) {
            const data = JSON.parse(saveData);
            this.playerData = data.playerData;
            this.currentLocation = data.currentLocation;
            this.gameTime = data.gameTime;
            this.settings = data.settings;
            
            // Restore player abilities
            if (data.playerAbilities) {
                this.player.abilities = data.playerAbilities;
            }
            
            // Reload current planet
            this.loadPlanet(this.currentLocation);
            
            console.log('Game loaded with abilities!');
            return true;
        }
        return false;
    }

    handlePlayerInteractions() {
        // Handle item collection
        if (this.controls.interact) {
            this.collectNearbyItems();
        }
        
        // Handle crafting
        if (this.controls.craft) {
            this.crafting.show();
        }
        
        // Handle map
        if (this.controls.map) {
            this.map.show();
        }
        
        // Handle inventory
        if (this.controls.inventory) {
            this.toggleInventory();
        }
        
        // Handle ability usage
        if (this.controls.telepathy) {
            this.player.useAbility('telepathy');
        }
        
        if (this.controls.timePerception) {
            this.player.useAbility('timePerception');
        }
    }
    
    collectNearbyItems() {
        // Simple item collection system
        const playerPos = this.player.getPosition();
        const collectionRadius = 3;
        
        // Check for items in the world
        if (this.currentPlanet && this.currentPlanet.objects) {
            this.currentPlanet.objects.forEach((object, id) => {
                if (object.item) {
                    const distance = Math.sqrt(
                        Math.pow(object.position.x - playerPos.x, 2) +
                        Math.pow(object.position.y - playerPos.y, 2) +
                        Math.pow(object.position.z - playerPos.z, 2)
                    );
                    
                    if (distance < collectionRadius) {
                        if (this.addItemToInventory(object.item)) {
                            // Remove from world
                            this.currentPlanet.objects.delete(id);
                            this.hud.showMessage(`Collected ${object.item.name}!`);
                        } else {
                            this.hud.showMessage('Inventory is full!');
                        }
                    }
                }
            });
        }
    }

    toggleInventory() {
        // Toggle inventory visibility
        const inventory = document.getElementById('inventory');
        if (inventory) {
            inventory.classList.toggle('expanded');
        }
    }

    unlockPlayerAbility(abilityName) {
        if (this.player.unlockAbility(abilityName)) {
            this.hud.showAbilityUnlocked(abilityName);
            return true;
        }
        return false;
    }
    
    setTimeScale(scale) {
        this.timeScale = scale;
        console.log(`Time scale set to: ${scale}`);
    }

    connectSystems() {
        // Connect weather and atmosphere systems
        if (this.currentPlanet && this.currentPlanet.atmosphere) {
            this.currentPlanet.atmosphere.setWeatherSystem(this.weather);
        }
        
        // Connect physics system to player
        this.physics.addObject(this.player, {
            affectedByGravity: true,
            radius: 0.5,
            mass: 70
        });
        
        // Connect orbital mechanics to solar system
        this.orbitalMechanics.setTimeScale(1.0);
    }

    showWelcomeMessage() {
        const welcomeMessage = this.languageSystem.translate('welcome', 'messages');
        const imperialGreeting = this.languageSystem.generateImperialGreeting();
        
        setTimeout(() => {
            this.hud.showMessage(welcomeMessage);
        }, 1000);
        
        setTimeout(() => {
            this.hud.showMessage(imperialGreeting);
        }, 3000);
        
        // Show Veauxalia time
        setTimeout(() => {
            const veauxaliaTime = this.languageSystem.convertToVeauxaliaTime(this.gameTime);
            this.hud.showMessage(`Current time: ${veauxaliaTime.formatted}`);
        }, 5000);
    }
    
    setLanguage(language) {
        this.settings.language = language;
        this.languageSystem.setLanguage(language);
        
        // Update UI elements
        this.updateUIText();
        
        // Show language change message
        const message = language === 'gaulsais' ? 
            'Lingua mutata ad Gaulsais!' : 
            'Language changed to English!';
        this.hud.showMessage(message);
    }
    
    updateUIText() {
        // Update menu buttons
        const menuButtons = document.querySelectorAll('.menu-btn');
        menuButtons.forEach(button => {
            const key = button.getAttribute('data-translate');
            if (key) {
                button.textContent = this.languageSystem.translate(key, 'ui');
            }
        });
        
        // Update HUD elements
        const hudElements = document.querySelectorAll('[data-translate]');
        hudElements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const category = element.getAttribute('data-translate-category') || 'ui';
            element.textContent = this.languageSystem.translate(key, category);
        });
    }
    
    getTranslatedMessage(key, params = {}) {
        return this.languageSystem.translateWithParams(key, params, 'messages');
    }
    
    getTranslatedPlanetName(planetName) {
        return this.languageSystem.translate(planetName, 'planets');
    }
    
    getTranslatedItemName(itemName) {
        return this.languageSystem.translate(itemName, 'items');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Game;
}