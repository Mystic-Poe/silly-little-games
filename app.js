const input = document.getElementById('search');
const grid = document.getElementById('games');
const empty = document.getElementById('empty');

function escapeHTML(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[c]);
}

function cardHTML(game) {
  const slug = game.slug;
  const name = game.name || slug;
  const tags = Array.isArray(game.tags) ? game.tags : [];
  const tagsLine = tags.join(' · ');
  const tagsData = tags.join(' ');
  const url = `./games/${encodeURIComponent(slug)}/`;
  const authorLine = game.author
    ? `<p class="author">by ${escapeHTML(game.author)}</p>`
    : '';
  return `
    <a href="${url}" class="card" data-name="${escapeHTML(name)}" data-tags="${escapeHTML(tagsData)}">
      <div class="window">
        <div class="window-bar">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
          <span class="window-title">${escapeHTML(name)}</span>
        </div>
        <div class="preview">
          <iframe src="${url}" title="${escapeHTML(name)} preview" loading="lazy" scrolling="no" tabindex="-1"></iframe>
        </div>
      </div>
      <div class="meta">
        <h2>${escapeHTML(name)}</h2>
        <p class="tags">${escapeHTML(tagsLine)}</p>
        ${authorLine}
      </div>
    </a>
  `;
}

async function loadGames() {
  try {
    const res = await fetch('./games.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const games = await res.json();
    grid.innerHTML = games.map(cardHTML).join('');
  } catch (err) {
    grid.innerHTML = `<p class="empty">could not load games (${escapeHTML(err.message)})</p>`;
  }
}

function applyFilter() {
  const q = input.value.trim().toLowerCase();
  const cards = grid.querySelectorAll('.card');
  let visible = 0;
  for (const card of cards) {
    const hay = `${card.dataset.name || ''} ${card.dataset.tags || ''}`.toLowerCase();
    const match = !q || hay.includes(q);
    card.classList.toggle('hidden', !match);
    if (match) visible++;
  }
  empty.hidden = visible > 0 || cards.length === 0;
}

input.addEventListener('input', applyFilter);
input.addEventListener('keydown', e => {
  if (e.key === 'Escape') { input.value = ''; applyFilter(); }
});

loadGames();
