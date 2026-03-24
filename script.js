const startButton = document.getElementById('startButton');
const heroStartButton = document.getElementById('heroStartButton');
const startScreen = document.getElementById('startScreen');
const countdownText = document.getElementById('countdown');
const grid = document.getElementById('grid');
const resultText = document.getElementById('result');
const app = document.querySelector('.app');
const brandText = document.getElementById('brand');
const pageTitle = document.getElementById('pageTitle');
const introText = document.getElementById('intro');
const deviceHintText = document.getElementById('deviceHint');
const startScreenTitle = document.getElementById('startScreenTitle');
const startScreenText = document.getElementById('startScreenText');
const langZhButton = document.getElementById('langZhButton');
const langEnButton = document.getElementById('langEnButton');

const TOTAL = 25;
const COUNTDOWN_SECONDS = 3;
const SYNTHETIC_CLICK_GUARD_MS = 450;
const TAP_INTERACTION_GUARD_MS = 450;

const I18N = {
  zh: {
    htmlLang: 'zh-Hant',
    documentTitle: '碩仁的專注力練習',
    brand: '碩仁的專注力練習',
    pageTitle: '舒爾特方格（1~25）',
    intro: '依序點擊 1 到 25。點擊「開始」後才會顯示方格內容。',
    startScreenTitle: '準備好了就開始',
    startScreenText: '按下按鈕後會先倒數，再正式開始測驗。',
    start: '開始',
    restart: '重新開始',
    counting: '倒數中...',
    notStarted: '尚未開始',
    countdownStatus: (seconds) => `倒數 ${seconds} 秒`,
    findNumber: (value) => `請找：${value}`,
    completed: '完成！',
    nonTouchHint: '偵測到目前裝置可能不是觸碰裝置；仍可繼續進行測驗，建議改用觸控操作以獲得較佳體驗。',
    resultTitle: '完成了，做得很好！',
    elapsedLabel: '花費時間',
    errorLabel: '錯誤次數',
    errorsUnit: '次',
    guidanceTitle: '測驗說明',
    timeSeconds: (secondsText) => `${secondsText} 秒`,
    timeMinutesSeconds: (minutes, secondsText) => `${minutes} 分 ${secondsText} 秒`,
    gradeGuidance: [
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
    ],
    errorGuidance: {
      title: '錯誤次數同樣重要',
      items: [
        { maxErrors: 1, text: '0～1 次代表穩定。' },
        { maxErrors: 4, text: '2～4 次表示容易急躁。' },
        { maxErrors: Number.POSITIVE_INFINITY, text: '5 次以上代表衝動控制需要加強。' },
      ],
    },
  },
  en: {
    htmlLang: 'en',
    documentTitle: 'Shuo-Ren’s Focus Training',
    brand: 'Shuo-Ren’s Focus Training',
    pageTitle: 'Schulte Grid (1–25)',
    intro: 'Tap the numbers from 1 to 25 in order. The grid will appear only after you press “Start.”',
    startScreenTitle: 'Ready when you are',
    startScreenText: 'Press the button to begin a short countdown before the activity starts.',
    start: 'Start',
    restart: 'Restart',
    counting: 'Counting down...',
    notStarted: 'Not started yet',
    countdownStatus: (seconds) => `Countdown: ${seconds}s`,
    findNumber: (value) => `Find: ${value}`,
    completed: 'Finished!',
    nonTouchHint: 'A non-touch device was detected. You can still continue the activity, but touch input is recommended for the best experience.',
    resultTitle: 'Great job — you finished!',
    elapsedLabel: 'Time used',
    errorLabel: 'Errors',
    errorsUnit: '',
    guidanceTitle: 'How to read the result',
    timeSeconds: (secondsText) => `${secondsText} sec`,
    timeMinutesSeconds: (minutes, secondsText) => `${minutes} min ${secondsText} sec`,
    gradeGuidance: [
      {
        title: 'Grades 1–2',
        items: [
          { maxSeconds: 45, text: 'Within 45 seconds is excellent and suggests mature visual scanning with steady focus.' },
          { maxSeconds: 70, text: '46–70 seconds is within the expected developmental range.' },
          { maxSeconds: 100, text: '71–100 seconds suggests the search strategy is still developing.' },
          { maxSeconds: Number.POSITIVE_INFINITY, text: 'More than 100 seconds suggests continued practice may help, especially if distraction or rushing appears.' },
        ],
        note: 'For younger children, accuracy and steady sequencing matter more than pure speed.',
      },
      {
        title: 'Grades 3–4',
        items: [
          { maxSeconds: 35, text: 'Within 35 seconds is excellent.' },
          { maxSeconds: 55, text: '36–55 seconds is solid and stable.' },
          { maxSeconds: 80, text: '56–80 seconds is an average result.' },
          { maxSeconds: Number.POSITIVE_INFINITY, text: 'More than 80 seconds suggests additional focus practice may be helpful.' },
        ],
        note: 'At this stage, results often show three patterns: fast but error-prone, slow but careful, or both fast and steady. The ideal goal is both fast and steady.',
      },
      {
        title: 'Grades 5–6',
        items: [
          { maxSeconds: 30, text: 'Within 30 seconds is excellent.' },
          { maxSeconds: 45, text: '31–45 seconds suggests stable and mature performance.' },
          { maxSeconds: 65, text: '46–65 seconds is in the typical range.' },
          { maxSeconds: Number.POSITIVE_INFINITY, text: 'More than 65 seconds suggests sustained attention training may be useful.' },
        ],
        note: 'If an older child takes more than 80 seconds or makes more than 5 errors, it may be worth monitoring attention more closely.',
      },
    ],
    errorGuidance: {
      title: 'Errors matter too',
      items: [
        { maxErrors: 1, text: '0–1 errors suggests stable control.' },
        { maxErrors: 4, text: '2–4 errors suggests the child may rush easily.' },
        { maxErrors: Number.POSITIVE_INFINITY, text: '5 or more errors suggests impulse control needs more support.' },
      ],
    },
  },
};

