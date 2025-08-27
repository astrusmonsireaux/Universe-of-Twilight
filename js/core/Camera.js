// Camera management for Veauxalia
class Camera {
    constructor() {
        this.camera = null;
        this.target = null;
        this.distance = 5;
        this.height = 2;
        this.rotationX = 0;
        this.rotationY = 0;
        this.sensitivity = 0.002;
        
        this.init();
    }
    
    init() {
        // Create perspective camera
        this.camera = new THREE.PerspectiveCamera(
            GAME_CONSTANTS.FOV,
            window.innerWidth / window.innerHeight,
            GAME_CONSTANTS.NEAR_PLANE,
            GAME_CONSTANTS.FAR_PLANE
        );
        
        // Set initial position
        this.camera.position.set(0, this.height, this.distance);
        this.camera.lookAt(0, this.height, 0);
        
        console.log('Camera initialized');
    }
    
    follow(target) {
        this.target = target;
    }
    
    update(deltaTime) {
        if (!this.target) return;
        
        const targetPos = this.target.getPosition();
        
        // Calculate camera position based on target
        const offsetX = Math.sin(this.rotationY) * this.distance;
        const offsetZ = Math.cos(this.rotationY) * this.distance;
        
        this.camera.position.x = targetPos.x + offsetX;
        this.camera.position.y = targetPos.y + this.height;
        this.camera.position.z = targetPos.z + offsetZ;
        
        // Look at target
        this.camera.lookAt(targetPos.x, targetPos.y + this.height * 0.5, targetPos.z);
    }
    
    rotate(deltaX, deltaY) {
        this.rotationY -= deltaX;
        this.rotationX -= deltaY;
        
        // Clamp vertical rotation
        this.rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotationX));
    }
    
    getCamera() {
        return this.camera;
    }
    
    getRay() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(0, 0); // Center of screen
        raycaster.setFromCamera(mouse, this.camera);
        return raycaster.ray;
    }
    
    updateAspect() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
    
    setPosition(x, y, z) {
        this.camera.position.set(x, y, z);
    }
    
    getPosition() {
        return this.camera.position;
    }
}