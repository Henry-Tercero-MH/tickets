import { useState } from 'react';

/**
 * Componente de controles de impresión
 * Permite seleccionar cantidad de etiquetas y ejecutar impresión
 */
const PrintControls = ({ selectedRecords, onPrint, isPrinting, onPreview }) => {
  const [quantity, setQuantity] = useState(1);
  const [printerStatus, setPrinterStatus] = useState(null);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 100) {
      setQuantity(value);
    }
  };

  const handlePrint = () => {
    if (selectedRecords.length === 0) {
      alert('Por favor seleccione al menos un registro para imprimir');
      return;
    }

    if (quantity < 1) {
      alert('La cantidad debe ser al menos 1');
      return;
    }

    onPrint(quantity);
  };

  const totalLabels = selectedRecords.length * quantity;

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
            Etiquetas por registro:
          </span>
          <span className="text-lg font-bold text-blue-600">
            {quantity}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-blue-200 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-800">
            Total de etiquetas:
          </span>
          <span className="text-2xl font-bold text-blue-600">
            {totalLabels}
          </span>
        </div>
      </div>

      {/* Control de cantidad */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cantidad de etiquetas por registro
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-bold"
            disabled={quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max="100"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-24 px-4 py-2 border border-gray-300 rounded-lg text-center text-lg font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => setQuantity(Math.min(100, quantity + 1))}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-bold"
            disabled={quantity >= 100}
          >
            +
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Máximo 100 etiquetas por registro
        </p>
      </div>

      {/* Botones de acción */}
      <div className="space-y-3">
        {/* Botón de Vista Previa */}
        <button
          onClick={() => onPreview && onPreview(quantity)}
          disabled={selectedRecords.length === 0}
          className={`w-full px-6 py-3 rounded-lg font-bold text-white transition-all ${
            selectedRecords.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
          }`}
        >
          Vista Previa (Ctrl+P)
        </button>

        {/* Botón de Imprimir Zebra */}
        <button
          onClick={handlePrint}
          disabled={selectedRecords.length === 0 || isPrinting}
          className={`w-full px-6 py-3 rounded-lg font-bold text-white transition-all ${
            selectedRecords.length === 0 || isPrinting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
          }`}
        >
          {isPrinting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Imprimiendo...
            </span>
          ) : (
            `Imprimir en Zebra (${totalLabels} etiqueta${totalLabels !== 1 ? 's' : ''})`
          )}
        </button>

        {/* Botones de acceso rápido */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setQuantity(1)}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            x1
          </button>
          <button
            onClick={() => setQuantity(5)}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            x5
          </button>
          <button
            onClick={() => setQuantity(10)}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            x10
          </button>
        </div>
      </div>

      {/* Estado de la impresora */}
      {printerStatus && (
        <div className={`mt-4 p-3 rounded-lg ${
          printerStatus.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`text-sm ${
            printerStatus.success ? 'text-green-800' : 'text-red-800'
          }`}>
            {printerStatus.message}
          </p>
        </div>
      )}

      {/* Advertencias */}
      {selectedRecords.length === 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Seleccione al menos un registro de la tabla para imprimir
          </p>
        </div>
      )}
    </div>
  );
};

export default PrintControls;
