# BioSentinel — Complete Project Guide

---

## PART 1 — What Is This Project? (Explain Like I'm 5)

Imagine you are a doctor, but instead of checking a person's health, you check the health of a **nature reserve** — a protected forest or wetland where animals live.

A doctor checks:
- Heart rate
- Blood pressure
- Temperature
- Blood test results

BioSentinel checks:
- 🌿 **Vegetation Health** — Are the plants green and growing?
- 🌧️ **Rainfall** — Is there enough rain?
- 🐾 **Wildlife Activity** — Are animals being spotted?
- 🔥 **Fire / Disturbance Risk** — Are there any fires or thermal hotspots?

It does this for **2 real nature reserves**:
1. **Amboseli National Reserve** — Kenya, Africa
2. **Keoladeo National Park** — Bharatpur, India

The app shows all 4 health indicators on a **dashboard website**. Every number on screen is linked to a chart so you can see the actual data behind it. That is the "evidence-linked" idea — every claim is provable.

---

## PART 2 — What Does the Website Look Like?

From top to bottom, the page has:

1. **Header bar** — App name "BioSentinel" + a dropdown to switch between the two reserves
2. **Hero section** — Shows the reserve name, a short description, and the last updated date
3. **4 Vital Sign Cards** — One card per health signal. Each card is clickable and scrolls you to the chart below
4. **AI Ecosystem Summary** — A paragraph in plain English explaining the situation. Key phrases in the paragraph are clickable buttons that scroll to the relevant chart
5. **4 Evidence Charts** — One chart per signal, showing 7 months of data
6. **Interactive Map** — Shows the exact location and boundary of the reserve on a real map
7. **Source Panel** — Explains where every piece of data came from and what its limitations are

---

## PART 3 — The Tech Stack (What Tools Were Used)

| Tool | What it does |
|---|---|
| **React 19** | The JavaScript framework that builds the UI |
| **Vite** | The build tool — compiles and serves the app fast |
| **Recharts** | Library that draws all the charts |
| **Leaflet + react-leaflet** | Library that renders the interactive map |
| **lucide-react** | Icon library (leaf, flame, paw, thermometer icons) |
| **Pure CSS** | All styling — no Tailwind, no Bootstrap |
| **NASA FIRMS API** | Real satellite fire detection data |
| **Open-Meteo API** | Real historical rainfall data — free, no key needed |
| **GBIF API** | Real wildlife occurrence records — free, no key needed |

---

## PART 4 — Project File Structure

```
biosentinel/
│
├── index.html                  ← The single HTML page the browser loads
├── vite.config.js              ← Build tool config (just 3 lines)
├── package.json                ← List of all libraries used
├── .env.local                  ← Secret API key for NASA FIRMS (not on GitHub)
│
└── src/
    ├── main.jsx                ← Entry point — mounts the app into the HTML
    ├── App.jsx                 ← THE BRAIN — all state, all logic, full layout
    ├── App.css                 ← All styles for the entire app
    │
    ├── data/
    │   └── reserves.js         ← Static data store for both reserves
    │
    ├── services/
    │   ├── firms.js            ← NASA FIRMS fire alert API client
    │   ├── openmeteo.js        ← Open-Meteo rainfall API client
    │   └── gbif.js             ← GBIF wildlife occurrence API client
    │
    └── components/
        ├── NDVIChart.jsx        ← Vegetation health line chart
        ├── ClimateChart.jsx     ← Rainfall line chart
        ├── WildlifeChart.jsx    ← Wildlife observation line chart
        ├── DisturbanceChart.jsx ← Fire alerts bar chart
        ├── ReserveMap.jsx       ← Interactive Leaflet boundary map
        └── SourcePanel.jsx      ← Static data-source transparency panel
```

---

## PART 5 — Where Does the Data Come From?

