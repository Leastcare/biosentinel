import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

const SIGNALS = [
  { label: "Vegetation", color: "#4ade80", delay: 0 },
  { label: "Rainfall", color: "#38bdf8", delay: 0.4 },
  { label: "Wildlife", color: "#34d399", delay: 0.8 },
  { label: "Disturbance", color: "#f87171", delay: 1.2 },
];

function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState("enter"); // "enter" | "exit"
  const [progress, setProgress] = useState(0);

  // Auto-progress bar over 3.8 seconds then exit
  useEffect(() => {
    const start = performance.now();
    const duration = 3800;
    let raf;

    function tick(now) {
      const elapsed = now - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        handleExit();
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function handleExit() {
    setPhase("exit");
    window.setTimeout(onDone, 600);
  }

  return (
    <div className={`splash-root ${phase === "exit" ? "splash-exit" : ""}`}>
      {/* Background particles */}
      <div className="splash-particles" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="splash-particle" style={{ "--i": i }} />
        ))}
      </div>

      {/* Radial glow rings */}
      <div className="splash-rings" aria-hidden="true">
        <div className="splash-ring splash-ring-1" />
        <div className="splash-ring splash-ring-2" />
        <div className="splash-ring splash-ring-3" />
      </div>

      <div className="splash-content">
        {/* Logo */}
        <div className="splash-logo">
          <div className="splash-logo-mark">
            <Activity size={32} strokeWidth={2} />
          </div>
          <span className="splash-logo-text">BioSentinel</span>
        </div>

        {/* Tagline */}
        <p className="splash-tagline">
          Evidence-linked ecosystem monitoring
        </p>

        {/* Signal indicators */}
        <div className="splash-signals">
          {SIGNALS.map(({ label, color, delay }) => (
            <div
              key={label}
              className="splash-signal"
              style={{ "--color": color, "--delay": `${delay}s` }}
            >
              <span className="splash-signal-dot" />
              <span className="splash-signal-label">{label}</span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="splash-progress-wrap">
          <div
            className="splash-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="splash-loading-text">
          {progress < 100 ? "Initialising signals…" : "Ready"}
        </p>
      </div>

      {/* Skip button */}
      <button
        className="splash-skip"
        type="button"
        onClick={handleExit}
        aria-label="Skip intro"
      >
        Skip <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

export default SplashScreen;
