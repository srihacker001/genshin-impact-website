// ============ ENHANCED JAVASCRIPT FOR GENSHIN WEBSITE ============
// Full interactivity, animations, and "alive" feel

// ============ PAGE NAVIGATION ============
function showPage(pageId, navEl) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    if (navEl) navEl.classList.add('active');

    window.scrollTo(0, 0);

    // Lazy render content
    if (pageId === 'characters') {
        renderChars(CHARS, 'allCharsGrid');
        initCharFilters();
    }
    if (pageId === 'weapons') {
        initWeaponFilters();
        renderWeapons();
    }
    if (pageId === 'elements') renderElements();
    if (pageId === 'regions') renderRegions();
    if (pageId === 'events') renderEvents();
    if (pageId === 'news') renderNews('newsGrid');
    if (pageId === 'gallery') renderGallery();
    if (pageId === 'map') renderMap();
    if (pageId === 'about') renderAbout();

    // Add animation
    addPageAnimation(target);
}

function addPageAnimation(el) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    }, 10);
}

// ============ NAV LOGO CLICK ============
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('click', () => {
            showPage('home', document.querySelector('[onclick*="showPage(\'home\'"]'));
        });
    }

    // Setup nav links
    setupNavLinks();

    // Setup hero buttons
    setupHeroButtons();

    // Setup search
    setupSearch();

    // Setup modals
    setupModals();

    // Setup character detail interactions
    setupCharacterCards();

    // Setup weapon interactions
    setupWeaponCards();

    // Add scroll effects
    setupScrollEffects();
});

// ============ NAV LINKS SETUP ============
function setupNavLinks() {
    const navLinks = {
        'home': 'home',
        'characters': 'characters',
        'weapons': 'weapons',
        'elements': 'elements',
        'regions': 'regions',
        'events': 'events',
        'news': 'news',
        'gallery': 'gallery',
        'map': 'map',
        'about': 'about'
    };

    Object.entries(navLinks).forEach(([link, page]) => {
        const element = document.querySelector(`[data-nav="${link}"]`) ||
            document.querySelector(`a[href="#${page}"], [onclick*="'${page}'"]`);
        if (element) {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                showPage(page, element);
                // Visual feedback
                element.style.animation = 'none';
                setTimeout(() => {
                    element.style.animation = '';
                }, 10);
            });
        }
    });
}

// ============ HERO BUTTONS ============
function setupHeroButtons() {
    const btnPrimary = document.querySelector('.btn-primary');
    const btnOutline = document.querySelector('.btn-outline');

    if (btnPrimary) {
        btnPrimary.addEventListener('click', () => {
            showPage('characters', document.querySelector('[data-nav="characters"]'));
            addButtonPulse(btnPrimary);
        });
    }

    if (btnOutline) {
        btnOutline.addEventListener('click', () => {
            showPage('about', document.querySelector('[data-nav="about"]'));
            addButtonPulse(btnOutline);
        });
    }
}

function addButtonPulse(btn) {
    btn.style.animation = 'none';
    setTimeout(() => {
        btn.style.animation = 'buttonPulse 0.6s ease-out';
    }, 10);

    // Add inline animation
    const style = document.createElement('style');
    style.textContent = `
    @keyframes buttonPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `;
    if (!document.querySelector('style[data-pulse]')) {
        style.setAttribute('data-pulse', 'true');
        document.head.appendChild(style);
    }
}

// ============ SEARCH FUNCTIONALITY ============
function setupSearch() {
    const searchInput = document.querySelector('.nav-search');
    if (!searchInput) return;

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const value = e.target.value.trim();

        searchTimeout = setTimeout(() => {
            if (value.length > 0) {
                handleSearch(value);
                showPage('characters');
            }
        }, 300);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch(e.target.value.trim());
            showPage('characters');
        }
    });
}

function handleSearch(val) {
    if (!val.trim()) {
        document.getElementById('searchResults')?.remove();
        return;
    }

    const results = CHARS.filter(c =>
        c.name.toLowerCase().includes(val.toLowerCase()) ||
        c.element.toLowerCase().includes(val.toLowerCase()) ||
        c.region.toLowerCase().includes(val.toLowerCase())
    );

    // Create or update search results
    let resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'searchResults';
        resultsContainer.className = 'section';
        const charPage = document.getElementById('characters');
        if (charPage) charPage.insertBefore(resultsContainer, charPage.firstChild);
    }

    const resultHTML = `
    <div class="section-header">
      <span class="section-label">Search</span>
      <h2 class="section-title">Results for "${val}"</h2>
      <div class="section-line"></div>
    </div>
    <div id="searchResultsGrid" class="chars-grid"></div>
  `;
    resultsContainer.innerHTML = resultHTML;
    renderChars(results, 'searchResultsGrid');
    setupCharacterCards();
}

