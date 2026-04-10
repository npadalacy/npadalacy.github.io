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

## Info to request from DevOps (so AWS will work with GitHub Pages)
# Ask them for:
- Public API base URL (API Gateway or ALB)
- CORS allow-origin: https://npadalacy.github.io
- Endpoint: POST /chat/messages
- Expected request/response JSON format
- Change below parameter in this file AmazonConnectChat/assets/js/app.js
- MODE SWITCH
- Keep "demo" for now.
- When AWS is ready: set CHAT_MODE = "aws" and set AWS_API_BASE_URL.
   
## AWS Backend Integration (AmazonConnectChat)

This site is a static GitHub Pages app. To connect the chat UI to your own AWS backend, you must provide an HTTPS API endpoint and enable CORS for the GitHub Pages domain.

### How the chat works

The chat UI supports two modes:

- **Demo mode** (default): replies are generated locally in the browser.
- **AWS mode**: each customer message is sent to an AWS API endpoint, and the server returns a reply.

### Configure AWS mode

1. Open this file:

   `AmazonConnectChat/assets/js/app.js`

2. Set the mode:

   ```js
   var CHAT_MODE = "aws";
   // var CHAT_MODE = "demo";
   ```

   If you do not yet have a working AWS API, keep `CHAT_MODE = "demo"`.

3. Set the AWS API base URL:

   ```js
   var AWS_API_BASE_URL = "https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/YOUR_STAGE";
   ```

   Example:

   ```js
   var AWS_API_BASE_URL = "https://abc123.execute-api.us-east-1.amazonaws.com/prod";
   ```

### API contract (frontend -> AWS)

The frontend will call:

- `POST {AWS_API_BASE_URL}/chat/messages`

Request JSON sent by the browser:

```json
{
  "sessionId": "s_xxx",
  "messageId": "m_xxx",
  "timestamp": "2026-04-10T18:22:10Z",
  "from": "customer",
  "text": "Hello"
}
```

The backend must respond with JSON in either format:

Option A:
```json
{ "reply": { "text": "Hi! How can I help?" } }
```

Option B:
```json
{ "replyText": "Hi! How can I help?" }
```

### CORS requirements (must be configured in AWS)

Because this site is hosted on GitHub Pages, the AWS API must allow browser requests from:

- `https://npadalacy.github.io`

CORS must allow:
- Methods: `POST, OPTIONS`
- Headers: `Content-Type` (and `Authorization` if you add auth later)

### Troubleshooting

If AWS mode shows an error or no reply:
- Verify `AWS_API_BASE_URL` is correct (no trailing spaces)
- Verify the endpoint `POST /chat/messages` exists
- Verify CORS is enabled for `https://npadalacy.github.io`
- Check AWS logs (CloudWatch) for request errors
