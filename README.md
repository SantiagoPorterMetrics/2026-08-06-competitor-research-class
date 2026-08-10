# How we do competitor research with Claude — class deck

Slide deck for the Porter class **"How we do competitor research with Claude."**
Dark, Koho-style slides. Each tactic/lever is one worked example, always the same
3-beat shape: **the real page → the process (page → read → items) → the framework applied**.

## View it
- Open `index.html` (the full deck) in a browser. Navigate with **← →**.
- Or serve the folder and open it (needed for the screenshots to load):
  ```
  python3 -m http.server 8000
  # then open http://localhost:8000/index.html
  ```

## Sections (in `index.html`, via `build.py`)
1. `00-intro` — the 4 kinds of research + the 6-item index (what you can learn about a competitor)
2. `01-positioning` — Buffer homepage teardown (category claim + "differentiation is weak")
3. `02-messaging` — Buffer's 3 claims + rhetorical figures + triggers ("confidence without evidence")
4. `03-pricing` — ClickUp pricing teardown + the reusable pricing framework
5. `04-seo` — ClickUp sitemap teardown (the "date trap" rebuild + publish ≠ rank, live SERP)
6. `06-social` — adidas Instagram public-data teardown

**Pending:** `05-ads` is not built yet (the intro index lists all six).

## Build
Each section folder is a standalone, previewable deck. `build.py` stitches the
folders in `ORDER` into the root `index.html`. After editing a section:
```
python3 build.py
```
Shared design system lives in `_shared/` (styles.css, slides.js, logos).
Per-section screenshots live in each section's `assets/`.
