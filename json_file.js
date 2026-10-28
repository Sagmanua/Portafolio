const languageImages = {
    openai: "images/openai.png",
    webhooks: "images/webhook.png",
    rest_api: "images/rest_api.png",
    n8n: "images/n8n.png",
    OpenAI: "images/OpenAI.png",
    whatsapp: "images/whatsapp.png",
    google_sheets: "images/sheets.png",
    gmail: "images/gmail.png",
    oauth: "images/oauth.png",
    twilio: "images/Twilio.png",
    elevenlabs: "images/elevenlabs.png",
    javascript: "images/js.png",
    python: "images/python.png",
    html: "images/html.png",
    css: "images/css.png",
    java: "images/java.png",
    php: "images/php.png",
    mysql: "images/mysql.png",
    sqlite: "images/SQLite.png",
    telegram_bot: "images/telegram_bot.png",
    json: "images/json.png",
    vue: "images/Vue.png",
    scss: "images/SCSS.png",
    vite: "images/Vite.png",
    pillow: "images/Pillow.png",
    wargaming_api: "images/Wargaming.png"
};

let projectData = [];
let currentLang = localStorage.getItem('idioma') || 'es';
let currentFilter = localStorage.getItem('filter') || null;

const uiText = {
    en: {
        viewDetails: "View project",
        website: "Live site",
        github: "Code",
        all: "All",
        role: "Full-Stack Developer",
        heroTitle: "Software that is clear, useful, and well built.",
        heroSub: "I design and develop web apps, bots, and tools — mainly with Python, JavaScript, and PHP.",
        explore: "View projects",
        navAbout: "About",
        navWork: "Work",
        navContact: "Contact",
        tools: "Tools",
        cv: "Resume",
        aboutTitle: "A practical engineer who ships working products.",
        aboutBody: "I build full-stack applications, Telegram bots, and browser tools. My work ranges from PHP and MySQL systems with authentication to Vue interfaces, Python services, and canvas-based experiments. I care about readable code, clear UX, and finishing features people can actually use.",
        projectsTitle: "Selected work",
        projectsSub: "Filter by technology",
        contactTitle: "Let’s work together",
        contactBody: "Open to internships, junior roles, and freelance projects. The fastest way to reach me is Telegram or GitHub.",
        footer: "© 2026 Bohdan Sydorenko",
        portraitCaption: "Move the pointer to tilt the portrait",
        loading: "Loading projects…",
        error: "Could not load projects."
    },
    es: {
        viewDetails: "Ver proyecto",
        website: "Sitio web",
        github: "Código",
        all: "Todos",
        role: "Desarrollador Full-Stack",
        heroTitle: "Software claro, útil y bien construido.",
        heroSub: "Diseño y desarrollo aplicaciones web, bots y herramientas — principalmente con Python, JavaScript y PHP.",
        explore: "Ver proyectos",
        navAbout: "Sobre mí",
        navWork: "Proyectos",
        navContact: "Contacto",
        tools: "Herramientas",
        cv: "Currículum",
        aboutTitle: "Un ingeniero práctico que entrega productos que funcionan.",
        aboutBody: "Construyo aplicaciones full-stack, bots de Telegram y herramientas de navegador. Mi trabajo va desde sistemas PHP y MySQL con autenticación hasta interfaces en Vue, servicios en Python y experimentos con canvas. Me importa el código legible, una UX clara y terminar funciones que la gente pueda usar de verdad.",
        projectsTitle: "Trabajo seleccionado",
        projectsSub: "Filtrar por tecnología",
        contactTitle: "Trabajemos juntos",
        contactBody: "Abierto a prácticas, puestos junior y proyectos freelance. La forma más rápida de contactarme es Telegram o GitHub.",
        footer: "© 2026 Bohdan Sydorenko",
        portraitCaption: "Mueve el cursor para inclinar el retrato",
        loading: "Cargando proyectos…",
        error: "No se pudieron cargar los proyectos."
    },
    ua: {
        viewDetails: "Переглянути проєкт",
        website: "Сайт",
        github: "Код",
        all: "Усі",
        role: "Full-Stack розробник",
        heroTitle: "Програмне забезпечення, яке є зрозумілим, корисним і добре зроблене.",
        heroSub: "Я проєктую та розробляю вебзастосунки, ботів і інструменти — переважно на Python, JavaScript і PHP.",
        explore: "Переглянути проєкти",
        navAbout: "Про мене",
        navWork: "Роботи",
        navContact: "Контакт",
        tools: "Інструменти",
        cv: "Резюме",
        aboutTitle: "Практичний інженер, який доводить продукти до робочого стану.",
        aboutBody: "Я створюю full-stack застосунки, Telegram-ботів і браузерні інструменти. Моя робота охоплює системи на PHP і MySQL з автентифікацією, інтерфейси на Vue, сервіси на Python і експерименти з canvas. Мені важливий читабельний код, зрозумілий UX і завершені функції, якими можна користуватися.",
        projectsTitle: "Вибрані роботи",
        projectsSub: "Фільтр за технологією",
        contactTitle: "Давайте працювати разом",
        contactBody: "Відкритий до стажувань, junior-позицій і фриланс-проєктів. Найшвидший спосіб зв’язатися — Telegram або GitHub.",
        footer: "© 2026 Bohdan Sydorenko",
        portraitCaption: "Рухайте курсор, щоб нахилити портрет",
        loading: "Завантаження проєктів…",
        error: "Не вдалося завантажити проєкти."
    }
};

