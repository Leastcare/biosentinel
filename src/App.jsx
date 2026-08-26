import {
  Activity,
  Flame,
  Leaf,
  MapPin,
  PawPrint,
  Thermometer,
} from "lucide-react";
import { useRef, useState } from "react";
import NDVIChart from "./components/NDVIChart";
import ClimateChart from "./components/ClimateChart";
import WildlifeChart from "./components/WildlifeChart";
import DisturbanceChart from "./components/DisturbanceChart";
import ReserveMap from "./components/ReserveMap";
import { reserves } from "./data/reserves";
import "./App.css";

const iconMap = {
  leaf: Leaf,
  thermometer: Thermometer,
  paw: PawPrint,
  flame: Flame,
};

function App() {
  const [selectedReserveId, setSelectedReserveId] = useState("amboseli");
  const [activeEvidence, setActiveEvidence] = useState("");
  const evidenceRef = useRef(null);
  const climateEvidenceRef = useRef(null);
  const wildlifeEvidenceRef = useRef(null);
  const disturbanceEvidenceRef = useRef(null);

  const reserve = reserves[selectedReserveId];

  function showEvidence(type, ref) {
    setActiveEvidence(type);

    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    window.setTimeout(() => {
      setActiveEvidence("");
    }, 2200);
  }

  function showVegetationEvidence() {
    showEvidence("vegetation", evidenceRef);
  }

  function showClimateEvidence() {
    showEvidence("climate", climateEvidenceRef);
  }

  function showWildlifeEvidence() {
    showEvidence("wildlife", wildlifeEvidenceRef);
  }

  function showDisturbanceEvidence() {
    showEvidence("disturbance", disturbanceEvidenceRef);
  }

  function handleReserveChange(event) {
    setSelectedReserveId(event.target.value);
    setActiveEvidence("");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <Activity size={22} strokeWidth={2} />
          </div>
          <span>BioSentinel</span>
        </div>

        <label className="reserve-selector">
          <MapPin size={17} strokeWidth={2} />
          <select
            value={selectedReserveId}
            onChange={handleReserveChange}
            aria-label="Select protected area"
          >
            {Object.values(reserves).map((reserveOption) => (
              <option key={reserveOption.id} value={reserveOption.id}>
                {reserveOption.name}
              </option>
            ))}
          </select>
        </label>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">ECOSYSTEM VITAL SIGNS</p>
          <h1>{reserve.name}</h1>
          <p className="subtitle">{reserve.description}</p>
        </div>

        <div className="data-status">
          <span className="live-dot" />
          Data snapshot: {reserve.snapshotDate}
        </div>
      </section>

      <section className="vital-grid" aria-label="Ecosystem vital signs">
        {reserve.signals.map((sign) => {
          const SignalIcon = iconMap[sign.icon];

          return (
            <article
              className={`vital-card ${sign.status} ${
                ["climate", "wildlife", "disturbance"].includes(sign.id)
                  ? "clickable-card"
                  : ""
              }`}
              key={sign.id}
              onClick={
                sign.id === "climate"
                  ? showClimateEvidence
                  : sign.id === "wildlife"
                    ? showWildlifeEvidence
                    : sign.id === "disturbance"
                      ? showDisturbanceEvidence
                      : undefined
              }
              role={
                ["climate", "wildlife", "disturbance"].includes(sign.id)
                  ? "button"
                  : undefined
              }
              tabIndex={
                ["climate", "wildlife", "disturbance"].includes(sign.id)
                  ? 0
                  : undefined
              }
              onKeyDown={(event) => {
                const canOpenEvidence = [
                  "climate",
                  "wildlife",
                  "disturbance",
                ].includes(sign.id);

                if (
                  canOpenEvidence &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  if (sign.id === "climate") {
                    showClimateEvidence();
                  }

                  if (sign.id === "wildlife") {
                    showWildlifeEvidence();
                  }

                  if (sign.id === "disturbance") {
                    showDisturbanceEvidence();
                  }
                }
              }}
            >
              <div className="signal-line" />

              <div className="card-top">
                <span className="signal-icon">
                  <SignalIcon size={23} strokeWidth={1.9} />
                </span>
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
          );
        })}
      </section>

      <section className="summary-panel">
        <div className="summary-heading">
          <span className="sparkle">✦</span>
          <h2>AI Ecosystem Summary</h2>
        </div>

        <p>
          {reserve.summary.vegetationPrefix}{" "}
          <button
            className="evidence-link"
            type="button"
            onClick={showVegetationEvidence}
          >
            {reserve.summary.vegetationClaim}
          </button>{" "}
          {reserve.summary.vegetationSuffix}{" "}
          <button
            className="evidence-link"
            type="button"
            onClick={showClimateEvidence}
          >
            {reserve.summary.rainfallClaim}
          </button>{" "}
          {reserve.summary.climatePrefix}{" "}
          <button
            className="evidence-link"
            type="button"
            onClick={showClimateEvidence}
          >
            {reserve.summary.climateClaim}
          </button>
          {reserve.id === "amboseli" ? (
            <>
              {" "}
              Wildlife{" "}
              <button
                className="evidence-link"
                type="button"
                onClick={showWildlifeEvidence}
              >
                observation activity
              </button>{" "}
              is stable, while{" "}
              <button
                className="evidence-link"
                type="button"
                onClick={showDisturbanceEvidence}
              >
                disturbance risk
              </button>{" "}
              is low.
            </>
          ) : (
            <>
              {" "}
              Wildlife{" "}
              <button
                className="evidence-link"
                type="button"
                onClick={showWildlifeEvidence}
              >
                observation activity
              </button>{" "}
              is rising, and one recent{" "}
              <button
                className="evidence-link"
                type="button"
                onClick={showDisturbanceEvidence}
              >
                thermal alert
              </button>{" "}
              warrants continued monitoring.
            </>
          )}
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
        className={`evidence-section ${
          activeEvidence === "vegetation" ? "evidence-active" : ""
        }`}
      >
        <NDVIChart ndvi={reserve.ndvi} />
      </section>

      <section
        ref={climateEvidenceRef}
        className={`evidence-section ${
          activeEvidence === "climate" ? "evidence-active" : ""
        }`}
      >
        <ClimateChart climate={reserve.climate} />
      </section>

      <section
        ref={wildlifeEvidenceRef}
        className={`evidence-section ${
          activeEvidence === "wildlife" ? "evidence-active" : ""
        }`}
      >
        <WildlifeChart wildlife={reserve.wildlife} />
      </section>

      <section
        ref={disturbanceEvidenceRef}
        className={`evidence-section ${
          activeEvidence === "disturbance" ? "evidence-active" : ""
        }`}
      >
        <DisturbanceChart disturbance={reserve.disturbance} />
      </section>

      <ReserveMap reserveId={reserve.id} reserveName={reserve.name} />
    </main>
  );
}

export default App;