// ============ CHARACTER CARDS ============
function setupCharacterCards() {
    const cards = document.querySelectorAll('.char-card');

    cards.forEach((card, index) => {
        // Remove old listeners
        card.onclick = null;

        // Click to show detail
        card.addEventListener('click', function () {
            const charName = this.getAttribute('data-char-name');
            const char = CHARS.find(c => c.name === charName);
            if (char) {
                showCharDetail(char);
                addCardClickAnimation(this);
            }
        });

        // Hover effects
        card.addEventListener('mouseenter', () => {
            card.style.filter = 'brightness(1.1) drop-shadow(0 0 20px rgba(200,169,110,0.4))';
        });

        card.addEventListener('mouseleave', () => {
            card.style.filter = 'brightness(1)';
        });

        // Staggered entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

function addCardClickAnimation(card) {
    card.style.animation = 'none';
    setTimeout(() => {
        card.style.animation = 'cardClick 0.4s ease-out';
    }, 10);
}

// ============ CHARACTER DETAIL MODAL ============
function showCharDetail(char) {
    let modal = document.getElementById('charDetailModal');

    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'charDetailModal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    }

    const rarity = '★'.repeat(char.rarity);
    const weaponEmoji = {
        'Sword': '⚔️',
        'Claymore': '🗡️',
        'Polearm': '✨',
        'Bow': '🏹',
        'Catalyst': '📖'
    }[char.weapon] || '⚔️';

    const elementColor = {
        'Pyro': '#FF6040',
        'Cryo': '#50C8FF',
        'Hydro': '#2878FF',
        'Electro': '#AA5AFF',
        'Anemo': '#50DCB4',
        'Geo': '#DCB432',
        'Dendro': '#50C850'
    }[char.element] || '#C8A96E';

    modal.innerHTML = `
    <div class="modal-content" style="border-color: ${elementColor}; box-shadow: 0 0 40px ${elementColor}40;">
      <button class="modal-close" onclick="closeCharDetail()">&times;</button>
      
      <div class="detail-artwork-section">
        <div class="detail-artwork" style="background: linear-gradient(135deg, ${elementColor}20, ${elementColor}05);">
          ${char.emoji}
        </div>
        <div class="detail-info">
          <div style="color: ${elementColor}; font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.5rem;">${char.element}</div>
          <h1 class="detail-name">${char.name}</h1>
          <div class="detail-rarity" style="color: ${elementColor};">${rarity}</div>
          <div class="detail-meta">
            <div><strong>Weapon:</strong> ${weaponEmoji} ${char.weapon}</div>
            <div><strong>Region:</strong> ${char.region}</div>
            <div><strong>Role:</strong> ${char.role || 'Support'}</div>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <h2 class="detail-subtitle">Talents</h2>
        <div class="talent-list">
          <div class="talent-item">
            <span class="talent-name">Normal Attack</span>
            <span class="talent-description">Perform up to ${Math.floor(Math.random() * 5 + 4)} consecutive strikes</span>
          </div>
          <div class="talent-item">
            <span class="talent-name">Elemental Skill</span>
            <span class="talent-description">Unleash ${char.element} power with precision</span>
          </div>
          <div class="talent-item">
            <span class="talent-name">Elemental Burst</span>
            <span class="talent-description">Ultimate ${char.element} technique for maximum impact</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <h2 class="detail-subtitle">Stats</h2>
        <div class="stat-grid-detail">
          <div class="stat-box">
            <span class="stat-label">HP</span>
            <span class="stat-value">${Math.floor(Math.random() * 1000 + 900)}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">ATK</span>
            <span class="stat-value">${Math.floor(Math.random() * 400 + 200)}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">DEF</span>
            <span class="stat-value">${Math.floor(Math.random() * 300 + 100)}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Crit Rate</span>
            <span class="stat-value">${(Math.random() * 40 + 20).toFixed(1)}%</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Crit DMG</span>
            <span class="stat-value">${(Math.random() * 80 + 80).toFixed(1)}%</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Element Mastery</span>
            <span class="stat-value">${Math.floor(Math.random() * 150 + 30)}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <h2 class="detail-subtitle">Constellation</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">
          ${char.name} possesses 6 Constellation levels. Each level enhances abilities and unlocks new effects. 
          Progress through Constellation levels to unlock powerful bonuses and additional talents.
        </p>
      </div>

      <div class="modal-actions">
        <button class="btn-primary-modal" onclick="closeCharDetail()">Close</button>
        <button class="btn-outline-modal" onclick="alert('Added ${char.name} to Wishlist!')">Add to Wishlist</button>
      </div>
    </div>
  `;

    modal.style.display = 'flex';
    modal.style.opacity = '0';
    modal.style.animation = 'modalFadeIn 0.4s ease forwards';

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCharDetail();
    });

    // Add styles if not exists
    if (!document.querySelector('style[data-modal-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-modal-styles', 'true');
        style.textContent = `
      .modal-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        z-index: 1000;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }

      .modal-content {
        background: linear-gradient(135deg, rgba(15, 20, 50, 0.95), rgba(10, 15, 46, 0.95));
        border: 1px solid rgba(200, 169, 110, 0.3);
        border-radius: 16px;
        max-width: 600px;
        width: 100%;
        padding: 2rem;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        animation: modalSlideIn 0.4s ease;
      }

      .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(200, 169, 110, 0.1);
        border: 1px solid rgba(200, 169, 110, 0.3);
        color: var(--gold);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .modal-close:hover {
        background: rgba(200, 169, 110, 0.2);
        transform: rotate(90deg);
      }

      .detail-artwork-section {
        display: flex;
        gap: 2rem;
        margin-bottom: 2rem;
        align-items: center;
      }

      .detail-artwork {
        width: 150px;
        height: 200px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        border: 1px solid rgba(200, 169, 110, 0.3);
        flex-shrink: 0;
      }

      .detail-info {
        flex: 1;
      }

      .detail-name {
        font-family: 'Cinzel', serif;
        font-size: 2rem;
        font-weight: 700;
        color: #fff;
        margin-bottom: 0.5rem;
      }

      .detail-rarity {
        font-size: 1.2rem;
        margin-bottom: 1rem;
        letter-spacing: 0.1em;
      }

      .detail-meta {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: var(--text-muted);
      }

      .detail-meta div {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .detail-section {
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid rgba(200, 169, 110, 0.1);
      }

      .detail-subtitle {
        font-family: 'Cinzel', serif;
        font-size: 1.2rem;
        color: var(--gold);
        margin-bottom: 1rem;
      }

      .talent-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .talent-item {
        background: rgba(200, 169, 110, 0.05);
        border-left: 3px solid var(--gold);
        padding: 1rem;
        border-radius: 6px;
      }

      .talent-name {
        display: block;
        color: var(--gold);
        font-weight: 600;
        margin-bottom: 0.3rem;
      }

      .talent-description {
        display: block;
        color: var(--text-muted);
        font-size: 0.85rem;
      }

      .stat-grid-detail {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 1rem;
      }

      .stat-box {
        background: rgba(200, 169, 110, 0.05);
        border: 1px solid rgba(200, 169, 110, 0.2);
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
      }

      .stat-label {
        display: block;
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        margin-bottom: 0.5rem;
      }

      .stat-value {
        display: block;
        font-size: 1.1rem;
        color: var(--gold);
        font-weight: 700;
      }

      .modal-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
      }

      .btn-primary-modal,
      .btn-outline-modal {
        flex: 1;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        font-family: 'Cinzel', serif;
        letter-spacing: 0.1em;
        transition: all 0.3s;
        text-transform: uppercase;
        font-size: 0.85rem;
      }

      .btn-primary-modal {
        background: linear-gradient(135deg, var(--gold), #A8883E);
        color: #0A0F2E;
      }

      .btn-primary-modal:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(200, 169, 110, 0.4);
      }

      .btn-outline-modal {
        background: transparent;
        border: 1px solid var(--gold);
        color: var(--gold);
      }

      .btn-outline-modal:hover {
        background: rgba(200, 169, 110, 0.1);
        transform: translateY(-2px);
      }

      @keyframes modalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes cardClick {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(0.98); }
      }
    `;
        document.head.appendChild(style);
    }
}

function closeCharDetail() {
    const modal = document.getElementById('charDetailModal');
    if (modal) {
        modal.style.animation = 'modalFadeOut 0.3s ease forwards';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// ============ CHARACTER FILTERS ============
function initCharFilters() {
    const cf = document.getElementById('charFilters');
    if (!cf) return;

    const elements = ['All', ...new Set(CHARS.map(c => c.element))];
    cf.innerHTML = elements.map(e =>
        `<button class="filter-btn ${e === 'All' ? 'active' : ''}" data-filter="${e}">${e === 'All' ? 'All' : e}</button>`
    ).join('');

    cf.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterChars(btn, btn.getAttribute('data-filter'));
        });
    });
}

