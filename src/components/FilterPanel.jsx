import { useState, useEffect } from 'react';

/**
 * Panel de filtros para empleados
 * Filtra por: Planilla, ID Contratista, ID Frente
 */
const FilterPanel = ({ data, onFilterChange }) => {
  const [selectedPlanilla, setSelectedPlanilla] = useState('');
  const [selectedContratista, setSelectedContratista] = useState('');
  const [selectedFrente, setSelectedFrente] = useState('');

  const [planillas, setPlanillas] = useState([]);
  const [contratistas, setContratistas] = useState([]);
  const [frentes, setFrentes] = useState([]);

  // Extraer valores únicos para los filtros
  useEffect(() => {
    if (!data || data.length === 0) return;

    // Obtener planillas únicas
    const uniquePlanillas = [...new Set(data.map(item => item.id_Planilla).filter(Boolean))].sort();
    setPlanillas(uniquePlanillas);

    // Obtener contratistas únicos
    const uniqueContratistas = [...new Set(data.map(item => ({
      id: item.id_Contratista,
      nombre: item.nombre_contratista
    })).filter(item => item.id))];

    // Eliminar duplicados por ID
    const contratistasMap = new Map();
    uniqueContratistas.forEach(c => {
      if (!contratistasMap.has(c.id)) {
        contratistasMap.set(c.id, c);
      }
    });
    setContratistas([...contratistasMap.values()].sort((a, b) => a.nombre.localeCompare(b.nombre)));

    // Obtener frentes únicos
    const uniqueFrente = [...new Set(data.map(item => item.id_Frente).filter(Boolean))].sort();
    setFrentes(uniqueFrente);
  }, [data]);

  // Aplicar filtros
  useEffect(() => {
    const filters = {
      planilla: selectedPlanilla,
      contratista: selectedContratista,
      frente: selectedFrente
    };
    onFilterChange(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlanilla, selectedContratista, selectedFrente]);

  const handleClearFilters = () => {
    setSelectedPlanilla('');
    setSelectedContratista('');
    setSelectedFrente('');
  };

  const hasActiveFilters = selectedPlanilla || selectedContratista || selectedFrente;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Filtros
        </h2>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Limpiar Filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtro de Planilla */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Planilla
          </label>
          <select
            value={selectedPlanilla}
            onChange={(e) => setSelectedPlanilla(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las planillas</option>
            {planillas.map(planilla => (
              <option key={planilla} value={planilla}>
                Planilla {planilla}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Contratista */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contratista
          </label>
          <select
            value={selectedContratista}
            onChange={(e) => setSelectedContratista(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los contratistas</option>
            {contratistas.map(contratista => (
              <option key={contratista.id} value={contratista.id}>
                {contratista.id} - {contratista.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Frente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frente
          </label>
          <select
            value={selectedFrente}
            onChange={(e) => setSelectedFrente(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los frentes</option>
            {frentes.map(frente => (
              <option key={frente} value={frente}>
                Frente {frente}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Filtros activos:</strong>
            {selectedPlanilla && ` Planilla: ${selectedPlanilla}`}
            {selectedContratista && ` | Contratista: ${selectedContratista}`}
            {selectedFrente && ` | Frente: ${selectedFrente}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
