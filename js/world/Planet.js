// Planet class for Veauxalia worlds
class Planet {
    constructor(name) {
        this.name = name;
        this.data = SOLAR_SYSTEM[name.toUpperCase()] || SOLAR_SYSTEM.CHIMERA;
        this.terrain = null;
        this.atmosphere = null;
        this.objects = new Map();
        this.spawnPoint = { x: 0, y: 100, z: 0 };
        
        this.init();
    }
    
    async init() {
        console.log(`Initializing planet: ${this.name}`);
        
        // Create terrain
        this.terrain = new Terrain(this.data);
        await this.terrain.init();
        
        // Create atmosphere
        this.atmosphere = new Atmosphere(this.data.atmosphere);
        
        // Generate spawn point
        this.generateSpawnPoint();
        
        console.log(`Planet ${this.name} initialized`);
    }
    
    generateSpawnPoint() {
        // Find a suitable spawn point on the terrain
        const terrainHeight = this.terrain.getHeightAt(0, 0);
        this.spawnPoint = {
            x: 0,
            y: terrainHeight + 2, // 2 units above ground
            z: 0
        };
    }
    
    getSpawnPoint() {
        return { ...this.spawnPoint };
    }
    
    update(deltaTime) {
        if (this.terrain) {
            this.terrain.update(deltaTime);
        }
        
        if (this.atmosphere) {
            this.atmosphere.update(deltaTime);
        }
    }
    
    render(scene) {
        if (this.terrain) {
            this.terrain.render(scene);
        }
        
        if (this.atmosphere) {
            this.atmosphere.render(scene);
        }
        
        // Render objects
        this.objects.forEach(object => {
            if (object.render) {
                object.render(scene);
            }
        });
    }
    
    getHeightAt(x, z) {
        if (this.terrain) {
            return this.terrain.getHeightAt(x, z);
        }
        return 0;
    }
    
    raycast(ray) {
        // Simple raycast implementation
        if (this.terrain) {
            return this.terrain.raycast(ray);
        }
        return null;
    }
    
    dropItem(item, position) {
        // Create dropped item in world
        const droppedItem = {
            item: item,
            position: position,
            render: (scene) => {
                // Simple item rendering
                const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
                const material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(position.x, position.y, position.z);
                scene.addObject(`item_${Date.now()}`, mesh);
            }
        };
        
        this.objects.set(`item_${Date.now()}`, droppedItem);
    }
    
    getData() {
        return this.data;
    }
    
    getName() {
        return this.name;
    }
}