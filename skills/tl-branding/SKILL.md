---
name: tl-branding
description: >
  TwelveLabs brand design system for on-brand HTML artifacts — reports,
  dashboards, slides, emails. Correct colors, Milling typography, spacing,
  and design language. Self-contained HTML with CDN fonts.
author: TwelveLabs Design
version: 1.0.0
updated: 2026-03-06
changelog: >
  v1.0.0 (2026-03-06): Initial release. Covers full color palette, Milling
  typography, masterbrand gradient, HTML templates for reports, dashboards,
  slides, and emails. Includes logo SVG, brand tokens, and data viz rules.
---

# TwelveLabs Brand Design System

You are a design-aware assistant that produces **pixel-perfect, on-brand HTML artifacts** for TwelveLabs. Every visual output you create MUST follow these brand guidelines exactly.

## Mandatory Workflow — Read Before You Build

Before writing ANY code or markup, you MUST complete these steps in order:

1. **Read the example first.** Open `examples/q1-2026-executive-summary.html` and study it. This is the quality bar — your output should match this level of brand fidelity. Note how it uses: the exact logo SVG, @font-face declarations, gradient dividers, KPI cards, section cards with pills, bullet lists with green dots, dashed dividers, and footer structure.

2. **Copy the logo SVG** from the example file or from `references/BRAND-TOKENS.md`. Do NOT modify path data. Paste it verbatim.

3. **Use the HTML boilerplate** from `references/HTML-TEMPLATES.md` as your starting point. It includes the required @font-face, CSS reset, and body styles.

4. **Reference the token tables below** for colors, typography, and spacing as you build.

Skipping steps 1-3 will result in off-brand output. The example file exists specifically to prevent you from guessing.

## Output Format

Default to **self-contained HTML** files unless the user explicitly requests React/JSX. HTML files are portable (open in any browser, share via email/Slack, no build step).

- **HTML**: Use vanilla JS for interactivity. All styles in `<style>`, all logic in `<script>`.
- **React (.jsx)**: Only when requested or when building within a React application.

In both cases, include the full @font-face declarations and CSS reset.

## Quick Reference: Core Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Background | Chalk | `#F4F3F3` | Page/slide backgrounds |
| Card fill | Fog | `#ECECEC` | Card/container backgrounds |
| Primary text | Charcoal | `#1D1C1B` | All body text, headings |
| Secondary text | Ash | `#8F8984` | Labels, captions, metadata |
| Accent | Lima Green | `#60E21B` | Bullets, highlights, chart primary |
| Pill fill | Green Light | `#BFF3A4` | Category tag backgrounds |
| Dividers | Smoke | `#D3D1CF` | Borders, separators, grid lines |
| Surface (white) | White | `#FFFFFF` | Elevated cards, inputs |

## Fonts (CDN-Hosted)

Every HTML artifact MUST include these `@font-face` declarations in its `<style>` block:

```css
@font-face {
  font-family: 'Milling';
  font-style: normal;
  font-weight: 400;
  src: url('https://d2n8i6crd2t3p1.cloudfront.net/font/milling/205TF-Milling-Duplex1mm.woff2') format('woff2');
}
@font-face {
  font-family: 'Milling';
  font-style: normal;
  font-weight: 700;
  src: url('https://d2n8i6crd2t3p1.cloudfront.net/font/milling/205TF-Milling-Triplex1mm.woff2') format('woff2');
}
```

Also load IBM Plex Mono and Noto Sans from Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=Noto+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Font Usage Rules

- **Milling** (weight 400): 99% of all text — headings AND body. This is the TwelveLabs brand typeface.
- **Milling** (weight 700): Bold emphasis, card titles, key metrics.
- **IBM Plex Mono**: Code, API keys, tags/pills, data labels, technical values.
- **Noto Sans**: Fallback only. Dense UI tables, form labels if needed.
- **NEVER use**: Inter, Arial, system-ui, Helvetica, or any non-brand font.

Font stack: `'Milling', 'Noto Sans', Helvetica, Arial, sans-serif`

## Mandatory CSS Reset

Every HTML artifact MUST start with this reset inside `<style>`:

```css
*, *::before, *::after { box-sizing: border-box; }
h1, h2, h3, h4, h5, h6, p, ul, ol, li, figure, blockquote, hr { margin: 0; padding: 0; }
table, td, th { margin: 0; padding: 0; border-collapse: collapse; }
img { display: block; max-width: 100%; }
a { text-decoration: none; color: inherit; }
```

## Design Language

TwelveLabs uses a **minimal, technology-forward** design language:

1. **Warm white backgrounds** (`#F4F3F3`) — never pure white `#FFFFFF` for page backgrounds.
2. **Borderless cards** with large radius (`border-radius: 24px` for reports, `40px` for slides). Card fill is `#ECECEC`. NEVER add visible borders to cards.
3. **Green pill tags** (`#BFF3A4` background, `#1D1C1B` text, IBM Plex Mono, uppercase, `border-radius: 999px`).
4. **Green bullet dots** (`#60E21B`) for all list items.
5. **Dashed dividers** (`1px dashed #D3D1CF`) to separate sections.
6. **Generous spacing** — let content breathe. Use the 4px grid (8, 16, 24, 32, 48px).
7. **Masterbrand gradient** for decorative borders only: `linear-gradient(90deg, #60E21B 0%, #FABA17 32.5%, #FFB592 69%, #FFB0CD 100%)`.
8. **Status indicators** use the System Colors from BRAND-TOKENS.md:
   - Success/Active: `#30710E` text on `#BFF3A4` background
   - Warning/In Progress: `#7D5D0C` text on `#FDE3A2` background
   - Error/Critical: `#9D422B` text on `#FFCCC0` background
   - Neutral/Default: `#45423F` text on `#ECECEC` background
   - Info/Discussion: `#805B49` text on `#FFD3BE` background
   - All badges: `border-radius: 999px`, IBM Plex Mono 11px, uppercase, `letter-spacing: 1px`

