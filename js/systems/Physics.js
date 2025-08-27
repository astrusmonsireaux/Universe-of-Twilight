// Physics system for Veauxalia
class Physics {
    constructor() {
        this.gravity = GAME_CONSTANTS.GRAVITY;
        this.objects = new Map();
        this.particles = [];
        this.forces = new Map();
        this.collisionGroups = new Map();
        
        // Physics constants
        this.airResistance = 0.98;
        this.friction = 0.8;
        this.bounce = 0.3;
        this.terminalVelocity = 50;
        
        // Collision detection
        this.spatialHash = new Map();
        this.cellSize = 10;
        
        this.init();
    }
    
    init() {
        console.log('Physics system initialized');
    }
    
    update(deltaTime) {
        // Update all physics objects
        this.objects.forEach((object, id) => {
            this.updateObject(object, deltaTime);
        });
        
        // Update particles
        this.updateParticles(deltaTime);
        
        // Update spatial hash for collision detection
        this.updateSpatialHash();
        
        // Check collisions
        this.checkCollisions();
        
        // Apply forces
        this.applyForces(deltaTime);
    }
    
    updateObject(object, deltaTime) {
        if (!object.physics) return;
        
        const physics = object.physics;
        
        // Apply gravity
        if (physics.affectedByGravity) {
            physics.velocity.y -= this.gravity * deltaTime;
        }
        
        // Apply air resistance
        physics.velocity.x *= this.airResistance;
        physics.velocity.z *= this.airResistance;
        
        // Clamp velocity to terminal velocity
        const speed = Math.sqrt(
            physics.velocity.x * physics.velocity.x +
            physics.velocity.y * physics.velocity.y +
            physics.velocity.z * physics.velocity.z
        );
        
        if (speed > this.terminalVelocity) {
            const scale = this.terminalVelocity / speed;
            physics.velocity.x *= scale;
            physics.velocity.y *= scale;
            physics.velocity.z *= scale;
        }
        
        // Update position
        object.position.x += physics.velocity.x * deltaTime;
        object.position.y += physics.velocity.y * deltaTime;
        object.position.z += physics.velocity.z * deltaTime;
        
        // Update mesh position if available
        if (object.mesh) {
            object.mesh.position.copy(object.position);
        }
        
        // Check ground collision
        this.checkGroundCollision(object);
    }
    
    checkGroundCollision(object) {
        if (!object.physics || !object.physics.affectedByGravity) return;
        
        // Get terrain height at object position
        if (window.game && window.game.currentPlanet) {
            const terrainHeight = window.game.currentPlanet.getHeightAt(
                object.position.x, 
                object.position.z
            );
            
            const groundLevel = terrainHeight + (object.physics.radius || 0);
            
            if (object.position.y <= groundLevel) {
                object.position.y = groundLevel;
                
                // Apply bounce or stop
                if (Math.abs(object.physics.velocity.y) > 2) {
                    object.physics.velocity.y = -object.physics.velocity.y * this.bounce;
                } else {
                    object.physics.velocity.y = 0;
                }
                
                // Apply friction
                object.physics.velocity.x *= this.friction;
                object.physics.velocity.z *= this.friction;
            }
        }
    }
    
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update particle physics
            particle.velocity.y -= this.gravity * deltaTime * 0.1;
            particle.position.x += particle.velocity.x * deltaTime;
            particle.position.y += particle.velocity.y * deltaTime;
            particle.position.z += particle.velocity.z * deltaTime;
            
            // Update life
            particle.life -= deltaTime;
            
            // Update mesh if available
            if (particle.mesh) {
                particle.mesh.position.copy(particle.position);
                particle.mesh.material.opacity = particle.life / particle.maxLife;
            }
            
