# WCAG 3.0 Requirements Checklist (Working Draft, Sept 2026)

Source: https://www.w3.org/TR/wcag-3.0/ — distilled for site audits. The draft
labels every requirement Core or Supplemental and gives section status
(Placeholder/Exploratory/Developing/Refining/Mature); everything in the WD is
"Developing" unless noted. Mapping column = the WCAG 2.2 success criterion
(SC) covering the same ground (what laws cite today).

Class legend: **auto** = machine-checkable on rendered pages, **manual** =
human judgment, **org** = assertion about the organization (never pass/fail
from a site audit — list for self-attestation).

Use this file for Phase 4 (manual review) and for exact requirement wording in
reports. Anchors like `#image-alternatives` match fix-patterns.md.

## Contents
- 2.1 Images and media
- 2.2 Text and wording
- 2.3 Interactive components
- 2.4 Input / operation
- 2.5 Error handling
- 2.6 Animation and movement
- 2.7 Layout
- 2.8 Consistency across views
- 2.9 Process and task completion
- 2.10 Policy and protection
- 2.11 Help and feedback
- 2.12 User control
- Organizational assertions summary

## 2.1 Images and media

| Requirement | Class | Test | WCAG 2.2 | What to check |
|---|---|---|---|---|
| Images detectable | Core | auto | 1.1.1 | Non-decorative images exist as detectable elements |
| Decorative images hidden | Core | auto | 1.1.1 | Decorative imgs have `alt=""` / `role="presentation"` |
| Image alternatives available | Core | auto | 1.1.1 | Every non-decorative img/area/input-image/object has alt text |
| Image alternatives equivalent | Core | manual | 1.1.1 | Alt text conveys the *purpose*, not a description of pixels |
| Figure captions | — | manual | 1.1.1 | Figures have `<figcaption>`; caption visible without focus on figure |
| Non-text content not relied on | Core | auto+manual | 1.1.1 | Media/controls conveying meaning have text equivalents |
| Transcripts findable | Core | auto | 1.2.1/1.2.3-ish | A transcript is adjacent to every audio/video with speech |
| Dialogue transcripts available (prerecorded) | Core | manual | 1.2.1/1.2.3 | Transcript covers the spoken dialogue |
| Descriptive transcripts available | Core | manual | 1.2.3 | Transcript describes visual info (actions, on-screen text) |
| Sounds identified in transcripts | Core | manual | — | Sound effects meaningful to understanding are noted |
| Visual information identified in transcripts | Core | manual | 1.2.3 | Charts/actions/scene changes described |
| Captions available (prerecorded) | Core | auto | 1.2.2 | `<track kind="captions">` on videos; synchronized |
| Captions available (live) | Core | org | 1.2.4 | Live captioning process |
| Captions equivalent / synchronized / unobstructed | Core | manual | 1.2.2 | Accuracy, timing, not covering key content |
| Audio descriptions available (prerecorded) | Core | manual | 1.2.5 | Narration of visual-only information |
| Sign language available | Core | org | 1.2.6 | Sign language track |
| Hue not relied on | Core | manual | 1.4.1 | Information not conveyed by color alone |
| Graphical object contrast sufficient | Core | auto | 1.4.11 | UI icons/graphics contrast ≥ 3:1 against adjacent colors |
| Sound not relied on | Core | manual | 1.3.3-ish | Auditory cues have visual equivalents |
| Accessible media player selected | Core | manual | — (ATAG-ish) | Player itself keyboard-operable; see §2.3 |

## 2.2 Text and wording

