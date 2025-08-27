// Enhanced Controls for Homo Kaylex
class Controls {
    constructor() {
        // Movement controls
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;
        this.jump = false;
        this.run = false;
        this.sprint = false;
        this.crouch = false;
        this.fly = false;
        
        // Interaction controls
        this.interact = false;
        this.craft = false;
        this.map = false;
        this.inventory = false;
        
        // Homo Kaylex ability controls
        this.telepathy = false;
        this.timePerception = false;
        this.enhancedVision = false;
        
        // Mouse controls
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDeltaX = 0;
        this.mouseDeltaY = 0;
        this.isPointerLocked = false;
        
        // Touch controls for mobile
        this.touchControls = {
            joystick: { x: 0, y: 0 },
            buttons: new window.Map()
        };
        
        // Key mappings
        this.keyMap = {
            'KeyW': 'forward',
            'KeyS': 'backward',
            'KeyA': 'left',
            'KeyD': 'right',
            'Space': 'jump',
            'ShiftLeft': 'run',
            'ShiftRight': 'sprint',
            'ControlLeft': 'crouch',
            'KeyF': 'fly',
            'KeyE': 'interact',
            'KeyC': 'craft',
            'KeyM': 'map',
            'KeyI': 'inventory',
            'KeyT': 'telepathy',
            'KeyY': 'timePerception',
            'KeyV': 'enhancedVision'
        };
        
        this.init();
    }
    
    init() {
        this.setupKeyboardControls();
        this.setupMouseControls();
        this.setupTouchControls();
        this.setupPointerLock();
        
        console.log('Enhanced controls initialized');
    }
    
    setupKeyboardControls() {
        document.addEventListener('keydown', (event) => {
            const action = this.keyMap[event.code];
            if (action) {
                event.preventDefault();
                this[action] = true;
                
                // Handle toggle actions
                if (['run', 'sprint', 'crouch', 'fly', 'enhancedVision'].includes(action)) {
                    if (window.game && window.game.player) {
                        switch (action) {
                            case 'run':
                                window.game.player.toggleRun();
                                break;
                            case 'sprint':
                                window.game.player.toggleSprint();
                                break;
                            case 'crouch':
                                window.game.player.toggleCrouch();
                                break;
                            case 'fly':
                                window.game.player.toggleFly();
                                break;
                        }
                    }
                }
                
                // Handle ability activations
                if (['telepathy', 'timePerception'].includes(action)) {
                    if (window.game && window.game.player) {
                        const success = window.game.player.useAbility(action);
                        if (success) {
                            // Show ability activation feedback
                            if (window.game.hud) {
                                window.game.hud.showMessage(`${action} activated!`);
                            }
                        } else {
                            // Show failure feedback
                            if (window.game.hud) {
                                const player = window.game.player;
                                if (!player.abilities[action]) {
                                    window.game.hud.showMessage(`${action} not unlocked!`);
                                } else if (player.getAbilityCooldown(action) > 0) {
                                    window.game.hud.showMessage(`${action} on cooldown!`);
                                } else if (player.energy < player.abilityCosts[action]) {
                                    window.game.hud.showMessage(`Not enough energy for ${action}!`);
                                }
                            }
                        }
                    }
                }
            }
        });
        
        document.addEventListener('keyup', (event) => {
            const action = this.keyMap[event.code];
            if (action) {
                event.preventDefault();
                this[action] = false;
            }
        });
    }
    
    setupMouseControls() {
        document.addEventListener('mousemove', (event) => {
            if (this.isPointerLocked) {
                this.mouseDeltaX = event.movementX || 0;
                this.mouseDeltaY = event.movementY || 0;
                this.mouseX += this.mouseDeltaX;
                this.mouseY += this.mouseDeltaY;
                
                // Clamp mouse Y to prevent over-rotation
                this.mouseY = Math.max(-90, Math.min(90, this.mouseY));
            }
        });
        
        document.addEventListener('click', () => {
            if (!this.isPointerLocked) {
                this.requestPointerLock();
            }
        });
    }
    
