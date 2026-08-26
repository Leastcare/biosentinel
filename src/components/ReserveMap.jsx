import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  Polygon,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const reserveCoordinates = {
  amboseli: {
    center: [-2.6527, 37.2606],
    boundary: [
      [-2.55, 37.12],
      [-2.48, 37.28],
      [-2.59, 37.43],
      [-2.78, 37.39],
      [-2.91, 37.22],
      [-2.78, 37.08],
    ],
  },

  keoladeo: {
    center: [27.1591, 77.5152],
    boundary: [
      [27.184, 77.485],
      [27.192, 77.512],
      [27.181, 77.548],
      [27.153, 77.566],
      [27.128, 77.548],
      [27.119, 77.516],
      [27.132, 77.488],
      [27.16, 77.478],
    ],
  },
};

function MapViewport({ boundary }) {
  const map = useMap();

  useEffect(() => {
    const fitMap = () => {
      map.invalidateSize();
      map.fitBounds(boundary, {
        padding: [36, 36],
        animate: false,
        maxZoom: 14,
      });
    };

    const timer = window.setTimeout(fitMap, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, [map, boundary]);

  return null;
}

function ReserveMap({ reserveId, reserveName }) {
  const location =
    reserveCoordinates[reserveId] ?? reserveCoordinates.amboseli;

  return (
    <section className="map-card">
      <div className="map-header">
        <div>
          <p className="eyebrow">GEOGRAPHIC CONTEXT</p>
          <h2>{reserveName} Boundary</h2>
        </div>

        <span className="map-context-label">Context only</span>
      </div>

      <div className="map-wrap">
        <MapContainer
          key={`map-${reserveId}`}
          center={location.center}
          zoom={12}
          scrollWheelZoom={false}
          zoomControl
          className="reserve-map"
        >
          <TileLayer
            key={`tiles-${reserveId}`}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapViewport boundary={location.boundary} />

          <Polygon
            key={`boundary-${reserveId}`}
            positions={location.boundary}
            pathOptions={{
              color: "#34d399",
              weight: 5,
              opacity: 1,
              fillColor: "#10b981",
              fillOpacity: 0.22,
            }}
          >
            <Tooltip sticky>{reserveName}</Tooltip>
          </Polygon>

          <CircleMarker
            center={location.center}
            radius={7}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: "#34d399",
              fillOpacity: 1,
            }}
          >
            <Tooltip permanent direction="top">
              {reserveName}
            </Tooltip>
          </CircleMarker>
        </MapContainer>
      </div>

      <p className="map-disclaimer">
        Boundary shown for geographic context. Vital-sign calculations use
        reserve-specific analysis areas.
      </p>
    </section>
  );
}

export default ReserveMap;