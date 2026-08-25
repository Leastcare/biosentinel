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

function CustomTooltip({ active, payload, label, baseline, unit }) {
  if (!active || !payload?.length) {
    return null;
  }

  const recordPoint = payload.find((item) => item.dataKey === "records");

  return (
    <div className="chart-tooltip">
      <p>{label}</p>
      <span>
        Records: {recordPoint?.value} {unit}
      </span>
      <span>
        Baseline: {baseline} {unit}
      </span>
    </div>
  );
}

function WildlifeChart({ wildlife }) {
  const values = wildlife.data.map((point) => point.records);
  const minValue = Math.min(...values, wildlife.baseline);
  const maxValue = Math.max(...values, wildlife.baseline);

  const yMin = Math.max(0, Math.floor((minValue - 5) / 5) * 5);
  const yMax = Math.ceil((maxValue + 5) / 5) * 5;

  return (
    <section className="chart-card wildlife-chart-card">
      <div className="chart-header">
        <div>
          <p className="eyebrow">EVIDENCE · WILDLIFE</p>
          <h2>{wildlife.title}</h2>
          <p className="chart-description">{wildlife.description}</p>
        </div>

        <div className="confidence-label wildlife-confidence">
          <span className="confidence-dot" />
          {wildlife.confidence}
        </div>
      </div>

      <div className="proxy-notice">
        Observation activity proxy — not a population estimate.
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={wildlife.data}
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
            />
            <Tooltip
              content={
                <CustomTooltip
                  baseline={wildlife.baseline}
                  unit={wildlife.unit}
                />
              }
              cursor={false}
            />
            <ReferenceLine
              y={wildlife.baseline}
              stroke="#cbd5e1"
              strokeDasharray="4 5"
              label={{
                value: wildlife.baselineLabel,
                position: "insideTopRight",
                fill: "#cbd5e1",
                fontSize: 11,
              }}
            />
            <Line
              type="monotone"
              dataKey="records"
              name="GBIF records"
              stroke="#34d399"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 5,
                fill: "#6ee7b7",
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
          <strong>{wildlife.source}</strong>
        </div>
        <div>
          <span>Method</span>
          <strong>{wildlife.method}</strong>
        </div>
        <div>
          <span>Limitation</span>
          <strong>{wildlife.limitation}</strong>
        </div>
      </div>
    </section>
  );
}

export default WildlifeChart;