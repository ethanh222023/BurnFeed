const quizForm = document.getElementById("quizForm");
const questionsContainer = document.getElementById("questionsContainer");
const formMessage = document.getElementById("formMessage");
const resultModal = document.getElementById("resultModal");
const resultImage = document.getElementById("resultImage");
const resultName = document.getElementById("resultName");
const resultText = document.getElementById("resultText");
const closeModalBtn = document.getElementById("closeModalBtn");
const resetKeepAnswersBtn = document.getElementById("resetKeepAnswersBtn");
const sideAdModal = document.getElementById("sideAdModal");
const sideAdModalTitle = document.getElementById("sideAdModalTitle");
const sideAdModalImage = document.getElementById("sideAdModalImage");
const sideAdModalText = document.getElementById("sideAdModalText");
const closeSideAdModalBtn = document.getElementById("closeSideAdModalBtn");
const floatingAdsLayer = document.getElementById("floatingAdsLayer");
const jumpscareOverlay = document.getElementById("jumpscareOverlay");
const jumpscareImage = document.getElementById("jumpscareImage");

let persistenceListenerAttached = false;
let adEngineStarted = false;
let adTimerId = null;
let popupsDisabledUntil = 0;
let activePopupCount = 0;
let scaryAudioContext = null;
let customJumpscareAudio = null;
let sideAdRotationTimer = null;
let multiplyFamilyCounter = 0;
let activeMultiplyFamily = null;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setScrollLock(shouldLock) {
  document.body.classList.toggle("no-scroll", shouldLock);
}

function uniqueItems(items) {
  return [...new Set(items.filter(Boolean))];
}

function buildCaseVariants(value) {
  if (!value) {
    return [];
  }

  return uniqueItems([
    value,
    value.toLowerCase(),
    value.toUpperCase(),
    value.charAt(0).toUpperCase() + value.slice(1),
    value.charAt(0).toLowerCase() + value.slice(1)
  ]);
}

