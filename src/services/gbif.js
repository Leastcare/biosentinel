const TIMEOUT_MS = 8000;
const REQUEST_DELAY_MS = 400; // small gap between sequential month requests to avoid rate limiting

// Returns { year, month } objects for the last 7 complete months (not current month)
function getLast7Months() {
  const months = [];
  const now = new Date();

  for (let i = 7; i >= 1; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
  }

  return months;
}

// Formats { year, month } into a short label like "Mar '26"
function formatMonthLabel(year, month) {
  const date = new Date(year, month - 1, 1);
  const mon = date.toLocaleString("en-US", { month: "short" });
  const yr = String(year).slice(2);
  return `${mon} '${yr}`;
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

// Fetches occurrence count for a single month within a bounding box
async function fetchMonthCount(latMin, latMax, lonMin, lonMax, year, month) {
  const url =
    `https://api.gbif.org/v1/occurrence/search` +
    `?decimalLatitude=${latMin},${latMax}` +
    `&decimalLongitude=${lonMin},${lonMax}` +
    `&year=${year}&month=${month}&limit=0`;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`GBIF request failed with status ${response.status}`);
    }

    const json = await response.json();
    return json.count ?? 0;
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function fetchWildlifeOccurrences(bbox, baseline) {
  // bbox = { latMin, latMax, lonMin, lonMax }
  const { latMin, latMax, lonMin, lonMax } = bbox;
  const months = getLast7Months();
  const chartData = [];

  for (const { year, month } of months) {
    const count = await fetchMonthCount(latMin, latMax, lonMin, lonMax, year, month);

    chartData.push({
      month: formatMonthLabel(year, month),
      records: count,
      baseline,
    });

    // Small delay between requests to be polite to the GBIF API
    await sleep(REQUEST_DELAY_MS);
  }

  return {
    chartData,
    fetchedAt: new Date().toISOString(),
    mode: "live",
  };
}
