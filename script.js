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
  resultImage.src = match.image;
  resultImage.alt = `${match.name} result image`;
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
  sideAdModalImage.src = ad.modalImage;
  sideAdModalImage.alt = `${ad.title} expanded ad`;
  sideAdModalText.innerHTML = ad.copy.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
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
  return items[Math.floor(Math.random() * items.length)];
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
  startSideAdRotation();
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

  let ad = randomItem(POPUP_ADS);

  if (ad.type === "multiply" && activeMultiplyFamily) {
    const alternatives = POPUP_ADS.filter((item) => item.type !== "multiply");
    ad = randomItem(alternatives);
  }

  if (ad.type === "default") {
    openDefaultPopupAd(ad);
  } else if (ad.type === "multiply") {
    openMultiplyPopupAd(ad);
  } else {
    triggerJumpscare(ad);
  }

  scheduleNextPopup();
}

function makePopupDraggable(popup) {
  const header = popup.querySelector(".ad-window-header");
  if (!header) {
    return;
  }

  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let originLeft = 0;
  let originTop = 0;

  const onPointerMove = (event) => {
    if (event.pointerId !== pointerId) {
      return;
    }

    const popupWidth = popup.offsetWidth;
    const popupHeight = popup.offsetHeight;
    const nextLeft = clamp(originLeft + (event.clientX - startX), 8, window.innerWidth - popupWidth - 8);
    const nextTop = clamp(originTop + (event.clientY - startY), 8, window.innerHeight - popupHeight - 8);

    popup.style.left = `${nextLeft}px`;
    popup.style.top = `${nextTop}px`;
  };

  const stopDragging = (event) => {
    if (pointerId !== null && event.pointerId === pointerId) {
      pointerId = null;
      popup.classList.remove("dragging");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    }
  };

  header.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) {
      return;
    }

    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    originLeft = parseFloat(popup.style.left) || 0;
    originTop = parseFloat(popup.style.top) || 0;
    popup.classList.add("dragging");
    popup.style.zIndex = String(100 + activePopupCount);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);
  });
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

function openDefaultPopupAd(forcedAd = null) {
  const ad = forcedAd || randomItem(POPUP_ADS.filter((item) => item.type === "default"));
  const popup = createPopupShell(ad.title);
  const content = popup.querySelector(".ad-window-content");
  const actionRow = popup.querySelector(".ad-window-action-row");
  const closeButton = popup.querySelector(".ad-window-close");

  content.innerHTML = `
    <img class="ad-window-image" src="${escapeHtml(ad.image)}" alt="${escapeHtml(ad.title)}" />
    <p class="ad-window-copy">${escapeHtml(ad.body)}</p>
  `;

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
    pendingSpawn: false,
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

  family.pendingSpawn = false;

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

  family.openCount += 1;

  content.innerHTML = `
    <img class="ad-window-image" src="${escapeHtml(ad.image)}" alt="${escapeHtml(ad.title)}" />
    <p class="ad-window-copy">${escapeHtml(ad.body)} Round ${family.round + 1} of ${BURNFEED_CONFIG.multiplyPopupRounds + 1}. The next wave will not appear until every clone from this round is actually closed. Progress, somehow.</p>
  `;
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

function playJumpscareSound() {
  try {
    const ctx = ensureAudioContext();
    const now = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(1, now + 0.015);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);
    master.connect(ctx.destination);

    const distortion = ctx.createWaveShaper();
    const curve = new Float32Array(44100);
    for (let i = 0; i < curve.length; i += 1) {
      const x = (i * 2) / curve.length - 1;
      curve[i] = ((3 + 18) * x * 20 * (Math.PI / 180)) / (Math.PI + 18 * Math.abs(x));
    }
    distortion.curve = curve;
    distortion.oversample = "4x";
    distortion.connect(master);

    const screamFilter = ctx.createBiquadFilter();
    screamFilter.type = "bandpass";
    screamFilter.frequency.setValueAtTime(1600, now);
    screamFilter.Q.value = 3.8;
    screamFilter.connect(distortion);

    const highShriek = ctx.createOscillator();
    highShriek.type = "sawtooth";
    highShriek.frequency.setValueAtTime(220, now);
    highShriek.frequency.exponentialRampToValueAtTime(2200, now + 0.22);
    highShriek.frequency.exponentialRampToValueAtTime(820, now + 0.95);
    highShriek.connect(screamFilter);

    const lowGrowlFilter = ctx.createBiquadFilter();
    lowGrowlFilter.type = "lowpass";
    lowGrowlFilter.frequency.value = 180;
    lowGrowlFilter.connect(distortion);

    const lowGrowl = ctx.createOscillator();
    lowGrowl.type = "square";
    lowGrowl.frequency.setValueAtTime(48, now);
    lowGrowl.frequency.exponentialRampToValueAtTime(110, now + 0.3);
    lowGrowl.frequency.exponentialRampToValueAtTime(55, now + 1.05);
    lowGrowl.connect(lowGrowlFilter);

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = createNoiseBuffer(ctx, 1.2);
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 900;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.85, now + 0.025);
    noiseGain.gain.exponentialRampToValueAtTime(0.08, now + 1.1);
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(distortion);

    const pulseFilter = ctx.createBiquadFilter();
    pulseFilter.type = "bandpass";
    pulseFilter.frequency.value = 760;
    pulseFilter.Q.value = 12;
    pulseFilter.connect(distortion);

    const pulse = ctx.createOscillator();
    pulse.type = "triangle";
    pulse.frequency.setValueAtTime(14, now);
    pulse.frequency.exponentialRampToValueAtTime(34, now + 0.5);
    pulse.connect(pulseFilter);

    highShriek.start(now);
    lowGrowl.start(now);
    noiseSource.start(now);
    pulse.start(now);

    highShriek.stop(now + 1.18);
    lowGrowl.stop(now + 1.18);
    noiseSource.stop(now + 1.18);
    pulse.stop(now + 1.18);
  } catch (error) {
    console.warn("Jumpscare audio could not play.", error);
  }
}

