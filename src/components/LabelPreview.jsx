import { useRef, useEffect, useState } from 'react';
import bwipjs from 'bwip-js';

/**
 * Componente de vista previa de etiquetas
 * Muestra cómo se verán las etiquetas impresas (5cm x 2.5cm)
 * Soporta múltiples registros
 */
const LabelPreview = ({ record, records, quantity = 1, onClose }) => {
  const printRef = useRef();
  const [barcodeUrls, setBarcodeUrls] = useState({});

  // Determinar qué registros mostrar (si se pasa 'records' usar eso, sino usar 'record')
  const recordsToShow = records || (record ? [record] : []);

  // Generar códigos de barras PDF417 para todos los registros
  useEffect(() => {
    const generateBarcodes = async () => {
      const urls = {};

      for (const rec of recordsToShow) {
        try {
          const canvas = document.createElement('canvas');
          bwipjs.toCanvas(canvas, {
            bcid: 'pdf417',
            text: rec.code_bar,
            scale: 2,
            height:12,          // Reducir altura para dar más espacio al ancho
            width: 10,           // Aumentar ancho de módulo
            columns: 12,        // Más columnas para expandir el ancho
            rows: 4,            // Menos filas para más ancho
            includetext: false,
            padding: 1,
          });
          urls[rec.code_bar] = canvas.toDataURL('image/png');
        } catch (e) {
          console.error('Error generando código de barras para', rec.code_bar, e);
        }
      }

      setBarcodeUrls(urls);
    };

    if (recordsToShow.length > 0) {
      generateBarcodes();
    }
  }, [recordsToShow]);

  // Manejar impresión usando window.print()
  const handlePrint = () => {
    window.print();
  };

  // Renderizar etiquetas para todos los registros
  const renderAllLabels = () => {
    const allLabels = [];

    recordsToShow.forEach((rec, recordIndex) => {
      // Para cada registro, generar 'quantity' copias
      for (let i = 0; i < quantity; i++) {
        allLabels.push(
          <div key={`${rec.id_empleados}-${i}`} className="label-preview-item print-only">
            <div className="label-header">
              <h2 className="label-name">{rec.nombre} - {rec.id_empleados}</h2>
            </div>
            <div className="label-details">
              <span className="label-detail">F- {rec.id_frente}</span>
              <span className="label-detail">{rec.id_contratista}</span>
              <span className="label-detail">{rec.nombre_contratista}</span>
            </div>
            <div className="label-barcode">
              {barcodeUrls[rec.code_bar] ? (
                <img src={barcodeUrls[rec.code_bar]} alt="PDF417" className="barcode-image" />
              ) : (
                <div className="barcode-placeholder">
                  {rec.code_bar}
                </div>
              )}
            </div>
          </div>
        );
      }
    });

    return allLabels;
  };

  const totalLabels = recordsToShow.length * quantity;

  return (
    <>
      {/* Vista en pantalla */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Vista Previa de Etiquetas
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Información:</strong> Esta es una vista previa aproximada.
                Se generarán <strong>{totalLabels} etiqueta(s)</strong> para <strong>{recordsToShow.length} empleado(s)</strong>.
              </p>
              {recordsToShow.length > 1 && (
                <p className="text-xs text-blue-600 mt-2">
                  Mostrando {recordsToShow.length} empleados × {quantity} etiqueta(s) cada uno = {totalLabels} etiquetas totales
                </p>
              )}
            </div>

            {/* Preview de las etiquetas en pantalla */}
            <div className="flex flex-wrap gap-4 justify-center">
              {recordsToShow.slice(0, 6).map((rec, i) => (
                <div
                  key={i}
                  className="label-preview-screen"
                  style={{
                    width: '250px',
                    height: '125px',
                    border: '2px solid #333',
                    padding: '8px',
                    backgroundColor: 'white',
                    fontSize: '8px',
                    fontFamily: 'Arial, sans-serif',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '6px', lineHeight: '1.2', textAlign: 'center' }}>
                    {rec.nombre} - {rec.id_empleados}
                  </div>
                  <div style={{ fontSize: '10px', display: 'flex', gap: '8px', marginBottom: '6px', lineHeight: '1.2', justifyContent: 'center', fontWeight: 'bold' }}>
                    <span>F-{rec.id_frente}</span>
                    <span>{rec.id_contratista}</span>
                    <span>{rec.nombre_contratista}</span>
                  </div>
                  <div style={{
                    textAlign: 'center',
                    marginTop: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    {barcodeUrls[rec.code_bar] ? (
                      <img src={barcodeUrls[rec.code_bar]} alt="PDF417" style={{ maxWidth: '100%', maxHeight: '70px', objectFit: 'contain' }} />
                    ) : (
                      <div style={{
                        fontSize: '6px',
                        border: '1px solid #999',
                        padding: '4px',
                        backgroundColor: '#f0f0f0'
                      }}>
                        PDF417: {rec.code_bar}
                      </div>
                    )}
                  </div>
                  {recordsToShow.length > 6 && i === 5 && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      +{recordsToShow.length - 6} empleado(s) más
                    </div>
                  )}
                  {quantity > 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      backgroundColor: 'rgba(59, 130, 246, 0.9)',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      ×{quantity}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-4 justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Abrir Diálogo de Impresión ({totalLabels} etiquetas)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido para imprimir (oculto en pantalla) */}
      <div ref={printRef} className="print-only">
        <style>{`
          @media print {
            @page {
              size: 5cm 2.5cm;
              margin: 0;
            }

            body {
              margin: 0;
              padding: 0;
            }

            /* Ocultar todo excepto lo que se debe imprimir */
            body * {
              visibility: hidden;
            }

            .print-only,
            .print-only * {
              visibility: visible;
            }

            .print-only {
              position: absolute;
              left: 0;
              top: 0;
            }

            .no-print {
              display: none !important;
            }

            .label-preview-item {
              width: 5cm;
              height: 2.5cm;
              page-break-after: always;
              padding: 0.1cm;
              box-sizing: border-box;
              font-family: Arial, sans-serif;
              background: white;
              position: relative;
            }

            .label-preview-item:last-child {
              page-break-after: auto;
            }

            .label-header {
              margin-bottom: 0.05cm;
            }

            .label-name {
              font-size: 8pt;
              font-weight: bold;
              margin: 0;
              line-height: 1.1;
              text-align: center;
            }

            .label-details {
              font-size: 7pt;
              display: flex;
              gap: 0.2cm;
              margin-bottom: 0.1cm;
              line-height: 1.1;
              justify-content: center;
              font-weight: bold;
            }

            .label-barcode {
              text-align: center;
              margin-top: 0.1cm;
            }

            .barcode-image {
              max-width: 4.8cm;
              height: auto;
              max-height: 1.5cm;
              display: block;
              margin: 0 auto;
            }

            .barcode-placeholder {
              border: 1px solid #000;
              padding: 0.1cm;
              font-size: 6pt;
              background: #f5f5f5;
            }
          }

          @media screen {
            .print-only {
              display: none !important;
            }
          }
        `}</style>
        {renderAllLabels()}
      </div>
    </>
  );
};

export default LabelPreview;
