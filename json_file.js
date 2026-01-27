


/**
 * CONFIGURATION & STATE
 */
const languageImages = {
    JavaScript: "images/js.png",
    Python: "images/python.png",
    HTML: "images/html.png",
    CSS: "images/css.png",
    Java: "images/java.png",
    Php: "images/php.png",
    Mysql: "images/mysql.png"
};

// Site-wide translations (UI elements)
const uiTranslations = {
    es: {

        proyectos: "Proyectos",
        contacto: "Contacto",
        langLabel: "Idiomas:",
        btnWeb: "Sitio Web",
        btnRepo: "Repositorio"
    },
    en: {

        proyectos: "Projects",
        contacto: "Contact",
        langLabel: "Languages:",
        btnWeb: "Website",
        btnRepo: "Repository"
    },
    ua: {
        proyectos: "Проєкти",
        contacto: "Контакти",
        langLabel: "Мови:",
        btnWeb: "Вебсайт",
        btnRepo: "Репозиторій"
    }
};

let projectData = []; // Will hold data from data.json
let currentLang = localStorage.getItem('idioma') || 'es';
let currentFilter = null;

/**
 * INITIALIZATION
 */
async function init() {
    try {
        const response = await fetch('data.json');
        projectData = await response.json();
        
        setupLanguageSelector();
        createFilterButtons();
        updateUI(); // Initial render
    } catch (err) {
        console.error("Error loading project data:", err);
    }
}

/**
 * UI & LANGUAGE LOGIC
 */
function updateUI() {
    // 1. Update Navigation Links
    document.querySelectorAll('nav a').forEach(link => {
        const key = link.getAttribute('data-key');
        if (uiTranslations[currentLang][key]) {
            link.textContent = uiTranslations[currentLang][key];
        }
    });

    // 2. Render Projects
    displayProjects(currentFilter);
}

function setupLanguageSelector() {
    const selector = document.getElementById('lang-selector');
    selector.value = currentLang;
    selector.addEventListener('change', (e) => {
        currentLang = e.target.value;
        localStorage.setItem('idioma', currentLang);
        updateUI();
    });
}

/**
 * FILTER LOGIC
 */
function createFilterButtons() {
    const langFilterContainer = document.getElementById('langFilter');
    const uniqueLanguages = new Set();

    projectData.forEach(item => {
        const langs = Array.isArray(item.language) ? item.language : [item.language];
        langs.forEach(l => { if (l) uniqueLanguages.add(l); });
    });

    uniqueLanguages.forEach(lang => {
        const img = document.createElement('img');
        img.src = languageImages[lang] || 'images/default.png';
        img.title = lang;
        img.className = 'filter-icon';

        img.onclick = () => {
            const isSame = currentFilter === lang;
            document.querySelectorAll('#langFilter img').forEach(i => i.classList.remove('selected'));
            
            if (isSame) {
                currentFilter = null;
            } else {
                currentFilter = lang;
                img.classList.add('selected');
            }
            displayProjects(currentFilter);
        };
        langFilterContainer.appendChild(img);
    });
}

/**
 * PORTFOLIO RENDERER
 */
function displayProjects(filterLang) {
    const grid = document.getElementById('portfolioGrid');
    grid.innerHTML = '';

    const filtered = filterLang 
        ? projectData.filter(item => {
            const itemLangs = Array.isArray(item.language) ? item.language : [item.language];
            return itemLangs.includes(filterLang);
          })
        : projectData;

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        // Get localized text or fallback
        const titleText = (typeof item.title === 'object') ? item.title[currentLang] : item.title;
        const descText = (typeof item.description === 'object') ? item.description[currentLang] : item.description;

        // Media Logic
        const images = Array.isArray(item.image) ? item.image : (item.image ? [item.image] : []);
        const videos = Array.isArray(item.video) ? item.video : (item.video ? [item.video] : []);
        const media = [
            ...images.map(src => `<img src="${src}" class="carousel-slide" alt="">`),
            ...videos.map(src => `<video src="${src}" class="carousel-slide" controls muted loop></video>`)
        ];

        let mediaHTML = "";
        if (media.length > 1) {
            mediaHTML = `
                <div class="carousel-container">
                    <div class="carousel-track">${media.join('')}</div>
                    <button class="carousel-btn prev-btn">❮</button>
                    <button class="carousel-btn next-btn">❯</button>
                </div>`;
        } else if (media.length === 1) {
            mediaHTML = media[0].replace('carousel-slide', 'thumb');
        }

        // Language Icons Logic
        const itemLangs = Array.isArray(item.language) ? item.language : [item.language];
        const iconsHTML = itemLangs.map(l => {
            const src = languageImages[l] || 'images/default.png';
            return `<img src="${src}" title="${l}" class="lang-icon">`;
        }).join('');

        card.innerHTML = `
            <div class="title">${titleText}</div>
            ${mediaHTML}
            <div class="desc">${descText}</div>
            <div class="desc">${uiTranslations[currentLang].langLabel} ${iconsHTML}</div>
            <div class="desc buttons">
                ${item.githublinkwebsite ? `<a href="${item.githublinkwebsite}" target="_blank" class="button-link">${uiTranslations[currentLang].btnWeb}</a>` : ''}
                ${item.githublinkrepo ? `<a href="${item.githublinkrepo}" target="_blank" class="button-link">${uiTranslations[currentLang].btnRepo}</a>` : ''}
            </div>
        `;

        grid.appendChild(card);
    });

    initializeCarousels();
}

/**
 * CAROUSEL ENGINE
 */
function initializeCarousels() {
    document.querySelectorAll('.carousel-container').forEach(container => {
        const track = container.querySelector('.carousel-track');
        const slides = Array.from(container.querySelectorAll('.carousel-slide'));
        const nextBtn = container.querySelector('.next-btn');
        const prevBtn = container.querySelector('.prev-btn');
        let index = 0;

        if (slides.length > 0) slides[0].classList.add('active');

        const update = () => {
            const width = container.clientWidth;
            track.style.transform = `translateX(-${index * width}px)`;
            slides.forEach((s, i) => s.classList.toggle('active', i === index));
        };

        nextBtn.onclick = () => { index = (index + 1) % slides.length; update(); };
        prevBtn.onclick = () => { index = (index - 1 + slides.length) % slides.length; update(); };

        new ResizeObserver(update).observe(container);
    });
}

// Start everything
init();