const quizForm = document.getElementById("quizForm");
const questionsContainer = document.getElementById("questionsContainer");
const formMessage = document.getElementById("formMessage");
const resultModal = document.getElementById("resultModal");
const resultImage = document.getElementById("resultImage");
const resultName = document.getElementById("resultName");
const resultText = document.getElementById("resultText");
const closeModalBtn = document.getElementById("closeModalBtn");
const resetKeepAnswersBtn = document.getElementById("resetKeepAnswersBtn");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
  document.body.style.overflow = "hidden";
}

function closeResultModal() {
  resultModal.classList.add("hidden");
  resultModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
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

let persistenceListenerAttached = false;

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
resultModal.addEventListener("click", (event) => {
  if (event.target.dataset.closeModal === "true") {
    closeResultModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !resultModal.classList.contains("hidden")) {
    closeResultModal();
  }
});

renderQuestions();
attachPersistenceListeners();
