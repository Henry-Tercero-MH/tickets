import React from 'react';
import './LabelPrint.css';

/**
 * Componente exclusivo para impresión - SIN Tailwind CSS
 * Solo usa CSS puro para evitar conflictos
 */
const LabelPrintContent = React.forwardRef(({ labels, barcodeUrls }, ref) => {
  // Función inteligente para calcular el tamaño de fuente
  // Considera: área disponible (5cm x 2.5cm con padding y borde)
  // Área útil: ~4.4cm x 2.1cm = ~166px x 79px (a 96dpi)
  const calculateFontSize = (text) => {
    const length = text.length;

    // Estimación: cada carácter ocupa aprox 0.6em de ancho
    // Para una línea: ancho_disponible / (length * 0.6) = tamaño_max
    // Área útil: ~4.4cm = ~166px

    // Textos muy cortos (1-4 caracteres) - una línea
    if (length <= 4) {
      return '40pt'; // ~53px, cabe perfectamente
    }
    // Textos cortos (5-8 caracteres) - una línea
    else if (length <= 8) {
      return '32pt'; // ~43px
    }
    // Textos medianos cortos (9-12 caracteres) - 1-2 líneas
    else if (length <= 12) {
      return '26pt'; // ~35px
    }
    // Textos medianos (13-18 caracteres) - 2 líneas
    else if (length <= 18) {
      return '22pt'; // ~29px
    }
    // Textos largos (19-25 caracteres) - 2-3 líneas
    else if (length <= 25) {
      return '18pt'; // ~24px
    }
    // Textos muy largos (26-35 caracteres) - 3-4 líneas
    else if (length <= 35) {
      return '14pt'; // ~19px
    }
    // Textos extra largos (36-50 caracteres) - 4-5 líneas
    else if (length <= 50) {
      return '12pt'; // ~16px
    }
    // Textos extremos (>50 caracteres)
    else {
      return '10pt'; // ~13px
    }
  };

  return (
    <div ref={ref} className="print-container">
      {labels.map((rec, index) => {
        if (rec.isManual) {
          // Etiqueta manual con tamaño de fuente dinámico
          const fontSize = calculateFontSize(rec.manualText);
          return (
            <div key={`manual-${index}`} className="label-manual-text">
              <span style={{ fontSize: fontSize }}>{rec.manualText}</span>
            </div>
          );
        } else {
          // Etiqueta con código de barras
          return (
            <div key={`${rec.id_empleados}-${index}`} className="label-preview-item">
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
      })}
    </div>
  );
});

LabelPrintContent.displayName = 'LabelPrintContent';

export default LabelPrintContent;
