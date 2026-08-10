# How we build our marketing skills with Claude — class deck

A slide deck built in **sections**, so several chats can work in parallel without stepping on each other.

## Structure

```
marketing-skills-at-porter-class/
├── _shared/               ← design system: styles.css, slides.js, logos/  (single source of truth)
├── 00-intro/              ← each folder = one section = one chat
├── 01-what-is-a-skill/
├── 02-examples/
├── build.py               ← stitches every section into the final deck
└── index.html             ← BUILT OUTPUT — do not hand-edit, it gets overwritten
```

## How to work in parallel

- Open a **separate chat per section** and tell it: *"work only inside `marketing-skills-at-porter-class/01-what-is-a-skill/`"* (paste the block in `PROMPT.md`).
- Each section's `index.html` is a **standalone, previewable deck** — open it in a browser to see just that section.
- Build slides as `<section class="slide pad" data-layout="…">…</section>` blocks. Reference logos as `../_shared/logos/…`.

## Two rules that keep parallel work clean

1. **Only edit files inside your own section folder.** The one shared thing is `_shared/`.
2. **`_shared/` is edited by ONE chat at a time.** If a section needs a new global style, change it in `_shared/styles.css` (not a local copy) so every section stays consistent. Coordinate this — it's the only file two chats could collide on.

## Assemble the full deck

From this folder:

```
python3 build.py
```

That reads every folder in `ORDER` and writes `index.html` (the full deck for presenting). Reorder or drop sections by editing `ORDER` at the top of `build.py`. Adding a new section = create the folder + a standalone `index.html`, then add its name to `ORDER`.