    setupTouchControls() {
        if (!this.isMobile()) return;
        
        // Create touch UI elements
        this.createTouchUI();
        
        // Touch event handlers
        document.addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.handleTouchStart(event);
        });
        
        document.addEventListener('touchmove', (event) => {
            event.preventDefault();
            this.handleTouchMove(event);
        });
        
        document.addEventListener('touchend', (event) => {
            event.preventDefault();
            this.handleTouchEnd(event);
        });
    }
    
    createTouchUI() {
        const touchUI = document.createElement('div');
        touchUI.id = 'touch-ui';
        touchUI.className = 'touch-ui';
        touchUI.innerHTML = `
            <div class="joystick-area">
                <div class="joystick" id="joystick">
                    <div class="joystick-thumb" id="joystick-thumb"></div>
                </div>
            </div>
            <div class="action-buttons">
                <button class="action-btn" id="jump-btn">Jump</button>
                <button class="action-btn" id="interact-btn">Interact</button>
                <button class="action-btn" id="menu-btn">Menu</button>
                <button class="action-btn" id="ability-btn">Ability</button>
            </div>
        `;
        
        document.body.appendChild(touchUI);
        
        // Add touch UI styles
        const style = document.createElement('style');
        style.textContent = `
            .touch-ui {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 1000;
                display: flex;
                gap: 20px;
            }
            
            .joystick-area {
                width: 120px;
                height: 120px;
            }
            
            .joystick {
                width: 100%;
                height: 100%;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                position: relative;
                background: rgba(0, 0, 0, 0.2);
            }
            
            .joystick-thumb {
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
            }
            
            .action-buttons {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .action-btn {
                width: 60px;
                height: 60px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.2);
                color: white;
                font-size: 12px;
                cursor: pointer;
            }
            
            .action-btn:active {
                background: rgba(255, 255, 255, 0.2);
            }
        `;
        document.head.appendChild(style);
    }
    
    handleTouchStart(event) {
        for (const touch of event.touches) {
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            
            if (element.id === 'joystick') {
                this.touchControls.joystick.active = true;
                this.touchControls.joystick.startX = touch.clientX;
                this.touchControls.joystick.startY = touch.clientY;
            } else if (element.id === 'jump-btn') {
                this.jump = true;
            } else if (element.id === 'interact-btn') {
                this.interact = true;
            } else if (element.id === 'menu-btn') {
                if (window.game) {
                    window.game.pause();
                }
            } else if (element.id === 'ability-btn') {
                this.telepathy = true;
            }
        }
    }
    
    handleTouchMove(event) {
        for (const touch of event.touches) {
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            
            if (element.id === 'joystick' && this.touchControls.joystick.active) {
                const joystick = document.getElementById('joystick');
                const rect = joystick.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = touch.clientX - centerX;
                const deltaY = touch.clientY - centerY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const maxDistance = rect.width / 2 - 20;
                
                if (distance > maxDistance) {
                    const angle = Math.atan2(deltaY, deltaX);
                    const x = Math.cos(angle) * maxDistance;
                    const y = Math.sin(angle) * maxDistance;
                    this.touchControls.joystick.x = x / maxDistance;
                    this.touchControls.joystick.y = y / maxDistance;
                } else {
                    this.touchControls.joystick.x = deltaX / maxDistance;
                    this.touchControls.joystick.y = deltaY / maxDistance;
                }
                
                // Update joystick visual
                const thumb = document.getElementById('joystick-thumb');
                thumb.style.left = `${50 + this.touchControls.joystick.x * 50}%`;
                thumb.style.top = `${50 + this.touchControls.joystick.y * 50}%`;
                
                // Update movement controls
                this.forward = this.touchControls.joystick.y < -0.3;
                this.backward = this.touchControls.joystick.y > 0.3;
                this.left = this.touchControls.joystick.x < -0.3;
                this.right = this.touchControls.joystick.x > 0.3;
            }
        }
    }
    
    handleTouchEnd(event) {
        // Reset joystick
        this.touchControls.joystick.active = false;
        this.touchControls.joystick.x = 0;
        this.touchControls.joystick.y = 0;
        
        // Reset joystick visual
        const thumb = document.getElementById('joystick-thumb');
        if (thumb) {
            thumb.style.left = '50%';
            thumb.style.top = '50%';
        }
        
        // Reset movement controls
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;
        this.jump = false;
        this.interact = false;
        this.telepathy = false;
    }
    
    setupPointerLock() {
        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = document.pointerLockElement !== null;
        });
        
        document.addEventListener('pointerlockerror', () => {
            console.warn('Pointer lock failed');
        });
    }
    
    requestPointerLock() {
        if (document.body.requestPointerLock) {
            document.body.requestPointerLock();
        }
    }
    
    exitPointerLock() {
        if (document.exitPointerLock) {
            document.exitPointerLock();
        }
    }
    
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    update(deltaTime) {
        // Reset mouse delta
        this.mouseDeltaX = 0;
        this.mouseDeltaY = 0;
        
        // Update camera rotation based on mouse movement
        if (window.game && window.game.camera) {
            const sensitivity = 0.002;
            window.game.camera.rotate(this.mouseDeltaX * sensitivity, this.mouseDeltaY * sensitivity);
        }
        
        // Handle ability usage
        if (this.telepathy && window.game && window.game.player) {
            window.game.player.useAbility('telepathy');
            this.telepathy = false;
        }
        
        if (this.timePerception && window.game && window.game.player) {
            window.game.player.useAbility('timePerception');
            this.timePerception = false;
        }
    }
    
    // Getter methods for current state
    getMovementVector() {
        return {
            x: (this.right ? 1 : 0) - (this.left ? 1 : 0),
            z: (this.backward ? 1 : 0) - (this.forward ? 1 : 0)
        };
    }
    
    isMoving() {
        return this.forward || this.backward || this.left || this.right;
    }
    
    isRunning() {
        return this.run || this.sprint;
    }
    
    // Reset all controls
    reset() {
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;
        this.jump = false;
        this.run = false;
        this.sprint = false;
        this.crouch = false;
        this.fly = false;
        this.interact = false;
        this.craft = false;
        this.map = false;
        this.inventory = false;
        this.telepathy = false;
        this.timePerception = false;
        this.enhancedVision = false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Controls;
}