            // Remove dead particles
            if (particle.life <= 0) {
                if (particle.mesh && particle.mesh.parent) {
                    particle.mesh.parent.remove(particle.mesh);
                }
                this.particles.splice(i, 1);
            }
        }
    }
    
    updateSpatialHash() {
        this.spatialHash.clear();
        
        this.objects.forEach((object, id) => {
            if (!object.physics) return;
            
            const cellX = Math.floor(object.position.x / this.cellSize);
            const cellZ = Math.floor(object.position.z / this.cellSize);
            const cellKey = `${cellX},${cellZ}`;
            
            if (!this.spatialHash.has(cellKey)) {
                this.spatialHash.set(cellKey, []);
            }
            this.spatialHash.get(cellKey).push(object);
        });
    }
    
    checkCollisions() {
        this.spatialHash.forEach((objects, cellKey) => {
            for (let i = 0; i < objects.length; i++) {
                for (let j = i + 1; j < objects.length; j++) {
                    this.checkObjectCollision(objects[i], objects[j]);
                }
            }
        });
    }
    
    checkObjectCollision(obj1, obj2) {
        if (!obj1.physics || !obj2.physics) return;
        
        const distance = Math.sqrt(
            Math.pow(obj1.position.x - obj2.position.x, 2) +
            Math.pow(obj1.position.y - obj2.position.y, 2) +
            Math.pow(obj1.position.z - obj2.position.z, 2)
        );
        
        const minDistance = (obj1.physics.radius || 0) + (obj2.physics.radius || 0);
        
        if (distance < minDistance) {
            this.resolveCollision(obj1, obj2, distance, minDistance);
        }
    }
    
    resolveCollision(obj1, obj2, distance, minDistance) {
        if (distance === 0) return;
        
        const overlap = minDistance - distance;
        const separationVector = {
            x: (obj1.position.x - obj2.position.x) / distance * overlap * 0.5,
            y: (obj1.position.y - obj2.position.y) / distance * overlap * 0.5,
            z: (obj1.position.z - obj2.position.z) / distance * overlap * 0.5
        };
        
        // Separate objects
        obj1.position.x += separationVector.x;
        obj1.position.y += separationVector.y;
        obj1.position.z += separationVector.z;
        
        obj2.position.x -= separationVector.x;
        obj2.position.y -= separationVector.y;
        obj2.position.z -= separationVector.z;
        
        // Update mesh positions
        if (obj1.mesh) obj1.mesh.position.copy(obj1.position);
        if (obj2.mesh) obj2.mesh.position.copy(obj2.position);
        
        // Handle collision response
        this.handleCollisionResponse(obj1, obj2);
    }
    
    handleCollisionResponse(obj1, obj2) {
        // Simple elastic collision
        if (obj1.physics && obj2.physics) {
            const tempVel = { ...obj1.physics.velocity };
            obj1.physics.velocity = { ...obj2.physics.velocity };
            obj2.physics.velocity = tempVel;
        }
        
        // Trigger collision events
        if (obj1.onCollision) obj1.onCollision(obj2);
        if (obj2.onCollision) obj2.onCollision(obj1);
    }
    
    applyForces(deltaTime) {
        this.forces.forEach((force, id) => {
            const object = this.objects.get(id);
            if (object && object.physics) {
                object.physics.velocity.x += force.x * deltaTime;
                object.physics.velocity.y += force.y * deltaTime;
                object.physics.velocity.z += force.z * deltaTime;
            }
        });
        
        // Clear forces
        this.forces.clear();
    }
    
    addObject(object, physicsData = {}) {
        object.physics = {
            velocity: { x: 0, y: 0, z: 0 },
            affectedByGravity: true,
            radius: 0.5,
            mass: 1,
            ...physicsData
        };
        
        this.objects.set(object.id || Date.now(), object);
    }
    
    removeObject(object) {
        this.objects.delete(object.id);
    }
    
    addForce(objectId, force) {
        this.forces.set(objectId, force);
    }
    
    createParticle(position, velocity, life, color = 0xffffff) {
        const particle = {
            position: { ...position },
            velocity: { ...velocity },
            life: life,
            maxLife: life,
            mesh: null
        };
        
        // Create particle mesh
        const geometry = new THREE.SphereGeometry(0.1, 4, 4);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1
        });
        
        particle.mesh = new THREE.Mesh(geometry, material);
        particle.mesh.position.copy(position);
        
        this.particles.push(particle);
        return particle;
    }
    
    createExplosion(position, count = 20, force = 10) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const elevation = Math.random() * Math.PI;
            const speed = Math.random() * force + 5;
            
            const velocity = {
                x: Math.sin(elevation) * Math.cos(angle) * speed,
                y: Math.cos(elevation) * speed,
                z: Math.sin(elevation) * Math.sin(angle) * speed
            };
            
            this.createParticle(position, velocity, 2, 0xff6600);
        }
    }
    
    applyGravity(object, planetData) {
        if (object.velocity && planetData.gravity) {
            object.velocity.y -= planetData.gravity * this.gravity * deltaTime;
        }
    }
    
    raycast(origin, direction, maxDistance = 100) {
        const hits = [];
        
        this.objects.forEach((object, id) => {
            if (!object.physics) return;
            
            const hit = this.raycastObject(origin, direction, object, maxDistance);
            if (hit) {
                hits.push(hit);
            }
        });
        
        // Sort by distance
        hits.sort((a, b) => a.distance - b.distance);
        
        return hits.length > 0 ? hits[0] : null;
    }
    
    raycastObject(origin, direction, object, maxDistance) {
        const radius = object.physics?.radius || 0.5;
        
        // Simple sphere raycast
        const oc = {
            x: origin.x - object.position.x,
            y: origin.y - object.position.y,
            z: origin.z - object.position.z
        };
        
        const a = direction.x * direction.x + direction.y * direction.y + direction.z * direction.z;
        const b = 2 * (oc.x * direction.x + oc.y * direction.y + oc.z * direction.z);
        const c = oc.x * oc.x + oc.y * oc.y + oc.z * oc.z - radius * radius;
        
        const discriminant = b * b - 4 * a * c;
        
        if (discriminant < 0) return null;
        
        const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
        
        let t = t1;
        if (t < 0) t = t2;
        if (t < 0 || t > maxDistance) return null;
        
        return {
            object: object,
            distance: t,
            point: {
                x: origin.x + direction.x * t,
                y: origin.y + direction.y * t,
                z: origin.z + direction.z * t
            }
        };
    }
    
    render(scene) {
        // Render particles
        this.particles.forEach(particle => {
            if (particle.mesh) {
                scene.addObject(`particle_${particle.id}`, particle.mesh);
            }
        });
    }
}