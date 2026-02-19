const languageImages = {
    JavaScript: "images/js.png",
    Python: "images/python.png",
    HTML: "images/html.png",
    CSS: "images/css.png",
    Php: "images/php.png",
    Mysql: "images/mysql.png",
    Telegram_bot: "images/telegram_bot.png",
    JSON: "images/json.png",
    Java: "images/java.png",
    SQLite: "images/SQLite.png"
};

const uiText = {
    es: { langLabel: "Tecnologías:", btnWeb: "Sitio Web", btnRepo: "Repositorio" },
    en: { langLabel: "Technologies:", btnWeb: "Website", btnRepo: "Repository" },
    ua: { langLabel: "Технології:", btnWeb: "Вебсайт", btnRepo: "Репозиторій" }
};

let currentLang = localStorage.getItem('idioma') || 'es';

async function loadProjectDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id === null) {
        console.error("No project ID found in URL");
        return;
    }

    try {
        const response = await fetch('data.json');
        const data = await response.json();
        const project = data[id];

        if (!project) {
            document.getElementById('det-title-header').textContent = "Project not found";
            return;
        }

        renderProject(project);
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

function renderProject(item) {
    const t = uiText[currentLang];
    
    // 1. Titles
    const titleText = item.title[currentLang] || item.title['en'];
    document.getElementById('det-title').textContent = titleText;
    document.getElementById('det-title-header').textContent = titleText;

    // 2. Media (Video or Image)
    const mediaBox = document.getElementById('det-media');
    if (item.video) {
        mediaBox.innerHTML = `
            <video controls autoplay muted style="width:100%; border-radius:12px; border: 1px solid var(--glass);">
                <source src="${item.video}" type="video/mp4">
            </video>`;
    } else {
        const imgSrc = Array.isArray(item.image) ? item.image[0] : item.image;
        mediaBox.innerHTML = `<img src="${imgSrc}" style="width:100%; border-radius:12px;" onerror="this.src='images/default.png'">`;
    }

    // 3. Languages
    const langBox = document.getElementById('det-languages');
    const langs = Array.isArray(item.language) ? item.language : [item.language];
    langBox.innerHTML = `<strong>${t.langLabel}</strong>`;
    langs.forEach(l => {
        if(languageImages[l]) {
            langBox.innerHTML += `<img src="${languageImages[l]}" title="${l}" style="width:30px; height:30px;">`;
        }
    });

    // 4. Description
    document.getElementById('det-long-description').textContent = item.long_description[currentLang] || item.long_description['en'];

    // 5. Buttons
    const linkBox = document.getElementById('det-links');
    if (item.githublinkrepo) {
        linkBox.innerHTML += `<a href="${item.githublinkrepo}" target="_blank" class="nav-btn">${t.btnRepo}</a>`;
    }
    if (item.githublinkwebsite) {
        linkBox.innerHTML += `<a href="${item.githublinkwebsite}" target="_blank" class="nav-btn" style="background:var(--accent); color:black;">${t.btnWeb}</a>`;
    }

    // Show content
    document.getElementById('details-container').style.opacity = '1';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const sel = document.getElementById('lang-selector');
    sel.value = currentLang;
    sel.onchange = (e) => {
        localStorage.setItem('idioma', e.target.value);
        location.reload();
    };
    loadProjectDetails();
});