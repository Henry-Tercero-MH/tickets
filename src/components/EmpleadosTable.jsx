import { useState, useMemo } from 'react';

/**
 * Componente de tabla con filtros, ordenamiento y selección múltiple
 * Todos los datos se muestran en MAYÚSCULAS
 */
const EmpleadosTable = ({ data, onSelectionChange, selectedRecords }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filtrar datos basado en el término de búsqueda
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const term = searchTerm.toUpperCase();
    return data.filter(record =>
      record.nombre.includes(term) ||
      record.id_empleados.includes(term) ||
      record.id_frente.includes(term) ||
      record.id_contratista.includes(term) ||
      record.nombre_contratista.includes(term) ||
      record.code_bar.includes(term)
    );
  }, [data, searchTerm]);

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  // Manejar ordenamiento por columna
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Manejar selección de un registro
  const handleSelectRecord = (record) => {
    const isCurrentlySelected = selectedRecords.some(r => r.id_empleados === record.id_empleados);

    if (isCurrentlySelected) {
      // Deseleccionar: remover el registro
      const newSelection = selectedRecords.filter(r => r.id_empleados !== record.id_empleados);
      onSelectionChange(newSelection);
    } else {
      // Seleccionar: agregar el registro
      const newSelection = [...selectedRecords, record];
      onSelectionChange(newSelection);
    }
  };

  // Manejar selección de todos los registros
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectionChange(sortedData);
    } else {
      onSelectionChange([]);
    }
  };

  // Verificar si un registro está seleccionado
  const isSelected = (record) => {
    return selectedRecords.some(r => r.id_empleados === record.id_empleados);
  };

  // Verificar si todos están seleccionados
  const allSelected = sortedData.length > 0 && selectedRecords.length === sortedData.length;

  // Icono de ordenamiento
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <span className="ml-1 text-gray-400">⇅</span>;
    }
    return (
      <span className="ml-1">
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Barra de búsqueda */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre, ID, frente, contratista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-600">
            {selectedRecords.length > 0 && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                {selectedRecords.length} seleccionado{selectedRecords.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('nombre')}
              >
                Nombre <SortIcon columnKey="nombre" />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('id_empleados')}
              >
                ID Empleado <SortIcon columnKey="id_empleados" />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('id_frente')}
              >
                ID Frente <SortIcon columnKey="id_frente" />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('id_contratista')}
              >
                ID Contratista <SortIcon columnKey="id_contratista" />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('nombre_contratista')}
              >
                Nombre Contratista <SortIcon columnKey="nombre_contratista" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Código de Barras
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  No se encontraron registros
                </td>
              </tr>
            ) : (
              sortedData.map((record, index) => (
                <tr
                  key={`${record.id_empleados}-${index}`}
                  className={`hover:bg-gray-50 transition-colors ${
                    isSelected(record) ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected(record)}
                      onChange={() => handleSelectRecord(record)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {record.nombre}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {record.id_empleados}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {record.id_frente}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {record.id_contratista}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {record.nombre_contratista}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">
                    {record.code_bar}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer con información */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Mostrando {sortedData.length} de {data.length} registros
        </div>
      </div>
    </div>
  );
};

export default EmpleadosTable;