function triggerJumpscare(forcedAd = null) {
  const ad = forcedAd || randomItem(POPUP_ADS.filter((item) => item.type === "jumpscare"));
  jumpscareImage.src = ad.image;
  jumpscareImage.alt = ad.title;
  jumpscareOverlay.classList.remove("hidden");
  jumpscareOverlay.setAttribute("aria-hidden", "false");
  playJumpscareSound();
  pausePopupSpawns(2500);

  window.setTimeout(() => {
    jumpscareOverlay.classList.add("hidden");
    jumpscareOverlay.setAttribute("aria-hidden", "true");
  }, BURNFEED_CONFIG.jumpscareDurationMs);
}

function rotateSideAds() {
  document.querySelectorAll("[data-side-ad-index]").forEach((button) => {
    const adIndex = Number(button.dataset.sideAdIndex);
    const ad = SIDE_ADS[adIndex];
    const image = button.querySelector("img");

    if (!ad || !image || !Array.isArray(ad.thumbs) || ad.thumbs.length === 0) {
      return;
    }

    const currentIndex = Number(button.dataset.rotationIndex || "0");
    const nextIndex = (currentIndex + 1) % ad.thumbs.length;
    image.src = ad.thumbs[nextIndex];
    image.alt = `${ad.title} rotating ad ${nextIndex + 1}`;
    button.dataset.rotationIndex = String(nextIndex);
  });
}

function startSideAdRotation() {
  if (sideAdRotationTimer) {
    return;
  }

  rotateSideAds();
  sideAdRotationTimer = window.setInterval(rotateSideAds, BURNFEED_CONFIG.sideAdRotateMs || 10000);
}

function bindSideAdButtons() {
  document.querySelectorAll("[data-side-ad-index]").forEach((button) => {
    const adIndex = Number(button.dataset.sideAdIndex);
    const ad = SIDE_ADS[adIndex];
    const image = button.querySelector("img");

    if (ad && image && Array.isArray(ad.thumbs) && ad.thumbs.length > 0) {
      image.src = ad.thumbs[0];
      image.alt = `${ad.title} rotating ad 1`;
      button.dataset.rotationIndex = "0";
    }

    button.addEventListener("click", () => {
      if (ad) {
        openSideAdModal(ad);
      }
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

renderQuestions();
attachPersistenceListeners();
bindSideAdButtons();
primeAdEngineOnInteraction();
