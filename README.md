# wcag-3.0-skill

An [OpenCode](https://opencode.ai) / Claude-style agent skill that audits a
website against the **W3C Accessibility Guidelines (WCAG) 3.0 Working Draft**
(Sept 2026), maps every finding to **WCAG 2.2** (the citable standard today),
produces a prioritized evidence-backed report, and applies fixes after user
approval.

Read the full workflow in [`SKILL.md`](SKILL.md).

## What it does

- **Rendered-page audit** (`scripts/audit.js`): headless Chromium + axe-core,
  plus custom WCAG 3 checks axe doesn't cover — page titles, heading structure,
  transcripts adjacent to media, focus-indicator size, autoplay audio, reflow.
- **Source-level checks**: templates/CSS greps for `prefers-reduced-motion`,
  `outline: none`, viewport zoom locks, alt-less image templates.
- **Manual review checklist**: `references/wcag3-requirements.md` classifies
  every WCAG 3 WD requirement as auto / manual / org-assertion with its
  WCAG 2.2 mapping.
- **Fix recipes**: `references/fix-patterns.md`, keyed by finding.
- **Report first, fix later**: nothing is edited until you approve.

## Usage (as a skill)

Copy or symlink this directory into your agent's skills folder
(e.g. `~/.config/opencode/skills/`), then ask:
"Audit http://localhost:8080/ against WCAG 3 and tell me what fails."

## Usage (standalone)

```bash
npm install
npx playwright install chromium   # if no browser cached
node scripts/audit.js --url http://localhost:8080/ --crawl 5
# -> wcag-audit-output/findings.json + wcag-audit-output/wcag3-report.md
```

## Honest limitations

- WCAG 3.0 is a **Working Draft** — this never claims conformance, only
  requirement-by-requirement findings with draft-status context.
- ~40% of core requirements are machine-checkable; the report lists the rest
  as manual review items instead of guessing.
- Organizational assertions (style guides, usability testing) are surfaced for
  self-attestation, never pass/failed from code.
- WCAG 3's contrast methodology is still in flux; thresholds used are the
  WCAG 2.2 ratios.

## Repo layout

```
SKILL.md                       agent workflow + report template
scripts/audit.js               browser audit (axe-core + custom checks)
references/wcag3-requirements.md  full WD requirement checklist + 2.2 mapping
references/fix-patterns.md     fix recipes keyed by finding
evals/evals.json               test prompts
```

## License

MIT