function filterChars(btn, el) {
    document.querySelectorAll('#charFilters .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const data = el === 'All' ? CHARS : CHARS.filter(c => c.element === el);
    renderChars(data, 'allCharsGrid');
    setupCharacterCards();
}

// ============ WEAPON CARDS ============
function setupWeaponCards() {
    const weaponCards = document.querySelectorAll('.weapon-card');

    weaponCards.forEach((card, index) => {
        card.addEventListener('click', function () {
            const weaponName = this.getAttribute('data-weapon-name');
            showWeaponDetail(weaponName);
        });

        card.addEventListener('mouseenter', () => {
            card.style.filter = 'brightness(1.1) drop-shadow(0 0 20px rgba(200,169,110,0.4))';
        });

        card.addEventListener('mouseleave', () => {
            card.style.filter = 'brightness(1)';
        });

        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

function showWeaponDetail(weaponName) {
    alert(`Detailed info for ${weaponName}\n\nDamage: ${Math.floor(Math.random() * 400 + 200)}\nEffect: Increases ATK by ${Math.floor(Math.random() * 20 + 5)}%`);
}

// ============ SCROLL EFFECTS ============
function setupScrollEffects() {
    let lastScrollY = 0;
    const nav = document.querySelector('nav');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Nav hide/show on scroll
        if (nav) {
            if (scrollY > lastScrollY && scrollY > 100) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
            nav.style.transition = 'transform 0.3s ease';
        }

        lastScrollY = scrollY;

        // Parallax effect for hero
        const hero = document.querySelector('.hero');
        if (hero && scrollY < window.innerHeight) {
            hero.style.transform = `translateY(${scrollY * 0.5}px)`;
        }

        // Fade in sections on scroll
        document.querySelectorAll('.section').forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.75) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    });
}

// ============ MODALS ============
function setupModals() {
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCharDetail();
        }
    });
}

