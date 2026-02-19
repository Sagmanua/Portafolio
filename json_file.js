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

const uiText = {
    en: { watchDemo: "Watch Demo", viewDetails: "View Details", website: "Website", github: "GitHub", videoLabel: "▶ Video Demo", all: "All" },
    es: { watchDemo: "Ver Demo", viewDetails: "Ver Detalles", website: "Sitio Web", github: "GitHub", videoLabel: "▶ Video", all: "Todos" },
    ua: { watchDemo: "Дивитися демо", viewDetails: "Детальніше", website: "Сайт", github: "GitHub", videoLabel: "▶ Відео", all: "Всі" }
};

// Intersection Observer
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('reveal'); observer.unobserve(e.target); } });
}, { threshold: 0.1 });

// Modal
document.addEventListener("click", e => {
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
        video.pause(); video.currentTime = 0; video.src = "";
    }
});

// INIT
async function init() {
    try {
        const res = await fetch('data.json');
        projectData = await res.json();
        renderFilters();
        renderProjects();
        setupLanguageSelector();
    } catch(err) { console.error("Data fetch error:", err); }
}

// FILTERS
function renderFilters() {
    const container = document.getElementById('langFilter');
    if (!container) return;
    const t = uiText[currentLang] || uiText.en;

    container.innerHTML = '';
    const frag = document.createDocumentFragment();

    const allItem = document.createElement('div');
    allItem.className = 'filter-item all-filter' + (currentFilter===null?' active':'');
    allItem.innerHTML = `<span>${t.all}</span>`;
    allItem.onclick = () => { currentFilter=null; renderProjects(); renderFilters(); };
    frag.appendChild(allItem);

    const langs = [...new Set(projectData.flatMap(p => Array.isArray(p.language)?p.language:[p.language]))].filter(Boolean);
    langs.forEach(lang => {
        const item = document.createElement('div');
        item.className = 'filter-item' + (lang===currentFilter?' active':'');
        item.innerHTML = `<img src="${languageImages[lang]||'images/default.png'}" class="filter-icon" alt="${lang}"><span>${lang}</span>`;
        item.onclick = () => { currentFilter=lang; renderProjects(); renderFilters(); };
        frag.appendChild(item);
    });

    container.appendChild(frag);
}

// PROJECTS
function renderProjects(filter=currentFilter) {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const frag = document.createDocumentFragment();
    const filtered = filter ? projectData.filter(p => (Array.isArray(p.language)?p.language:[p.language]).includes(filter)) : projectData;
    const t = uiText[currentLang] || uiText.en;

    filtered.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';

        const title = item.title?.[currentLang] || item.title?.en || "No title";
        const desc = item.description?.[currentLang] || item.description?.en || "";

        // MEDIA
        let mediaHTML = '';
        const videoSrc = item.video ? (Array.isArray(item.video)?item.video[0]:item.video) : null;
        if (item.image) mediaHTML = `<img src="${Array.isArray(item.image)?item.image[0]:item.image}" class="thumb" loading="lazy" onerror="this.src='images/default.png'">`;
        else if (videoSrc) mediaHTML = `<video class="thumb video-thumb" muted playsinline loop preload="metadata"><source src="${videoSrc}" type="video/mp4"></video>`;
        else mediaHTML = `<img src="images/default.png" class="thumb" loading="lazy">`;

        // LANG BADGES
        let langsHTML = '';
        if(item.language) {
            const langs = Array.isArray(item.language)?item.language:[item.language];
            langsHTML = langs.map(lang => `<div class="lang-badge"><img src="${languageImages[lang]||'images/default.png'}" class="badge-icon" alt="${lang}"><span>${lang}</span></div>`).join('');
        }

        // BUTTONS
        const repoBtn = item.githublinkrepo?`<a href="${item.githublinkrepo}" target="_blank" class="card-btn repo">${t.github}</a>`:'';
        const siteBtn = item.githublinkwebsite?`<a href="${item.githublinkwebsite}" target="_blank" class="card-btn site">${t.website}</a>`:'';
        const videoBtn = videoSrc?`<button class="card-btn demo" data-video="${videoSrc}">${t.watchDemo}</button>`:'';

        card.innerHTML = `
            <h3>${title}</h3>
            <div class="thumb-wrapper">${mediaHTML}${videoSrc?`<div class="play-badge">${t.videoLabel}</div>`:''}</div>
            <p style="color:var(--text-dim); margin-bottom:15px; font-size:0.9rem;">${desc}</p>
            <div class="project-langs">${langsHTML}</div>
            <div class="card-actions">${repoBtn}${siteBtn}${videoBtn}</div>
            <a href="details.html?id=${index}" class="nav-btn details">${t.viewDetails}</a>
        `;

        const videoEl = card.querySelector('video');
        if(videoEl){
            card.addEventListener('mouseenter', ()=>videoEl.play().catch(()=>{}));
            card.addEventListener('mouseleave', ()=>{ videoEl.pause(); videoEl.currentTime=0; });
            card.addEventListener('touchstart', ()=>videoEl.play().catch(()=>{}));
            card.addEventListener('touchend', ()=>{ videoEl.pause(); videoEl.currentTime=0; });
        }

        observer.observe(card);
        frag.appendChild(card);
    });

    grid.appendChild(frag);
}

// LANGUAGE SELECTOR
function setupLanguageSelector(){
    const sel=document.getElementById('lang-selector');
    if(!sel) return;
    sel.value=currentLang;
    sel.onchange = e => { currentLang=e.target.value; localStorage.setItem('idioma',currentLang); renderProjects(); renderFilters(); };
}

init();
