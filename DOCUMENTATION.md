# Roast & Ritual — Code Documentation (Beginner friendly)

This document explains how the site works, line-by-line and concept-by-concept, so you can understand and teach it.

**Files Covered**:
- `index.html` — structure and content of the page (HTML)
- `style.css` — styling rules (CSS)
- `script.js` — behavior and interactivity (JavaScript)

**How to use this document**: Read each section in order. For each file I explain what the important blocks do, why they're there, and how they interact.

**index.html**

- `<!doctype html>`: Declares the document is HTML5. Helps browsers render consistently.
- `<html lang="en">`: Root element; `lang` helps accessibility and search engines know the page language.
- `<head>` block:
  - `<meta charset="utf-8">`: Sets character encoding so special characters show correctly.
  - `<meta name="viewport" content="width=device-width,initial-scale=1">`: Makes the page responsive on mobile by setting the viewport width to the device width.
  - `<title>Roast & Ritual — Coffee Shop</title>`: The page title shown in browser tabs.
  - `<link rel="stylesheet" href="style.css">`: Loads the stylesheet `style.css` (controls the look of the page).

- `<body>`: Visible content and interactive elements live here.

- `<header>`: Top bar with branding and navigation.
  - `.logo` area: shows a text brand (`Roast & Ritual`) and contains a hidden `<img>` placeholder if you swap to an image logo later.
  - `.nav-wrap` contains the navigation and account controls.
    - `<nav id="main-nav" aria-label="Main navigation">`:
      - Links such as `Menu`, `Location`, `About` — these use fragment links (`#menu`) to jump to page sections.
    - `.account-wrap`:
      - `<button id="loginBtn">Log in</button>`: Main login/account button — its text switches to `Account` when signed in.
      - `.account-menu` (hidden by default): small dropdown with `Profile` and `Log out` buttons when signed-in.
    - `.hamburger` button: mobile menu toggle. Contains an inline SVG of 3 bars.

- `<main>`: Primary page content.
  - `.hero-hero`: Large “hero” section (full-screen intro area).
    - `.hero-media`: Placeholder for a background video or image (currently empty). It's positioned absolutely to sit behind content.
    - `.hero-overlay`: Semi-transparent overlay that darkens the media so text is readable.
    - `.hero-content` / `.hero-inner`: Holds the main headline (`<h1>`), tagline and CTA buttons (`View Menu`, `Find Us`).

  - `#menu` (section with class `grid`): Contains menu card and other cards.
    - `.menu-list` contains several `.menu-item` elements. Each `.menu-item`:
      - Uses `role="button" tabindex="0"` to make it keyboard-focusable and behave like a button (important for accessibility).
      - Uses `data-name` and `data-price` attributes: small data storage on elements. JavaScript reads these to know what item was clicked.
      - The image is implemented using a `div.img` with `background-image` inline style. This keeps the aspect ratio and looks consistent.
      - `.menu-overlay` contains `.meta` with `.name` and `.price` shown on hover/focus (CSS handles that reveal).

  - `#location` card: Shows address and a placeholder for a map.
  - `#about` card: Short paragraph describing the shop.

- `<footer>`: Shows the current year (populated by JavaScript) and a copyright line.

- Login modal and related UI (near page bottom):
  - `.modal-backdrop` (id `modalBackdrop`) is a full-page layer used to show/hide the login panel. It contains the `.modal` with the actual form (`#loginForm`).
  - The form has `input` fields for `email` and `password` and submit/cancel buttons.
  - Elements have `id`s like `cancelLogin` and `loginForm` so JavaScript can attach event listeners.

- `#toast`: A small notification element used to show short messages (e.g., "you need to log in"). Hidden by default; JavaScript toggles its visibility.

- `#noticeBackdrop` and `.notice-modal`: A different small modal used to show "coming soon" messages for unimplemented features.

- `<script src="script.js" defer></script>`: Loads the JavaScript file. The `defer` attribute means the script runs after the document is parsed (good for DOM access).

**style.css** (high-level explanation and key rules)

- `*{ box-sizing: border-box; margin:0; padding:0 }`:
  - Resets default margins/padding and sets box-sizing so width/height calculations include padding and border. This avoids layout surprises.

- `body` rules:
  - Sets the font stack (fallback fonts listed), background gradient and default text color.
  - `min-height:100vh` ensures the body fills the viewport vertically.

- `:root` variables:
  - `--accent`, `--bg-dark`, `--muted` are CSS variables used throughout the file so colors are easy to change in one place.

- `header` and `.logo`:
  - Uses `display:flex` to align logo and navigation horizontally.
  - `backdrop-filter: blur(6px)` and semi-transparent backgrounds give a glassy look when placed over the hero.

- Navigation (`.nav`, `.nav-inline`) and mobile-first approach:
  - The CSS hides `.nav` by default (mobile first). At `@media(min-width:768px)` the `.nav` becomes visible inline and the `.hamburger` is hidden.
  - This pattern makes the layout work well on phones first, then enhances for larger screens.

- Buttons (`.btn` and `.btn.primary`):
  - Base `.btn` is transparent with a subtle border; `.btn.primary` has an accent gradient for the primary calls-to-action.

- Hero styles (`.hero-hero`, `.hero-media`, `.hero-overlay`, `.hero-content`):
  - `.hero-hero` is positioned and sized to take a large portion of the screen.
  - `.hero-media` is absolute and sits behind `.hero-content`. A real video element can be added there later.
  - `.hero-overlay` adds a darker gradient to improve text contrast.

- Grid and cards (`.grid`, `.card`):
  - `.grid` uses CSS Grid to layout sections; `.card` provides a soft panel background and padding.

