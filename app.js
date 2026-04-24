const input = document.getElementById('search');
const cards = Array.from(document.querySelectorAll('#games .card'));
const empty = document.getElementById('empty');

function applyFilter() {
  const q = input.value.trim().toLowerCase();
  let visible = 0;
  for (const card of cards) {
    const haystack = `${card.dataset.name || ''} ${card.dataset.tags || ''}`.toLowerCase();
    const match = !q || haystack.includes(q);
    card.classList.toggle('hidden', !match);
    if (match) visible++;
  }
  empty.hidden = visible > 0;
}

input.addEventListener('input', applyFilter);
input.addEventListener('keydown', e => {
  if (e.key === 'Escape') { input.value = ''; applyFilter(); }
});
