// ##########################################################################
// #                                 IMPORT NPM                             #
// ##########################################################################
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// ##########################################################################
// #                           IMPORT Components                            #
// ##########################################################################
import './style.css';
import App from './App';
import { store, persistor } from './store/store';

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={<p>Loading...</p>} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </React.StrictMode>
);

// // Constants
// const LOGO_CONFIG = {
//   SIZE: '20px',
//   OFFSET_TOP: 50,
//   DISPLAY_DURATION: 2000,
//   FADE_DURATION: 300,
//   Z_INDEX: '9999',
// };

// // Utility function to create styled element
// function createStyledElement<T extends HTMLElement>(tag: string, styles: Partial<CSSStyleDeclaration>): T {
//   const element = document.createElement(tag) as T;
//   Object.assign(element.style, styles);
//   return element;
// }

// // LogoManager Class
// class LogoManager {
//   /** @type {LogoManager | null} */
//   static #instance: LogoManager | null = null;
//   /** @type {HTMLDivElement | null} */
//   #currentLogo: HTMLDivElement | null = null;
//   /** @type {NodeJS.Timeout | null} */
//   #hideTimeout: NodeJS.Timeout | null = null;

//   private constructor() {
//     if (LogoManager.#instance) {
//       return LogoManager.#instance;
//     }
//     LogoManager.#instance = this;

//     // Add document click listener to hide logo when clicking outside
//     document.addEventListener('mousedown', (e) => {
//       if (this.#currentLogo && e.target && !this.#currentLogo.contains(e.target as Node) && !this.detailsDiv?.contains(e.target as Node)) {
//         this.hideLogo();
//       }
//     });
//   }

//   static getInstance(): LogoManager {
//     return new LogoManager();
//   }

//   #removeCurrentLogo(): void {
//     if (this.#currentLogo) {
//       document.body.removeChild(this.#currentLogo);
//       this.#currentLogo = null;
//     }
//     if (this.#hideTimeout) {
//       clearTimeout(this.#hideTimeout);
//     }
//   }

//   public get running() {
//     return !!this.#currentLogo;
//   }

//   hideLogo(): void {
//     if (this.#currentLogo) {
//       this.#currentLogo.style.opacity = '0';
//       setTimeout(() => this.#removeCurrentLogo(), LOGO_CONFIG.FADE_DURATION);
//     }
//     this.removeDetails();
//   }

//   showLogo(position: { top: number; left: number }): void {
//     // Remove existing logo if any
//     this.#removeCurrentLogo();

//     // Create logo container
//     const button = createStyledElement<HTMLDivElement>('button', {
//       position: 'absolute',
//       top: `${position.top + window.scrollY - LOGO_CONFIG.OFFSET_TOP}px`,
//       left: `${position.left + window.scrollX}px`,
//       zIndex: LOGO_CONFIG.Z_INDEX,
//       transition: `opacity ${LOGO_CONFIG.FADE_DURATION}ms`,
//       opacity: '1',
//     });

//     // Create logo image
//     const logoImg = createStyledElement<HTMLImageElement>('img', {
//       width: LOGO_CONFIG.SIZE,
//       cursor: 'pointer',
//       pointerEvents: 'all', // Enable pointer events on the image
//     });
//     logoImg.src = chrome.runtime.getURL('vitefavicon.png');

//     // Add click event listener to the logo image
//     button.onclick = () => {
//       this.showDetails({
//         top: position.top,
//         left: position.left,
//       });
//       // alert('hello world');
//     };

//     // Build and add to DOM
//     button.appendChild(logoImg);
//     document.body.appendChild(button);
//     this.#currentLogo = button;
//   }

//   private detailsDiv: HTMLDivElement | null = null;
//   showDetails(position: { top: number; left: number }): void {
//     // Create details container
//     this.detailsDiv = createStyledElement<HTMLDivElement>('div', {
//       position: 'absolute',
//       width: '50px',
//       height: '50px',
//       backgroundColor: 'red',
//       top: `${position.top + window.scrollY - LOGO_CONFIG.OFFSET_TOP}px`,
//       left: `${position.left + window.scrollX}px`,
//       zIndex: LOGO_CONFIG.Z_INDEX,
//       transition: `opacity ${LOGO_CONFIG.FADE_DURATION}ms`,
//       opacity: '1',
//     });

//     // Build and add to DOM
//     document.body.appendChild(this.detailsDiv);
//   }
//   removeDetails() {
//     this.detailsDiv?.remove();
//   }
// }

// // Handle text selection
// function handleTextSelection(_event: MouseEvent): void {
//   if (LogoManager.getInstance().running) return;
//   const selection = window.getSelection();
//   const selectedText = selection?.toString().trim();

//   if (!selectedText || !selection) {
//     // If no text is selected, hide the logo
//     LogoManager.getInstance().hideLogo();
//     return;
//   }

//   try {
//     const range = selection.getRangeAt(0);
//     const rect = range.getBoundingClientRect();

//     // Show logo at selection position
//     LogoManager.getInstance().showLogo({
//       top: rect.top,
//       left: rect.left,
//     });
//   } catch (error) {
//     console.error('Error handling text selection:', error);
//   }
// }

// // Add event listener
// document.addEventListener('mouseup', handleTextSelection);