const languageLabels = {
    telegram_bot: "Telegram",
    wargaming_api: "Wargaming API",
    mysql: "MySQL",
    sqlite: "SQLite",
    json: "JSON",
    scss: "SCSS",
    php: "PHP"
};

const normalize = str => (str || "").toLowerCase();
const labelFor = lang => languageLabels[normalize(lang)] || lang;

function getYouTubeId(url) {
    if (!url) return null;
    const match = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&]+)/);
    return match ? match[1] : null;
}

function getYouTubeEmbed(url) {
    const id = getYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
}

function t() {
    return uiText[currentLang] || uiText.en;
}

function renderStaticCopy() {
    const copy = t();
    document.documentElement.lang = currentLang === 'ua' ? 'uk' : currentLang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (copy[key]) el.textContent = copy[key];
    });
}

const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

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

document.addEventListener("click", e => {
    const modal = document.getElementById("videoModal");
    const video = document.getElementById("modalVideo");
    const ytContainer = document.getElementById("ytPlayerContainer");
    const ytIframe = document.getElementById("modalYoutube");

    if (!modal || !video || !ytContainer || !ytIframe) return;

    const overlay = e.target.closest(".preview-video");
    if (overlay) {
        const url = overlay.dataset.video;
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
            video.play().catch(() => {});
        }

        modal.style.display = "flex";
    }

    if (e.target.classList.contains("close-modal") || e.target === modal) {
        modal.style.display = "none";
        video.pause();
        video.src = "";
        ytIframe.src = "";
        ytContainer.style.display = "none";
        video.style.display = "none";
    }
});

document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    const modal = document.getElementById("videoModal");
    if (!modal || modal.style.display !== "flex") return;
    modal.querySelector(".close-modal")?.click();
});

async function init() {
    renderStaticCopy();
    const grid = document.getElementById('portfolioGrid');
    if (grid) grid.innerHTML = `<p class="empty-state">${t().loading}</p>`;

    try {
        const res = await fetch('data.json');
        if (!res.ok) throw new Error("Failed to load data");
        projectData = await res.json();
        renderFilters();
        renderProjects();
        setupLanguageSelector();
    } catch (err) {
        console.error(err);
        if (grid) grid.innerHTML = `<p class="empty-state">${t().error}</p>`;
    }
}

