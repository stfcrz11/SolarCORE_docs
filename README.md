# SolarCORE Documentation

The documentation website for **SolarCORE**, a GIS-based solar installation tracking system: what it is, how to install and configure it, user guides for each role, and deployment notes.

Published with GitHub Pages at `https://<your-username>.github.io/solarcore-docs/`.

This repository holds **only the documentation**. SolarCORE's code is in a separate, private repository.

## Editing

The site is plain HTML, CSS and JavaScript, with no build step.

| File | What it is |
|---|---|
| `*.html` | One file per page. Edit the text inside `<article class="doc">`. |
| `assets/js/docs.js` | The page list (`NAV`, at the top), the sidebar, previous/next links, "On this page", copy buttons and the theme switch. |
| `assets/css/docs.css` | All styles, with light and dark colours at the top. |
| `assets/img/logo.png` | The SolarCORE logo. |
| `.nojekyll` | Tells GitHub Pages to publish the files as they are. Keep it. |

**To add a page:**
1. Copy an existing page and rename it.
2. Replace the content inside `<article class="doc">…</article>`, and update the `<title>` and `<meta name="description">`.
3. Add it to `NAV` in `assets/js/docs.js`.

Useful building blocks inside a page:

```html
<p class="eyebrow">Section name</p>
<h1>Page title</h1>
<p class="lead">One-paragraph summary.</p>

<h2>A section</h2>            <!-- appears in "On this page" -->
<span class="ui">Button label</span>
<div class="callout callout--tip"><span class="callout__title">Tip</span> Text.</div>
<!-- callout, callout--tip, callout--warn, callout--danger -->
<ol class="steps"><li><strong>Step title</strong> Details.</li></ol>
<pre data-label="Terminal"><code>command here</code></pre>
```

## Previewing locally

Open `index.html` in a browser. Or, from this folder, serve it:

```bash
php -S localhost:8000
```

Then go to <http://localhost:8000>.

## Publishing

Push to `main`. GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root) republishes within a minute or two.

## Never put here

This repository is public. Do not add:
- passwords, including the initial administrator password;
- API keys, or anything from a `.env` file;
- screenshots or examples with real customer names, addresses or phone numbers.

---

© 2026 SolarCORE Team · College of Information Technology, University of La Salette, Inc. · In partnership with ABS Global Management, Inc.