- Menu item styles and hover/focus overlay:
  - `.menu-item .img` uses `background-size:cover` to crop images nicely.
  - `.menu-overlay` is initially hidden (`opacity:0` and `transform: translateY(6px)`) and revealed on `.menu-item:hover` or `.menu-item:focus` — giving an animated reveal.

- Modal and toast styles:
  - `.modal-backdrop` covers the whole screen and centers `.modal` (hidden by default via `display:none` in CSS; JS toggles to `display:flex`).
  - `.toast` is positioned fixed near the bottom; the `.show` class toggles opacity and transform to animate it in.

**script.js** (behavior, step-by-step)

All code runs after `DOMContentLoaded`, which ensures the HTML elements exist before we try to access them.

- Element selection:
  - `const hamburger = document.getElementById('hamburger');` and other `getElementById`/`querySelectorAll` lines fetch elements so the script can listen for clicks and modify UI.

- `yearSpan.textContent = new Date().getFullYear();`
  - Fills the `<span id="year">` with the current year automatically so the footer stays up-to-date.

- State variables:
  - `let loggedIn = false;` — a simple boolean to represent whether a demo user is signed in.
  - `let pendingOrder = null;` — used when a user tries to order while not signed-in; we store the desired item and continue after sign-in.

- `showToast(message, duration)`:
  - Sets toast text, removes `hidden`, and adds the `.show` class (which triggers a CSS animation).
  - Uses `setTimeout` to remove `.show` and hide the toast later.

- Hamburger click (mobile nav toggle):
  - Toggles `aria-expanded` for accessibility and toggles `nav.style.display` between `block` and `''` (empty string resets to default CSS).

- `loginBtn` click behavior:
  - If `loggedIn` is `true`, it toggles the `.account-menu` dropdown.
  - If `loggedIn` is `false`, it navigates to `login.html` (demo uses a separate page for sign-in). The code also contains comments about opening the login page as a popup in earlier iterations.

- Menu item click (`.menu-item` elements):
  - For each menu item, the script reads `data-name` (e.g., "Espresso") and sets up `tryOrder()`.
  - `tryOrder()` checks `loggedIn`:
    - If signed-in: it would proceed with ordering (here it uses a demo `alert`).
    - If not signed-in: it stores the desired item in `pendingOrder`, shows a toast message, and opens the login modal/backdrop so the user may sign in.
  - The code also wires keyboard support: pressing `Enter` or Space while the item is focused triggers ordering (important for accessibility).

- Modal open/close and `cancelLogin`:
  - `cancelLogin` and clicking the backdrop call `closeModal()` which hides the modal backdrop and clears the toast.
  - `closeModal()` also focuses `loginBtn` for keyboard users.

- `updateAuthUI(email)`:
  - Updates button text to `Account` when signed-in, sets `title` attribute to the username short name (part before `@`), or resets to `Log in` when signed out.

- `initAuthFromStorage()`:
  - Reads `localStorage` keys `rr_logged_in` and `rr_user_email` to persist demo authentication across page reloads.
  - If the stored flag indicates signed-in, it sets `loggedIn = true` and calls `updateAuthUI()`.

- Login form submit handler:
  - `loginForm.addEventListener('submit', ...)` prevents the default page reload, reads the `email`, marks `loggedIn = true`, stores details in `localStorage`, closes the modal, updates UI, and continues the `pendingOrder` flow if needed.
  - This is a demo: in a real site you'd validate credentials against a server and would *not* store sensitive tokens in localStorage without secure handling.

- Keyboard `Escape` handling:
  - Pressing `Escape` closes the login modal, the notice modal, and the mobile menu if open.

- `window.addEventListener('message', ...)`:
  - Listens for cross-window messages (used if the login page uses `window.opener.postMessage({type:'login', email})` to notify the parent window that sign-in succeeded). When a login message arrives, the script marks the user as signed-in and continues pending order logic.

- Account menu actions (`accountLogout`, `accountProfile`):
  - `accountLogout` clears the stored `rr_user_email` and sets `loggedIn = false`.
  - `accountProfile` shows the "Coming soon" notice modal via `showNotice()`.

- `showNotice(message)` / `closeNotice()` helpers:
  - Show or hide the notice modal (`#noticeBackdrop`). `showNotice` also focuses the close button for accessibility.

- Document click handler to close account menu:
  - If a click occurs outside `.account-wrap` and the account menu is open, the code closes it. This pattern avoids the account menu staying open when the user clicks elsewhere.

Security & Production notes (important to explain to your peers):

- This project is a demo. It stores a demo login flag and email in `localStorage`. Do not use this approach for real authentication.
- Real authentication requires a backend, secure cookie or token storage, and server-side session validation.

Accessibility notes (why some attributes exist):

- `aria-*` attributes: `aria-label`, `aria-controls`, `aria-expanded` improve screen reader and assistive tech behavior.
- `role="button" tabindex="0"` on `.menu-item` makes clickable `div`s keyboard accessible.
- Focus management: the script sets focus to meaningful elements (like inputs and buttons) when dialogs open/close.

How to run and test locally

- Open `FInals_Group/index.html` in a browser to view the main page.
- Click on a `.menu-item` while not logged in — the site will show a toast and open the login modal.
- Submit the login form with any email to simulate signing in. After sign-in, ordering continues (demo uses `alert`).
- You can also open `FInals_Group/login.html` to see the dedicated login page used by the header `loginBtn` link.

Next steps I can do for you (pick any):
- Create annotated inline comments directly inside the source files (`index.html`, `style.css`, `script.js`).
- Make the login flow open a popup and handle `postMessage` login confirmation (demo already listens for it).
- Replace `alert()` placeholders with nicer UI (order dialog) and a demo cart.

If you want, I can also create a printable one-page summary you can present to your professor and peers.

---
End of documentation file.
