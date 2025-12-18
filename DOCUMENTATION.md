# Niskapi Co. — Code Documentation

This document describes how the site is structured and how the files work together. It is written for beginners and matches the current project files.

Files covered:
- `index.html` — page structure and content
- `style.css` — visual styles and layout
- `script.js` — interactive behavior and UI logic

index.html

- The document starts with `<!doctype html>` and `<html lang="en">` to declare HTML5 and the page language.
- The `<head>` includes `<meta charset="utf-8">`, a responsive viewport meta tag, the page `<title>`, and a stylesheet link to `style.css`.
- The visible UI is inside `<body>`.

- Header and navigation:
  - The header contains a `.logo` with the site brand `Niskapi Co.` and a `.nav-wrap` section.
  - The primary navigation (`#main-nav`) has links to `#menu`, `#location`, and `#about`.
  - The account area contains a `#loginBtn` which shows `Log in` by default and an `.account-menu` that appears after sign-in with `Profile` and `Log out` actions.
  - A `.hamburger` button toggles the mobile menu and contains a small SVG icon.

- Hero section:
  - `.hero-hero` is a large introductory area. `.hero-media` is a placeholder for a background image or video. `.hero-overlay` darkens the media for readable text.
  - `.hero-inner` includes the main heading `Niskapi`, a local-language tagline, and two CTA buttons: `View Menu` and `Find Us`.

- Menu section (`#menu`):
  - A `.card` contains `.menu-list`, which displays several `.menu-item` entries.
  - Each `.menu-item` uses `role="button"` and `tabindex="0"` so it can be focused and activated by keyboard users.
  - Menu items store small pieces of data using `data-*` attributes. `data-name` holds the product name; `data-price` is set to the numeric price in pisos for consistent data usage.
  - Visual prices are shown as text like `15 pisos`, and images are supplied via inline `background-image` styles that reference files in `Img_&_Vids/`.

- Location and About cards:
  - The `#location` card shows the address `Shabu, Nashawara, Nigeria`, hours, and an embedded placeholder image for a map.
  - The `#about` card contains a short local-language paragraph describing the brand.

- Footer and modals:
  - The footer displays the current year in the `<span id="year">` (filled by JavaScript).
  - A login modal (`#modalBackdrop` and inner `.modal`) contains `#loginForm` with `email` and `password` inputs and `Cancel`/`Sign in` buttons.
  - `#toast` is a small notification element used to show short messages. `#noticeBackdrop` and `.notice-modal` show short notices like "Coming soon".

style.css

- Global reset and box model: `* { box-sizing: border-box; margin: 0; padding: 0 }` ensures predictable sizing.
- Root variables such as `--accent`, `--bg-dark`, and `--muted` centralize color choices.
- The `body` sets the font stack, background gradient, and default text color.
- Header uses `display:flex` for horizontal layout; `backdrop-filter` and semi-transparent backgrounds create a glass-like header over the hero.
- Navigation is mobile-first: `.nav` is hidden by default and becomes visible at `@media (min-width: 768px)`. The `.hamburger` is visible on small screens and hidden on larger viewports.
- Buttons have a base `.btn` style and a `.btn.primary` variant for primary actions.
- The hero area uses absolute `.hero-media` with `.hero-overlay` and a centered `.hero-inner` for content. Responsive font sizes use `clamp()`.
- Grid layout (`.grid`) organizes cards; `.card` provides panel styling.
- `.menu-item` uses `background-size: cover` for images and reveals `.menu-overlay` on hover/focus by animating opacity and transform.
- Modals and toast use fixed or centered positioning; JS toggles `display` and accessibility attributes to show/hide them.

script.js

- The script runs after `DOMContentLoaded` to ensure elements exist before use.
- Key element references are obtained with `document.getElementById` and `querySelectorAll` for event wiring.
- `yearSpan.textContent = new Date().getFullYear();` keeps the footer year current.
- Demo state variables: `loggedIn` indicates whether the user is signed in; `pendingOrder` stores an attempted order while logged out.
- `showToast(message, duration)` makes the toast visible and hides it after a timeout.
- The hamburger toggles the mobile nav and updates `aria-expanded` for accessibility.
- `#loginBtn` opens the login/flow when not signed in; when signed in it toggles the account menu.
- Menu items use their `data-name` and `data-price` values. When an item is activated, the script checks `loggedIn`: if signed in the demo proceeds (alerts), if not it stores `pendingOrder`, shows a toast, and opens the login modal.
- The login form submit handler prevents default submission, reads the email, sets `loggedIn = true`, stores a demo flag and email in `localStorage`, closes the modal, and resumes any pending order flow.
- `window.addEventListener('message', ...)` listens for cross-window login messages if the login page uses `postMessage` to notify the parent window.
- Account actions include `accountLogout` (clears demo login state) and `accountProfile` (shows a notice modal for unimplemented features).

Security and accessibility notes

- This project is a client-side demo. Do not rely on `localStorage` for secure authentication in real applications.
- `aria-*` attributes, `role="button"`, and `tabindex` improve accessibility; focus management in the script helps keyboard users.

How to test locally

- Open `FInals_Group/index.html` in a browser.
- Click any menu item while not signed in to see the toast and login modal.
- Submit the login form to simulate signing in; the demo will resume any pending order.

If you want any further changes (for example different numeric formats in `data-price`, different displayed currency text, or replacing `alert()` with a custom order dialog), tell me which option and I will apply it.

