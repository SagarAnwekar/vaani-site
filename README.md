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
