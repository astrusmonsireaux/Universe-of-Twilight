// Orbital mechanics system for Veauxalia
class OrbitalMechanics {
    constructor() {
        this.gameTime = 0;
        this.timeScale = 1.0;
        this.bodies = new Map();
        this.orbitalPaths = new Map();
        this.gravitationalConstant = 6.67430e-11;
        
        // Binary star system parameters
        this.binaryCenter = { x: 0, y: 0, z: 0 };
        this.binarySeparation = 1000; // Distance between stars
        this.binaryPeriod = 365.25 * 24 * 3600; // One year in seconds
        
        // Orbital visualization
        this.showOrbits = true;
        this.orbitSegments = 100;
        
        this.init();
    }
    
    init() {
        console.log('Orbital mechanics system initialized');
        this.initializeBodies();
        this.calculateOrbitalPaths();
    }
    
    initializeBodies() {
        // Initialize binary stars
        this.addBody('Hieleon', {
            type: 'star',
            mass: SOLAR_SYSTEM.HIELEON.mass * 1.989e30, // Convert to kg
            radius: SOLAR_SYSTEM.HIELEON.radius * 6.957e8, // Convert to meters
            position: { x: -this.binarySeparation / 2, y: 0, z: 0 },
            velocity: { x: 0, y: 0, z: 0 },
            color: 0xffff00,
            temperature: 5778, // Kelvin
            luminosity: 1.0
        });
        
        this.addBody('Nyxeon', {
            type: 'star',
            mass: SOLAR_SYSTEM.NYXEON.mass * 1.989e30,
            radius: SOLAR_SYSTEM.NYXEON.radius * 6.957e8,
            position: { x: this.binarySeparation / 2, y: 0, z: 0 },
            velocity: { x: 0, y: 0, z: 0 },
            color: 0xff6600,
            temperature: 4000,
            luminosity: 0.3
        });
        
        // Initialize planets
        Object.keys(SOLAR_SYSTEM).forEach(planetName => {
            const planetData = SOLAR_SYSTEM[planetName];
            if (planetData.type !== 'star') {
                this.addBody(planetName, {
                    type: planetData.type,
                    mass: planetData.mass * 5.972e24, // Convert to kg
                    radius: planetData.radius * 6.371e6, // Convert to meters
                    position: this.calculateInitialPosition(planetData),
                    velocity: this.calculateInitialVelocity(planetData),
                    color: this.getPlanetColor(planetData.type),
                    host: planetData.host,
                    semiMajorAxis: planetData.semiMajorAxis || 100,
                    eccentricity: planetData.eccentricity || 0,
                    inclination: planetData.inclination || 0,
                    orbitalPeriod: planetData.orbitalPeriod || 365.25
                });
            }
        });
    }
    
    addBody(name, data) {
        this.bodies.set(name, {
            name: name,
            ...data,
            acceleration: { x: 0, y: 0, z: 0 },
            force: { x: 0, y: 0, z: 0 }
        });
    }
    
    calculateInitialPosition(planetData) {
        // Calculate initial position based on orbital parameters
        const semiMajorAxis = planetData.semiMajorAxis || 100;
        const eccentricity = planetData.eccentricity || 0;
        const inclination = planetData.inclination || 0;
        
        // Start at perihelion (closest point to host)
        const r = semiMajorAxis * (1 - eccentricity);
        const theta = 0; // Start at 0 degrees
        
        // Convert to 3D coordinates
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta) * Math.sin(inclination);
        const z = r * Math.sin(theta) * Math.cos(inclination);
        
