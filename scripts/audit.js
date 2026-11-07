#!/usr/bin/env node
// WCAG 3.0 (WD) rendered-page audit: axe-core + WCAG 3 custom checks.
// Usage: node scripts/audit.js --url http://localhost:8080/ [--url ...] [--crawl 5] [--sitemap URL] [--out DIR]
// Output: <out>/findings.json + <out>/wcag3-report.md. Exit code always 0.
"use strict";
const fs = require("fs");
const path = require("path");

// ---- args ----
const argv = process.argv.slice(2);
const urls = [];
let crawl = 0, sitemap = null, outDir = "wcag-audit-output";
for (let i = 0; i < argv.length; i++) {
	if (argv[i] === "--url") urls.push(argv[++i]);
	else if (argv[i] === "--crawl") crawl = parseInt(argv[++i], 10) || 0;
	else if (argv[i] === "--sitemap") sitemap = argv[++i];
	else if (argv[i] === "--out") outDir = argv[++i];
	else if (argv[i] === "--help" || argv[i] === "-h") {
		console.log("node scripts/audit.js --url <url> [--url ...] [--crawl N] [--sitemap <url>] [--out DIR]");
		process.exit(0);
	}
}
if (!urls.length && !sitemap) {
	console.error("Nothing to audit: pass --url (repeatable) or --sitemap. See --help.");
	process.exit(0);
}

