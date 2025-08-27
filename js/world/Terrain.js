// Terrain generation for Veauxalia planets
class Terrain {
    constructor(planetData) {
        this.planetData = planetData;
        this.mesh = null;
        this.heightMap = null;
        this.biomeMap = null;
        this.size = 1000;
        this.resolution = 128;
    }
    
    async init() {
        console.log('Generating terrain...');
        
        // Generate height map
        this.heightMap = MathUtils.generateHeightMap(
            this.resolution,
            this.resolution,
            50,
            4,
            0.5,
            2.0
        );
        
        // Generate biome map
        this.biomeMap = MathUtils.generateBiomeMap(this.heightMap);
        
        // Create terrain mesh
        this.createMesh();
        
        console.log('Terrain generated');
    }
    
    createMesh() {
        const geometry = new THREE.PlaneGeometry(
            this.size,
            this.size,
            this.resolution - 1,
            this.resolution - 1
        );
        
        // Apply height map
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 2];
            
            const heightX = Math.floor((x / this.size + 0.5) * this.resolution);
            const heightZ = Math.floor((z / this.size + 0.5) * this.resolution);
            
            if (heightX >= 0 && heightX < this.resolution && 
                heightZ >= 0 && heightZ < this.resolution) {
                const height = this.heightMap[heightZ][heightX] * 100;
                positions[i + 1] = height;
            }
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        
        // Create material based on biome
        const material = this.createMaterial();
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.receiveShadow = true;
    }
    
    createMaterial() {
        // Simple material based on planet type
        const colors = {
            'Rock': 0x8B4513,
            'Gas Giant': 0xFFD700,
            'Ice Dwarf': 0x87CEEB,
            'Dwarf Planet': 0x696969
        };
        
        const color = colors[this.planetData.type] || 0x8B4513;
        
        return new THREE.MeshLambertMaterial({
            color: color,
            flatShading: true
        });
    }
    
    update(deltaTime) {
        // Terrain updates (if needed)
    }
    
    render(scene) {
        if (this.mesh) {
            scene.addObject('terrain', this.mesh);
        }
    }
    
    getHeightAt(x, z) {
        const heightX = Math.floor((x / this.size + 0.5) * this.resolution);
        const heightZ = Math.floor((z / this.size + 0.5) * this.resolution);
        
        if (heightX >= 0 && heightX < this.resolution && 
            heightZ >= 0 && heightZ < this.resolution) {
            return this.heightMap[heightZ][heightX] * 100;
        }
        
        return 0;
    }
    
    raycast(ray) {
        // Simple raycast against terrain
        if (this.mesh) {
            const raycaster = new THREE.Raycaster();
            raycaster.set(ray.origin, ray.direction);
            const intersects = raycaster.intersectObject(this.mesh);
            
            if (intersects.length > 0) {
                return {
                    point: intersects[0].point,
                    distance: intersects[0].distance,
                    object: this
                };
            }
        }
        
        return null;
    }
}