import { useState, useEffect, useCallback } from 'react';
import EmpleadosTable from './components/EmpleadosTable';
import PrintControls from './components/PrintControls';
import LabelPreview from './components/LabelPreview';
import FilterPanel from './components/FilterPanel';
import { fetchEmpleados } from './services/apiService';
import { validateRecord } from './utils/zplGenerator';

function App() {
  // Para navegación simple entre páginas
  const [page, setPage] = useState('main');
  const [empleados, setEmpleados] = useState([]);
  const [empleadosOriginales, setEmpleadosOriginales] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printerConnected, setPrinterConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
    checkPrinterConnection();
  }, []);

  // Cargar datos desde la API real de EPSA
  const loadData = async () => {
    try {
      setLoading(true);
      // Llamar a la API real de EPSA
      const data = await fetchEmpleados();
      setEmpleados(data);
      setEmpleadosOriginales(data);
    } catch (error) {
      showNotification('Error al cargar datos: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de filtros
  const handleFilterChange = useCallback((filters) => {
    let filtered = [...empleadosOriginales];

    // Filtrar por planilla
    if (filters.planilla) {
      filtered = filtered.filter(emp => emp.id_Planilla === parseInt(filters.planilla));
    }

    // Filtrar por contratista
    if (filters.contratista) {
      filtered = filtered.filter(emp => emp.id_Contratista === parseInt(filters.contratista));
    }

    // Filtrar por frente
    if (filters.frente) {
      filtered = filtered.filter(emp => emp.id_Frente === parseInt(filters.frente));
    }

    setEmpleados(filtered);
    setSelectedRecords([]); // Limpiar selección al filtrar
  }, [empleadosOriginales]);

  // Verificar conexión (simplificada - ya no necesitamos backend)
  const checkPrinterConnection = async () => {
    // Con el diálogo del sistema, siempre está "conectado"
    setPrinterConnected(true);
    showNotification('Sistema de impresión listo (diálogo del navegador)', 'success');
  };

  // Mostrar notificaciones
  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);

    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Manejar impresión
  const handlePrint = async (quantity) => {
    console.log('🖨️ [handlePrint] Iniciando impresión con diálogo del sistema...');
    console.log('📊 [handlePrint] Registros seleccionados:', selectedRecords.length);
    console.log('🔢 [handlePrint] Cantidad por registro:', quantity);

    if (selectedRecords.length === 0) {
      showNotification('Seleccione al menos un registro para imprimir', 'warning');
      return;
    }

    setIsPrinting(true);

    try {
      // Validar todos los registros
      console.log('✅ [handlePrint] Validando registros...');
      for (const record of selectedRecords) {
        const validation = validateRecord(record);
        if (!validation.isValid) {
          throw new Error(`Registro inválido: ${validation.errors.join(', ')}`);
        }
      }
      console.log('✅ [handlePrint] Todos los registros son válidos');

      // Mostrar el diálogo de impresión usando LabelPreview con autoPrint
      setPreviewData({
        records: selectedRecords,
        quantity: quantity,
        autoPrint: true
      });
      setShowPreview(true);

      showNotification(`Abriendo diálogo de impresión para ${selectedRecords.length * quantity} etiquetas...`, 'info');

      // Limpiar selección después de un breve delay para permitir que se abra el diálogo
      setTimeout(() => {
        setSelectedRecords([]);
        setIsPrinting(false);
      }, 1000);

    } catch (error) {
      console.error('❌ [handlePrint] Error:', error);
      showNotification('Error al preparar impresión: ' + error.message, 'error');
      setIsPrinting(false);
    }
  };

  // Manejar prueba de impresión (simplificada)
  const handleTestPrint = async () => {
    showNotification('El sistema usa el diálogo de impresión del navegador. Haz clic en "Imprimir" para abrir el diálogo.', 'info');
  };

  // Manejar vista previa
  const handlePreview = (quantity) => {
    if (selectedRecords.length === 0) {
      showNotification('Seleccione al menos un registro para previsualizar', 'warning');
      return;
    }

    // Mostrar vista previa de TODOS los registros seleccionados
    setPreviewData({
      records: selectedRecords,  // Pasar todos los registros seleccionados
      quantity: quantity
    });
    setShowPreview(true);
  };

  // Manejar vista previa de etiquetas manuales
  const handleManualPreview = (text) => {
    setPreviewData({
      manualText: text,
      quantity: 1
    });
    setShowPreview(true);
  };

  // Componente de notificación
  const Notification = ({ notification }) => {
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    };

    return (
      <div className={`${colors[notification.type]} text-white px-6 py-3 rounded-lg shadow-lg mb-2 animate-slide-in`}>
        <p className="text-sm font-medium">{notification.message}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
    

      {/* Vista Previa Modal */}
      {showPreview && previewData && (
        <LabelPreview
          records={previewData.records}
          manualText={previewData.manualText}
          quantity={previewData.quantity}
          autoPrint={previewData.autoPrint}
          onClose={() => setShowPreview(false)}
        />
      )}


      {/* Header */}
      {page === 'main' && (
        <header className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  EPSA-TICKETS
                </h1>
                <p className="mt-1 text-sm text-blue-100">
                  Impresora de Etiquetas - Diálogo del Sistema
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* Estado del sistema de impresión */}
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-green-400`} />
                  <span className="text-sm text-white">
                    Diálogo de Impresión Listo
                  </span>
                </div>
                <button
                  onClick={checkPrinterConnection}
                  className="px-4 py-2 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium shadow-md"
                >
                  Verificar
                </button>
              </div>
            </div>
          </div>
        </header>
      )}


      {/* Notificaciones */}
      <div className="fixed top-4 right-4 z-50 max-w-md">
        {notifications.map(notification => (
          <Notification key={notification.id} notification={notification} />
        ))}
      </div>


      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Cargando datos...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Panel de Filtros */}
            <FilterPanel
              data={empleadosOriginales}
              onFilterChange={handleFilterChange}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tabla de empleados */}
              <div className="lg:col-span-2">
                <EmpleadosTable
                  data={empleados}
                  selectedRecords={selectedRecords}
                  onSelectionChange={setSelectedRecords}
                />
              </div>

              {/* Controles de impresión */}
              <div className="lg:col-span-1">
                <PrintControls
                  selectedRecords={selectedRecords}
                  onPrint={handlePrint}
                  onPreview={handlePreview}
                  onManualPreview={handleManualPreview}
                  isPrinting={isPrinting}
                />

                {/* Información adicional */}
                <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    Instrucciones
                  </h3>
                  <ol className="text-sm text-gray-600 space-y-2">
                    <li className="flex gap-2">
                      <span className="font-bold text-blue-600">1.</span>
                      <span>Seleccione uno o más empleados de la tabla</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-blue-600">2.</span>
                      <span>Elija la cantidad de etiquetas por empleado</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-blue-600">3.</span>
                      <span>Presione el botón "Imprimir"</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-blue-600">4.</span>
                      <span>Las etiquetas se imprimirán automáticamente</span>
                    </li>
                  </ol>
                </div>

                {/* Información del sistema */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-bold text-gray-700 mb-2">
                    Información del Sistema
                  </h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Total empleados:</span>
                      <span className="font-medium">{empleados.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Seleccionados:</span>
                      <span className="font-medium">{selectedRecords.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Método de impresión:</span>
                      <span className="font-medium text-green-600">Diálogo del Navegador</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-600">
            Sistema de Impresión de Etiquetas Zebra - Todos los datos en MAYÚSCULAS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
