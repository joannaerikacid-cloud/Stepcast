# CLAUDE.md — Stepcast Codebase Guide

This file is the single source of truth for working on the Stepcast codebase. Read it fully before making any changes to any file.

---

## What Stepcast Is

Stepcast (stepcasttours.com) is a self-guided audio walking tour business. Tours are single HTML files served via Vercel (GitHub auto-deploy from repo `joannaerikacid/stepcast`). No app required — browser-based. Price: €4.99 per tour. First 3 stops always free. Payments via Lemon Squeezy (Merchant of Record). UK-based sole trader.

**Business email:** info@stepcasttours.com  
**Hosting:** Vercel (auto-deploys from GitHub pushes)  
**Repo:** joannaerikacid/stepcast

---

## All Tour Files — Live & Pipeline

| Tour | File | Storage Key | Bypass Code(s) | LS Product ID | Status |
|---|---|---|---|---|---|
| Royal London | london.html | stepcast_lon_v1 | — | f2161fe4-43d0-4f9b-b8fd-218bb67df036 | Live |
| London St Paul's | london-stpauls.html | stepcast_lonstpauls_v1 | STPAULS2026 | c54e85f8-88b9-42be-af2f-b9fc733b3fb7 | Live |
| Bath | bath.html | stepcast_bath_v1 | BATH2026 | 27d60500-39b7-404b-a4db-5ef580e3eb4f | Live |
| Oxford | oxford.html | stepcast_oxford_v1 | OXFORD2026 | e5c38d5b-4694-4d5e-a69a-90c5b6cd21e9 | Live |
| Paris | paris.html | stepcast_par_v1 | PARIS2026 | 98240f4d-00cb-4922-acd2-e75cc1e532dc | Live |
| Bordeaux | bordeaux.html | stepcast_bordeaux_v1 | BORDEAUX2026 | e4f652ef-b02e-40de-9247-2be8bd280662 | Live |
| Seville | seville.html | stepcast_sev_v2 | SEVILLE2026 | 4f357148-0d91-462d-8d21-23c53dafce17 | Live |
| Valencia | valencia.html | stepcast_val_v4 | — | 3bdfcad0-01ad-41da-ac3a-f65a10b67760 | Live |
| Barcelona | barcelona.html | stepcast_bcn_v2 | BARCELONA2026 | 45c5a344-4fa1-4dbb-a5a8-f699f216db99 | Live |
| Barcelona Gaudí | barcelona-gaudi.html | stepcast_bcng_v1 | GAUDI2026 | 51ce8be7-0df4-4276-8d86-0d351bcfd229 | Live |
| Brussels | brussels.html | stepcast_bru_v1 | BRUSSELS2026 | 71aee8a9-c771-4a4e-a9ee-1a9cd5df20c2 | Live |
| Lisbon | lisbon.html | stepcast_lis_v1 | LISBON2026 | c9d712c5-82a7-4909-b4f4-48a21eac0da9 | Live (bonus stops: MAIN_STOPS=9) |
| Amsterdam | amsterdam.html | stepcast_ams_v1 | AMSTERDAM2026 | c15cdb4c-48f0-44b5-a916-12e75e11e892 | Live |
| Prague | prague.html | stepcast_prg_v1 | PRAGUE2026 | 337b58dc-d6cc-40ff-9a83-1e586e8ade12 | Live |
| Venice | venice.html | stepcast_venice_v1 | VENICE2026, BARKERADVENTURES | 98a84741-c385-498a-b2a4-2a801a448ca3 | Live |
| Glasgow | glasgow.html | stepcast_glasgow_v1 | GLASGOW2026 | b06b55d9-59ae-4ad3-8077-d746deabb6b2 | Live (bonus stop: MAIN_STOPS=10) |
| Palermo | palermo.html | stepcast_palermo_v1 | PALERMO2026 | e90e9a06-757b-4ce5-9c92-37c8977613ff | Pipeline |
| Porto | porto.html | stepcast_porto_v1 | PORTO2026 | a6b2e466-aa14-4420-80d6-d5dcd525d129 | Pipeline |
| Rome | rome.html | stepcast_rome_v1 | ROME2026 | f3798166-43a5-4fab-8189-7575a4d5f570 | Pipeline |
| Bruges | bruges.html | stepcast_bruges_v1 | BRUGES2026 | 461f67a6-8bfb-460e-acf0-ae2efe1a0b17 | Live |
| Milan | milan.html | stepcast_milan_v1 | MILAN2026 | 9eaa17bb-526c-42f9-b15e-7d138dfc8626 | Live |
| Berlin | berlin.html | stepcast_berlin_v1 | BERLIN2026 | — (needs LS ID) | Pipeline |
| Verona | verona.html | stepcast_verona_v1 | VERONA2026 | — (needs LS ID) | Pipeline |

