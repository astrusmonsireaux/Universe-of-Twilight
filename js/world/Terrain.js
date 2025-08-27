// Terrain generation for Veauxalia planets
class Terrain {
    constructor(planetData) {
        this.planetData = planetData;
        this.mesh = null;
        this.heightMap = null;
        this.biomeMap = null;
        this.moistureMap = null;
        this.temperatureMap = null;
        this.size = 1000;
        this.resolution = 128;
        this.chunks = new Map();
        
        // Biome colors for different planet types
        this.biomeColors = {
            'Rock': {
                ocean: 0x006994,
                beach: 0xF4D03F,
                desert: 0xD68910,
                grassland: 0x7DCEA0,
                forest: 0x27AE60,
                mountain: 0x7F8C8D,
                tundra: 0xBDC3C7,
                arctic: 0xECF0F1,
                volcanic: 0xE74C3C,
                swamp: 0x8B4513
            },
            'Gas Giant': {
                gas: 0xFFD700,
                storm: 0x8B0000,
                aurora: 0x00FF00
            },
            'Ice Dwarf': {
                ice: 0x87CEEB,
                cryogenic: 0x4682B4,
                comet: 0x696969
            },
            'Dwarf Planet': {
                asteroid: 0x696969,
                cratered: 0x8B4513
            }
        };
    }
    
    async init() {
        console.log('Generating terrain...');
        
        // Generate height map with multiple octaves
        this.heightMap = this.generateHeightMap();
        
        // Generate moisture and temperature maps
        this.moistureMap = this.generateMoistureMap();
        this.temperatureMap = this.generateTemperatureMap();
        
        // Generate biome map
        this.biomeMap = this.generateBiomeMap();
        
        // Create terrain mesh
        this.createMesh();
        
        console.log('Terrain generated');
    }
    
    generateHeightMap() {
        const heightMap = new Array(this.resolution);
        for (let y = 0; y < this.resolution; y++) {
            heightMap[y] = new Array(this.resolution);
            for (let x = 0; x < this.resolution; x++) {
                let amplitude = 1;
                let frequency = 1;
                let noiseHeight = 0;
                let maxValue = 0;
                
                // Multiple octaves for more realistic terrain
                for (let i = 0; i < 6; i++) {
                    const sampleX = x / this.resolution * frequency * 4;
                    const sampleY = y / this.resolution * frequency * 4;
                    
                    const perlinValue = MathUtils.noise(sampleX, sampleY) * 2 - 1;
                    noiseHeight += perlinValue * amplitude;
                    maxValue += amplitude;
                    
                    amplitude *= 0.5;
                    frequency *= 2;
                }
                
                heightMap[y][x] = noiseHeight / maxValue;
            }
        }
        return heightMap;
    }
    
    generateMoistureMap() {
        const moistureMap = new Array(this.resolution);
        for (let y = 0; y < this.resolution; y++) {
            moistureMap[y] = new Array(this.resolution);
            for (let x = 0; x < this.resolution; x++) {
                const sampleX = x / this.resolution * 3;
                const sampleY = y / this.resolution * 3;
                moistureMap[y][x] = (MathUtils.noise(sampleX, sampleY) + 1) / 2;
            }
        }
        return moistureMap;
    }
    
    generateTemperatureMap() {
        const temperatureMap = new Array(this.resolution);
        for (let y = 0; y < this.resolution; y++) {
            temperatureMap[y] = new Array(this.resolution);
            for (let x = 0; x < this.resolution; x++) {
                // Temperature varies with latitude (y position)
                const latitude = (y / this.resolution - 0.5) * 2; // -1 to 1
                const baseTemp = 1 - Math.abs(latitude);
                
                // Add some noise for variation
                const sampleX = x / this.resolution * 2;
                const sampleY = y / this.resolution * 2;
                const noise = (MathUtils.noise(sampleX, sampleY) + 1) / 2 * 0.3;
                
                temperatureMap[y][x] = MathUtils.clamp01(baseTemp + noise);
            }
        }
        return temperatureMap;
    }
    
    generateBiomeMap() {
        const biomeMap = [];
        for (let y = 0; y < this.heightMap.length; y++) {
            biomeMap[y] = [];
            for (let x = 0; x < this.heightMap[y].length; x++) {
                const height = this.heightMap[y][x];
                const moisture = this.moistureMap[y][x];
                const temperature = this.temperatureMap[y][x];
                
                biomeMap[y][x] = this.determineBiome(height, moisture, temperature);
            }
        }
        return biomeMap;
    }
    
