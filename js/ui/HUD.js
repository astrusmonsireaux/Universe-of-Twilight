// HUD (Heads-Up Display) for Veauxalia
class HUD {
    constructor() {
        this.healthElement = document.getElementById('health-fill');
        this.energyElement = document.getElementById('energy-fill');
        this.healthText = document.getElementById('health-text');
        this.energyText = document.getElementById('energy-text');
        this.locationElement = document.getElementById('current-location');
        this.coordinatesElement = document.getElementById('coordinates');
        
        // Additional HUD elements
        this.biomeElement = null;
        this.timeElement = null;
        this.weatherElement = null;
        
        this.createAdditionalElements();
    }
    
    createAdditionalElements() {
        // Create biome display
        this.biomeElement = document.createElement('span');
        this.biomeElement.id = 'current-biome';
        this.biomeElement.style.cssText = `
            background: rgba(0, 0, 0, 0.7);
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 14px;
            color: #00ff88;
        `;
        
        // Create time display
        this.timeElement = document.createElement('span');
        this.timeElement.id = 'current-time';
        this.timeElement.style.cssText = `
            background: rgba(0, 0, 0, 0.7);
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 14px;
            color: #ffaa00;
        `;
        
        // Create weather display
        this.weatherElement = document.createElement('span');
        this.weatherElement.id = 'current-weather';
        this.weatherElement.style.cssText = `
            background: rgba(0, 0, 0, 0.7);
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 14px;
            color: #00aaff;
        `;
        
        // Add to location info
        const locationInfo = document.querySelector('.location-info');
        if (locationInfo) {
            locationInfo.appendChild(this.biomeElement);
            locationInfo.appendChild(this.timeElement);
            locationInfo.appendChild(this.weatherElement);
        }
    }
    
    init() {
        console.log('HUD initialized');
        this.updateTime();
    }
    
    update(deltaTime) {
        // Update time every second
        if (!this.lastTimeUpdate) this.lastTimeUpdate = 0;
        this.lastTimeUpdate += deltaTime;
        
        if (this.lastTimeUpdate >= 1) {
            this.updateTime();
            this.lastTimeUpdate = 0;
        }
    }
    
    updateHealth(health) {
        const percentage = (health / GAME_CONSTANTS.MAX_HEALTH) * 100;
        this.healthElement.style.width = `${percentage}%`;
        this.healthText.textContent = `${Math.round(percentage)}%`;
        
        // Change color based on health level
        if (percentage > 70) {
            this.healthElement.style.background = 'linear-gradient(90deg, #00ff00, #00cc00)';
        } else if (percentage > 30) {
            this.healthElement.style.background = 'linear-gradient(90deg, #ffff00, #ffcc00)';
        } else {
            this.healthElement.style.background = 'linear-gradient(90deg, #ff0000, #cc0000)';
        }
    }
    
    updateEnergy(energy) {
        const percentage = (energy / GAME_CONSTANTS.MAX_ENERGY) * 100;
        this.energyElement.style.width = `${percentage}%`;
        this.energyText.textContent = `${Math.round(percentage)}%`;
        
        // Change color based on energy level
        if (percentage > 70) {
            this.energyElement.style.background = 'linear-gradient(90deg, #0088ff, #0066cc)';
        } else if (percentage > 30) {
            this.energyElement.style.background = 'linear-gradient(90deg, #ffaa00, #ff8800)';
        } else {
            this.energyElement.style.background = 'linear-gradient(90deg, #ff0000, #cc0000)';
        }
    }
    
    updateLocation(location) {
        this.locationElement.textContent = location;
    }
    
    updateCoordinates(x, y, z) {
        this.coordinatesElement.textContent = `${Math.round(x)}, ${Math.round(y)}, ${Math.round(z)}`;
    }
    
    updateBiome(biome) {
        if (this.biomeElement) {
            this.biomeElement.textContent = `Biome: ${biome}`;
            
            // Change color based on biome
            const biomeColors = {
                'ocean': '#0066cc',
                'beach': '#ffcc66',
                'desert': '#cc6600',
                'grassland': '#66cc66',
                'forest': '#006600',
                'mountain': '#666666',
                'tundra': '#cccccc',
                'arctic': '#ffffff',
                'tropical': '#00cc00',
                'savanna': '#ccaa00',
                'temperate': '#66aa66'
            };
            
            this.biomeElement.style.color = biomeColors[biome] || '#00ff88';
        }
    }
    
    updateTime() {
        if (this.timeElement && window.game) {
            const gameTime = window.game.gameTime;
            const veauxaliaTime = MathUtils.convertToVeauxaliaTime(gameTime);
            
            const timeString = `${TIME_SYSTEM.months[veauxaliaTime.months]} ${veauxaliaTime.days}, Year ${veauxaliaTime.years + 1}`;
            this.timeElement.textContent = timeString;
        }
    }
    
    updateWeather(weather) {
        if (this.weatherElement && weather) {
            let weatherText = '';
            
            if (weather.cloudCover > 0.7) {
                weatherText = 'Cloudy';
            } else if (weather.precipitation > 0.5) {
                weatherText = 'Rainy';
            } else if (weather.windIntensity > 0.7) {
                weatherText = 'Windy';
            } else {
                weatherText = 'Clear';
            }
            
            this.weatherElement.textContent = weatherText;
        }
    }
    
    updateInventory(inventory) {
        // Update inventory display
        inventory.forEach((item, index) => {
            const slot = document.querySelector(`[data-slot="${index}"]`);
            if (slot) {
                if (item) {
                    slot.style.background = 'rgba(0, 255, 0, 0.3)';
                    slot.title = item.name || 'Item';
                } else {
                    slot.style.background = 'rgba(0, 0, 0, 0.7)';
                    slot.title = 'Empty';
                }
            }
        });
    }
    
    showMessage(message, duration = 3000) {
        const messageElement = document.createElement('div');
        messageElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 18px;
            z-index: 1000;
            text-align: center;
        `;
        messageElement.textContent = message;
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.style.opacity = '0';
            messageElement.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                document.body.removeChild(messageElement);
            }, 500);
        }, duration);
    }
    
    showDamageIndicator(amount) {
        const damageElement = document.createElement('div');
        damageElement.style.cssText = `
            position: fixed;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #ff0000;
            font-size: 24px;
            font-weight: bold;
            z-index: 1000;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        `;
        damageElement.textContent = `-${amount}`;
        
        document.body.appendChild(damageElement);
        
        // Animate damage number
        let opacity = 1;
        let y = 0;
        const animate = () => {
            opacity -= 0.02;
            y -= 1;
            damageElement.style.opacity = opacity;
            damageElement.style.transform = `translate(-50%, calc(-50% + ${y}px))`;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(damageElement);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    showHealIndicator(amount) {
        const healElement = document.createElement('div');
        healElement.style.cssText = `
            position: fixed;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #00ff00;
            font-size: 24px;
            font-weight: bold;
            z-index: 1000;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        `;
        healElement.textContent = `+${amount}`;
        
        document.body.appendChild(healElement);
        
        // Animate heal number
        let opacity = 1;
        let y = 0;
        const animate = () => {
            opacity -= 0.02;
            y -= 1;
            healElement.style.opacity = opacity;
            healElement.style.transform = `translate(-50%, calc(-50% + ${y}px))`;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(healElement);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    render() {
        // HUD rendering (if needed)
    }
}