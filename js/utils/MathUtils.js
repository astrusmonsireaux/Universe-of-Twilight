// Math Utilities for Veauxalia Game
class MathUtils {
    
    // Constants
    static PI = Math.PI;
    static TWO_PI = Math.PI * 2;
    static HALF_PI = Math.PI / 2;
    static DEG_TO_RAD = Math.PI / 180;
    static RAD_TO_DEG = 180 / Math.PI;
    
    // Clamping
    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
    
    static clamp01(value) {
        return this.clamp(value, 0, 1);
    }
    
    // Linear interpolation
    static lerp(a, b, t) {
        return a + (b - a) * t;
    }
    
    // Smooth interpolation
    static smoothLerp(a, b, t) {
        t = t * t * (3 - 2 * t); // Smoothstep
        return this.lerp(a, b, t);
    }
    
    // Random number generation
    static random(min = 0, max = 1) {
        return Math.random() * (max - min) + min;
    }
    
    static randomInt(min, max) {
        return Math.floor(this.random(min, max + 1));
    }
    
    // Noise generation (simplified Perlin noise)
    static noise(x, y = 0, z = 0) {
        // Simple hash function
        const hash = (x * 12.9898 + y * 78.233 + z * 37.719) % 1;
        return Math.sin(hash * this.TWO_PI);
    }
    