function buildImageCandidates(path) {
  if (!path) {
    return [];
  }

  const slashIndex = path.lastIndexOf("/");
  const basename = slashIndex >= 0 ? path.slice(slashIndex + 1) : path;
  const dir = slashIndex >= 0 ? path.slice(0, slashIndex + 1) : "";
  const dotIndex = basename.lastIndexOf(".");
  const candidates = [path, basename];

  const directoryVariants = uniqueItems([
    dir,
    dir.replace(/^\.\//, ""),
    dir.replace(/^assets\/ads\//i, ""),
    dir.replace(/^assets\/matches\//i, ""),
    "assets/ads/",
    "assets/matches/",
    ""
  ]);

  if (dotIndex > 0) {
    const stem = basename.slice(0, dotIndex);
    const ext = basename.slice(dotIndex + 1);
    const stemVariants = buildCaseVariants(stem);
    const extensionVariants = buildCaseVariants(ext);

    directoryVariants.forEach((dirVariant) => {
      stemVariants.forEach((stemVariant) => {
        extensionVariants.forEach((extVariant) => {
          candidates.push(`${dirVariant}${stemVariant}.${extVariant}`);
        });
      });
    });
  }

  return uniqueItems(candidates.filter(Boolean));
}

function buildPlaceholderDataUri(label) {
  const safeLabel = String(label || "IMAGE").slice(0, 60);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
      <rect width="1200" height="675" rx="32" fill="#f1f1f1"/>
      <rect x="24" y="24" width="1152" height="627" rx="28" fill="#fafafa" stroke="#d8d8d8" stroke-width="6"/>
      <text x="600" y="320" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="58" font-weight="800" fill="#555">${safeLabel}</text>
      <text x="600" y="385" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="30" fill="#777">Image not found at provided path</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function setManagedImage(imgElement, desiredPath, altText, placeholderLabel) {
  if (!imgElement) {
    return;
  }

  const candidates = buildImageCandidates(desiredPath);
  let candidateIndex = 0;

  imgElement.alt = altText || "";
  imgElement.dataset.originalPath = desiredPath || "";

  const tryNextSource = () => {
    if (candidateIndex < candidates.length) {
      imgElement.src = candidates[candidateIndex];
      candidateIndex += 1;
      return;
    }

    imgElement.onerror = null;
    imgElement.src = buildPlaceholderDataUri(placeholderLabel || altText || "IMAGE");
  };

  imgElement.onerror = tryNextSource;
  tryNextSource();
}

function renderQuestions() {
  const savedAnswers = getSavedAnswers();

  questionsContainer.innerHTML = QUIZ_QUESTIONS.map((question, index) => {
    const optionsHtml = question.options
      .map((option, optionIndex) => {
        const optionId = `${question.id}-${optionIndex}`;
        const checked = savedAnswers[question.id] === option ? "checked" : "";

        return `
          <label class="option-label" for="${optionId}">
            <input
              type="radio"
              id="${optionId}"
              name="${question.id}"
              value="${escapeHtml(option)}"
              ${checked}
              required
            />
            <span>${escapeHtml(option)}</span>
          </label>
        `;
      })
      .join("");

    return `
      <section class="question-card">
        <p class="question-number">Question ${index + 1}</p>
        <h2 class="question-title">${escapeHtml(question.question)}</h2>
        <div class="option-list">${optionsHtml}</div>
      </section>
    `;
  }).join("");
}

function getSavedAnswers() {
  try {
    return JSON.parse(localStorage.getItem(BURNFEED_CONFIG.storageKeyAnswers)) || {};
  } catch (error) {
    return {};
  }
}

function saveAnswers(answers) {
  localStorage.setItem(BURNFEED_CONFIG.storageKeyAnswers, JSON.stringify(answers));
}

function hasLoggedFirstSubmit() {
  return localStorage.getItem(BURNFEED_CONFIG.storageKeyLogged) === "true";
}

function setLoggedFirstSubmit() {
  localStorage.setItem(BURNFEED_CONFIG.storageKeyLogged, "true");
}

function getFormAnswers() {
  const formData = new FormData(quizForm);
  const answers = {};

  QUIZ_QUESTIONS.forEach((question) => {
    answers[question.id] = formData.get(question.id) || "";
  });

  return answers;
}

function allQuestionsAnswered(answers) {
  return QUIZ_QUESTIONS.every((question) => Boolean(answers[question.id]));
}

function deterministicHash(input) {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function findMatchFromAnswers(answers) {
  const normalized = QUIZ_QUESTIONS.map((question) => `${question.id}:${answers[question.id]}`).join("|");
  const hash = deterministicHash(normalized);
  const matchIndex = hash % MATCHES.length;
  return MATCHES[matchIndex];
}

function openResultModal(match) {
  setManagedImage(resultImage, match.image, `${match.name} result image`, match.name);
  resultName.textContent = match.name;
  resultText.innerHTML = match.text.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  resultModal.classList.remove("hidden");
  resultModal.setAttribute("aria-hidden", "false");
  setScrollLock(true);
}

function closeResultModal() {
  resultModal.classList.add("hidden");
  resultModal.setAttribute("aria-hidden", "true");
  refreshScrollLock();
}

function openSideAdModal(ad) {
  sideAdModalTitle.textContent = ad.title;
  setManagedImage(sideAdModalImage, ad.modalImage, `${ad.title} expanded ad`, ad.title);
  sideAdModalText.innerHTML = (ad.copy || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  sideAdModal.classList.remove("hidden");
  sideAdModal.setAttribute("aria-hidden", "false");
  setScrollLock(true);
}

function closeSideAdModal() {
  sideAdModal.classList.add("hidden");
  sideAdModal.setAttribute("aria-hidden", "true");
  refreshScrollLock();
}

function refreshScrollLock() {
  const modalIsOpen = !resultModal.classList.contains("hidden") || !sideAdModal.classList.contains("hidden");
  setScrollLock(modalIsOpen);
}

async function logFirstSubmission(answers, match) {
  if (hasLoggedFirstSubmit()) {
    return { skipped: true, reason: "already-logged" };
  }

  const url = BURNFEED_CONFIG.googleScriptUrl;

  if (!url || url.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")) {
    return { skipped: true, reason: "missing-script-url" };
  }

  const payload = {
    submittedAt: new Date().toISOString(),
    resultId: match.id,
    resultName: match.name,
    answers
  };

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  });

  setLoggedFirstSubmit();
  return { skipped: false };
}

function attachPersistenceListeners() {
  if (persistenceListenerAttached) {
    return;
  }

  quizForm.addEventListener("change", () => {
    const answers = getFormAnswers();
    saveAnswers(answers);
  });

  persistenceListenerAttached = true;
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }
  return items[Math.floor(Math.random() * items.length)];
}

function randomItemExcluding(items, excludedValue = null) {
  const filtered = items.filter((item) => item !== excludedValue);

  if (filtered.length === 0) {
    return excludedValue;
  }

  return filtered[Math.floor(Math.random() * filtered.length)];
}

function resolveGlobalArray(name, fallback = []) {
  const directValue = typeof globalThis[name] !== "undefined" ? globalThis[name] : undefined;
  if (Array.isArray(directValue) && directValue.length > 0) {
    return directValue.slice();
  }

  try {
    const lexicalValue = Function(`return typeof ${name} !== "undefined" ? ${name} : undefined;`)();
    if (Array.isArray(lexicalValue) && lexicalValue.length > 0) {
      return lexicalValue.slice();
    }
  } catch (error) {}

  return Array.isArray(fallback) ? fallback.slice() : [];
}

function resolveGlobalObject(name, fallback = null) {
  const directValue = typeof globalThis[name] !== "undefined" ? globalThis[name] : undefined;
  if (directValue && typeof directValue === "object") {
    return directValue;
  }

  try {
    const lexicalValue = Function(`return typeof ${name} !== "undefined" ? ${name} : undefined;`)();
    if (lexicalValue && typeof lexicalValue === "object") {
      return lexicalValue;
    }
  } catch (error) {}

  return fallback;
}

function getResolvedSideAdImagePool() {
  const resolved = resolveGlobalArray("SIDE_AD_IMAGE_POOL");
  if (resolved.length > 0) {
    return resolved;
  }

  const sideAds = resolveGlobalArray("SIDE_ADS");
  return sideAds
    .flatMap((ad) => Array.isArray(ad.thumbs) ? ad.thumbs : [])
    .filter(Boolean);
}

function getResolvedClickableSideAds() {
  const resolved = resolveGlobalObject("CLICKABLE_SIDE_ADS", null);
  if (resolved) {
    return resolved;
  }

  return {
    "assets/ads/Free_ad.jpg": {
      modalImage: "assets/ads/Crispy_ad.PNG",
      copy: [
        "Replace this with whatever larger image you want for the Free ad popup.",
        "This ad is clickable because apparently even fake banners need hierarchy."
      ]
    },
    "assets/ads/15year_ad.jpg": {
      modalImage: "assets/ads/15year_ad_popup.jpg",
      copy: [
        "Replace this with whatever larger image you want for the 15 year ad popup.",
        "Only this and the Free ad are supposed to interrupt people even more than the rest."
      ]
    }
  };
}

function getResolvedPopupAdImagePool() {
  const resolved = resolveGlobalArray("POPUP_AD_IMAGE_POOL");
  if (resolved.length > 0) {
    return resolved;
  }

  const popupAds = resolveGlobalArray("POPUP_ADS");
  return popupAds
    .filter((ad) => ad && ad.type !== "jumpscare" && ad.image)
    .map((ad) => ad.image);
}

function getRandomSideAdPair() {
  const pool = getResolvedSideAdImagePool();

  if (pool.length === 0) {
    return [null, null];
  }

  if (pool.length === 1) {
    return [pool[0], pool[0]];
  }

  const first = randomItem(pool);
  const second = randomItemExcluding(pool, first);
  return [first, second];
}

function getPopupImageForAd(ad) {
  if (ad.type === "jumpscare") {
    return ad.image;
  }

  const pool = getResolvedPopupAdImagePool();

  if (pool.length === 0) {
    return ad.image || "";
  }

  return randomItem(pool);
}

function weightedRandomType(weights) {
  const entries = Object.entries(weights || {}).filter(([, value]) => Number(value) > 0);

  if (entries.length === 0) {
    return null;
  }

  const total = entries.reduce((sum, [, value]) => sum + Number(value), 0);
  let roll = Math.random() * total;

  for (const [type, value] of entries) {
    roll -= Number(value);
    if (roll <= 0) {
      return type;
    }
  }

  return entries[entries.length - 1][0];
}

function pickWeightedPopupAd() {
  const configuredWeights = BURNFEED_CONFIG.popupTypeWeights || {
    default: 0.4,
    multiply: 0.3,
    jumpscare: 0.3
  };

  let chosenType = weightedRandomType(configuredWeights);

  if (chosenType === "multiply" && activeMultiplyFamily) {
    const fallbackWeights = { ...configuredWeights, multiply: 0 };
    chosenType = weightedRandomType(fallbackWeights) || "default";
  }

  const candidates = POPUP_ADS.filter((item) => item.type === chosenType);

  if (candidates.length === 0) {
    return randomItem(POPUP_ADS);
  }

  return randomItem(candidates);
}

function getPopupPosition() {
  const width = Math.min(window.innerWidth - 20, 420);
  const maxLeft = Math.max(12, window.innerWidth - width - 12);
  const maxTop = Math.max(100, window.innerHeight - 320);

  return {
    left: randomBetween(12, maxLeft),
    top: randomBetween(90, maxTop)
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function scheduleNextPopup() {
  window.clearTimeout(adTimerId);
  const delay = randomBetween(BURNFEED_CONFIG.popupIntervalMinMs, BURNFEED_CONFIG.popupIntervalMaxMs);
  adTimerId = window.setTimeout(maybeSpawnRandomPopup, delay);
}

function startAdEngine() {
  if (adEngineStarted) {
    return;
  }

  adEngineStarted = true;
  scheduleNextPopup();
}

function maybeSpawnRandomPopup() {
  if (!adEngineStarted) {
    return;
  }

  if (Date.now() < popupsDisabledUntil) {
    scheduleNextPopup();
    return;
  }

  if (activePopupCount >= BURNFEED_CONFIG.maxSimultaneousPopups) {
    scheduleNextPopup();
    return;
  }

  const ad = pickWeightedPopupAd();

  if (ad.type === "default") {
    openDefaultPopupAd(ad);
  } else if (ad.type === "multiply") {
    openMultiplyPopupAd(ad);
  } else {
    triggerJumpscare(ad);
  }

  scheduleNextPopup();
}

function bringPopupToFront(popup) {
  const current = Number(floatingAdsLayer.dataset.topZIndex || "120");
  const next = current + 1;
  floatingAdsLayer.dataset.topZIndex = String(next);
  popup.style.zIndex = String(next);
}

function makePopupDraggable(popup) {
  if (!popup) {
    return;
  }

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let originLeft = 0;
  let originTop = 0;

  const getClientPoint = (event) => {
    if (event.touches && event.touches[0]) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }

    if (event.changedTouches && event.changedTouches[0]) {
      return { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
    }

    return { x: event.clientX, y: event.clientY };
  };

  const onDragMove = (event) => {
    if (!isDragging) {
      return;
    }

    const point = getClientPoint(event);
    const popupWidth = popup.offsetWidth;
    const popupHeight = popup.offsetHeight;
    const maxLeft = Math.max(8, window.innerWidth - popupWidth - 8);
    const maxTop = Math.max(8, window.innerHeight - popupHeight - 8);
    const nextLeft = clamp(originLeft + (point.x - startX), 8, maxLeft);
    const nextTop = clamp(originTop + (point.y - startY), 8, maxTop);

    popup.style.left = `${nextLeft}px`;
    popup.style.top = `${nextTop}px`;

    if (event.cancelable) {
      event.preventDefault();
    }
  };

  const stopDragging = () => {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    popup.classList.remove("dragging");
    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup", stopDragging);
    document.removeEventListener("touchmove", onDragMove);
    document.removeEventListener("touchend", stopDragging);
    document.removeEventListener("touchcancel", stopDragging);
  };

  const startDragging = (event) => {
    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    if (event.target.closest("button") || event.target.closest("a") || event.target.closest("input") || event.target.closest("label")) {
      return;
    }

    const point = getClientPoint(event);
    isDragging = true;
    startX = point.x;
    startY = point.y;

    const rect = popup.getBoundingClientRect();
    originLeft = rect.left;
    originTop = rect.top;

    popup.style.left = `${originLeft}px`;
    popup.style.top = `${originTop}px`;
    popup.classList.add("dragging");
    bringPopupToFront(popup);

    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("touchmove", onDragMove, { passive: false });
    document.addEventListener("touchend", stopDragging);
    document.addEventListener("touchcancel", stopDragging);

    if (event.cancelable) {
      event.preventDefault();
    }
  };

  popup.style.touchAction = "none";
  popup.querySelectorAll("img").forEach((img) => {
    img.draggable = false;
  });

  popup.addEventListener("mousedown", startDragging);
  popup.addEventListener("touchstart", startDragging, { passive: false });
  popup.addEventListener("mousedown", () => bringPopupToFront(popup));
  popup.addEventListener("touchstart", () => bringPopupToFront(popup), { passive: true });
}

function createPopupShell(title) {
  const popup = document.createElement("section");
  const position = getPopupPosition();

  popup.className = "ad-window";
  popup.style.left = `${position.left}px`;
  popup.style.top = `${position.top}px`;
  popup.innerHTML = `
    <div class="ad-window-header" title="Drag me around like the cursed desktop relic I am">
      <p class="ad-window-title">${escapeHtml(title)}</p>
      <button class="ad-window-close" type="button" aria-label="Close ad">×</button>
    </div>
    <div class="ad-window-content"></div>
    <div class="ad-window-action-row"></div>
  `;

  floatingAdsLayer.appendChild(popup);
  activePopupCount += 1;
  makePopupDraggable(popup);
  bringPopupToFront(popup);
  return popup;
}

function destroyPopup(popup) {
  if (!popup || !popup.parentNode) {
    return;
  }

  popup.parentNode.removeChild(popup);
  activePopupCount = Math.max(0, activePopupCount - 1);
}

function pausePopupSpawns(ms) {
  popupsDisabledUntil = Date.now() + ms;
}

function fillPopupImage(contentContainer, popupImage, title) {
  contentContainer.innerHTML = `
    <img class="ad-window-image" alt="${escapeHtml(title)}" />
    <p class="ad-window-copy"></p>
  `;
  const img = contentContainer.querySelector(".ad-window-image");
  setManagedImage(img, popupImage, title, title);
  return contentContainer.querySelector(".ad-window-copy");
}

function openDefaultPopupAd(forcedAd = null) {
  const ad = forcedAd || randomItem(POPUP_ADS.filter((item) => item.type === "default"));
  const popup = createPopupShell(ad.title);
  const content = popup.querySelector(".ad-window-content");
  const actionRow = popup.querySelector(".ad-window-action-row");
  const closeButton = popup.querySelector(".ad-window-close");
  const popupImage = getPopupImageForAd(ad);

  const copy = fillPopupImage(content, popupImage, ad.title);
  copy.textContent = ad.body;

  actionRow.innerHTML = `<button class="ad-window-action" type="button">Learn More</button>`;

  const close = () => destroyPopup(popup);
  closeButton.addEventListener("click", close);
  actionRow.querySelector("button").addEventListener("click", close);
}

function createMultiplyFamily(ad) {
  activeMultiplyFamily = {
    id: `family-${++multiplyFamilyCounter}`,
    ad,
    round: 0,
    openCount: 0,
    finished: false
  };

  spawnMultiplyWave(activeMultiplyFamily, 1, "1");
}

function finalizeMultiplyFamilyIfDone(family) {
  if (!activeMultiplyFamily || activeMultiplyFamily.id !== family.id) {
    return;
  }

  if (family.openCount === 0 && family.finished) {
    activeMultiplyFamily = null;
  }
}

function onMultiplyPopupClosed(family, popupLabel) {
  if (!activeMultiplyFamily || activeMultiplyFamily.id !== family.id) {
    return;
  }

  family.openCount = Math.max(0, family.openCount - 1);

  if (family.openCount === 0) {
    if (family.round < BURNFEED_CONFIG.multiplyPopupRounds) {
      family.round += 1;
      const spawnCount = Math.min(2 ** family.round, BURNFEED_CONFIG.maxSimultaneousPopups + 2);
      spawnMultiplyWave(family, spawnCount, popupLabel);
    } else {
      family.finished = true;
      finalizeMultiplyFamilyIfDone(family);
    }
  }
}

function spawnMultiplyWave(family, count, parentLabel) {
  if (!activeMultiplyFamily || activeMultiplyFamily.id !== family.id) {
    return;
  }

  for (let i = 0; i < count; i += 1) {
    if (activePopupCount >= BURNFEED_CONFIG.maxSimultaneousPopups + 2) {
      break;
    }

    buildMultiplyPopup(family, `${parentLabel}.${i + 1}`);
  }
}

function buildMultiplyPopup(family, lineageLabel) {
  const ad = family.ad;
  const popup = createPopupShell(`${ad.title} ${lineageLabel}`);
  const content = popup.querySelector(".ad-window-content");
  const actionRow = popup.querySelector(".ad-window-action-row");
  const closeButton = popup.querySelector(".ad-window-close");
  const popupImage = getPopupImageForAd(ad);

  family.openCount += 1;

  const copy = fillPopupImage(content, popupImage, ad.title);
  copy.textContent = `${ad.body} Round ${family.round + 1} of ${BURNFEED_CONFIG.multiplyPopupRounds + 1}. The next wave will not appear until every clone from this round is actually closed. Progress, somehow.`;

  actionRow.innerHTML = `<button class="ad-window-action" type="button">Maybe Later</button>`;

  const close = () => {
    destroyPopup(popup);
    onMultiplyPopupClosed(family, lineageLabel);
  };

  closeButton.addEventListener("click", close);
  actionRow.querySelector("button").addEventListener("click", close);
}

function openMultiplyPopupAd(forcedAd = null) {
  if (activeMultiplyFamily) {
    return;
  }

  const ad = forcedAd || randomItem(POPUP_ADS.filter((item) => item.type === "multiply"));
  createMultiplyFamily(ad);
}

function ensureAudioContext() {
  if (!scaryAudioContext) {
    scaryAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (scaryAudioContext.state === "suspended") {
    scaryAudioContext.resume().catch(() => {});
  }

  return scaryAudioContext;
}

function createNoiseBuffer(ctx, durationSeconds) {
  const length = Math.floor(ctx.sampleRate * durationSeconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < length; i += 1) {
    channelData[i] = (Math.random() * 2 - 1) * (1 - i / length * 0.45);
  }

  return buffer;
}

function playCustomJumpscareSound() {
  const customPath = BURNFEED_CONFIG.customJumpscareSound || "";

  if (!customPath) {
    return false;
  }

  try {
    if (!customJumpscareAudio) {
      customJumpscareAudio = new Audio(customPath);
      customJumpscareAudio.preload = "auto";
    }

    if (customJumpscareAudio.paused === false) {
      customJumpscareAudio.pause();
    }

    customJumpscareAudio.currentTime = 0;
    customJumpscareAudio.volume = 1;
    customJumpscareAudio.play().catch((error) => {
      console.warn("Custom jumpscare audio could not play.", error);
    });
    return true;
  } catch (error) {
    console.warn("Custom jumpscare audio setup failed.", error);
    return false;
  }
}

function playJumpscareSound() {
  if (playCustomJumpscareSound()) {
    return;
  }

  try {
    const ctx = ensureAudioContext();
    const now = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(1.35, now + 0.01);
    master.gain.exponentialRampToValueAtTime(0.9, now + 0.08);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.55);
    master.connect(ctx.destination);

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 8;
    compressor.ratio.value = 14;
    compressor.attack.value = 0.002;
    compressor.release.value = 0.12;
    compressor.connect(master);

    const distortion = ctx.createWaveShaper();
    const curve = new Float32Array(44100);
    for (let i = 0; i < curve.length; i += 1) {
      const x = (i * 2) / curve.length - 1;
      curve[i] = ((3 + 28) * x * 30 * (Math.PI / 180)) / (Math.PI + 28 * Math.abs(x));
    }
    distortion.curve = curve;
    distortion.oversample = "4x";
    distortion.connect(compressor);

    const screamBus = ctx.createGain();
    screamBus.gain.value = 1.15;
    screamBus.connect(distortion);

    const screamFilter = ctx.createBiquadFilter();
    screamFilter.type = "bandpass";
    screamFilter.frequency.setValueAtTime(2100, now);
    screamFilter.frequency.linearRampToValueAtTime(2800, now + 0.09);
    screamFilter.frequency.linearRampToValueAtTime(1850, now + 1.0);
    screamFilter.Q.value = 6.5;
    screamFilter.connect(screamBus);

    const highShriek = ctx.createOscillator();
    highShriek.type = "sawtooth";
    highShriek.frequency.setValueAtTime(620, now);
    highShriek.frequency.exponentialRampToValueAtTime(3100, now + 0.06);
    highShriek.frequency.exponentialRampToValueAtTime(1950, now + 0.32);
    highShriek.frequency.exponentialRampToValueAtTime(2450, now + 0.72);
    highShriek.frequency.exponentialRampToValueAtTime(1700, now + 1.3);
    highShriek.connect(screamFilter);

    const formant = ctx.createOscillator();
    formant.type = "triangle";
    formant.frequency.setValueAtTime(960, now);
    formant.frequency.exponentialRampToValueAtTime(1450, now + 0.18);
    formant.frequency.exponentialRampToValueAtTime(820, now + 1.05);
    formant.connect(screamFilter);

    const stutterGain = ctx.createGain();
    stutterGain.gain.setValueAtTime(0.0001, now);
    stutterGain.gain.exponentialRampToValueAtTime(0.95, now + 0.012);
    stutterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    stutterGain.gain.exponentialRampToValueAtTime(0.82, now + 0.085);
    stutterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    stutterGain.connect(screamBus);

    const stutterOsc = ctx.createOscillator();
    stutterOsc.type = "square";
    stutterOsc.frequency.setValueAtTime(2100, now);
    stutterOsc.frequency.exponentialRampToValueAtTime(1450, now + 0.15);
    stutterOsc.connect(stutterGain);

    const impactFilter = ctx.createBiquadFilter();
    impactFilter.type = "bandpass";
    impactFilter.frequency.value = 130;
    impactFilter.Q.value = 1.2;
    impactFilter.connect(distortion);

    const impactOsc = ctx.createOscillator();
    impactOsc.type = "square";
    impactOsc.frequency.setValueAtTime(95, now);
    impactOsc.frequency.exponentialRampToValueAtTime(55, now + 0.22);
    impactOsc.frequency.exponentialRampToValueAtTime(38, now + 0.8);
    impactOsc.connect(impactFilter);

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = createNoiseBuffer(ctx, 1.55);
    const noiseHigh = ctx.createBiquadFilter();
    noiseHigh.type = "highpass";
    noiseHigh.frequency.setValueAtTime(1400, now);
    const noiseBand = ctx.createBiquadFilter();
    noiseBand.type = "bandpass";
    noiseBand.frequency.setValueAtTime(2600, now);
    noiseBand.Q.value = 2.3;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(1.25, now + 0.015);
    noiseGain.gain.exponentialRampToValueAtTime(0.12, now + 1.35);
    noiseSource.connect(noiseHigh);
    noiseHigh.connect(noiseBand);
    noiseBand.connect(noiseGain);
    noiseGain.connect(distortion);

    const metallicFilter = ctx.createBiquadFilter();
    metallicFilter.type = "bandpass";
    metallicFilter.frequency.value = 3200;
    metallicFilter.Q.value = 10;
    metallicFilter.connect(distortion);

    const metallic = ctx.createOscillator();
    metallic.type = "triangle";
    metallic.frequency.setValueAtTime(2500, now);
    metallic.frequency.linearRampToValueAtTime(3600, now + 0.04);
    metallic.frequency.linearRampToValueAtTime(2800, now + 0.24);
    metallic.frequency.linearRampToValueAtTime(3300, now + 0.5);
    metallic.connect(metallicFilter);

    highShriek.start(now);
    formant.start(now);
    stutterOsc.start(now);
    impactOsc.start(now);
    noiseSource.start(now);
    metallic.start(now);

    highShriek.stop(now + 1.55);
    formant.stop(now + 1.55);
    stutterOsc.stop(now + 0.22);
    impactOsc.stop(now + 0.95);
    noiseSource.stop(now + 1.55);
    metallic.stop(now + 0.62);
  } catch (error) {
    console.warn("Jumpscare audio could not play.", error);
  }
}

function triggerJumpscare(forcedAd = null) {
  const ad = forcedAd || randomItem(POPUP_ADS.filter((item) => item.type === "jumpscare"));
  setManagedImage(jumpscareImage, ad.image, ad.title, ad.title);
  jumpscareOverlay.classList.remove("hidden");
  jumpscareOverlay.setAttribute("aria-hidden", "false");
  playJumpscareSound();
  pausePopupSpawns(2500);

  window.setTimeout(() => {
    jumpscareOverlay.classList.add("hidden");
    jumpscareOverlay.setAttribute("aria-hidden", "true");
  }, BURNFEED_CONFIG.jumpscareDurationMs);
}

function applySideAdImage(button, imagePath, fallbackTitle) {
  const image = button.querySelector("img");
  if (!image || !imagePath) {
    return;
  }

  const clickableSideAds = getResolvedClickableSideAds();
  const clickableConfig = clickableSideAds[imagePath] || null;
  const buttonTitle = button.dataset.sideAdTitle || fallbackTitle || "Sponsored Ad";

  setManagedImage(image, imagePath, `${buttonTitle} rotating ad`, buttonTitle);
  image.dataset.currentAdImage = imagePath;

  button.dataset.clickable = clickableConfig ? "true" : "false";
  button.classList.toggle("is-clickable", Boolean(clickableConfig));
}

function rotateSideAds() {
  const buttons = Array.from(document.querySelectorAll("[data-side-ad-index]"));

  if (buttons.length === 0) {
    return;
  }

  const [firstImage, secondImage] = getRandomSideAdPair();

  if (buttons[0]) {
    applySideAdImage(buttons[0], firstImage, "Left side ad");
  }

  if (buttons[1]) {
    applySideAdImage(buttons[1], secondImage, "Right side ad");
  }

  for (let index = 2; index < buttons.length; index += 1) {
    applySideAdImage(buttons[index], randomItemExcluding(getResolvedSideAdImagePool(), firstImage), `Side ad ${index + 1}`);
  }
}

function startSideAdRotation() {
  if (sideAdRotationTimer) {
    return;
  }

  rotateSideAds();
  sideAdRotationTimer = window.setInterval(rotateSideAds, BURNFEED_CONFIG.sideAdRotateMs || 10000);
}

function bindSideAdButtons() {
  const buttons = document.querySelectorAll("[data-side-ad-index]");

  buttons.forEach((button) => {
    const adIndex = Number(button.dataset.sideAdIndex);
    const resolvedSideAds = resolveGlobalArray("SIDE_ADS");
    const ad = Array.isArray(resolvedSideAds) ? resolvedSideAds[adIndex] : null;

    if (ad) {
      button.dataset.sideAdTitle = ad.title || `Side ad ${adIndex + 1}`;
    }

    button.addEventListener("click", () => {
      if (button.dataset.clickable !== "true") {
        return;
      }

      const currentImage = button.querySelector("img")?.dataset.currentAdImage;
      const clickableConfig = getResolvedClickableSideAds()[currentImage];

      if (!clickableConfig) {
        return;
      }

      openSideAdModal({
        title: ad?.title || "Sponsored Interruptions",
        modalImage: clickableConfig.modalImage || currentImage,
        copy: clickableConfig.copy || []
      });
    });
  });
}

function primeAdEngineOnInteraction() {
  const kickOff = () => {
    startAdEngine();
    ensureAudioContext();
    document.removeEventListener("pointerdown", kickOff);
    document.removeEventListener("keydown", kickOff);
  };

  document.addEventListener("pointerdown", kickOff, { once: true });
  document.addEventListener("keydown", kickOff, { once: true });
}

quizForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formMessage.textContent = "";

  const answers = getFormAnswers();

  if (!allQuestionsAnswered(answers)) {
    formMessage.textContent = "Please answer all 10 questions before submitting. Humanity insists on completeness.";
    return;
  }

  saveAnswers(answers);
  const match = findMatchFromAnswers(answers);

  try {
    const logResult = await logFirstSubmission(answers, match);

    if (logResult.skipped && logResult.reason === "missing-script-url") {
      formMessage.textContent = "Quiz submitted. Add your Google Apps Script URL in data.js when you want first-time submissions logged.";
    } else {
      formMessage.textContent = "Quiz submitted. Your answers are saved for future replays on this browser.";
    }
  } catch (error) {
    console.error("Logging failed:", error);
    formMessage.textContent = "Your match still worked, but Google logging failed. Static websites and cross-site form hacks remain deeply annoying.";
  }

  openResultModal(match);
  resetKeepAnswersBtn.classList.remove("hidden");
});

resetKeepAnswersBtn.addEventListener("click", () => {
  renderQuestions();
  attachPersistenceListeners();
  formMessage.textContent = "Your previous answers are still selected. Tweak them and submit again if you enjoy experimenting on your own fate.";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

closeModalBtn.addEventListener("click", closeResultModal);
closeSideAdModalBtn.addEventListener("click", closeSideAdModal);

resultModal.addEventListener("click", (event) => {
  if (event.target.dataset.closeModal === "true") {
    closeResultModal();
  }
});

sideAdModal.addEventListener("click", (event) => {
  if (event.target.dataset.closeSideAd === "true") {
    closeSideAdModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!sideAdModal.classList.contains("hidden")) {
      closeSideAdModal();
      return;
    }

    if (!resultModal.classList.contains("hidden")) {
      closeResultModal();
    }
  }
});

function initializeBurnfeed() {
  renderQuestions();
  attachPersistenceListeners();
  bindSideAdButtons();
  startSideAdRotation();
  primeAdEngineOnInteraction();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeBurnfeed, { once: true });
} else {
  initializeBurnfeed();
}
