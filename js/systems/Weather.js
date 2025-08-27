// Weather system for Veauxalia
class Weather {
    constructor() {
        this.cloudCover = 0;
        this.precipitation = 0;
        this.windSpeed = 0;
        this.windDirection = 0;
        this.temperature = 20;
        this.humidity = 0.5;
        this.pressure = 1013.25;
        this.visibility = 1.0;
        this.timeOfDay = 0;
        this.season = 0;
        
        // Weather patterns
        this.weatherPatterns = {
            clear: { cloudCover: 0.1, precipitation: 0, windSpeed: 2 },
            cloudy: { cloudCover: 0.7, precipitation: 0, windSpeed: 5 },
            rainy: { cloudCover: 0.9, precipitation: 0.8, windSpeed: 8 },
            stormy: { cloudCover: 1.0, precipitation: 1.0, windSpeed: 15 },
            windy: { cloudCover: 0.3, precipitation: 0, windSpeed: 12 },
            foggy: { cloudCover: 0.8, precipitation: 0.1, windSpeed: 1, visibility: 0.3 }
        };
        
        this.currentPattern = 'clear';
        this.patternDuration = 0;
        this.maxPatternDuration = 300; // 5 minutes
        
        // Atmospheric effects
        this.clouds = [];
        this.rain = [];
        this.fog = null;
        
        this.init();
    }
    
    init() {
        console.log('Weather system initialized');
        this.generateClouds();
    }
    
    update(deltaTime) {
        this.timeOfDay += deltaTime * 0.1; // Time passes faster for demo
        if (this.timeOfDay > 24) this.timeOfDay = 0;
        
        // Update weather patterns
        this.updateWeatherPattern(deltaTime);
        
        // Update atmospheric conditions
        this.updateAtmosphericConditions(deltaTime);
        
        // Update visual effects
        this.updateVisualEffects(deltaTime);
        
        // Update clouds
        this.updateClouds(deltaTime);
        
        // Update precipitation
        this.updatePrecipitation(deltaTime);
    }
    
    updateWeatherPattern(deltaTime) {
        this.patternDuration += deltaTime;
        
        // Change weather pattern periodically
        if (this.patternDuration > this.maxPatternDuration) {
            this.changeWeatherPattern();
            this.patternDuration = 0;
        }
        
        // Gradually transition to target weather
        const targetPattern = this.weatherPatterns[this.currentPattern];
        this.cloudCover = MathUtils.lerp(this.cloudCover, targetPattern.cloudCover, deltaTime * 0.1);
        this.precipitation = MathUtils.lerp(this.precipitation, targetPattern.precipitation, deltaTime * 0.1);
        this.windSpeed = MathUtils.lerp(this.windSpeed, targetPattern.windSpeed, deltaTime * 0.1);
        
        if (targetPattern.visibility !== undefined) {
            this.visibility = MathUtils.lerp(this.visibility, targetPattern.visibility, deltaTime * 0.1);
        }
    }
    
    changeWeatherPattern() {
        const patterns = Object.keys(this.weatherPatterns);
        const currentIndex = patterns.indexOf(this.currentPattern);
        const nextIndex = (currentIndex + 1) % patterns.length;
        this.currentPattern = patterns[nextIndex];
        
        console.log(`Weather changed to: ${this.currentPattern}`);
    }
    
    updateAtmosphericConditions(deltaTime) {
        // Temperature varies with time of day
        const baseTemp = 20;
        const tempVariation = Math.sin(this.timeOfDay * Math.PI / 12) * 10;
        this.temperature = baseTemp + tempVariation;
        
        // Humidity affects precipitation
        if (this.precipitation > 0.5) {
            this.humidity = MathUtils.lerp(this.humidity, 0.9, deltaTime * 0.1);
        } else {
            this.humidity = MathUtils.lerp(this.humidity, 0.5, deltaTime * 0.1);
        }
        
        // Wind direction changes gradually
        this.windDirection += deltaTime * 0.1;
        if (this.windDirection > Math.PI * 2) {
            this.windDirection = 0;
        }
    }
    
    updateVisualEffects(deltaTime) {
        // Update fog based on visibility
        if (this.visibility < 0.5) {
            this.createFog();
        } else {
            this.removeFog();
        }
    }
    
