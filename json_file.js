// ============================
// LANGUAGE IMAGES
// ============================
const languageImages = {
    javascript: "images/js.png",
    python: "images/python.png",
    html: "images/html.png",
    css: "images/css.png",
    java: "images/java.png",
    php: "images/php.png",
    mysql: "images/mysql.png",
    sqlite: "images/sqlite.png",
    telegram_bot: "images/telegram_bot.png",
    json: "images/json.png"


};

// ============================
// GLOBAL STATE
// ============================
let projectData = [];
let currentLang = localStorage.getItem('idioma') || 'es';
let currentFilter = localStorage.getItem('filter') || null;

// ============================
// UI TEXT
// ============================
const uiText = {
    en: { viewDetails: "View Details", website: "Website", github: "GitHub", all: "All" },
    es: { viewDetails: "Ver Detalles", website: "Sitio Web", github: "GitHub", all: "Todos" },
    ua: { viewDetails: "Детальніше", website: "Сайт", github: "GitHub", all: "Всі" }
};

// ============================
// HELPERS
// ============================
const normalize = str => (str || "").toLowerCase();

function getYouTubeEmbed(url) {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

// ============================
// CARD ANIMATION OBSERVER
// ============================
const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// ============================
// VIDEO OBSERVER (SMART PLAY)
// ============================
const videoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const video = entry.target;

        if (entry.isIntersecting) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    });
}, { threshold: 0.25 });

// ============================
// MODAL LOGIC
// ============================
document.addEventListener("click", e => {
    const modal = document.getElementById("videoModal");
    const video = document.getElementById("modalVideo");
    const ytContainer = document.getElementById("ytPlayerContainer");
    const ytIframe = document.getElementById("modalYoutube");

    if (!modal || !video || !ytContainer || !ytIframe) return;

    // OPEN VIDEO
    if (e.target.classList.contains("preview-video")) {
        const url = e.target.dataset.video;
        const ytEmbedUrl = getYouTubeEmbed(url);

        if (ytEmbedUrl) {
            video.pause();
            video.style.display = "none";

            ytContainer.style.display = "block";
            ytIframe.src = ytEmbedUrl + "?autoplay=1";
        } else {
            ytContainer.style.display = "none";
            ytIframe.src = "";

            video.style.display = "block";
            video.src = url;
            video.play().catch(()=>{});
        }

        modal.style.display = "flex";
    }

    // CLOSE MODAL
    if (e.target.classList.contains("close-modal") || e.target === modal) {
        modal.style.display = "none";

        video.pause();
        video.src = "";
        ytIframe.src = "";
    }
});

// ============================
// INIT
// ============================
async function init() {
    const grid = document.getElementById('portfolioGrid');
    if (grid) grid.innerHTML = "<p>Loading...</p>";

    try {
        const res = await fetch('data.json');
        if (!res.ok) throw new Error("Failed to load data");

        projectData = await res.json();

        renderFilters();
        renderProjects();
        setupLanguageSelector();

    } catch (err) {
        console.error(err);
        if (grid) grid.innerHTML = "<p>Error loading projects</p>";
    }
}

// ============================
// FILTERS
// ============================
function renderFilters() {
    const container = document.getElementById('langFilter');
    if (!container) return;

    const t = uiText[currentLang] || uiText.en;
    container.innerHTML = '';

    const frag = document.createDocumentFragment();

    // ALL
    const allItem = document.createElement('div');
    allItem.className = 'filter-item all-filter' + (currentFilter === null ? ' active' : '');
    allItem.textContent = t.all;

    allItem.onclick = () => {
        currentFilter = null;
        localStorage.removeItem("filter");
        renderProjects();
        renderFilters();
    };

    frag.appendChild(allItem);

    // LANGS
    const langs = [...new Set(
        projectData.flatMap(p =>
            Array.isArray(p.language) ? p.language : [p.language]
        )
    )].filter(Boolean);

    langs.forEach(lang => {
        const norm = normalize(lang);

        const item = document.createElement('div');
        item.className = 'filter-item' + (lang === currentFilter ? ' active' : '');

        item.innerHTML = `
            <img src="${languageImages[norm] || 'images/default.png'}" class="filter-icon">
            <span>${lang}</span>
        `;

        item.onclick = () => {
            currentFilter = lang;
            localStorage.setItem("filter", lang);
            renderProjects();
            renderFilters();
        };

        frag.appendChild(item);
    });

    container.appendChild(frag);
}

