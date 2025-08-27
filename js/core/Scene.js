// Scene management for Veauxalia
class Scene {
    constructor() {
        this.scene = null;
        this.renderer = null;
        this.lights = new window.Map();
        this.objects = new window.Map();
        this.background = null;
        
        this.init();
    }
    
    init() {
        // Create Three.js scene
        this.scene = new THREE.Scene();
        
        // Create renderer
        this.createRenderer();
        
        // Setup lighting
        this.setupLighting();
        
        // Setup background
        this.setupBackground();
        
        // Setup fog
        this.setupFog();
        
        console.log('Scene initialized');
    }
    
    createRenderer() {
        // Create WebGL renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
        });
        
        // Configure renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        // Add to DOM
        document.getElementById('game-container').appendChild(this.renderer.domElement);
        
        // Setup event listeners
        window.addEventListener('resize', () => this.updateSize());
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        this.lights.set('ambient', ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(100, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = GAME_CONSTANTS.SHADOW_MAP_SIZE;
        directionalLight.shadow.mapSize.height = GAME_CONSTANTS.SHADOW_MAP_SIZE;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);
        this.lights.set('sun', directionalLight);
        
        // Hemisphere light for better color balance
        const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x404040, 0.2);
        this.scene.add(hemisphereLight);
        this.lights.set('hemisphere', hemisphereLight);
    }
    
    setupBackground() {
        // Create starfield background
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 10000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            
            // Random positions in a sphere
            const radius = 1000 + Math.random() * 2000;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Random star colors
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.1 + 0.9, 0.1, Math.random() * 0.5 + 0.5);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.background = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.background);
    }
    
    setupFog() {
        // Add atmospheric fog
        this.scene.fog = new THREE.Fog(0x87ceeb, 100, 1000);
    }
    
    addObject(name, object) {
        this.objects.set(name, object);
        this.scene.add(object);
    }
    
    removeObject(name) {
        const object = this.objects.get(name);
        if (object) {
            this.scene.remove(object);
            this.objects.delete(name);
        }
    }
    
    getObject(name) {
        return this.objects.get(name);
    }
    
    clear() {
        // Remove all objects except lights and background
        this.objects.forEach((object, name) => {
            this.scene.remove(object);
        });
        this.objects.clear();
    }
    
    render(camera) {
        this.renderer.render(this.scene, camera.getCamera());
    }
    
    updateSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.renderer.setSize(width, height);
        
        // Update camera aspect ratio if camera exists
        if (camera && camera.getCamera()) {
            camera.getCamera().aspect = width / height;
            camera.getCamera().updateProjectionMatrix();
        }
    }
    
    setLighting(timeOfDay, weather) {
        const sun = this.lights.get('sun');
        const ambient = this.lights.get('ambient');
        const hemisphere = this.lights.get('hemisphere');
        
        if (!sun || !ambient || !hemisphere) return;
        
        // Calculate sun position based on time of day
        const sunAngle = (timeOfDay / 24) * Math.PI * 2;
        const sunHeight = Math.sin(sunAngle);
        const sunDistance = 200;
        
        sun.position.set(
            Math.cos(sunAngle) * sunDistance,
            sunHeight * sunDistance,
            Math.sin(sunAngle) * sunDistance
        );
        
        // Adjust lighting intensity based on time of day
        const dayIntensity = Math.max(0, sunHeight);
        const nightIntensity = Math.max(0, -sunHeight);
        
        sun.intensity = dayIntensity * 1.0;
        ambient.intensity = 0.1 + nightIntensity * 0.2;
        hemisphere.intensity = 0.1 + dayIntensity * 0.3;
        
        // Adjust sun color based on time of day
        if (sunHeight > 0.1) {
            // Day
            sun.color.setHex(0xffffff);
        } else if (sunHeight > -0.1) {
            // Sunrise/sunset
            sun.color.setHex(0xffa500);
        } else {
            // Night
            sun.color.setHex(0x1a1a2e);
        }
        
        // Weather effects
        if (weather && weather.cloudCover > 0.5) {
            sun.intensity *= (1 - weather.cloudCover * 0.5);
            ambient.intensity *= (1 + weather.cloudCover * 0.3);
        }
    }
    
    setAtmosphere(atmosphereData) {
        if (!atmosphereData) return;
        
        // Update fog based on atmosphere
        if (atmosphereData.pressure > 0) {
            const fogColor = this.calculateAtmosphereColor(atmosphereData);
            this.scene.fog.color.setHex(fogColor);
            this.scene.fog.near = 50;
            this.scene.fog.far = 500 + atmosphereData.pressure * 1000;
        } else {
            // No atmosphere - clear space
            this.scene.fog.near = 1000;
            this.scene.fog.far = 2000;
        }
    }
    
    calculateAtmosphereColor(atmosphereData) {
        // Calculate atmosphere color based on composition
        const composition = atmosphereData.composition;
        let r = 0, g = 0, b = 0;
        
        if (composition.O2) {
            // Oxygen gives blue tint
            b += composition.O2 * 0.3;
        }
        
        if (composition.N2) {
            // Nitrogen is neutral
            r += composition.N2 * 0.1;
            g += composition.N2 * 0.1;
            b += composition.N2 * 0.1;
        }
        
        if (composition.CO2) {
            // CO2 gives slight green tint
            g += composition.CO2 * 0.2;
        }
        
        if (composition.CH4) {
            // Methane gives orange/red tint
            r += composition.CH4 * 0.4;
            g += composition.CH4 * 0.1;
        }
        
        // Normalize and convert to hex
        const max = Math.max(r, g, b);
        if (max > 0) {
            r = Math.floor((r / max) * 255);
            g = Math.floor((g / max) * 255);
            b = Math.floor((b / max) * 255);
        }
        
        return (r << 16) | (g << 8) | b;
    }
    
    addParticleSystem(name, config) {
        const geometry = new THREE.BufferGeometry();
        const particleCount = config.count || 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random positions
            positions[i3] = (Math.random() - 0.5) * config.size.x;
            positions[i3 + 1] = (Math.random() - 0.5) * config.size.y;
            positions[i3 + 2] = (Math.random() - 0.5) * config.size.z;
            
            // Colors
            if (config.color) {
                colors[i3] = config.color.r;
                colors[i3 + 1] = config.color.g;
                colors[i3 + 2] = config.color.b;
            } else {
                colors[i3] = 1;
                colors[i3 + 1] = 1;
                colors[i3 + 2] = 1;
            }
            
            // Sizes
            sizes[i] = Math.random() * config.maxSize + config.minSize;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: config.particleSize || 1,
            vertexColors: true,
            transparent: true,
            opacity: config.opacity || 1,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.position.copy(config.position || new THREE.Vector3());
        
        this.addObject(name, particles);
        return particles;
    }
    
    // Performance monitoring
    getPerformanceInfo() {
        const info = this.renderer.info;
        return {
            triangles: info.render.triangles,
            points: info.render.points,
            lines: info.render.lines,
            calls: info.render.calls,
            memory: {
                geometries: info.memory.geometries,
                textures: info.memory.textures
            }
        };
    }
    
    // Cleanup
    dispose() {
        // Dispose of geometries and materials
        this.objects.forEach(object => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(mat => mat.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        // Dispose of renderer
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Scene;
}