// axe rule id -> [wcag3 requirement, wcag22 default SC, class]
// class: "Core" or "Supplemental" (best-practice-tier rules land as Supplemental)
const RULE_MAP = {
	"image-alt": ["2.1.1 Image alternatives available", "1.1.1", "Core"],
	"input-image-alt": ["2.1.1 Image alternatives available", "1.1.1", "Core"],
	"role-img-alt": ["2.1.1 Image alternatives available", "1.1.1", "Core"],
	"area-alt": ["2.1.1 Image alternatives available", "1.1.1", "Core"],
	"object-alt": ["2.1.1 Image alternatives available", "1.1.1", "Core"],
	"svg-img-alt": ["2.1.1 Image alternatives available", "1.1.1", "Core"],
	"video-caption": ["2.1.5 Captions available (prerecorded)", "1.2.2", "Core"],
	"audio-caption": ["2.1.5 Captions available (prerecorded)", "1.2.1", "Core"],
	"video-description": ["2.1.6 Audio descriptions available", "1.2.5", "Core"],
	"html-has-lang": ["2.2.2 Human language detectable", "3.1.1", "Core"],
	"html-lang-valid": ["2.2.2 Human language detectable", "3.1.2", "Core"],
	"html-xml-lang-mismatch": ["2.2.2 Human language detectable", "3.1.2", "Core"],
	"color-contrast": ["2.2.1 Text contrast sufficient (minimum)", "1.4.3", "Core"],
	"link-in-text-block": ["2.2.1 Text contrast sufficient (minimum)", "1.4.1", "Core"],
	"page-has-heading-one": ["2.7.3 Heading structure available", "1.3.1", "Core"],
	"heading-order": ["2.7.3 Heading structure available", "1.3.1", "Core"],
	"button-name": ["2.3.5 Interactive element names available", "4.1.2", "Core"],
	"link-name": ["2.3.5 Interactive element names available", "2.4.4", "Core"],
	"label": ["2.3.5 Interactive element names available", "1.3.1", "Core"],
	"form-field-multiple-labels": ["2.3.5 Interactive element names available", "1.3.1", "Core"],
	"aria-command-name": ["2.3.5 Interactive element names available", "4.1.2", "Core"],
	"aria-input-field-name": ["2.3.5 Interactive element names available", "4.1.2", "Core"],
	"aria-toggle-field-name": ["2.3.5 Interactive element names available", "4.1.2", "Core"],
	"aria-allowed-attr": ["2.3.5 Roles, values, states, properties available", "4.1.2", "Core"],
	"aria-allowed-role": ["2.3.5 Roles, values, states, properties available", "4.1.2", "Core"],
	"aria-valid-attr-value": ["2.3.5 Roles, values, states, properties available", "4.1.2", "Core"],
	"aria-valid-attr": ["2.3.5 Roles, values, states, properties available", "4.1.2", "Core"],
	"aria-required-attr": ["2.3.5 Roles, values, states, properties available", "4.1.2", "Core"],
	"aria-required-children": ["2.3.5 Roles, values, states, properties available", "4.1.2", "Core"],
	"aria-required-parent": ["2.3.5 Roles, values, states, properties available", "4.1.2", "Core"],
	"aria-roles": ["2.3.5 Roles, values, states, properties available", "4.1.2", "Core"],
	"aria-hidden-focus": ["2.3.3 Focus relevant", "4.1.2", "Core"],
	"focus-order-semantics": ["2.3.3 Focus order meaningful", "2.4.3", "Core"],
	"nested-interactive": ["2.3.3 Focus order meaningful", "4.1.2", "Core"],
	"tabindex": ["2.3.3 Focus order meaningful", "2.4.3", "Core"],
	"bypass": ["2.7.3 Blocks of content available (minimum)", "2.4.1", "Core"],
	"region": ["2.7.3 Sections labeled", "1.3.1", "Core"],
	"landmark-unique": ["2.7.3 Sections labeled", "1.3.1", "Core"],
	"duplicate-id": ["2.3.5 Roles, values, states, properties available", "4.1.2", "Core"],
	"list": ["2.7.3 Relationships detectable", "1.3.1", "Core"],
	"listitem": ["2.7.3 Relationships detectable", "1.3.1", "Core"],
	"definition-list": ["2.7.3 Relationships detectable", "1.3.1", "Core"],
	"dlitem": ["2.7.3 Relationships detectable", "1.3.1", "Core"],
	"th-has-data-cells": ["2.7.3 Relationships detectable", "1.3.1", "Core"],
	"td-headers-attr": ["2.7.3 Relationships detectable", "1.3.1", "Core"],
	"empty-table-header": ["2.7.3 Relationships detectable", "1.3.1", "Core"],
	"scope-attr-valid": ["2.7.3 Relationships detectable", "1.3.1", "Core"],
	"frame-title": ["2.3.5 Interactive element names available", "2.4.1", "Core"],
	"autocomplete-valid": ["2.9.4 No redundant entry", "1.3.5", "Core"],
	"meta-viewport": ["2.12.3 Text reflow supported", "1.4.4", "Core"],
	"target-size": ["2.4.3 Simple pointer input available", "2.5.8", "Core"],
	"identical-links-same-purpose": ["2.8.3 Consistent navigation labels", "2.4.9", "Supplemental"],
	"no-autoplay-audio": ["2.12.4 Page/view audio adjustable", "1.4.2", "Core"],
	"blink": ["2.6.1 No flashing over threshold", "2.2.2", "Core"],
	"marquee": ["2.6.1 No flashing over threshold", "2.2.2", "Core"],
	"meta-refresh": ["2.9.2 No time limits", "2.2.1", "Core"],
};
// unmapped axe rules still get reported, class from tags
function classify(tags) {
	if (tags.includes("wcag2a") || tags.includes("wcag2aa") || tags.includes("wcag21a") ||
		tags.includes("wcag21aa") || tags.includes("wcag22a") || tags.includes("wcag22aa")) return "Core";
	return "Supplemental";
}
function scFromTags(tags) {
	// axe per-criterion tags: wcag111, wcag143, wcag212, wcag2422...
	const scs = tags.filter(t => /^wcag\d{3,4}$/.test(t)).map(t => t.slice(4).replace(/(\d)(\d)(\d)/, "$1.$2.$3"));
	return scs.length ? scs.join(", ") : null;
}

const FIX_LINKS = {
	"image-alt": "image-alternatives", "input-image-alt": "image-alternatives", "role-img-alt": "image-alternatives",
	"area-alt": "image-alternatives", "object-alt": "image-alternatives", "svg-img-alt": "image-alternatives",
	"video-caption": "captions", "audio-caption": "captions", "video-description": "captions",
	"color-contrast": "text-contrast", "link-in-text-block": "text-contrast",
	"button-name": "accessible-names", "link-name": "accessible-names", "label": "form-labels",
	"form-field-multiple-labels": "form-labels", "aria-command-name": "accessible-names",
	"aria-input-field-name": "form-labels", "aria-toggle-field-name": "accessible-names",
	"bypass": "landmarks-and-skip", "region": "landmarks-and-skip",
	"page-has-heading-one": "heading-structure", "heading-order": "heading-structure",
	"html-has-lang": "language", "html-lang-valid": "language",
	"meta-viewport": "reflow-and-zoom", "target-size": "target-size",
	"no-autoplay-audio": "autoplay-audio", "meta-refresh": "reduced-motion",
	"blink": "reduced-motion", "marquee": "reduced-motion",
	// custom-check rules
	"focus-indicator": "focus-indicator", "page-title": "page-title",
	"h1-missing": "heading-structure", "h1-multiple": "heading-structure",
	"heading-jump": "heading-structure", "transcript-findable": "transcripts-findable",
};