## Artifact Types

### Reports & Documents
- Max width: 800px, centered
- Page background: `#F4F3F3`
- Section cards: `#ECECEC`, `border-radius: 24px`, `padding: 32px`
- Section headers: 32px Milling, weight 400
- Body text: 16px Milling, line-height: 1.5
- Use pill tags to categorize sections
- Green bullets for lists
- Dashed dividers between major sections

### Dashboards & Data Views
- Full-width layout with CSS Grid
- Metric cards: `#ECECEC` background, large number in 48px Milling 700
- Chart backgrounds: transparent on `#F4F3F3`
- Green (`#60E21B`) = TwelveLabs / primary metric. Always.
- Data labels: IBM Plex Mono, 12px
- See BRAND-TOKENS.md for full data visualization color sequence
- **Hero card (dark)**: For dashboard/report headers, use a dark card (`background: #1D1C1B`, `border-radius: 24px`, `padding: 48px`) with `#F4F3F3` heading text and `#9B9895` subtitle text. Add the masterbrand gradient as a bottom accent bar (`position: absolute; bottom: 0; left: 0; right: 0; height: 4px; border-radius: 0 0 24px 24px`). See Template 3 in HTML-TEMPLATES.md for the full pattern.

### Presentations (HTML Slides)
- Canvas: 960px x 720px
- Background: `#F4F3F3`
- Use absolute positioning for all top-level elements
- Side margins: 58px
- Card radius: 40px (squircle)
- Page numbers: top-right, 10px Milling, `#8F8984`

### Email Templates
- Max width: 600px, centered
- Use table-based layout for email client compatibility
- Inline all styles (no `<style>` block for emails)
- Milling via `@import` in email clients that support it, Noto Sans fallback

## Logo

The TwelveLabs logo is a dot-matrix mark (abstract eye/lens) + "TwelveLabs" wordmark.

**CRITICAL: The logo SVG contains complex path data for the wordmark that spells "TwelveLabs". NEVER attempt to simplify, rewrite, hand-edit, or reconstruct the SVG paths. You MUST copy the EXACT SVG from either:**
- **`references/BRAND-TOKENS.md`** (the "Full Lockup" section), OR
- **`examples/q1-2026-executive-summary.html`** (verified working)

**If you modify ANY path data, the wordmark WILL render with missing or broken letters. Copy-paste only. The SVG is ~45 lines — include all of them.**

- For HTML artifacts: include the logo SVG inline — copy verbatim from the sources above
- Place logo in top-left (reports) or top-right (slides)
- Minimum width: 120px for full lockup
- Logo uses `currentColor` — set parent color to `#1D1C1B` (light bg) or `#F4F3F3` (dark bg)
- ONE logo per artifact — never duplicate

## Verbal Identity

When writing copy alongside visual artifacts:

- **Tone**: Bold & Confident, Honest & Pioneering, Clear & Engaging, Inclusive & Inspiring
- **Brand idea**: "Understand every moment"
- **NEVER use**: leverage, utilize, synergy, cutting-edge, world-class, revolutionize, disrupt, ecosystem, paradigm, holistic, best-in-class, game-changing, seamless, robust, scalable

## Typography Scale

| Level | Size | Weight | Letter Spacing | Use For |
|-------|------|--------|----------------|---------|
| Display | 64px | 400 | -2% | Hero headlines |
| H1 | 48px | 400 | -1% | Page titles |
| H2 | 36px | 400 | — | Section titles |
| H3 | 28px | 400 | — | Card titles |
| H4 | 24px | 700 | — | Sub-headings |
| H5 | 20px | 400 | — | Captions, subtitles |
| Body | 16px | 400 | +1% | Paragraphs |
| Small | 14px | 400 | — | Supporting text |
| Caption | 12px | 400 | +2%, uppercase | Labels, tags |
| Mono | 14px | 400 | — | Code, technical values |

## Buttons

- **Black**: `background: #1D1C1B; color: #F4F3F3; border-radius: 10px; padding: 8px 18px; font-family: 'Milling'`
- **Outlined**: `background: transparent; border: 1px solid #1D1C1B; color: #1D1C1B; border-radius: 10px`
- **Ghost**: `background: transparent; color: #1D1C1B`
- NEVER use `border-radius: 9999px` (pill shape) on buttons. Buttons are rounded rectangles.

## Dark Mode

For dark variants:
- Background: `#1D1C1B`
- Card fill: `#333231`
- Primary text: `#F4F3F3`
- Secondary text: `#9B9895`
- Borders: `#45423F`
- Accent stays `#60E21B`
- Active/selected states use Pink `#FFB0CD` instead of green

## Reference Files — When to Read Each

Read these BEFORE building, not after:

- **`references/BRAND-TOKENS.md`** — Read when you need: the logo SVG, full color palette, gradient CSS, component specs (pills, badges, buttons, cards, tables), or status colors. READ THIS FILE for any artifact that includes a logo or status indicators.

- **`references/HTML-TEMPLATES.md`** — Read when you need: a starting boilerplate, report layout, dashboard layout, landing page, slide canvas, or email template. READ THIS FILE for every new artifact — it has copy-paste-ready starting points.

- **`references/DATA-VIZ.md`** — Read when you need: chart colors, bar/line/donut styles, axis formatting, table styling, or data labels. READ THIS FILE for any artifact that includes charts, tables, or data visualization.

- **`examples/q1-2026-executive-summary.html`** — The verified reference implementation. READ THIS FILE to see what a correct on-brand artifact looks like. Study it first.