        return { x, y, z };
    }
    
    calculateInitialVelocity(planetData) {
        // Calculate initial velocity for circular orbit
        const semiMajorAxis = planetData.semiMajorAxis || 100;
        const orbitalPeriod = planetData.orbitalPeriod || 365.25;
        
        // Calculate orbital velocity
        const hostMass = this.getHostMass(planetData.host);
        const orbitalVelocity = Math.sqrt(this.gravitationalConstant * hostMass / semiMajorAxis);
        
        // Velocity perpendicular to position vector
        return {
            x: 0,
            y: orbitalVelocity * Math.cos(planetData.inclination || 0),
            z: orbitalVelocity * Math.sin(planetData.inclination || 0)
        };
    }
    
    getHostMass(hostName) {
        const host = this.bodies.get(hostName);
        return host ? host.mass : 1.989e30; // Default to solar mass
    }
    
    getPlanetColor(type) {
        const colors = {
            'Rock': 0x4CAF50,
            'Gas Giant': 0xFF9800,
            'Ice Dwarf': 0x00BCD4,
            'Dwarf Planet': 0x9E9E9E
        };
        return colors[type] || 0x808080;
    }
    
    update(deltaTime) {
        this.gameTime += deltaTime * this.timeScale;
        
        // Update binary star positions
        this.updateBinaryStars(deltaTime);
        
        // Calculate gravitational forces
        this.calculateGravitationalForces();
        
        // Update body positions and velocities
        this.updateBodyPositions(deltaTime);
        
        // Update orbital paths
        this.updateOrbitalPaths();
    }
    
    updateBinaryStars(deltaTime) {
        const hieleon = this.bodies.get('Hieleon');
        const nyxeon = this.bodies.get('Nyxeon');
        
        if (hieleon && nyxeon) {
            // Calculate binary orbit
            const angle = (this.gameTime / this.binaryPeriod) * 2 * Math.PI;
            const separation = this.binarySeparation;
            
            // Update positions
            hieleon.position.x = -Math.cos(angle) * separation / 2;
            hieleon.position.z = -Math.sin(angle) * separation / 2;
            
            nyxeon.position.x = Math.cos(angle) * separation / 2;
            nyxeon.position.z = Math.sin(angle) * separation / 2;
            
            // Update binary center
            this.binaryCenter.x = (hieleon.position.x + nyxeon.position.x) / 2;
            this.binaryCenter.z = (hieleon.position.z + nyxeon.position.z) / 2;
        }
    }
    
    calculateGravitationalForces() {
        // Reset forces
        this.bodies.forEach(body => {
            body.force.x = 0;
            body.force.y = 0;
            body.force.z = 0;
        });
        
        // Calculate gravitational forces between all bodies
        const bodyArray = Array.from(this.bodies.values());
        
        for (let i = 0; i < bodyArray.length; i++) {
            for (let j = i + 1; j < bodyArray.length; j++) {
                const body1 = bodyArray[i];
                const body2 = bodyArray[j];
                
                const force = this.calculateGravitationalForce(body1, body2);
                
                // Apply forces
                body1.force.x += force.x;
                body1.force.y += force.y;
                body1.force.z += force.z;
                
                body2.force.x -= force.x;
                body2.force.y -= force.y;
                body2.force.z -= force.z;
            }
        }
    }
    
    calculateGravitationalForce(body1, body2) {
        const dx = body2.position.x - body1.position.x;
        const dy = body2.position.y - body1.position.y;
        const dz = body2.position.z - body1.position.z;
        
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (distance < 1) return { x: 0, y: 0, z: 0 }; // Avoid division by zero
        
        const forceMagnitude = this.gravitationalConstant * body1.mass * body2.mass / (distance * distance);
        
        return {
            x: forceMagnitude * dx / distance,
            y: forceMagnitude * dy / distance,
            z: forceMagnitude * dz / distance
        };
    }
    
    updateBodyPositions(deltaTime) {
        this.bodies.forEach(body => {
            if (body.type === 'star') return; // Stars are handled separately
            
            // Calculate acceleration
            body.acceleration.x = body.force.x / body.mass;
            body.acceleration.y = body.force.y / body.mass;
            body.acceleration.z = body.force.z / body.mass;
            
            // Update velocity (Verlet integration)
            body.velocity.x += body.acceleration.x * deltaTime;
            body.velocity.y += body.acceleration.y * deltaTime;
            body.velocity.z += body.acceleration.z * deltaTime;
            
            // Update position
            body.position.x += body.velocity.x * deltaTime;
            body.position.y += body.velocity.y * deltaTime;
            body.position.z += body.velocity.z * deltaTime;
        });
    }
    
    calculateOrbitalPaths() {
        this.bodies.forEach((body, name) => {
            if (body.type === 'star') return;
            
            const path = [];
            const steps = this.orbitSegments;
            
            for (let i = 0; i <= steps; i++) {
                const angle = (i / steps) * 2 * Math.PI;
                const r = body.semiMajorAxis;
                
                const x = r * Math.cos(angle);
                const y = r * Math.sin(angle) * Math.sin(body.inclination || 0);
                const z = r * Math.sin(angle) * Math.cos(body.inclination || 0);
                
                path.push({ x, y, z });
            }
            
            this.orbitalPaths.set(name, path);
        });
    }
    
    updateOrbitalPaths() {
        // Update orbital path visualization
        if (this.showOrbits) {
            this.orbitalPaths.forEach((path, name) => {
                // This would update the visual representation of orbital paths
                // Implementation depends on the rendering system
            });
        }
    }
    
    getBodyPosition(name) {
        const body = this.bodies.get(name);
        return body ? { ...body.position } : null;
    }
    
    getBodyVelocity(name) {
        const body = this.bodies.get(name);
        return body ? { ...body.velocity } : null;
    }
    
    getDistanceBetweenBodies(body1Name, body2Name) {
        const body1 = this.bodies.get(body1Name);
        const body2 = this.bodies.get(body2Name);
        
        if (!body1 || !body2) return null;
        
        const dx = body2.position.x - body1.position.x;
        const dy = body2.position.y - body1.position.y;
        const dz = body2.position.z - body1.position.z;
        
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    
    getOrbitalPeriod(semiMajorAxis, centralMass) {
        // Kepler's Third Law: T² = (4π²a³) / (GM)
        const period = Math.sqrt((4 * Math.PI * Math.PI * Math.pow(semiMajorAxis, 3)) / 
                                (this.gravitationalConstant * centralMass));
        return period;
    }
    
    getEscapeVelocity(bodyName, distance) {
        const body = this.bodies.get(bodyName);
        if (!body) return null;
        
        // Escape velocity: v = √(2GM/r)
        return Math.sqrt((2 * this.gravitationalConstant * body.mass) / distance);
    }
    
    setTimeScale(scale) {
        this.timeScale = Math.max(0.1, Math.min(scale, 100));
    }
    
    getTimeScale() {
        return this.timeScale;
    }
    
    getGameTime() {
        return this.gameTime;
    }
    
    getVeauxaliaTime() {
        // Convert game time to Veauxalia calendar
        const earthDays = this.gameTime / (24 * 3600);
        const veauxaliaDays = earthDays * 1.37; // Veauxalia days are longer
        
        const years = Math.floor(veauxaliaDays / 500);
        const remainingDays = veauxaliaDays % 500;
        const months = Math.floor(remainingDays / 25);
        const days = Math.floor(remainingDays % 25);
        
        return {
            years: years,
            months: months,
            days: days,
            totalDays: veauxaliaDays
        };
    }
    
    render(scene) {
        // Render orbital paths
        if (this.showOrbits) {
            this.orbitalPaths.forEach((path, name) => {
                this.renderOrbitalPath(scene, path, name);
            });
        }
        
        // Render bodies
        this.bodies.forEach((body, name) => {
            this.renderBody(scene, body);
        });
    }
    
    renderOrbitalPath(scene, path, name) {
        // Create orbital path visualization
        const points = path.map(point => new THREE.Vector3(point.x, point.y, point.z));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
            color: 0x444444, 
            transparent: true, 
            opacity: 0.3 
        });
        
        const line = new THREE.Line(geometry, material);
        scene.addObject(`orbit_${name}`, line);
    }
    
    renderBody(scene, body) {
        // Create body mesh
        const geometry = new THREE.SphereGeometry(body.radius / 1e6, 16, 16); // Scale down for visualization
        const material = new THREE.MeshBasicMaterial({ 
            color: body.color,
            emissive: body.type === 'star' ? body.color : 0x000000,
            emissiveIntensity: body.type === 'star' ? 0.5 : 0
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(body.position.x, body.position.y, body.position.z);
        
        scene.addObject(`body_${body.name}`, mesh);
    }
}