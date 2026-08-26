import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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

  const alertPoint = payload.find((item) => item.dataKey === "alerts");

  return (
    <div className="chart-tooltip">
      <p>{label}</p>
      <span>
        Alerts: {alertPoint?.value} {unit}
      </span>
      <span>
        Reference: {baseline} {unit}
      </span>
    </div>
  );
}

function DisturbanceChart({ disturbance }) {
  const values = disturbance.data.map((point) => point.alerts);
  const maxValue = Math.max(...values, disturbance.baseline);
  const yMax = Math.max(2, Math.ceil(maxValue + 1));

  return (
    <section className="chart-card disturbance-chart-card">
      <div className="chart-header">
        <div>
          <p className="eyebrow">EVIDENCE · DISTURBANCE</p>
          <h2>{disturbance.title}</h2>
          <p className="chart-description">{disturbance.description}</p>
        </div>

        <div className="confidence-label disturbance-confidence">
          <span className="confidence-dot" />
          {disturbance.confidence}
        </div>
      </div>

      <div className="alert-notice">
        Thermal anomaly detection — not an independent damage assessment.
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={disturbance.data}
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
              domain={[0, yMax]}
              allowDecimals={false}
              tickCount={Math.min(yMax + 1, 5)}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <Tooltip
              content={
                <CustomTooltip
                  baseline={disturbance.baseline}
                  unit={disturbance.unit}
                />
              }
              cursor={{ fill: "rgba(248, 113, 113, 0.08)" }}
            />
            <ReferenceLine
              y={disturbance.baseline}
              stroke="#cbd5e1"
              strokeDasharray="4 5"
              label={{
                value: disturbance.baselineLabel,
                position: "insideTopRight",
                fill: "#cbd5e1",
                fontSize: 11,
              }}
            />
            <Bar
              dataKey="alerts"
              name="Thermal alerts"
              fill="#f87171"
              radius={[5, 5, 0, 0]}
              maxBarSize={42}
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
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="evidence-meta">
        <div>
          <span>Source</span>
          <strong>{disturbance.source}</strong>
        </div>
        <div>
          <span>Method</span>
          <strong>{disturbance.method}</strong>
        </div>
        <div>
          <span>Limitation</span>
          <strong>{disturbance.limitation}</strong>
        </div>
      </div>
    </section>
  );
}

export default DisturbanceChart;