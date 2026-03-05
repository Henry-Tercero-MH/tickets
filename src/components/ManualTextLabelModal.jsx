
import React, { useState, useEffect } from 'react';
import sparklingFontUrl from '../assets/fonts/SparklingValentine.ttf';
import logoPilarUrl from '../imagenes/logoPilar.png';

// Opciones de posición del logo
const LOGO_OPTIONS = [
  { id: 'none', label: 'Sin logo' },
  { id: 'only', label: 'Solo logo' },
  { id: 'start', label: 'Logo al inicio' },
  { id: 'end', label: 'Logo al final' },
];

// Fuentes disponibles
const FONT_OPTIONS = [
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Edwardian Script', value: "'Great Vibes', 'Edwardian Script ITC', cursive" },
  { label: 'Times New Roman', value: "'Times New Roman', serif" },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier New', value: "'Courier New', monospace" },
  { label: 'Impact', value: 'Impact, sans-serif' },
  { label: 'Comic Sans', value: "'Comic Sans MS', cursive" },
  { label: 'Roboto', value: "'Roboto', sans-serif" },
  { label: 'Dancing Script', value: "'Dancing Script', cursive" },
  { label: 'Playfair Display', value: "'Playfair Display', serif" },
  { label: 'Sparkling Valentine', value: "'Sparkling Valentine', cursive" },
];

// Google Fonts que necesitan carga externa
const GOOGLE_FONTS = ['Great Vibes', 'Roboto', 'Dancing Script', 'Playfair Display'];

// Calcula el tamaño de fuente dinámico según la longitud y el máximo permitido
function getFontSizeForLabel(text) {
  const length = text.length;
  if (length <= 6) return '60px';
  if (length <= 15) return '30px';
  if (length <= 25) return '15px';
  if (length <= 35) return '12px';
  if (length <= 50) return '10px';
  return '24px';
}

