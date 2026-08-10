#!/usr/bin/env python3
"""Reassembles the section subfolders into a single index.html (the full deck).

Each section lives in its own folder (parallel-safe — edit them in different
chats). Edit any section's own index.html, then run:  python3 build.py

Reorder the deck by changing ORDER below (folder names, no trailing slash).
"""
ORDER = [
    "00-intro",
    "01-positioning",
    "02-messaging",
    "03-pricing",
    "04-seo",
    # "05-ads",           # skipped (Porter MCP not available this session)
    "06-social",
    # add more sections here as we build them (04-seo, 05-ads, 06-social, closing)
]

import os
base = os.path.dirname(os.path.abspath(__file__))

def stage_inner(folder):
    path = os.path.join(base, folder, "index.html")
    c = open(path, encoding="utf-8").read()
    a = c.index('<div class="stage">') + len('<div class="stage">')
    b = c.index('<div class="hud"', a)
    inner = c[a:b].rstrip()
    inner = inner[:inner.rindex('</div>')]   # drop the stage's own closing </div>
    # per-section assets are referenced as assets/… (relative to the section folder);
    # from the built index.html at the parent, prefix them with the folder name.
    inner = inner.replace('src="assets/', 'src="%s/assets/' % folder)
    inner = inner.replace("src='assets/", "src='%s/assets/" % folder)
    inner = inner.replace('url(assets/', 'url(%s/assets/' % folder)
    return inner.strip("\n")

parts = [stage_inner(n) for n in ORDER]
combined = "\n\n".join(parts)
# sections reference shared assets as ../_shared/… ; from the built index.html
# (which lives at the parent) the correct path is _shared/…
combined = combined.replace("../_shared/", "_shared/")
# only the very first slide of the whole deck is active
combined = combined.replace('class="slide active ', 'class="slide ')
combined = combined.replace('class="slide ', 'class="slide active ', 1)

template = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>How we do competitor research with Claude · Porter Metrics</title>
<link rel="stylesheet" href="_shared/styles.css">
</head>
<body>
<div class="label" id="layoutLabel"></div>
<div class="stage">
{body}
</div>
<div class="hud" id="hud">1 / 1 &nbsp;·&nbsp; ← →</div>
<script src="_shared/slides.js"></script>
</body>
</html>
"""

out = os.path.join(base, "index.html")
open(out, "w", encoding="utf-8").write(template.format(body=combined))
print("Built", out, "from", len(ORDER), "section(s):", ", ".join(ORDER))
