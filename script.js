fetch('data.json')
  .then(response => response.json())
  .then(items => {
    const grid = document.getElementById('portfolioGrid');

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';

      let mediaHTML = "";

      // If an image exists:

    if (item.image) {
    mediaHTML = `<img src="${item.image}" class="thumb" alt="${item.title}">`;
    }

  card.innerHTML = `
      <div class="title">${item.title}</div>
      ${mediaHTML}
      <div class="desc">${item.description}</div>
      <div class="desc"><p>La Language que usa: ${item.language}</div>
      <div class="desc"><a href="${item.github}">GitHub Link</a></div>
    `;


      grid.appendChild(card);
    });
  })
  .catch(err => console.error('Error loading JSON:', err));
