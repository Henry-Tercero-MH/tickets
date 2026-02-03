import React, { useState } from 'react';

export default function QuoteFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const formatWithQuotes = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    // Separar por líneas nuevas, comas, o espacios múltiples
    const codes = input
      .split(/[\n,]+/)
      .map(code => code.trim())
      .filter(code => code.length > 0);

    // Agregar comillas simples a cada código y unir con comas
    const formatted = codes.map(code => `'${code}'`).join(',');
    setOutput(formatted);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setCopied(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Formateador de Códigos</h2>
        <p className="text-gray-600">Agrega comillas simples y separa por comas</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Códigos de entrada (uno por línea o separados por coma)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="01-054-0041&#10;01-054-0042&#10;01-054-0043"
            className="w-full h-32 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ejemplo: 01-054-0041, 01-054-0042, 01-054-0043
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={formatWithQuotes}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg"
          >
            Formatear con Comillas
          </button>
          <button
            onClick={clearAll}
            className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            Limpiar
          </button>
        </div>

        {output && (
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Resultado formateado
            </label>
            <div className="relative">
              <textarea
                value={output}
                readOnly
                className="w-full h-32 p-3 border-2 border-green-300 bg-green-50 rounded-lg font-mono text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-all shadow-md"
              >
                {copied ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {output.split(',').length} código(s) formateado(s)
            </p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h3 className="font-semibold text-blue-800 mb-2">Ejemplos de uso:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Entrada: <code className="bg-white px-2 py-1 rounded">01-054-0041</code></li>
          <li>• Salida: <code className="bg-white px-2 py-1 rounded">'01-054-0041'</code></li>
          <li className="mt-2">• Entrada múltiple: <code className="bg-white px-2 py-1 rounded">01-054-0041, 01-054-0042</code></li>
          <li>• Salida: <code className="bg-white px-2 py-1 rounded">'01-054-0041','01-054-0042'</code></li>
        </ul>
      </div>
    </div>
  );
}
