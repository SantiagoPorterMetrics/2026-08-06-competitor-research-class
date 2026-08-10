# Pricing Teardown Framework

A fixed set of **variables** to capture on *any* competitor pricing page, so every
analysis is objective and two pages compare cleanly.

**How to use it:** give Claude a pricing URL and this file. Claude reads the live page
and fills the schema below — Lenses 1–4 with facts only, Lens 5 with the interpretation
(kept separate on purpose). Same inputs every time → an objective read.

---

## The five lenses

**Lenses 1–4 are facts** — two analysts filling them from the same page get the same answer.
**Lens 5 is the read** — interpretation, flagged so it never contaminates the data.

### 1 · Packages — how many, and what
- `tier_count` — number of tiers
- `tier_names` — names, in order (low → high)
- `has_free_tier` — true / false
- `has_contact_sales_tier` — true / false
- `badged_tier` — which tier is marked "most popular" / "recommended" (or none)

### 2 · Price — per tier
- `monthly_price` — sticker price billed monthly (per unit)
- `annual_price` — sticker price billed annually (per unit)
- `annual_discount_pct` — **derived**: `1 − (annual / monthly)`

### 3 · Monetization — THE CRUX (what they charge for, & how it grows)
> The most revealing lens. Start with the **value metric** — the axis the price scales on.
- `value_metric` — **what they charge PER**. Can be composite. Examples: per seat · per user · per usage/consumption · per connected account · per publication · per contact/row · per feature unlocked. *(Porter = accounts · Whatagraph = connected accounts + publications · usage-based tools = consumption.)*
- `growth_levers` — every way ARPU expands: more seats, usage/consumption, add-ons, feature unlocks, moving up a tier
- `staircase_metric` — the single quota that climbs across tiers, with its values (e.g. 100 → 1K → 5K → 250K)
- `upgrade_trigger` — per jump, the limit/cap that forces the next tier (storage, seats, a gated feature…)

### 4 · User types — who each tier is for
- `segment_per_tier` — the stated "who it's for" per tier
- `motion_per_tier` — self-serve vs sales-gated, per tier
- `growth_motion` — bottom-up or top-down (what the page signals)

### 5 · Policies & friction — the fine print *(facts)*
- `refund_guarantee` — exact refund / money-back terms (e.g. "30-day full refund")
- `commitment_cancellation` — lock-in, proration, cancel-anytime, billing scope (per seat / per workspace)
- `sales_gate` — which tiers/features require a call ("contact sales" / "book a demo")
- `compliance_terms` — HIPAA / SOC2 / DPA / SLA / data residency signals
- `objection_handlers` — elements that pre-empt buyer objections: FAQ, "no credit card required", competitor-comparison table, guarantee badge, social proof near price

### 6 · Framing — the read *(interpretation, not fact)*
- `value_anchor` — **what they benchmark their value against to justify the price**: a named rival, your whole tool-stack, doing-it-manually, hours saved — often via a savings / ROI calculator. *(The most strategic read on the page — it tells you how they want you to judge the price.)*
- `price_anchor` — is the annual price shown first? is there a high-tier decoy anchor?
- `value_dollarization` — are allowances framed as "$X in value"?
- `decoy` — is there a good-better-best structure steering to a "middle" option?

---

## Fill-in schema (JSON)

```json
{
  "source_url": "",
  "captured_on": "",
  "currency": "",
  "packages": {
    "tier_count": null,
    "tier_names": [],
    "has_free_tier": null,
    "has_contact_sales_tier": null,
    "badged_tier": ""
  },
  "price_per_tier": [
    { "tier": "", "monthly_price": null, "annual_price": null, "annual_discount_pct": null }
  ],
  "monetization": {
    "value_metric": [],
    "growth_levers": [{ "lever": "", "detail": "" }],
    "staircase_metric": { "name": "", "values": [] },
    "upgrade_triggers": [{ "jump": "", "trigger": "" }]
  },
  "user_types": {
    "segment_per_tier": [{ "tier": "", "for": "" }],
    "motion_per_tier": [{ "tier": "", "motion": "" }],
    "growth_motion": ""
  },
  "policies_friction": {
    "refund_guarantee": "",
    "commitment_cancellation": "",
    "sales_gate": "",
    "compliance_terms": "",
    "objection_handlers": []
  },
  "framing_the_read": {
    "value_anchor": "",
    "price_anchor": "",
    "value_dollarization": "",
    "decoy": ""
  }
}
```