| Signal | Source | Live or Static? |
|---|---|---|
| 🌿 Vegetation (NDVI) | Hardcoded in `reserves.js` | ❌ Static |
| 🌧️ Rainfall | Open-Meteo Historical Weather API | ✅ Live |
| 🐾 Wildlife | GBIF Occurrence Records API | ✅ Live |
| 🔥 Fire / Disturbance | NASA FIRMS Satellite API | ✅ Live |

**Why is NDVI still static?**
There is no free, no-key NDVI satellite API. Sentinel Hub (the source of NDVI data) requires a paid account. So vegetation data stays hardcoded until a free option becomes available.

---

## PART 6 — How Each File Works

### `src/main.jsx`
The starting point. Two lines of real work:
```js
createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>
)
```
It finds the `<div id="root">` in `index.html` and mounts the React app inside it.

---

### `src/data/reserves.js`
A plain JavaScript object with all the data for both reserves. It has no logic — just data. Each reserve contains:
- Basic info (name, country, snapshot date, **lat/lon coords**, **bounding box**)
- `signals[]` — the 4 vital sign card values
- `summary` — text fragments for the AI Ecosystem Summary paragraph
- `ndvi`, `climate`, `wildlife`, `disturbance` — metadata + 7 months of static fallback data for each chart

---

### `src/services/firms.js`
Calls the **NASA FIRMS API** to get fire/thermal hotspot alerts.

**API URL pattern:**
```
https://firms.modaps.eosdis.nasa.gov/api/area/csv/{KEY}/VIIRS_SNPP_NRT/{bbox}/5
```
- Returns **CSV text** (not JSON)
- `/5` means last 5 days of data
- Requires an API key stored in `.env.local`

**Key functions:**
- `parseCsv(text)` — manually splits CSV into JS objects
- `toChartData(records)` — groups records by month, counts alerts per month
- `fetchFirmsAlerts(reserveId)` — fetches with 8-second timeout, returns `{ records, chartData, mode: "live" }`
- `getCachedFirmsAlerts(reserveId)` — reads from `localStorage` as fallback

---

### `src/services/openmeteo.js`
Calls the **Open-Meteo Historical Weather API** to get real rainfall data. **No API key needed.**

**API URL pattern:**
```
https://archive-api.open-meteo.com/v1/archive
  ?latitude={lat}&longitude={lon}
  &start_date={7 months ago}&end_date={last month}
  &daily=precipitation_sum&timezone=UTC
```
- Returns daily rainfall in mm as JSON
- The service aggregates daily values into monthly totals

**Key functions:**
- `monthStartDate(offset)` — calculates a date string like `"2026-02-01"` relative to today
- `monthEndDate(offset)` — calculates the last day of a given month offset
- `formatMonthLabel(yearMonth)` — converts `"2026-03"` → `"Mar '26"`
- `toChartData(times, values, baseline)` — sums daily rainfall per month, returns `[{ month, rainfall, baseline }]`
- `fetchRainfall(lat, lon, baseline)` — main export, fetches and transforms data

---

### `src/services/gbif.js`
Calls the **GBIF Occurrence API** to count wildlife sightings per month. **No API key needed.**

**API URL pattern:**
```
https://api.gbif.org/v1/occurrence/search
  ?decimalLatitude={min},{max}
  &decimalLongitude={min},{max}
  &year={year}&month={month}&limit=0
```
- `limit=0` means "don't return records, just give me the count"
- Returns `{ count: 762 }` — number of wildlife observations that month

**Why sequential and not parallel?**
GBIF rate-limits aggressive callers. Making 7 requests simultaneously would get blocked. So requests are made one at a time with a 400ms pause between each.

**Key functions:**
- `getLast7Months()` — returns array of `{ year, month }` for last 7 complete months
- `formatMonthLabel(year, month)` — converts numbers to `"Mar '26"` label
- `sleep(ms)` — simple Promise-based delay
- `fetchMonthCount(...)` — fetches count for one specific month
- `fetchWildlifeOccurrences(bbox, baseline)` — loops through 7 months, returns `{ chartData, mode: "live" }`

---

