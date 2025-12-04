fetch('data.json')
  .then(response => response.json())
  .then(items => {
    const grid = document.getElementById('portfolioGrid');
    const langFilter = document.getElementById('langFilter');

    const languageImages = {
      "JavaScript": "images/js.png",
      "Python": "images/python.png",
      "HTML": "images/html.png",
      "CSS": "images/css.png",
      "C++": "images/cpp.png",
      "Java": "images/java.png"
    };

    // Get unique languages
    const uniqueLanguages = new Set();
    items.forEach(item => {
      if (Array.isArray(item.language)) item.language.forEach(lang => uniqueLanguages.add(lang));
      else if (item.language) uniqueLanguages.add(item.language);
    });

    let currentFilter = null; // keep track of selected language

    // Create filter buttons
    uniqueLanguages.forEach(lang => {
      const img = document.createElement('img');
      img.src = languageImages[lang] || 'images/default.png';
      img.title = lang;
      img.dataset.lang = lang;

      img.addEventListener('click', () => {
        if (currentFilter === lang) {
          // Clicked again → reset filter
          currentFilter = null;
          document.querySelectorAll('.lang-filter img').forEach(i => i.classList.remove('selected'));
          displayProjects();
        } else {
          // Select new filter
          currentFilter = lang;
          document.querySelectorAll('.lang-filter img').forEach(i => i.classList.remove('selected'));
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
      const filteredItems = filterLang
        ? items.filter(item => {
            if (Array.isArray(item.language)) return item.language.includes(filterLang);
            return item.language === filterLang;
          })
        : items;

      filteredItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        let mediaHTML = item.image ? `<img src="${item.image}" class="thumb" alt="${item.title}">` : '';
        let websiteLinkHTML = item.githublinkwebsite ? `
          <div class="desc">
            <a href="${item.githublinkwebsite}" target="_blank" onclick="event.stopPropagation()">Website Link</a>
          </div>` : '';

        let languageHTML = '';
        if (item.language) {
          const langs = Array.isArray(item.language) ? item.language : [item.language];
          languageHTML = langs.map(lang => {
            const src = languageImages[lang] || 'images/default.png';
            return `<img src="${src}" alt="${lang}" title="${lang}" class="lang-icon">`;
          }).join(' ');
        }

        card.innerHTML = `
          <div class="title">${item.title}</div>
          ${mediaHTML}
          <div class="desc">${item.description}</div>
          <div class="desc">Languages: ${languageHTML}</div>
          ${websiteLinkHTML}
        `;

        card.addEventListener('click', () => {
          window.open(item.githublinkrepo, '_blank');
        });

        grid.appendChild(card);
      });
    }
  })
  .catch(err => console.error('Error loading JSON:', err));
