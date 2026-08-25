import { useRef, useState } from "react";
import NDVIChart from "./components/NDVIChart";
import "./App.css";

const vitalSigns = [
  {
    icon: "🌿",
    value: "-12%",
    direction: "↓",
    label: "Vegetation Health",
    caption: "vs. 6-month baseline",
    status: "warning",
  },
  {
    icon: "🌡",
    value: "Elevated",
    direction: "↑",
    label: "Climate Stress",
    caption: "Current status",
    status: "critical",
  },
  {
    icon: "🐾",
    value: "Stable",
    direction: "→",
    label: "Wildlife Activity",
    caption: "Observation activity proxy",
    status: "healthy",
  },
  {
    icon: "🔥",
    value: "Low",
    direction: "↓",
    label: "Disturbance Risk",
    caption: "Recent thermal alerts",
    status: "healthy",
  },
];

function App() {
  const [activeEvidence, setActiveEvidence] = useState(false);
  const evidenceRef = useRef(null);

  function showVegetationEvidence() {
    setActiveEvidence(true);

    evidenceRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    window.setTimeout(() => {
      setActiveEvidence(false);
    }, 2200);
  }
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">⌁</div>
          <span>BioSentinel</span>
        </div>

        <button className="reserve-selector" type="button">
          <span className="location-dot">⌖</span>
          Amboseli National Reserve
          <span className="chevron">⌄</span>
        </button>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">ECOSYSTEM VITAL SIGNS</p>
          <h1>Amboseli National Reserve</h1>
          <p className="subtitle">
            An evidence-linked ecosystem check-up using the latest available
            environmental signals.
          </p>
        </div>

        <div className="data-status">
          <span className="live-dot" />
          Data snapshot: 20 Aug 2026
        </div>
      </section>

      <section className="vital-grid" aria-label="Ecosystem vital signs">
        {vitalSigns.map((sign) => (
          <article className={`vital-card ${sign.status}`} key={sign.label}>
            <div className="signal-line" />
            <div className="card-top">
              <span className="signal-icon">{sign.icon}</span>
              <span className="signal-state">{sign.status}</span>
            </div>

            <div className="reading-row">
              <span
                className={`reading ${
                  sign.value.length > 7 ? "reading-long" : ""
                }`}
              >
                {sign.value}
              </span>
              <span className="trend-arrow">{sign.direction}</span>
            </div>

            <h2>{sign.label}</h2>
            <p>{sign.caption}</p>
          </article>
        ))}
      </section>

      <section className="summary-panel">
        <div className="summary-heading">
          <span className="sparkle">✦</span>
          <h2>AI Ecosystem Summary</h2>
        </div>

        <p>
          Vegetation vigor has{" "}
          <button
            className="evidence-link"
            type="button"
            onClick={showVegetationEvidence}
          >
            declined by 12%
          </button>{" "}
          compared with the six-month baseline, alongside{" "}
          <button className="evidence-link" type="button">
            below-average rainfall
          </button>{" "}
          and prolonged dry conditions. Climate stress remains{" "}
          <button className="evidence-link" type="button">
            elevated
          </button>
          . Wildlife observation activity is stable, while disturbance risk is
          low.
        </p>

        <div className="summary-footer">
          <span>
            Every highlighted claim can be verified against its source data.
          </span>
          <button
            className="evidence-button"
            type="button"
            onClick={showVegetationEvidence}
          >
            View evidence <span>→</span>
          </button>
        </div>
      </section>

      <section
        ref={evidenceRef}
        className={`evidence-section ${activeEvidence ? "evidence-active" : ""}`}
      >
        <NDVIChart />
      </section>
    </main>
  );
}

export default App;
