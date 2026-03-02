const startButton = document.getElementById('startButton');
const statusText = document.getElementById('status');
const grid = document.getElementById('grid');
const resultText = document.getElementById('result');

const TOTAL = 25;

let expectedNumber = 1;
let startTime = null;

function isTouchDevice() {
  return navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
}

function isMobileOrTablet() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/.test(userAgent);
  const isTablet = /ipad|tablet|playbook|silk|kindle/.test(userAgent);
  return isMobile || isTablet;
}

function canPlayGameOnThisDevice() {
  return isTouchDevice() && isMobileOrTablet();
}

function showDesktopWarning() {
  startButton.disabled = true;
  statusText.textContent = '此遊戲僅限「可觸控」的手機或平板裝置使用。請改用手機/平板開啟。';
  grid.classList.add('hidden');
  resultText.classList.add('hidden');
}

function shuffle(numbers) {
  const arr = [...numbers];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildGrid() {
  grid.innerHTML = '';
  const values = shuffle(Array.from({ length: TOTAL }, (_, i) => i + 1));

  values.forEach((value) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cell';
    cell.textContent = String(value);
    cell.dataset.value = String(value);
    grid.appendChild(cell);
  });
}

function startGame() {
  if (!canPlayGameOnThisDevice()) {
    showDesktopWarning();
    return;
  }

  expectedNumber = 1;
  startTime = performance.now();
  buildGrid();

  resultText.classList.add('hidden');
  resultText.textContent = '';

  grid.classList.remove('hidden');
  startButton.textContent = '重新開始';
  statusText.textContent = '請找：1';
}

function finishGame() {
  const elapsedMs = performance.now() - startTime;
  const seconds = (elapsedMs / 1000).toFixed(2);
  statusText.textContent = '完成！';
  resultText.textContent = `完成時間：${seconds} 秒`;
  resultText.classList.remove('hidden');
}

grid.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const clickedValue = Number(target.dataset.value);

  if (clickedValue !== expectedNumber || target.classList.contains('correct')) {
    return;
  }

  target.classList.add('correct');
  target.disabled = true;

  if (expectedNumber === TOTAL) {
    finishGame();
    return;
  }

  expectedNumber += 1;
  statusText.textContent = `請找：${expectedNumber}`;
});

if (!canPlayGameOnThisDevice()) {
  showDesktopWarning();
}

startButton.addEventListener('click', startGame);
