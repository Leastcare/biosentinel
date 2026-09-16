import {
  Activity,
  Flame,
  Leaf,
  MapPin,
  PawPrint,
  Thermometer,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import NDVIChart from "./components/NDVIChart";
import ClimateChart from "./components/ClimateChart";
import WildlifeChart from "./components/WildlifeChart";
import DisturbanceChart from "./components/DisturbanceChart";
import ReserveMap from "./components/ReserveMap";
import { reserves } from "./data/reserves";
import "./App.css";
import SourcePanel from "./components/SourcePanel";
import { fetchFirmsAlerts, getCachedFirmsAlerts } from "./services/firms";
import { fetchRainfall } from "./services/openmeteo";
import { fetchWildlifeOccurrences } from "./services/gbif";

const iconMap = {
  leaf: Leaf,
  thermometer: Thermometer,
  paw: PawPrint,
  flame: Flame,
};

function App() {
  const [selectedReserveId, setSelectedReserveId] = useState("amboseli");
  const [activeEvidence, setActiveEvidence] = useState("");

  // Disturbance (NASA FIRMS)
  const [firmsData, setFirmsData] = useState(null);
  const [firmsMode, setFirmsMode] = useState("preset");

  // Rainfall (Open-Meteo)
  const [rainfallData, setRainfallData] = useState(null);
  const [rainfallMode, setRainfallMode] = useState("preset");

  // Wildlife (GBIF)
  const [wildlifeData, setWildlifeData] = useState(null);
  const [wildlifeMode, setWildlifeMode] = useState("preset");

  const evidenceRef = useRef(null);
  const climateEvidenceRef = useRef(null);
  const wildlifeEvidenceRef = useRef(null);
  const disturbanceEvidenceRef = useRef(null);

  const reserve = reserves[selectedReserveId];

  // ── NASA FIRMS (disturbance) ────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    setFirmsData(null);
    setFirmsMode("loading");

    fetchFirmsAlerts(selectedReserveId)
      .then((result) => {
        if (!cancelled) {
          setFirmsData(result);
          setFirmsMode("live");
        }
      })
      .catch((error) => {
        console.error("FIRMS request failed:", error);
        const cached = getCachedFirmsAlerts(selectedReserveId);
        if (!cancelled && cached) {
          setFirmsData(cached);
          setFirmsMode("cached");
        } else if (!cancelled) {
          setFirmsMode("preset");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedReserveId]);

  // ── Open-Meteo (rainfall) ───────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    setRainfallData(null);
    setRainfallMode("loading");

    fetchRainfall(reserve.lat, reserve.lon, reserve.climate.baseline)
      .then((result) => {
        if (!cancelled) {
          setRainfallData(result);
          setRainfallMode("live");
        }
      })
      .catch((error) => {
        console.error("Open-Meteo request failed:", error);
        if (!cancelled) {
          setRainfallMode("preset");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedReserveId]);

  // ── GBIF (wildlife occurrences) ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    setWildlifeData(null);
    setWildlifeMode("loading");

    fetchWildlifeOccurrences(reserve.bbox, reserve.wildlife.baseline)
      .then((result) => {
        if (!cancelled) {
          setWildlifeData(result);
          setWildlifeMode("live");
        }
      })
      .catch((error) => {
        console.error("GBIF request failed:", error);
        if (!cancelled) {
          setWildlifeMode("preset");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedReserveId]);

  // ── Evidence scroll helpers ─────────────────────────────────────────────────
  function showEvidence(type, ref) {
    setActiveEvidence(type);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => setActiveEvidence(""), 2200);
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

  // ── Derived props for charts ────────────────────────────────────────────────
  const climateProps =
    rainfallData?.chartData?.length
      ? {
          ...reserve.climate,
          data: rainfallData.chartData,
          description:
            "Live monthly rainfall totals from Open-Meteo reanalysis data for the selected reserve area.",
          confidence: "Live weather data",
        }
      : reserve.climate;

  const wildlifeProps =
    wildlifeData?.chartData?.length
      ? {
          ...reserve.wildlife,
          data: wildlifeData.chartData,
          description:
            "Live monthly GBIF occurrence-record counts for the selected reserve bounding box.",
          confidence: "Live GBIF data",
        }
      : reserve.wildlife;

  const disturbanceProps =
    firmsData?.chartData?.length
      ? {
          ...reserve.disturbance,
          data: firmsData.chartData,
          description:
            "Recent NASA FIRMS thermal-anomaly detections for the selected reserve area.",
          confidence: "Live satellite detection",
          source: "NASA FIRMS",
          method: "Recent area-based thermal-alert count",
        }
      : reserve.disturbance;

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
          <span>Overall snapshot: {reserve.snapshotDate}</span>
        </div>
      </section>

      <section className="vital-grid" aria-label="Ecosystem vital signs">
        {reserve.signals.map((sign) => {
          const SignalIcon = iconMap[sign.icon];

          return (
            <button
              className={`vital-card ${sign.status} ${
                ["vegetation", "climate", "wildlife", "disturbance"].includes(sign.id)
                  ? "clickable-card"
                  : ""
              }`}
              key={sign.id}
              onClick={
                sign.id === "vegetation"
                  ? showVegetationEvidence
                  : sign.id === "climate"
                    ? showClimateEvidence
                    : sign.id === "wildlife"
                      ? showWildlifeEvidence
                      : sign.id === "disturbance"
                        ? showDisturbanceEvidence
                        : undefined
              }
              role={
                ["vegetation", "climate", "wildlife", "disturbance"].includes(sign.id)
                  ? "button"
                  : undefined
              }
              tabIndex={
                ["vegetation", "climate", "wildlife", "disturbance"].includes(sign.id)
                  ? 0
                  : undefined
              }
              onKeyDown={(event) => {
                const canOpenEvidence = [
                  "vegetation",
                  "climate",
                  "wildlife",
                  "disturbance",
                ].includes(sign.id);

                if (canOpenEvidence && (event.key === "Enter" || event.key === " ")) {
                  if (sign.id === "vegetation") showVegetationEvidence();
                  if (sign.id === "climate") showClimateEvidence();
                  if (sign.id === "wildlife") showWildlifeEvidence();
                  if (sign.id === "disturbance") showDisturbanceEvidence();
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

              <div
                className="reading-row"
                onClick={
                  sign.id === "vegetation"
                    ? showVegetationEvidence
                    : sign.id === "climate"
                      ? showClimateEvidence
                      : sign.id === "wildlife"
                        ? showWildlifeEvidence
                        : sign.id === "disturbance"
                          ? showDisturbanceEvidence
                          : undefined
                }
              >
                <span className={`reading ${sign.value.length > 7 ? "reading-long" : ""}`}>
                  {sign.value}
                </span>
                <span className="trend-arrow">{sign.direction}</span>
              </div>

              <h2>{sign.label}</h2>
              <p>{sign.caption}</p>
            </button>
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
          <button className="evidence-link" type="button" onClick={showVegetationEvidence}>
            {reserve.summary.vegetationClaim}
          </button>{" "}
          {reserve.summary.vegetationSuffix}{" "}
          <button className="evidence-link" type="button" onClick={showClimateEvidence}>
            {reserve.summary.rainfallClaim}
          </button>{" "}
          {reserve.summary.climatePrefix}{" "}
          <button className="evidence-link" type="button" onClick={showClimateEvidence}>
            {reserve.summary.climateClaim}
          </button>
          {reserve.id === "amboseli" ? (
            <>
              {" "}Wildlife{" "}
              <button className="evidence-link" type="button" onClick={showWildlifeEvidence}>
                observation activity
              </button>{" "}
              is stable, while{" "}
              <button className="evidence-link" type="button" onClick={showDisturbanceEvidence}>
                disturbance risk
              </button>{" "}
              is low.
            </>
          ) : (
            <>
              {" "}Wildlife{" "}
              <button className="evidence-link" type="button" onClick={showWildlifeEvidence}>
                observation activity
              </button>{" "}
              is rising, and one recent{" "}
              <button className="evidence-link" type="button" onClick={showDisturbanceEvidence}>
                thermal alert
              </button>{" "}
              warrants continued monitoring.
            </>
          )}
        </p>

        <div className="summary-footer">
          <span>Every highlighted claim can be verified against its source data.</span>
          <button className="evidence-button" type="button" onClick={showVegetationEvidence}>
            View evidence <span>→</span>
          </button>
        </div>
      </section>

      {/* Vegetation — still static (no free NDVI API) */}
      <section
        ref={evidenceRef}
        className={`evidence-section ${activeEvidence === "vegetation" ? "evidence-active" : ""}`}
      >
        <NDVIChart ndvi={reserve.ndvi} />
      </section>

      {/* Rainfall — live Open-Meteo */}
      <section
        ref={climateEvidenceRef}
        className={`evidence-section ${activeEvidence === "climate" ? "evidence-active" : ""}`}
      >
        <div className="firms-status">
          <span className={`status-dot ${rainfallMode}`} />
          {rainfallMode === "live"
            ? "Live · Open-Meteo"
            : rainfallMode === "loading"
              ? "Fetching · Open-Meteo"
              : "Demo data · offline fallback"}
        </div>
        <ClimateChart climate={climateProps} mode={rainfallMode} />
      </section>

      {/* Wildlife — live GBIF */}
      <section
        ref={wildlifeEvidenceRef}
        className={`evidence-section ${activeEvidence === "wildlife" ? "evidence-active" : ""}`}
      >
        <div className="firms-status">
          <span className={`status-dot ${wildlifeMode}`} />
          {wildlifeMode === "live"
            ? "Live · GBIF"
            : wildlifeMode === "loading"
              ? "Fetching · GBIF (this may take a few seconds)"
              : "Demo data · offline fallback"}
        </div>
        <WildlifeChart wildlife={wildlifeProps} mode={wildlifeMode} />
      </section>

      {/* Disturbance — live NASA FIRMS */}
      <section
        ref={disturbanceEvidenceRef}
        className={`evidence-section ${activeEvidence === "disturbance" ? "evidence-active" : ""}`}
      >
        <div className="firms-status">
          <span className={`status-dot ${firmsMode}`} />
          {firmsMode === "live"
            ? "Live · NASA FIRMS"
            : firmsMode === "cached"
              ? "Cached · NASA FIRMS"
              : firmsMode === "loading"
                ? "Checking · NASA FIRMS"
                : "Demo data · offline fallback"}
        </div>
        <DisturbanceChart disturbance={disturbanceProps} />
      </section>

      <ReserveMap reserveId={reserve.id} reserveName={reserve.name} />
      <SourcePanel />
    </main>
  );
}

export default App;
