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
  const width = Math.min(window.innerWidth - 20, 360);
  const maxLeft = Math.max(12, window.innerWidth - width - 12);
  const maxTop = Math.max(12, window.innerHeight - 260);

  return {
    left: randomBetween(12, maxLeft),
    top: randomBetween(90, maxTop)
  };
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

  const popupType = randomItem(POPUP_ADS).type;

  if (popupType === "default") {
    openDefaultPopupAd();
  } else if (popupType === "multiply") {
    openMultiplyPopupAd();
  } else {
    triggerJumpscare();
  }

  scheduleNextPopup();
}

function createPopupShell(title) {
  const popup = document.createElement("section");
  const position = getPopupPosition();

  popup.className = "ad-window";
  popup.style.left = `${position.left}px`;
  popup.style.top = `${position.top}px`;
  popup.innerHTML = `
    <div class="ad-window-header">
      <p class="ad-window-title">${escapeHtml(title)}</p>
      <button class="ad-window-close" type="button" aria-label="Close ad">×</button>
    </div>
    <div class="ad-window-content"></div>
    <div class="ad-window-action-row"></div>
  `;

  floatingAdsLayer.appendChild(popup);
  activePopupCount += 1;
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

function openDefaultPopupAd() {
  const ad = randomItem(POPUP_ADS.filter((item) => item.type === "default"));
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

function buildMultiplyPopup(round, lineageLabel) {
  const ad = randomItem(POPUP_ADS.filter((item) => item.type === "multiply"));
  const popup = createPopupShell(`${ad.title} ${lineageLabel}`);
  const content = popup.querySelector(".ad-window-content");
  const actionRow = popup.querySelector(".ad-window-action-row");
  const closeButton = popup.querySelector(".ad-window-close");

  content.innerHTML = `
    <img class="ad-window-image" src="${escapeHtml(ad.image)}" alt="${escapeHtml(ad.title)}" />
    <p class="ad-window-copy">${escapeHtml(ad.body)} Round ${round + 1} of ${BURNFEED_CONFIG.multiplyPopupRounds + 1}. The website remains committed to making terrible choices.</p>
  `;
  actionRow.innerHTML = `<button class="ad-window-action" type="button">Maybe Later</button>`;

  const explode = () => {
    destroyPopup(popup);

    if (round < BURNFEED_CONFIG.multiplyPopupRounds) {
      for (let i = 0; i < 2; i += 1) {
        if (activePopupCount < BURNFEED_CONFIG.maxSimultaneousPopups + 2) {
          buildMultiplyPopup(round + 1, `${lineageLabel}.${i + 1}`);
        }
      }
    }
  };

  closeButton.addEventListener("click", explode);
  actionRow.querySelector("button").addEventListener("click", explode);
}

function openMultiplyPopupAd() {
  buildMultiplyPopup(0, "1");
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

function playJumpscareSound() {
  try {
    const ctx = ensureAudioContext();
    const gain = ctx.createGain();
    const oscillator = ctx.createOscillator();
    const oscillator2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.95, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(110, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);

    oscillator2.type = "square";
    oscillator2.frequency.setValueAtTime(220, ctx.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.18);

    filter.type = "highpass";
    filter.frequency.value = 180;

    oscillator.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator2.start();
    oscillator.stop(ctx.currentTime + 0.36);
    oscillator2.stop(ctx.currentTime + 0.36);
  } catch (error) {
    console.warn("Jumpscare audio could not play.", error);
  }
}

function triggerJumpscare() {
  const ad = randomItem(POPUP_ADS.filter((item) => item.type === "jumpscare"));
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

function bindSideAdButtons() {
  document.querySelectorAll("[data-side-ad-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const adIndex = Number(button.dataset.sideAdIndex);
      const ad = SIDE_ADS[adIndex];
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
