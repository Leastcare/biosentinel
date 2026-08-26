const FIRMS_API_KEY = import.meta.env.VITE_FIRMS_MAP_KEY;

const CACHE_PREFIX = "biosentinel-firms-";
const TIMEOUT_MS = 8000;

export const reserveFirmsAreas = {
  amboseli: "36.5,-3.0,37.5,-1.0",
  keoladeo: "76.9,26.6,77.0,27.0",
};

function parseCsv(csvText) {
  const lines = csvText.trim().split(/\r?\n/);

  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0].split(",").map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",");

    return Object.fromEntries(
      headers.map((header, index) => [
        header,
        values[index]?.trim().replace(/^"|"$/g, ""),
      ]),
    );
  });
}

function toChartData(records) {
  const monthlyAlerts = {};

  records.forEach((record) => {
    const month = record.acq_date?.slice(0, 7);

    if (month) {
      monthlyAlerts[month] = (monthlyAlerts[month] || 0) + 1;
    }
  });

  return Object.keys(monthlyAlerts)
    .sort()
    .map((month) => ({
      month,
      alerts: monthlyAlerts[month],
      baseline: 1,
    }));
}

export async function fetchFirmsAlerts(reserveId) {
  const area = reserveFirmsAreas[reserveId];

  if (!area) {
    throw new Error(`No FIRMS area configured for ${reserveId}`);
  }

  if (!FIRMS_API_KEY) {
    throw new Error("FIRMS API key is missing");
  }

  const url =
    `https://firms.modaps.eosdis.nasa.gov/api/area/csv/` +
    `${FIRMS_API_KEY}/VIIRS_SNPP_NRT/${area}/5`;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`FIRMS request failed with status ${response.status}`);
    }

    const csvText = await response.text();
    const records = parseCsv(csvText);

    const chartData = toChartData(records);

    return {
      records,
      chartData,
      fetchedAt: new Date().toISOString(),
      mode: "live",
    };
  } finally {
    window.clearTimeout(timeout);
  }
}

export function getCachedFirmsAlerts(reserveId) {
  const cached = localStorage.getItem(`${CACHE_PREFIX}${reserveId}`);

  if (!cached) {
    return null;
  }

  try {
    return {
      ...JSON.parse(cached),
      mode: "cached",
    };
  } catch {
    return null;
  }
}