| Requirement | Class | Test | WCAG 2.2 | What to check |
|---|---|---|---|---|
| Blocks of text readable (minimum) | Core | auto | 1.4.12-ish | Line height/spacing not locked to unreadable values |
| Text style readable (minimum) | Core | manual | 1.4.8-ish | Not all-italic/all-caps walls of text |
| Text contrast sufficient (minimum) | Core | auto | 1.4.3 | ≥ 4.5:1 body, ≥ 3:1 large text |
| Text contrast sufficient (enhanced) | Suppl. | auto | 1.4.6 | ≥ 7:1 body |
| Blocks of text adjustable | Core | auto | 1.4.4 | Text zoom to 200% without loss; no `user-scalable=no` |
| Text size / style / color adjustable | Core | auto | 1.4.4/1.4.5/1.4.1 | No images of text; no fixed px blocking user styles |
| Text reflow supported | Core | auto | 1.4.10 | 320px viewport reflow without 2-D scrolling |
| Text customizations retained | Suppl. | manual | 1.4.2-ish | User text prefs survive navigation |
| Text detectable | Core | auto | 1.1.1-ish | Text present as text, not baked into images |
| Human language detectable | Core | auto | 3.1.1/3.1.2 | `<html lang>` valid; per-phrase `lang` for language changes |
| Numerical metadata available | Suppl. | manual | — | Numbers/metadata machine-readable (data attributes etc.) |
| Abbreviations explained | Core | manual | 3.1.4 | First use expanded or machine-expandable |
| Non-literal language explained | Core | manual | 3.1.3 | Idioms/metaphors clarified |
| Summaries available | Suppl. | manual | — | Long content gets a summary |
| Common words used | Suppl. | manual | — | Plain language |
| No nested clauses / unnecessary words | Suppl. | manual | — | Sentence complexity |
| Clear language review | — | org | — | Org asserts plain-language process |

## 2.3 Interactive components

| Requirement | Class | Test | WCAG 2.2 | What to check |
|---|---|---|---|---|
| Default focus indicator used | Core | auto | 2.4.7 | Custom focus styles exist or UA default not suppressed |
| Focus indicator contrast sufficient | Core | auto | 2.4.11 | Indicator ≥ 3:1 against background |
| Focus indicator size sufficient | Core | auto | 2.4.11 | Outline ≥ 2px (or equivalent area) |
| Pointer activation indicated | Core | manual | 2.5.2-ish | Press/release feedback |
| Pointer contrast sufficient | Core | auto | 1.4.11 | Pointer/cursor affordances visible |
| Focus relevant | Core | auto | 2.4.3 | Focus not moved by scripts on load/hover |
| Focus retained | Core | manual | 2.4.3 | Focus not lost after dialog/menu close — restore it |
| Focus order meaningful | Core | auto | 2.4.3 | DOM order matches visual/reading order |
| Consistent interactions / control location | Core | manual | 3.2.3/3.2.4 | Same action = same control, same place |
| Conventional pattern used | Core | manual | 3.2.3 | Menus/links/buttons behave as users expect |
| Interactive element contrast sufficient | Core | auto | 1.4.3/1.4.11 | Control text/graphics contrast |
| Interactive element names available | Core | auto | 2.4.4/4.1.2 | Every link/button/field has an accessible name |
| Changes to elements notified | Core | manual | 4.1.3 | Dynamic updates announced (aria-live) |
| Input constraints used | Core | manual | 3.3.2 | Formats/examples shown up front |
| Label included in programmatic name | Core | auto | 2.5.3 | Visible label text ⊆ accessible name |
| Roles, values, states, properties available | Core | auto | 4.1.2 | ARIA valid; states like aria-expanded maintained |

## 2.4 Input / operation

