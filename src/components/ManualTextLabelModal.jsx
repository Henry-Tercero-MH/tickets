
import React, { useState, useEffect } from 'react';
import sparklingFontUrl from '../assets/fonts/SparklingValentine.ttf';

// Iconos de caña de azúcar en SVG (blanco y negro para impresión)
const CANE_ICONS = [
  {
    id: 'none',
    label: 'Sin icono',
    svg: null,
  },
  {
    id: 'cane1',
    label: 'Caña Simple',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M32 58V12"/><path d="M32 12c0-4 3-7 7-7"/><path d="M32 20c-5 0-10-3-12-6"/><path d="M32 28c5 0 10-3 12-6"/><path d="M32 36c-5 0-10-3-12-6"/><path d="M32 44c5 0 10-3 12-6"/><line x1="30" y1="18" x2="34" y2="18" stroke="#000" stroke-width="3"/><line x1="30" y1="26" x2="34" y2="26" stroke="#000" stroke-width="3"/><line x1="30" y1="34" x2="34" y2="34" stroke="#000" stroke-width="3"/><line x1="30" y1="42" x2="34" y2="42" stroke="#000" stroke-width="3"/><line x1="30" y1="50" x2="34" y2="50" stroke="#000" stroke-width="3"/></svg>`,
  },
  {
    id: 'cane2',
    label: 'Caña Doble',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="22" y="10" width="6" height="48" rx="3" fill="#fff" stroke="#000" stroke-width="1.5"/><rect x="36" y="14" width="6" height="44" rx="3" fill="#fff" stroke="#000" stroke-width="1.5"/><line x1="22" y1="20" x2="28" y2="20" stroke="#000" stroke-width="2"/><line x1="22" y1="30" x2="28" y2="30" stroke="#000" stroke-width="2"/><line x1="22" y1="40" x2="28" y2="40" stroke="#000" stroke-width="2"/><line x1="22" y1="50" x2="28" y2="50" stroke="#000" stroke-width="2"/><line x1="36" y1="24" x2="42" y2="24" stroke="#000" stroke-width="2"/><line x1="36" y1="34" x2="42" y2="34" stroke="#000" stroke-width="2"/><line x1="36" y1="44" x2="42" y2="44" stroke="#000" stroke-width="2"/><path d="M25 10c-3-5-8-5-10-3" stroke="#000" stroke-width="1.5" fill="none"/><path d="M25 10c2-5 7-6 10-4" stroke="#000" stroke-width="1.5" fill="none"/><path d="M39 14c-2-5-6-6-8-4" stroke="#000" stroke-width="1.5" fill="none"/><path d="M39 14c3-4 7-4 9-2" stroke="#000" stroke-width="1.5" fill="none"/></svg>`,
  },
  {
    id: 'cane3',
    label: 'Caña con Hojas',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M32 58V8" stroke="#000" stroke-width="4"/><line x1="30" y1="16" x2="34" y2="16" stroke="#000" stroke-width="3"/><line x1="30" y1="26" x2="34" y2="26" stroke="#000" stroke-width="3"/><line x1="30" y1="36" x2="34" y2="36" stroke="#000" stroke-width="3"/><line x1="30" y1="46" x2="34" y2="46" stroke="#000" stroke-width="3"/><path d="M32 8c-8-2-14 2-16 6" stroke="#000" stroke-width="2" fill="none"/><path d="M32 8c8-2 14 2 16 6" stroke="#000" stroke-width="2" fill="none"/><path d="M32 18c-7 0-13 4-15 7" stroke="#000" stroke-width="1.5" fill="none"/><path d="M32 28c7 0 13 4 15 7" stroke="#000" stroke-width="1.5" fill="none"/><path d="M32 38c-7 0-13 4-15 7" stroke="#000" stroke-width="1.5" fill="none"/><path d="M32 48c7 0 12 3 14 6" stroke="#000" stroke-width="1.5" fill="none"/></svg>`,
  },
  {
    id: 'cane4',
    label: 'Manojo de Caña',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 58V16" stroke="#000" stroke-width="3.5"/><path d="M32 58V10" stroke="#000" stroke-width="4"/><path d="M44 58V18" stroke="#000" stroke-width="3.5"/><line x1="18.5" y1="24" x2="21.5" y2="24" stroke="#000" stroke-width="2"/><line x1="18.5" y1="34" x2="21.5" y2="34" stroke="#000" stroke-width="2"/><line x1="18.5" y1="44" x2="21.5" y2="44" stroke="#000" stroke-width="2"/><line x1="30.5" y1="18" x2="33.5" y2="18" stroke="#000" stroke-width="2"/><line x1="30.5" y1="28" x2="33.5" y2="28" stroke="#000" stroke-width="2"/><line x1="30.5" y1="38" x2="33.5" y2="38" stroke="#000" stroke-width="2"/><line x1="30.5" y1="48" x2="33.5" y2="48" stroke="#000" stroke-width="2"/><line x1="42.5" y1="26" x2="45.5" y2="26" stroke="#000" stroke-width="2"/><line x1="42.5" y1="36" x2="45.5" y2="36" stroke="#000" stroke-width="2"/><line x1="42.5" y1="46" x2="45.5" y2="46" stroke="#000" stroke-width="2"/><path d="M20 16c-6-3-10 0-12 3" stroke="#000" stroke-width="1.5"/><path d="M32 10c-5-4-10-2-12 1" stroke="#000" stroke-width="1.5"/><path d="M32 10c5-4 10-2 12 1" stroke="#000" stroke-width="1.5"/><path d="M44 18c6-3 10 0 12 3" stroke="#000" stroke-width="1.5"/></svg>`,
  },
  {
    id: 'cane5',
    label: 'Caña Circular',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="28" fill="#fff" stroke="#000" stroke-width="2"/><path d="M32 52V16" stroke="#000" stroke-width="3.5"/><line x1="30.5" y1="22" x2="33.5" y2="22" stroke="#000" stroke-width="2.5"/><line x1="30.5" y1="30" x2="33.5" y2="30" stroke="#000" stroke-width="2.5"/><line x1="30.5" y1="38" x2="33.5" y2="38" stroke="#000" stroke-width="2.5"/><line x1="30.5" y1="46" x2="33.5" y2="46" stroke="#000" stroke-width="2.5"/><path d="M32 16c-6-2-11 1-13 4" stroke="#000" stroke-width="1.5"/><path d="M32 16c6-2 11 1 13 4" stroke="#000" stroke-width="1.5"/><path d="M32 24c-5 0-9 3-11 5" stroke="#000" stroke-width="1.2"/><path d="M32 32c5 0 9 3 11 5" stroke="#000" stroke-width="1.2"/><path d="M32 40c-5 0-9 3-11 5" stroke="#000" stroke-width="1.2"/></svg>`,
  },
];

// Función para obtener el SVG como data URI para impresión
function svgToDataUri(svgString) {
  if (!svgString) return '';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
}

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
  const [selectedIcon, setSelectedIcon] = useState('none');

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

  const handlePrint = () => {
    const googleFontsLink = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${GOOGLE_FONTS.map(f => f.replace(/ /g, '+')).join('&family=')}&display=swap">`;
    // Inyectar @font-face para Sparkling Valentine en el iframe de impresión
    const sparklingFontFace = `
      @font-face {
        font-family: 'Sparkling Valentine';
        src: url('${sparklingFontUrl}') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    const iconObj = CANE_ICONS.find(i => i.id === selectedIcon);
    const iconDataUri = iconObj?.svg ? svgToDataUri(iconObj.svg) : '';
    const labelHTML = manualLabels.map((label) => {
      const fontSize = getFontSizeForLabel(label);
      const iconHtml = iconDataUri
        ? `<img src="${iconDataUri}" style="width: 0.8cm; height: 0.8cm; object-fit: contain; flex-shrink: 0;" />`
        : '';
      return `
      <div class="label" style="width: 5cm; height: 2.5cm; font-family: ${selectedFont}; box-sizing: border-box; padding: 0.1cm; margin: 0; page-break-inside: avoid; display: block;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.15cm; width: 100%; height: 100%; text-align: center; font-weight: bold; font-size: ${fontSize}; line-height: 1.1; word-wrap: break-word; overflow-wrap: break-word; hyphens: auto;">
          ${iconHtml}
          <span>${label}</span>
        </div>
      </div>
    `;
    }).join('');

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full relative overflow-hidden">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl z-10" onClick={handleClose}>&times;</button>

        <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 text-white">
          <h2 className="text-base font-bold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Etiqueta Manual
          </h2>
          <p className="text-green-100 text-xs mt-1">Generar etiquetas personalizadas sin código de barras</p>
        </div>

        <div className="p-6">
          {/* Selector de icono de caña */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Icono de etiqueta
            </label>
            <div className="flex gap-2 flex-wrap">
              {CANE_ICONS.map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => setSelectedIcon(icon.id)}
                  className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 transition-all duration-200 ${
                    selectedIcon === icon.id
                      ? 'border-green-600 bg-green-50 shadow-md ring-2 ring-green-200'
                      : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                  }`}
                  title={icon.label}
                >
                  {icon.svg ? (
                    <div className="w-9 h-9" dangerouslySetInnerHTML={{ __html: icon.svg }} />
                  ) : (
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  )}
                  <span className="text-[9px] text-gray-500 mt-0.5 leading-tight text-center">{icon.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selector de fuente */}
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

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre o código del equipo
            </label>
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
                        <div className="bg-white flex items-center justify-center" style={{width: '100%', aspectRatio: '2/1', fontFamily: selectedFont, border: '2px solid #000', boxSizing: 'border-box', padding: '0.3cm'}}>
                          <div className="flex items-center justify-center gap-1 w-full h-full">
                            {selectedIcon !== 'none' && CANE_ICONS.find(i => i.id === selectedIcon)?.svg && (
                              <div style={{width: '18%', height: '65%', flexShrink: 0}} dangerouslySetInnerHTML={{ __html: CANE_ICONS.find(i => i.id === selectedIcon).svg }} />
                            )}
                            <div className="text-center font-bold" style={{fontSize: `calc(${fontSize} * 0.4)`, lineHeight: '1.3', wordWrap: 'break-word', overflowWrap: 'break-word'}}>
                              {label}
                            </div>
                          </div>
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
                        <span className="text-sm text-gray-700 font-medium">{label}</span>
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