function renderFilters() {
    const container = document.getElementById('langFilter');
    if (!container) return;

    const copy = t();
    container.innerHTML = '';
    const frag = document.createDocumentFragment();

    const allItem = document.createElement('button');
    allItem.type = 'button';
    allItem.className = 'filter-item all-filter' + (currentFilter === null ? ' active' : '');
    allItem.textContent = copy.all;
    allItem.onclick = () => {
        currentFilter = null;
        localStorage.removeItem("filter");
        renderProjects();
        renderFilters();
    };
    frag.appendChild(allItem);

    const langs = [...new Set(
        projectData.flatMap(p => Array.isArray(p.language) ? p.language : [p.language])
    )].filter(Boolean);

    langs.forEach(lang => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'filter-item' + (lang === currentFilter ? ' active' : '');
        item.innerHTML = `
            <img src="${languageImages[normalize(lang)] || 'images/default.png'}" class="filter-icon" alt="">
            <span>${labelFor(lang)}</span>
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

function renderProjects(filter = currentFilter) {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const copy = t();

    const filtered = filter
        ? projectData.filter(p => {
            const langs = Array.isArray(p.language) ? p.language : [p.language];
            return langs.includes(filter);
        })
        : projectData;

    const frag = document.createDocumentFragment();

    filtered.forEach(item => {
        const originalIndex = projectData.indexOf(item);
        const card = document.createElement('article');
        card.className = 'card';

        const title = item.title?.[currentLang] || item.title?.en || "Untitled";
        const desc = item.description?.[currentLang] || item.description?.en || "";
        const videoSrc = item.video
            ? (Array.isArray(item.video) ? item.video[0] : item.video)
            : null;

        let mediaHTML = '';
        const ytId = getYouTubeId(videoSrc);

        if (ytId) {
            mediaHTML = `
                <img src="https://img.youtube.com/vi/${ytId}/hqdefault.jpg" class="thumb" alt="${title}" loading="lazy">
                <div class="preview-video yt-overlay" data-video="${videoSrc}" role="button" aria-label="Play video"></div>
            `;
        } else if (videoSrc) {
            mediaHTML = `
                <video class="thumb preview-video" muted playsinline loop preload="metadata" data-video="${videoSrc}">
                    <source src="${videoSrc}" type="video/mp4">
                </video>
            `;
        } else if (item.image) {
            mediaHTML = `
                <img src="${Array.isArray(item.image) ? item.image[0] : item.image}" class="thumb" loading="lazy" alt="${title}" onerror="this.src='images/default.png'">
            `;
        } else {
            mediaHTML = `<img src="images/default.png" class="thumb" alt="">`;
        }

        let langsHTML = '';
        if (item.language) {
            const langs = Array.isArray(item.language) ? item.language : [item.language];
            langsHTML = langs.map(lang => `
                <div class="lang-badge">
                    <img src="${languageImages[normalize(lang)] || 'images/default.png'}" class="badge-icon" alt="">
                    <span>${labelFor(lang)}</span>
                </div>
            `).join('');
        }

        const repoBtn = item.githublinkrepo
            ? `<a href="${item.githublinkrepo}" target="_blank" rel="noopener noreferrer" class="card-btn repo">${copy.github}</a>`
            : '';
        const siteBtn = item.githublinkwebsite
            ? `<a href="${item.githublinkwebsite}" target="_blank" rel="noopener noreferrer" class="card-btn site">${copy.website}</a>`
            : '';

        card.innerHTML = `
            <div class="thumb-wrapper">
                ${mediaHTML}
                ${videoSrc ? `<div class="play-badge">Play</div>` : ''}
            </div>
            <h3>${title}</h3>
            <p class="desc">${desc}</p>
            <div class="project-langs">${langsHTML}</div>
            <div class="card-actions">
                ${repoBtn}
                ${siteBtn}
            </div>
            <a href="details.html?id=${originalIndex}" class="card-more">${copy.viewDetails} →</a>
        `;

        const videoEl = card.querySelector('video.preview-video');
        if (videoEl) {
            videoEl.muted = true;
            videoObserver.observe(videoEl);
        }

        cardObserver.observe(card);
        frag.appendChild(card);
    });

    grid.appendChild(frag);
}

function setupLanguageSelector() {
    const sel = document.getElementById('lang-selector');
    if (!sel) return;

    sel.value = currentLang;
    sel.onchange = e => {
        currentLang = e.target.value;
        localStorage.setItem('idioma', currentLang);
        renderStaticCopy();
        renderProjects();
        renderFilters();
    };
}

init();