let currentLanguage = 'zh';
let expectedNumber = 1;
let startTime = null;
let lastActivatedCell = null;
let lastActivationTime = 0;
let isGameActive = false;
let countdownTimerId = null;
let errorCount = 0;
let isOnStartScreen = true;
let lastResult = null;
let lastLanguageInteractionTime = 0;
let lastButtonInteraction = { key: '', time: 0 };
let isDeviceHintVisible = false;

function trackAnalyticsEvent(eventName, params = {}) {
  if (typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', eventName, params);
}

function getText() {
  return I18N[currentLanguage];
}

function isTouchDevice() {
  return navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
}

function hasCoarsePointer() {
  return window.matchMedia('(any-pointer: coarse)').matches || window.matchMedia('(pointer: coarse)').matches;
}

function hasCompactViewport() {
  return Math.min(window.innerWidth, window.innerHeight) <= 1024;
}

function canPlayGameOnThisDevice() {
  return isTouchDevice() || hasCoarsePointer() || hasCompactViewport();
}

function isLikelyNonTouchDevice() {
  return !canPlayGameOnThisDevice();
}

function updateDeviceHintVisibility(shouldShow) {
  isDeviceHintVisible = shouldShow && isLikelyNonTouchDevice();
  deviceHintText.classList.toggle('hidden', !isDeviceHintVisible);
}

function updateLanguageButtons() {
  const isZh = currentLanguage === 'zh';
  langZhButton.classList.toggle('is-active', isZh);
  langEnButton.classList.toggle('is-active', !isZh);
  langZhButton.setAttribute('aria-pressed', String(isZh));
  langEnButton.setAttribute('aria-pressed', String(!isZh));
}

function updateStatusText() {
  // Intentionally kept as a no-op because status text is hidden per UI request.
}

function renderResult() {
  if (!lastResult) {
    resultText.classList.add('hidden');
    resultText.innerHTML = '';
    return;
  }

  const text = getText();
  const elapsedText = formatElapsedTime(lastResult.elapsedMs);
  const errorValue = text.errorsUnit ? `${lastResult.errorCount} ${text.errorsUnit}` : String(lastResult.errorCount);

  resultText.innerHTML = `
    <h2 class="result-title">${text.resultTitle}</h2>
    <div class="result-metrics">
      <div class="result-card">
        <span class="result-card-label">${text.elapsedLabel}</span>
        <strong class="result-card-value">${elapsedText}</strong>
      </div>
      <div class="result-card">
        <span class="result-card-label">${text.errorLabel}</span>
        <strong class="result-card-value">${errorValue}</strong>
      </div>
    </div>
    <h3 class="result-guidance-title">${text.guidanceTitle}</h3>
    <div class="result-guidance">
      ${buildGuidanceMarkup(lastResult.elapsedMs / 1000, lastResult.errorCount)}
    </div>
  `;
  resultText.classList.remove('hidden');
}

function updateStaticTexts() {
  const text = getText();
  document.documentElement.lang = text.htmlLang;
  document.title = text.documentTitle;
  brandText.textContent = text.brand;
  pageTitle.textContent = text.pageTitle;
  introText.textContent = text.intro;
  deviceHintText.textContent = text.nonTouchHint;
  updateDeviceHintVisibility(isDeviceHintVisible);
  startScreenTitle.textContent = text.startScreenTitle;
  startScreenText.textContent = text.startScreenText;
  heroStartButton.textContent = text.start;

  if (isOnStartScreen) {
    startButton.textContent = text.start;
  } else if (isGameActive || !grid.classList.contains('hidden')) {
    startButton.textContent = text.restart;
  } else if (!countdownText.classList.contains('hidden')) {
    startButton.textContent = text.counting;
  } else if (lastResult) {
    startButton.textContent = text.restart;
  } else {
    startButton.textContent = text.start;
  }

  renderResult();
  updateStatusText();
  updateLanguageButtons();
}

function setLanguage(language) {
  if (!I18N[language] || language === currentLanguage) {
    return;
  }

  currentLanguage = language;
  updateStaticTexts();
  trackAnalyticsEvent('language_switch', {
    language: currentLanguage,
  });
}

function shouldSkipDuplicateLanguageInteraction() {
  const now = performance.now();
  const isDuplicate = now - lastLanguageInteractionTime < 400;
  lastLanguageInteractionTime = now;
  return isDuplicate;
}

function shouldSkipDuplicateButtonInteraction(interactionKey) {
  const now = performance.now();
  const isDuplicate = lastButtonInteraction.key === interactionKey && now - lastButtonInteraction.time < TAP_INTERACTION_GUARD_MS;
  lastButtonInteraction = { key: interactionKey, time: now };
  return isDuplicate;
}

function bindTapInteraction(element, interactionKey, handler) {
  const handleInteraction = (event) => {
    if (event.type === 'pointerup' && 'pointerType' in event && event.pointerType === 'mouse') {
      return;
    }

    if (shouldSkipDuplicateButtonInteraction(interactionKey)) {
      return;
    }

    if (event.cancelable) {
      event.preventDefault();
    }

    handler(event);
  };

  element.addEventListener('pointerup', handleInteraction);
  element.addEventListener('touchend', handleInteraction, { passive: false });
  element.addEventListener('click', handleInteraction);
}

function handleLanguageSwitch(language, event) {
  if (event && event.type === 'click' && shouldSkipDuplicateLanguageInteraction()) {
    return;
  }

  if (event) {
    event.preventDefault();
  }

  setLanguage(language);
}

function bindStartButtonHoverHint(element) {
  const showHint = () => {
    updateDeviceHintVisibility(true);
  };

  const hideHint = () => {
    updateDeviceHintVisibility(false);
  };

  element.addEventListener('mouseenter', showHint);
  element.addEventListener('mousemove', showHint);
  element.addEventListener('mouseleave', hideHint);
  element.addEventListener('blur', hideHint);
}

function getNeighborIndexes(index) {
  const row = Math.floor(index / 5);
  const col = index % 5;
  const neighbors = [];

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) {
        continue;
      }

      const nextRow = row + rowOffset;
      const nextCol = col + colOffset;

      if (nextRow < 0 || nextRow >= 5 || nextCol < 0 || nextCol >= 5) {
        continue;
      }

      neighbors.push(nextRow * 5 + nextCol);
    }
  }

  return neighbors;
}