**Special variant:** london-viator.html — Viator-specific, no pricing, bypass RLTOUR-8427-VTR, storage key `stepcast_lonvtr_v1`

**Lemon Squeezy URL pattern:**  
`https://stepcasttours.lemonsqueezy.com/checkout/buy/{FULL-UUID}`

---

## Canonical Template

**Always use `barcelona-gaudi.html` as the canonical template for new tours.** Never deviate from its structure. Extract reusable JS using:

```python
re.search(r'(var slideIdx=\{\};.*?setTimeout\(applyLocks,300\);\n</script>)', canon, re.DOTALL)
```

---

## Canonical HTML Structure

```
head → hdr → hero → map-sec → stop-nav → #stopsWrap (JS stops[]) → tour-end → footer → gbar → umodal → cookie-bar
```

Each stop object in the `stops[]` array:
```javascript
{id:N, tag:"...", titleHtml:"...", plain:"...", walkNext:"Xm, about Y min to next stop",
 photos:[{f:"cityN.jpg",p:false}], photoCredit:"",
 tipLabel:"...", tipText:"...",
 lat:XX.XXXX, lng:XX.XXXX, mp3:"citystopN.mp3",
 script:"Para one.|||Para two.|||Para three."}
```

For bonus stops: add `bonus:true` to the stop object and set `var MAIN_STOPS=N;` before the stops array.

---

## JavaScript Constraints — NEVER VIOLATE THESE

1. **`var` and `function` only** — no `const`, no `let`
2. **No arrow functions** — use `function` keyword throughout
3. **No backticks / template literals** — use string concatenation with `+`
4. **No ES6+ syntax** — no destructuring, spread, optional chaining
5. **`|||` paragraph separators** — stop scripts split on `|||`, never newlines
6. **No external JS libraries** except Leaflet (loaded via unpkg CDN)

---

## Canonical Head Tags (in order)

1. `<meta charset="UTF-8">`
2. Consent-gated gtag.js `AW-18081596926` (PECR compliant — never load directly)
3. `<meta name="viewport" content="width=device-width, initial-scale=1.0">` — **NO `user-scalable=no`**
4. `<title>` + `<meta name="description">`
5. `og:title` / `og:description` / `og:image` / `og:url` / `og:type`
6. `twitter:card` / `twitter:title` / `twitter:description` / `twitter:image`
7. `<link rel="canonical">` + `<link rel="sitemap">`
8. JSON-LD `@graph` with `TouristAttraction` + `WebPage` nodes, price `4.99`, currency `EUR`
9. Google Fonts: Cormorant Garamond + DM Sans

---

## Tour Page Checklist — Every Tour Must Have

