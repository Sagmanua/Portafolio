const languageImages = {
    JavaScript: "images/js.png",
    Python: "images/python.png",
    HTML: "images/html.png",
    CSS: "images/css.png",
    Php: "images/php.png",
    Mysql: "images/mysql.png",
    Telegram_bot: "images/telegram_bot.png",
    JSON: "images/json.png"
};

const uiTranslations = {
    es: { langLabel: "Idiomas:", btnWeb: "Sitio Web", btnRepo: "Repositorio" },
    en: { langLabel: "Languages:", btnWeb: "Website", btnRepo: "Repository" },
    ua: { langLabel: "Мови:", btnWeb: "Вебсайт", btnRepo: "Репозиторій" }
};

let currentLang = localStorage.getItem('idioma') || 'es';

async function initDetails() {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');

    try {
        const response = await fetch('data.json');
        const projectData = await response.json();
        const project = projectData[projectId];

        if (!project) {
            window.location.href = 'index.html';
            return;
        }

        renderProject(project);
        setupLanguageSelector();
    } catch (err) {
        console.error("Error loading project details:", err);
    }
}

function renderFilters() {
    const container = document.getElementById('langFilter');
    if (!container) return;
    container.innerHTML = '';

    // Get unique languages, removing any empty strings from the data
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
    grid.innerHTML = '';
    
    const filtered = filter 
        ? projectData.filter(p => (Array.isArray(p.language) ? p.language : [p.language]).includes(filter))
        : projectData;

    filtered.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'card';
        
        const title = item.title[currentLang] || item.title['en'];
        const desc = item.description[currentLang] || item.description['en'];

        // Logic to handle "video" tag vs "image" tag
        let displayImage = 'images/default.png'; 

        if (item.image) {
            displayImage = Array.isArray(item.image) ? item.image[0] : item.image;
        } else if (item.video) {
            // Since it's a video, we show a "Video Project" placeholder
            displayImage = 'images/video-placeholder.png'; 
        }

        card.innerHTML = `
            <h3>${title}</h3>
            <img src="${displayImage}" class="thumb" onerror="this.src='images/default.png'">
            <p style="color:var(--text-dim); margin-bottom:15px; font-size:0.9rem;">${desc}</p>
            <a href="details.html?id=${projectData.indexOf(item)}" class="nav-btn" style="display:inline-block">View Details</a>
        `;
        grid.appendChild(card);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('reveal'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.card').forEach(c => observer.observe(c));
}

function setupLanguageSelector() {
    const selector = document.getElementById('lang-selector');
    selector.value = currentLang;
    selector.onchange = (e) => {
        currentLang = e.target.value;
        localStorage.setItem('idioma', currentLang);
        location.reload(); // Reload to refresh the translations
    };
}

initDetails();