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
    
    useAbility(abilityName) {
        if (!this.abilities[abilityName]) {
            console.log(`Ability ${abilityName} not unlocked`);
            return false;
        }
        
        switch (abilityName) {
            case 'telepathy':
                if (this.energy > 30) {
                    this.energy -= 30;
                    // Telepathy effect would go here
                    console.log('Using telepathy...');
                    return true;
                }
                break;
                
            case 'timePerception':
                if (this.energy > 50) {
                    this.energy -= 50;
                    // Time perception effect would go here
                    console.log('Using time perception...');
                    return true;
                }
                break;
        }
        
        return false;
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