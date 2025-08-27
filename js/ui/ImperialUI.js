// Imperial UI System for United Empire of Gauletria
class ImperialUI {
    constructor() {
        this.politicalSystem = null;
        this.culturalSystem = null;
        this.languageSystem = null;
        this.currentView = 'main';
        this.overlays = {};
        
        this.init();
    }
    
    init() {
        console.log('Imperial UI System initialized');
        this.createOverlays();
        this.setupEventListeners();
    }
    
    setSystems(politicalSystem, culturalSystem, languageSystem) {
        this.politicalSystem = politicalSystem;
        this.culturalSystem = culturalSystem;
        this.languageSystem = languageSystem;
    }
    
    createOverlays() {
        this.createImperialStatusOverlay();
        this.createPoliticalOverlay();
        this.createCulturalOverlay();
        this.createCitizenRightsOverlay();
        this.createFestivalOverlay();
    }
    
    createImperialStatusOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'imperial-status-overlay';
        overlay.className = 'imperial-overlay hidden';
        overlay.innerHTML = `
            <div class="imperial-content">
                <div class="imperial-header">
                    <h2>Imperial Status</h2>
                    <button class="close-btn" onclick="window.game.imperialUI.hideOverlay('imperial-status')">×</button>
                </div>
                <div class="imperial-body">
                    <div class="status-grid">
                        <div class="status-item">
                            <h3>Empire Stability</h3>
                            <div class="status-bar">
                                <div class="status-fill" id="stability-bar"></div>
                            </div>
                            <span id="stability-value">95%</span>
                        </div>
                        <div class="status-item">
                            <h3>Democracy Index</h3>
                            <div class="status-bar">
                                <div class="status-fill" id="democracy-bar"></div>
                            </div>
                            <span id="democracy-value">85%</span>
                        </div>
                        <div class="status-item">
                            <h3>Technology Level</h3>
                            <div class="status-bar">
                                <div class="status-fill" id="technology-bar"></div>
                            </div>
                            <span id="technology-value">90%</span>
                        </div>
                        <div class="status-item">
                            <h3>Prosperity</h3>
                            <div class="status-bar">
                                <div class="status-fill" id="prosperity-bar"></div>
                            </div>
                            <span id="prosperity-value">88%</span>
                        </div>
                    </div>
                    <div class="emperor-info">
                        <h3>Emperor Status</h3>
                        <p><strong>Name:</strong> <span id="emperor-name">Imperator Maximus</span></p>
                        <p><strong>Approval:</strong> <span id="emperor-approval">92%</span></p>
                        <p><strong>Current Policies:</strong></p>
                        <ul id="emperor-policies"></ul>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.overlays['imperial-status'] = overlay;
    }
    
    createPoliticalOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'political-overlay';
        overlay.className = 'imperial-overlay hidden';
        overlay.innerHTML = `
            <div class="imperial-content">
                <div class="imperial-header">
                    <h2>Political System</h2>
                    <button class="close-btn" onclick="window.game.imperialUI.hideOverlay('political')">×</button>
                </div>
                <div class="imperial-body">
                    <div class="political-tabs">
                        <button class="tab-btn active" data-tab="government">Government</button>
                        <button class="tab-btn" data-tab="senate">Senate</button>
                        <button class="tab-btn" data-tab="policies">Policies</button>
                        <button class="tab-btn" data-tab="events">Events</button>
                    </div>
                    <div class="tab-content">
                        <div id="government-tab" class="tab-panel active">
                            <h3>Government Structure</h3>
                            <div class="government-info">
                                <div class="gov-section">
                                    <h4>Emperor</h4>
                                    <p id="emperor-details"></p>
                                </div>
                                <div class="gov-section">
                                    <h4>Senate</h4>
                                    <p id="senate-details"></p>
                                </div>
                                <div class="gov-section">
                                    <h4>Judiciary</h4>
                                    <p id="judiciary-details"></p>
                                </div>
                                <div class="gov-section">
                                    <h4>Military</h4>
                                    <p id="military-details"></p>
                                </div>
                            </div>
                        </div>
                        <div id="senate-tab" class="tab-panel">
                            <h3>Senate Session</h3>
                            <div id="senate-session"></div>
                        </div>
                        <div id="policies-tab" class="tab-panel">
                            <h3>Current Policies</h3>
                            <div id="current-policies"></div>
                        </div>
                        <div id="events-tab" class="tab-panel">
                            <h3>Recent Events</h3>
                            <div id="recent-events"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.overlays['political'] = overlay;
    }
    
    createCulturalOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'cultural-overlay';
        overlay.className = 'imperial-overlay hidden';
        overlay.innerHTML = `
            <div class="imperial-content">
                <div class="imperial-header">
                    <h2>Cultural System</h2>
                    <button class="close-btn" onclick="window.game.imperialUI.hideOverlay('cultural')">×</button>
                </div>
                <div class="imperial-body">
                    <div class="cultural-tabs">
                        <button class="tab-btn active" data-tab="traditions">Traditions</button>
                        <button class="tab-btn" data-tab="arts">Arts</button>
                        <button class="tab-btn" data-tab="philosophy">Philosophy</button>
                        <button class="tab-btn" data-tab="language">Language</button>
                    </div>
                    <div class="tab-content">
                        <div id="traditions-tab" class="tab-panel active">
                            <h3>Cultural Traditions</h3>
                            <div id="traditions-content"></div>
                        </div>
                        <div id="arts-tab" class="tab-panel">
                            <h3>Arts and Culture</h3>
                            <div id="arts-content"></div>
                        </div>
                        <div id="philosophy-tab" class="tab-panel">
                            <h3>Philosophical Schools</h3>
                            <div id="philosophy-content"></div>
                        </div>
                        <div id="language-tab" class="tab-panel">
                            <h3>Gaulsais Language</h3>
                            <div id="language-content"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.overlays['cultural'] = overlay;
    }
    
    createCitizenRightsOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'citizen-rights-overlay';
        overlay.className = 'imperial-overlay hidden';
        overlay.innerHTML = `
            <div class="imperial-content">
                <div class="imperial-header">
                    <h2>Citizen Rights</h2>
                    <button class="close-btn" onclick="window.game.imperialUI.hideOverlay('citizen-rights')">×</button>
                </div>
                <div class="imperial-body">
                    <div class="rights-categories">
                        <div class="rights-section">
                            <h3>Fundamental Rights</h3>
                            <ul id="fundamental-rights"></ul>
                        </div>
                        <div class="rights-section">
                            <h3>Political Rights</h3>
                            <ul id="political-rights"></ul>
                        </div>
                        <div class="rights-section">
                            <h3>Social Rights</h3>
                            <ul id="social-rights"></ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.overlays['citizen-rights'] = overlay;
    }
    
    createFestivalOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'festival-overlay';
        overlay.className = 'imperial-overlay hidden';
        overlay.innerHTML = `
            <div class="imperial-content">
                <div class="imperial-header">
                    <h2>Festival Information</h2>
                    <button class="close-btn" onclick="window.game.imperialUI.hideOverlay('festival')">×</button>
                </div>
                <div class="imperial-body">
                    <div id="current-festival-info"></div>
                    <div class="upcoming-festivals">
                        <h3>Upcoming Festivals</h3>
                        <div id="upcoming-festivals-list"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.overlays['festival'] = overlay;
    }
    
    setupEventListeners() {
        // Tab switching
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('tab-btn')) {
                const tabName = event.target.dataset.tab;
                this.switchTab(event.target.parentElement, tabName);
            }
        });
    }
    
    switchTab(tabContainer, tabName) {
        // Remove active class from all tabs and panels
        tabContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        tabContainer.parentElement.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        
        // Add active class to selected tab and panel
        tabContainer.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        tabContainer.parentElement.querySelector(`#${tabName}-tab`).classList.add('active');
    }
    
    showOverlay(overlayName) {
        const overlay = this.overlays[overlayName];
        if (overlay) {
            overlay.classList.remove('hidden');
            this.updateOverlayContent(overlayName);
        }
    }
    
    hideOverlay(overlayName) {
        const overlay = this.overlays[overlayName];
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
    
    updateOverlayContent(overlayName) {
        switch (overlayName) {
            case 'imperial-status':
                this.updateImperialStatus();
                break;
            case 'political':
                this.updatePoliticalContent();
                break;
            case 'cultural':
                this.updateCulturalContent();
                break;
            case 'citizen-rights':
                this.updateCitizenRights();
                break;
            case 'festival':
                this.updateFestivalContent();
                break;
        }
    }
    
    updateImperialStatus() {
        if (!this.politicalSystem) return;
        
        const status = this.politicalSystem.getEmpireStatus();
        
        // Update status bars
        document.getElementById('stability-bar').style.width = `${status.stability}%`;
        document.getElementById('democracy-bar').style.width = `${status.democracy}%`;
        document.getElementById('technology-bar').style.width = `${status.technology}%`;
        document.getElementById('prosperity-bar').style.width = `${status.prosperity}%`;
        
        // Update values
        document.getElementById('stability-value').textContent = `${Math.round(status.stability)}%`;
        document.getElementById('democracy-value').textContent = `${Math.round(status.democracy)}%`;
        document.getElementById('technology-value').textContent = `${Math.round(status.technology)}%`;
        document.getElementById('prosperity-value').textContent = `${Math.round(status.prosperity)}%`;
        
        // Update emperor info
        const emperor = this.politicalSystem.government.emperor;
        document.getElementById('emperor-name').textContent = emperor.name;
        document.getElementById('emperor-approval').textContent = `${Math.round(emperor.approval)}%`;
        
        const policiesList = document.getElementById('emperor-policies');
        policiesList.innerHTML = emperor.policies.map(policy => `<li>${policy}</li>`).join('');
    }
    
    updatePoliticalContent() {
        if (!this.politicalSystem) return;
        
        // Update government details
        const gov = this.politicalSystem.government;
        
        document.getElementById('emperor-details').innerHTML = `
            <strong>Name:</strong> ${gov.emperor.name}<br>
            <strong>Title:</strong> ${gov.emperor.title}<br>
            <strong>Elected:</strong> ${gov.emperor.elected}<br>
            <strong>Term:</strong> ${gov.emperor.term}<br>
            <strong>Approval:</strong> ${Math.round(gov.emperor.approval)}%
        `;
        
        document.getElementById('senate-details').innerHTML = `
            <strong>Members:</strong> ${gov.senate.members}<br>
            <strong>Representation:</strong> ${gov.senate.representation}<br>
            <strong>Session:</strong> ${gov.senate.currentSession}
        `;
        
        document.getElementById('judiciary-details').innerHTML = `
            <strong>Supreme Court:</strong> ${gov.judiciary.supremeCourt}<br>
            <strong>Legal System:</strong> ${gov.judiciary.legalSystem}
        `;
        
        document.getElementById('military-details').innerHTML = `
            <strong>Type:</strong> ${gov.military.type}<br>
            <strong>Control:</strong> ${gov.military.control}<br>
            <strong>Status:</strong> ${gov.military.currentStatus}
        `;
        
        // Update senate session
        const session = this.politicalSystem.simulateSenateSession();
        document.getElementById('senate-session').innerHTML = `
            <p><strong>Session:</strong> ${session.session}</p>
            <p><strong>Attendance:</strong> ${session.attendance}%</p>
            <p><strong>Quorum:</strong> ${session.quorum}</p>
            <h4>Current Bills:</h4>
            <ul>
                ${session.bills.map(bill => `
                    <li>
                        <strong>${bill.name}</strong> - ${bill.description}<br>
                        <small>Sponsor: ${bill.sponsor} | Support: ${bill.support}% | Status: ${bill.status}</small>
                    </li>
                `).join('')}
            </ul>
        `;
        
        // Update policies
        const policies = this.politicalSystem.getCurrentPolicies();
        document.getElementById('current-policies').innerHTML = policies.map(policy => `
            <div class="policy-item">
                <h4>${policy.name}</h4>
                <p>${policy.description}</p>
                <div class="policy-stats">
                    <span class="support">Support: ${policy.support}%</span>
                    <span class="category">${policy.category}</span>
                </div>
            </div>
        `).join('');
        
        // Update events
        const events = this.politicalSystem.getRecentEvents();
        document.getElementById('recent-events').innerHTML = events.map(event => `
            <div class="event-item">
                <h4>${event.title} (Year ${event.year})</h4>
                <p>${event.description}</p>
                <span class="event-category ${event.impact.toLowerCase()}">${event.category}</span>
            </div>
        `).join('');
    }
    
    updateCulturalContent() {
        if (!this.culturalSystem) return;
        
        // Update traditions
        const traditions = this.culturalSystem.getTraditions();
        document.getElementById('traditions-content').innerHTML = `
            <h4>Ceremonies:</h4>
            <ul>
                ${traditions.ceremonies.map(ceremony => `
                    <li>
                        <strong>${ceremony.name}</strong><br>
                        ${ceremony.description}<br>
                        <small>Timing: ${ceremony.timing}</small>
                    </li>
                `).join('')}
            </ul>
            <h4>Customs:</h4>
            <ul>
                ${traditions.customs.map(custom => `<li>${custom}</li>`).join('')}
            </ul>
        `;
        
        // Update arts
        const arts = this.culturalSystem.arts;
        document.getElementById('arts-content').innerHTML = `
            <h4>Visual Arts:</h4>
            <p><strong>Styles:</strong> ${arts.visual.styles.join(', ')}</p>
            <p><strong>Mediums:</strong> ${arts.visual.mediums.join(', ')}</p>
            
            <h4>Musical Arts:</h4>
            <p><strong>Styles:</strong> ${arts.musical.styles.join(', ')}</p>
            <p><strong>Instruments:</strong> ${arts.musical.instruments.join(', ')}</p>
            
            <h4>Literary Arts:</h4>
            <p><strong>Genres:</strong> ${arts.literary.genres.join(', ')}</p>
            <p><strong>Forms:</strong> ${arts.literary.forms.join(', ')}</p>
        `;
        
        // Update philosophy
        const philosophy = this.culturalSystem.getPhilosophy();
        document.getElementById('philosophy-content').innerHTML = `
            <h4>Philosophical Schools:</h4>
            ${philosophy.schools.map(school => `
                <div class="philosophy-school">
                    <h5>${school.name}</h5>
                    <p><strong>Principle:</strong> ${school.principle}</p>
                    <p><strong>Practices:</strong> ${school.practices.join(', ')}</p>
                </div>
            `).join('')}
            
            <h4>Core Principles:</h4>
            <ul>
                ${philosophy.principles.map(principle => `<li>${principle}</li>`).join('')}
            </ul>
        `;
        
        // Update language
        const language = this.culturalSystem.language;
        document.getElementById('language-content').innerHTML = `
            <h4>Language Information:</h4>
            <p><strong>Name:</strong> ${language.name}</p>
            <p><strong>Type:</strong> ${language.type}</p>
            <p><strong>Origin:</strong> ${language.origin}</p>
            
            <h4>Characteristics:</h4>
            <ul>
                ${language.characteristics.map(char => `<li>${char}</li>`).join('')}
            </ul>
            
            <h4>Grammar:</h4>
            <p><strong>Structure:</strong> ${language.grammar.structure}</p>
            <p><strong>Word Order:</strong> ${language.grammar.wordOrder}</p>
            <p><strong>Cases:</strong> ${language.grammar.cases}</p>
            <p><strong>Tenses:</strong> ${language.grammar.tenses}</p>
        `;
    }
    
    updateCitizenRights() {
        if (!this.politicalSystem) return;
        
        const rights = this.politicalSystem.getCitizenRights();
        
        document.getElementById('fundamental-rights').innerHTML = 
            rights.fundamental.map(right => `<li>${right}</li>`).join('');
        
        document.getElementById('political-rights').innerHTML = 
            rights.political.map(right => `<li>${right}</li>`).join('');
        
        document.getElementById('social-rights').innerHTML = 
            rights.social.map(right => `<li>${right}</li>`).join('');
    }
    
    updateFestivalContent() {
        if (!this.culturalSystem) return;
        
        const currentFestival = this.culturalSystem.getCurrentFestival();
        const festivals = this.culturalSystem.festivals;
        
        if (currentFestival) {
            document.getElementById('current-festival-info').innerHTML = `
                <h3>Current Festival: ${currentFestival.name}</h3>
                <p><strong>Gaulsais Name:</strong> ${currentFestival.gaulsaisName}</p>
                <p><strong>Description:</strong> ${currentFestival.description}</p>
                <p><strong>Cultural Significance:</strong> ${currentFestival.culturalSignificance}</p>
                <h4>Activities:</h4>
                <ul>
                    ${currentFestival.activities.map(activity => `<li>${activity}</li>`).join('')}
                </ul>
            `;
        } else {
            document.getElementById('current-festival-info').innerHTML = `
                <h3>No Festival Currently Active</h3>
                <p>Check the upcoming festivals below for the next celebration.</p>
            `;
        }
        
        document.getElementById('upcoming-festivals-list').innerHTML = festivals.map(festival => `
            <div class="festival-item">
                <h4>${festival.name}</h4>
                <p><strong>Gaulsais:</strong> ${festival.gaulsaisName}</p>
                <p><strong>Timing:</strong> ${festival.timing}</p>
                <p><strong>Duration:</strong> ${festival.duration} days</p>
                <p>${festival.description}</p>
            </div>
        `).join('');
    }
    
    update(deltaTime) {
        // Update any dynamic content
        if (this.currentView === 'imperial-status') {
            this.updateImperialStatus();
        }
    }
    
    showImperialMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `imperial-message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <span class="message-text">${message}</span>
                <button class="message-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    showImperialDecree() {
        if (!this.politicalSystem) return;
        
        const decree = this.politicalSystem.generateImperialDecree();
        this.showImperialMessage(`
            <strong>Imperial Decree</strong><br>
            ${decree.title}<br>
            ${decree.content}<br>
            <small>- ${decree.emperor}, Year ${decree.year} AE</small>
        `, 'decree');
    }
    
    showCulturalEvent() {
        if (!this.culturalSystem) return;
        
        const events = this.culturalSystem.getCulturalEvents();
        if (events.length > 0) {
            const event = events[events.length - 1];
            this.showImperialMessage(`
                <strong>Cultural Event</strong><br>
                ${event.name}<br>
                ${event.description}<br>
                <small>Type: ${event.type} | Frequency: ${event.frequency}</small>
            `, 'cultural');
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImperialUI;
}