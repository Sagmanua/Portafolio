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

function renderProject(item) {
    // Title & Description
    document.getElementById('det-title').textContent = item.title[currentLang];
    document.getElementById('det-title-header').textContent = item.title[currentLang];
    
    // Use long_description if available, otherwise fallback to standard description
    const longDesc = item.long_description ? item.long_description[currentLang] : item.description[currentLang];
    document.getElementById('det-long-description').innerHTML = longDesc.replace(/\n/g, '<br>');

    // Media Handling
    const mediaContainer = document.getElementById('det-media');
    const images = Array.isArray(item.image) ? item.image : (item.image ? [item.image] : []);
    const videos = Array.isArray(item.video) ? item.video : (item.video ? [item.video] : []);
    
    mediaContainer.innerHTML = [
        ...images.map(src => `<img src="${src}" class="thumb" style="max-height: 500px; margin-bottom: 15px;">`),
        ...videos.map(src => `<video src="${src}" class="thumb" style="max-height: 500px;" controls muted loop></video>`)
    ].join('');

    // Languages
    const itemLangs = Array.isArray(item.language) ? item.language : [item.language];
    const iconsHTML = itemLangs.map(l => `<img src="${languageImages[l] || 'images/default.png'}" title="${l}" class="lang-icon">`).join('');
    document.getElementById('det-languages').innerHTML = `${uiTranslations[currentLang].langLabel} ${iconsHTML}`;

    // Links
    const linksContainer = document.getElementById('det-links');
    linksContainer.innerHTML = `
        ${item.githublinkwebsite ? `<a href="${item.githublinkwebsite}" target="_blank" class="button-link">${uiTranslations[currentLang].btnWeb}</a>` : ''}
        ${item.githublinkrepo ? `<a href="${item.githublinkrepo}" target="_blank" class="button-link">${uiTranslations[currentLang].btnRepo}</a>` : ''}
    `;
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