function scoreBoard(values) {
  let score = 0;

  values.forEach((value, index) => {
    const neighbors = getNeighborIndexes(index);

    neighbors.forEach((neighborIndex) => {
      if (neighborIndex <= index) {
        return;
      }

      const diff = Math.abs(value - values[neighborIndex]);

      if (diff === 1) {
        score += 12;
      } else if (diff === 2) {
        score += 6;
      } else if (diff <= 4) {
        score += 2;
      }
    });
  });

  return score;
}

function buildDistributedValues() {
  const source = Array.from({ length: TOTAL }, (_, i) => i + 1);
  let bestValues = source;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let attempt = 0; attempt < 240; attempt += 1) {
    const candidate = shuffle(source);
    let candidateScore = scoreBoard(candidate);

    for (let swapAttempt = 0; swapAttempt < 80 && candidateScore > 0; swapAttempt += 1) {
      const firstIndex = Math.floor(Math.random() * candidate.length);
      let secondIndex = Math.floor(Math.random() * candidate.length);

      while (secondIndex === firstIndex) {
        secondIndex = Math.floor(Math.random() * candidate.length);
      }

      [candidate[firstIndex], candidate[secondIndex]] = [candidate[secondIndex], candidate[firstIndex]];
      const swappedScore = scoreBoard(candidate);

      if (swappedScore <= candidateScore) {
        candidateScore = swappedScore;
      } else {
        [candidate[firstIndex], candidate[secondIndex]] = [candidate[secondIndex], candidate[firstIndex]];
      }
    }

    if (candidateScore < bestScore) {
      bestValues = [...candidate];
      bestScore = candidateScore;
    }

    if (candidateScore === 0) {
      break;
    }
  }

  return bestValues;
}

