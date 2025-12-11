import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Iconos personalizados pueden agregarse aquí
// import L from 'leaflet';
// const switchIcon = new L.Icon({ ... });

const defaultPosition = [19.4326, -99.1332]; // CDMX por defecto

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

const NetworkMapDesigner = () => {
  const [points, setPoints] = useState([]);
  const [lines, setLines] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState([]);

  const handleMapClick = (latlng) => {
    if (drawing) {
      setCurrentLine([...currentLine, latlng]);
    } else {
      setPoints([...points, latlng]);
    }
  };

  const startLine = () => {
    setDrawing(true);
    setCurrentLine([]);
  };

  const finishLine = () => {
    if (currentLine.length > 1) {
      setLines([...lines, currentLine]);
    }
    setDrawing(false);
    setCurrentLine([]);
  };

  const clearAll = () => {
    setPoints([]);
    setLines([]);
    setCurrentLine([]);
    setDrawing(false);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={startLine} disabled={drawing}>
          Dibujar Cableado
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={finishLine} disabled={!drawing}>
          Terminar Cableado
        </button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={clearAll}>
          Limpiar Todo
        </button>
      </div>
      <MapContainer center={defaultPosition} zoom={17} style={{ height: '500px', borderRadius: '1rem', boxShadow: '0 4px 24px #0002' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <MapClickHandler onMapClick={handleMapClick} />
        {points.map((pos, idx) => (
          <Marker key={idx} position={pos} />
        ))}
        {lines.map((line, idx) => (
          <Polyline key={idx} positions={line} color="red" />
        ))}
        {drawing && currentLine.length > 1 && (
          <Polyline positions={currentLine} color="blue" dashArray="5,10" />
        )}
      </MapContainer>
      <div className="mt-4 text-sm text-gray-600">
        <p><b>Puntos:</b> Marca los puntos de red haciendo click en el mapa.</p>
        <p><b>Cableado:</b> Haz click en "Dibujar Cableado", luego marca los puntos del cableado y termina con "Terminar Cableado".</p>
      </div>
    </div>
  );
};

export default NetworkMapDesigner;
