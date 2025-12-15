fetch('data.json')
document.addEventListener('DOMContentLoaded', () => {

  let currentIndex = 0;
  let currentItems = [];

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
        Java: "images/java.png",
        Php: "images/php.png"
      };

      // ===== Language buttons =====
      const uniqueLanguages = new Set();
      items.forEach(item => {
        (Array.isArray(item.language) ? item.language : [item.language])
          .forEach(lang => lang && uniqueLanguages.add(lang));
      });

      let currentFilter = null;

      uniqueLanguages.forEach(lang => {
        const img = document.createElement('img');
        img.src = languageImages[lang] || 'images/default.png';
        img.title = lang;

        img.addEventListener('click', () => {
          document.querySelectorAll('.lang-filter img')
            .forEach(i => i.classList.remove('selected'));

          if (currentFilter === lang) {
            currentFilter = null;
            displayProjects(items);
          } else {
            currentFilter = lang;
            img.classList.add('selected');
            displayProjects(
              items.filter(i =>
                (Array.isArray(i.language) ? i.language : [i.language]).includes(lang)
              )
            );
          }
        });

        langFilter.appendChild(img);
      });

      // ===== Carousel render =====
      function displayProjects(data) {
        grid.innerHTML = '';
        currentIndex = 0;
        currentItems = data;

        data.forEach((item, index) => {
          const card = document.createElement('div');
          card.className = 'card';
          if (index === 0) card.classList.add('active');

          card.innerHTML = `
            <div class="title">${item.title}</div>
            ${item.image ? `<img src="${item.image}" class="thumb">` : ''}
            <div class="desc">${item.description}</div>
            <div class="buttons">
              ${item.githublinkwebsite ? `<a href="${item.githublinkwebsite}" target="_blank">Website</a>` : ''}
              ${item.githublinkrepo ? `<a href="${item.githublinkrepo}" target="_blank">Repository</a>` : ''}
            </div>
          `;

          grid.appendChild(card);
        });
      }

      displayProjects(items);

      // ===== Buttons =====
      document.getElementById('prevBtn').addEventListener('click', () => changeSlide(-1));
      document.getElementById('nextBtn').addEventListener('click', () => changeSlide(1));

      function changeSlide(dir) {
        const cards = document.querySelectorAll('.card');
        if (!cards.length) return;

        cards[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + dir + cards.length) % cards.length;
        cards[currentIndex].classList.add('active');
      }

    })
    .catch(err => console.error(err));
});
