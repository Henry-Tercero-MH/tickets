import axios from 'axios';

/**
 * Servicio para consumir APIs REST
 * Todos los datos se convierten a MAYÚSCULAS automáticamente
 */

// URL base de la API EPSA
const API_BASE_URL = 'http://webapi.epsa.com.gt:7011/Api';

/**
 * Normaliza los datos de la API de EPSA convirtiendo todos los valores de texto a MAYÚSCULAS
 * Mapea los campos de la API al formato interno de la aplicación
 * Filtra registros donde id_Contratista sea null
 */
const normalizeData = (data) => {
  if (!data) return data;

  return data
    // Filtrar registros donde id_Contratista sea null o undefined
    .filter(item => {
      const idContratista = item.id_Contratista || item.vid_Contratista;
      return idContratista != null && idContratista !== '';
    })
    .map(item => ({
      // Mapear campos de la API de EPSA al formato interno
      nombre: (item.nombres || item.nombre || "").toUpperCase(),
      id_empleados: String(item.id_Empleado || item.id_empleados || "").toUpperCase(),
      id_frente: String(item.id_Frente || item.id_frente || "").toUpperCase(),
      id_contratista: String(item.id_Contratista || item.vid_Contratista || item.id_contratista || "").toUpperCase(),
      nombre_contratista: (item.nombre_Contratista || item.nombre_contratista || "").toUpperCase(),
      code_bar: String(item.code_Bar || item.code_bar || "").toUpperCase(),
      // Campos adicionales para filtros
      id_Planilla: item.id_Planilla || item.vid_Planilla,
      id_Frente: item.id_Frente,
      id_Contratista: item.id_Contratista
    }));
};

/**
 * Obtiene todos los empleados desde la API de EPSA
 */
export const fetchEmpleados = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/PlaPersonalZebra`);
    console.log('Datos recibidos de API EPSA:', response.data);
    console.log('Total de registros recibidos:', response.data?.length || 0);

    const normalized = normalizeData(response.data);
    console.log('Registros después de filtrar (sin id_Contratista null):', normalized.length);

    return normalized;
  } catch (error) {
    console.error('Error al obtener empleados de EPSA:', error);
    throw new Error('No se pudo conectar con el servidor EPSA. Verifique la conexión.');
  }
};

/**
 * Busca empleados por filtros
 */
export const searchEmpleados = async (filters) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/empleados/search`, {
      params: filters
    });
    return normalizeData(response.data);
  } catch (error) {
    console.error('Error al buscar empleados:', error);
    throw error;
  }
};

/**
 * MOCK DATA - Para desarrollo sin backend
 * Eliminar cuando tengas la API real funcionando
 */
export const getMockData = () => {
  const mockData = [
    {
      nombre: "Santos de Leon Tzunux",
      id_empleados: "42702",
      id_frente: "101",
      id_contratista: "702",
      nombre_contratista: "Manuel Equila Suy",
      code_bar: "42702101702"
    },
    {
      nombre: "Juan Perez Garcia",
      id_empleados: "35481",
      id_frente: "205",
      id_contratista: "803",
      nombre_contratista: "Carlos Martinez Lopez",
      code_bar: "35481205803"
    },
    {
      nombre: "Maria Rodriguez Hernandez",
      id_empleados: "28956",
      id_frente: "102",
      id_contratista: "702",
      nombre_contratista: "Manuel Equila Suy",
      code_bar: "28956102702"
    },
    {
      nombre: "Pedro Gonzalez Ramirez",
      id_empleados: "41203",
      id_frente: "301",
      id_contratista: "904",
      nombre_contratista: "Ana Torres Mendez",
      code_bar: "41203301904"
    },
    {
      nombre: "Luis Alberto Castro",
      id_empleados: "39875",
      id_frente: "104",
      id_contratista: "702",
      nombre_contratista: "Manuel Equila Suy",
      code_bar: "39875104702"
    }
  ];

  return normalizeData(mockData);
};

export default {
  fetchEmpleados,
  searchEmpleados,
  getMockData,
  normalizeData
};
