// Main entry point for Veauxalia game
let game = null;

// Loading screen management
const loadingProgress = document.getElementById('loading-progress');
const loadingText = document.getElementById('loading-text');

function updateLoadingProgress(progress, text, details = '') {
    loadingProgress.style.width = `${progress}%`;
    if (text) {
        loadingText.textContent = text;
    }
    if (details) {
        document.getElementById('loading-details').textContent = details;
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Starting Veauxalia game initialization...');
        
        // Set a timeout for initialization
        const initTimeout = setTimeout(() => {
            showError('Game initialization timed out. Please refresh the page and try again.');
        }, 30000); // 30 second timeout
        
        // Check if Three.js is available
        if (typeof THREE === 'undefined') {
            throw new Error('Three.js library not loaded. Please refresh the page.');
        }
        
        // Update loading progress
        updateLoadingProgress(10, 'Loading game engine...', 'Checking dependencies...');
        
        // Wait a bit for visual feedback
        await new Promise(resolve => setTimeout(resolve, 500));
        
        updateLoadingProgress(20, 'Initializing 3D scene...', 'Setting up WebGL renderer...');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        updateLoadingProgress(40, 'Loading solar system data...', 'Loading planet and star data...');
        await new Promise(resolve => setTimeout(resolve, 400));
        
        updateLoadingProgress(60, 'Generating world terrain...', 'Creating procedural landscapes...');
        await new Promise(resolve => setTimeout(resolve, 600));
        
        updateLoadingProgress(80, 'Setting up user interface...', 'Initializing HUD and menus...');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        updateLoadingProgress(90, 'Finalizing initialization...', 'Connecting game systems...');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        updateLoadingProgress(100, 'Ready to explore Veauxalia!', 'Press any key to begin your journey...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create and start the game
        game = new Game();
        
        // Make game globally accessible for debugging
        window.game = game;
        
        // Clear the timeout since initialization succeeded
        clearTimeout(initTimeout);
        
        console.log('Veauxalia game ready!');
        
    } catch (error) {
        console.error('Failed to initialize game:', error);
        showError(`Failed to initialize game: ${error.message}. Please refresh the page.`);
    }
});

// Error handling
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        text-align: center;
    `;
    errorDiv.innerHTML = `
        <h3>Error</h3>
        <p>${message}</p>
        <button onclick="location.reload()" style="
            background: white;
            color: red;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
        ">Reload Page</button>
    `;
    document.body.appendChild(errorDiv);
}

// Handle window errors
window.addEventListener('error', (event) => {
    console.error('Window error:', event.error);
    if (!document.querySelector('.error-message')) {
        showError('An unexpected error occurred. Please refresh the page.');
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    if (!document.querySelector('.error-message')) {
        showError('An unexpected error occurred. Please refresh the page.');
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    });
}

// Mobile detection and optimization
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
    console.log('Mobile device detected - applying mobile optimizations');
    document.body.classList.add('mobile');
    
    // Request pointer lock for mobile
    document.addEventListener('click', () => {
        if (game && game.scene && game.scene.renderer) {
            game.scene.renderer.domElement.requestPointerLock();
        }
    });
}

// WebGL support check
function checkWebGLSupport() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
        showError('WebGL is not supported in your browser. Please use a modern browser with WebGL support.');
        return false;
    }
    
    // Check for required extensions
    const requiredExtensions = ['OES_standard_derivatives', 'OES_element_index_uint'];
    for (const ext of requiredExtensions) {
        if (!gl.getExtension(ext)) {
            console.warn(`WebGL extension ${ext} not supported - some features may be limited`);
        }
    }
    
    return true;
}

// Check WebGL support before starting
if (!checkWebGLSupport()) {
    // Error already shown by checkWebGLSupport
} else {
    console.log('WebGL support confirmed');
}

// Service Worker for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Use relative path for GitHub Pages
        const swPath = window.location.hostname === 'github.io' ? './sw.js' : '/sw.js';
        navigator.serviceWorker.register(swPath)
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
                // Don't show error for service worker - it's optional
            });
    });
}

// Keyboard shortcuts for development
document.addEventListener('keydown', (event) => {
    // Only in development mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        switch (event.code) {
            case 'F1':
                event.preventDefault();
                console.log('Game state:', game);
                break;
            case 'F2':
                event.preventDefault();
                if (game && game.currentPlanet) {
                    console.log('Current planet:', game.currentPlanet);
                }
                break;
            case 'F3':
                event.preventDefault();
                if (game && game.player) {
                    console.log('Player position:', game.player.getPosition());
                }
                break;
            case 'F5':
                event.preventDefault();
                if (game) {
                    game.saveGame();
                }
                break;
            case 'F9':
                event.preventDefault();
                if (game) {
                    game.loadGame();
                }
                break;
        }
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { game, updateLoadingProgress, showError, isMobile, checkWebGLSupport };
}