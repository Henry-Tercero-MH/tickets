import { useState } from 'react';
import LabelPreview from './LabelPreview';

const LabelTemplateManual = () => {
  const [input, setInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Estructura mínima para LabelPreview
  const record = input.trim()
    ? {
        nombre: input,
        id_empleados: '',
        id_frente: '',
        id_contratista: '',
        nombre_contratista: '',
        code_bar: input,
      }
    : null;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Generar Etiqueta Manual</h2>
      <input
        type="text"
        className="border px-3 py-2 rounded w-full mb-4"
        placeholder="Nombre o código del equipo"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => setShowPreview(true)}
        disabled={!input.trim()}
      >
        Generar etiqueta
      </button>
      {showPreview && record && (
        <LabelPreview
          record={record}
          quantity={1}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default LabelTemplateManual;
