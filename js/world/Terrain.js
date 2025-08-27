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
        
        // Enhanced biome colors for different planet types
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
                swamp: 0x8B4513,
                tropical: 0x2ECC71,
                savanna: 0xF39C12,
                taiga: 0x16A085,
                alpine: 0x95A5A6
            },
            'Gas Giant': {
                gas: 0xFFD700,
                storm: 0x8B0000,
                aurora: 0x00FF00,
                ring: 0xE8E8E8
            },
            'Ice Dwarf': {
                ice: 0x87CEEB,
                cryogenic: 0x4682B4,
                comet: 0x696969,
                methane: 0x98FB98
            },
            'Dwarf Planet': {
                asteroid: 0x696969,
                cratered: 0x8B4513,
                rocky: 0x708090
            }
        };
        
        // Biome definitions with properties
        this.biomeDefinitions = {
            ocean: { height: 0.0, moisture: 1.0, temperature: 0.5, color: 0x006994 },
            beach: { height: 0.1, moisture: 0.8, temperature: 0.7, color: 0xF4D03F },
            desert: { height: 0.3, moisture: 0.1, temperature: 0.9, color: 0xD68910 },
            grassland: { height: 0.4, moisture: 0.5, temperature: 0.6, color: 0x7DCEA0 },
            forest: { height: 0.5, moisture: 0.7, temperature: 0.6, color: 0x27AE60 },
            mountain: { height: 0.8, moisture: 0.3, temperature: 0.3, color: 0x7F8C8D },
            tundra: { height: 0.2, moisture: 0.4, temperature: 0.2, color: 0xBDC3C7 },
            arctic: { height: 0.1, moisture: 0.2, temperature: 0.1, color: 0xECF0F1 },
            volcanic: { height: 0.9, moisture: 0.1, temperature: 0.9, color: 0xE74C3C },
            swamp: { height: 0.2, moisture: 0.9, temperature: 0.7, color: 0x8B4513 },
            tropical: { height: 0.3, moisture: 0.8, temperature: 0.8, color: 0x2ECC71 },
            savanna: { height: 0.4, moisture: 0.3, temperature: 0.8, color: 0xF39C12 },
            taiga: { height: 0.6, moisture: 0.6, temperature: 0.3, color: 0x16A085 },
            alpine: { height: 0.7, moisture: 0.4, temperature: 0.2, color: 0x95A5A6 }
        };
    }
    
    async init() {
        console.log('Generating enhanced terrain...');
        
        // Generate height map with multiple octaves
        this.heightMap = this.generateHeightMap();
        
        // Generate moisture and temperature maps
        this.moistureMap = this.generateMoistureMap();
        this.temperatureMap = this.generateTemperatureMap();
        
        // Generate biome map
        this.biomeMap = this.generateBiomeMap();
        
        // Create terrain mesh
        this.createMesh();
        
        console.log('Enhanced terrain generated');
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
                for (let i = 0; i < 8; i++) {
                    const sampleX = x / this.resolution * frequency * 4;
                    const sampleY = y / this.resolution * frequency * 4;
                    
                    const perlinValue = MathUtils.noise(sampleX, sampleY) * 2 - 1;
                    noiseHeight += perlinValue * amplitude;
                    maxValue += amplitude;
                    
                    amplitude *= 0.5;
                    frequency *= 2;
                }
                
                // Apply planet-specific modifications
                const baseHeight = noiseHeight / maxValue;
                const modifiedHeight = this.applyPlanetModifications(baseHeight, x, y);
                
                heightMap[y][x] = modifiedHeight;
            }
        }
        return heightMap;
    }
    
    applyPlanetModifications(baseHeight, x, y) {
        const planetType = this.planetData.type;
        
        switch (planetType) {
            case 'Rock':
                // Add continental features
                const continentNoise = MathUtils.noise(x * 0.01, y * 0.01);
                if (continentNoise > 0.3) {
                    return Math.max(0.1, baseHeight * 1.5);
                } else {
                    return Math.min(0.3, baseHeight * 0.5);
                }
                
            case 'Gas Giant':
                // Gas giants have no solid surface
                return -1;
                
            case 'Ice Dwarf':
                // Ice worlds have more extreme height variations
                return baseHeight * 2;
                
            case 'Dwarf Planet':
                // Dwarf planets have cratered surfaces
                const craterNoise = MathUtils.noise(x * 0.05, y * 0.05);
                if (craterNoise > 0.7) {
                    return baseHeight - 0.3; // Crater
                }
                return baseHeight;
                
            default:
                return baseHeight;
        }
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
                // Base temperature based on latitude
                const latitude = Math.abs(y / this.resolution - 0.5) * 2;
                const baseTemp = 1 - latitude;
                
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
        const biomeMap = new Array(this.resolution);
        for (let y = 0; y < this.resolution; y++) {
            biomeMap[y] = new Array(this.resolution);
            for (let x = 0; x < this.resolution; x++) {
                const height = this.heightMap[y][x];
                const moisture = this.moistureMap[y][x];
                const temperature = this.temperatureMap[y][x];
                
                biomeMap[y][x] = this.determineBiome(height, moisture, temperature);
            }
        }
        return biomeMap;
    }
    
    determineBiome(height, moisture, temperature) {
        // Ocean check
        if (height < 0.1) {
            return 'ocean';
        }
        
        // Beach check
        if (height < 0.15) {
            return 'beach';
        }
        
        // Mountain check
        if (height > 0.7) {
            if (temperature < 0.3) {
                return 'alpine';
            }
            return 'mountain';
        }
        
        // Temperature-based biomes
        if (temperature < 0.2) {
            if (moisture > 0.5) {
                return 'tundra';
            }
            return 'arctic';
        }
        
        if (temperature > 0.8) {
            if (moisture < 0.3) {
                return 'desert';
            }
            if (moisture > 0.7) {
                return 'tropical';
            }
            return 'savanna';
        }
        
        // Moisture-based biomes
        if (moisture > 0.8) {
            return 'swamp';
        }
        
        if (moisture > 0.6) {
            if (temperature < 0.4) {
                return 'taiga';
            }
            return 'forest';
        }
        
        if (moisture < 0.3) {
            return 'desert';
        }
        
        return 'grassland';
    }
    
    createMesh() {
        const geometry = new THREE.PlaneGeometry(this.size, this.size, this.resolution - 1, this.resolution - 1);
        const material = new THREE.MeshLambertMaterial({ 
            vertexColors: true,
            side: THREE.DoubleSide
        });
        
        // Apply height map to geometry
        const positions = geometry.attributes.position.array;
        const colors = new Float32Array(positions.length);
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = Math.floor((i / 3) % this.resolution);
            const z = Math.floor((i / 3) / this.resolution);
            
            if (x < this.resolution && z < this.resolution) {
                const height = this.heightMap[z][x] * 100; // Scale height
                positions[i + 1] = height;
                
                // Set color based on biome
                const biome = this.biomeMap[z][x];
                const color = this.getBiomeColor(biome);
                colors[i] = color.r;
                colors[i + 1] = color.g;
                colors[i + 2] = color.b;
            }
        }
        
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.computeVertexNormals();
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.receiveShadow = true;
    }
    
    getBiomeColor(biome) {
        const colorHex = this.biomeColors[this.planetData.type][biome] || 0x808080;
        return {
            r: ((colorHex >> 16) & 255) / 255,
            g: ((colorHex >> 8) & 255) / 255,
            b: (colorHex & 255) / 255
        };
    }
    
    getHeightAt(x, z) {
        const normalizedX = (x / this.size + 0.5) * this.resolution;
        const normalizedZ = (z / this.size + 0.5) * this.resolution;
        
        const x1 = Math.floor(normalizedX);
        const z1 = Math.floor(normalizedZ);
        const x2 = Math.min(x1 + 1, this.resolution - 1);
        const z2 = Math.min(z1 + 1, this.resolution - 1);
        
        if (x1 < 0 || z1 < 0 || x1 >= this.resolution || z1 >= this.resolution) {
            return 0;
        }
        
        // Bilinear interpolation
        const fx = normalizedX - x1;
        const fz = normalizedZ - z1;
        
        const h11 = this.heightMap[z1][x1] * 100;
        const h12 = this.heightMap[z1][x2] * 100;
        const h21 = this.heightMap[z2][x1] * 100;
        const h22 = this.heightMap[z2][x2] * 100;
        
        const h1 = h11 * (1 - fx) + h12 * fx;
        const h2 = h21 * (1 - fx) + h22 * fx;
        
        return h1 * (1 - fz) + h2 * fz;
    }
    
    getBiomeAt(x, z) {
        const normalizedX = (x / this.size + 0.5) * this.resolution;
        const normalizedZ = (z / this.size + 0.5) * this.resolution;
        
        const x1 = Math.floor(normalizedX);
        const z1 = Math.floor(normalizedZ);
        
        if (x1 < 0 || z1 < 0 || x1 >= this.resolution || z1 >= this.resolution) {
            return 'ocean';
        }
        
        return this.biomeMap[z1][x1];
    }
    
    raycast(ray) {
        // Simple raycast against terrain plane
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersection = new THREE.Vector3();
        
        if (ray.intersectPlane(plane, intersection)) {
            const height = this.getHeightAt(intersection.x, intersection.z);
            intersection.y = height;
            return intersection;
        }
        
        return null;
    }
    
    update(deltaTime) {
        // Animate terrain if needed (e.g., for gas giants)
        if (this.planetData.type === 'Gas Giant' && this.mesh) {
            this.mesh.rotation.z += deltaTime * 0.1;
        }
    }
    
    render(scene) {
        if (this.mesh) {
            scene.add(this.mesh);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Terrain;
}