    updateClouds(deltaTime) {
        this.clouds.forEach(cloud => {
            // Move clouds with wind
            cloud.position.x += Math.cos(this.windDirection) * this.windSpeed * deltaTime * 0.1;
            cloud.position.z += Math.sin(this.windDirection) * this.windSpeed * deltaTime * 0.1;
            
            // Wrap clouds around the world
            if (cloud.position.x > 500) cloud.position.x = -500;
            if (cloud.position.x < -500) cloud.position.x = 500;
            if (cloud.position.z > 500) cloud.position.z = -500;
            if (cloud.position.z < -500) cloud.position.z = 500;
            
            // Animate cloud opacity based on cloud cover
            if (cloud.material) {
                cloud.material.opacity = this.cloudCover * 0.8;
            }
        });
    }
    
    updatePrecipitation(deltaTime) {
        if (this.precipitation > 0.3) {
            this.createRain();
        } else {
            this.removeRain();
        }
    }
    
    generateClouds() {
        // Create cloud particles
        for (let i = 0; i < 20; i++) {
            const cloudGeometry = new THREE.SphereGeometry(Math.random() * 10 + 5, 8, 8);
            const cloudMaterial = new THREE.MeshLambertMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.6
            });
            
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloud.position.set(
                (Math.random() - 0.5) * 1000,
                Math.random() * 50 + 100,
                (Math.random() - 0.5) * 1000
            );
            
            this.clouds.push(cloud);
        }
    }
    
    createRain() {
        if (this.rain.length === 0) {
            // Create rain particles
            for (let i = 0; i < 1000; i++) {
                const rainGeometry = new THREE.BoxGeometry(0.1, 2, 0.1);
                const rainMaterial = new THREE.MeshBasicMaterial({
                    color: 0x87CEEB,
                    transparent: true,
                    opacity: 0.6
                });
                
                const raindrop = new THREE.Mesh(rainGeometry, rainMaterial);
                raindrop.position.set(
                    (Math.random() - 0.5) * 200,
                    Math.random() * 100 + 50,
                    (Math.random() - 0.5) * 200
                );
                
                this.rain.push(raindrop);
            }
        }
    }
    
    removeRain() {
        this.rain.forEach(raindrop => {
            if (raindrop.parent) {
                raindrop.parent.remove(raindrop);
            }
        });
        this.rain = [];
    }
    
    createFog() {
        if (!this.fog) {
            // Create fog effect
            const fogGeometry = new THREE.PlaneGeometry(1000, 1000);
            const fogMaterial = new THREE.MeshBasicMaterial({
                color: 0xcccccc,
                transparent: true,
                opacity: 0.3
            });
            
            this.fog = new THREE.Mesh(fogGeometry, fogMaterial);
            this.fog.position.y = 10;
            this.fog.rotation.x = -Math.PI / 2;
        }
    }
    
    removeFog() {
        if (this.fog && this.fog.parent) {
            this.fog.parent.remove(this.fog);
            this.fog = null;
        }
    }
    
    render(scene) {
        // Add clouds to scene
        this.clouds.forEach(cloud => {
            scene.addObject(`cloud_${cloud.id}`, cloud);
        });
        
        // Add rain to scene
        this.rain.forEach(raindrop => {
            scene.addObject(`rain_${raindrop.id}`, raindrop);
        });
        
        // Add fog to scene
        if (this.fog) {
            scene.addObject('fog', this.fog);
        }
    }
    
    getWeatherData() {
        return {
            cloudCover: this.cloudCover,
            precipitation: this.precipitation,
            windSpeed: this.windSpeed,
            windDirection: this.windDirection,
            temperature: this.temperature,
            humidity: this.humidity,
            pressure: this.pressure,
            visibility: this.visibility,
            timeOfDay: this.timeOfDay,
            currentPattern: this.currentPattern
        };
    }
    
    setWeatherPattern(pattern) {
        if (this.weatherPatterns[pattern]) {
            this.currentPattern = pattern;
            this.patternDuration = 0;
        }
    }
    
    getWeatherDescription() {
        if (this.precipitation > 0.7) return 'Heavy Rain';
        if (this.precipitation > 0.3) return 'Light Rain';
        if (this.cloudCover > 0.8) return 'Overcast';
        if (this.cloudCover > 0.4) return 'Partly Cloudy';
        if (this.windSpeed > 10) return 'Windy';
        if (this.visibility < 0.5) return 'Foggy';
        return 'Clear';
    }
}