### `src/App.jsx`
The most important file. Everything flows through here.

**State variables:**
```js
selectedReserveId  // "amboseli" or "keoladeo"
activeEvidence     // "vegetation" | "climate" | "wildlife" | "disturbance" | ""
firmsData          // live fire alert data from NASA
firmsMode          // "loading" | "live" | "cached" | "preset"
rainfallData       // live rainfall data from Open-Meteo
rainfallMode       // "loading" | "live" | "preset"
wildlifeData       // live wildlife data from GBIF
wildlifeMode       // "loading" | "live" | "preset"
```

**Three `useEffect` hooks** — one per live API. Each:
1. Resets data to null and mode to `"loading"`
2. Calls the relevant fetch function
3. On success → sets data + mode to `"live"`
4. On failure → falls back to `"preset"` (uses static data from `reserves.js`)
5. Uses a `cancelled` flag to prevent stale updates if reserve switches mid-fetch

**`showEvidence(type, ref)` function:**
```js
function showEvidence(type, ref) {
  setActiveEvidence(type);                          // highlights the chart
  ref.current?.scrollIntoView({ behavior: "smooth" }); // scrolls to it
  window.setTimeout(() => setActiveEvidence(""), 2200); // removes glow after 2.2s
}
```

**Derived chart props** — before rendering, App.jsx checks if live data exists and swaps the data array:
```js
const climateProps = rainfallData?.chartData?.length
  ? { ...reserve.climate, data: rainfallData.chartData }
  : reserve.climate;
```
This pattern is used for all 3 live signals.

---

### `src/components/NDVIChart.jsx`
Renders a Recharts `LineChart` for vegetation (NDVI). Amber line (`#f59e0b`). Y-axis auto-scaled with ±0.05 padding, clamped to [0, 1]. Has a dashed reference line at the baseline value. Custom tooltip shows NDVI and baseline on hover. Footer shows Source, Method, Limitation.

### `src/components/ClimateChart.jsx`
Same structure as NDVIChart. Sky blue line (`#38bdf8`). Y-axis padded ±10mm. Shows `"Live · Open-Meteo"` in the confidence badge when `mode="live"`.

### `src/components/WildlifeChart.jsx`
Same structure. Green line (`#34d399`). Y-axis snapped to multiples of 5. Shows `"Live · GBIF"` badge when live. Includes a disclaimer: *"Observation activity proxy — not a population estimate."*

### `src/components/DisturbanceChart.jsx`
Uses a `BarChart` instead of a `LineChart`. Red rounded bars (`#f87171`). Integer-only Y-axis. Gets live NASA FIRMS data substituted in from App.jsx. Includes disclaimer: *"Thermal anomaly detection — not an independent damage assessment."*

