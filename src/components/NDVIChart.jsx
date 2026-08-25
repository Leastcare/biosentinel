import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ndviData = [
  { month: "Nov '25", ndvi: 0.65, baseline: 0.6 },
  { month: "Dec '25", ndvi: 0.68, baseline: 0.6 },
  { month: "Jan '26", ndvi: 0.66, baseline: 0.6 },
  { month: "Feb '26", ndvi: 0.61, baseline: 0.6 },
  { month: "Mar '26", ndvi: 0.56, baseline: 0.6 },
  { month: "Apr '26", ndvi: 0.51, baseline: 0.6 },
  { month: "May '26", ndvi: 0.45, baseline: 0.6 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const ndviPoint = payload.find((item) => item.dataKey === "ndvi");

  return (
    <div className="chart-tooltip">
      <p>{label}</p>
      <span>NDVI: {ndviPoint?.value?.toFixed(2)}</span>
      <span>Baseline: 0.60</span>
    </div>
  );
}

function NDVIChart() {
  return (
    <section className="chart-card">
      <div className="chart-header">
        <div>
          <p className="eyebrow">EVIDENCE · VEGETATION</p>
          <h2>Vegetation Health Trend (NDVI)</h2>
          <p className="chart-description">
            Mean vegetation vigor fell from 0.60 baseline to 0.53 during the
            selected six-month comparison period.
          </p>
        </div>

        <div className="confidence-label">
          <span className="confidence-dot" />
          Moderate confidence
        </div>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={ndviData}
            margin={{ top: 18, right: 20, left: -12, bottom: 2 }}
          >
            <CartesianGrid
              stroke="rgba(148, 163, 184, 0.12)"
              strokeDasharray="3 5"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis
              domain={[0.35, 0.75]}
              ticks={[0.4, 0.5, 0.6, 0.7]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickFormatter={(value) => value.toFixed(2)}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <ReferenceLine
              y={0.6}
              stroke="#cbd5e1"
              strokeDasharray="4 5"
              label={{
                value: "6-month baseline",
                position: "insideTopRight",
                fill: "#cbd5e1",
                fontSize: 11,
              }}
            />
            <Line
              type="monotone"
              dataKey="ndvi"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 5,
                fill: "#fbbf24",
                stroke: "#0b1220",
                strokeWidth: 2,
              }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                color: "#d1d5db",
                fontSize: "12px",
                paddingTop: "16px",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="evidence-meta">
        <div>
          <span>Source</span>
          <strong>Sentinel-2 / Copernicus</strong>
        </div>
        <div>
          <span>Method</span>
          <strong>Mean NDVI comparison</strong>
        </div>
        <div>
          <span>Limitation</span>
          <strong>NDVI is a vegetation-vigor proxy.</strong>
        </div>
      </div>
    </section>
  );
}

export default NDVIChart;