// State management
let currentInput = "";
let isDegreeMode = false;
let isResultDisplayed = false;
let copyTimeout;
const historyLimit = 20;
const historyArray = [];

// DOM elements (assuming they exist in your HTML)
const app = document.getElementById("calculator");
const inputDisplay = document.getElementById("calcExpression");
const modeDisplay = document.getElementById("radianFlag");
const resultDisplay = document.getElementById("calcResult");
const historyBtn = document.getElementById("historyBtn");
const historyArea = document.querySelector(".history-section");
const historyList = document.querySelector(".history-list");
const clearHistoryBtn = document.querySelector(".clear-history-btn");
const fullscreenBtn = document.querySelector(".fullscreen-btn");
const aboutAppBtn = document.getElementById("about-app-btn");
const aboutAppDialog = document.getElementById("aboutApp");
const aboutAppMenuBtn = document.getElementById("about-app-menu-toggle");
const aboutAppMenu = document.getElementById("about-app-menu");

// Update display
function updateDisplay() {
  if (!inputDisplay || !modeDisplay) {
    console.error("DOM elements not found");
    return;
  }
  inputDisplay.textContent = currentInput || "0";
  modeDisplay.textContent = isDegreeMode ? "Deg" : "Rad";
}

// Handle button clicks
document.querySelectorAll(".calc-buttons button").forEach((button) => {
  button.addEventListener("click", () => handleInput(button.value));
});

// Handle keydown for keyboards:
document.addEventListener("keydown", (event) => {
  const key = event.key;
  const appEnabled = app.ariaDisabled === "false";

  if (appEnabled) {
    if (/^[\d+\-*/^.!()%=e√]$/.test(key)) {
      handleInput(key);
      visualizeClick(key);
    } else if (key === "Backspace") {
      handleInput("⌫");
      visualizeClick("⌫");
    } else if (key === "Delete") {
      handleInput("AC");
      visualizeClick("AC");
    } else if (event.ctrlKey && key.toLowerCase() === "m") {
      handleInput("toggleMode");
      visualizeClick("toggleMode");
    } else if (
      event.altKey &&
      key.toLowerCase() === "h" &&
      window.innerWidth < 780
    ) {
      event.preventDefault();
      event.stopPropagation();
      historyArea?.classList.toggle("active");
    }
  }
});

// Open history section:
historyBtn?.addEventListener("click", () =>
  historyArea?.classList.add("active")
);

// Close history area:
historyArea?.addEventListener("click", (e) => {
  if (e.target === historyArea || e.target.closest(".history") !== null) {
    historyArea.classList.remove("active");
  }
});

// Close history area on resize:
window.addEventListener("resize", () => {
  if (window.innerWidth >= 780) {
    historyArea.classList.remove("active");
  }
});

// Clear history array and history <li> elements:
clearHistoryBtn.addEventListener("click", () => {
  if (!historyArray.length) return;
  historyArray.length = 0;
  historyList.innerHTML = "";
});

// Enter/Exit fullscreen mode:
fullscreenBtn?.addEventListener("click", () => {
  ToggleFullscreen();
});

// Toggle light/dark theme:
document.querySelector(".theme-btn")?.addEventListener("click", () => {
  document.documentElement.classList.toggle("light-theme");
});

// Detect fullscreen mode change and toggle "fullscreen" class on <body> element:
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenEnabled) return;

  if (document.fullscreenElement !== null) {
    document.body.classList.add("fullscreen");
  } else {
    document.body.classList.remove("fullscreen");
  }
});

// Open about app modal:
aboutAppBtn?.addEventListener("click", () => {
  if (aboutAppDialog) {
    aboutAppDialog.showModal();
    app.ariaDisabled = true;
  }
});

// Close about app modal:
document.getElementById("close-about-app")?.addEventListener("click", () => {
  aboutAppDialog?.close();
});

