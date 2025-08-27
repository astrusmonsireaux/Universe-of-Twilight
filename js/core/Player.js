// Player class for Homo Kaylex character
class Player {
    constructor() {
        this.position = { x: 0, y: 100, z: 0 };
        this.velocity = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.onGround = false;
        this.selectedSlot = 0;
        
        // Homo Kaylex specific properties
        this.species = HOMO_KAYLEX;
        this.skinColor = this.species.appearance.skinColors[0];
        this.eyeColor = this.species.appearance.eyeColors[0];
        this.height = MathUtils.random(
            this.species.appearance.height.min,
            this.species.appearance.height.max
        );
        
        // Enhanced movement state
        this.isMoving = false;
        this.isRunning = false;
        this.isJumping = false;
        this.isFlying = false;
        this.isCrouching = false;
        this.isSprinting = false;
        
            // Homo Kaylex abilities
    this.abilities = {
        photosynthesis: true,
        enhancedVision: true,
        telepathy: false, // Unlockable ability
        timePerception: false // Unlockable ability
    };
    
    // Ability cooldowns and costs
    this.abilityCooldowns = {
        telepathy: 0,
        timePerception: 0
    };
    
    this.abilityCosts = {
        telepathy: 30,
        timePerception: 50
    };
    
    this.abilityDurations = {
        telepathy: 10, // seconds
        timePerception: 15 // seconds
    };
    
    // Active ability states
    this.activeAbilities = {
        telepathy: false,
        timePerception: false
    };
    
    // Ability timers
    this.abilityTimers = {
        telepathy: 0,
        timePerception: 0
    };
        
        // Energy and health management
        this.energy = GAME_CONSTANTS.MAX_ENERGY;
        this.health = GAME_CONSTANTS.MAX_HEALTH;
        this.energyRegenRate = GAME_CONSTANTS.ENERGY_REGEN_RATE;
        this.healthRegenRate = GAME_CONSTANTS.HEALTH_REGEN_RATE;
        
        // Photosynthesis tracking
        this.lastSunlight = 0;
        this.sunlightBonus = 0;
        
        // Physics
        this.gravity = GAME_CONSTANTS.GRAVITY;
        this.terminalVelocity = GAME_CONSTANTS.TERMINAL_VELOCITY;
        this.jumpForce = GAME_CONSTANTS.JUMP_FORCE;
        this.walkSpeed = GAME_CONSTANTS.WALK_SPEED;
        this.runSpeed = GAME_CONSTANTS.RUN_SPEED;
        this.flySpeed = GAME_CONSTANTS.FLY_SPEED;
        
        // Collision
        this.radius = 0.3;
        this.height = 1.8;
        
        // Mesh
        this.mesh = null;
        this.createMesh();
    }
    
