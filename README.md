# npadalacy.github.io

Personal  GitHub Pages site for [npadalacy](https://github.com/npadalacy).

**Live URL:** https://npadalacy.github.io/

---

## Projects

| Path | URL | Description |
|------|-----|-------------|
| `/` | https://npadalacy.github.io/ | Root landing page — links to all demos |
| `AmazonConnectChat/` | https://npadalacy.github.io/AmazonConnectChat/ | Amazon Connect Chat demo site |

---

## GitHub Pages Deployment

This repository is deployed automatically via **GitHub Pages** from the `main` branch (root `/` source).

### Enable GitHub Pages (first-time setup)

1. Go to **Settings → Pages** in this repository.
2. Under **Source**, select `Deploy from a branch`.
3. Choose branch: `main`, folder: `/ (root)`.
4. Click **Save**.

GitHub will build and publish the site within ~60 seconds.  
The URL will be `https://npadalacy.github.io/`.

### Local preview

No build step is needed — this is a plain static site.  
Open `index.html` directly in a browser, or use any static file server:

```bash
# Python (built-in)
python3 -m http.server 8080
# Then open http://localhost:8080
```

---

## Structure

```
npadalacy.github.io/
├── index.html                        # Root landing page
├── README.md                         # This file
└── AmazonConnectChat/
    ├── index.html                    # Amazon Connect Chat landing page
    └── assets/
        ├── css/
        │   └── styles.css            # All page styles
        └── js/
            └── app.js                # Chat modal & demo automation
```

---

## AmazonConnectChat

A no-framework, no-iframe static page showcasing **Amazon Connect Chat**:

- Hero section with CTA buttons that open a live chat demo modal
- Stats bar, feature grid, how-it-works steps, and a visual chat preview
- Fully functional demo chat modal with:
  - Bot greeting script
  - Keyword-based auto-replies (pricing, setup, integrations, live agent, …)
  - Typing indicators
  - Keyboard accessibility (`Enter` to send, `Esc` to close)
- Floating action button (FAB) to open the chat from any scroll position
- Responsive layout for mobile, tablet, and desktop
- No external dependencies — pure HTML, CSS, and vanilla JS
