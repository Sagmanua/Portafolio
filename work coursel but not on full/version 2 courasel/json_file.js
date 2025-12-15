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

    // CAROUSEL / SINGLE IMAGE LOGIC
    let imageHTML = '';
    const images = Array.isArray(item.image) ? item.image : (item.image ? [item.image] : []);

    if (images.length > 0) {
     if (images.length > 1) {
      // Multiple images: Create a carousel structure
      const imageSlides = images.map((src, index) => 
        `<img src="${src}" class="carousel-slide ${index === 0 ? 'active' : ''}" alt="${item.title} Screenshot ${index + 1}">`
      ).join('');

      imageHTML = `
        <div class="carousel-container" data-project-title="${item.title.replace(/\s/g, '-')}-${Date.now()}">
          <div class="carousel-track">
            ${imageSlides}
          </div>
          <button class="carousel-btn prev-btn">❮</button>
          <button class="carousel-btn next-btn">❯</button>
        </div>
      `;
     } else {
      // Single image: Use the existing thumb class
      imageHTML = `<img src="${images[0]}" class="thumb" alt="${item.title}">`;
     }
    }

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
    
    // Append the completed card to the grid
    grid.appendChild(card);
   });

   // After all projects are displayed, initialize carousels
   initializeCarousels();
  }

  function initializeCarousels() {
   document.querySelectorAll('.carousel-container').forEach(container => {
    const track = container.querySelector('.carousel-track');
    const slides = Array.from(container.querySelectorAll('.carousel-slide'));
    const prevButton = container.querySelector('.prev-btn');
    const nextButton = container.querySelector('.next-btn');
    let currentSlideIndex = 0;
    const slideWidth = slides[0].clientWidth; // Assuming all slides have the same width

    const updateCarousel = () => {
     // Calculate the scroll position based on the current slide index
     track.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;

     // Update active class for smooth transition (optional, but good practice)
     slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentSlideIndex);
     });
    };

   // Re-calculate slide width on window resize and initial load
    const observer = new ResizeObserver(() => {
     updateCarousel();
    });
    observer.observe(container);


    nextButton.addEventListener('click', () => {
     currentSlideIndex = (currentSlideIndex + 1) % slides.length;
     updateCarousel();
    });

    prevButton.addEventListener('click', () => {
     currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
     updateCarousel();
    });

    // Initial position setting
    updateCarousel();
   });
  }
 })
 .catch(err => console.error('Error loading JSON:', err));