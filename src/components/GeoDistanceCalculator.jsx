import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function haversine(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => deg * Math.PI / 180;
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const defaultPosition = [19.4326, -99.1332]; // CDMX por defecto

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

const GeoDistanceCalculator = () => {
  const [lat1, setLat1] = useState('');
  const [lon1, setLon1] = useState('');
  const [lat2, setLat2] = useState('');
  const [lon2, setLon2] = useState('');
  const [distance, setDistance] = useState(null);
  const [points, setPoints] = useState([]); // For map markers

  const handleCalculate = () => {
    if (lat1 && lon1 && lat2 && lon2) {
      const d = haversine(parseFloat(lat1), parseFloat(lon1), parseFloat(lat2), parseFloat(lon2));
      setDistance(d);
    }
  };

  // When user clicks on map, set lat/lon fields and marker
  const handleMapClick = (latlng) => {
    if (points.length === 0) {
      setLat1(latlng.lat.toFixed(6));
      setLon1(latlng.lng.toFixed(6));
      setPoints([latlng]);
    } else if (points.length === 1) {
      setLat2(latlng.lat.toFixed(6));
      setLon2(latlng.lng.toFixed(6));
      setPoints([...points, latlng]);
    } else {
      // Reset if user clicks a third time
      setLat1(latlng.lat.toFixed(6));
      setLon1(latlng.lng.toFixed(6));
      setLat2('');
      setLon2('');
      setPoints([latlng]);
      setDistance(null);
    }
  };

  // If user edits fields manually, update points array
  React.useEffect(() => {
    const p = [];
    if (lat1 && lon1) p.push({ lat: parseFloat(lat1), lng: parseFloat(lon1) });
    if (lat2 && lon2) p.push({ lat: parseFloat(lat2), lng: parseFloat(lon2) });
    setPoints(p);
  }, [lat1, lon1, lat2, lon2]);

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Calculadora de Distancia Geográfica</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Latitud 1</label>
          <input type="number" value={lat1} onChange={e => setLat1(e.target.value)} className="border rounded px-2 py-1 w-full" step="any" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Longitud 1</label>
          <input type="number" value={lon1} onChange={e => setLon1(e.target.value)} className="border rounded px-2 py-1 w-full" step="any" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Latitud 2</label>
          <input type="number" value={lat2} onChange={e => setLat2(e.target.value)} className="border rounded px-2 py-1 w-full" step="any" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Longitud 2</label>
          <input type="number" value={lon2} onChange={e => setLon2(e.target.value)} className="border rounded px-2 py-1 w-full" step="any" />
        </div>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCalculate}>
        Calcular Distancia
      </button>
      {distance !== null && (
        <div className="mt-4 text-lg text-center">
          <span className="font-bold">{distance.toFixed(3)} km</span>
        </div>
      )}
      <div className="mt-6">
        <MapContainer center={defaultPosition} zoom={5} style={{ height: '350px', borderRadius: '1rem', boxShadow: '0 4px 24px #0002' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <MapClickHandler onMapClick={handleMapClick} />
          {points.map((pos, idx) => (
            <Marker key={idx} position={[pos.lat, pos.lng]} />
          ))}
          {points.length === 2 && (
            <Polyline positions={points.map(p => [p.lat, p.lng])} color="red" />
          )}
        </MapContainer>
        <div className="mt-2 text-xs text-gray-600">
          <p>Haz click en el mapa para marcar los dos puntos. También puedes editar las coordenadas manualmente.</p>
        </div>
      </div>
    </div>
  );
};

export default GeoDistanceCalculator;
