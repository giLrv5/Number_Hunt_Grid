const startButton = document.getElementById('startButton');
const statusText = document.getElementById('status');
const countdownText = document.getElementById('countdown');
const grid = document.getElementById('grid');
const resultText = document.getElementById('result');

const TOTAL = 25;
const COUNTDOWN_SECONDS = 3;
const SYNTHETIC_CLICK_GUARD_MS = 450;

let expectedNumber = 1;
let startTime = null;
let lastActivatedCell = null;
let lastActivationTime = 0;
let isGameActive = false;
let countdownTimerId = null;
let errorCount = 0;

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

function resetToIdleState() {
  isGameActive = false;
  expectedNumber = 1;
  startTime = null;
  lastActivatedCell = null;
  lastActivationTime = 0;
  errorCount = 0;
  clearCountdownTimer();
  countdownText.classList.add('hidden');
  countdownText.textContent = '';
  grid.innerHTML = '';
  grid.classList.add('hidden');
  resultText.classList.add('hidden');
  resultText.innerHTML = '';
  statusText.textContent = '尚未開始';
  startButton.textContent = '開始';
  startButton.disabled = false;
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

function clearCountdownTimer() {
  if (countdownTimerId !== null) {
    window.clearTimeout(countdownTimerId);
    countdownTimerId = null;
  }
}

function showCountdown(secondsRemaining) {
  countdownText.textContent = String(secondsRemaining);
  countdownText.classList.remove('hidden');
  grid.classList.add('hidden');
}

function beginActiveGame() {
  if (!canPlayGameOnThisDevice()) {
    showDesktopWarning();
    return;
  }

  isGameActive = true;
  expectedNumber = 1;
  startTime = performance.now();
  lastActivatedCell = null;
  lastActivationTime = 0;
  errorCount = 0;

  buildGrid();
  countdownText.classList.add('hidden');
  countdownText.textContent = '';
  resultText.classList.add('hidden');
  resultText.innerHTML = '';
  grid.classList.remove('hidden');
  startButton.disabled = false;
  startButton.textContent = '重新開始';
  statusText.textContent = '請找：1';
}

function startCountdown(secondsRemaining = COUNTDOWN_SECONDS) {
  if (!canPlayGameOnThisDevice()) {
    showDesktopWarning();
    return;
  }

  clearCountdownTimer();
  isGameActive = false;
  expectedNumber = 1;
  startTime = null;
  lastActivatedCell = null;
  lastActivationTime = 0;
  errorCount = 0;
  resultText.classList.add('hidden');
  resultText.innerHTML = '';
  grid.innerHTML = '';
  startButton.disabled = true;
  startButton.textContent = '倒數中...';
  statusText.textContent = `倒數 ${secondsRemaining} 秒`;
  showCountdown(secondsRemaining);

  if (secondsRemaining <= 1) {
    countdownTimerId = window.setTimeout(() => {
      countdownTimerId = null;
      beginActiveGame();
    }, 1000);
    return;
  }

  countdownTimerId = window.setTimeout(() => {
    startCountdown(secondsRemaining - 1);
  }, 1000);
}

function finishGame() {
  isGameActive = false;
  const elapsedMs = performance.now() - startTime;
  const elapsedText = formatElapsedTime(elapsedMs);
  statusText.textContent = '完成！';
  resultText.innerHTML = `
    <h2 class="result-title">測驗完成</h2>
    <ul class="result-list">
      <li>花費時間：${elapsedText}</li>
      <li>錯誤次數：${errorCount} 次</li>
    </ul>
  `;
  resultText.classList.remove('hidden');
  startButton.textContent = '開始';
}

function formatElapsedTime(elapsedMs) {
  const totalSeconds = elapsedMs / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const secondsText = seconds.toFixed(2);

  if (minutes === 0) {
    return `${secondsText} 秒`;
  }

  return `${minutes} 分 ${secondsText} 秒`;
}

function activateCell(target) {
  if (!isGameActive || !(target instanceof HTMLButtonElement) || target.classList.contains('correct')) {
    return;
  }

  const clickedValue = Number(target.dataset.value);
  if (clickedValue !== expectedNumber) {
    errorCount += 1;
    return;
  }

  target.classList.add('correct');

  if (expectedNumber === TOTAL) {
    finishGame();
    return;
  }

  expectedNumber += 1;
  statusText.textContent = `請找：${expectedNumber}`;
}

function findCellFromTouch(event) {
  if (!('changedTouches' in event) || event.changedTouches.length === 0) {
    return null;
  }

  const touch = event.changedTouches[0];
  const touchedElement = document.elementFromPoint(touch.clientX, touch.clientY);

  if (!(touchedElement instanceof HTMLElement)) {
    return null;
  }

  return touchedElement.closest('.cell');
}

function shouldSkipSyntheticClick(target) {
  const elapsed = performance.now() - lastActivationTime;
  return target === lastActivatedCell && elapsed < SYNTHETIC_CLICK_GUARD_MS;
}

function handleGridInteraction(event) {
  const isTouchStart = event.type === 'touchstart';
  const isPointerDown = event.type === 'pointerdown';
  const isClick = event.type === 'click';

  if (isPointerDown && 'pointerType' in event && event.pointerType === 'touch') {
    return;
  }

  let target = null;

  if (isTouchStart) {
    target = findCellFromTouch(event);
  } else if (event.target instanceof HTMLElement) {
    target = event.target.closest('.cell');
  }

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  if (isTouchStart || isPointerDown) {
    event.preventDefault();
    lastActivatedCell = target;
    lastActivationTime = performance.now();
    activateCell(target);
    return;
  }

  if (isClick && shouldSkipSyntheticClick(target)) {
    return;
  }

  activateCell(target);
}

function handleStartButtonClick() {
  if (startButton.disabled) {
    return;
  }

  if (isGameActive || !grid.classList.contains('hidden') || !countdownText.classList.contains('hidden')) {
    resetToIdleState();
    return;
  }

  startCountdown();
}

function preventTapZoom(event) {
  event.preventDefault();
}

grid.addEventListener('touchstart', handleGridInteraction, { passive: false });
grid.addEventListener('pointerdown', handleGridInteraction);
grid.addEventListener('click', handleGridInteraction);
document.addEventListener('dblclick', preventTapZoom, { passive: false });
document.addEventListener('gesturestart', preventTapZoom, { passive: false });

if (!canPlayGameOnThisDevice()) {
  showDesktopWarning();
} else {
  resetToIdleState();
}

startButton.addEventListener('click', handleStartButtonClick);
