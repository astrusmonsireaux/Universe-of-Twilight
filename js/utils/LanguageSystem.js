// Language System for Veauxalia - Gaulsais Integration
class LanguageSystem {
    constructor() {
        this.currentLanguage = 'english';
        this.availableLanguages = ['english', 'gaulsais'];
        this.translations = this.initializeTranslations();
        this.init();
    }
    
    init() {
        console.log('Language system initialized with Gaulsais support');
    }
    
    initializeTranslations() {
        return {
            // Game Interface
            ui: {
                english: {
                    'game_title': 'Veauxalia: Universe of Twilight',
                    'loading': 'Loading...',
                    'start_game': 'Start Game',
                    'continue': 'Continue',
                    'settings': 'Settings',
                    'exit': 'Exit',
                    'health': 'Health',
                    'energy': 'Energy',
                    'inventory': 'Inventory',
                    'crafting': 'Crafting',
                    'map': 'Map',
                    'menu': 'Menu',
                    'resume': 'Resume',
                    'save_game': 'Save Game',
                    'load_game': 'Load Game',
                    'credits': 'Credits',
                    'back': 'Back',
                    'graphics_quality': 'Graphics Quality',
                    'sound_volume': 'Sound Volume',
                    'music_volume': 'Music Volume',
                    'mouse_sensitivity': 'Mouse Sensitivity',
                    'low': 'Low',
                    'medium': 'Medium',
                    'high': 'High',
                    'ultra': 'Ultra',
                    'controls': 'Controls',
                    'instructions': 'Instructions',
                    'got_it': 'Got it!',
                    'travel_to': 'Travel to',
                    'solar_system': 'Solar System',
                    'planet_view': 'Planet View',
                    'local_map': 'Local Map',
                    'zoom_in': 'Zoom In',
                    'zoom_out': 'Zoom Out',
                    'reset_view': 'Reset View',
                    'all_items': 'All Items',
                    'tools': 'Tools',
                    'structures': 'Structures',
                    'consumables': 'Consumables',
                    'special_items': 'Special Items',
                    'technology': 'Technology'
                },
                gaulsais: {
                    'game_title': 'Veauxalia: Universum Crepusculi',
                    'loading': 'Caricando...',
                    'start_game': 'Incipere Ludum',
                    'continue': 'Continuare',
                    'settings': 'Configuratio',
                    'exit': 'Exire',
                    'health': 'Salus',
                    'energy': 'Energia',
                    'inventory': 'Inventarium',
                    'crafting': 'Fabrica',
                    'map': 'Tabula',
                    'menu': 'Index',
                    'resume': 'Resumere',
                    'save_game': 'Servare Ludum',
                    'load_game': 'Caricare Ludum',
                    'credits': 'Laudes',
                    'back': 'Retro',
                    'graphics_quality': 'Qualitas Graphica',
                    'sound_volume': 'Volumen Sonus',
                    'music_volume': 'Volumen Musica',
                    'mouse_sensitivity': 'Sensibilitas Mus',
                    'low': 'Humilis',
                    'medium': 'Medius',
                    'high': 'Altus',
                    'ultra': 'Ultra',
                    'controls': 'Imperium',
                    'instructions': 'Instructiones',
                    'got_it': 'Intellexi!',
                    'travel_to': 'Navigare ad',
                    'solar_system': 'Systema Solaris',
                    'planet_view': 'Visio Planetae',
                    'local_map': 'Tabula Localis',
                    'zoom_in': 'Magnificare',
                    'zoom_out': 'Minificare',
                    'reset_view': 'Reset Visio',
                    'all_items': 'Omnia Instrumenta',
                    'tools': 'Instrumenta',
                    'structures': 'Structurae',
                    'consumables': 'Consumptibilia',
                    'special_items': 'Instrumenta Specialia',
                    'technology': 'Technologia'
                }
            },
            
            // Game Messages
            messages: {
                english: {
                    'welcome': 'Welcome to Veauxalia, citizen of the United Empire of Gauletria!',
                    'ability_unlocked': 'Ability Unlocked: {ability}!',
                    'insufficient_energy': 'Insufficient energy for {action}',
                    'item_collected': 'Collected {item}!',
                    'inventory_full': 'Inventory is full!',
                    'crafting_success': 'Successfully crafted {item}!',
                    'insufficient_materials': 'Insufficient materials to craft this item',
                    'traveling_to': 'Traveling to {planet}...',
                    'photosynthesis_active': 'Photosynthesis Active',
                    'photosynthesis_inactive': 'Photosynthesis Inactive',
                    'low_energy_warning': 'Low Energy! Rest or find sunlight.',
                    'low_health_warning': 'Low Health! Find healing items.',
                    'telepathy_activated': 'Telepathy activated - sensing nearby life forms',
                    'time_perception_activated': 'Time perception activated - time appears to slow',
                    'telepathy_deactivated': 'Telepathy deactivated',
                    'time_perception_deactivated': 'Time perception deactivated',
                    'game_saved': 'Game saved successfully!',
                    'game_loaded': 'Game loaded successfully!',
                    'empire_greeting': 'Salve, civis Imperii Uniti Gauletriae!',
                    'imperial_technology': 'Imperial technology at your service.',
                    'gaulsais_welcome': 'Benevenite in Veauxalia!'
                },
                gaulsais: {
                    'welcome': 'Benevenite in Veauxalia, civis Imperii Uniti Gauletriae!',
                    'ability_unlocked': 'Potestas Aperta: {ability}!',
                    'insufficient_energy': 'Energia insufficiens pro {action}',
                    'item_collected': 'Collectum {item}!',
                    'inventory_full': 'Inventarium plenum est!',
                    'crafting_success': 'Successe fabricatum {item}!',
                    'insufficient_materials': 'Materiae insufficientes ad fabricandum',
                    'traveling_to': 'Navigans ad {planet}...',
                    'photosynthesis_active': 'Photosynthesis Activa',
                    'photosynthesis_inactive': 'Photosynthesis Inactiva',
                    'low_energy_warning': 'Energia Humilis! Requiesce vel quaere solem.',
                    'low_health_warning': 'Salus Humilis! Quaere medicamenta.',
                    'telepathy_activated': 'Telepathia activata - sentiens formas vitae proximas',
                    'time_perception_activated': 'Perceptio temporis activata - tempus videtur tardare',
                    'telepathy_deactivated': 'Telepathia deactivata',
                    'time_perception_deactivated': 'Perceptio temporis deactivata',
                    'game_saved': 'Ludus servatus successe!',
                    'game_loaded': 'Ludus cargatus successe!',
                    'empire_greeting': 'Salve, civis Imperii Uniti Gauletriae!',
                    'imperial_technology': 'Technologia imperialis ad servitium tuum.',
                    'gaulsais_welcome': 'Benevenite in Veauxalia!'
                }
            },
            
            // Planet Names
            planets: {
                english: {
                    'Chimera': 'Chimera',
                    'Neflaym': 'Neflaym',
                    'Elisium': 'Elisium',
                    'Phantom': 'Phantom',
                    'Titan': 'Titan',
                    'Baylephon': 'Baylephon',
                    'Dimetrian': 'Dimetrian',
                    'Sufreign': 'Sufreign',
                    'Areon': 'Areon',
                    'Gallian': 'Gallian',
                    'Lagnia': 'Lagnia'
                },
                gaulsais: {
                    'Chimera': 'Chimaera',
                    'Neflaym': 'Neflaymus',
                    'Elisium': 'Elisium',
                    'Phantom': 'Phantasma',
                    'Titan': 'Titanus',
                    'Baylephon': 'Baylephonus',
                    'Dimetrian': 'Dimetrianus',
                    'Sufreign': 'Sufreignus',
                    'Areon': 'Areonus',
                    'Gallian': 'Gallianus',
                    'Lagnia': 'Lagnianus'
                }
            },
            
            // Item Names
            items: {
                english: {
                    'rock': 'Rock',
                    'stone': 'Stone',
                    'wood': 'Wood',
                    'iron_ore': 'Iron Ore',
                    'crystal': 'Crystal',
                    'medicine': 'Medicine',
                    'energy_potion': 'Energy Potion',
                    'telepathy_crystal': 'Telepathy Crystal',
                    'time_crystal': 'Time Crystal'
                },
                gaulsais: {
                    'rock': 'Saxum',
                    'stone': 'Lapis',
                    'wood': 'Lignum',
                    'iron_ore': 'Ferrum Rudis',
                    'crystal': 'Crystallus',
                    'medicine': 'Medicamentum',
                    'energy_potion': 'Potion Energiae',
                    'telepathy_crystal': 'Crystallus Telepathiae',
                    'time_crystal': 'Crystallus Temporis'
                }
            }
        };
    }
    
