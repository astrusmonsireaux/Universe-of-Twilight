// Enhanced HUD for Homo Kaylex
class HUD {
    constructor() {
        this.elements = {};
        this.messages = [];
        this.messageTimeout = 3000; // 3 seconds
        this.lastUpdate = 0;
        this.updateInterval = 100; // Update every 100ms
        
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.createAbilityIndicators();
        this.createPhotosynthesisIndicator();
        
        console.log('Enhanced HUD initialized');
    }
    
    cacheElements() {
        // Health and energy bars
        this.elements.healthFill = document.getElementById('health-fill');
        this.elements.healthText = document.getElementById('health-text');
        this.elements.energyFill = document.getElementById('energy-fill');
        this.elements.energyText = document.getElementById('energy-text');
        
        // Location and coordinates
        this.elements.currentLocation = document.getElementById('current-location');
        this.elements.coordinates = document.getElementById('coordinates');
        
        // Inventory
        this.elements.inventory = document.getElementById('inventory');
        
        // Create message container if it doesn't exist
        if (!document.getElementById('hud-messages')) {
            const messageContainer = document.createElement('div');
            messageContainer.id = 'hud-messages';
            messageContainer.className = 'hud-messages';
            document.getElementById('hud').appendChild(messageContainer);
        }
        this.elements.messages = document.getElementById('hud-messages');
    }
    
    setupEventListeners() {
        // Inventory slot clicks
        if (this.elements.inventory) {
            this.elements.inventory.addEventListener('click', (event) => {
                const slot = event.target.closest('.inventory-slot');
                if (slot) {
                    const slotIndex = parseInt(slot.dataset.slot);
                    this.selectInventorySlot(slotIndex);
                }
            });
        }
    }
    
