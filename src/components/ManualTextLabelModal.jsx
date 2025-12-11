
import React, { useState } from 'react';

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
    const labelHTML = manualLabels.map((label) => {
      const fontSize = getFontSizeForLabel(label);
      return `
      <div class="label" style="width: 5cm; height: 2.5cm; font-family: Arial, sans-serif; box-sizing: border-box; padding: 0.1cm; margin: 0; page-break-inside: avoid; display: block;">
        <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; text-align: center; font-weight: bold; font-size: ${fontSize}; line-height: 1.1; word-wrap: break-word; overflow-wrap: break-word; hyphens: auto;">
          ${label}
        </div>
      </div>
    `;
    }).join('');

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Etiquetas Manuales - Impresión</title>
          <style>
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
              font-family: Arial, sans-serif;
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
                        <div className="bg-white flex items-center justify-center" style={{width: '100%', aspectRatio: '2/1', fontFamily: 'Arial, sans-serif', border: '2px solid #000', boxSizing: 'border-box', padding: '0.3cm'}}>
                          <div className="text-center font-bold" style={{fontSize: `calc(${fontSize} * 0.4)`, lineHeight: '1.3', wordWrap: 'break-word', overflowWrap: 'break-word'}}>
                            {label}
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
