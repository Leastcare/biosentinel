const TIMEOUT_MS = 8000;

// Returns "YYYY-MM-DD" for the first day of a month offset from today.
// offset=0 → current month, offset=-1 → last month, etc.
function monthStartDate(offset) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + offset);
  return d.toISOString().slice(0, 10);
}

// Returns "YYYY-MM-DD" for the last day of a month offset from today.
function monthEndDate(offset) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + offset + 1);
  d.setDate(0); // rolls back to last day of previous month
  return d.toISOString().slice(0, 10);
}

// Formats a "YYYY-MM" key into a short label like "Mar '26"
function formatMonthLabel(yearMonth) {
  const [year, month] = yearMonth.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  const mon = date.toLocaleString("en-US", { month: "short" });
  const yr = String(year).slice(2);
  return `${mon} '${yr}`;
}

// Aggregates daily precipitation_sum values into monthly totals.
// Returns array of { month: "Mar '26", rainfall: 47.2, baseline }
function toChartData(times, values, baseline) {
  const monthly = {};

  times.forEach((dateStr, i) => {
    const key = dateStr.slice(0, 7); // "YYYY-MM"
    const val = values[i] ?? 0;
    monthly[key] = (monthly[key] || 0) + val;
  });

  return Object.keys(monthly)
    .sort()
    .map((key) => ({
      month: formatMonthLabel(key),
      rainfall: Math.round(monthly[key] * 10) / 10, // round to 1 decimal
      baseline,
    }));
}

export async function fetchRainfall(lat, lon, baseline) {
  // Fetch the last 7 complete-ish months: from 7 months ago to end of last month
  const startDate = monthStartDate(-7);
  const endDate = monthEndDate(-1);

  const url =
    `https://archive-api.open-meteo.com/v1/archive` +
    `?latitude=${lat}&longitude=${lon}` +
    `&start_date=${startDate}&end_date=${endDate}` +
    `&daily=precipitation_sum&timezone=UTC`;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Open-Meteo request failed with status ${response.status}`);
    }

    const json = await response.json();
    const times = json.daily?.time ?? [];
    const values = json.daily?.precipitation_sum ?? [];

    if (times.length === 0) {
      throw new Error("Open-Meteo returned no data");
    }

    const chartData = toChartData(times, values, baseline);

    return {
      chartData,
      fetchedAt: new Date().toISOString(),
      mode: "live",
    };
  } finally {
    window.clearTimeout(timeout);
  }
}
