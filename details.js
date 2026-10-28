const languageImages = {
    Twilio: "images/Twilio.png",
    OpenAI: "images/OpenAI.png",
    WhatsApp_API: "images/WhatsApp.png",
    Google_Sheets: "images/Google_Sheets.png",
    Gmail: "images/Gmail.png",
    OAuth: "images/OAuth.png",
    ElevenLabs: "images/elevenlabs.webp",
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

const uiText = {
    es: { langLabel: "Tecnologías", btnWeb: "Sitio web", btnRepo: "Repositorio", back: "← Volver", missing: "Este proyecto aún no tiene una descripción detallada." },
    en: { langLabel: "Technologies", btnWeb: "Live site", btnRepo: "Repository", back: "← Back", missing: "This project does not have a longer write-up yet." },
    ua: { langLabel: "Технології", btnWeb: "Вебсайт", btnRepo: "Репозиторій", back: "← Назад", missing: "Для цього проєкту ще немає детального опису." }
};

const languageLabels = {
    Telegram_bot: "Telegram",
    Wargaming_api: "Wargaming API",
    Mysql: "MySQL"
};

let currentLang = localStorage.getItem('idioma') || 'es';

function getYouTubeEmbed(url) {
    if (!url) return null;
    const match = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

async function loadProjectDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id === null) {
        document.getElementById('det-title').textContent = "Project not found";
        return;
    }

    try {
        const response = await fetch('data.json');
        const data = await response.json();
        const project = data[id];

        if (!project) {
            document.getElementById('det-title').textContent = "Project not found";
            return;
        }

        renderProject(project);
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

function renderProject(item) {
    const t = uiText[currentLang];
    document.documentElement.lang = currentLang === 'ua' ? 'uk' : currentLang;

    const titleText = item.title[currentLang] || item.title.en;
    document.getElementById('det-title').textContent = titleText;
    document.title = `${titleText} | Bohdan Sydorenko`;

    const backBtn = document.querySelector('.nav-btn');
    if (backBtn) backBtn.textContent = t.back;

    const mediaBox = document.getElementById('det-media');
    const videoSrc = item.video
        ? (Array.isArray(item.video) ? item.video[0] : item.video)
        : null;

    if (videoSrc) {
        const ytEmbedUrl = getYouTubeEmbed(videoSrc);
        if (ytEmbedUrl) {
            mediaBox.innerHTML = `
                <div style="aspect-ratio: 16/9; width: 100%; border-radius: 12px; overflow: hidden;">
                    <iframe src="${ytEmbedUrl}" allow="encrypted-media; fullscreen" allowfullscreen title="${titleText}"></iframe>
                </div>`;
        } else {
            mediaBox.innerHTML = `
                <video controls>
                    <source src="${videoSrc}" type="video/mp4">
                </video>`;
        }
    } else if (item.image) {
        const imgSrc = Array.isArray(item.image) ? item.image[0] : item.image;
        mediaBox.innerHTML = `<img src="${imgSrc}" alt="${titleText}" onerror="this.src='images/default.png'">`;
    }

    const langBox = document.getElementById('det-languages');
    const langs = Array.isArray(item.language) ? item.language : [item.language];
    langBox.innerHTML = `<strong style="margin-right:8px;color:var(--text);">${t.langLabel}</strong>`;
    langs.forEach(l => {
        const icon = languageImages[l];
        langBox.innerHTML += icon
            ? `<span class="lang-badge"><img src="${icon}" title="${l}" class="badge-icon" alt=""><span>${languageLabels[l] || l}</span></span>`
            : `<span class="lang-badge"><span>${languageLabels[l] || l}</span></span>`;
    });

    const longDesc = item.long_description
        ? (item.long_description[currentLang] || item.long_description.en || t.missing)
        : t.missing;
    document.getElementById('det-long-description').textContent = longDesc;

    const linkBox = document.getElementById('det-links');
    linkBox.innerHTML = '';
    if (item.githublinkrepo) {
        linkBox.innerHTML += `<a href="${item.githublinkrepo}" target="_blank" rel="noopener noreferrer" class="card-btn repo">${t.btnRepo}</a>`;
    }
    if (item.githublinkwebsite) {
        linkBox.innerHTML += `<a href="${item.githublinkwebsite}" target="_blank" rel="noopener noreferrer" class="btn-primary">${t.btnWeb}</a>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sel = document.getElementById('lang-selector');
    sel.value = currentLang;
    sel.onchange = (e) => {
        localStorage.setItem('idioma', e.target.value);
        location.reload();
    };
    loadProjectDetails();
});