- [ ] Lock overlay on stops 4+ (or MAIN_STOPS+1 for bonus stops)
- [ ] Audio player: ⟲10 | play | ⟳10 | progress | speed | stop
- [ ] Speed options: Slow 0.8 / Normal 1.0 / Fast 1.2
- [ ] Back-to-map button per stop
- [ ] Price: **€4.99 always — never pounds, never dollars**
- [ ] Correct Lemon Squeezy URL with full UUID
- [ ] Hero section: `height:100vh` + `min-height:-webkit-fill-available`
- [ ] Hero MUST contain `btn-row` div with TWO buttons: `btn-begin` ("Try Free — 3 Stops") and `btn-unlock` ("Unlock Full Tour — €4.99")
- [ ] `@media(max-width:420px)` tightens player-row gap + buttons for Android
- [ ] `var FREE_STOPS=3` in JS
- [ ] `var STORAGE_KEY="stepcast_{city}_vN"` — must be unique, check table above
- [ ] `var BYPASS_CODES=["CITYNAME2026"]` — codes stored uppercase, input uppercased before comparison
- [ ] Cookie consent banner (PECR compliant, consent-gated gtag)
- [ ] Light OpenStreetMap tiles (not dark CARTO)
- [ ] Map centre set to city coordinates, zoom ~14-15
- [ ] No em dashes (—) anywhere — use commas, colons, or full stops instead
- [ ] No entry prices in stop scripts (tip boxes only, always add "check official website")
- [ ] No `user-scalable=no` in viewport
- [ ] Gold played-marker system present (see below)

---

## Gold Played-Marker System — Required in Every Tour

Map markers turn gold (solid `#C9A96E` fill) when the walker completes a stop's audio. State persists in localStorage across sessions. Three visual states:

- **Unvisited:** dark green fill (`#2D5A3D`), gold border/number, 30px
- **Played:** solid gold fill (`#C9A96E`), dark number (`#1C1C1A`), 30px
- **Active (current scroll position):** solid gold fill, dark number, 36px (larger)

Required JS (add to every new build after `var leafMap=...stopMarkers=[];`):

```javascript
var playedStops={};
function loadPlayedStops(){try{var raw=localStorage.getItem(STORAGE_KEY+"_p");if(raw)playedStops=JSON.parse(raw);}catch(e){}}
function savePlayedStops(){try{localStorage.setItem(STORAGE_KEY+"_p",JSON.stringify(playedStops));}catch(e){}}
function markStopPlayed(i){playedStops[i]=true;savePlayedStops();if(stopMarkers[i]&&activeStopIdx!==i){var s=stops[i];stopMarkers[i].setIcon(L.divIcon({html:"<div style='width:30px;height:30px;background:#C9A96E;border:2px solid #C9A96E;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#1C1C1A;font-weight:700;font-size:12px;cursor:pointer;box-shadow:0 2px 8px rgba(201,169,110,.4)'>"+s.id+"</div>",className:"",iconSize:[30,30],iconAnchor:[15,15],popupAnchor:[0,-18]}));}}
function restorePlayedMarkers(){for(var pi in playedStops){if(playedStops[pi]&&stopMarkers[pi]){var sp=stops[pi];stopMarkers[pi].setIcon(L.divIcon({html:"<div style='width:30px;height:30px;background:#C9A96E;border:2px solid #C9A96E;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#1C1C1A;font-weight:700;font-size:12px;cursor:pointer;box-shadow:0 2px 8px rgba(201,169,110,.4)'>"+sp.id+"</div>",className:"",iconSize:[30,30],iconAnchor:[15,15],popupAnchor:[0,-18]}));}}}
```

In `a.onended`: add `markStopPlayed(i);` before the closing `};`

In `updateMapMarker` when restoring old marker: check `playedStops[oldIdx]` and use gold style if true, dark-green style if false.

Init call (replaces bare `initMap()` call):
```javascript
loadPlayedStops();
if(typeof L!=="undefined"){initMap();restorePlayedMarkers();}else{setTimeout(function(){if(typeof L!=="undefined"){initMap();restorePlayedMarkers();}else document.getElementById("map").innerHTML="...";},2000);}
```

