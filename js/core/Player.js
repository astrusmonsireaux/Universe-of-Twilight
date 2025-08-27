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
        
        // Movement state
        this.isMoving = false;
        this.isRunning = false;
        this.isJumping = false;
        this.isFlying = false;
        
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
        // Create simple player mesh (placeholder)
        const geometry = new THREE.CapsuleGeometry(0.3, this.height - 0.6, 4, 8);
        const material = new THREE.MeshLambertMaterial({ 
            color: this.getSkinColorHex(),
            transparent: true,
            opacity: 0.9
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        // Add eyes
        this.addEyes();
    }
    
    addEyes() {
        const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const eyeMaterial = new THREE.MeshBasicMaterial({ 
            color: this.getEyeColorHex() 
        });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        
        leftEye.position.set(-0.15, this.height * 0.7, 0.25);
        rightEye.position.set(0.15, this.height * 0.7, 0.25);
        
        this.mesh.add(leftEye);
        this.mesh.add(rightEye);
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
        
        // Photosynthesis effect (subtle glow)
        this.updatePhotosynthesis(deltaTime);
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
    
    updatePhotosynthesis(deltaTime) {
        if (this.mesh && this.mesh.material) {
            // Add subtle glow effect to represent photosynthesis
            const time = Date.now() * 0.001;
            const glow = 0.1 + Math.sin(time * 2) * 0.05;
            this.mesh.material.emissive = new THREE.Color(0x00ff00).multiplyScalar(glow);
        }
    }
    
    move(controls, deltaTime) {
        const speed = this.isRunning ? this.runSpeed : this.walkSpeed;
        if (this.isFlying) speed = this.flySpeed;
        
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
        if (this.onGround && !this.isJumping) {
            this.velocity.y = this.jumpForce;
            this.onGround = false;
            this.isJumping = true;
        }
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
    
    setRotation(x, y, z) {
        this.rotation.x = x;
        this.rotation.y = y;
        this.rotation.z = z;
        
        if (this.mesh) {
            this.mesh.rotation.set(x, y, z);
        }
    }
    
    getRotation() {
        return { ...this.rotation };
    }
    
    setSelectedSlot(slot) {
        this.selectedSlot = Math.max(0, Math.min(GAME_CONSTANTS.INVENTORY_SLOTS - 1, slot));
    }
    
    getSelectedSlot() {
        return this.selectedSlot;
    }
    
    render(scene) {
        if (this.mesh) {
            scene.addObject('player', this.mesh);
        }
    }
    
    // Interaction methods
    interact() {
        // Player interaction logic
        console.log('Player interaction');
    }
    
    takeDamage(amount) {
        // Damage effect
        if (this.mesh && this.mesh.material) {
            this.mesh.material.color.setHex(0xff0000);
            setTimeout(() => {
                this.mesh.material.color.setHex(this.getSkinColorHex());
            }, 200);
        }
    }
    
    heal(amount) {
        // Healing effect
        if (this.mesh && this.mesh.material) {
            this.mesh.material.color.setHex(0x00ff00);
            setTimeout(() => {
                this.mesh.material.color.setHex(this.getSkinColorHex());
            }, 200);
        }
    }
    
    // Special Homo Kaylex abilities
    photosynthesis() {
        // Regenerate energy through photosynthesis
        return GAME_CONSTANTS.ENERGY_REGEN_RATE * 2; // Enhanced regeneration
    }
    
    // Truth-telling trait (cannot lie)
    speak(message) {
        // Homo Kaylex cannot lie - this is enforced at the species level
        return message; // Always returns the truth
    }
    
    // Hermaphroditic reproduction (simplified)
    canReproduce() {
        return true; // All Homo Kaylex can reproduce
    }
    
    // Dispose
    dispose() {
        if (this.mesh) {
            if (this.mesh.geometry) {
                this.mesh.geometry.dispose();
            }
            if (this.mesh.material) {
                this.mesh.material.dispose();
            }
        }
    }
}