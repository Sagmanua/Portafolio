// =======================
// LANGUAGE ICONS
// =======================
const languageImages = {
    JavaScript: "images/js.png",
    Python: "images/python.png",
    HTML: "images/html.png",
    CSS: "images/css.png",
    Java: "images/java.png",
    Php: "images/php.png",
    Mysql: "images/mysql.png",
    SQLite: "images/SQLite.png"
};

let projectData = [];
let currentLang = localStorage.getItem('idioma') || 'es';
let currentFilter = null;


// =======================
// UI TEXT TRANSLATIONS
// =======================
const uiText = {
    en: {
        watchDemo: "Watch Demo",
        viewDetails: "View Details",
        website: "Website",
        github: "GitHub",
        videoLabel: "▶ Video Demo",
        all: "All"
    },
    es: {
        watchDemo: "Ver Demo",
        viewDetails: "Ver Detalles",
        website: "Sitio Web",
        github: "GitHub",
        videoLabel: "▶ Video",
        all: "Todos"
    },
    ua: {
        watchDemo: "Дивитися демо",
        viewDetails: "Детальніше",
        website: "Сайт",
        github: "GitHub",
        videoLabel: "▶ Відео",
        all: "Всі"
    }
};


// =======================
// INTERSECTION OBSERVER
// =======================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('reveal');
    });
}, { threshold: 0.1 });


// =======================
// GLOBAL VIDEO MODAL
// =======================
document.addEventListener("click", (e) => {
    const modal = document.getElementById("videoModal");
    const video = document.getElementById("modalVideo");
    if (!modal || !video) return;

    if (e.target.classList.contains("demo")) {
        video.src = e.target.dataset.video;
        modal.style.display = "flex";
        video.play().catch(()=>{});
    }

    if (e.target.classList.contains("close-modal") || e.target === modal) {
        modal.style.display = "none";
        video.pause();
        video.currentTime = 0;
        video.src = "";
    }
});


// =======================
// INIT
// =======================
async function init() {
    try {
        const response = await fetch('data.json');
        projectData = await response.json();

        renderFilters();
        renderProjects();
        setupLanguageSelector();

    } catch (err) {
        console.error("Data fetch error:", err);
    }
}


// =======================
// FILTERS
// =======================
function renderFilters() {

    const container = document.getElementById('langFilter');
    if (!container) return;

    container.innerHTML = '';

    const t = uiText[currentLang] || uiText.en;

    // ===== ALL BUTTON =====
    const allItem = document.createElement('div');
    allItem.className = 'filter-item all-filter';
    if (currentFilter === null) allItem.classList.add('active');

    allItem.addEventListener('click', () => {
        currentFilter = null;
        renderProjects();
        renderFilters();
    });

    const allText = document.createElement('span');
    allText.textContent = t.all;
    allItem.appendChild(allText);
    container.appendChild(allItem);

    // ===== LANGUAGE FILTERS =====
    const langs = [...new Set(projectData.flatMap(p =>
        Array.isArray(p.language) ? p.language : [p.language]
    ))].filter(l => l && l.trim() !== "");

    langs.forEach(lang => {

        const item = document.createElement('div');
        item.className = 'filter-item';
        if (lang === currentFilter) item.classList.add('active');

        item.addEventListener('click', () => {
            currentFilter = lang;
            renderProjects(lang);
            renderFilters();
        });

        const img = document.createElement('img');
        img.src = languageImages[lang] || 'images/default.png';
        img.className = 'filter-icon';
        img.alt = lang;

        const span = document.createElement('span');
        span.textContent = lang;

        item.appendChild(img);
        item.appendChild(span);
        container.appendChild(item);
    });
}


