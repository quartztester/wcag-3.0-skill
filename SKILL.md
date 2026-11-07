---
name: wcag-3.0-skill
description: Audit websites against the W3C Accessibility Guidelines (WCAG) 3.0 Working Draft with WCAG 2.2 mapping, produce a prioritized accessibility report, and apply fixes after user approval. Use whenever the user mentions WCAG, accessibility, a11y, ADA or Section 508 compliance, screen-reader support, keyboard navigation, color contrast, alt text, ARIA, focus indicators, captions, transcripts, VPAT, an accessibility report, "is my site accessible", "make my site accessible", or a low-vision or keyboard user having trouble — even if they never say "WCAG".
---

# WCAG 3.0 Site Audit & Remediation

Audit a website against WCAG 3.0 requirements, report failures with evidence,
and fix them once the user approves. Three inputs can be audited: a live URL
(rendered DOM via headless browser), a codebase (templates/CSS/JS sources), or
both. Always start by asking which you have — or detect both if the user gives
a repo plus a dev-server URL.

## Ground rules — read before anything

1. **WCAG 3.0 is a W3C Working Draft** (Sept 2026), not a Recommendation. It is
   "inappropriate to cite as other than work in progress". WCAG 2.2 is the
   standard laws and contracts reference today. So: audit against WCAG 3.0
   requirement text, map every finding to its WCAG 2.2 success criterion, and
   word reports as "audited against WCAG 3.0 WD with WCAG 2.2 mapping". Never
   say "certified" or "fully compliant with WCAG 3.0".
2. **Report first, fix later.** Present the prioritized report and wait for the
   user to approve fixes (all, a subset, or none). Accessibility changes alter
   visual design and behavior; unilateral edits surprise users.
3. **Assertions are not auditable from code.** WCAG 3 distinguishes testable
   requirements from "assertions" (an organization claiming it has a style
   guide, ran usability testing, etc.). List assertions for the user to
   self-attest; never mark them pass/fail from a site audit.
4. **Say what was not tested.** Manual-review items (clear language, cognitive
   load, real screen-reader walkthroughs) and org assertions get their own
   report sections. An honest "needs human review" beats a false pass.

## Workflow

### Phase 1 — Scope

Ask or infer: target URL(s) (is a dev server running? what port?), repo path
if source is available, and any user-reported pain points ("keyboard user
can't reach the menu" narrows the first pass). If the user gave only a repo,
offer to run its dev server or build output. If only a URL, skip source checks.

### Phase 2 — Automated rendered audit

From this skill's directory (deps must be installed — run `npm install` once;
browsers via `npx playwright install chromium` if launch fails):

```bash
node scripts/audit.js --url http://localhost:8080/ --crawl 5
```

- `--url` repeatable; `--crawl N` follows same-origin links up to N extra pages
- Writes `wcag-audit-output/findings.json` (machine-readable) and
  `wcag-audit-output/wcag3-report.md` (draft report)
- Runs axe-core plus custom WCAG 3 checks (page titles, heading structure,
  transcripts near media, focus-indicator size, autoplay audio, reflow)
- Exit code is always 0 — read the JSON, don't gate on it

Feed it the important page *types*, not everything: home, one long post, one
media-heavy post, a form page, a tag/list page. 5–10 pages is usually enough;
add `--sitemap <url>` to pull URLs from a sitemap.xml if present.

### Phase 3 — Source-level checks

Not everything survives to the DOM or is visible to axe. In the repo, check:

- `prefers-reduced-motion` honored? grep CSS for `@media (prefers-reduced-motion`
  (WCAG 3 §2.6.1 No visual motion / 2.2 SC 2.3.3)
- CSS `transition`/`animation` on hover/focus with no reduced-motion override
- `outline: none` or `outline-` resets without a `:focus-visible` replacement
  (§2.3.1 Keyboard focus appearance / 2.2 SC 2.4.11)
- `user-scalable=no`, `maximum-scale` in viewport metas (§2.12.3 Text reflow)
- Templates emitting `<img>` without `alt` attributes at all (§2.1.1)
- Icons-only links/buttons in templates missing `aria-label` (§2.3.5)
- Videos embedded without `<track kind="captions">` or a transcript link
  (§2.1.4/§2.1.5)
- Form fields without label/id pairing in source (§2.3.5, §2.5.1)

### Phase 4 — Manual review checklist

Read `references/wcag3-requirements.md` and walk the "manual" rows for the page
types audited (clear language, conventional layout, help availability, error
prevention, time limits...). Best-effort review from rendered pages and
screenshots; flag anything inconclusive as "needs human review" rather than
guessing. If Playwright is available, a keyboard-only walk (Tab through the
main flows, screenshot focus states) covers most focus-order findings.

### Phase 5 — The report

Merge script output + source checks + manual review into this exact structure:

```markdown
# Accessibility Audit — <site> (<date>)
Audited against WCAG 3.0 Working Draft (Sept 2026), mapped to WCAG 2.2.
WCAG 3.0 is a draft; this is not a conformance claim.

## Summary
| WCAG 3 area | Core fails | Supplemental | Needs review |
|---|---|---|---|
(pages audited, tool versions, one-line worst offender)

## Findings
### [FAIL] <Requirement name> (Core) — WCAG 2.2: <SC>
- Evidence: <selector(s), page(s), counts>
- Impact: <who is blocked and how>
- Fix: <one-line remedy> → fix-patterns.md#<anchor>

### [REVIEW] <Requirement name> (Core)
- What to check and why it can't be automated

## Manual review needed
## Organizational assertions (self-attest)
## Not tested / limitations
```

Order findings by impact on users (keyboard traps > contrast > names > structure).
Core requirement failures beat Supplemental ones. Every FAIL cites evidence.

### Phase 6 — Fix (only after approval)

Apply fixes per `references/fix-patterns.md`. Group edits into reviewable
commits (one WCAG area per commit is a good size). Do not refactor beyond the
fix; do not change visual design beyond what the finding requires — if a
contrast fix needs a palette change, show the user the new colors first.

### Phase 7 — Re-verify

Re-run the same `audit.js` invocation on the fixed site, diff the findings
(`findings.json` before vs after), and show the user the delta: which findings
closed, which remain, which are now unblocked. Loop phases 5–7 until the user
is satisfied.

## What is automatable vs not

| Class | Meaning | Examples |
|---|---|---|
| auto | Script detects + evidence in DOM | alt text, contrast ratio, names, lang, captions track, autoplay |
| manual | Human judgment needed | clear language, conventional layout, help quality |
| org | Assertion about org process | style guides, usability testing |

Roughly 40% of WCAG 3 core requirements are auto-checkable on a content site;
the rest is why the report has a manual section. Do not pad the report with
org-level assertion items as failures.

## Repo layout

- `scripts/audit.js` — rendered-page audit (axe-core + WCAG 3 custom checks)
- `references/wcag3-requirements.md` — the requirement checklist, mappings,
  testability classes; read for Phase 4 and for report wording
- `references/fix-patterns.md` — fix recipes keyed by finding
- `evals/evals.json` — test prompts for this skill