    translate(key, category = 'ui', language = null) {
        const lang = language || this.currentLanguage;
        const translation = this.translations[category]?.[lang]?.[key];
        
        if (translation) {
            return translation;
        }
        
        // Fallback to English
        const englishTranslation = this.translations[category]?.english?.[key];
        if (englishTranslation) {
            return englishTranslation;
        }
        
        // Return key if no translation found
        return key;
    }
    
    translateWithParams(key, params, category = 'messages', language = null) {
        let translation = this.translate(key, category, language);
        
        // Replace parameters
        Object.keys(params).forEach(param => {
            translation = translation.replace(`{${param}}`, params[param]);
        });
        
        return translation;
    }
    
    setLanguage(language) {
        if (this.availableLanguages.includes(language)) {
            this.currentLanguage = language;
            this.updateUI();
            console.log(`Language changed to: ${language}`);
        }
    }
    
    updateUI() {
        // Update all UI elements with new language
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const category = element.getAttribute('data-translate-category') || 'ui';
            element.textContent = this.translate(key, category);
        });
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    getAvailableLanguages() {
        return this.availableLanguages;
    }
    
    // Gaulsais-specific methods
    translateToGaulsais(text) {
        // Simple word replacement for common terms
        const gaulsaisWords = {
            'hello': 'Salve',
            'goodbye': 'Vale',
            'welcome': 'Benevenite',
            'star': 'Stella',
            'planet': 'Planeta',
            'sun': 'Sol',
            'moon': 'Luna',
            'energy': 'Energia',
            'health': 'Salus',
            'empire': 'Imperium',
            'citizen': 'Civis',
            'technology': 'Technologia',
            'science': 'Scientia',
            'truth': 'Veritas',
            'life': 'Vita',
            'death': 'Mors',
            'time': 'Tempus',
            'space': 'Spatium'
        };
        
        let translatedText = text;
        Object.keys(gaulsaisWords).forEach(english => {
            const regex = new RegExp(`\\b${english}\\b`, 'gi');
            translatedText = translatedText.replace(regex, gaulsaisWords[english]);
        });
        
        return translatedText;
    }
    
    // Generate Gaulsais names
    generateGaulsaisName(type = 'location') {
        const prefixes = {
            location: ['Nova', 'Antiqua', 'Magna', 'Parva', 'Alta', 'Profunda'],
            person: ['Marcus', 'Julia', 'Lucius', 'Claudia', 'Quintus', 'Aurelia'],
            ship: ['Stella', 'Luna', 'Sol', 'Astra', 'Caelum', 'Mare']
        };
        
        const suffixes = {
            location: ['-polis', '-burgus', '-castrum', '-domus', '-templum', '-forum'],
            person: ['-ius', '-ia', '-us', '-a', '-is', '-es'],
            ship: ['-navis', '-classis', '-vessel', '-cruiser', '-explorer', '-carrier']
        };
        
        const prefix = prefixes[type][Math.floor(Math.random() * prefixes[type].length)];
        const suffix = suffixes[type][Math.floor(Math.random() * suffixes[type].length)];
        
        return prefix + suffix;
    }
    
    // Imperial greeting generator
    generateImperialGreeting() {
        const greetings = [
            'Salve, civis Imperii Uniti Gauletriae!',
            'Benevenite, explorator!',
            'Ave, scientiae amator!',
            'Salve, technologiae cultor!',
            'Benevenite in Veauxalia!'
        ];
        
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Time conversion to Veauxalia time
    convertToVeauxaliaTime(earthTime) {
        const chimeraDayLength = TIME_SYSTEM.dayLength * 3600; // Convert to seconds
        const chimeraYearLength = TIME_SYSTEM.yearLength * chimeraDayLength;
        
        const chimeraDays = earthTime / chimeraDayLength;
        const chimeraYears = Math.floor(chimeraDays / TIME_SYSTEM.yearLength);
        const remainingDays = chimeraDays % TIME_SYSTEM.yearLength;
        const chimeraMonths = Math.floor(remainingDays / TIME_SYSTEM.monthLength);
        const remainingMonthDays = remainingDays % TIME_SYSTEM.monthLength;
        
        const monthName = TIME_SYSTEM.months[chimeraMonths];
        const dayName = TIME_SYSTEM.days[Math.floor(remainingMonthDays)];
        
        return {
            years: chimeraYears,
            months: chimeraMonths,
            monthName: monthName,
            days: Math.floor(remainingMonthDays),
            dayName: dayName,
            hours: Math.floor((remainingMonthDays % 1) * TIME_SYSTEM.dayLength),
            formatted: `${dayName}, ${monthName} ${chimeraYears + 1} AE (Anno Empire)`
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageSystem;
}