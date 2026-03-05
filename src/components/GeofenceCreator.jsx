import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Polyline, Tooltip, useMap, useMapEvents, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Icono personalizado para los puntos de la geocerca
function crearIconoPunto(numero, color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:24px;height:24px;border-radius:50%;
      background:${color};border:2px solid white;
      display:flex;align-items:center;justify-content:center;
      color:white;font-size:11px;font-weight:bold;
      box-shadow:0 2px 6px rgba(0,0,0,0.4);
    ">${numero}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

const COLORES = [
  '#E10600', '#1F2A56', '#F57C00', '#4CAF50', '#2196F3',
  '#9C27B0', '#00BCD4', '#FF5722', '#607D8B', '#795548',
];

const defaultCenter = [14.5361, -91.6770];

// Botón centrar en ubicación
function CenterLocationButton() {
  const map = useMap();
  const handleClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        map.setView([pos.coords.latitude, pos.coords.longitude], 16);
      });
    }
  };
  return (
    <button
      className="absolute top-4 left-14 z-[1000] bg-blue-600 text-white px-3 py-2 rounded shadow hover:bg-blue-700 text-sm"
      style={{ position: 'absolute' }}
      onClick={handleClick}
      title="Centrar en mi ubicación"
    >
      📍 Mi ubicación
    </button>
  );
}