// ============ WEAPON FILTERS ============
function initWeaponFilters() {
    const wf = document.getElementById('weaponFilters');
    if (!wf) return;

    const types = ['All', 'Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst'];
    wf.innerHTML = types.map(t =>
        `<button class="filter-btn ${t === 'All' ? 'active' : ''}" data-weapon-type="${t}">${t}</button>`
    ).join('');

    wf.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterWeapons(btn, btn.getAttribute('data-weapon-type'));
        });
    });
}

function filterWeapons(btn, type) {
    document.querySelectorAll('#weaponFilters .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Update weapon grid based on type
    document.querySelectorAll('.weapon-card').forEach(card => {
        if (type === 'All' || card.getAttribute('data-weapon-type') === type) {
            card.style.display = 'block';
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease';
                card.style.opacity = '1';
            }, 10);
        } else {
            card.style.display = 'none';
        }
    });
}

// ============ ENHANCED RENDER FUNCTIONS ============
function renderChars(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data.map(c => `
    <div class="char-card" data-char-name="${c.name}">
      <div class="char-artwork" style="position:relative;background:linear-gradient(135deg,rgba(74,32,112,0.3),rgba(10,15,46,0.8))">
        <div style="font-size:5rem">${c.emoji}</div>
        <div class="char-rarity rarity-${c.rarity}"></div>
      </div>
      <div class="char-info">
        <div class="char-name">${c.name}</div>
        <div class="char-meta">
          <span class="element-badge elem-${c.element.toLowerCase()}">${c.element}</span>
          <span class="weapon-icon">${getWeaponIcon(c.weapon)}</span>
        </div>
        <div class="char-region">${c.region}</div>
        <div class="char-stats">
          <div class="stat-item">
            <span class="stat-label">★</span>
            <span class="stat-val">${c.rarity}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">ATK</span>
            <span class="stat-val">${Math.floor(Math.random() * 200 + 200)}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">DEF</span>
            <span class="stat-val">${Math.floor(Math.random() * 150 + 100)}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');

    setupCharacterCards();
}

function getWeaponIcon(weapon) {
    const icons = {
        'Sword': '⚔️',
        'Claymore': '🗡️',
        'Polearm': '✨',
        'Bow': '🏹',
        'Catalyst': '📖'
    };
    return icons[weapon] || '⚔️';
}

function renderWeapons() {
    const wg = document.getElementById('weaponsGrid');
    if (!wg) return;

    const weapons = [
        { name: 'Aquila Favonia', type: 'Sword', rarity: 5, atk: 674, effect: 'ATK +20%, RES +20%' },
        { name: 'Primordial Jade Cutter', type: 'Sword', rarity: 5, atk: 542, effect: 'HP +20%, DMG +20%' },
        { name: 'Skyward Blade', type: 'Sword', rarity: 5, atk: 608, effect: 'ATK +8%, SPD +10%' },
        { name: 'Skyward Pride', type: 'Claymore', rarity: 5, atk: 674, effect: 'ATK +8%, DEF +20%' },
        { name: 'The Unforged', type: 'Claymore', rarity: 5, atk: 608, effect: 'ATK +20%, Shield +30%' },
        { name: 'Vortex Vanquisher', type: 'Polearm', rarity: 5, atk: 608, effect: 'ATK +10%, DEF +4%' },
        { name: 'Skyward Spine', type: 'Polearm', rarity: 5, atk: 674, effect: 'ATK +8%, SPD +12%' },
        { name: 'Amos Bow', type: 'Bow', rarity: 5, atk: 608, effect: 'ATK +15%, DMG +10%' },
        { name: 'Skyward Harp', type: 'Bow', rarity: 5, atk: 674, effect: 'ATK +8%, Crit +20%' },
        { name: 'Lost Prayer to the Sacred Winds', type: 'Catalyst', rarity: 5, atk: 608, effect: 'Elem +10%, SPD +8%' },
        { name: 'Memory of Dust', type: 'Catalyst', rarity: 5, atk: 542, effect: 'ATK +16%, Shield +20%' }
    ];

    wg.innerHTML = weapons.map((w, i) => `
    <div class="weapon-card" data-weapon-name="${w.name}" data-weapon-type="${w.type}" style="animation-delay:${i * 50}ms">
      <div class="weapon-header">
        <div class="weapon-rarity">${'★'.repeat(w.rarity)}</div>
        <div class="weapon-type">${w.type}</div>
      </div>
      <div class="weapon-name">${w.name}</div>
      <div class="weapon-stats">
        <div class="weapon-stat">
          <span>ATK</span>
          <span>${w.atk}</span>
        </div>
        <div class="weapon-stat">
          <span>Secondary</span>
          <span>${(Math.random() * 40 + 40).toFixed(1)}%</span>
        </div>
      </div>
      <div class="weapon-effect">${w.effect}</div>
    </div>
  `).join('');

    setupWeaponCards();

    // Add styles for weapons grid if not exists
    if (!document.querySelector('style[data-weapon-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-weapon-styles', 'true');
        style.textContent = `
      #weaponsGrid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1.5rem;
      }

      .weapon-card {
        background: var(--card-bg);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        padding: 1.2rem;
        cursor: pointer;
        transition: all 0.3s;
        animation: cardEnter 0.5s ease forwards;
        opacity: 0;
      }

      @keyframes cardEnter {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .weapon-card:hover {
        transform: translateY(-8px);
        border-color: var(--gold);
        box-shadow: 0 16px 48px rgba(200,169,110,0.2);
      }

      .weapon-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.8rem;
      }

      .weapon-rarity {
        color: var(--gold);
        font-size: 1rem;
      }

      .weapon-type {
        font-size: 0.7rem;
        background: rgba(200,169,110,0.1);
        color: var(--gold);
        padding: 0.2rem 0.6rem;
        border-radius: 12px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .weapon-name {
        font-family: 'Cinzel', serif;
        font-size: 0.95rem;
        font-weight: 600;
        color: #fff;
        margin-bottom: 0.8rem;
      }

      .weapon-stats {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 0.8rem;
        padding-bottom: 0.8rem;
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }

      .weapon-stat {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
      }

      .weapon-stat span:first-child {
        color: var(--text-muted);
      }

      .weapon-stat span:last-child {
        color: var(--gold);
        font-weight: 600;
      }

      .weapon-effect {
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.4;
        font-style: italic;
      }
    `;
        document.head.appendChild(style);
    }
}

function renderElements() {
    const eg = document.getElementById('elementsGrid');
    if (!eg) return;

    const elements = [
        { name: 'Pyro', emoji: '🔥', color: '#FF6040', desc: 'The element of fire and passion' },
        { name: 'Cryo', emoji: '❄️', color: '#50C8FF', desc: 'The element of ice and chill' },
        { name: 'Hydro', emoji: '💧', color: '#2878FF', desc: 'The element of water and fluidity' },
        { name: 'Electro', emoji: '⚡', color: '#AA5AFF', desc: 'The element of lightning and energy' },
        { name: 'Anemo', emoji: '💨', color: '#50DCB4', desc: 'The element of wind and freedom' },
        { name: 'Geo', emoji: '🪨', color: '#DCBA32', desc: 'The element of earth and strength' },
        { name: 'Dendro', emoji: '🌿', color: '#50C850', desc: 'The element of nature and growth' }
    ];

    eg.innerHTML = elements.map((e, i) => `
    <div class="element-card" style="border-color:${e.color};--elem-color:${e.color};animation-delay:${i * 50}ms">
      <div class="element-emoji">${e.emoji}</div>
      <div class="element-name">${e.name}</div>
      <div class="element-desc">${e.desc}</div>
      <div class="element-reactions">
        <span class="reaction-tag">Reactions Available</span>
      </div>
    </div>
  `).join('');

    // Add styles
    if (!document.querySelector('style[data-element-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-element-styles', 'true');
        style.textContent = `
      #elementsGrid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
      }

      .element-card {
        background: var(--card-bg);
        border: 2px solid;
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
        animation: cardEnter 0.5s ease forwards;
        opacity: 0;
        position: relative;
        overflow: hidden;
      }

      .element-card::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, var(--elem-color) 0%, transparent 70%);
        opacity: 0.1;
        animation: rotate 20s linear infinite;
        pointer-events: none;
      }

      @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .element-card:hover {
        transform: translateY(-8px);
        border-color: var(--elem-color);
        box-shadow: 0 0 30px var(--elem-color)40;
      }

      .element-emoji {
        font-size: 3rem;
        margin-bottom: 0.5rem;
        position: relative;
        z-index: 1;
      }

      .element-name {
        font-family: 'Cinzel', serif;
        font-size: 1.2rem;
        color: #fff;
        margin-bottom: 0.5rem;
        position: relative;
        z-index: 1;
      }

      .element-desc {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-bottom: 1rem;
        position: relative;
        z-index: 1;
      }

      .element-reactions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        justify-content: center;
        position: relative;
        z-index: 1;
      }

      .reaction-tag {
        font-size: 0.7rem;
        background: rgba(200,169,110,0.1);
        color: var(--text-muted);
        padding: 0.3rem 0.6rem;
        border-radius: 12px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    `;
        document.head.appendChild(style);
    }
}

function renderRegions() {
    const rg = document.getElementById('regionsGrid');
    if (!rg) return;

    const regions = [
        { name: 'Mondstadt', emoji: '🏰', desc: 'The City of Freedom', chars: 8 },
        { name: 'Liyue', emoji: '🏯', desc: 'The Harbor of Stone', chars: 12 },
        { name: 'Inazuma', emoji: '⛩️', desc: 'The Land of Thunder', chars: 10 },
        { name: 'Sumeru', emoji: '🌴', desc: 'The Land of Dendro', chars: 9 },
        { name: 'Fontaine', emoji: '🌊', desc: 'Land of Hydro', chars: 7 },
        { name: 'Natlan', emoji: '🔥', desc: 'Land of Fire', chars: 5 }
    ];

    rg.innerHTML = regions.map((r, i) => `
    <div class="region-card" style="animation-delay:${i * 50}ms">
      <div class="region-emoji">${r.emoji}</div>
      <div class="region-name">${r.name}</div>
      <div class="region-desc">${r.desc}</div>
      <div class="region-stats">
        <span>Characters: ${r.chars}</span>
      </div>
    </div>
  `).join('');

    // Add styles
    if (!document.querySelector('style[data-region-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-region-styles', 'true');
        style.textContent = `
      #regionsGrid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
      }

      .region-card {
        background: var(--card-bg);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
        animation: cardEnter 0.5s ease forwards;
        opacity: 0;
      }

      .region-card:hover {
        transform: translateY(-8px);
        border-color: var(--gold);
        box-shadow: 0 16px 48px rgba(200,169,110,0.2);
      }

      .region-emoji {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
      }

      .region-name {
        font-family: 'Cinzel', serif;
        font-size: 1.1rem;
        color: #fff;
        margin-bottom: 0.3rem;
      }

      .region-desc {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-bottom: 0.8rem;
      }

      .region-stats {
        font-size: 0.8rem;
        color: var(--gold);
        font-weight: 600;
      }
    `;
        document.head.appendChild(style);
    }
}

function renderEvents() {
    const eg = document.getElementById('eventsGrid');
    if (!eg) return;

    const events = [
        { title: 'Spiral Abyss', desc: 'Challenge yourself in endless battles', status: 'Active', date: 'Ongoing' },
        { title: 'Domains', desc: 'Collect ascension materials and artifacts', status: 'Active', date: 'Daily' },
        { title: 'Ley Line Outcrops', desc: 'Gather experience and mora', status: 'Active', date: 'Daily' },
        { title: 'Domains of Blessing', desc: 'Weekly material dungeon', status: 'Weekly', date: 'Monday' },
        { title: 'World Bosses', desc: 'Defeat powerful enemies', status: 'Active', date: 'Daily' },
        { title: 'Artifact Farming', desc: 'Collect rare artifacts', status: 'Active', date: 'Daily' }
    ];

    eg.innerHTML = events.map((e, i) => `
    <div class="event-card" style="animation-delay:${i * 50}ms">
      <div class="event-status ${e.status.toLowerCase()}">${e.status}</div>
      <div class="event-title">${e.title}</div>
      <div class="event-desc">${e.desc}</div>
      <div class="event-date">📅 ${e.date}</div>
    </div>
  `).join('');

    // Add styles
    if (!document.querySelector('style[data-event-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-event-styles', 'true');
        style.textContent = `
      #eventsGrid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .event-card {
        background: var(--card-bg);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        padding: 1.5rem;
        cursor: pointer;
        transition: all 0.3s;
        animation: cardEnter 0.5s ease forwards;
        opacity: 0;
        position: relative;
      }

      .event-card:hover {
        transform: translateY(-8px);
        border-color: var(--gold);
        box-shadow: 0 16px 48px rgba(200,169,110,0.2);
      }

      .event-status {
        display: inline-block;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        margin-bottom: 0.8rem;
      }

      .event-status.active {
        background: rgba(80, 200, 80, 0.2);
        color: #80E080;
      }

      .event-status.weekly {
        background: rgba(200, 169, 110, 0.2);
        color: var(--gold);
      }

      .event-title {
        font-family: 'Cinzel', serif;
        font-size: 1rem;
        color: #fff;
        margin-bottom: 0.5rem;
      }

      .event-desc {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-bottom: 0.8rem;
        line-height: 1.4;
      }

      .event-date {
        font-size: 0.8rem;
        color: var(--text-muted);
      }
    `;
        document.head.appendChild(style);
    }
}

function renderNews(containerId, limit = 999) {
    const ng = document.getElementById(containerId);
    if (!ng) return;

    const news = [
        { title: 'Version 4.0 Released', desc: 'New region and characters available', date: 'Today' },
        { title: 'New 5-Star Character', desc: 'Meet the new dendro catalyst user', date: 'Yesterday' },
        { title: 'Spiral Abyss Reset', desc: 'New blessing and chambers updated', date: '2 days ago' },
        { title: 'Artifact Farm Event', desc: 'Double rewards this week only', date: '3 days ago' },
        { title: 'Maintenance Notice', desc: 'Server will be down for 5 hours', date: 'Tomorrow' },
        { title: 'Anniversary Celebration', desc: 'Free wishes and primogems', date: 'Next week' }
    ];

    ng.innerHTML = news.slice(0, limit).map((n, i) => `
    <div class="news-card" style="animation-delay:${i * 50}ms">
      <div class="news-title">${n.title}</div>
      <div class="news-desc">${n.desc}</div>
      <div class="news-meta">
        <span class="news-date">📅 ${n.date}</span>
        <button class="news-btn" onclick="alert('Read more about: ${n.title}')">Read More →</button>
      </div>
    </div>
  `).join('');

    // Add styles
    if (!document.querySelector('style[data-news-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-news-styles', 'true');
        style.textContent = `
      #homeNewsGrid, #newsGrid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
      }

      .news-card {
        background: var(--card-bg);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        padding: 1.5rem;
        cursor: pointer;
        transition: all 0.3s;
        animation: cardEnter 0.5s ease forwards;
        opacity: 0;
      }

      .news-card:hover {
        transform: translateY(-8px);
        border-color: var(--gold);
        box-shadow: 0 16px 48px rgba(200,169,110,0.2);
      }

      .news-title {
        font-family: 'Cinzel', serif;
        font-size: 1rem;
        color: #fff;
        margin-bottom: 0.5rem;
      }

      .news-desc {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-bottom: 1rem;
        line-height: 1.5;
      }

      .news-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.8rem;
      }

      .news-date {
        color: var(--text-muted);
      }

      .news-btn {
        background: transparent;
        border: none;
        color: var(--gold);
        cursor: pointer;
        font-size: 0.8rem;
        font-weight: 600;
        transition: all 0.2s;
      }

      .news-btn:hover {
        color: #F0D080;
        transform: translateX(3px);
      }
    `;
        document.head.appendChild(style);
    }
}

function renderGallery() {
    const gg = document.getElementById('galleryGrid');
    if (!gg) return;

    const gallery = Array(12).fill(null).map((_, i) => ({
        emoji: ['🎨', '🖼️', '🌅', '⛰️', '🏛️', '🌳', '💎', '⚡', '❄️', '🔥', '💧', '🌿'][i % 12],
        title: ['Landscape', 'Portrait', 'Sunset', 'Mountains', 'Architecture', 'Nature', 'Details', 'Elements', 'Cryo', 'Pyro', 'Hydro', 'Dendro'][i % 12]
    }));

    gg.innerHTML = gallery.map((g, i) => `
    <div class="gallery-item" style="animation-delay:${i * 50}ms">
      <div class="gallery-image">${g.emoji}</div>
      <div class="gallery-title">${g.title}</div>
    </div>
  `).join('');

    // Add styles
    if (!document.querySelector('style[data-gallery-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-gallery-styles', 'true');
        style.textContent = `
      #galleryGrid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
      }

      .gallery-item {
        background: var(--card-bg);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s;
        animation: cardEnter 0.5s ease forwards;
        opacity: 0;
      }

      .gallery-item:hover {
        transform: translateY(-8px);
        border-color: var(--gold);
        box-shadow: 0 16px 48px rgba(200,169,110,0.2);
      }

      .gallery-image {
        width: 100%;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        background: linear-gradient(135deg, rgba(74,32,112,0.3), rgba(10,15,46,0.8));
        transition: all 0.3s;
      }

      .gallery-item:hover .gallery-image {
        transform: scale(1.1);
      }

      .gallery-title {
        padding: 1rem;
        text-align: center;
        font-family: 'Cinzel', serif;
        font-size: 0.95rem;
        color: #fff;
      }
    `;
        document.head.appendChild(style);
    }
}

function renderMap() {
    const mg = document.getElementById('mapContainer');
    if (!mg) return;

    mg.innerHTML = `
    <svg viewBox="0 0 1000 800" style="width:100%;border:1px solid var(--glass-border);border-radius:12px;background:linear-gradient(135deg, rgba(15,20,50,0.8), rgba(10,15,46,0.9))">
      <defs>
        <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4A2070;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#0A0F2E;stop-opacity:0.8" />
        </linearGradient>
      </defs>
      <rect width="1000" height="800" fill="url(#mapGradient)" />
      <text x="500" y="400" text-anchor="middle" font-size="40" fill="var(--text-muted)" opacity="0.5">🗺️ Interactive Map</text>
      <circle cx="200" cy="200" r="15" fill="#80F0D0" opacity="0.8" />
      <text x="200" y="240" text-anchor="middle" fill="var(--text-muted)" font-size="12">Mondstadt</text>
      <circle cx="500" cy="300" r="15" fill="#C8A96E" opacity="0.8" />
      <text x="500" y="340" text-anchor="middle" fill="var(--text-muted)" font-size="12">Liyue</text>
      <circle cx="750" cy="250" r="15" fill="#D090FF" opacity="0.8" />
      <text x="750" y="290" text-anchor="middle" fill="var(--text-muted)" font-size="12">Inazuma</text>
      <circle cx="400" cy="600" r="15" fill="#80E080" opacity="0.8" />
      <text x="400" y="640" text-anchor="middle" fill="var(--text-muted)" font-size="12">Sumeru</text>
    </svg>
  `;

    const mg2 = document.getElementById('mapFilters');
    if (mg2) {
        mg2.innerHTML = `
      <button class="map-filter-btn active" onclick="alert('Showing all locations')">All</button>
      <button class="map-filter-btn" onclick="alert('Filtering cities')">Cities</button>
      <button class="map-filter-btn" onclick="alert('Filtering bosses')">Bosses</button>
      <button class="map-filter-btn" onclick="alert('Filtering domains')">Domains</button>
    `;
    }
}

function renderAbout() {
    const ag = document.getElementById('aboutGrid');
    if (!ag) return;

    const about = [
        { icon: '🎮', title: 'Open World', text: 'Explore a vast and beautiful world' },
        { icon: '👥', title: 'Characters', text: 'Collect and play with unique characters' },
        { icon: '⚔️', title: 'Combat', text: 'Fast-paced action combat system' },
        { icon: '🌍', title: 'Regions', text: 'Discover multiple regions and regions' },
        { icon: '🎪', title: 'Events', text: 'Participate in exciting events' },
        { icon: '🏆', title: 'Challenges', text: 'Test your skills in various challenges' }
    ];

    ag.innerHTML = about.map((a, i) => `
    <div class="about-card" style="animation-delay:${i * 50}ms">
      <div class="about-card-icon">${a.icon}</div>
      <div class="about-card-title">${a.title}</div>
      <div class="about-card-text">${a.text}</div>
    </div>
  `).join('');

    // Add styles
    if (!document.querySelector('style[data-about-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-about-styles', 'true');
        style.textContent = `
      #aboutGrid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
      }

      .about-card {
        background: var(--card-bg);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
        animation: cardEnter 0.5s ease forwards;
        opacity: 0;
      }

      .about-card:hover {
        transform: translateY(-8px);
        border-color: var(--gold);
        box-shadow: 0 16px 48px rgba(200,169,110,0.2);
      }

      .about-card-icon {
        font-size: 2.5rem;
        margin-bottom: 0.8rem;
      }

      .about-card-title {
        font-family: 'Cinzel', serif;
        font-size: 1rem;
        color: #fff;
        margin-bottom: 0.5rem;
      }

      .about-card-text {
        font-size: 0.85rem;
        color: var(--text-muted);
        line-height: 1.5;
      }
    `;
        document.head.appendChild(style);
    }
}

function renderBanners() {
    const bg = document.getElementById('bannerGrid');
    if (!bg) return;

    const banners = [
        { title: '5-Star Character', desc: '🌟 Limited Time', char: '👸' },
        { title: 'Weapon Banner', desc: '⚔️ Limited Time', char: '🗡️' },
        { title: 'Standard Banner', desc: '⭐ Always Available', char: '📜' }
    ];

    bg.innerHTML = banners.map((b, i) => `
    <div class="banner-card" style="animation-delay:${i * 50}ms">
      <div class="banner-emoji">${b.char}</div>
      <div class="banner-title">${b.title}</div>
      <div class="banner-desc">${b.desc}</div>
      <button class="banner-btn" onclick="alert('Wish for ${b.title}')">Wish</button>
    </div>
  `).join('');

    // Add styles
    if (!document.querySelector('style[data-banner-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-banner-styles', 'true');
        style.textContent = `
      #bannerGrid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
      }

      .banner-card {
        background: linear-gradient(135deg, rgba(74,32,112,0.4), rgba(10,15,46,0.9));
        border: 2px solid var(--glass-border);
        border-radius: 12px;
        padding: 2rem 1.5rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
        animation: cardEnter 0.5s ease forwards;
        opacity: 0;
        position: relative;
        overflow: hidden;
      }

      .banner-card::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, #7B44B8 0%, transparent 70%);
        opacity: 0;
        animation: shimmer 3s infinite;
        pointer-events: none;
      }

      @keyframes shimmer {
        0%, 100% { opacity: 0; }
        50% { opacity: 0.1; }
      }

      .banner-card:hover {
        transform: translateY(-8px);
        border-color: var(--gold);
        box-shadow: 0 16px 48px rgba(200,169,110,0.3);
      }

      .banner-emoji {
        font-size: 3.5rem;
        margin-bottom: 1rem;
        position: relative;
        z-index: 1;
      }

      .banner-title {
        font-family: 'Cinzel', serif;
        font-size: 1.2rem;
        color: #fff;
        margin-bottom: 0.5rem;
        position: relative;
        z-index: 1;
      }

      .banner-desc {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-bottom: 1.2rem;
        position: relative;
        z-index: 1;
      }

      .banner-btn {
        background: linear-gradient(135deg, var(--gold), #A8883E);
        border: none;
        border-radius: 6px;
        color: #0A0F2E;
        font-family: 'Cinzel', serif;
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        padding: 0.6rem 1.8rem;
        cursor: pointer;
        transition: all 0.2s;
        text-transform: uppercase;
        position: relative;
        z-index: 1;
      }

      .banner-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(200,169,110,0.4);
      }
    `;
        document.head.appendChild(style);
    }
}

function createStars() {
    const container = document.getElementById('bgStars');
    if (!container) return;
    for (let i = 0; i < 120; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 2 + 0.5;
        star.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;--dur:${2 + Math.random() * 4}s;animation-delay:${Math.random() * 4}s`;
        container.appendChild(star);
    }
}

function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `left:${Math.random() * 100}%;bottom:${Math.random() * 40}%;--dur:${4 + Math.random() * 6}s;--dx:${(Math.random() - 0.5) * 80}px;animation-delay:${Math.random() * 6}s;width:${Math.random() < 0.3 ? 3 : 1.5}px;height:${Math.random() < 0.3 ? 3 : 1.5}px`;
        container.appendChild(p);
    }
}

// ============ MOUSE GLOW EFFECT ============
document.addEventListener('mousemove', e => {
    const g = document.getElementById('cursorGlow');
    if (g) {
        g.style.left = e.clientX + 'px';
        g.style.top = e.clientY + 'px';
    }
});

// ============ INITIALIZATION ============
window.addEventListener('DOMContentLoaded', () => {
    createStars();
    createParticles();
    renderBanners();
    renderChars(CHARS.slice(0, 8), 'featuredCharsGrid');
    renderNews('homeNewsGrid', 3);
    renderAbout();

    // Add fade-in effect to sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
    });
});

// ============ EXTRA: Smooth scroll for nav links ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
