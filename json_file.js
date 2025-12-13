fetch('data.json')
  .then(response => response.json())
  .then(items => {
    const grid = document.getElementById('portfolioGrid');
    const langFilter = document.getElementById('langFilter');

    const languageImages = {
      JavaScript: "images/js.png",
      Python: "images/python.png",
      HTML: "images/html.png",
      CSS: "images/css.png",
      "C++": "images/cpp.png",
      Java: "images/java.png"
    };

    // Extract unique languages
    const uniqueLanguages = new Set();
    items.forEach(item => {
      if (Array.isArray(item.language)) {
        item.language.forEach(lang => uniqueLanguages.add(lang));
      } else if (item.language) {
        uniqueLanguages.add(item.language);
      }
    });

    let currentFilter = null;

    // Build language filter buttons
    uniqueLanguages.forEach(lang => {
      const img = document.createElement('img');
      img.src = languageImages[lang] || 'images/default.png';
      img.title = lang;
      img.dataset.lang = lang;

      img.addEventListener('click', () => {
        const isSameFilter = currentFilter === lang;

        document.querySelectorAll('.lang-filter img')
          .forEach(i => i.classList.remove('selected'));

        if (isSameFilter) {
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

    // Show all projects initially
    displayProjects();

    function displayProjects(filterLang) {
      grid.innerHTML = '';

      const projectsToShow = filterLang
        ? items.filter(item => {
            const langs = Array.isArray(item.language)
              ? item.language
              : [item.language];
            return langs.includes(filterLang);
          })
        : items;

      projectsToShow.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        // Thumbnail
        const imageHTML = item.image
          ? `<img src="${item.image}" class="thumb" alt="${item.title}">`
          : '';

        // Language icons
        let languageHTML = '';
        if (item.language) {
          const langs = Array.isArray(item.language)
            ? item.language
            : [item.language];

          languageHTML = langs.map(lang => {
            const src = languageImages[lang] || 'images/default.png';
            return `<img src="${src}" alt="${lang}" title="${lang}" class="lang-icon">`;
          }).join(' ');
        }

        // Card content
        card.innerHTML = `
          <div class="title">${item.title}</div>
          ${imageHTML}
          <div class="desc">${item.description}</div>
          <div class="desc">Languages: ${languageHTML}</div>
          <div class="desc buttons"></div>
        `;

        // Buttons
        const buttonsContainer = card.querySelector('.buttons');

        if (item.githublinkwebsite) {
          const websiteBtn = document.createElement('a');
          websiteBtn.href = item.githublinkwebsite;
          websiteBtn.target = '_blank';
          websiteBtn.className = 'button-link';
          websiteBtn.textContent = 'Website';
          buttonsContainer.appendChild(websiteBtn);
        }

        if (item.githublinkrepo) {
          const repoBtn = document.createElement('a');
          repoBtn.href = item.githublinkrepo;
          repoBtn.target = '_blank';
          repoBtn.className = 'button-link';
          repoBtn.textContent = 'Repository';
          buttonsContainer.appendChild(repoBtn);
        }

        grid.appendChild(card);
      });
    }
  })
  .catch(err => console.error('Error loading JSON:', err));
