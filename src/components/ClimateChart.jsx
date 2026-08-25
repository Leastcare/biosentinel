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

  const rainfallPoint = payload.find((item) => item.dataKey === "rainfall");

  return (
    <div className="chart-tooltip">
      <p>{label}</p>
      <span>
        Rainfall: {rainfallPoint?.value} {unit}
      </span>
      <span>
        Baseline: {baseline} {unit}
      </span>
    </div>
  );
}

function ClimateChart({ climate }) {
  const values = climate.data.map((point) => point.rainfall);
  const minValue = Math.min(...values, climate.baseline);
  const maxValue = Math.max(...values, climate.baseline);

  const yMin = Math.max(0, Math.floor((minValue - 10) / 10) * 10);
  const yMax = Math.ceil((maxValue + 10) / 10) * 10;

  return (
    <section className="chart-card climate-chart-card">
      <div className="chart-header">
        <div>
          <p className="eyebrow">EVIDENCE · CLIMATE</p>
          <h2>{climate.title}</h2>
          <p className="chart-description">{climate.description}</p>
        </div>

        <div className="confidence-label climate-confidence">
          <span className="confidence-dot" />
          {climate.confidence}
        </div>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={climate.data}
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
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              content={
                <CustomTooltip
                  baseline={climate.baseline}
                  unit={climate.unit}
                />
              }
              cursor={false}
            />
            <ReferenceLine
              y={climate.baseline}
              stroke="#cbd5e1"
              strokeDasharray="4 5"
              label={{
                value: climate.baselineLabel,
                position: "insideTopRight",
                fill: "#cbd5e1",
                fontSize: 11,
              }}
            />
            <Line
              type="monotone"
              dataKey="rainfall"
              name="Rainfall"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 5,
                fill: "#7dd3fc",
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
          <strong>{climate.source}</strong>
        </div>
        <div>
          <span>Method</span>
          <strong>{climate.method}</strong>
        </div>
        <div>
          <span>Limitation</span>
          <strong>{climate.limitation}</strong>
        </div>
      </div>
    </section>
  );
}

export default ClimateChart;