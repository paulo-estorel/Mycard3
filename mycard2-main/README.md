# Smart Business Card

A lightweight, framework-free digital business card. An NFC card or QR code opens a profile URL; the page renders the profile data.

## Files
| File | Purpose |
|---|---|
| `index.html` | Simple home page with a link to the demo profile |
| `profile.html` | Page shell (SEO tags, scripts). Content is rendered by JS |
| `css/style.css` | All styling. Theme colors are CSS variables at the top |
| `js/main.js` | CONFIG, profile data, icons, rendering, QR code, SEO updates |
| `js/contact.js` | Builds and downloads the `.vcf` file |
| `js/share.js` | Web Share API, fallback share sheet, toast notifications |
| `js/analytics.js` | Event tracking (queued in localStorage, optional beacon to your API) |
| `images/`, `assets/icons/` | Put real photos and icons here |

## How NFC and QR connect to the profile
The NFC chip stores only a URL, nothing else. Use `?src=nfc` on the NFC URL and `?src=qr` on the QR URL (the QR on the page already adds it) so analytics can tell them apart. The page removes `?src=` from the address bar after reading it, so shared links stay clean.

- NFC URL example: `https://yourdomain.com/profile.html?u=alex-morgan&src=nfc`
- With pretty URLs enabled: `https://yourdomain.com/p/alex-morgan?src=nfc`

## Change the business information
Open `js/main.js` and edit the `PROFILES` object. Add another entry (for example `'jane-smith'`) to create another profile; each is reached with `?u=jane-smith`. Set `photo` to an image path like `images/profile.jpg` (square, at least 600px). Without a photo, initials are shown. Set `active: false` to deactivate a profile. Change `CONFIG.defaultSlug` and `CONFIG.prettyUrls` at the top of the file.

## Pretty URLs (/p/john-doe)
Turn on `prettyUrls` in `CONFIG`, then add a rewrite on your host:
- Netlify `_redirects`: `/p/*  /profile.html  200`
- Vercel `vercel.json`: `{"rewrites":[{"source":"/p/:slug","destination":"/profile.html"}]}`
- Apache `.htaccess`: `RewriteEngine On` then `RewriteRule ^p/([^/]+)/?$ profile.html [L]`

Asset paths in `profile.html` are relative, so for pretty URLs change them to start with `/` (for example `/css/style.css`).

## Deploy
Upload the folder to any static host: Netlify, Vercel, Cloudflare Pages, GitHub Pages, or regular hosting. You need HTTPS (hosts above provide it) for the Web Share API and clipboard. Test locally with `python3 -m http.server` and open `http://localhost:8000/profile.html`.

## Custom domain
Buy a domain, add it in your host's dashboard (Domains), then create the DNS records the host shows (usually a CNAME for `www` and an A or ALIAS record for the root). Wait for DNS and the HTTPS certificate, then use that domain in the NFC URL. Pick the final domain before programming cards, because the cards store that URL.

## Program the NFC card
1. Buy NTAG213, NTAG215 or NTAG216 cards.
2. Install the free "NFC Tools" app (iPhone or Android) and open Write, then Add a record, then URL/URI.
3. Enter the profile URL with `?src=nfc`, tap Write, and hold the card to the back of the phone.
4. Test by tapping it on a different phone. Optionally lock the tag (Other, Lock tag) so it cannot be overwritten; this cannot be undone.

## Add PHP + MySQL later
1. Create tables: `users`, `profiles` (slug, name, title, tagline, photo, active), `businesses`, `services`, `products`, `social_links`, `nfc_cards` (uid, profile_id, active), `analytics` (profile_id, event, source, meta, created_at). The `PROFILES` object already follows these fields.
2. Add `api/profile.php?slug=` returning the same JSON shape as one `PROFILES` entry. In `main.js`, make `getProfile()` fetch that endpoint and have `init()` await it.
3. Add `api/track.php` that inserts the posted event into `analytics`, then set `CONFIG.analyticsEndpoint`.
4. For rich link previews on WhatsApp and Facebook (they do not run JavaScript), have PHP print the title and Open Graph tags into `profile.html` on the server.
5. Build the admin dashboard (`/admin`) with login, profile CRUD, photo upload, QR generation, NFC assignment, analytics charts and an active toggle, all calling the same API.