### `src/components/ReserveMap.jsx`
Renders a Leaflet interactive map. Hardcodes approximate boundary polygons for both reserves. Key details:
- Uses `key={map-${reserveId}}` to **force full remount** on reserve switch (Leaflet doesn't update on prop changes)
- Inner `MapViewport` component runs `map.fitBounds()` with a **100ms setTimeout delay** — needed because Leaflet requires the container to have a real size before calculating bounds
- OpenStreetMap tiles (free)
- Green polygon boundary + center dot marker

### `src/components/SourcePanel.jsx`
100% static. No props. Renders a transparency panel explaining all 4 data sources. Hardcoded array of source objects rendered as cards.

---

## PART 7 — The Data Flow (How Everything Connects)

```
User opens app
      │
      ▼
App.jsx loads → selectedReserveId = "amboseli"
      │
      ├── useEffect fires → fetchFirmsAlerts()  → NASA satellite API
      ├── useEffect fires → fetchRainfall()      → Open-Meteo API
      └── useEffect fires → fetchWildlifeOccurrences() → GBIF API
                │
                ▼
         Data arrives → stored in state (firmsData, rainfallData, wildlifeData)
                │
                ▼
         Derived props built (climateProps, wildlifeProps, disturbanceProps)
         Static fallback used if API failed
                │
                ▼
         Charts rendered with real or fallback data
                │
                ▼
User clicks a vital sign card
→ showEvidence() called
→ page scrolls to chart
→ chart glows blue for 2.2 seconds
```

---

---

# PART 8 — Interview Questions & Answers

---

## 🟢 LOW-TIER (Junior / Fresher Interviewer)

**Q: What is BioSentinel?**
> A React web dashboard that monitors the health of nature reserves using 4 environmental signals — vegetation, rainfall, wildlife activity, and fire risk. It pulls live data from 3 free APIs and shows it as interactive charts.

**Q: What frontend framework did you use?**
> React 19 with Vite as the build tool.

**Q: What is Vite?**
> A modern build tool that replaces Create React App. It's much faster because it uses native ES modules during development, so the dev server starts almost instantly instead of bundling everything upfront.

**Q: What libraries did you use for charts and maps?**
> Recharts for all the charts, and Leaflet with react-leaflet for the interactive map.

**Q: Do you use TypeScript?**
> No, all files are `.jsx`. There are `@types/react` packages installed for editor autocomplete but no actual TypeScript compilation.

**Q: What is `useState` used for in this project?**
> To track which reserve is selected, which chart is currently highlighted (activeEvidence), and the live data + loading mode for each of the 3 API signals.

**Q: What is `useEffect` used for?**
> To trigger API calls whenever the selected reserve changes. There are 3 separate effects — one for NASA FIRMS, one for Open-Meteo, and one for GBIF.

**Q: What is `useRef` used for here?**
> To hold references to the 4 chart sections so the app can scroll to them when a vital sign card is clicked.

**Q: How does clicking a card show the chart?**
> It calls `showEvidence()` which sets the `activeEvidence` state (adding a glowing CSS class to the chart), then calls `ref.current.scrollIntoView()` to scroll to it. After 2.2 seconds a `setTimeout` removes the glow.

**Q: Is there routing in this project?**
> No. It's a single-page, single-view app. No React Router needed.

**Q: How many reserves are supported?**
> Two — Amboseli in Kenya and Keoladeo in India.

**Q: How do you switch between reserves?**
> A `<select>` dropdown in the header calls `handleReserveChange()` which updates `selectedReserveId` state, triggering all 3 API effects to re-run.

---

## 🟡 MEDIUM-TIER (Mid-level Interviewer)

**Q: Explain the data flow from API to chart.**
> When `selectedReserveId` changes, three `useEffect` hooks fire simultaneously. Each calls its respective service function (fetchFirmsAlerts, fetchRainfall, fetchWildlifeOccurrences). On success, the result is stored in state. Before rendering, App.jsx creates derived props — if live data exists, it spreads the static reserve object but replaces the `data` array with live data. If the API failed, the static preset data is used as-is. These derived props are passed to the chart components.

**Q: What is the fallback strategy when an API fails?**
> Each signal has its own fallback:
> - FIRMS: tries live → tries localStorage cache → falls back to static preset
> - Open-Meteo: tries live → falls back to static preset
> - GBIF: tries live → falls back to static preset
> 
> The app never breaks — a chart always shows something.

**Q: What is the `cancelled` flag in `useEffect` and why is it needed?**
> It prevents a race condition. If the user switches reserves quickly, the first API call might complete after the second one has already started. Without the flag, the stale result would overwrite the new reserve's data. The cleanup function sets `cancelled = true`, and all `.then()` callbacks check `if (!cancelled)` before updating state.

**Q: Why does GBIF fetch sequentially instead of in parallel?**
> GBIF rate-limits aggressive callers. Making 7 simultaneous requests triggers a `429 Too Many Requests` response. Sequential requests with a 400ms delay between each avoids this. The tradeoff is that the wildlife chart takes ~3 seconds to load.

**Q: How does Open-Meteo work — what does it return and how do you process it?**
> It returns daily `precipitation_sum` values in mm as JSON. The service iterates over all daily values, groups them by `YYYY-MM` month key, sums the daily values into a monthly total, rounds to 1 decimal place, and formats the month key into a short label like `"Mar '26"`.

**Q: Why does the map use `key={map-${reserveId}}`?**
> Leaflet controls the DOM directly and doesn't respond to React prop updates. Without the `key`, switching reserves wouldn't update the map position or polygon. The `key` tells React to completely unmount and remount the `MapContainer` component, giving Leaflet a fresh start with the correct coordinates.

**Q: Why is there a 100ms delay in `MapViewport` before calling `fitBounds`?**
> Leaflet calculates `fitBounds` based on the container's pixel dimensions. If called immediately after mount, the container might have zero height and the calculation fails. The `setTimeout` delay ensures the browser has rendered and given the container its actual size first.

**Q: What is NDVI and why is it still static?**
> NDVI (Normalized Difference Vegetation Index) is a 0-to-1 number derived from satellite imagery that measures vegetation greenness. The data comes from Sentinel-2 satellite. There is no free, keyless API to fetch it programmatically — Sentinel Hub requires a paid account. So it remains hardcoded in `reserves.js` until a free solution is available.

**Q: How is the environment variable for the FIRMS API key handled?**
> It's stored in `.env.local` as `VITE_FIRMS_MAP_KEY=...`. Vite exposes any variable prefixed with `VITE_` to client-side code via `import.meta.env`. The `.env.local` file is in `.gitignore` so the key is never committed to GitHub.

**Q: What does `limit=0` do in the GBIF API call?**
> It tells GBIF not to return any actual occurrence records in the response body — just return the total `count`. This makes the response tiny and fast since we only need the number, not the full data.

---

## 🔴 HIGH-TIER (Senior / Technical Interviewer)

**Q: What are the performance characteristics of the GBIF integration and how would you improve it?**
> Currently it makes 7 sequential HTTP requests with 400ms delays, taking ~3 seconds total. Better approaches:
> 1. **GBIF faceted search** — use `facet=month` parameter to get counts for all months in one request, eliminating sequential calls entirely
> 2. **Service Worker caching** — cache responses in a SW so repeat visits don't re-fetch
> 3. **React Suspense + lazy loading** — defer the wildlife chart render until data arrives instead of blocking
> 4. **Stale-while-revalidate** — show cached data immediately, revalidate in background

**Q: The codebase has a `getCachedFirmsAlerts` function that reads from localStorage but nothing ever writes to it. How would you fix this?**
> Add `localStorage.setItem()` in `fetchFirmsAlerts()` after a successful fetch:
> ```js
> localStorage.setItem(`biosentinel-firms-${reserveId}`, JSON.stringify({ records, chartData, fetchedAt }));
> ```
> Also add a TTL check — only use the cache if `fetchedAt` is less than N hours old, otherwise treat it as stale and re-fetch.

**Q: How would you scale this to support 50 reserves instead of 2?**
> - Move reserve data out of a static JS file into a database or CMS
> - Add React Router with a route like `/reserve/:id`
> - Lazy-load chart components with `React.lazy()` and `Suspense`
> - Cache API responses server-side (e.g. a Vercel Edge Function or Redis cache) so 50 users switching to the same reserve don't all independently call GBIF
> - Use a map-first UI where users click a reserve on a world map rather than a dropdown

**Q: The bundle size warning shows 772KB. How would you reduce it?**
> - **Tree-shake lucide-react** — import only the icons used instead of the entire library (it's already doing named imports, so check if bundler is picking up extras)
> - **Dynamic import Leaflet** — `const ReserveMap = React.lazy(() => import('./components/ReserveMap'))` since the map is below the fold
> - **Dynamic import Recharts** — same approach for chart components
> - **Split vendor chunks** in `vite.config.js` using `build.rollupOptions.output.manualChunks`

**Q: How would you add error boundaries to this project?**
> Wrap each chart section in a React `ErrorBoundary` component. If a chart crashes (e.g. Recharts receives malformed data from a live API), only that chart shows an error state instead of the whole app crashing. Each boundary would render a fallback UI like "Chart unavailable — showing preset data."

**Q: What are the security implications of putting the FIRMS API key in `.env.local` and bundling it into a Vite app?**
> Vite inlines `VITE_` prefixed env variables into the client bundle at build time. This means the API key is visible in the compiled JavaScript that ships to the browser — anyone can find it in DevTools. For a public-facing app this is a real risk. The right fix is to proxy the FIRMS request through a server-side function (e.g. a Vercel Serverless Function) that holds the key server-side and never exposes it to the client.

**Q: How would you add automated tests to this project?**
> - **Unit tests** with Vitest for pure functions: `parseCsv`, `toChartData`, `formatMonthLabel`, `getLast7Months`, `toChartData` in openmeteo.js
> - **Component tests** with React Testing Library for chart components — verify they render correctly with given props
> - **Integration test** for the `useEffect` data fetch flow — mock the fetch calls with `vi.fn()` and assert the correct state transitions (loading → live → chart renders with live data)
> - **E2E tests** with Playwright — click a vital sign card and assert the page scrolled to the correct chart

**Q: The `showEvidence` function uses `setTimeout` to clear the highlight after 2.2 seconds. What's the problem with this approach and how would you fix it?**
> If the user clicks a different card before the 2.2 seconds is up, two `setTimeout` callbacks are now queued. The second one fires and clears `activeEvidence` prematurely. Fix: store the timeout ID in a `useRef` and clear it before setting a new one:
> ```js
> const evidenceTimer = useRef(null);
> function showEvidence(type, ref) {
>   if (evidenceTimer.current) clearTimeout(evidenceTimer.current);
>   setActiveEvidence(type);
>   ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
>   evidenceTimer.current = window.setTimeout(() => setActiveEvidence(""), 2200);
> }
> ```

**Q: How would you make the vital sign card values (e.g. "-12%" for NDVI) dynamic instead of hardcoded?**
> Derive them from the live chart data in App.jsx. For example, for rainfall:
> ```js
> // calculate % deviation from baseline using last month's value
> const lastRainfall = rainfallData?.chartData?.at(-1)?.rainfall;
> const rainfallDeviation = lastRainfall
>   ? Math.round(((lastRainfall - reserve.climate.baseline) / reserve.climate.baseline) * 100)
>   : null;
> ```
> Then pass this derived value to the signal card instead of the hardcoded string from `reserves.js`. This would make the entire dashboard truly live end-to-end.

---

## PART 9 — Key Terms Glossary

| Term | Simple Meaning |
|---|---|
| **NDVI** | A 0-to-1 number from satellite images measuring how green/healthy vegetation is |
| **NASA FIRMS** | NASA's fire detection system using satellite thermal sensors |
| **VIIRS** | The satellite sensor NASA uses to detect heat (fires, hotspots) |
| **Open-Meteo** | A free weather API using reanalysis data (combines satellites, weather stations, models) |
| **GBIF** | Global Biodiversity Information Facility — a database of wildlife sighting records worldwide |
| **Bounding Box (bbox)** | A rectangle defined by min/max lat and lon that covers the reserve area |
| **Recharts** | A React charting library built on D3 |
| **Leaflet** | The most popular open-source JavaScript map library |
| **useEffect** | A React hook that runs code in response to state/prop changes |
| **useRef** | A React hook that holds a reference to a DOM element or value without causing re-renders |
| **Vite** | A fast modern build tool for JavaScript projects |
| **AbortController** | A browser API used to cancel a fetch request (used for the 8-second timeout) |
| **Race condition** | When two async operations finish in unexpected order, causing wrong data to be shown |
| **Fallback** | A backup value shown when the real data can't be fetched |
| **Live dot / Status badge** | The coloured indicator above charts showing if data is live, loading, or from preset |
