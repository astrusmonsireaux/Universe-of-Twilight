// Star class for Veauxalia binary system
class Star {
    constructor(starData) {
        this.data = starData;
        this.mesh = null;
        this.position = { x: 0, y: 0, z: 0 };
    }
    
    init() {
        this.createMesh();
    }
    
    createMesh() {
        const geometry = new THREE.SphereGeometry(this.data.radius * 10, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: this.getStarColor(),
            emissive: this.getStarColor(),
            emissiveIntensity: 0.5
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
    }
    
    getStarColor() {
        const colors = {
            'G2V': 0xffff00, // Yellow
            'K5V': 0xff6600  // Orange
        };
        return colors[this.data.type] || 0xffff00;
    }
    
    update(deltaTime) {
        // Star updates
    }
    
    render(scene) {
        if (this.mesh) {
            this.mesh.position.set(this.position.x, this.position.y, this.position.z);
            scene.addObject(`star_${this.data.name}`, this.mesh);
        }
    }
}