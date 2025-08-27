// Planet class for Veauxalia worlds
class Planet {
    constructor(name) {
        this.name = name;
        this.data = SOLAR_SYSTEM[name.toUpperCase()] || SOLAR_SYSTEM.CHIMERA;
        this.terrain = null;
        this.atmosphere = null;
        this.objects = new Map();
        this.spawnPoint = { x: 0, y: 100, z: 0 };
        this.vegetation = [];
        
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
        
        // Add vegetation
        this.addVegetation();
        
        console.log(`Planet ${this.name} initialized`);
    }
    
    generateSpawnPoint() {
        // Find a suitable spawn point on the terrain
        let bestSpawnPoint = null;
        let bestScore = -Infinity;
        
        // Search for a good spawn location
        for (let attempts = 0; attempts < 100; attempts++) {
            const x = (Math.random() - 0.5) * this.terrain.size * 0.8;
            const z = (Math.random() - 0.5) * this.terrain.size * 0.8;
            const height = this.terrain.getHeightAt(x, z);
            const biome = this.terrain.getBiomeAt(x, z);
            
            // Score the location
            let score = 0;
            
            // Prefer higher ground
            score += height * 10;
            
            // Prefer certain biomes
            if (biome === 'grassland' || biome === 'temperate') score += 50;
            if (biome === 'forest') score += 30;
            if (biome === 'desert') score += 10;
            if (biome === 'ocean' || biome === 'mountain') score -= 100;
            
            // Prefer areas away from edges
            const distanceFromCenter = Math.sqrt(x * x + z * z);
            score -= distanceFromCenter * 0.1;
            
            if (score > bestScore) {
                bestScore = score;
                bestSpawnPoint = { x, y: height + 2, z };
            }
        }
        
        this.spawnPoint = bestSpawnPoint || { x: 0, y: 100, z: 0 };
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
        
        // Update vegetation
        this.vegetation.forEach(veg => {
            if (veg.update) {
                veg.update(deltaTime);
            }
        });
    }
    