    determineBiome(height, moisture, temperature) {
        // Enhanced biome determination based on planet type
        if (this.planetData.type === 'Rock') {
            if (height < 0.2) return "ocean";
            if (height < 0.3) return "beach";
            if (height > 0.8) return "mountain";
            
            if (temperature < 0.3) {
                if (moisture < 0.3) return "tundra";
                return "arctic";
            }
            
            if (temperature > 0.7) {
                if (moisture < 0.3) return "desert";
                if (moisture > 0.7) return "tropical";
                return "savanna";
            }
            
            if (moisture < 0.3) return "grassland";
            if (moisture > 0.7) return "forest";
            return "temperate";
        } else if (this.planetData.type === 'Gas Giant') {
            if (height > 0.7) return "storm";
            if (moisture > 0.8) return "aurora";
            return "gas";
        } else if (this.planetData.type === 'Ice Dwarf') {
            if (height > 0.6) return "comet";
            if (temperature < 0.2) return "cryogenic";
            return "ice";
        } else {
            if (height > 0.5) return "cratered";
            return "asteroid";
        }
    }
    
    createMesh() {
        const geometry = new THREE.PlaneGeometry(
            this.size,
            this.size,
            this.resolution - 1,
            this.resolution - 1
        );
        
        // Apply height map and create vertex colors
        const positions = geometry.attributes.position.array;
        const colors = new Float32Array(positions.length);
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 2];
            
            const heightX = Math.floor((x / this.size + 0.5) * this.resolution);
            const heightZ = Math.floor((z / this.size + 0.5) * this.resolution);
            
            if (heightX >= 0 && heightX < this.resolution && 
                heightZ >= 0 && heightZ < this.resolution) {
                const height = this.heightMap[heightZ][heightX] * 100;
                positions[i + 1] = height;
                
                // Set vertex colors based on biome
                const biome = this.biomeMap[heightZ][heightX];
                const color = this.getBiomeColor(biome);
                colors[i] = color.r;
                colors[i + 1] = color.g;
                colors[i + 2] = color.b;
            }
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.computeVertexNormals();
        
        // Create material with vertex colors
        const material = new THREE.MeshLambertMaterial({
            vertexColors: true,
            flatShading: true
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.receiveShadow = true;
    }
    
    getBiomeColor(biome) {
        const colors = this.biomeColors[this.planetData.type] || this.biomeColors['Rock'];
        const hexColor = colors[biome] || colors['grassland'];
        
        return {
            r: ((hexColor >> 16) & 255) / 255,
            g: ((hexColor >> 8) & 255) / 255,
            b: (hexColor & 255) / 255
        };
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
    
    getBiomeAt(x, z) {
        const heightX = Math.floor((x / this.size + 0.5) * this.resolution);
        const heightZ = Math.floor((z / this.size + 0.5) * this.resolution);
        
        if (heightX >= 0 && heightX < this.resolution && 
            heightZ >= 0 && heightZ < this.resolution) {
            return this.biomeMap[heightZ][heightX];
        }
        
        return 'ocean';
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
                    object: this,
                    biome: this.getBiomeAt(intersects[0].point.x, intersects[0].point.z)
                };
            }
        }
        
        return null;
    }
    
    // Add vegetation and structures based on biome
    addVegetation(scene) {
        if (this.planetData.type !== 'Rock') return;
        
        for (let y = 0; y < this.resolution; y += 4) {
            for (let x = 0; x < this.resolution; x += 4) {
                const worldX = (x / this.resolution - 0.5) * this.size;
                const worldZ = (y / this.resolution - 0.5) * this.size;
                const biome = this.biomeMap[y][x];
                
                if (Math.random() < 0.1) { // 10% chance for vegetation
                    this.addVegetationAt(worldX, worldZ, biome, scene);
                }
            }
        }
    }
    
    addVegetationAt(x, z, biome, scene) {
        const height = this.getHeightAt(x, z);
        const y = height + 1;
        
        let geometry, material;
        
        switch (biome) {
            case 'forest':
                geometry = new THREE.ConeGeometry(2, 8, 8);
                material = new THREE.MeshLambertMaterial({ color: 0x228B22 });
                break;
            case 'grassland':
                geometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 4);
                material = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
                break;
            case 'desert':
                geometry = new THREE.CylinderGeometry(0.5, 1, 3, 6);
                material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
                break;
            default:
                return;
        }
        
        const vegetation = new THREE.Mesh(geometry, material);
        vegetation.position.set(x, y, z);
        vegetation.castShadow = true;
        
        scene.addObject(`vegetation_${x}_${z}`, vegetation);
    }
}