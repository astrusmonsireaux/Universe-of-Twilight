// Atmosphere system for Veauxalia planets
class Atmosphere {
    constructor(atmosphereData) {
        this.data = atmosphereData || {
            composition: { N2: 0.78, O2: 0.21, Ar: 0.01 },
            pressure: 101.325, // kPa
            temperature: 288, // Kelvin
            density: 1.225, // kg/m³
            height: 100, // km
            scattering: { rayleigh: 0.1, mie: 0.01 }
        };
        
        // Atmospheric layers
        this.layers = {
            troposphere: { height: 12, temperature: 288 },
            stratosphere: { height: 50, temperature: 270 },
            mesosphere: { height: 80, temperature: 180 },
            thermosphere: { height: 700, temperature: 1500 }
        };
        
        // Visual effects
        this.skybox = null;
        this.clouds = [];
        this.fog = null;
        this.aurora = null;
        
        // Atmospheric scattering
        this.scattering = {
            rayleigh: this.data.scattering.rayleigh,
            mie: this.data.scattering.mie,
            rayleighHeight: 8000,
            mieHeight: 1200
        };
        
        // Weather integration
        this.weather = null;
        
        this.init();
    }
    
    init() {
        console.log('Atmosphere system initialized');
        this.createSkybox();
        this.createAtmosphericEffects();
    }
    
