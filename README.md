# Vaani

A scene-led, multilingual voice-summary concept for everyday shops. Vaani is a working name.

Open `index.html` in a browser. It is self-contained, including its generated English, Hindi and Marathi voice samples. No account or internet connection is required. The editable React/TypeScript source is in `vaani-source.zip`.

## What works

- Original Three.js sound sculpture, pointer movement and subtle audio response
- English/Hindi/Marathi audio selection with one shared playback owner
- Sample sales, cash/UPI, credit and expiry dashboard
- Workflow steps and FAQ disclosures
- Keyboard-accessible dashboard, reduced-motion scene and static WebGL fallback

## What this is not

This is a design concept with illustrative data, not a working connection to a shop. No uploads, live calculations, AI service, payments or customer authentication are implemented. Audio selection does not translate the whole interface. Price cards are pilot proposals. The demo period is frozen at 24 September to 7 October 2026, referenced to 8 October.

## Development

Source uses React, React DOM and esbuild, with Three.js vendored under MIT. Bundle `src/main.tsx`, using the automatic JSX transform and data-URL loaders for `.wav` and `.png`. The generated static build is deployable on any static host.

## Checks

Local Chrome checks cover 320px, 390px and 1280px layouts, language playback, rapid switches, workflow tabs, FAQ, dashboard focus/escape/background lock, reduced motion and unavailable WebGL. Actual phone playback and native-speaker voice quality still need review.

To rebuild: unzip `vaani-source.zip`, run `npm install`, then `npm run build`. Open or deploy `dist/index.html`. The rebuild needs Node.js and an internet connection for the initial dependency install. The finished HTML is standalone. The archive includes the build script and package manifest.

## Live pilot account features
Firebase Authentication (email/password) and Cloud Firestore use the owner's `vaani-bi` Spark project. Sign-in persists only for the browser session. Each authenticated UID can read/write/delete only its own shop profile and one demo request. The project owner can review requests in the Firebase console through owner IAM access. Firebase's browser configuration is public by design; authorization is enforced by `firestore.rules`, not by hiding the browser config. No service-account key is present.

Saved fields: shop name, preferred language and update time; an explicitly submitted demo request also saves the authenticated email and a message. Passwords are handled by Firebase Auth, never profile documents. User-facing data disclosure and delete controls are in the account section. Export uploads, automated summaries, payments, phone login and analytics are not connected. Never enable test-mode rules or paid billing to fix a quota issue.

Free-tier caveats: quota exhaustion stops requests; password reset email has a daily quota. This is a small pilot, not a production security/compliance certification. Data is in the owner's Firebase cloud project, not on the owner's personal computer.