    // 3D Vector operations
    static distance3D(x1, y1, z1, x2, y2, z2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dz = z2 - z1;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    
    static distance2D(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Angle utilities
    static angleBetween(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }
    
    static normalizeAngle(angle) {
        while (angle < 0) angle += this.TWO_PI;
        while (angle >= this.TWO_PI) angle -= this.TWO_PI;
        return angle;
    }
    
    static angleDifference(a, b) {
        let diff = a - b;
        while (diff > Math.PI) diff -= this.TWO_PI;
        while (diff < -Math.PI) diff += this.TWO_PI;
        return diff;
    }
    
    // Spherical coordinates
    static sphericalToCartesian(radius, theta, phi) {
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        return { x, y, z };
    }
    
    static cartesianToSpherical(x, y, z) {
        const radius = Math.sqrt(x * x + y * y + z * z);
        const theta = Math.atan2(y, x);
        const phi = Math.acos(z / radius);
        return { radius, theta, phi };
    }
    
    // Orbital mechanics
    static calculateOrbitalPosition(semiMajorAxis, eccentricity, trueAnomaly) {
        const r = semiMajorAxis * (1 - eccentricity * eccentricity) / 
                  (1 + eccentricity * Math.cos(trueAnomaly));
        const x = r * Math.cos(trueAnomaly);
        const y = r * Math.sin(trueAnomaly);
        return { x, y, r };
    }
    
    static calculateOrbitalVelocity(semiMajorAxis, eccentricity, trueAnomaly, centralMass) {
        const G = 6.67430e-11; // Gravitational constant
        const r = this.calculateOrbitalPosition(semiMajorAxis, eccentricity, trueAnomaly).r;
        const v = Math.sqrt(G * centralMass * (2 / r - 1 / semiMajorAxis));
        return v;
    }
    
    // Binary star system calculations
    static calculateBinaryStarPositions(star1Mass, star2Mass, separation, time) {
        const totalMass = star1Mass + star2Mass;
        const mu = star1Mass * star2Mass / totalMass;
        const omega = Math.sqrt(GAME_CONSTANTS.GRAVITY * totalMass / (separation * separation * separation));
        
        const angle = omega * time;
        const r1 = separation * star2Mass / totalMass;
        const r2 = separation * star1Mass / totalMass;
        
        return {
            star1: { x: r1 * Math.cos(angle), y: r1 * Math.sin(angle), z: 0 },
            star2: { x: -r2 * Math.cos(angle), y: -r2 * Math.sin(angle), z: 0 }
        };
    }
    
    // Planet position in binary system
    static calculatePlanetPosition(planetData, star1Pos, star2Pos, time) {
        const hostStar = planetData.host === "Hieleon" ? star1Pos : 
                        planetData.host === "Nyxeon" ? star2Pos : null;
        
        if (hostStar) {
            // Single star orbit
            const orbitalPeriod = planetData.yearLength * 24 * 3600; // Convert to seconds
            const angle = (time / orbitalPeriod) * this.TWO_PI;
            const distance = planetData.distanceFromHieleon || planetData.distanceFromNyxeon;
            
            return {
                x: hostStar.x + distance * Math.cos(angle),
                y: hostStar.y + distance * Math.sin(angle),
                z: hostStar.z
            };
        } else {
            // Complex binary system orbit (simplified)
            const barycenter = {
                x: (star1Pos.x * SOLAR_SYSTEM.HIELEON.mass + star2Pos.x * SOLAR_SYSTEM.NYXEON.mass) / 
                   (SOLAR_SYSTEM.HIELEON.mass + SOLAR_SYSTEM.NYXEON.mass),
                y: (star1Pos.y * SOLAR_SYSTEM.HIELEON.mass + star2Pos.y * SOLAR_SYSTEM.NYXEON.mass) / 
                   (SOLAR_SYSTEM.HIELEON.mass + SOLAR_SYSTEM.NYXEON.mass),
                z: 0
            };
            
            const orbitalPeriod = planetData.yearLength * 24 * 3600;
            const angle = (time / orbitalPeriod) * this.TWO_PI;
            const distance = planetData.distanceFromHieleon;
            
            return {
                x: barycenter.x + distance * Math.cos(angle),
                y: barycenter.y + distance * Math.sin(angle),
                z: barycenter.z
            };
        }
    }
    
    // Terrain generation
    static generateHeightMap(width, height, scale, octaves, persistence, lacunarity) {
        const heightMap = new Array(height);
        for (let y = 0; y < height; y++) {
            heightMap[y] = new Array(width);
            for (let x = 0; x < width; x++) {
                let amplitude = 1;
                let frequency = 1;
                let noiseHeight = 0;
                let maxValue = 0;
                
                for (let i = 0; i < octaves; i++) {
                    const sampleX = x / scale * frequency;
                    const sampleY = y / scale * frequency;
                    
                    const perlinValue = this.noise(sampleX, sampleY) * 2 - 1;
                    noiseHeight += perlinValue * amplitude;
                    maxValue += amplitude;
                    
                    amplitude *= persistence;
                    frequency *= lacunarity;
                }
                
                heightMap[y][x] = noiseHeight / maxValue;
            }
        }
        return heightMap;
    }
    
    // Biome generation
    static generateBiomeMap(heightMap, moistureMap, temperatureMap) {
        const biomeMap = [];
        for (let y = 0; y < heightMap.length; y++) {
            biomeMap[y] = [];
            for (let x = 0; x < heightMap[y].length; x++) {
                const height = heightMap[y][x];
                const moisture = moistureMap ? moistureMap[y][x] : this.random();
                const temperature = temperatureMap ? temperatureMap[y][x] : this.random();
                
                biomeMap[y][x] = this.determineBiome(height, moisture, temperature);
            }
        }
        return biomeMap;
    }
    
    static determineBiome(height, moisture, temperature) {
        // Simplified biome determination
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
    }
    
    // Atmospheric scattering
    static calculateAtmosphericScattering(rayOrigin, rayDirection, sunDirection, atmosphereRadius, planetRadius) {
        const atmosphereHeight = atmosphereRadius - planetRadius;
        const scaleHeight = atmosphereHeight / 8;
        
        // Simplified atmospheric scattering calculation
        const cosTheta = rayDirection.dot(sunDirection);
        const rayleighPhase = 3 / (16 * Math.PI) * (1 + cosTheta * cosTheta);
        const miePhase = 3 / (8 * Math.PI) * ((1 - 0.5 * 0.5) * (1 + cosTheta * cosTheta)) / 
                        ((2 + 0.5 * 0.5) * Math.pow(1 + 0.5 * 0.5 - 2 * 0.5 * cosTheta, 1.5));
        
        return {
            rayleigh: rayleighPhase,
            mie: miePhase,
            scaleHeight: scaleHeight
        };
    }
    
    // Weather simulation
    static simulateWeather(temperature, humidity, pressure, windSpeed, time) {
        const cloudCover = this.clamp01(humidity * 0.8 + Math.sin(time * 0.001) * 0.2);
        const precipitation = this.clamp01((humidity - 0.7) * 3);
        const windIntensity = this.clamp01(windSpeed / 50);
        
        return {
            cloudCover,
            precipitation,
            windIntensity,
            visibility: 1 - cloudCover * 0.5 - precipitation * 0.3
        };
    }
    
    // Gravity calculation
    static calculateGravity(mass, radius, distance) {
        const G = 6.67430e-11;
        return G * mass / (distance * distance);
    }
    
    // Escape velocity
    static calculateEscapeVelocity(mass, radius) {
        const G = 6.67430e-11;
        return Math.sqrt(2 * G * mass / radius);
    }
    
    // Time calculations for Veauxalia
    static convertToVeauxaliaTime(earthSeconds) {
        const chimeraDayLength = TIME_SYSTEM.dayLength * 3600; // Convert to seconds
        const chimeraYearLength = TIME_SYSTEM.yearLength * chimeraDayLength;
        
        const chimeraDays = earthSeconds / chimeraDayLength;
        const chimeraYears = Math.floor(chimeraDays / TIME_SYSTEM.yearLength);
        const remainingDays = chimeraDays % TIME_SYSTEM.yearLength;
        const chimeraMonths = Math.floor(remainingDays / TIME_SYSTEM.monthLength);
        const remainingMonthDays = remainingDays % TIME_SYSTEM.monthLength;
        
        return {
            years: chimeraYears,
            months: chimeraMonths,
            days: Math.floor(remainingMonthDays),
            hours: (remainingMonthDays % 1) * TIME_SYSTEM.dayLength
        };
    }
    
    // Easing functions
    static easeInQuad(t) { return t * t; }
    static easeOutQuad(t) { return t * (2 - t); }
    static easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
    
    static easeInCubic(t) { return t * t * t; }
    static easeOutCubic(t) { return (--t) * t * t + 1; }
    static easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; }
    
    // Color utilities
    static interpolateColor(color1, color2, factor) {
        const r = Math.round(this.lerp(color1.r, color2.r, factor));
        const g = Math.round(this.lerp(color1.g, color2.g, factor));
        const b = Math.round(this.lerp(color1.b, color2.b, factor));
        return { r, g, b };
    }
    
    static rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathUtils;
}