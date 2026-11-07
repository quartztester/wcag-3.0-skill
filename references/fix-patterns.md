# Fix Patterns

One recipe per finding type. Anchors are referenced from audit reports. Each
recipe: symptom → fix → verify. Apply only after user approval (Phase 6).
Keep fixes minimal — this is remediation, not refactoring.

## image-alternatives
Symptom: `<img>` missing/empty alt on non-decorative image (axe `image-alt`,
`input-image-alt`, `role-img-alt`, `area-alt`).
Fix: write alt text conveying the image's *purpose in context*, ≤ ~100 chars.
Charts/diagrams: 1-sentence summary + point to nearby text or a data table.
```html
<img src="revenue.png" alt="Revenue doubled between March and June">
```
Verify: `node scripts/audit.js --url <page>`; finding closes.

## decorative-images
Symptom: image flagged decorative but has no alt.
Fix: `alt=""` (empty). Never alt="spacer" or alt="image".
```html
<img src="divider.png" alt="">
```

## captions
Symptom: `<video>` without `<track kind="captions">` (axe `video-caption`).
Fix:
```html
<video controls src="demo.mp4">
  <track kind="captions" src="demo.en.vtt" srclang="en" label="English" default>
  <track kind="descriptions" src="demo.desc.vtt" srclang="en" label="Descriptions">
</video>
```
VTT format: `WEBVTT` header, `HH:MM:SS.mmm --> HH:MM:SS.mmm` cue lines.
No transcript file available → flag as content work for the user; do not
fabricate captions.

## transcripts-findable
Symptom: audio/video without an adjacent transcript (custom check).
Fix: link the transcript next to the player, not buried in prose:
```html
<a href="/transcripts/demo/">Read the transcript</a>
```

## text-contrast
Symptom: contrast < 4.5:1 body / < 3:1 large text (axe `color-contrast`).
Fix: adjust the text or background color token. Compute the ratio first —
WCAG 3's final contrast method may change, so 2.2 ratios are the safe target:
```js
// luminance per WCAG (sRGB channels normalized to 0-1, c<=0.03928? c/12.92 : ((c+0.055)/1.055)**2.4)
const L = ([r,g,b]) => 0.2126*R + 0.7152*G + 0.0722*B;
const ratio = (a,b) => { const [x,y]=[L(a),L(b)].sort((m,n)=>n-m); return (x+0.05)/(y+0.05); };
```
Palette change needed → show user before/after swatches first.
Text over photos: add a solid scrim layer under the text.

## graphical-object-contrast
Symptom: icons/borders of meaningful graphics < 3:1 (2.2 SC 1.4.11).
Fix: darken the icon stroke/fill or surrounding surface.

## focus-indicator
Symptom: focus invisible or < 2px (custom check; CSS `outline: none`).
Fix: restore a visible indicator — never remove focus styles without a
replacement. `:focus-visible` avoids the mouse-click outline:
```css
:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
/* keep it ≥3:1 against the background; 2px minimum thickness */
```
Verify: Tab through the page; re-run audit.

## heading-structure
Symptom: no h1, skipped heading levels (custom check).
Fix: one `h1` mirroring the page title; sections step h2 → h3 without jumps.
Never use heading tags for font size — style the element instead.

## page-title
Symptom: empty or duplicate `<title>` (custom check).
Fix: `"<Page-specific thing> — <Site name>"`, unique per view.

## language
Symptom: missing/invalid `<html lang>` (axe `html-has-lang`).
Fix: `<html lang="en">` (or the page's actual language); wrap foreign phrases
`<span lang="es">gracias</span>`.

## accessible-names
Symptom: icon-only links/buttons unnamed (axe `link-name`, `button-name`).
Fix: visible text preferred; otherwise `aria-label` with the *action*:
```html
<button aria-label="Close menu">×</button>
<a href="/feed/" aria-label="RSS feed">...</a>
```
Label ⊆ accessible name (2.5.3): never let aria-label contradict visible text.
SVG icons: `aria-hidden="true"` when decorative.

## form-labels
Symptom: inputs without labels (axe `label`).
Fix: real `<label for>` — placeholder is never a label:
```html
<label for="email">Email</label>
<input id="email" type="email" autocomplete="email" required>
```

## form-errors
Symptom: errors invisible to AT or color-only (§2.5).
Fix: text message linked to the field, announced:
```html
<input id="email" aria-describedby="email-err" aria-invalid="true">
<p id="email-err" role="alert">Enter an email like name@example.com.</p>
```
Suggest the fix (SC 3.3.3), don't just say "invalid".

## landmarks-and-skip
Symptom: no landmarks / no way past repeated nav (axe `region`, `bypass`).
Fix:
```html
<a class="skip-link" href="#main">Skip to content</a>
<header>/<nav aria-label="Main">/<main id="main">/<footer>
```
Skip link: visually hidden until focused.

## lists-and-tables
Symptom: div-styled lists, tables without headers (axe `list`, `th-has-data-cells`).
Fix: real `<ul>/<ol>/<li>`; tables get `<th scope="col">`. Layout-only tables
should be replaced with CSS.

## reduced-motion
Symptom: animations without a reduced-motion override (source check).
Fix:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
```
Autoplaying video loops: pause them under the same media query.

## autoplay-audio
Symptom: audio/video autoplays with sound > 3s and no control (axe
`no-autoplay-audio`).
Fix: `muted` + `controls`, or don't autoplay.

## reflow-and-zoom
Symptom: `user-scalable=no`/`maximum-scale` in viewport meta (axe
`meta-viewport`); 2-D scrolling at 320px.
Fix: `<meta name="viewport" content="width=device-width, initial-scale=1">`;
replace fixed widths with max-width; allow wrap.

## target-size
Symptom: tap targets < 24×24px (axe `target-size`).
Fix: padding/min-height on the control — don't grow the icon, grow the target.

## keyboard-traps
Symptom: focus stuck in a widget (manual Tab walk).
Fix: Esc closes modals and returns focus to the opener:
```js
closeBtn.addEventListener("click", () => { modal.close(); opener.focus(); });
modal.addEventListener("keydown", e => { if (e.key === "Escape") closeBtn.click(); });
```

## aria-validity
Symptom: invalid ARIA attributes/roles/values (axe `aria-*`).
Fix: usually delete the ARIA and use native semantics (`<button>` not
`role="button"`). ARIA is a patch for custom widgets, not a second semantics
layer. When removing ARIA, re-run the audit — names/roles often depend on it.

## change-announcements
Symptom: dynamic updates silent to AT (§2.3.5 Changes to elements notified).
Fix: `aria-live="polite"` region for status; `role="alert"` only for errors.
Keep live text short; never put the whole feed in a live region.

## clear-language (manual)
Symptom: §2.2.3 requirements flagged for review.
Fix guidance for the user: expand abbreviations on first use, split sentences
over ~25 words, replace idioms in instructions. Content change — needs user.

## after-every-fix
1. Re-run `node scripts/audit.js` on affected pages.
2. Diff `wcag-audit-output/findings.json` against the pre-fix copy.
3. Show the user: closed / remaining / new findings.
4. Keyboard-walk the changed flow; screenshot focus states.