// Open/Close faq answer:
document
  .querySelectorAll("#faq .faq-question")
  .forEach((faq, _, faqCollection) => {
    faq.addEventListener("click", () => {
      faqCollection.forEach((item) => {
        if (item !== faq) {
          item.ariaExpanded = false;
        }
      });

      faq.ariaExpanded = faq.ariaExpanded === "false";
    });
  });

// Detect scroll and toggle scrolled class:
aboutAppDialog?.addEventListener("scroll", (event) => {
  event.target.classList.toggle("scrolled", event.target.scrollTop >= 200);
});

// Scroll about app to top
document.getElementById("back-to-top")?.addEventListener("click", () => {
  aboutAppDialog.scrollTop = 0;
});

// Toggle about app menu:
aboutAppMenuBtn?.addEventListener("click", () => {
  aboutAppDialog.classList.toggle("menu-visible");
});

// Scroll target section into view and close about app nav menu:
aboutAppMenu?.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", (event) => {
    const targetElement = document.getElementById(
      `${link.getAttribute("href")?.slice(1)}`
    );

    const navbarHeight =
      aboutAppDialog.querySelector("nav")?.clientHeight ?? 70;

    if (targetElement) {
      event.preventDefault();
      aboutAppDialog.scrollTop =
        targetElement.offsetTop - Math.floor(navbarHeight + 20);
    }

    aboutAppDialog.classList.remove("menu-visible");
  })
);

// Close about app menu on focus out:
aboutAppDialog?.addEventListener("click", (event) => {
  if (
    !event.target.closest("#about-app-menu-toggle") &&
    !event.target.closest("#about-app-menu")
  ) {
    aboutAppDialog.classList.remove("menu-visible");
  }
});

// Enable calculator app:
aboutAppDialog?.addEventListener("close", () => {
  app.ariaDisabled = false;
  aboutAppMenu?.classList.remove("menu-visible");
});

// Initial display:
updateDisplay();

// Copy expression and result to clipboard:
document.getElementById("copyButton")?.addEventListener("click", (e) => {
  clearTimeout(copyTimeout);

  navigator.clipboard
    .writeText(
      `Expression: "${inputDisplay?.textContent}", Result: "${resultDisplay?.textContent || "0"}"`
    )
    .then(() => {
      e.target.closest("#copyButton")?.classList?.add("copied");

      copyTimeout = setTimeout(() => {
        e.target.closest("#copyButton")?.classList?.remove("copied");
      }, 600);
    })
    .catch((err) => console.error(`Copying error: ` + err.message));
});

function visualizeClick(value) {
  const clickedButton = document.querySelector(
    `.calc-buttons button[value="${value}"]`
  );

  if (!clickedButton) return;

  // clickedButton.focus();
  clickedButton.classList.add("clicked");
  setTimeout(() => clickedButton.classList.remove("clicked"), 100);
}

function syncHistoryUI() {
  if (!historyArray.length || !historyList) return;

  const arg = historyArray.length > historyLimit ? historyArray.pop() : null;
  const newHistory = historyArray[0];

  if (arg !== null) {
    try {
      const targetHistoryLi = historyList.querySelector(
        `[data-history-id="${arg.timestamp}"]`
      );
      targetHistoryLi?.parentElement.removeChild(targetHistoryLi);
    } catch (_) {}
  }

  if (newHistory) {
    const li = document.createElement("li");
    li.className = "history";
    li.dataset.historyId = newHistory.timestamp;
    li.innerHTML = `
             <div class="exp-block">
                 <span class="history-expression">${newHistory.expression}</span>
                 <span class="history-result">${newHistory.result}</span>
             </div>
         `;
    li.addEventListener("click", () => {
      const modeBtn = document.getElementById("modeToggle");
      currentInput = newHistory.expression;
      isDegreeMode = newHistory.mode === "Deg";
      updateDisplay();
      if (modeBtn) modeBtn.textContent = isDegreeMode ? "DEG" : "RAD";
      resultDisplay.textContent = newHistory.result;
      isResultDisplayed = false;
    });
    historyList.prepend(li);
  }
}