async function main() {
	const { chromium } = require("playwright");
	const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
	const browser = await chromium.launch();
	const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });

	// gather page set
	const pageSet = [];
	const seen = new Set();
	const norm = (u) => { try { const x = new URL(u); x.hash = ""; return x.href; } catch { return u; } };
	const push = (u) => { const n = norm(u); if (!seen.has(n)) { seen.add(n); pageSet.push(n); } };
	urls.forEach(push);
	if (sitemap) {
		const page = await ctx.newPage();
		try {
			const xml = await (await page.request.get(sitemap)).text();
			for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) push(m[1]);
		} catch (e) { console.error("sitemap fetch failed:", e.message); }
		await page.close();
	}
	if (crawl > 0 && urls.length) {
		const origin = new URL(urls[0]).origin;
		const queue = [...urls];
		while (queue.length && pageSet.length < 1 + crawl) {
			const u = queue.shift();
			const page = await ctx.newPage();
			try {
				await page.goto(u, { waitUntil: "networkidle", timeout: 20000 });
				const links = await page.evaluate((o) =>
					[...document.querySelectorAll("a[href]")].map(a => a.href)
						.filter(h => h.startsWith(o) && !h.includes("#") && !/\.(jpg|jpeg|png|gif|webp|svg|mp4|mp3|pdf|xml|zip)$/i.test(h)),
					origin);
				await page.close();
				for (const l of links) { if (!seen.has(norm(l))) queue.push(l); }
				while (queue.length && pageSet.length < 1 + crawl) push(queue.shift());
			} catch { await page.close(); }
		}
	}

	const findings = [];
	const pageStats = [];
	for (const u of pageSet) {
		const page = await ctx.newPage();
		try {
			await page.goto(u, { waitUntil: "networkidle", timeout: 30000 });
		} catch (e) {
			pageStats.push({ url: u, error: e.message });
			await page.close();
			continue;
		}
		await page.addScriptTag({ content: axeSource });
		const axeRes = await page.evaluate(() => {
			return window.axe.run(document, { resultTypes: ["violations"] })
				.then(r => JSON.parse(JSON.stringify(r)));
		});
		for (const v of axeRes.violations || []) {
			const m = RULE_MAP[v.id];
			const sc = (m && m[1]) || scFromTags(v.tags || []) || "—";
			const wcag3 = m ? m[0] : "(unmapped axe rule " + v.id + ")";
			const cls = m ? m[2] : classify(v.tags || []);
			findings.push({
				url: u, source: "axe", rule: v.id, impact: v.impact || "unknown",
				wcag3, wcag22: sc, class: cls,
				help: v.help, helpUrl: v.helpUrl,
				nodes: (v.nodes || []).slice(0, 5).map(n => n.target.join(" ")),
				count: (v.nodes || []).length,
				fix: FIX_LINKS[v.id] ? "references/fix-patterns.md#" + FIX_LINKS[v.id] : null,
			});
		}

		// ---- custom WCAG 3 checks (things axe doesn't cover) ----
		const custom = await page.evaluate(() => {
			const out = [];
			const add = (id, wcag3, wcag22, cls, msg, nodes) => out.push({ id, wcag3, wcag22, cls, msg, nodes });
			// 2.7.2 Page/view title available
			const t = document.title.trim();
			if (!t) add("page-title", "2.7.2 Page/view title available", "2.4.2", "Core", "document has no <title>", ["<title>"]);
			else if (t.length < 4) add("page-title", "2.7.2 Page/view title available", "2.4.2", "Core", "title too short to describe view", ["<title>"]);
			// 2.7.3 heading structure: single h1, no level jumps
			const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")];
			const h1s = hs.filter(h => h.tagName === "H1");
			if (hs.length) {
				if (!h1s.length) add("h1-missing", "2.7.3 Heading structure available", "1.3.1", "Core", "no h1 on page with headings", ["(headings)"]);
				if (h1s.length > 1) add("h1-multiple", "2.7.3 Heading structure available", "1.3.1", "Core", h1s.length + " h1 elements", h1s.slice(0, 3).map(h => "h1: " + h.textContent.trim().slice(0, 40)));
				let prev = 0;
				for (const h of hs) {
					const lvl = +h.tagName[1];
					if (prev && lvl > prev + 1) add("heading-jump", "2.7.3 Heading structure available", "1.3.1", "Core", "h" + prev + " followed by h" + lvl, [(h.textContent.trim() || "(empty)").slice(0, 40)]);
					prev = lvl;
				}
			}
			// 2.1.4 transcripts findable: media with speech should have an adjacent transcript link
			for (const el of document.querySelectorAll("video, audio")) {
				const box = el.closest("figure, div, section, article, p") || el.parentElement;
				const txt = box ? (box.textContent + " " + (box.nextElementSibling ? box.nextElementSibling.textContent : "")) : "";
				if (!/transcript/i.test(txt)) {
					add("transcript-findable", "2.1.4 Transcripts findable", "1.2.1/1.2.3", "Core",
						(el.tagName === "VIDEO" ? "<video>" : "<audio>") + " without an adjacent transcript link (verify it has speech)",
						[(el.currentSrc || el.src || el.outerHTML.slice(0, 60)).slice(0, 60)]);
				}
			}
			// 2.3.1 focus indicator size: focus first focusable, read computed outline
			const focusable = document.querySelector("a[href], button, [tabindex]:not([tabindex='-1']), input, select, textarea");
			if (focusable) {
				focusable.focus();
				const cs = getComputedStyle(focusable);
				const ow = parseFloat(cs.outlineWidth) || 0;
				const hasOutline = cs.outlineStyle !== "none" && ow >= 2;
				const hasShadow = cs.boxShadow !== "none";
				const hasBorder = cs.borderStyle !== "none" && (parseFloat(cs.borderWidth) || 0) >= 2;
				if (!hasOutline && !hasShadow && !hasBorder) {
					add("focus-indicator", "2.3.1 Focus indicator size sufficient", "2.4.11", "Core",
						"focused element shows no ≥2px outline/shadow/border (check :focus-visible styling; axe may not catch JS-hidden indicators)",
						[(focusable.tagName.toLowerCase() + (focusable.className ? "." + String(focusable.className).split(" ")[0] : ""))]);
				}
			}
			return out;
		});
		for (const c of custom) findings.push({
			url: u, source: "custom", rule: c.id, impact: "moderate", wcag3: c.wcag3, wcag22: c.wcag22,
			class: c.cls, help: c.msg, helpUrl: null, nodes: c.nodes, count: c.nodes.length,
			fix: FIX_LINKS[c.id] ? "references/fix-patterns.md#" + FIX_LINKS[c.id] : null,
		});
		pageStats.push({ url: u, axeTests: (axeRes.violations || []).length, custom: custom.length });
		await page.close();
	}
	await browser.close();

	// ---- write findings.json ----
	fs.mkdirSync(outDir, { recursive: true });
	const report = {
		generated: new Date().toISOString(),
		standard: "WCAG 3.0 Working Draft (2026-09-10), mapped to WCAG 2.2",
		pages: pageStats,
		totalFindings: findings.length,
		coreFailures: findings.filter(f => f.class === "Core").length,
		supplemental: findings.filter(f => f.class !== "Core").length,
		findings,
	};
	fs.writeFileSync(path.join(outDir, "findings.json"), JSON.stringify(report, null, 2));

	// ---- write wcag3-report.md ----
	const byArea = {};
	for (const f of findings) {
		const area = f.wcag3.replace(/^(\d+\.\d+).*$/, "$1");
		(byArea[area] = byArea[area] || []).push(f);
	}
	const areaNames = {
		"2.1": "Images and media", "2.2": "Text and wording", "2.3": "Interactive components",
		"2.4": "Input / operation", "2.5": "Error handling", "2.6": "Animation and movement",
		"2.7": "Layout", "2.8": "Consistency across views", "2.9": "Process and task completion",
		"2.10": "Policy and protection", "2.11": "Help and feedback", "2.12": "User control",
	};
	let md = "# Accessibility Audit — " + (pageSet[0] || sitemap) + "\n\n";
	md += "Generated " + report.generated + ". Audited against WCAG 3.0 Working Draft (Sept 2026), mapped to WCAG 2.2.\n";
	md += "WCAG 3.0 is a draft; this is not a conformance claim.\n\n";
	md += "## Summary\n\n";
	md += "- Pages audited: " + pageStats.length + "\n";
	md += "- Core requirement failures: **" + report.coreFailures + "**\n";
	md += "- Supplemental/best-practice findings: " + report.supplemental + "\n\n";
	if (pageStats.some(p => p.error)) md += "- Pages that failed to load: " + pageStats.filter(p => p.error).map(p => p.url).join(", ") + "\n\n";
	md += "| WCAG 3 area | Findings (Core/other) |\n|---|---|\n";
	for (const a of Object.keys(byArea).sort()) {
		const list = byArea[a];
		md += "| §" + a + " " + (areaNames[a] || "") + " | " + list.filter(f => f.class === "Core").length + " / " + list.length + " |\n";
	}
	md += "\n## Findings\n\n";
	for (const a of Object.keys(byArea).sort()) {
		md += "### §" + a + " " + (areaNames[a] || "Unknown area") + "\n\n";
		const seenRules = {};
		for (const f of byArea[a]) {
			const key = f.wcag3 + "|" + f.rule;
			if (seenRules[key]) { seenRules[key].urls.push(f.url); continue; }
			seenRules[key] = f; f.urls = [f.url];
		}
		for (const f of Object.values(seenRules)) {
			md += "#### [" + (f.class === "Core" ? "FAIL" : "ADVISORY") + "] " + f.wcag3 + " (" + f.class + ") — WCAG 2.2: " + f.wcag22 + "\n\n";
			md += "- Rule: `" + f.rule + "` — " + f.help + "\n";
			md += "- Affected: " + f.count + " node(s) on " + [...new Set(f.urls)].length + " page(s): " + [...new Set(f.urls)].join(", ") + "\n";
			if (f.nodes && f.nodes.length) md += "- Evidence: `" + f.nodes.map(n => String(n).slice(0, 80)).join("`, `") + "`\n";
			md += "- Fix: " + (f.fix ? f.fix : "see references/wcag3-requirements.md (manual review)") + "\n";
			if (f.helpUrl) md += "- Detail: " + f.helpUrl + "\n";
			md += "\n";
		}
	}
	md += "## Manual review needed\n\n";
	md += "Requirements not machine-testable on these pages (see references/wcag3-requirements.md):\n";
	md += "clear language (§2.2.3), conventional behavior (§2.3.4), keyboard walkthrough (§2.4.1),\n";
	md += "error handling flow (§2.5), animation harm (§2.6), layout familiarity (§2.7.1),\n";
	md += "consistency across views (§2.8), task completion (§2.9), help availability (§2.11),\n";
	md += "real assistive-technology passes (§2.12.1).\n\n";
	md += "## Organizational assertions (self-attest)\n\n";
	md += "WCAG 3 assertions are process claims, not site-checkable: captions/transcript style guides,\n";
	md += "usability testing with affected users, safe-content review, deceptive-messaging review.\n\n";
	md += "## Limitations\n\n";
	md += "- Automated checks cover roughly 40% of WCAG 3 core requirements; manual items are listed above.\n";
	md += "- WCAG 3.0 contrast methods are in flux; thresholds used are the WCAG 2.2 ratios.\n";
	md += "- Findings are evidence of failures, not a conformance score (WCAG 3 scoring is not final).\n";
	fs.writeFileSync(path.join(outDir, "wcag3-report.md"), md);

	console.log("Audited " + pageStats.length + " pages -> " + outDir + "/findings.json + wcag3-report.md");
	console.log("Core failures: " + report.coreFailures + ", other findings: " + report.supplemental);
}
main().catch(e => { console.error("audit failed:", e); process.exit(0); });
