// Controls management for Veauxalia
class Controls {
    constructor() {
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;
        this.jump = false;
        this.run = false;
        this.interact = false;
        this.drop = false;
        this.craft = false;
        this.map = false;
        
        // Mouse controls
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDeltaX = 0;
        this.mouseDeltaY = 0;
        this.mouseSensitivity = 1.0;
        
        // Touch controls for mobile
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchMoveX = 0;
        this.touchMoveY = 0;
        this.isTouching = false;
        
        // Pointer lock
        this.isPointerLocked = false;
        
        this.init();
    }
    
    init() {
        this.setupKeyboardControls();
        this.setupMouseControls();
        this.setupTouchControls();
        this.setupPointerLock();
        
        console.log('Controls initialized');
    }
    
    setupKeyboardControls() {
        document.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });
        
        document.addEventListener('keyup', (event) => {
            this.handleKeyUp(event);
        });
    }
    
    setupMouseControls() {
        document.addEventListener('mousemove', (event) => {
            this.handleMouseMove(event);
        });
        
        document.addEventListener('mousedown', (event) => {
            this.handleMouseDown(event);
        });
        
        document.addEventListener('mouseup', (event) => {
            this.handleMouseUp(event);
        });
    }
    
    setupTouchControls() {
        document.addEventListener('touchstart', (event) => {
            this.handleTouchStart(event);
        });
        
        document.addEventListener('touchmove', (event) => {
            this.handleTouchMove(event);
        });
        
        document.addEventListener('touchend', (event) => {
            this.handleTouchEnd(event);
        });
    }
    
    setupPointerLock() {
        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = document.pointerLockElement !== null;
        });
        
        document.addEventListener('click', () => {
            if (!this.isPointerLocked) {
                document.body.requestPointerLock();
            }
        });
    }
    
    handleKeyDown(event) {
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.forward = true;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.backward = true;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.left = true;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.right = true;
                break;
            case 'Space':
                this.jump = true;
                break;
            case 'ShiftLeft':
                this.run = true;
                break;
            case 'KeyE':
                this.interact = true;
                break;
            case 'KeyQ':
                this.drop = true;
                break;
            case 'KeyC':
                this.craft = true;
                break;
            case 'KeyM':
                this.map = true;
                break;
            case 'Escape':
                this.toggleMenu();
                break;
        }
    }
    
    handleKeyUp(event) {
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.forward = false;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.backward = false;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.left = false;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.right = false;
                break;
            case 'Space':
                this.jump = false;
                break;
            case 'ShiftLeft':
                this.run = false;
                break;
            case 'KeyE':
                this.interact = false;
                break;
            case 'KeyQ':
                this.drop = false;
                break;
            case 'KeyC':
                this.craft = false;
                break;
            case 'KeyM':
                this.map = false;
                break;
        }
    }
    
    handleMouseMove(event) {
        if (this.isPointerLocked) {
            this.mouseDeltaX = event.movementX * this.mouseSensitivity * 0.002;
            this.mouseDeltaY = event.movementY * this.mouseSensitivity * 0.002;
        } else {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        }
    }
    
    handleMouseDown(event) {
        if (event.button === 0) { // Left click
            this.interact = true;
        }
    }
    
    handleMouseUp(event) {
        if (event.button === 0) { // Left click
            this.interact = false;
        }
    }
    
    handleTouchStart(event) {
        event.preventDefault();
        
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
            this.isTouching = true;
        }
    }
    
    handleTouchMove(event) {
        event.preventDefault();
        
        if (event.touches.length === 1 && this.isTouching) {
            const touch = event.touches[0];
            this.touchMoveX = touch.clientX - this.touchStartX;
            this.touchMoveY = touch.clientY - this.touchStartY;
            
            // Convert touch movement to mouse movement
            this.mouseDeltaX = this.touchMoveX * this.mouseSensitivity * 0.01;
            this.mouseDeltaY = this.touchMoveY * this.mouseSensitivity * 0.01;
        }
    }
    
    handleTouchEnd(event) {
        this.isTouching = false;
        this.touchMoveX = 0;
        this.touchMoveY = 0;
    }
    
    update(deltaTime) {
        // Reset mouse deltas
        this.mouseDeltaX = 0;
        this.mouseDeltaY = 0;
    }
    
    // Getters for movement state
    isMoving() {
        return this.forward || this.backward || this.left || this.right;
    }
    
    getMovementVector() {
        let x = 0;
        let z = 0;
        
        if (this.forward) z -= 1;
        if (this.backward) z += 1;
        if (this.left) x -= 1;
        if (this.right) x += 1;
        
        // Normalize
        if (x !== 0 || z !== 0) {
            const length = Math.sqrt(x * x + z * z);
            x /= length;
            z /= length;
        }
        
        return { x, z };
    }
    
    getMouseDelta() {
        return {
            x: this.mouseDeltaX,
            y: this.mouseDeltaY
        };
    }
    
    // Setters for external control
    setForward(value) {
        this.forward = value;
    }
    
    setBackward(value) {
        this.backward = value;
    }
    
    setLeft(value) {
        this.left = value;
    }
    
    setRight(value) {
        this.right = value;
    }
    
    setJump(value) {
        this.jump = value;
    }
    
    setRun(value) {
        this.run = value;
    }
    
    setInteract(value) {
        this.interact = value;
    }
    
    setDrop(value) {
        this.drop = value;
    }
    
    // Mouse sensitivity
    setMouseSensitivity(sensitivity) {
        this.mouseSensitivity = MathUtils.clamp(sensitivity, 0.1, 3.0);
    }
    
    getMouseSensitivity() {
        return this.mouseSensitivity;
    }
    
    // Pointer lock management
    requestPointerLock() {
        if (!this.isPointerLocked) {
            document.body.requestPointerLock();
        }
    }
    
    exitPointerLock() {
        if (this.isPointerLocked) {
            document.exitPointerLock();
        }
    }
    
    // Mobile-specific methods
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Reset all controls
    reset() {
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;
        this.jump = false;
        this.run = false;
        this.interact = false;
        this.drop = false;
        this.craft = false;
        this.map = false;
        this.mouseDeltaX = 0;
        this.mouseDeltaY = 0;
    }
    
    // Get control state for debugging
    getState() {
        return {
            movement: {
                forward: this.forward,
                backward: this.backward,
                left: this.left,
                right: this.right
            },
            actions: {
                jump: this.jump,
                run: this.run,
                interact: this.interact,
                drop: this.drop,
                craft: this.craft,
                map: this.map
            },
            mouse: {
                deltaX: this.mouseDeltaX,
                deltaY: this.mouseDeltaY,
                sensitivity: this.mouseSensitivity
            },
            pointerLock: this.isPointerLocked,
            mobile: this.isMobile()
        };
    }
}