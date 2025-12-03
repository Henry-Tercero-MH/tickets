import { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import bwipjs from 'bwip-js';
import LabelPrintContent from './LabelPrintContent';
import './LabelPrint.css';

/**
 * Componente de vista previa de etiquetas
 * Muestra cómo se verán las etiquetas impresas (5cm x 2.5cm)
 * Soporta múltiples registros y etiquetas manuales de texto simple
 */
const LabelPreview = ({ record, records, quantity = 1, onClose, manualText, autoPrint = false }) => {
  const printRef = useRef();
  const [barcodeUrls, setBarcodeUrls] = useState({});

  // Si es una etiqueta manual, crear un registro especial
  const isManualLabel = !!manualText;

  // Determinar qué registros mostrar
  const recordsToShow = isManualLabel
    ? [{ isManual: true, manualText: manualText }]
    : (records || (record ? [record] : []));

  // Generar códigos de barras PDF417 para todos los registros (excepto etiquetas manuales)
  useEffect(() => {
    const generateBarcodes = async () => {
      // No generar códigos de barras para etiquetas manuales
      if (isManualLabel) {
        setBarcodeUrls({});
        return;
      }

      const urls = {};

      // 5cm ≈ 189px (1cm ≈ 37.8px)
      const targetWidthPx = 189;
      const targetHeightPx = 100;

      for (const rec of recordsToShow) {
        try {
          const canvas = document.createElement('canvas');
          // Ajustar el tamaño del canvas antes de dibujar
          canvas.width = targetWidthPx;
          canvas.height = targetHeightPx;
          bwipjs.toCanvas(canvas, {
            bcid: 'pdf417',
            text: rec.code_bar,
            scale: 2.2,
            includetext: false,
            padding: 0,
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
  }, [recordsToShow, isManualLabel]);

  // Manejar impresión usando react-to-print
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: `
      @page {
        size: 5cm 2.5cm;
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
      }
    `,
  });

  // Imprimir automáticamente si autoPrint es true
  useEffect(() => {
    if (autoPrint && Object.keys(barcodeUrls).length > 0) {
      // Pequeño delay para asegurar que todo esté renderizado
      const timer = setTimeout(() => {
        handlePrint();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPrint, barcodeUrls]); // handlePrint es estable, no necesita estar en dependencias

  // Preparar datos para imprimir (sin JSX, solo datos)
  const preparePrintLabels = () => {
    const allLabels = [];

    recordsToShow.forEach((rec, recordIndex) => {
      // Para cada registro, generar 'quantity' copias
      for (let i = 0; i < quantity; i++) {
        allLabels.push(rec);
      }
    });

    return allLabels;
  };

  const totalLabels = recordsToShow.length * quantity;

  return (
    <>
      {/* Vista en pantalla - solo mostrar si NO es autoPrint */}
      {!autoPrint && (
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
                    {rec.isManual ? (
                      // Vista previa para etiqueta manual con tamaño dinámico
                      (() => {
                        const length = rec.manualText.length;
                        let fontSize = '24px';

                        // Misma lógica que LabelPrintContent para consistencia
                        if (length <= 4) {
                          fontSize = '34px';
                        } else if (length <= 8) {
                          fontSize = '28px';
                        } else if (length <= 12) {
                          fontSize = '22px';
                        } else if (length <= 18) {
                          fontSize = '18px';
                        } else if (length <= 25) {
                          fontSize = '15px';
                        } else if (length <= 35) {
                          fontSize = '12px';
                        } else if (length <= 50) {
                          fontSize = '10px';
                        } else {
                          fontSize = '8px';
                        }

                        return (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            fontSize: fontSize,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            wordWrap: 'break-word',
                            wordBreak: 'break-word',
                            padding: '5px',
                            border: '3px solid #000',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            lineHeight: '1.1',
                            overflow: 'hidden'
                          }}>
                            {rec.manualText}
                          </div>
                        );
                      })()
                    ) : (
                      // Vista previa normal con código de barras
                      <>
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
                      </>
                    )}
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
                        +{recordsToShow.length - 6} {isManualLabel ? 'etiqueta(s)' : 'empleado(s)'} más
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
      )}

      {/* Contenido para imprimir (oculto en pantalla) - SIN Tailwind */}
      <div style={{ display: 'none' }}>
        <LabelPrintContent
          ref={printRef}
          labels={preparePrintLabels()}
          barcodeUrls={barcodeUrls}
        />
      </div>
    </>
  );
};

export default LabelPreview;