// ============================
// PROJECTS
// ============================
// - Referring to the helper function already in your code
// ============================
// PROJECTS
// ============================
function renderProjects(filter = currentFilter) {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const t = uiText[currentLang] || uiText.en;

    const filtered = filter
        ? projectData.filter(p => {
            const langs = Array.isArray(p.language) ? p.language : [p.language];
            return langs.includes(filter);
        })
        : projectData;

    const frag = document.createDocumentFragment();

    filtered.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.transitionDelay = `${index * 0.05}s`;

        const title = item.title?.[currentLang] || item.title?.en || "No title";
        const desc = item.description?.[currentLang] || item.description?.en || "";

        const videoSrc = item.video
            ? (Array.isArray(item.video) ? item.video[0] : item.video)
            : null;

        // MEDIA
        let mediaHTML = '';
        const ytEmbedUrl = getYouTubeEmbed(videoSrc);

        if (ytEmbedUrl) {
            const videoId = videoSrc.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&]+)/)[1];
            
            // Added a transparent overlay (.preview-video) to catch clicks for the modal
            mediaHTML = `
                <iframe 
                    class="thumb" 
                    src="${ytEmbedUrl}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1" 
                    frameborder="0" 
                    allow="autoplay; encrypted-media" 
                    style="width: 100%; height: 100%; pointer-events: none; border: none;">
                </iframe>
                <div class="preview-video yt-overlay" data-video="${videoSrc}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 5; cursor: pointer;"></div>
            `;
        } else if (videoSrc) {
            mediaHTML = `
                <video class="thumb preview-video" muted playsinline loop autoplay preload="auto" data-video="${videoSrc}">
                    <source src="${videoSrc}" type="video/mp4">
                </video>
            `;
        } else if (item.image) {
            mediaHTML = `
                <img src="${Array.isArray(item.image) ? item.image[0] : item.image}" class="thumb" loading="lazy" onerror="this.src='images/default.png'">
            `;
        } else {
            mediaHTML = `<img src="images/default.png" class="thumb">`;
        }

        // LANG BADGES
        let langsHTML = '';
        if (item.language) {
            const langs = Array.isArray(item.language) ? item.language : [item.language];
            langsHTML = langs.map(lang => {
                const norm = normalize(lang);
                return `
                    <div class="lang-badge">
                        <img src="${languageImages[norm] || 'images/default.png'}" class="badge-icon">
                        <span>${lang}</span>
                    </div>
                `;
            }).join('');
        }

        const repoBtn = item.githublinkrepo ? `<a href="${item.githublinkrepo}" target="_blank" class="card-btn repo">${t.github}</a>` : '';
        const siteBtn = item.githublinkwebsite ? `<a href="${item.githublinkwebsite}" target="_blank" class="card-btn site">${t.website}</a>` : '';

        // Added aspect-ratio and relative positioning to thumb-wrapper
        // Enabled play-badge for ALL videos and added pointer-events:none
        card.innerHTML = `
            <h3>${title}</h3>
            <div class="thumb-wrapper" style="position: relative; aspect-ratio: 16/9; overflow: hidden; border-radius: 8px;">
                ${mediaHTML}
                ${videoSrc ? `<div class="play-badge" style="pointer-events: none; z-index: 10;">▶</div>` : ''}
            </div>
            <p class="desc">${desc}</p>
            <div class="project-langs">${langsHTML}</div>
            <div class="card-actions">
                ${repoBtn}
                ${siteBtn}
            </div>
            <a href="details.html?id=${index}" class="nav-btn details">${t.viewDetails}</a>
        `;

        // Local video control
        const videoEl = card.querySelector('video.preview-video');
        if (videoEl) {
            videoEl.muted = true;
            videoEl.load();
            videoObserver.observe(videoEl);
        }

        cardObserver.observe(card);
        frag.appendChild(card);
    });

    grid.appendChild(frag);
}

// ============================
// LANGUAGE SELECTOR
// ============================
function setupLanguageSelector() {
    const sel = document.getElementById('lang-selector');
    if (!sel) return;

    sel.value = currentLang;

    sel.onchange = e => {
        currentLang = e.target.value;
        localStorage.setItem('idioma', currentLang);
        renderProjects();
        renderFilters();
    };
}

// ============================
// START
// ============================
init();