localStorage key: `STORAGE_KEY + "_p"` (automatically namespaced per tour).

---

## Audio File Naming

Pattern: `{city}stop{N}.mp3`

Examples: `glasgowstop1.mp3`, `venicestop9.mp3`, `brugesstop11.mp3`, `parisstop6.mp3`

---

## Photo Conventions

- Pattern: `{city}{N}.jpg` or `{city}{N}a.jpg` / `{city}{N}b.jpg` for multiple per stop
- Compression target: **under 300KB per image**
- Portrait flag in JS: `{f:"city1.jpg", p:true}` for portrait, `p:false` for landscape
- Wikimedia Commons photos must be verified by searching Commons — never guess filenames
- Photo credits use `&quot;` escaping inside JS strings
- Compression settings (Python/Pillow): saturation 1.55, contrast 1.25, brightness 1.05, sharpness 1.4, warm tone, max 1200px on longest side, quality 82

---

## Copy Rules — Non-Negotiable

- **No em dashes (—)** anywhere — use commas, colons, or full stops
- **No entry fees or prices in tour stop scripts** — tip boxes only, always say "check official website" and "prices may have changed"
- **No marketing jargon** — warm, conversational, founder-led tone
- **No specific city counts** in copy (say "cities" not "16 cities")
- **Always euros** for pricing — never pounds
- **No `user-scalable=no`** in any viewport tag
- **No "hidden gem" / "tourists never" formula** — never write phrases like "most tourists never find this", "almost nobody comes here", "visitors always miss this", "hidden gem", or any variation. Stepcast tours cover the classic stops everyone expects. If a place is genuinely off the beaten track, describe it factually. Do not frame stops by contrast with other tourists.

---

## Map Tiles

Use light OpenStreetMap tiles (not dark CARTO):
```javascript
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors', maxZoom: 19
})
```

---

## Bonus Stops Implementation

When a tour has bonus stops beyond the main route:
```javascript
var MAIN_STOPS=N;  // number of main stops
// Add bonus:true to the bonus stop object:
{id:N+1, bonus:true, tag:"...", ...}
```

The JS renders a tour-end banner after stop N, with "Keep exploring ↓" and a star (★) nav dot for the bonus stop. Map marker for bonus stops shows ★ in a rounded square instead of a circle with a number.

---

## SEO Files to Update When Adding a Tour

1. **sitemap.xml** — add `<url>` with `<loc>`, `<changefreq>monthly</changefreq>`, `<priority>0.9</priority>`
2. **index.html** — add card to grid, nav link in UK/country section, image src in JS init, entry in tours array, remove from Coming Soon section if applicable

---

## index.html Card Structure

```html
<a class="card" href="{city}.html">
  <img class="card-img" id="{city}Img" alt="{City}">
  <div class="card-grad"></div>
  <div class="free-tag">3 Stops Free</div>
  <div class="card-body">
    <div class="card-region">{Country}</div>
    <div class="card-name"><em>{City}</em></div>
    <div class="card-pills">
      <span class="pill">N Stops</span>
      <span class="pill">X.X km</span>
      <span class="pill">🚶 ~XX min</span>
      <span class="pill">🎧 ~XX min</span>
    </div>
    <span class="card-btn">Start Tour →</span>
  </div>
</a>
```

JS image src (in init section):
```javascript
document.getElementById('{city}Img').src='{city}1.jpg';
```

---

## Hamburger Menu (index.html)

Nav drawer: z-index 101 (above header at z-index 100). Close button (✕): z-index 102, calls `toggleNav()`. Without this, the close button is obscured by the header.

---

## HTML Build Method

Use **Python string construction** — never bash heredocs (heredoc escaping fails with JS quote combinations inside stop data arrays).

---

## Post-Build Verification Checklist

