import {
  CloudSun,
  Flame,
  Leaf,
  PawPrint,
  ShieldCheck,
} from "lucide-react";

const sources = [
  {
    icon: Leaf,
    name: "Vegetation",
    source: "Sentinel-2 / Copernicus",
    update: "Cloud-free satellite observations",
    limitation: "NDVI is a vegetation-vigor proxy.",
    color: "green",
  },
  {
    icon: CloudSun,
    name: "Climate",
    source: "Open-Meteo historical weather",
    update: "Weather-model updates",
    limitation: "Values are gridded estimates, not local station readings.",
    color: "blue",
  },
  {
    icon: PawPrint,
    name: "Wildlife",
    source: "GBIF occurrence records",
    update: "Depends on observation and reporting activity",
    limitation: "Not a population estimate.",
    color: "green",
  },
  {
    icon: Flame,
    name: "Disturbance",
    source: "NASA FIRMS",
    update: "Near-real-time thermal detections",
    limitation: "Alerts do not independently confirm fire damage.",
    color: "red",
  },
];

function SourcePanel() {
  return (
    <section className="source-panel">
      <div className="source-panel-header">
        <div className="source-title">
          <ShieldCheck size={20} strokeWidth={1.8} />
          <div>
            <p className="eyebrow">METHOD & TRANSPARENCY</p>
            <h2>How to read this check-up</h2>
          </div>
        </div>

        <span className="source-status">
          <span />
          Evidence-linked snapshot
        </span>
      </div>

      <p className="source-intro">
        BioSentinel synthesizes four independent signals. Each metric is
        displayed with its source, method, confidence, and known limitation.
        This is a near-current monitoring snapshot—not a population census,
        prediction, or emergency-response system.
      </p>

      <div className="source-grid">
        {sources.map((item) => {
          const Icon = item.icon;

          return (
            <article className={`source-item ${item.color}`} key={item.name}>
              <div className="source-item-icon">
                <Icon size={19} strokeWidth={1.8} />
              </div>

              <div>
                <h3>{item.name}</h3>
                <p className="source-name">{item.source}</p>
                <p className="source-update">{item.update}</p>
                <p className="source-limitation">{item.limitation}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default SourcePanel;