const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const WIDTH = 800;
const HEIGHT = 600;
canvas.width = WIDTH;
canvas.height = HEIGHT;

const colors = ['#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'];

const paddle = {
  w: 120,
  h: 14,
  x: WIDTH / 2 - 60,
  y: HEIGHT - 40,
  speed: 8,
};

const ball = {
  x: WIDTH / 2,
  y: HEIGHT / 2,
  r: 8,
  dx: 4,
  dy: -4,
  trail: [],
};

let bricks = [];
let particles = [];
let score = 0;
const keys = {};

function makeBricks(rows, cols) {
  const padding = 6;
  const offsetTop = 60;
  const offsetSide = 40;
  const w = (WIDTH - offsetSide * 2 - padding * (cols - 1)) / cols;
  const h = 20;
  const result = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result.push({
        x: offsetSide + c * (w + padding),
        y: offsetTop + r * (h + padding),
        w, h,
        color: colors[r % colors.length],
        alive: true,
      });
    }
  }
  return result;
}

bricks = makeBricks(5, 10);

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const x = (e.clientX - rect.left) * scaleX;
  paddle.x = x - paddle.w / 2;
});

canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const x = (e.touches[0].clientX - rect.left) * scaleX;
  paddle.x = x - paddle.w / 2;
}, { passive: false });

window.addEventListener('keydown', e => { keys[e.key] = true; });
window.addEventListener('keyup', e => { keys[e.key] = false; });

function spawnParticles(x, y, color) {
  for (let i = 0; i < 10; i++) {
    particles.push({
      x, y,
      dx: (Math.random() - 0.5) * 5,
      dy: (Math.random() - 0.5) * 5,
      life: 1,
      color,
    });
  }
}

function resetBall() {
  ball.x = paddle.x + paddle.w / 2;
  ball.y = paddle.y - 20;
  ball.dx = (Math.random() > 0.5 ? 1 : -1) * 4;
  ball.dy = -4;
  ball.trail = [];
}

function update() {
  if (keys['ArrowLeft']) paddle.x -= paddle.speed;
  if (keys['ArrowRight']) paddle.x += paddle.speed;
  paddle.x = Math.max(0, Math.min(WIDTH - paddle.w, paddle.x));

  ball.trail.push({ x: ball.x, y: ball.y });
  if (ball.trail.length > 10) ball.trail.shift();

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x - ball.r < 0) { ball.x = ball.r; ball.dx = -ball.dx; }
  if (ball.x + ball.r > WIDTH) { ball.x = WIDTH - ball.r; ball.dx = -ball.dx; }
  if (ball.y - ball.r < 0) { ball.y = ball.r; ball.dy = -ball.dy; }

  if (
    ball.y + ball.r > paddle.y &&
    ball.y - ball.r < paddle.y + paddle.h &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.w &&
    ball.dy > 0
  ) {
    const hitPos = (ball.x - paddle.x) / paddle.w;
    const angle = (hitPos - 0.5) * Math.PI * 0.6;
    const speed = Math.hypot(ball.dx, ball.dy);
    ball.dx = Math.sin(angle) * speed;
    ball.dy = -Math.abs(Math.cos(angle) * speed);
    ball.y = paddle.y - ball.r;
  }

  if (ball.y - ball.r > HEIGHT) {
    resetBall();
  }

  for (const b of bricks) {
    if (!b.alive) continue;
    if (
      ball.x + ball.r > b.x &&
      ball.x - ball.r < b.x + b.w &&
      ball.y + ball.r > b.y &&
      ball.y - ball.r < b.y + b.h
    ) {
      b.alive = false;
      score += 10;
      scoreEl.textContent = score;
      spawnParticles(b.x + b.w / 2, b.y + b.h / 2, b.color);

      const prevX = ball.x - ball.dx;
      const fromSide = prevX + ball.r <= b.x || prevX - ball.r >= b.x + b.w;
      if (fromSide) ball.dx = -ball.dx;
      else ball.dy = -ball.dy;
      break;
    }
  }

  if (bricks.every(b => !b.alive)) {
    const extraRows = Math.min(5, Math.floor(score / 500));
    bricks = makeBricks(5 + extraRows, 10);
  }

  for (const p of particles) {
    p.x += p.dx;
    p.y += p.dy;
    p.dy += 0.1;
    p.life -= 0.03;
  }
  particles = particles.filter(p => p.life > 0);
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  for (const b of bricks) {
    if (!b.alive) continue;
    ctx.fillStyle = b.color;
    roundRect(b.x, b.y, b.w, b.h, 4);
    ctx.fill();
  }

  ctx.fillStyle = '#e8e8f0';
  roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 7);
  ctx.fill();

  for (let i = 0; i < ball.trail.length; i++) {
    const t = ball.trail[i];
    const alpha = i / ball.trail.length;
    ctx.fillStyle = `rgba(232, 232, 240, ${alpha * 0.4})`;
    ctx.beginPath();
    ctx.arc(t.x, t.y, ball.r * alpha, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();

  for (const p of particles) {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
