fetch('data.json')
.then(res => res.json())
.then(items => {

    const grid = document.getElementById('portfolioGrid');
    const langFilter = document.getElementById('langFilter');

    const languageImages = {
        JavaScript: "images/js.png",
        Python: "images/python.png",
        HTML: "images/html.png",
        CSS: "images/css.png",
        Java: "images/java.png",
        Php: "images/php.png",
        Mysql: "images/mysql.png"
    };

    /* ---------------------------
       EXTRAER LENGUAJES ÚNICOS
    ---------------------------- */
    const uniqueLanguages = new Set();
    items.forEach(item => {
        const langs = Array.isArray(item.language) ? item.language : [item.language];
        langs.forEach(lang => { if (lang) uniqueLanguages.add(lang); });
    });

    /* ---------------------------
       CREAR BOTONES DE FILTRO
    ---------------------------- */
    let currentFilter = null;

    uniqueLanguages.forEach(lang => {
        const img = document.createElement('img');
        img.src = languageImages[lang] || 'images/default.png';
        img.title = lang;
        img.dataset.lang = lang;

        img.addEventListener('click', () => {
            const same = currentFilter === lang;
            document.querySelectorAll('.lang-filter img').forEach(i => i.classList.remove('selected'));

            if (same) {
                currentFilter = null;
                displayProjects();
            } else {
                currentFilter = lang;
                img.classList.add('selected');
                displayProjects(lang);
            }
        });

        langFilter.appendChild(img);
    });

    displayProjects();

    /* ---------------------------
       RENDER DE PROYECTOS
    ---------------------------- */
    function displayProjects(filterLang) {
        grid.innerHTML = '';

        const projectsToShow = filterLang
            ? items.filter(item => {
                const langs = Array.isArray(item.language) ? item.language : [item.language];
                return langs.includes(filterLang);
            })
            : items;

        projectsToShow.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';

            /* ---------------------------
               IMÁGENES + VIDEOS
            ---------------------------- */
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
                    <div class="carousel-track">
                        ${media.map((m, i) =>
                            m.replace('carousel-slide', `carousel-slide ${i === 0 ? 'active' : ''}`)
                        ).join('')}
                    </div>
                    <button class="carousel-btn prev-btn">❮</button>
                    <button class="carousel-btn next-btn">❯</button>
                </div>`;
            } else if (media.length === 1) {
                mediaHTML = media[0].replace('carousel-slide', 'thumb');
            }

            /* ---------------------------
               ICONOS DE LENGUAJE
            ---------------------------- */
            const langs = Array.isArray(item.language) ? item.language : [item.language];
            const languageHTML = langs.map(lang => {
                const src = languageImages[lang] || 'images/default.png';
                return `<img src="${src}" alt="${lang}" title="${lang}" class="lang-icon">`;
            }).join(' ');

            /* ---------------------------
               CONSTRUCCIÓN DE TARJETA
            ---------------------------- */
            card.innerHTML = `
                <div class="title">${item.title}</div>
                ${mediaHTML}
                <div class="desc">${item.description}</div>
                <div class="desc">Languages: ${languageHTML}</div>
                <div class="desc buttons"></div>
            `;

            const buttons = card.querySelector('.buttons');

            if (item.githublinkwebsite) {
                const btn = document.createElement('a');
                btn.href = item.githublinkwebsite;
                btn.target = '_blank';
                btn.textContent = "Website";
                btn.classList.add("button-link");
                buttons.appendChild(btn);
            }

            if (item.githublinkrepo) {
                const btn = document.createElement('a');
                btn.href = item.githublinkrepo;
                btn.target = '_blank';
                btn.textContent = "Repository";
                btn.classList.add("button-link");
                buttons.appendChild(btn);
            }

            grid.appendChild(card);
        });

        initializeCarousels();
    }

    /* ---------------------------
       CARUSEL GENERALIZADO
    ---------------------------- */
    function initializeCarousels() {
        document.querySelectorAll('.carousel-container').forEach(container => {

            const track = container.querySelector('.carousel-track');
            const slides = Array.from(container.querySelectorAll('.carousel-slide'));
            const nextBtn = container.querySelector('.next-btn');
            const prevBtn = container.querySelector('.prev-btn');
            let index = 0;

            const update = () => {
                const width = container.clientWidth;
                track.style.transform = `translateX(-${index * width}px)`;

                slides.forEach((s, i) => {
                    s.classList.toggle('active', i === index);
                });
            };

            nextBtn.onclick = () => {
                index = (index + 1) % slides.length;
                update();
            };

            prevBtn.onclick = () => {
                index = (index - 1 + slides.length) % slides.length;
                update();
            };

            new ResizeObserver(update).observe(container);
            update();
        });
    }

})
.catch(err => console.error("Error loading JSON:", err));
