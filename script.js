const startButton = document.getElementById('startButton');
const statusText = document.getElementById('status');
const countdownText = document.getElementById('countdown');
const grid = document.getElementById('grid');
const resultText = document.getElementById('result');

const TOTAL = 25;
const COUNTDOWN_SECONDS = 3;
const SYNTHETIC_CLICK_GUARD_MS = 450;
const GRADE_GUIDANCE = [
  {
    title: '一年級～二年級',
    items: [
      { maxSeconds: 45, text: '45 秒內屬於優秀，代表視覺搜尋速度成熟、專注穩定。' },
      { maxSeconds: 70, text: '46～70 秒為正常發展範圍。' },
      { maxSeconds: 100, text: '71～100 秒表示搜尋策略仍在發展中。' },
      { maxSeconds: Number.POSITIVE_INFINITY, text: '超過 100 秒，建議持續練習並觀察是否容易分心或急躁。' },
    ],
    note: '低年級重點不是拼快，而是能否依序穩定完成、不跳號、不亂點。',
  },
  {
    title: '三年級～四年級',
    items: [
      { maxSeconds: 35, text: '35 秒內屬於優秀。' },
      { maxSeconds: 55, text: '36～55 秒為穩定良好。' },
      { maxSeconds: 80, text: '56～80 秒為一般水準。' },
      { maxSeconds: Number.POSITIVE_INFINITY, text: '超過 80 秒建議加強專注訓練。' },
    ],
    note: '這個階段會明顯分出三種型態：快但錯多（衝動型）、慢但穩定（保守型）、又快又穩（成熟型）；真正理想的是又快又穩。',
  },
  {
    title: '五年級～六年級',
    items: [
      { maxSeconds: 30, text: '30 秒內屬於優秀。' },
      { maxSeconds: 45, text: '31～45 秒為穩定成熟。' },
      { maxSeconds: 65, text: '46～65 秒為普通水準。' },
      { maxSeconds: Number.POSITIVE_INFINITY, text: '超過 65 秒建議加強專注持續力訓練。' },
    ],
    note: '若高年級超過 80 秒，或錯誤超過 5 次，建議納入專注力觀察。',
  },
];
const ERROR_GUIDANCE = {
  title: '錯誤次數同樣重要',
  items: [
    { maxErrors: 1, text: '0～1 次代表穩定。' },
    { maxErrors: 4, text: '2～4 次表示容易急躁。' },
    { maxErrors: Number.POSITIVE_INFINITY, text: '5 次以上代表衝動控制需要加強。' },
  ],
};

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
  updateInteractionLock(false);
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
  updateInteractionLock(false);
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
  updateInteractionLock(true);
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
  updateInteractionLock(true);

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
  const elapsedSeconds = elapsedMs / 1000;
  statusText.textContent = '完成！';
  grid.classList.add('hidden');
  resultText.innerHTML = `
    <h2 class="result-title">完成了，做得很好！</h2>
    <div class="result-metrics">
      <div class="result-card">
        <span class="result-card-label">花費時間</span>
        <strong class="result-card-value">${elapsedText}</strong>
      </div>
      <div class="result-card">
        <span class="result-card-label">錯誤次數</span>
        <strong class="result-card-value">${errorCount} 次</strong>
      </div>
    </div>
    <h3 class="result-guidance-title">測驗說明</h3>
    <div class="result-guidance">
      ${buildGuidanceMarkup(elapsedSeconds, errorCount)}
    </div>
  `;
  resultText.classList.remove('hidden');
  resultText.scrollIntoView({ block: 'start', behavior: 'smooth' });
  startButton.textContent = '開始';
  updateInteractionLock(false);
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

function buildGuidanceMarkup(elapsedSeconds, totalErrors) {
  const timeSectionsMarkup = GRADE_GUIDANCE.map((group) => {
    return `
      <section class="note-group note-group--result">
        <h4>${group.title}</h4>
        <ul>${highlightFirstMatchingTimeItem(group.items, elapsedSeconds)}</ul>
        <p class="note-highlight-text">${group.note}</p>
      </section>
    `;
  }).join('');

  return `
    ${timeSectionsMarkup}
    <section class="note-group note-group--result note-group--errors">
      <h4>${ERROR_GUIDANCE.title}</h4>
      <ul>${highlightErrorItems(totalErrors)}</ul>
    </section>
  `;
}

function highlightFirstMatchingTimeItem(items, elapsedSeconds) {
  let hasHighlightedItem = false;

  return items.map((item) => {
    const isActive = !hasHighlightedItem && elapsedSeconds <= item.maxSeconds;
    if (isActive) {
      hasHighlightedItem = true;
    }

    const activeClass = isActive ? 'note-item--active' : '';
    return `<li class="${activeClass}">${item.text}</li>`;
  }).join('');
}

function highlightErrorItems(totalErrors) {
  let hasHighlightedItem = false;

  return ERROR_GUIDANCE.items.map((item) => {
    const isActive = !hasHighlightedItem && totalErrors <= item.maxErrors;
    if (isActive) {
      hasHighlightedItem = true;
    }

    const activeClass = isActive ? 'note-item--active' : '';
    return `<li class="${activeClass}">${item.text}</li>`;
  }).join('');
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

function isInteractionLocked() {
  return document.body.classList.contains('interaction-locked');
}

function updateInteractionLock(shouldLock) {
  document.body.classList.toggle('interaction-locked', shouldLock);
}

function preventTouchScroll(event) {
  if (isInteractionLocked()) {
    event.preventDefault();
  }
}

grid.addEventListener('touchstart', handleGridInteraction, { passive: false });
grid.addEventListener('pointerdown', handleGridInteraction);
grid.addEventListener('click', handleGridInteraction);
document.addEventListener('touchmove', preventTouchScroll, { passive: false });
document.addEventListener('dblclick', preventTapZoom, { passive: false });
document.addEventListener('gesturestart', preventTapZoom, { passive: false });

if (!canPlayGameOnThisDevice()) {
  showDesktopWarning();
} else {
  resetToIdleState();
}

startButton.addEventListener('click', handleStartButtonClick);