// =======================
// PROJECT RENDER
// =======================
function renderProjects(filter = currentFilter) {

    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;

    grid.innerHTML = '';

    const filtered = filter
        ? projectData.filter(p =>
            (Array.isArray(p.language) ? p.language : [p.language]).includes(filter)
        )
        : projectData;


    filtered.forEach((item, index) => {

        const card = document.createElement('div');
        card.className = 'card';

        const t = uiText[currentLang] || uiText.en;

        const title = item.title?.[currentLang] || item.title?.en || "No title";
        const desc = item.description?.[currentLang] || item.description?.en || "";

        // SAFE VIDEO SOURCE
        const videoSrc = item.video
            ? (Array.isArray(item.video) ? item.video[0] : item.video)
            : null;

        // =======================
        // MEDIA
        // =======================
        let mediaHTML = '';

        if (item.image) {
            const imgSrc = Array.isArray(item.image) ? item.image[0] : item.image;
            mediaHTML = `<img src="${imgSrc}" class="thumb" onerror="this.src='images/default.png'">`;
        }
        else if (videoSrc) {
            mediaHTML = `
                <video class="thumb video-thumb" muted playsinline loop preload="metadata">
                    <source src="${videoSrc}" type="video/mp4">
                </video>
            `;
        }
        else {
            mediaHTML = `<img src="images/default.png" class="thumb">`;
        }

        // =======================
        // LANGUAGE BADGES
        // =======================
        let langsHTML = '';
if (item.language && item.language.length > 0) {
    const langs = Array.isArray(item.language) ? item.language : [item.language];
    
    langsHTML = langs.map(lang => {
        // Get the icon path from your languageImages object
        const iconPath = languageImages[lang] || 'images/default.png';
        return `
            <div class="lang-badge">
                <img src="${iconPath}" alt="${lang}" class="badge-icon">
                <span>${lang}</span>
            </div>`;
    }).join('');
}

        // =======================
        // BUTTONS
        // =======================
        const repoBtn = item.githublinkrepo
            ? `<a href="${item.githublinkrepo}" target="_blank" class="card-btn repo">${t.github}</a>`
            : "";

        const siteBtn = item.githublinkwebsite
            ? `<a href="${item.githublinkwebsite}" target="_blank" class="card-btn site">${t.website}</a>`
            : "";

        const videoBtn = videoSrc
            ? `<button class="card-btn demo" data-video="${videoSrc}">${t.watchDemo}</button>`
            : "";

        // =======================
        // CARD HTML
        // =======================
        // =======================
// CARD HTML (Updated Layout)
// =======================
card.innerHTML = `
    <h3>${title}</h3>

    <div class="thumb-wrapper">
        ${mediaHTML}
        ${videoSrc ? `<div class="play-badge">${t.videoLabel}</div>` : ''}
    </div>

    <p style="color:var(--text-dim); margin-bottom:15px; font-size:0.9rem;">
        ${desc}
    </p>

    <div class="project-langs">
        ${langsHTML}
    </div>

    <div class="card-actions">
        ${repoBtn}
        ${siteBtn}
        ${videoBtn}
    </div>

    <a href="details.html?id=${index}" class="nav-btn details">
        ${t.viewDetails}
    </a>
`;

        grid.appendChild(card);

        // =======================
        // VIDEO HOVER
        // =======================
        const video = card.querySelector('video');
        if (video) {
            const playVideo = () => video.play().catch(()=>{});
            const stopVideo = () => { video.pause(); video.currentTime = 0; };

            card.addEventListener('mouseenter', playVideo);
            card.addEventListener('mouseleave', stopVideo);
            card.addEventListener('touchstart', playVideo);
            card.addEventListener('touchend', stopVideo);
        }

        observer.observe(card);
    });
}


// =======================
// LANGUAGE SELECTOR
// =======================
function setupLanguageSelector() {
    const sel = document.getElementById('lang-selector');
    if (!sel) return;

    sel.value = currentLang;

    sel.onchange = (e) => {
        currentLang = e.target.value;
        localStorage.setItem('idioma', currentLang);
        renderProjects();
        renderFilters();
    };
}


// =======================
init();