---

## Worked example — ClickUp (captured 2026-08-06, clickup.com/pricing)

```json
{
  "source_url": "https://clickup.com/pricing",
  "captured_on": "2026-08-06",
  "currency": "USD",
  "packages": {
    "tier_count": 4,
    "tier_names": ["Free Forever", "Unlimited", "Business", "Enterprise"],
    "has_free_tier": true,
    "has_contact_sales_tier": true,
    "badged_tier": "Business (Popular)"
  },
  "price_per_tier": [
    { "tier": "Free Forever", "monthly_price": 0,  "annual_price": 0,  "annual_discount_pct": 0 },
    { "tier": "Unlimited",    "monthly_price": 10, "annual_price": 7,  "annual_discount_pct": 0.30 },
    { "tier": "Business",     "monthly_price": 19, "annual_price": 12, "annual_discount_pct": 0.37 },
    { "tier": "Enterprise",   "monthly_price": null, "annual_price": null, "annual_discount_pct": null }
  ],
  "monetization": {
    "value_metric": ["per seat / user (core plans)", "per seat AI add-on", "usage — AI Super Credits"],
    "growth_levers": [
      { "lever": "tier",   "detail": "climb Free → Unlimited → Business → Enterprise" },
      { "lever": "seats",  "detail": "per-seat; must upgrade the whole Workspace" },
      { "lever": "add-on", "detail": "Brain AI $9 / Everything AI $28 per seat/mo (separate table)" },
      { "lever": "usage",  "detail": "AI Super Credits at $0.001 each, uncapped, Workspace-shared" }
    ],
    "staircase_metric": { "name": "automation executions / month", "values": [100, 1000, 5000, 250000] },
    "upgrade_triggers": [
      { "jump": "Free → Unlimited",     "trigger": "60MB storage wall + 'unlimited' infrastructure" },
      { "jump": "Unlimited → Business", "trigger": "automations 1K→5K, advanced dashboards, Google SSO" },
      { "jump": "Business → Enterprise","trigger": "SAML/SCIM, audit log, HIPAA, data residency" }
    ]
  },
  "user_types": {
    "segment_per_tier": [
      { "tier": "Free Forever", "for": "personal use" },
      { "tier": "Unlimited",    "for": "small teams" },
      { "tier": "Business",     "for": "mid-sized teams" },
      { "tier": "Enterprise",   "for": "large / regulated orgs" }
    ],
    "motion_per_tier": [
      { "tier": "Free Forever", "motion": "self-serve" },
      { "tier": "Unlimited",    "motion": "self-serve" },
      { "tier": "Business",     "motion": "self-serve" },
      { "tier": "Enterprise",   "motion": "sales-gated" }
    ],
    "growth_motion": "bottom-up (generous free tier) → top-down sales at enterprise"
  },
  "policies_friction": {
    "refund_guarantee": "30-day 100% money-back guarantee, pinned top of page",
    "commitment_cancellation": "per-Workspace billing; must upgrade entire Workspace; add-ons prorated",
    "sales_gate": "Enterprise + HIPAA + Contract/Legal review + Certified Agents = 'contact sales' / 'book a demo'",
    "compliance_terms": "HIPAA, MSA, data residency, audit log (Enterprise); 'Super Fair Billing policy' on AI credits",
    "objection_handlers": ["savings calculator vs 25 tools", "FAQ section", "money-back guarantee badge", "'25+ products' bundling claim"]
  },
  "framing_the_read": {
    "value_anchor": "anchors value against your WHOLE tool-stack — 'replaces 25+ tools', on-page savings calculator claims ~$282K/yr saved (500 users). Their ROI story = stack replacement.",
    "price_anchor": "annual price shown first; Enterprise as high anchor makes Business look reasonable",
    "value_dollarization": "automations framed as '$100 in value' / '$750 in value'",
    "decoy": "4-tier good-better-best; Business badged 'Popular' as the steered middle option"
  }
}
```
