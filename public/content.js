"use strict";
const LOGO_CONFIG = {
  SIZE: "20px",
  OFFSET_TOP: 50,
  DISPLAY_DURATION: 2e3,
  FADE_DURATION: 300,
  Z_INDEX: "9999"
};
function createStyledElement(tag, styles) {
  const element = document.createElement(tag);
  Object.assign(element.style, styles);
  return element;
}
class LogoManager {
  /** @type {LogoManager | null} */
  static #instance = null;
  /** @type {HTMLDivElement | null} */
  #currentLogo = null;
  /** @type {NodeJS.Timeout | null} */
  #hideTimeout = null;
  constructor() {
    if (LogoManager.#instance) {
      return LogoManager.#instance;
    }
    LogoManager.#instance = this;
    document.addEventListener("mousedown", (e) => {
      if (this.#currentLogo && !this.#currentLogo.contains(e.target)) {
        this.hideLogo();
      }
    });
  }
  static getInstance() {
    return new LogoManager();
  }
  #removeCurrentLogo() {
    if (this.#currentLogo) {
      document.body.removeChild(this.#currentLogo);
      this.#currentLogo = null;
    }
    if (this.#hideTimeout) {
      clearTimeout(this.#hideTimeout);
    }
  }
  hideLogo() {
    if (this.#currentLogo) {
      this.#currentLogo.style.opacity = "0";
      setTimeout(() => this.#removeCurrentLogo(), LOGO_CONFIG.FADE_DURATION);
    }
  }
  showLogo(position) {
    this.#removeCurrentLogo();
    const logoDiv = createStyledElement("button", {
      position: "absolute",
      top: `${position.top + window.scrollY - LOGO_CONFIG.OFFSET_TOP}px`,
      left: `${position.left + window.scrollX}px`,
      zIndex: LOGO_CONFIG.Z_INDEX,
      transition: `opacity ${LOGO_CONFIG.FADE_DURATION}ms`,
      opacity: "1"
    });
    const logoImg = createStyledElement("img", {
      width: LOGO_CONFIG.SIZE,
      cursor: "pointer",
      pointerEvents: "all"
      // Enable pointer events on the image
    });
    logoImg.src = chrome.runtime.getURL("vitefavicon.png");
    logoDiv.addEventListener("click", () => {
      alert("hello world");
    });
    logoDiv.appendChild(logoImg);
    document.body.appendChild(logoDiv);
    this.#currentLogo = logoDiv;
  }
  showDetails(position) {
    const detailsDiv = createStyledElement("div", {
      position: "absolute",
      width: "50px",
      height: "50px",
      backgroundColor: "red",
      top: `${position.top + window.scrollY - LOGO_CONFIG.OFFSET_TOP}px`,
      left: `${position.left + window.scrollX}px`,
      zIndex: LOGO_CONFIG.Z_INDEX,
      transition: `opacity ${LOGO_CONFIG.FADE_DURATION}ms`,
      opacity: "1"
    });
    document.body.appendChild(detailsDiv);
  }
}
function handleTextSelection(event) {
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();
  if (!selectedText || !selection) {
    LogoManager.getInstance().hideLogo();
    return;
  }
  try {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    LogoManager.getInstance().showLogo({
      top: rect.top,
      left: rect.left
    });
  } catch (error) {
    console.error("Error handling text selection:", error);
  }
}
document.addEventListener("mouseup", handleTextSelection);
