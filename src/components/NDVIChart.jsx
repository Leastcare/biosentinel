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

function CustomTooltip({ active, payload, label, baseline }) {
  if (!active || !payload?.length) {
    return null;
  }

  const ndviPoint = payload.find((item) => item.dataKey === "ndvi");

  return (
    <div className="chart-tooltip">
      <p>{label}</p>
      <span>NDVI: {ndviPoint?.value?.toFixed(2)}</span>
      <span>Baseline: {baseline.toFixed(2)}</span>
    </div>
  );
}

function NDVIChart({ ndvi }) {
  const values = ndvi.data.map((point) => point.ndvi);
  const minValue = Math.min(...values, ndvi.baseline);
  const maxValue = Math.max(...values, ndvi.baseline);

  const yMin = Math.max(0, Math.floor((minValue - 0.05) * 10) / 10);
  const yMax = Math.min(1, Math.ceil((maxValue + 0.05) * 10) / 10);

  return (
    <section className="chart-card">
      <div className="chart-header">
        <div>
          <p className="eyebrow">EVIDENCE · VEGETATION</p>
          <h2>{ndvi.title}</h2>
          <p className="chart-description">{ndvi.description}</p>
        </div>

        <div className="confidence-label">
          <span className="confidence-dot" />
          {ndvi.confidence}
        </div>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={ndvi.data}
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
              domain={[yMin, yMax]}
              tickCount={5}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickFormatter={(value) => value.toFixed(2)}
            />
            <Tooltip
              content={<CustomTooltip baseline={ndvi.baseline} />}
              cursor={false}
            />
            <ReferenceLine
              y={ndvi.baseline}
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
              name="NDVI"
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
          <strong>{ndvi.source}</strong>
        </div>
        <div>
          <span>Method</span>
          <strong>{ndvi.method}</strong>
        </div>
        <div>
          <span>Limitation</span>
          <strong>{ndvi.limitation}</strong>
        </div>
      </div>
    </section>
  );
}

export default NDVIChart;