| Requirement | Class | Test | WCAG 2.2 | What to check |
|---|---|---|---|---|
| Keyboard operable | Core | manual | 2.1.1 | All functionality reachable by keyboard alone |
| Keyboard accessible | Core | manual | 2.1.1 | Same via AT virtual cursors |
| No keyboard traps | Core | auto+manual | 2.1.2 | Focus can always leave (modals: Esc) |
| Focus placed | Core | manual | 2.4.3 | Dialogs/SPA route changes move focus deliberately |
| Focus user-controlled | Core | manual | 2.4.3 | No focus hijack on scroll/typing |
| Keyboard effort comparable | Suppl. | manual | 2.1.1 | Not 50 keystrokes for a mouse task |
| No repetitive adjacent interactive elements | Suppl. | manual | 2.4.1-ish | No keyboard slogs past repeated links |
| Pointer activation controllable | Core | manual | 2.5.2 | Down+move+up (drag) has a simple click alternative |
| Simple pointer input available | Core | manual | 2.5.1 | Gestures have single-pointer alternatives |
| Consistent pointer cancellation | Core | manual | 2.5.2 | Activation on release or undoable |
| Pointer speed/pressure not relied on | Core | manual | 2.5.1 | No speed/pressure-only interactions |
| Hover or focus content dismissible | Core | manual | 1.4.13 | Esc or close for tooltips/popovers; hoverable, persistent |
| Path-based gesture not relied on | Core | manual | 2.5.1 | Swipes have button equivalents |
| Input method flexible | Core | manual | 2.5.1 | Works across mouse/keyboard/touch/voice |
| Body movements not relied on | Core | manual | 2.5.4 | No device-motion-only actions |
| Biometrics not relied on | Core | manual | — | Login not biometric-only |
| Speech not relied on | Core | manual | — | Speech-only input has alternatives |

## 2.5 Error handling

| Requirement | Class | Test | WCAG 2.2 | What to check |
|---|---|---|---|---|
| Error notifications available | Core | auto | 3.3.1 | Invalid input announced + visible |
| Error suggestions provided | Core | manual | 3.3.3 | Fix included where known |
| Errors indicated in multiple ways | Core | auto | 1.4.1 | Not color/icon-only — text too |
| Error messages persistent | Core | manual | 3.3.1 | Stays until fixed |
| Errors associated | Core | manual | 3.3.1 | Message programmatically tied to field (`aria-describedby`) |
| Error messages collocated | Core | manual | 3.3.2 | Message near the field |
| Errors preventable | Suppl. | manual | 3.3.4 | Reversible/confirmed submissions |
| Submission status notified | Core | manual | 4.1.3 | Success/progress announced |
| Data entry validated | Suppl. | manual | — | Client-side validation before submit |

## 2.6 Animation and movement

| Requirement | Class | Test | WCAG 2.2 | What to check |
|---|---|---|---|---|
| No flashing over threshold | Core | manual | 2.3.1 | Nothing flashes > 3×/second |
| No visual motion (animation) without need | Core | auto (source) | 2.3.3 | CSS/JS motion honors `prefers-reduced-motion` |
| Trigger warning available | Suppl. | manual | 2.3.1 | Content that can harm is labeled |
| Haptic/audio stimulation adjustable | Suppl. | manual | — | Can be disabled |

## 2.7 Layout

| Requirement | Class | Test | WCAG 2.2 | What to check |
|---|---|---|---|---|
| Page/view title available | Core | auto | 2.4.2 | `<title>` describes the page, unique per view |
| All steps listed / current step indicated | Core | manual | — | Multi-step flows show progress |
| Page/view change notified | Core | manual | 4.1.3 | SPA route changes announced |
| Return to start supported/prominent | Suppl. | manual | — | Way back to home/start |
| Relationships detectable | Core | auto | 1.3.1 | Lists/tables use real list/table markup |
| Blocks of content available (minimum) | Core | auto | 2.4.1 | Skip link or landmarks to bypass repeated blocks |
| Sections labeled | Core | auto | 1.3.1 | Landmarks (nav/main/header) present |
| Heading structure available | Core | auto | 1.3.1/2.4.6 | H1 per page, no skipped levels, headings describe sections |
| Order detectable | Core | auto | 1.3.2 | DOM order = reading order (no CSS reordering meaning) |
| Overlay content dismissible | Core | manual | 2.4.3-ish | Modals/cookie banners closable, focus handled |

## 2.8 Consistency across views

| Requirement | Class | Test | WCAG 2.2 | What to check |
|---|---|---|---|---|
| Consistent structural order | Core | manual | 3.2.3 | Repeated components in same order across pages |
| Consistent navigation order | Core | manual | 3.2.3 | Nav order stable |
| Consistent navigation labels | Core | manual | 3.2.4 | Same destination = same label site-wide |