// Buscador de ubicaciones con Nominatim
function LocationSearch() {
  const map = useMap();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buscar = (texto) => {
    setQuery(texto);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (texto.trim().length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texto)}&limit=6&addressdetails=1`
        );
        const data = await res.json();
        setResults(data);
        setOpen(data.length > 0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const seleccionar = (r) => {
    const lat = parseFloat(r.lat);
    const lon = parseFloat(r.lon);
    map.flyTo([lat, lon], 17, { duration: 1.5 });
    setQuery(r.display_name.split(',').slice(0, 3).join(','));
    setOpen(false);
    setResults([]);
  };

  return (
    <div
      ref={containerRef}
      className="absolute top-4 right-4 z-[1000]"
      style={{ position: 'absolute', width: '320px', maxWidth: 'calc(100% - 2rem)' }}
    >
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => buscar(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Buscar ubicación..."
          className="w-full px-3 py-2 pl-9 rounded-lg border border-gray-300 shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
        />
        <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
        {loading && (
          <div className="absolute right-2.5 top-2.5">
            <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {results.map((r, i) => (
            <li
              key={r.place_id || i}
              onClick={() => seleccionar(r)}
              className="px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-start gap-2"
            >
              <svg className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-2 leading-tight">{r.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Captura clics en el mapa para agregar puntos
function MapClickHandler({ dibujando, onPuntoAgregado }) {
  useMapEvents({
    click(e) {
      if (dibujando) {
        onPuntoAgregado([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
}

function generarId() {
  return 'geo_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
}

export default function GeofenceCreator() {
  const [geocercas, setGeocercas] = useState(() => {
    try {
      const saved = localStorage.getItem('it_tools_geocercas');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [puntos, setPuntos] = useState([]);
  const [dibujando, setDibujando] = useState(false);
  const [nombre, setNombre] = useState('');
  const [colorSeleccionado, setColorSeleccionado] = useState(COLORES[0]);
  const [tab, setTab] = useState('mapa');

  const guardar = (nuevas) => {
    setGeocercas(nuevas);
    localStorage.setItem('it_tools_geocercas', JSON.stringify(nuevas));
  };

  const agregarPunto = useCallback((latlng) => {
    setPuntos((prev) => [...prev, latlng]);
  }, []);

  const deshacerPunto = () => {
    setPuntos((prev) => prev.slice(0, -1));
  };

  const limpiarPuntos = () => {
    setPuntos([]);
  };

  const iniciarDibujo = () => {
    setPuntos([]);
    setDibujando(true);
  };

  const cancelarDibujo = () => {
    setPuntos([]);
    setDibujando(false);
  };

  const guardarGeocerca = () => {
    if (puntos.length < 3) return;
    const nombreFinal = nombre.trim() || `Geocerca ${geocercas.length + 1}`;
    const nueva = {
      id: generarId(),
      nombre: nombreFinal,
      color: colorSeleccionado,
      tipo: 'polygon',
      coordenadas: [...puntos],
      creadaEn: new Date().toISOString(),
      activa: true,
    };
    guardar([...geocercas, nueva]);
    setPuntos([]);
    setDibujando(false);
    setNombre('');
  };

  const eliminarGeocerca = (id) => {
    guardar(geocercas.filter((g) => g.id !== id));
  };

  const toggleActiva = (id) => {
    guardar(geocercas.map((g) => (g.id === id ? { ...g, activa: !g.activa } : g)));
  };

  const exportarJSON = () => {
    const data = JSON.stringify(geocercas, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geocercas_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportarTXT = () => {
    const lineas = geocercas.map((geo, idx) => {
      let texto = `=== Geocerca #${idx + 1} ===\n`;
      texto += `Nombre:   ${geo.nombre}\n`;
      texto += `Tipo:     Polígono\n`;
      texto += `Color:    ${geo.color}\n`;
      texto += `Creada:   ${new Date(geo.creadaEn).toLocaleString()}\n`;
      texto += `Activa:   ${geo.activa ? 'Sí' : 'No'}\n`;
      texto += `Puntos:   ${geo.coordenadas.length}\n`;
      geo.coordenadas.forEach((c, i) => {
        texto += `  P${String(i + 1).padStart(2, '0')}:   Lat: ${c[0].toFixed(6)}, Lng: ${c[1].toFixed(6)}\n`;
      });
      return texto;
    });
    const contenido = `REPORTE DE GEOCERCAS\nFecha: ${new Date().toLocaleString()}\nTotal: ${geocercas.length} geocerca(s)\n${'='.repeat(40)}\n\n${lineas.join('\n')}`;
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geocercas_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCoords = (geo) => {
    return geo.coordenadas.map((c, i) => `P${i + 1}: [${c[0].toFixed(5)}, ${c[1].toFixed(5)}]`).join(' → ');
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Header */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg p-2">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Creador de Geocercas</h2>
          <p className="text-slate-500 text-xs">Hacé clic en el mapa para poner puntos y crear la cerca</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 flex-shrink-0">
        <button
          onClick={() => setTab('mapa')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            tab === 'mapa' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          🗺️ Mapa
        </button>
        <button
          onClick={() => setTab('lista')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            tab === 'lista' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          📋 Guardadas ({geocercas.length})
        </button>
      </div>

      {/* TAB: MAPA */}
      {tab === 'mapa' && (
        <div className="flex flex-col lg:flex-row flex-1 gap-3 min-h-0">
          {/* Panel de controles */}
          <div className="lg:w-80 flex-shrink-0 bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-200 overflow-y-auto lg:max-h-full">
            {!dibujando ? (
              <button
                onClick={iniciarDibujo}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Iniciar dibujo de geocerca
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                  <p className="text-teal-800 text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                    Dibujando... hacé clic en el mapa
                  </p>
                  <p className="text-teal-600 text-xs mt-1">Cada clic agrega un punto. Mínimo 3 puntos para formar la geocerca.</p>
                </div>

                {/* Nombre */}
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre de la geocerca"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                />

                {/* Color */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-500">Color:</span>
                  {COLORES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColorSeleccionado(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                        colorSeleccionado === c ? 'border-slate-800 scale-110 ring-2 ring-offset-1 ring-slate-300' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                {/* Lista de coordenadas en tiempo real */}
                <div className="bg-white rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                  <div className="sticky top-0 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 border-b">
                    Coordenadas ({puntos.length} punto{puntos.length !== 1 ? 's' : ''})
                  </div>
                  {puntos.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">Hacé clic en el mapa...</p>
                  ) : (
                    puntos.map((p, i) => (
                      <div key={i} className="px-3 py-1.5 text-xs font-mono border-b border-gray-50 flex items-center gap-2 hover:bg-slate-50">
                        <span className="w-5 h-5 rounded-full flex-shrink-0 text-white text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: colorSeleccionado }}>
                          {i + 1}
                        </span>
                        <span className="text-slate-600">
                          Lat: <strong>{p[0].toFixed(6)}</strong>, Lng: <strong>{p[1].toFixed(6)}</strong>
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <button
                    onClick={deshacerPunto}
                    disabled={puntos.length === 0}
                    className="flex-1 bg-amber-100 text-amber-700 hover:bg-amber-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium py-2 rounded-lg transition-all text-xs"
                  >
                    ↩ Deshacer
                  </button>
                  <button
                    onClick={limpiarPuntos}
                    disabled={puntos.length === 0}
                    className="flex-1 bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium py-2 rounded-lg transition-all text-xs"
                  >
                    🗑 Limpiar
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={cancelarDibujo}
                    className="flex-1 bg-slate-200 text-slate-600 hover:bg-slate-300 font-medium py-2.5 rounded-lg transition-all text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={guardarGeocerca}
                    disabled={puntos.length < 3}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all text-sm"
                  >
                    💾 Guardar ({puntos.length}/3+)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mapa */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm flex-1" style={{ minHeight: '400px' }}>
            {dibujando && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-teal-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Modo dibujo — clic para agregar punto #{puntos.length + 1}
              </div>
            )}

            <MapContainer
              center={defaultCenter}
              zoom={14}
              style={{ height: '100%', width: '100%', cursor: dibujando ? 'crosshair' : '' }}
              scrollWheelZoom={true}
            >
              <LayersControl position="topleft">
                <LayersControl.BaseLayer name="Satélite" checked>
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; Esri, Maxar, Earthstar Geographics'
                    maxZoom={19}
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Calles">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                    maxZoom={19}
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Híbrido">
                  <TileLayer
                    url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                    attribution='&copy; Google'
                    maxZoom={20}
                  />
                </LayersControl.BaseLayer>
              </LayersControl>

              <CenterLocationButton />
              <LocationSearch />
              <MapClickHandler dibujando={dibujando} onPuntoAgregado={agregarPunto} />

              {/* Puntos del dibujo actual */}
              {puntos.map((p, i) => (
                <Marker key={`draw-${i}`} position={p} icon={crearIconoPunto(i + 1, colorSeleccionado)}>
                  <Tooltip permanent={false}>
                    Punto {i + 1}: {p[0].toFixed(6)}, {p[1].toFixed(6)}
                  </Tooltip>
                </Marker>
              ))}

              {/* Líneas entre puntos */}
              {puntos.length >= 2 && (
                <Polyline
                  positions={[...puntos, puntos.length >= 3 ? puntos[0] : null].filter(Boolean)}
                  pathOptions={{ color: colorSeleccionado, weight: 3, dashArray: '8 4' }}
                />
              )}

              {/* Preview del polígono cuando hay 3+ puntos */}
              {puntos.length >= 3 && (
                <Polygon
                  positions={puntos}
                  pathOptions={{ color: colorSeleccionado, weight: 2, fillOpacity: 0.15, fillColor: colorSeleccionado, dashArray: '6 3' }}
                />
              )}

              {/* Geocercas guardadas */}
              {geocercas
                .filter((g) => g.activa)
                .map((geo) =>
                  geo.coordenadas?.length >= 3 ? (
                    <Polygon
                      key={geo.id}
                      positions={geo.coordenadas}
                      pathOptions={{ color: geo.color, weight: 3, fillOpacity: 0.15, fillColor: geo.color }}
                    >
                      <Tooltip>{geo.nombre}</Tooltip>
                    </Polygon>
                  ) : null
                )}
            </MapContainer>
          </div>
        </div>
      )}

      {/* TAB: LISTA */}
      {tab === 'lista' && (
        <div className="space-y-3 flex-1 overflow-y-auto">
          {geocercas.length > 0 && (
            <div className="flex justify-end gap-3">
              <button onClick={exportarTXT} className="text-xs text-blue-600 hover:underline font-medium">
                📄 Exportar TXT
              </button>
              <button onClick={exportarJSON} className="text-xs text-teal-600 hover:underline font-medium">
                📥 Exportar JSON
              </button>
            </div>
          )}

          {geocercas.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-sm">No hay geocercas guardadas</p>
              <p className="text-xs mt-1">Ve al tab "Mapa" y dibuja una para comenzar</p>
            </div>
          ) : (
            geocercas.map((geo) => (
              <div
                key={geo.id}
                className={`rounded-xl border p-3 transition-all ${
                  geo.activa ? 'bg-white border-slate-200' : 'bg-gray-50 border-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: geo.color }} />
                  <span className="text-sm font-semibold text-slate-800 truncate flex-1">{geo.nombre}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {geo.coordenadas.length} puntos
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-mono leading-relaxed mb-2 break-all">
                  {formatCoords(geo)}
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleActiva(geo.id)}
                    className={`text-xs px-2 py-1 rounded-lg font-medium transition-colors ${
                      geo.activa
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {geo.activa ? '👁 Visible' : '🚫 Oculta'}
                  </button>
                  <button
                    onClick={() => {
                      const text = JSON.stringify(geo, null, 2);
                      navigator.clipboard.writeText(text);
                    }}
                    className="text-xs px-2 py-1 rounded-lg font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    📋 Copiar
                  </button>
                  <button
                    onClick={() => eliminarGeocerca(geo.id)}
                    className="text-xs px-2 py-1 rounded-lg font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors ml-auto"
                  >
                    🗑 Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
