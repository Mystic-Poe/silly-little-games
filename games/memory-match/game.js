const palette = [
  '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff',
  '#a0c4ff', '#bdb2ff', '#ffc6ff', '#ffadad',
];

const board = document.getElementById('board');
const movesEl = document.getElementById('moves');

let flipped = [];
let moves = 0;
let locked = false;

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildBoard() {
  board.innerHTML = '';
  flipped = [];
  moves = 0;
  movesEl.textContent = moves;

  const pairs = shuffle([...palette, ...palette]);

  for (const color of pairs) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.color = color;
    card.innerHTML = `
      <div class="card-inner">
        <div class="back-face"></div>
        <div class="face" style="--card-color: ${color}"></div>
      </div>
    `;
    card.addEventListener('click', () => onCardClick(card));
    board.appendChild(card);
  }
}

function onCardClick(card) {
  if (locked) return;
  if (card.classList.contains('flipped')) return;
  if (card.classList.contains('matched')) return;

  card.classList.add('flipped');
  flipped.push(card);

  if (flipped.length === 2) {
    moves++;
    movesEl.textContent = moves;
    locked = true;
    const [a, b] = flipped;
    const matched = a.dataset.color === b.dataset.color;
    setTimeout(() => {
      if (matched) {
        a.classList.add('matched');
        b.classList.add('matched');
      } else {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
      }
      flipped = [];
      locked = false;
      if (matched) checkWin();
    }, matched ? 300 : 750);
  }
}

function checkWin() {
  const total = board.querySelectorAll('.card').length;
  const done = board.querySelectorAll('.card.matched').length;
  if (done === total) {
    setTimeout(buildBoard, 1600);
  }
}

buildBoard();