function resetToIdleState() {
  isGameActive = false;
  isOnStartScreen = true;
  expectedNumber = 1;
  startTime = null;
  lastActivatedCell = null;
  lastActivationTime = 0;
  errorCount = 0;
  lastResult = null;
  clearCountdownTimer();
  countdownText.classList.add('hidden');
  countdownText.textContent = '';
  grid.innerHTML = '';
  grid.classList.add('hidden');
  resultText.classList.add('hidden');
  resultText.innerHTML = '';
  startScreen.classList.remove('hidden');
  startButton.classList.add('hidden');
  startButton.disabled = false;
  heroStartButton.disabled = false;
  updateDeviceHintVisibility(false);
  updateInteractionLock(false);
  updateStaticTexts();
  scrollAppToTop();
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
  const values = buildDistributedValues();

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
  updateStatusText();
}

function beginActiveGame() {
  isGameActive = true;
  isOnStartScreen = false;
  expectedNumber = 1;
  startTime = performance.now();
  lastActivatedCell = null;
  lastActivationTime = 0;
  errorCount = 0;
  lastResult = null;

  buildGrid();
  startScreen.classList.add('hidden');
  countdownText.classList.add('hidden');
  countdownText.textContent = '';
  resultText.classList.add('hidden');
  resultText.innerHTML = '';
  startButton.classList.remove('hidden');
  grid.classList.remove('hidden');
  startButton.disabled = false;
  heroStartButton.disabled = false;
  updateDeviceHintVisibility(false);
  startButton.textContent = getText().restart;
  updateStatusText();
  updateInteractionLock(true);
  scrollAppToTop();
}

