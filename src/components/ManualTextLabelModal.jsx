import { useState } from 'react';

const ManualTextLabelModal = ({ open, onClose, onPreview }) => {
  const [input, setInput] = useState('');

  if (!open) return null;

  const handlePreview = () => {
    if (input.trim()) {
      onPreview(input.trim());
      setInput(''); // Limpiar el input después de generar la vista previa
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <span className="text-2xl">&times;</span>
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Etiqueta Manual</h2>
        <input
          type="text"
          className="border px-3 py-2 rounded w-full mb-4 text-center text-lg"
          placeholder="Nombre o código del equipo"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handlePreview()}
          autoFocus
        />
        <div className="flex gap-2 justify-center">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            onClick={handlePreview}
            disabled={!input.trim()}
          >
            Generar Etiqueta
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualTextLabelModal;
