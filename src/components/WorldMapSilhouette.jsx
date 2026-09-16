// Simplified SVG world map silhouette with glowing dots for Amboseli & Keoladeo.
// The continent outlines are highly simplified polygons — enough to read as a map.

const RESERVES = {
  amboseli: {
    // Approximate SVG position for Kenya/East Africa on a 1000x500 viewBox
    cx: 562,
    cy: 268,
    label: "Amboseli",
    color: "#34d399",
  },
  keoladeo: {
    // Approximate SVG position for India
    cx: 680,
    cy: 208,
    label: "Keoladeo",
    color: "#60a5fa",
  },
};

function WorldMapSilhouette({ reserveId }) {
  const active = RESERVES[reserveId] ?? RESERVES.amboseli;

  return (
    <div className="world-map-wrap" aria-hidden="true">
      <svg
        className="world-map-svg"
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Simplified continent outlines ─────────────────────────── */}
        {/* North America */}
        <path
          d="M120,60 L200,55 L240,80 L260,120 L250,160 L220,185 L195,200
             L170,230 L155,260 L140,240 L125,210 L110,185 L95,155 L90,120
             L100,90 Z"
          fill="rgba(96,165,250,0.055)"
          stroke="rgba(96,165,250,0.10)"
          strokeWidth="0.8"
        />
        {/* South America */}
        <path
          d="M195,255 L230,248 L255,265 L265,300 L268,340 L255,375
             L235,400 L210,415 L190,395 L178,360 L175,320 L180,285 Z"
          fill="rgba(52,211,153,0.045)"
          stroke="rgba(52,211,153,0.09)"
          strokeWidth="0.8"
        />
        {/* Europe */}
        <path
          d="M450,55 L500,50 L530,60 L540,80 L525,100 L505,115
             L480,118 L460,108 L448,88 Z"
          fill="rgba(96,165,250,0.055)"
          stroke="rgba(96,165,250,0.10)"
          strokeWidth="0.8"
        />
        {/* Africa */}
        <path
          d="M470,120 L510,112 L545,118 L568,135 L578,165 L580,200
             L572,240 L555,275 L535,305 L510,325 L488,320 L468,298
             L452,265 L445,230 L448,195 L455,160 L458,135 Z"
          fill="rgba(52,211,153,0.055)"
          stroke="rgba(52,211,153,0.10)"
          strokeWidth="0.8"
        />
        {/* Asia */}
        <path
          d="M555,55 L650,48 L750,55 L810,75 L840,100 L830,130
             L800,148 L760,155 L720,150 L690,165 L665,155 L640,140
             L615,130 L590,118 L565,108 L548,88 Z"
          fill="rgba(96,165,250,0.045)"
          stroke="rgba(96,165,250,0.09)"
          strokeWidth="0.8"
        />
        {/* India subcontinent */}
        <path
          d="M650,155 L685,150 L710,165 L720,195 L710,225 L690,240
             L668,235 L650,215 L642,188 Z"
          fill="rgba(96,165,250,0.07)"
          stroke="rgba(96,165,250,0.13)"
          strokeWidth="0.8"
        />
        {/* Australia */}
        <path
          d="M760,290 L820,282 L860,295 L875,325 L865,358 L840,372
             L805,370 L778,352 L762,322 Z"
          fill="rgba(52,211,153,0.04)"
          stroke="rgba(52,211,153,0.08)"
          strokeWidth="0.8"
        />

        {/* ── All reserve dots (dim) ─────────────────────────────────── */}
        {Object.entries(RESERVES).map(([id, r]) => (
          <g key={id} opacity={id === reserveId ? 1 : 0.3}>
            {/* outer pulse ring */}
            <circle cx={r.cx} cy={r.cy} r="14" fill="none"
              stroke={r.color} strokeWidth="0.8" opacity="0.3"
              className="map-dot-ring"
              style={{ animationDelay: id === "keoladeo" ? "0.5s" : "0s" }}
            />
            <circle cx={r.cx} cy={r.cy} r="8" fill="none"
              stroke={r.color} strokeWidth="1" opacity="0.5"
            />
            {/* core dot */}
            <circle cx={r.cx} cy={r.cy} r="3.5"
              fill={r.color}
              style={{ filter: `drop-shadow(0 0 6px ${r.color})` }}
            />
            {/* label */}
            <text
              x={r.cx + 10} y={r.cy - 8}
              fill={r.color}
              fontSize="9"
              fontFamily="Inter, sans-serif"
              fontWeight="600"
              opacity="0.8"
            >
              {r.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default WorldMapSilhouette;