    createSkybox() {
        // Create skybox based on planet type
        const skyboxGeometry = new THREE.SphereGeometry(500, 32, 32);
        
        // Create gradient texture for sky
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Create sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue at top
        gradient.addColorStop(0.5, '#B0E0E6'); // Powder blue in middle
        gradient.addColorStop(1, '#F0F8FF'); // Alice blue at horizon
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add some clouds to the texture
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height * 0.7;
            const size = Math.random() * 30 + 10;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        const skyboxMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
        });
        
        this.skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    }
    
    createAtmosphericEffects() {
        // Create atmospheric fog
        this.fog = new THREE.Fog(0x87CEEB, 50, 200);
        
        // Create aurora effect (for certain planets)
        if (this.data.composition && this.data.composition.O2 > 0.1) {
            this.createAurora();
        }
    }
    
    createAurora() {
        // Create aurora borealis effect
        const auroraGeometry = new THREE.PlaneGeometry(1000, 200);
        const auroraMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        this.aurora = new THREE.Mesh(auroraGeometry, auroraMaterial);
        this.aurora.position.y = 150;
        this.aurora.rotation.x = -Math.PI / 2;
    }
    
    update(deltaTime) {
        // Update atmospheric conditions
        this.updateAtmosphericConditions(deltaTime);
        
        // Update visual effects
        this.updateVisualEffects(deltaTime);
        
        // Update weather integration
        this.updateWeatherIntegration(deltaTime);
    }
    
    updateAtmosphericConditions(deltaTime) {
        // Update atmospheric pressure based on altitude
        if (window.game && window.game.player) {
            const playerHeight = window.game.player.getPosition().y;
            this.updatePressureAtAltitude(playerHeight);
        }
        
        // Update temperature based on time of day
        if (window.game && window.game.weather) {
            const weatherData = window.game.weather.getWeatherData();
            this.data.temperature = weatherData.temperature + 273.15; // Convert to Kelvin
        }
    }
    
    updatePressureAtAltitude(altitude) {
        // Barometric formula: P = P0 * exp(-Mgh/RT)
        const P0 = this.data.pressure; // Surface pressure
        const M = 0.029; // Molar mass of air (kg/mol)
        const g = 9.81; // Gravitational acceleration (m/s²)
        const R = 8.314; // Universal gas constant (J/(mol·K))
        const T = this.data.temperature; // Temperature (K)
        
        const pressure = P0 * Math.exp(-M * g * altitude / (R * T));
        this.data.pressure = pressure;
    }
    
    updateVisualEffects(deltaTime) {
        // Update skybox rotation (day/night cycle)
        if (this.skybox) {
            this.skybox.rotation.y += deltaTime * 0.01;
        }
        
        // Update aurora animation
        if (this.aurora) {
            this.aurora.material.opacity = 0.3 + Math.sin(Date.now() * 0.001) * 0.1;
            this.aurora.position.y = 150 + Math.sin(Date.now() * 0.002) * 10;
        }
        
        // Update fog based on weather
        if (window.game && window.game.weather) {
            const weatherData = window.game.weather.getWeatherData();
            this.updateFog(weatherData);
        }
    }
    
    updateFog(weatherData) {
        if (this.fog) {
            // Adjust fog based on weather conditions
            if (weatherData.visibility < 0.5) {
                this.fog.near = 20;
                this.fog.far = 100;
            } else {
                this.fog.near = 50;
                this.fog.far = 200;
            }
        }
    }
    
    updateWeatherIntegration(deltaTime) {
        // Integrate with weather system
        if (window.game && window.game.weather) {
            const weatherData = window.game.weather.getWeatherData();
            
            // Update atmospheric scattering based on weather
            if (weatherData.cloudCover > 0.7) {
                this.scattering.mie *= 1.5; // More scattering in cloudy conditions
            } else {
                this.scattering.mie = this.data.scattering.mie;
            }
        }
    }
    
    render(scene) {
        // Add skybox to scene
        if (this.skybox) {
            scene.addObject('skybox', this.skybox);
        }
        
        // Add aurora to scene
        if (this.aurora) {
            scene.addObject('aurora', this.aurora);
        }
        
        // Set fog
        if (this.fog && scene.renderer) {
            scene.renderer.fog = this.fog;
        }
    }
    
    getAtmosphericData() {
        return {
            ...this.data,
            layers: this.layers,
            scattering: this.scattering
        };
    }
    
    getPressureAtAltitude(altitude) {
        const P0 = this.data.pressure;
        const M = 0.029;
        const g = 9.81;
        const R = 8.314;
        const T = this.data.temperature;
        
        return P0 * Math.exp(-M * g * altitude / (R * T));
    }
    
    getDensityAtAltitude(altitude) {
        // Ideal gas law: ρ = P/(RT)
        const pressure = this.getPressureAtAltitude(altitude);
        const R = 287; // Specific gas constant for air (J/(kg·K))
        const T = this.data.temperature;
        
        return pressure / (R * T);
    }
    
    getTemperatureAtAltitude(altitude) {
        // Temperature lapse rate: -6.5°C per km in troposphere
        const lapseRate = -0.0065; // K/m
        const surfaceTemp = this.data.temperature;
        
        if (altitude <= this.layers.troposphere.height * 1000) {
            return surfaceTemp + lapseRate * altitude;
        } else if (altitude <= this.layers.stratosphere.height * 1000) {
            return this.layers.stratosphere.temperature;
        } else if (altitude <= this.layers.mesosphere.height * 1000) {
            return this.layers.mesosphere.temperature;
        } else {
            return this.layers.thermosphere.temperature;
        }
    }
    
    getAtmosphericScattering(sunDirection, viewDirection, altitude) {
        // Calculate atmospheric scattering
        const cosTheta = sunDirection.dot(viewDirection);
        const rayleighPhase = 3 / (16 * Math.PI) * (1 + cosTheta * cosTheta);
        const miePhase = 3 / (8 * Math.PI) * (1 - cosTheta * cosTheta) / (2 + cosTheta * cosTheta);
        
        const rayleighScattering = this.scattering.rayleigh * rayleighPhase;
        const mieScattering = this.scattering.mie * miePhase;
        
        // Altitude factor
        const altitudeFactor = Math.exp(-altitude / this.scattering.rayleighHeight);
        
        return {
            rayleigh: rayleighScattering * altitudeFactor,
            mie: mieScattering * Math.exp(-altitude / this.scattering.mieHeight)
        };
    }
    
    getAtmosphericColor(sunDirection, viewDirection, altitude) {
        const scattering = this.getAtmosphericScattering(sunDirection, viewDirection, altitude);
        
        // Rayleigh scattering (blue sky)
        const rayleighColor = new THREE.Color(0x4A90E2);
        const rayleighIntensity = scattering.rayleigh;
        
        // Mie scattering (white clouds)
        const mieColor = new THREE.Color(0xFFFFFF);
        const mieIntensity = scattering.mie;
        
        // Combine colors
        const finalColor = new THREE.Color();
        finalColor.addScaledColor(rayleighColor, rayleighIntensity);
        finalColor.addScaledColor(mieColor, mieIntensity);
        
        return finalColor;
    }
    
    setWeatherSystem(weather) {
        this.weather = weather;
    }
    
    getAtmosphericDescription() {
        const pressure = this.data.pressure;
        const temperature = this.data.temperature - 273.15; // Convert to Celsius
        
        let description = `Pressure: ${pressure.toFixed(1)} kPa, Temperature: ${temperature.toFixed(1)}°C`;
        
        if (pressure < 50) {
            description += ' (Thin atmosphere)';
        } else if (pressure > 150) {
            description += ' (Dense atmosphere)';
        }
        
        if (temperature < -50) {
            description += ' (Very cold)';
        } else if (temperature > 50) {
            description += ' (Very hot)';
        }
        
        return description;
    }
}