- [ ] Correct LS product UUID (not placeholder)
- [ ] Correct bypass code(s) in BYPASS_CODES array
- [ ] Correct unique storage key (check table above for conflicts)
- [ ] Map centre correct for city
- [ ] Lock overlay references correct city name — no source-city bleed
- [ ] Zero broken image references
- [ ] Cookie consent banner present and consent-gated
- [ ] Correct canonical head tags in order
- [ ] No em dashes anywhere in the file
- [ ] No `user-scalable=no`
- [ ] Hero has exactly two buttons (btn-begin + btn-unlock)
- [ ] FREE_STOPS=3
- [ ] Audio files named per pattern: `{city}stop{N}.mp3`
- [ ] Photos named per pattern with correct portrait flag

---

## Tour Build Process (12 Steps)

1. **Route proposal** — stops, count (8-11), free/locked split
2. **Free tour research** — what do existing live guided tours cover? Flag overlap, confirm classic anchors
3. **Erika review** — approval on route before scripting
4. **Scripts draft** — write all stop scripts
5. **Self-critique** — review for weak stops, missing stories, tone
6. **Apply self-critique fixes**
7. **Independent reviewer** — read as someone who has done a popular live guided tour there
8. **Apply reviewer fixes**
9. **Direction check** — run bearing calculations for every consecutive stop pair using actual lat/lng coordinates. Fix any wrong compass headings in scripts before proceeding. Use Python: `math.degrees(math.atan2(dlng_m, dlat_m))` where dlat_m = Δlat × 111000, dlng_m = Δlng × 78500.
10. **Save scripts to file** — write all scripts to `{city}-scripts-draft.txt` in the repo root, with a FACT-CHECK FLAGS section under each stop listing every specific claim to verify (dates, names, heights, capacities, rulers, founding facts). This file is the input for the next step.
11. **Fact check** — every date, name, number, direction, orientation verified against external sources. **This must be genuinely independent: Claude may not fact-check scripts it wrote itself in the same session. Open a fresh context, load `{city}-scripts-draft.txt`, treat every claim as untrusted, and verify against external sources as if encountering them for the first time. Self-reviewing previously written scripts is not fact-checking.**
12. **Apply fact-check fixes**
13. **HTML build** — build file from canonical template

**Directions must be verified against actual coordinates** — wrong directions are the most frequent error.

**Audio is recorded after step 10 and cannot be cheaply redone. Errors that survive to step 13 cost real time and money. The fact-check at step 11 is the last line of defence.**

---

## Tour Philosophy

- Use the **same classic stops** people expect from live guided tours. Stepcast's value is telling those stops *better* — more depth, own pace, no group.
- Walkers get the classic experience PLUS more — not a niche alternative route.
- Mix of history and contemporary information. Never describe as story-only.
- Tour stop count: 8-11 stops depending on the city.

---

## Stop Script Style

- Opening: place the walker physically and give them something to look at immediately
- Directions always at the END of the script, final paragraph
- `|||` separates paragraphs — never newlines in JS string
- walkNext format: `"Xm, about Y min to next stop"` / `"Final stop"` / `"Xm south, about Y min to final stop"`
- Tip boxes: practical, specific, no em dashes, "check official website" for any price/time
- **Direction paragraphs must be brief and non-specific** — the GPS map handles navigation. Give only: a rough compass heading, an approximate walking time, and a landmark to look for on arrival. Never give turn-by-turn instructions, specific street names to turn onto, or "turn left/right at X". More specific = more chances to be wrong. Example good: "Head northwest about five minutes to Piazza San Simpliciano." Example bad: "Turn left onto Via Cusani, then right at the junction onto Foro Buonaparte."

---

## Analytics & Legal

- Google Tag Manager + consent-gated gtag conversion ID: `AW-18081596926`
- Google Search Console active, sitemap.xml maintained
- ICO registered, Lemon Squeezy handles EU VAT as Merchant of Record
- PECR-compliant cookie consent on all pages
- All pages use info@stepcasttours.com — never the Gmail address directly
