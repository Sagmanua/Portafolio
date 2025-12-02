// Load portfolio data from JSON
fetch('data.json')
  .then(response => response.json())
  .then(items => {
    const grid = document.getElementById('portfolioGrid');

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <div class="title">${item.title}</div>
        <div class="desc">${item.description}</div>
        <div class="desc">${item.language}</div>
      `;

      grid.appendChild(card);
    });
  })
  .catch(err => console.error('Error loading JSON:', err));
