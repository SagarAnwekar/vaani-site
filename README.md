# Vaani BI - local daily-sales pilot

Public: https://sagaranwekar.github.io/vaani-site/

The public page is a static React application. `npm ci && npm run build` produces `dist/index.html`. The self-contained page includes generated sample WAV files; device speech is separate.

## Working
- Local CSV import and column mapping for date, cash sales, UPI sales and new credit sales.
- Calendar-date/amount/duplicate-row checks and exact integer-paise arithmetic.
- Summary, latest-day equation, source rows, constrained question buttons and text download.
- Browser speech when a matching voice exists, otherwise a text fallback.
- Firebase email/password account, session persistence, own shop profile and explicit demo request. Existing UID-scoped Firestore rules retained.

## Data boundaries
CSV is processed in tab memory, not uploaded. Extra columns are ignored by calculation and dropped after successful mapping. Remove customer/patient details before import regardless. Refresh clears local CSV. Firebase separately handles account/profile/request data; the project owner sees intentional demo requests. No analytics.

Only daily sales totals are supported. Cash/UPI are new sales, not repayments of old credit. Sales = cash sales + UPI sales + new credit sales. New credit is not outstanding debt. Refunds, expenses, GST, card and other modes require another schema. Max 1 MB / 5,000 rows. CSV numbers have no currency signs/grouping commas; up to 2 decimals.

Not connected: live billing sync, overdue ledger, medicine expiry, WhatsApp automation, payments, server AI. UI labels are English; introduction and brief have English/Hindi/Marathi drafts, requiring native review. Browser voice availability/quality varies. Sample audio is a separate illustrative dataset, never an imported-data response.

## Open-source design sources
Magic UI BorderBeam and BlurFade adapted from https://github.com/magicuidesign/magicui/ (MIT; notice in MAGICUI-LICENSE.md). Motion, React, Firebase Web SDK and PapaParse are dependencies with their respective licenses. Three.js legacy source retained with THREE-LICENSE.txt but no longer rendered on the landing page. No financial count-up animation.

VoxCPM evaluated, not installed or hosted. VoxCPM2 supports Hindi but Marathi is not officially listed; Apache-2.0, about 8 GB VRAM. GitHub Pages cannot host its inference server. See https://github.com/OpenBMB/VoxCPM/ .

## QA
320/390/1280/1920: no page overflow or JS errors. Decimal arithmetic, dates, duplicate/negative/blank/excess precision inputs, source rows, downloads, language brief change, collapsed account and absent-voice fallback tested. Reduced motion tested with zero running animations. Real-phone playback/native-language quality and production scale are not certified.
