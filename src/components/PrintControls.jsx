import { useState, useEffect } from 'react';
import ManualTextLabelModal from './ManualTextLabelModal';
// import SimpleLabelPreview from './PlantillaEtiqueta';
const PrintControls = ({ selectedRecords, onPrint, isPrinting, onPreview, onManualPreview }) => {
  const [quantity, setQuantity] = useState(1);
  const [printerStatus, setPrinterStatus] = useState(null);
  const [showManual, setShowManual] = useState(false);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 100) {
      setQuantity(value);
    }
  };

  const handlePrintClick = () => {
    if (selectedRecords.length === 0) {
      alert('Por favor seleccione al menos un registro para imprimir');
      return;
    }
    onPrint(quantity);
  };

  const handlePreviewClick = () => {
    if (selectedRecords.length === 0) {
      alert('Por favor seleccione al menos un registro para previsualizar');
      return;
    }
    onPreview(quantity);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Controles de Impresión
      </h2>

      {/* Información de selección */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Registros seleccionados:
          </span>
          <span className="text-lg font-bold text-blue-600">
            {selectedRecords.length}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Cantidad por registro:
          </span>
          <input
            type="number"
            min={1}
            max={100}
            value={quantity}
            onChange={handleQuantityChange}
            className="w-16 border rounded px-2 py-1 text-center"
            disabled={isPrinting}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          onClick={handlePrintClick}
          disabled={isPrinting}
        >
          Imprimir
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:bg-gray-300"
          onClick={handlePreviewClick}
          disabled={isPrinting}
        >
          Vista Previa
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setShowManual(true)}
        >
          Etiqueta Manual
        </button>
      </div>

      {/* Modal para etiqueta manual */}
      <ManualTextLabelModal
        open={showManual}
        onClose={() => setShowManual(false)}
        onPreview={(text) => {
          onManualPreview(text);
        }}
      />
    </div>
  );
}

export default PrintControls;