    createMesh() {
        // Create enhanced player mesh with Homo Kaylex features
        const geometry = new THREE.CapsuleGeometry(0.3, this.height - 0.6, 8, 16);
        const material = new THREE.MeshLambertMaterial({ 
            color: this.getSkinColorHex(),
            transparent: true,
            opacity: 0.9
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        // Add eyes with enhanced detail
        this.addEyes();
        
        // Add photosynthetic skin effect
        this.addPhotosyntheticEffect();
    }
    
    addEyes() {
        const eyeGeometry = new THREE.SphereGeometry(0.05, 12, 12);
        const eyeMaterial = new THREE.MeshBasicMaterial({ 
            color: this.getEyeColorHex(),
            emissive: this.getEyeColorHex(),
            emissiveIntensity: 0.2
        });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        
        leftEye.position.set(-0.15, this.height * 0.7, 0.25);
        rightEye.position.set(0.15, this.height * 0.7, 0.25);
        
        this.mesh.add(leftEye);
        this.mesh.add(rightEye);
    }
    
    addPhotosyntheticEffect() {
        // Add a subtle glow effect around the player
        const glowGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        
        this.glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        this.mesh.add(this.glowMesh);
    }
    
    getSkinColorHex() {
        const colors = {
            'purple': 0x800080,
            'violet': 0x8B00FF,
            'mauve': 0xE0B0FF
        };
        return colors[this.skinColor] || 0x800080;
    }
    
    getEyeColorHex() {
        const colors = {
            'black': 0x000000,
            'blue': 0x0000FF,
            'green': 0x00FF00,
            'crimson': 0xDC143C
        };
        return colors[this.eyeColor] || 0x000000;
    }
    
    update(deltaTime) {
        // Apply gravity
        if (!this.onGround && !this.isFlying) {
            this.velocity.y -= this.gravity * deltaTime;
        }
        
        // Clamp velocity
        this.velocity.y = Math.max(-this.terminalVelocity, this.velocity.y);
        
        // Update position based on velocity
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.position.z += this.velocity.z * deltaTime;
        
        // Check terrain collision
        this.checkTerrainCollision();
        
        // Update mesh position
        if (this.mesh) {
            this.mesh.position.set(this.position.x, this.position.y, this.position.z);
            this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
        }
        
        // Update Homo Kaylex abilities
        this.updatePhotosynthesis(deltaTime);
        this.updateEnergyRegeneration(deltaTime);
        this.updateHealthRegeneration(deltaTime);
        
        // Update movement state
        this.updateMovementState();
        
        // Update abilities
        this.updateAbilities(deltaTime);
    }
    
    updatePhotosynthesis(deltaTime) {
        if (this.mesh && this.mesh.material) {
            // Calculate sunlight exposure
            const time = Date.now() * 0.001;
            const dayTime = (time % 2400) / 2400; // 24-hour cycle
            
            // Sunlight intensity based on time of day
            let sunlightIntensity = 0;
            if (dayTime > 0.25 && dayTime < 0.75) {
                sunlightIntensity = Math.sin((dayTime - 0.25) * Math.PI * 2) * 0.5 + 0.5;
            }
            
            // Update glow effect based on sunlight
            const glow = 0.1 + sunlightIntensity * 0.3;
            this.mesh.material.emissive = new THREE.Color(0x00ff00).multiplyScalar(glow);
            
            // Energy bonus from photosynthesis
            if (sunlightIntensity > 0.3) {
                this.sunlightBonus = sunlightIntensity * 0.5;
            } else {
                this.sunlightBonus = 0;
            }
            
            this.lastSunlight = sunlightIntensity;
        }
    }
    
    updateEnergyRegeneration(deltaTime) {
        const baseRegen = this.energyRegenRate * deltaTime;
        const photosynthesisBonus = this.sunlightBonus * deltaTime;
        const totalRegen = baseRegen + photosynthesisBonus;
        
        this.energy = Math.min(GAME_CONSTANTS.MAX_ENERGY, this.energy + totalRegen);
    }
    
    updateHealthRegeneration(deltaTime) {
        if (this.energy > 50) { // Only regenerate health when energy is sufficient
            const regen = this.healthRegenRate * deltaTime;
            this.health = Math.min(GAME_CONSTANTS.MAX_HEALTH, this.health + regen);
        }
    }
    
    updateMovementState() {
        // Update movement flags
        this.isMoving = Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.z) > 0.1;
        
        // Update energy consumption
        if (this.isMoving) {
            const energyCost = this.isRunning ? 2 : 1;
            this.energy = Math.max(0, this.energy - energyCost * 0.01);
        }
    }
    
    // Ability System Methods
    activateTelepathy() {
        if (!this.abilities.telepathy || this.abilityCooldowns.telepathy > 0) {
            return false;
        }
        
        if (this.energy < this.abilityCosts.telepathy) {
            this.showMessage('Insufficient energy for telepathy');
            return false;
        }
        
        this.energy -= this.abilityCosts.telepathy;
        this.activeAbilities.telepathy = true;
        this.abilityTimers.telepathy = this.abilityDurations.telepathy;
        this.abilityCooldowns.telepathy = 30; // 30 second cooldown
        
        // Visual effect
        this.mesh.material.emissive = new THREE.Color(0x0066ff);
        
        this.showMessage('Telepathy activated - sensing nearby life forms');
        return true;
    }
    
    activateTimePerception() {
        if (!this.abilities.timePerception || this.abilityCooldowns.timePerception > 0) {
            return false;
        }
        
        if (this.energy < this.abilityCosts.timePerception) {
            this.showMessage('Insufficient energy for time perception');
            return false;
        }
        
        this.energy -= this.abilityCosts.timePerception;
        this.activeAbilities.timePerception = true;
        this.abilityTimers.timePerception = this.abilityDurations.timePerception;
        this.abilityCooldowns.timePerception = 60; // 60 second cooldown
        
        // Visual effect
        this.mesh.material.emissive = new THREE.Color(0xff6600);
        
        this.showMessage('Time perception activated - time appears to slow');
        return true;
    }
    
    updateAbilities(deltaTime) {
        // Update cooldowns
        Object.keys(this.abilityCooldowns).forEach(ability => {
            if (this.abilityCooldowns[ability] > 0) {
                this.abilityCooldowns[ability] -= deltaTime;
            }
        });
        
        // Update active ability timers
        Object.keys(this.abilityTimers).forEach(ability => {
            if (this.abilityTimers[ability] > 0) {
                this.abilityTimers[ability] -= deltaTime;
                
                if (this.abilityTimers[ability] <= 0) {
                    this.deactivateAbility(ability);
                }
            }
        });
    }
    
    deactivateAbility(ability) {
        this.activeAbilities[ability] = false;
        this.abilityTimers[ability] = 0;
        
        // Reset visual effect
        this.updatePhotosynthesis(window.game ? window.game.gameTime : 0);
        
        if (ability === 'telepathy') {
            this.showMessage('Telepathy deactivated');
        } else if (ability === 'timePerception') {
            this.showMessage('Time perception deactivated');
        }
    }
    
    unlockAbility(ability) {
        if (ability === 'telepathy' || ability === 'timePerception') {
            this.abilities[ability] = true;
            this.showMessage(`${ability.charAt(0).toUpperCase() + ability.slice(1)} ability unlocked!`);
            return true;
        }
        return false;
    }
    
    showMessage(message) {
        if (window.game && window.game.hud) {
            window.game.hud.showMessage(message);
        }
    }
    
    // Additional methods for HUD integration
    getAbilityCooldown(ability) {
        return this.abilityCooldowns[ability] || 0;
    }
    
    getAbilityTimer(ability) {
        return this.abilityTimers[ability] || 0;
    }
    
    isAbilityActive(ability) {
        return this.activeAbilities[ability] || false;
    }
    
    useAbility(ability) {
        switch (ability) {
            case 'telepathy':
                return this.activateTelepathy();
            case 'timePerception':
                return this.activateTimePerception();
            default:
                return false;
        }
    }
    
    checkTerrainCollision() {
        // Get terrain height at current position
        if (window.game && window.game.currentPlanet) {
            const terrainHeight = window.game.currentPlanet.getHeightAt(this.position.x, this.position.z);
            const groundLevel = terrainHeight + this.height * 0.5;
            
            // Check if player is on ground
            if (this.position.y <= groundLevel) {
                this.position.y = groundLevel;
                this.velocity.y = 0;
                this.onGround = true;
                this.isJumping = false;
            } else {
                this.onGround = false;
            }
        }
    }
    
    move(controls, deltaTime) {
        let speed = this.walkSpeed;
        
        // Determine movement speed based on state
        if (this.isRunning && this.energy > 20) {
            speed = this.runSpeed;
        } else if (this.isSprinting && this.energy > 40) {
            speed = this.runSpeed * 1.5;
        } else if (this.isFlying) {
            speed = this.flySpeed;
        } else if (this.isCrouching) {
            speed = this.walkSpeed * 0.5;
        }
        
        // Calculate movement direction
        let moveX = 0;
        let moveZ = 0;
        
        if (controls.forward) moveZ -= 1;
        if (controls.backward) moveZ += 1;
        if (controls.left) moveX -= 1;
        if (controls.right) moveX += 1;
        
        // Normalize movement vector
        if (moveX !== 0 || moveZ !== 0) {
            const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
            moveX /= length;
            moveZ /= length;
        }
        
        // Apply movement
        this.velocity.x = moveX * speed;
        this.velocity.z = moveZ * speed;
        
        // Update rotation to face movement direction
        if (moveX !== 0 || moveZ !== 0) {
            this.rotation.y = Math.atan2(moveX, moveZ);
        }
        
        this.isMoving = moveX !== 0 || moveZ !== 0;
    }
    
    jump() {
        if (this.onGround && !this.isJumping && this.energy > 10) {
            this.velocity.y = this.jumpForce;
            this.onGround = false;
            this.isJumping = true;
            this.energy -= 10; // Energy cost for jumping
        }
    }
    
    toggleRun() {
        if (this.energy > 20) {
            this.isRunning = !this.isRunning;
            this.isSprinting = false;
        }
    }
    
    toggleSprint() {
        if (this.energy > 40) {
            this.isSprinting = !this.isSprinting;
            this.isRunning = false;
        }
    }
    
    toggleCrouch() {
        this.isCrouching = !this.isCrouching;
        if (this.isCrouching) {
            this.height = 0.9; // Half height when crouching
        } else {
            this.height = 1.8; // Normal height
        }
    }
    
    toggleFly() {
        this.isFlying = !this.isFlying;
        if (this.isFlying) {
            this.velocity.y = 0;
        }
    }
    
    updateAbilities(deltaTime) {
        // Update cooldowns
        Object.keys(this.abilityCooldowns).forEach(ability => {
            if (this.abilityCooldowns[ability] > 0) {
                this.abilityCooldowns[ability] -= deltaTime;
            }
        });
        
        // Update active ability timers
        Object.keys(this.abilityTimers).forEach(ability => {
            if (this.abilityTimers[ability] > 0) {
                this.abilityTimers[ability] -= deltaTime;
                
                // Deactivate ability when timer expires
                if (this.abilityTimers[ability] <= 0) {
                    this.deactivateAbility(ability);
                }
            }
        });
    }
    
    useAbility(abilityName) {
        if (!this.abilities[abilityName]) {
            console.log(`Ability ${abilityName} not unlocked`);
            return false;
        }
        
        // Check cooldown
        if (this.abilityCooldowns[abilityName] > 0) {
            console.log(`${abilityName} is on cooldown`);
            return false;
        }
        
        // Check energy cost
        if (this.energy < this.abilityCosts[abilityName]) {
            console.log(`Not enough energy for ${abilityName}`);
            return false;
        }
        
        switch (abilityName) {
            case 'telepathy':
                return this.activateTelepathy();
                
            case 'timePerception':
                return this.activateTimePerception();
                
            default:
                console.log(`Unknown ability: ${abilityName}`);
                return false;
        }
    }
    
    activateTelepathy() {
        if (this.activeAbilities.telepathy) {
            this.deactivateAbility('telepathy');
            return true;
        }
        
        // Consume energy
        this.energy -= this.abilityCosts.telepathy;
        
        // Activate ability
        this.activeAbilities.telepathy = true;
        this.abilityTimers.telepathy = this.abilityDurations.telepathy;
        
        // Set cooldown
        this.abilityCooldowns.telepathy = 30; // 30 second cooldown
        
        console.log('Telepathy activated! Sensing nearby life forms...');
        
        // Visual effect - enhance player glow
        if (this.mesh && this.mesh.material) {
            this.mesh.material.emissive = new THREE.Color(0x4444ff).multiplyScalar(0.3);
        }
        
        // Trigger telepathy scan
        this.scanForLifeForms();
        
        return true;
    }
    
    activateTimePerception() {
        if (this.activeAbilities.timePerception) {
            this.deactivateAbility('timePerception');
            return true;
        }
        
        // Consume energy
        this.energy -= this.abilityCosts.timePerception;
        
        // Activate ability
        this.activeAbilities.timePerception = true;
        this.abilityTimers.timePerception = this.abilityDurations.timePerception;
        
        // Set cooldown
        this.abilityCooldowns.timePerception = 60; // 60 second cooldown
        
        console.log('Time perception activated! Time appears to slow down...');
        
        // Visual effect - time distortion
        if (this.mesh && this.mesh.material) {
            this.mesh.material.emissive = new THREE.Color(0xffaa00).multiplyScalar(0.4);
        }
        
        // Slow down time for the player
        if (window.game) {
            window.game.setTimeScale(0.5); // Slow down time by 50%
        }
        
        return true;
    }
    
    deactivateAbility(abilityName) {
        if (this.activeAbilities[abilityName]) {
            this.activeAbilities[abilityName] = false;
            this.abilityTimers[abilityName] = 0;
            
            console.log(`${abilityName} deactivated`);
            
            // Reset visual effects
            if (this.mesh && this.mesh.material) {
                this.mesh.material.emissive = new THREE.Color(0x000000);
            }
            
            // Reset time scale if time perception was deactivated
            if (abilityName === 'timePerception' && window.game) {
                window.game.setTimeScale(1.0);
            }
        }
    }
    
    scanForLifeForms() {
        // Scan for nearby entities (placeholder for future NPC system)
        const scanRadius = 50;
        const playerPos = this.getPosition();
        
        console.log(`Scanning for life forms within ${scanRadius} units...`);
        
        // This would integrate with a future entity system
        // For now, just log the scan
        console.log('No life forms detected in range');
    }
    
    isAbilityActive(abilityName) {
        return this.activeAbilities[abilityName] || false;
    }
    
    getAbilityCooldown(abilityName) {
        return this.abilityCooldowns[abilityName] || 0;
    }
    
    getAbilityTimer(abilityName) {
        return this.abilityTimers[abilityName] || 0;
    }
    
    setPosition(x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        
        if (this.mesh) {
            this.mesh.position.set(x, y, z);
        }
    }
    
    getPosition() {
        return { ...this.position };
    }
    
    getHealth() {
        return this.health;
    }
    
    getEnergy() {
        return this.energy;
    }
    
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        return this.health <= 0;
    }
    
    heal(amount) {
        this.health = Math.min(GAME_CONSTANTS.MAX_HEALTH, this.health + amount);
    }
    
    consumeEnergy(amount) {
        this.energy = Math.max(0, this.energy - amount);
    }
    
    restoreEnergy(amount) {
        this.energy = Math.min(GAME_CONSTANTS.MAX_ENERGY, this.energy + amount);
    }
    
    unlockAbility(abilityName) {
        if (this.abilities.hasOwnProperty(abilityName)) {
            this.abilities[abilityName] = true;
            console.log(`Ability ${abilityName} unlocked!`);
            return true;
        }
        return false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Player;
}