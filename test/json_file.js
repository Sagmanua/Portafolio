const languageImages = {
    JavaScript: "images/js.png", Python: "images/python.png",
    HTML: "images/html.png", CSS: "images/css.png",
    Java: "images/java.png", Php: "images/php.png",
    Mysql: "images/mysql.png", SQLite: "images/SQLite.png"
};

let projectData = [];
let currentLang = localStorage.getItem('idioma') || 'es';

async function init() {
    try {
        const response = await fetch('data.json');
        projectData = await response.json();
        renderFilters();
        renderProjects();
        setupLanguageSelector();
    } catch (err) { console.error("Data fetch error:", err); }
}

// - Updated renderFilters function
function renderFilters() {
    const container = document.getElementById('langFilter');
    if (!container) return;
    container.innerHTML = '';

    // Get unique languages and filter out empty strings
    const langs = [...new Set(projectData.flatMap(p => 
        Array.isArray(p.language) ? p.language : [p.language]
    ))].filter(l => l && l.trim() !== "");

    langs.forEach(lang => {
        const item = document.createElement('div');
        item.className = 'filter-item';
        item.onclick = () => renderProjects(lang);

        // Language Icon
        const img = document.createElement('img');
        img.src = languageImages[lang] || 'images/default.png';
        img.className = 'filter-icon';
        img.alt = lang;
        
        // Language Text Label
        const span = document.createElement('span');
        span.textContent = lang;

        item.appendChild(img);
        item.appendChild(span);
        container.appendChild(item);
    });
}

function renderProjects(filter = null) {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = filter 
        ? projectData.filter(p => 
            (Array.isArray(p.language) ? p.language : [p.language]).includes(filter)
        )
        : projectData;

    filtered.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'card';

        const title = item.title?.[currentLang] || item.title?.en || "No title";
        const desc = item.description?.[currentLang] || item.description?.en || "";

        // ---------- MEDIA LOGIC ----------
        let mediaHTML = '';

        // IMAGE
        if (item.image && item.image !== "") {
            const imgSrc = Array.isArray(item.image) ? item.image[0] : item.image;

            mediaHTML = `
                <img src="${imgSrc}" 
                     class="thumb" 
                     onerror="this.src='images/default.png'">
            `;
        }

        // VIDEO
        else if (item.video && item.video !== "") {
            const videoSrc = Array.isArray(item.video) ? item.video[0] : item.video;

            mediaHTML = `
                <video class="thumb video-thumb" muted loop preload="metadata">
                    <source src="${videoSrc}" type="video/mp4">
                </video>
            `;
        }

        // DEFAULT
        else {
            mediaHTML = `
                <img src="images/default.png" class="thumb">
            `;
        }

        // ---------- CARD HTML ----------
        card.innerHTML = `
            <h3>${title}</h3>

            <div class="thumb-wrapper">
                ${mediaHTML}
                ${item.video ? '<div class="play-badge">▶ Video Demo</div>' : ''}
            </div>

            <p style="color:var(--text-dim); margin-bottom:15px; font-size:0.9rem;">
                ${desc}
            </p>

            <a href="details.html?id=${projectData.indexOf(item)}" class="nav-btn">
                View Details
            </a>
        `;

        grid.appendChild(card);

        // ---------- VIDEO HOVER PLAY ----------
        const video = card.querySelector('video');

        if (video) {
            card.addEventListener('mouseenter', () => {
                video.play().catch(() => {});
            });

            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });

    // ---------- ANIMATION ----------
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('reveal');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card').forEach(c => observer.observe(c));
}


function setupLanguageSelector() {
    const sel = document.getElementById('lang-selector');
    sel.value = currentLang;
    sel.onchange = (e) => {
        currentLang = e.target.value;
        localStorage.setItem('idioma', currentLang);
        renderProjects(); // Updates project text
        renderFilters();  // ADD THIS: Refresh filters if they use translations
    };
}

init();