    render(scene) {
        if (this.terrain) {
            this.terrain.render(scene);
        }
        
        if (this.atmosphere) {
            this.atmosphere.render(scene);
        }
        
        // Render vegetation
        this.vegetation.forEach(veg => {
            if (veg.render) {
                veg.render(scene);
            }
        });
        
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
    
    getBiomeAt(x, z) {
        if (this.terrain) {
            return this.terrain.getBiomeAt(x, z);
        }
        return 'ocean';
    }
    
    raycast(ray) {
        // Simple raycast implementation
        if (this.terrain) {
            return this.terrain.raycast(ray);
        }
        return null;
    }
    
    addVegetation() {
        if (!this.terrain || this.data.type !== 'Rock') return;
        
        const vegetationCount = Math.floor(this.terrain.size * this.terrain.size / 10000);
        
        for (let i = 0; i < vegetationCount; i++) {
            const x = (Math.random() - 0.5) * this.terrain.size * 0.9;
            const z = (Math.random() - 0.5) * this.terrain.size * 0.9;
            const biome = this.terrain.getBiomeAt(x, z);
            
            if (Math.random() < this.getVegetationChance(biome)) {
                this.addVegetationAt(x, z, biome);
            }
        }
        
        // Add some items to the world
        this.spawnItems();
    }
    
    spawnItems() {
        const itemCount = Math.floor(this.terrain.size * this.terrain.size / 50000);
        
        for (let i = 0; i < itemCount; i++) {
            const x = (Math.random() - 0.5) * this.terrain.size * 0.9;
            const z = (Math.random() - 0.5) * this.terrain.size * 0.9;
            const biome = this.terrain.getBiomeAt(x, z);
            const height = this.getHeightAt(x, z);
            
            const item = this.generateItemForBiome(biome);
            if (item) {
                this.spawnItemAt(x, height + 1, z, item);
            }
        }
    }
    
    generateItemForBiome(biome) {
        const itemChances = {
            'forest': [
                { name: 'wood', chance: 0.4 },
                { name: 'herb', chance: 0.3 },
                { name: 'fruit', chance: 0.2 },
                { name: 'stick', chance: 0.1 }
            ],
            'grassland': [
                { name: 'herb', chance: 0.5 },
                { name: 'stone', chance: 0.3 },
                { name: 'fruit', chance: 0.2 }
            ],
            'desert': [
                { name: 'stone', chance: 0.6 },
                { name: 'cactus', chance: 0.3 },
                { name: 'water', chance: 0.1 }
            ],
            'mountain': [
                { name: 'stone', chance: 0.7 },
                { name: 'iron_ore', chance: 0.2 },
                { name: 'coal', chance: 0.1 }
            ],
            'beach': [
                { name: 'shell', chance: 0.4 },
                { name: 'stone', chance: 0.3 },
                { name: 'water', chance: 0.3 }
            ]
        };
        
        const items = itemChances[biome] || itemChances['grassland'];
        const random = Math.random();
        let cumulativeChance = 0;
        
        for (const item of items) {
            cumulativeChance += item.chance;
            if (random <= cumulativeChance) {
                return {
                    name: item.name,
                    count: Math.floor(Math.random() * 3) + 1,
                    type: 'resource'
                };
            }
        }
        
        return null;
    }
    
    spawnItemAt(x, y, z, item) {
        const itemObject = {
            item: item,
            position: { x, y, z },
            render: (scene) => {
                // Create simple item mesh
                const geometry = new THREE.SphereGeometry(0.3, 8, 8);
                const material = new THREE.MeshLambertMaterial({ 
                    color: this.getItemColor(item.name),
                    emissive: this.getItemColor(item.name),
                    emissiveIntensity: 0.2
                });
                
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(x, y, z);
                
                // Add floating animation
                mesh.userData.originalY = y;
                mesh.userData.animationTime = Math.random() * Math.PI * 2;
                
                scene.addObject(`item_${x}_${z}`, mesh);
            },
            update: (deltaTime) => {
                // Update floating animation
                const mesh = scene.getObject(`item_${x}_${z}`);
                if (mesh) {
                    mesh.userData.animationTime += deltaTime;
                    mesh.position.y = mesh.userData.originalY + Math.sin(mesh.userData.animationTime * 2) * 0.5;
                    mesh.rotation.y += deltaTime;
                }
            }
        };
        
        this.objects.set(`item_${x}_${z}`, itemObject);
    }
    
    getItemColor(itemName) {
        const colors = {
            'wood': 0x8B4513,
            'stone': 0x808080,
            'herb': 0x228B22,
            'fruit': 0xFF6347,
            'stick': 0xD2691E,
            'cactus': 0x228B22,
            'water': 0x4169E1,
            'shell': 0xFFF8DC,
            'iron_ore': 0x696969,
            'coal': 0x2F4F4F
        };
        
        return colors[itemName] || 0xFFFFFF;
    }
    
    getVegetationChance(biome) {
        const chances = {
            'forest': 0.8,
            'grassland': 0.6,
            'temperate': 0.5,
            'tropical': 0.7,
            'savanna': 0.4,
            'desert': 0.1,
            'tundra': 0.2,
            'arctic': 0.05,
            'ocean': 0,
            'mountain': 0.1
        };
        
        return chances[biome] || 0;
    }
    
    addVegetationAt(x, z, biome) {
        const height = this.getHeightAt(x, z);
        const y = height + 1;
        
        let vegetation = null;
        
        switch (biome) {
            case 'forest':
                vegetation = this.createTree(x, y, z);
                break;
            case 'grassland':
                vegetation = this.createGrass(x, y, z);
                break;
            case 'desert':
                vegetation = this.createCactus(x, y, z);
                break;
            case 'tropical':
                vegetation = this.createPalmTree(x, y, z);
                break;
            default:
                return;
        }
        
        if (vegetation) {
            this.vegetation.push(vegetation);
        }
    }
    
    createTree(x, y, z) {
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 4, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        
        const leavesGeometry = new THREE.SphereGeometry(2, 8, 8);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 3;
        
        const tree = new THREE.Group();
        tree.add(trunk);
        tree.add(leaves);
        tree.position.set(x, y, z);
        
        tree.castShadow = true;
        tree.receiveShadow = true;
        
        return {
            mesh: tree,
            render: (scene) => scene.addObject(`tree_${x}_${z}`, tree),
            update: (deltaTime) => {
                // Animate tree swaying
                const time = Date.now() * 0.001;
                tree.rotation.z = Math.sin(time + x) * 0.05;
            }
        };
    }
    
    createGrass(x, y, z) {
        const grassGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 4);
        const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
        const grass = new THREE.Mesh(grassGeometry, grassMaterial);
        grass.position.set(x, y, z);
        
        grass.castShadow = true;
        
        return {
            mesh: grass,
            render: (scene) => scene.addObject(`grass_${x}_${z}`, grass),
            update: (deltaTime) => {
                // Animate grass swaying
                const time = Date.now() * 0.002;
                grass.rotation.z = Math.sin(time + x) * 0.1;
            }
        };
    }
    
    createCactus(x, y, z) {
        const cactusGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 6);
        const cactusMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const cactus = new THREE.Mesh(cactusGeometry, cactusMaterial);
        cactus.position.set(x, y, z);
        
        cactus.castShadow = true;
        
        return {
            mesh: cactus,
            render: (scene) => scene.addObject(`cactus_${x}_${z}`, cactus)
        };
    }
    
    createPalmTree(x, y, z) {
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 5, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        
        const leavesGeometry = new THREE.SphereGeometry(1.5, 8, 8);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x32CD32 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 4;
        
        const palmTree = new THREE.Group();
        palmTree.add(trunk);
        palmTree.add(leaves);
        palmTree.position.set(x, y, z);
        
        palmTree.castShadow = true;
        palmTree.receiveShadow = true;
        
        return {
            mesh: palmTree,
            render: (scene) => scene.addObject(`palm_${x}_${z}`, palmTree),
            update: (deltaTime) => {
                // Animate palm tree swaying
                const time = Date.now() * 0.001;
                palmTree.rotation.z = Math.sin(time + x) * 0.08;
            }
        };
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