# Veauxalia Troubleshooting Guide

## Common Issues and Solutions

### "Failed to initialize error" on GitHub Pages

If you're seeing a "failed to initialize error" when loading the game on GitHub Pages, try these solutions:

#### 1. Check Browser Console
- Press F12 to open developer tools
- Go to the Console tab
- Look for any red error messages
- Common errors include:
  - `THREE is not defined` - Three.js library failed to load
  - `Game is not defined` - Game scripts failed to load
  - WebGL errors - Browser doesn't support WebGL

#### 2. Browser Compatibility
The game requires:
- Modern browser with WebGL support
- JavaScript enabled
- Recommended browsers:
  - Chrome 80+
  - Firefox 75+
  - Safari 13+
  - Edge 80+

#### 3. Network Issues
- Check your internet connection
- The game loads Three.js from CDN
- If CDN is blocked, try:
  - Using a different network
  - Disabling VPN/proxy
  - Using a different browser

#### 4. Clear Browser Cache
- Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
- Clear cached images and files
- Refresh the page

#### 5. Use Debug Page
- Navigate to `/debug.html` on your GitHub Pages site
- This page will help identify specific issues
- Check the console output for detailed error messages

### Debug Page Features

The debug page (`debug.html`) provides:

1. **Environment Check**
   - Browser information
   - WebGL support
   - Service Worker support
   - Performance API support

2. **Dependencies Check**
   - Three.js loading status
   - OrbitControls availability
   - GLTFLoader availability

3. **Three.js Test**
   - Creates a simple 3D scene
   - Tests WebGL rendering
   - Shows a rotating green cube

4. **Game Classes Check**
   - Verifies all game classes are loaded
   - Shows which classes are missing

5. **Console Output**
   - Captures all console messages
   - Helps identify loading errors

### Manual Testing Steps

1. **Test Three.js Loading**
   ```javascript
   // In browser console
   console.log(typeof THREE); // Should show "object"
   console.log(THREE.REVISION); // Should show version number
   ```

2. **Test WebGL Support**
   ```javascript
   // In browser console
   const canvas = document.createElement('canvas');
   const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
   console.log(gl ? 'WebGL supported' : 'WebGL not supported');
   ```

3. **Test Game Classes**
   ```javascript
   // In browser console (after page loads)
   console.log(typeof Game); // Should show "function"
   console.log(typeof Scene); // Should show "function"
   console.log(typeof Player); // Should show "function"
   ```

### Performance Issues

If the game loads but runs slowly:

1. **Reduce Graphics Quality**
   - Open the game menu
   - Go to Settings
   - Lower the graphics quality setting

2. **Close Other Tabs**
   - Close unnecessary browser tabs
   - Free up system resources

3. **Update Graphics Drivers**
   - Ensure your graphics drivers are up to date
   - This is especially important for WebGL performance

### Mobile Issues

On mobile devices:

1. **Touch Controls**
   - The game uses touch controls on mobile
   - Tap to look around
   - Use on-screen buttons for actions

2. **Performance**
   - Mobile devices may have lower performance
   - Try the "Low" graphics setting
   - Close other apps to free memory

3. **Browser**
   - Use Chrome or Safari on mobile
   - Avoid older mobile browsers

### Still Having Issues?

If none of the above solutions work:

1. **Check GitHub Pages Status**
   - Visit https://www.githubstatus.com/
   - Ensure GitHub Pages is operational

2. **Try Different Device**
   - Test on a different computer
   - Test on a different browser
   - Test on mobile device

3. **Report Issues**
   - Open an issue on the GitHub repository
   - Include:
     - Browser and version
     - Operating system
     - Console error messages
     - Steps to reproduce

### Development Mode

For developers testing locally:

1. **Local Server**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

2. **Debug Shortcuts**
   - F1: Log game state
   - F2: Log current planet
   - F3: Log player position
   - F5: Save game
   - F9: Load game

3. **Console Commands**
   ```javascript
   // Access game object
   window.game
   
   // Check game state
   window.game.isRunning
   
   // Force reload
   location.reload()
   ```

### File Structure

Ensure all required files are present:

```
/
├── index.html
├── debug.html
├── sw.js
├── styles/
│   └── main.css
├── js/
│   ├── main.js
│   ├── utils/
│   │   ├── Constants.js
│   │   ├── MathUtils.js
│   │   └── LanguageSystem.js
│   ├── core/
│   │   ├── Game.js
│   │   ├── Scene.js
│   │   ├── Player.js
│   │   ├── Camera.js
│   │   └── Controls.js
│   ├── world/
│   │   ├── Planet.js
│   │   ├── Star.js
│   │   ├── SolarSystem.js
│   │   ├── Terrain.js
│   │   └── Atmosphere.js
│   ├── systems/
│   │   ├── Physics.js
│   │   ├── OrbitalMechanics.js
│   │   ├── Weather.js
│   │   ├── PoliticalSystem.js
│   │   └── CulturalSystem.js
│   ├── ui/
│   │   ├── HUD.js
│   │   ├── Menu.js
│   │   ├── Crafting.js
│   │   ├── Map.js
│   │   └── ImperialUI.js
│   └── data/
│       ├── PlanetData.js
│       ├── StarData.js
│       └── ItemData.js
└── README.md
```

Missing files will cause initialization failures. Check that all files are properly uploaded to GitHub Pages.