const ManualTextLabelModal = ({ open, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [manualLabels, setManualLabels] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0].value);
  const [logoPosition, setLogoPosition] = useState('none');
  const [logoBase64, setLogoBase64] = useState('');
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState('');

  // Convertir logo a base64 para el iframe de impresión
  useEffect(() => {
    fetch(logoPilarUrl)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => setLogoBase64(reader.result);
        reader.readAsDataURL(blob);
      })
      .catch(() => {});
  }, []);

  // Cargar Google Fonts
  useEffect(() => {
    const families = GOOGLE_FONTS.map(f => f.replace(/ /g, '+')).join('&family=');
    const linkId = 'google-fonts-labels';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
      document.head.appendChild(link);
    }
  }, []);

  if (!open) return null;

  const handleAddLabel = () => {
    if (logoPosition === 'only') {
      // En modo "Solo logo" se agrega una etiqueta especial
      setManualLabels([...manualLabels, '__LOGO_ONLY__']);
      return;
    }
    if (inputValue.trim() !== '') {
      setManualLabels([...manualLabels, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveLabel = (index) => {
    setManualLabels(manualLabels.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddLabel();
    }
  };

  // Agregar múltiples etiquetas de golpe (una por línea)
  const handleBulkAdd = () => {
    const lines = bulkText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);
    if (lines.length > 0) {
      setManualLabels([...manualLabels, ...lines]);
      setBulkText('');
    }
  };

  // Genera el HTML de una etiqueta para impresión
  const buildLabelHTML = (label) => {
    const isLogoOnly = label === '__LOGO_ONLY__';
    const fontSize = isLogoOnly ? '10px' : getFontSizeForLabel(label);
    const logoImg = logoBase64
      ? `<img src="${logoBase64}" style="height: 1.8cm; width: auto; object-fit: contain; flex-shrink: 0;" />`
      : '';

    if (isLogoOnly) {
      return `
      <div class="label" style="width: 5cm; height: 2.5cm; box-sizing: border-box; padding: 0.1cm; margin: 0; page-break-inside: avoid; display: block;">
        <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
          ${logoImg}
        </div>
      </div>`;
    }

    const textSpan = `<span style="font-weight: bold; font-size: ${fontSize}; line-height: 1.1; word-wrap: break-word; overflow-wrap: break-word; text-align: center;">${label}</span>`;
    const logoSmall = logoBase64
      ? `<img src="${logoBase64}" style="height: 0.9cm; width: auto; object-fit: contain; flex-shrink: 0;" />`
      : '';

    let innerContent = textSpan;
    if (logoPosition === 'start') {
      innerContent = `${logoSmall}${textSpan}`;
    } else if (logoPosition === 'end') {
      innerContent = `${textSpan}${logoSmall}`;
    }

    return `
    <div class="label" style="width: 5cm; height: 2.5cm; font-family: ${selectedFont}; box-sizing: border-box; padding: 0.1cm; margin: 0; page-break-inside: avoid; display: block;">
      <div style="display: flex; align-items: center; justify-content: center; gap: 0.15cm; width: 100%; height: 100%; hyphens: auto;">
        ${innerContent}
      </div>
    </div>`;
  };

  const handlePrint = () => {
    const googleFontsLink = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${GOOGLE_FONTS.map(f => f.replace(/ /g, '+')).join('&family=')}&display=swap">`;
    const sparklingFontFace = `
      @font-face {
        font-family: 'Sparkling Valentine';
        src: url('${sparklingFontUrl}') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    const labelHTML = manualLabels.map(buildLabelHTML).join('');

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Etiquetas Manuales - Impresión</title>
          ${googleFontsLink}
          <style>
            ${sparklingFontFace}
            @media print {
              @page {
                size: 5cm 2.5cm;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
              }
              .label {
                page-break-inside: avoid;
                page-break-after: always;
              }
            }
            body {
              margin: 0;
              padding: 0;
              font-family: ${selectedFont};
            }
            .labels-container {
              display: block;
            }
          </style>
        </head>
        <body>
          <div class="labels-container">
            ${labelHTML}
          </div>
        </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(printContent);
    doc.close();

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    };
  };

  const handleClose = () => {
    setManualLabels([]);
    setInputValue('');
    setShowPreview(false);
    onClose();
  };

  // Renderiza la vista previa de una etiqueta
  const renderPreviewLabel = (label, fontSize) => {
    const isLogoOnly = label === '__LOGO_ONLY__';

    if (isLogoOnly) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <img src={logoPilarUrl} alt="Logo" style={{ height: '70%', width: 'auto', objectFit: 'contain' }} />
        </div>
      );
    }

    const logoImg = (
      <img src={logoPilarUrl} alt="Logo" style={{ height: '55%', width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
    );

    return (
      <div className="flex items-center justify-center gap-1 w-full h-full">
        {logoPosition === 'start' && logoImg}
        <div className="text-center font-bold" style={{ fontSize: `calc(${fontSize} * 0.4)`, lineHeight: '1.3', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
          {label}
        </div>
        {logoPosition === 'end' && logoImg}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full relative overflow-hidden">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl z-10" onClick={handleClose}>&times;</button>

        <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 text-white">
          <h2 className="text-base font-bold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Etiqueta Handbook
          </h2>
          <p className="text-green-100 text-xs mt-1">Generar etiquetas personalizadas sin código de barras</p>
        </div>

        <div className="p-6">
          {/* Selector de posición del logo */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Logo en etiqueta
            </label>
            <div className="flex gap-2 flex-wrap items-center">
              {LOGO_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setLogoPosition(opt.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all duration-200 ${
                    logoPosition === opt.id
                      ? 'bg-green-600 text-white border-green-600 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  {/* Mini preview del layout */}
                  <span className="flex items-center gap-0.5 text-[10px]">
                    {opt.id === 'none' && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    )}
                    {opt.id === 'only' && (
                      <img src={logoPilarUrl} alt="" className="h-5 w-auto" />
                    )}
                    {opt.id === 'start' && (
                      <>
                        <img src={logoPilarUrl} alt="" className="h-4 w-auto" />
                        <span className="font-mono">ABC</span>
                      </>
                    )}
                    {opt.id === 'end' && (
                      <>
                        <span className="font-mono">ABC</span>
                        <img src={logoPilarUrl} alt="" className="h-4 w-auto" />
                      </>
                    )}
                  </span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de fuente (oculto en modo "Solo logo") */}
          {logoPosition !== 'only' && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fuente
              </label>
              <div className="flex gap-2 flex-wrap">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => setSelectedFont(font.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all duration-200 ${
                      selectedFont === font.value
                        ? 'bg-green-600 text-white border-green-600 shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:bg-green-50'
                    }`}
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            {logoPosition === 'only' ? (
              /* Modo Solo Logo */
              <div>
                <p className="text-sm text-gray-600 mb-3">Se imprimirá únicamente el logo en cada etiqueta.</p>
                <button
                  onClick={handleAddLabel}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar etiqueta con logo
                </button>
              </div>
            ) : (
              /* Modo con texto */
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {bulkMode ? 'Agregar múltiples etiquetas' : 'Nombre o código del equipo'}
                  </label>
                  <button
                    onClick={() => setBulkMode(!bulkMode)}
                    className="text-xs font-medium flex items-center gap-1 px-2 py-1 rounded-md border transition-colors"
                    style={{
                      color: bulkMode ? '#047857' : '#6B7280',
                      borderColor: bulkMode ? '#059669' : '#D1D5DB',
                      backgroundColor: bulkMode ? '#ECFDF5' : '#F9FAFB',
                    }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    {bulkMode ? 'Individual' : 'Masivo'}
                  </button>
                </div>

                {bulkMode ? (
                  /* Modo masivo: textarea */
                  <div>
                    <textarea
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      placeholder={"Escriba una etiqueta por línea, por ejemplo:\nPC-CONTABILIDAD\nLAPTOP-RRHH\nSERVIDOR-01\nIMPRESORA-PISO2"}
                      rows={5}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y text-sm font-mono"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {bulkText.split('\n').filter(l => l.trim()).length} etiqueta(s) detectadas
                      </span>
                      <button
                        onClick={handleBulkAdd}
                        disabled={!bulkText.trim()}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Agregar todas
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Modo individual */
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ingrese nombre o código del equipo..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddLabel}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all duration-200 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Agregar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {manualLabels.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Etiquetas agregadas ({manualLabels.length})
                </h3>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {showPreview ? 'Ocultar' : 'Ver'} Vista Previa
                </button>
              </div>

              {showPreview ? (
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-200">
                  <div className="grid grid-cols-3 gap-3">
                    {manualLabels.map((label, index) => {
                      const fontSize = getFontSizeForLabel(label);
                      return (
                      <div key={index} className="relative">
                        <div className="bg-white flex items-center justify-center" style={{width: '100%', aspectRatio: '2/1', fontFamily: selectedFont, border: '2px solid #000', boxSizing: 'border-box', padding: '0.2cm'}}>
                          {renderPreviewLabel(label, fontSize)}
                        </div>
                        <button
                          onClick={() => handleRemoveLabel(index)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                        >
                          ×
                        </button>
                      </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto border border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {manualLabels.map((label, index) => (
                      <div key={index} className="bg-white border border-gray-300 rounded-md px-3 py-2 flex items-center gap-2 shadow-sm">
                        <span className="text-sm text-gray-700 font-medium">
                          {label === '__LOGO_ONLY__' ? '🖼️ Solo logo' : label}
                        </span>
                        <button
                          onClick={() => handleRemoveLabel(index)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{manualLabels.length}</span> etiqueta(s) lista(s) para imprimir
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePrint}
                disabled={manualLabels.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimir ({manualLabels.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualTextLabelModal;