    createAbilityIndicators() {
        // Create ability indicators container
        const abilityContainer = document.createElement('div');
        abilityContainer.className = 'ability-indicators';
        abilityContainer.innerHTML = `
            <div class="ability-indicator" id="telepathy-indicator">
                <div class="ability-icon">🧠</div>
                <div class="ability-cooldown"></div>
            </div>
            <div class="ability-indicator" id="time-perception-indicator">
                <div class="ability-icon">⏰</div>
                <div class="ability-cooldown"></div>
            </div>
            <div class="ability-indicator" id="enhanced-vision-indicator">
                <div class="ability-icon">👁️</div>
                <div class="ability-cooldown"></div>
            </div>
        `;
        
        document.getElementById('hud').appendChild(abilityContainer);
        
        // Add styles for ability indicators
        const style = document.createElement('style');
        style.textContent = `
            .ability-indicators {
                position: absolute;
                top: 20px;
                right: 20px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                z-index: 100;
            }
            
            .ability-indicator {
                width: 50px;
                height: 50px;
                background: rgba(0, 0, 0, 0.7);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .ability-indicator:hover {
                border-color: rgba(255, 255, 255, 0.8);
                transform: scale(1.1);
            }
            
            .ability-indicator.active {
                border-color: #00ff00;
                box-shadow: 0 0 10px #00ff00;
            }
            
            .ability-indicator.locked {
                opacity: 0.5;
                filter: grayscale(1);
            }
            
            .ability-icon {
                font-size: 20px;
                color: white;
            }
            
            .ability-cooldown {
                position: absolute;
                bottom: -5px;
                left: 50%;
                transform: translateX(-50%);
                width: 40px;
                height: 4px;
                background: rgba(255, 0, 0, 0.5);
                border-radius: 2px;
                overflow: hidden;
            }
            
            .ability-cooldown-fill {
                height: 100%;
                background: #ff0000;
                transition: width 0.1s linear;
            }
            
            .photosynthesis-indicator {
                position: absolute;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                align-items: center;
                gap: 10px;
                background: rgba(0, 0, 0, 0.7);
                padding: 10px 15px;
                border-radius: 20px;
                color: white;
                font-size: 14px;
            }
            
            .sun-icon {
                font-size: 18px;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
            }
            
            .hud-messages {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
                z-index: 1000;
            }
            
            .hud-message {
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                font-size: 16px;
                text-align: center;
                opacity: 0;
                transform: translateY(-20px);
                transition: all 0.3s ease;
            }
            
            .hud-message.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    createPhotosynthesisIndicator() {
        const photosynthesisContainer = document.createElement('div');
        photosynthesisContainer.className = 'photosynthesis-indicator';
        photosynthesisContainer.innerHTML = `
            <span class="sun-icon">☀️</span>
            <span id="photosynthesis-status">Photosynthesis Active</span>
        `;
        
        document.getElementById('hud').appendChild(photosynthesisContainer);
    }
    
    update(deltaTime) {
        const currentTime = Date.now();
        
        // Update at specified interval
        if (currentTime - this.lastUpdate < this.updateInterval) {
            return;
        }
        
        this.lastUpdate = currentTime;
        
        // Update player stats
        if (window.game && window.game.player) {
            this.updateHealthBar();
            this.updateEnergyBar();
            this.updateAbilityIndicators();
            this.updatePhotosynthesisStatus();
        }
        
        // Update messages
        this.updateMessages();
    }
    
    updateHealthBar() {
        const player = window.game.player;
        const health = player.getHealth();
        const maxHealth = GAME_CONSTANTS.MAX_HEALTH;
        const healthPercent = (health / maxHealth) * 100;
        
        if (this.elements.healthFill) {
            this.elements.healthFill.style.width = `${healthPercent}%`;
            
            // Change color based on health level
            if (healthPercent > 60) {
                this.elements.healthFill.style.backgroundColor = '#00ff00';
            } else if (healthPercent > 30) {
                this.elements.healthFill.style.backgroundColor = '#ffff00';
            } else {
                this.elements.healthFill.style.backgroundColor = '#ff0000';
            }
        }
        
        if (this.elements.healthText) {
            this.elements.healthText.textContent = `${Math.round(health)}%`;
        }
    }
    
    updateEnergyBar() {
        const player = window.game.player;
        const energy = player.getEnergy();
        const maxEnergy = GAME_CONSTANTS.MAX_ENERGY;
        const energyPercent = (energy / maxEnergy) * 100;
        
        if (this.elements.energyFill) {
            this.elements.energyFill.style.width = `${energyPercent}%`;
            
            // Change color based on energy level
            if (energyPercent > 60) {
                this.elements.energyFill.style.backgroundColor = '#00ffff';
            } else if (energyPercent > 30) {
                this.elements.energyFill.style.backgroundColor = '#ffaa00';
            } else {
                this.elements.energyFill.style.backgroundColor = '#ff0000';
            }
        }
        
        if (this.elements.energyText) {
            this.elements.energyText.textContent = `${Math.round(energy)}%`;
        }
    }
    
    updateAbilityIndicators() {
        const player = window.game.player;
        
        // Update telepathy indicator
        const telepathyIndicator = document.getElementById('telepathy-indicator');
        if (telepathyIndicator) {
            const cooldownElement = telepathyIndicator.querySelector('.ability-cooldown');
            
            if (player.abilities.telepathy) {
                telepathyIndicator.classList.remove('locked');
                
                // Check if ability is active
                if (player.isAbilityActive('telepathy')) {
                    telepathyIndicator.classList.add('active');
                    const timer = player.getAbilityTimer('telepathy');
                    const duration = player.abilityDurations.telepathy;
                    const remaining = Math.max(0, timer / duration);
                    
                    if (cooldownElement) {
                        cooldownElement.style.height = `${remaining * 100}%`;
                        cooldownElement.style.backgroundColor = '#4444ff';
                    }
                } else {
                    telepathyIndicator.classList.remove('active');
                    
                    // Check cooldown
                    const cooldown = player.getAbilityCooldown('telepathy');
                    if (cooldown > 0) {
                        if (cooldownElement) {
                            cooldownElement.style.height = `${(cooldown / 30) * 100}%`;
                            cooldownElement.style.backgroundColor = '#666666';
                        }
                    } else {
                        // Check if enough energy
                        if (player.energy >= player.abilityCosts.telepathy) {
                            telepathyIndicator.classList.add('available');
                        } else {
                            telepathyIndicator.classList.remove('available');
                        }
                        
                        if (cooldownElement) {
                            cooldownElement.style.height = '0%';
                        }
                    }
                }
            } else {
                telepathyIndicator.classList.add('locked');
                if (cooldownElement) {
                    cooldownElement.style.height = '0%';
                }
            }
        }
        
        // Update time perception indicator
        const timePerceptionIndicator = document.getElementById('time-perception-indicator');
        if (timePerceptionIndicator) {
            const cooldownElement = timePerceptionIndicator.querySelector('.ability-cooldown');
            
            if (player.abilities.timePerception) {
                timePerceptionIndicator.classList.remove('locked');
                
                // Check if ability is active
                if (player.isAbilityActive('timePerception')) {
                    timePerceptionIndicator.classList.add('active');
                    const timer = player.getAbilityTimer('timePerception');
                    const duration = player.abilityDurations.timePerception;
                    const remaining = Math.max(0, timer / duration);
                    
                    if (cooldownElement) {
                        cooldownElement.style.height = `${remaining * 100}%`;
                        cooldownElement.style.backgroundColor = '#ffaa00';
                    }
                } else {
                    timePerceptionIndicator.classList.remove('active');
                    
                    // Check cooldown
                    const cooldown = player.getAbilityCooldown('timePerception');
                    if (cooldown > 0) {
                        if (cooldownElement) {
                            cooldownElement.style.height = `${(cooldown / 60) * 100}%`;
                            cooldownElement.style.backgroundColor = '#666666';
                        }
                    } else {
                        // Check if enough energy
                        if (player.energy >= player.abilityCosts.timePerception) {
                            timePerceptionIndicator.classList.add('available');
                        } else {
                            timePerceptionIndicator.classList.remove('available');
                        }
                        
                        if (cooldownElement) {
                            cooldownElement.style.height = '0%';
                        }
                    }
                }
            } else {
                timePerceptionIndicator.classList.add('locked');
                if (cooldownElement) {
                    cooldownElement.style.height = '0%';
                }
            }
        }
        
        // Update enhanced vision indicator
        const enhancedVisionIndicator = document.getElementById('enhanced-vision-indicator');
        if (enhancedVisionIndicator) {
            if (player.abilities.enhancedVision) {
                enhancedVisionIndicator.classList.remove('locked');
                enhancedVisionIndicator.classList.add('active');
                
                // Show photosynthesis bonus if active
                const photosynthesisIndicator = document.getElementById('photosynthesis-indicator');
                if (photosynthesisIndicator && player.sunlightBonus > 0) {
                    photosynthesisIndicator.classList.add('active');
                    const bonusText = photosynthesisIndicator.querySelector('.bonus-text');
                    if (bonusText) {
                        bonusText.textContent = `+${Math.round(player.sunlightBonus * 100)}%`;
                    }
                }
            } else {
                enhancedVisionIndicator.classList.add('locked');
            }
        }
    }
    
    updatePhotosynthesisStatus() {
        const player = window.game.player;
        const statusElement = document.getElementById('photosynthesis-status');
        const sunIcon = document.querySelector('.sun-icon');
        
        if (statusElement && sunIcon) {
            if (player.sunlightBonus > 0) {
                statusElement.textContent = `Photosynthesis Active (+${Math.round(player.sunlightBonus * 100)}%)`;
                sunIcon.style.animation = 'pulse 1s infinite';
            } else {
                statusElement.textContent = 'Photosynthesis Inactive';
                sunIcon.style.animation = 'none';
                sunIcon.style.opacity = '0.3';
            }
        }
    }
    
    updateLocation(location) {
        if (this.elements.currentLocation) {
            this.elements.currentLocation.textContent = location;
        }
    }
    
    updateCoordinates(x, y, z) {
        if (this.elements.coordinates) {
            this.elements.coordinates.textContent = `${Math.round(x)}, ${Math.round(y)}, ${Math.round(z)}`;
        }
    }
    
    updateInventory(inventory) {
        if (!this.elements.inventory) return;
        
        // Clear existing slots
        this.elements.inventory.innerHTML = '';
        
        // Create inventory slots
        for (let i = 0; i < GAME_CONSTANTS.INVENTORY_SLOTS; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.dataset.slot = i;
            
            const item = inventory[i];
            if (item) {
                slot.innerHTML = `
                    <div class="item-icon">${item.icon || '📦'}</div>
                    <div class="item-count">${item.count || 1}</div>
                `;
                slot.title = item.name;
            }
            
            this.elements.inventory.appendChild(slot);
        }
    }
    
    selectInventorySlot(slotIndex) {
        // Remove previous selection
        const slots = this.elements.inventory.querySelectorAll('.inventory-slot');
        slots.forEach(slot => slot.classList.remove('selected'));
        
        // Add selection to clicked slot
        const selectedSlot = this.elements.inventory.querySelector(`[data-slot="${slotIndex}"]`);
        if (selectedSlot) {
            selectedSlot.classList.add('selected');
        }
        
        // Update player's selected slot
        if (window.game && window.game.player) {
            window.game.player.selectedSlot = slotIndex;
        }
    }
    
    showMessage(message, duration = 3000) {
        const messageElement = document.createElement('div');
        messageElement.className = 'hud-message';
        messageElement.textContent = message;
        
        this.elements.messages.appendChild(messageElement);
        
        // Show message
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 10);
        
        // Hide and remove message
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, duration);
    }
    
    updateMessages() {
        const currentTime = Date.now();
        
        // Remove expired messages
        this.messages = this.messages.filter(message => {
            if (currentTime - message.timestamp > this.messageTimeout) {
                if (message.element && message.element.parentNode) {
                    message.element.parentNode.removeChild(message.element);
                }
                return false;
            }
            return true;
        });
    }
    
    showAbilityUnlocked(abilityName) {
        this.showMessage(`Ability Unlocked: ${abilityName}!`, 5000);
        
        // Add visual effect to ability indicator
        const indicator = document.getElementById(`${abilityName}-indicator`);
        if (indicator) {
            indicator.style.animation = 'pulse 0.5s 5';
            setTimeout(() => {
                indicator.style.animation = '';
            }, 2500);
        }
    }
    
    showEnergyWarning() {
        this.showMessage('Low Energy! Rest or find sunlight.', 2000);
    }
    
    showHealthWarning() {
        this.showMessage('Low Health! Find healing items.', 2000);
    }
    
    // Hide/show HUD
    hide() {
        const hud = document.getElementById('hud');
        if (hud) {
            hud.style.display = 'none';
        }
    }
    
    show() {
        const hud = document.getElementById('hud');
        if (hud) {
            hud.style.display = 'block';
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HUD;
}