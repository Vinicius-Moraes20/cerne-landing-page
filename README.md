# Cerne | Pesquisa e Desenvolvimento — landing page

Institutional landing page for the Cerne brand. Static site, no framework and
no build step, served by GitHub Pages from the root of `main`.

Visual direction: **"Núcleo"**, institutional register — see
`ADR-001` and `ADR-002` in the project vault.

## Structure

The repository holds only what GitHub Pages needs to serve the page. The
brand manual, `CLAUDE.md` and `.claude/` stay on disk and are git-ignored.

```
.
├── index.html                    # the page
├── .nojekyll                     # GitHub Pages: skip Jekyll processing
└── assets/
    ├── css/style.css             # all styles; palette as CSS custom properties
    ├── js/main.js                # progressive enhancement only
    └── img/
        ├── favicon.svg           # simplified mark (manual, section 04)
        ├── logo.svg              # full mark, dark surfaces
        ├── logo-claro.svg        # full mark, light surfaces
        ├── apple-touch-icon.png  # 180x180
        ├── og-image.png          # 1200x630 social preview
        ├── escopo/               # service cards, 360x225 + @2x (16:10)
        ├── prototipagem/         # 3D printing and PCB milling, 560x420 + @2x (4:3)
        └── projetos/             # portfolio, <project-slug>, 360x270 + @2x (4:3)
```

## Photos

Every photo sits in a `.media` frame that fixes its aspect ratio. A slot that
has no photo yet holds a `.ph` placeholder; the file it expects is named in the
`<!-- IMAGEM: … -->` comment above it. To fill a slot, replace the `.ph` div
with `<img src="name.jpg" srcset="name@2x.jpg 2x" alt="…" width="…" height="…" loading="lazy">`.
Export each photo at the size it is shown (1x) and at twice that (2x) rather
than one large file: a browser shrinking a big image 3-4x aliases fine detail
and text. Screenshots go in PNG, photos in JPEG.

## Running locally

```bash
python3 -m http.server 8000   # http://localhost:8000
```

Opening `index.html` directly from the filesystem also works.

## Publishing

Push to `main`. GitHub Pages redeploys automatically.

Settings → Pages → Source: **Deploy from a branch** → `main` → `/ (root)`.

## Section rhythm

On a dark palette, background steps alone cannot separate sections: adjacent
tones measure 1.07-1.19:1, which the eye does not register. Separation is
therefore structural — each section is a different *kind* of surface — over
three widely spaced grounds used in alternation.

| Section | Ground | Structure |
|---|---|---|
| Topo | `#22262A` base | Open ground, the mark at full size |
| Escopo | `#131619` deepest | Raised cards, `#2E3338`, photo on top and icon |
| Prototipagem | `#22262A` base | Alternating photo/text rows, no cards |
| O núcleo | `#1B4965` azul profundo | Full colour band with the graphic pattern |
| Projetos | `#131619` deepest | Photo-led tiles, text under the photo, no card surface |
| Processo | `#22262A` base | Numbered badges on a connecting rail |
| Contato | `#131619` deepest | Raised panel holding the channels |

The three card icons are **not** the brand mark — reusing it at that size
would break the 28 px floor and put three logos next to the real one. They
are a small family drawn in the mark's geometry, each carrying exactly one
filled azul-claro core.

## Brand rules that constrain this code

Taken from the brand manual v1.0. Breaking any of these is a bug:

- The core is **never** the same color as the arcs — `#7FB5D6` on dark grounds,
  `#2C82B5` on light ones
- The symbol is never rotated; the opening always faces right, forming the C
- The full mark is never rendered below **28 px** — use `favicon.svg`, the
  simplified one-arc drawing, below that
- No gradients, shadows, glows or outlines on the mark
- The graphic pattern never sits behind the signature
- Clear space around the signature equals the core diameter

Palette and typefaces are declared once as custom properties at the top of
`assets/css/style.css`.

## Motion

One opening sequence — the mark draws while the hero copy rises under it,
resolving in about 1.3s — and four scroll behaviours: a reading-progress
hairline, section reveals whose label rules draw themselves, the process rail
growing downward through the four steps, and parallax on the mark and the
graphic pattern. A scroll spy underlines the current section in the nav.

All scroll work is one `requestAnimationFrame` pass that reads geometry first
and writes styles second, mutating only `transform` and custom properties.

`prefers-reduced-motion` disables all of it. If the script throws, `reveal-off`
forces every section visible. With JavaScript off, none of the hidden states
apply. See `ADR-004` for the failure modes that testing turned up.

## Accessibility

Semantic landmarks, a skip link, visible focus rings, `prefers-reduced-motion`
honored on every animation, and the page renders complete with JavaScript
disabled.

Every text/background pair on the page was measured against WCAG AA and passes
on its own ground. Two colour choices come directly from that audit: the
primary button is grafite on azul-claro (6.88:1) because papel on azul-sinal
reaches only 3.76:1, and the label in the azul profundo band is papel rather
than azul-claro, which reaches only 4.33:1 there.