## 2.9 Process and task completion

| Requirement | Class | Test | WCAG 2.2 | What to check |
|---|---|---|---|---|
| Automated entry allowed | Core | manual | 1.3.5 | Autofill works (`autocomplete` attributes) |
| Cognitive test alternatives available | Core | manual | 3.3.8 | CAPTCHAs have non-puzzle alternatives |
| Timeout adjustable / no time limits | Core | manual | 2.2.1 | Session timeouts extendable/warned |
| Time limits conveyed | Core | manual | 2.2.1 | Timeout warned in more than one sense |
| Going back supported | Core | manual | 3.2.2 | Back doesn't lose data |
| No redundant entry | Core | manual | 3.3.7 | Info asked once per process |
| Progress saved | Suppl. | manual | — | Multi-step progress persists |
| Required action available | Core | manual | 3.3.2 | What to do next is explicit |
| Information requirements at start | Suppl. | manual | 3.3.2 | Needed materials listed before starting |
| Process instructions available | Core | manual | 3.3.2 | Instructions before the form |

## 2.10 Policy and protection

| Requirement | Class | Test | WCAG 2.2 | What to check |
|---|---|---|---|---|
| Consequences of choices explained | Core | manual | — | Plain-language terms |
| Consequences explained before agreement | Core | manual | — | Consent before commitment |
| Diverse disabilities considered | — | org | — | Inclusive design process claim |

## 2.11 Help and feedback

| Requirement | Class | Test | WCAG 2.2 | What to check |
|---|---|---|---|---|
| Consistent help available | Core | manual | 3.2.6 | Help reachable in same place on every page |
| Contextual help available | Suppl. | manual | 3.3.5 | Field-level hints |
| Disabled controls explained | Core | manual | — | Why a control is off |
| Sensory characteristics not relied on | Core | auto | 1.3.3/1.4.1 | "Click the round button on the right" fails |
| Feedback mechanism available | Suppl. | manual | — | Way to report problems |

## 2.12 User control

| Requirement | Class | Test | WCAG 2.2 | What to check |
|---|---|---|---|---|
| Assistive technology supported | Core | manual | 4.1.2 | Works with real AT — virtual cursor, forms mode |
| User settings supported | Core | manual | — | Text spacing/ADW overrides not broken |
| Virtual cursor supported | Core | manual | — | AT can read/operate everything |
| Notifications adjustable | Suppl. | manual | — | Live-region verbosity controllable |
| Orientation supported (minimum) | Core | auto | 1.3.4 | No orientation lock |
| Text reflow / layout reflow supported | Core | auto | 1.4.10 | 320px reflow; no 2-D scroll |
| Page/view audio adjustable | Core | auto | 1.4.2 | No autoplaying audio > 3s without pause/mute/stop |
| Media chapters available | Suppl. | manual | — | Long media has chapter navigation |
| Change of content/focus notified | Core | manual | 4.1.3 | Dynamic changes announced |

## Organizational assertions (self-attest only)

WCAG 3 assertions are claims an organization makes about its process. A site
audit cannot verify them. List in the report as a checklist for the user:

- Transcripts / captions / audio descriptions style guides exist and are followed
- Usability testing was conducted with users needing transcripts/captions/AD
- Help usability testing; unnecessary-steps usability testing
- Safe-content review (flashing/motion harm)
- Deceptive-messaging expert review; algorithm inclusivity review
- Supported decision-making review
- Clear-language review; visual-aids review

## Conformance model notes (for report wording)

- WCAG 3 replaces A/AA/AAA with Core requirements (minimum conformance) +
  Supplemental requirements, scored by outcome coverage, not pass/fail counts.
- The scoring mechanics are still in flux in the draft — report failures as
  "Core requirement not met", do not compute a score or percentage.
- Content conforming to WCAG 2.2 AA is expected to meet *most* of WCAG 3
  minimum, but not all: WCAG 3 adds requirements (focus appearance, pointer
  activation, captions granularity, clear language) with no 2.2 equivalent.