function startCountdown(secondsRemaining = COUNTDOWN_SECONDS) {
  if (secondsRemaining === COUNTDOWN_SECONDS) {
    trackAnalyticsEvent('game_start', {
      language: currentLanguage,
    });
  }

  clearCountdownTimer();
  isGameActive = false;
  isOnStartScreen = false;
  expectedNumber = 1;
  startTime = null;
  lastActivatedCell = null;
  lastActivationTime = 0;
  errorCount = 0;
  lastResult = null;
  startScreen.classList.add('hidden');
  resultText.classList.add('hidden');
  resultText.innerHTML = '';
  grid.innerHTML = '';
  startButton.classList.remove('hidden');
  startButton.disabled = true;
  heroStartButton.disabled = true;
  updateDeviceHintVisibility(false);
  startButton.textContent = getText().counting;
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
  const elapsedSeconds = Number((elapsedMs / 1000).toFixed(2));
  lastResult = {
    elapsedMs,
    errorCount,
  };
  grid.classList.add('hidden');
  startButton.textContent = getText().restart;
  startButton.disabled = false;
  heroStartButton.disabled = false;
  updateInteractionLock(false);
  renderResult();
  updateStatusText();
  scrollAppToTop();
  resultText.scrollIntoView({ block: 'start', behavior: 'smooth' });
  trackAnalyticsEvent('game_complete', {
    language: currentLanguage,
    elapsed_seconds: elapsedSeconds,
    error_count: errorCount,
  });
}

function formatElapsedTime(elapsedMs) {
  const text = getText();
  const totalSeconds = elapsedMs / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const secondsText = seconds.toFixed(2);

  if (minutes === 0) {
    return text.timeSeconds(secondsText);
  }

  return text.timeMinutesSeconds(minutes, secondsText);
}

function buildGuidanceMarkup(elapsedSeconds, totalErrors) {
  const text = getText();
  const timeSectionsMarkup = text.gradeGuidance.map((group) => {
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
      <h4>${text.errorGuidance.title}</h4>
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
  const text = getText();
  let hasHighlightedItem = false;

  return text.errorGuidance.items.map((item) => {
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
  updateStatusText();
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

  if (isOnStartScreen) {
    startCountdown();
    return;
  }

  if (isGameActive || !grid.classList.contains('hidden') || !countdownText.classList.contains('hidden') || !resultText.classList.contains('hidden')) {
    resetToIdleState();
    return;
  }

  startCountdown();
}

function handleHeroStartButtonClick() {
  if (heroStartButton.disabled) {
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

function scrollAppToTop() {
  if (app instanceof HTMLElement) {
    app.scrollTo({ top: 0, behavior: 'auto' });
  }
}

grid.addEventListener('touchstart', handleGridInteraction, { passive: false });
grid.addEventListener('pointerdown', handleGridInteraction);
grid.addEventListener('click', handleGridInteraction);
document.addEventListener('touchmove', preventTouchScroll, { passive: false });
document.addEventListener('dblclick', preventTapZoom, { passive: false });
document.addEventListener('gesturestart', preventTapZoom, { passive: false });
bindTapInteraction(startButton, 'start-button', handleStartButtonClick);
bindTapInteraction(heroStartButton, 'hero-start-button', handleHeroStartButtonClick);
bindTapInteraction(langZhButton, 'lang-zh', (event) => handleLanguageSwitch('zh', event));
bindTapInteraction(langEnButton, 'lang-en', (event) => handleLanguageSwitch('en', event));
bindStartButtonHoverHint(startButton);
bindStartButtonHoverHint(heroStartButton);

resetToIdleState();
