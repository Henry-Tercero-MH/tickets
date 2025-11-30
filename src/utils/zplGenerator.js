/**
 * Generador de código ZPL para etiquetas Zebra
 * Tamaño: 5 cm x 2.5 cm (aproximadamente 400 x 200 dots a 203 DPI)
 * Formato basado en la imagen de referencia
 */

/**
 * Convierte todos los campos a MAYÚSCULAS
 */
const normalizeRecord = (record) => ({
  nombre: String(record.nombre || "").toUpperCase(),
  id_empleados: String(record.id_empleados || "").toUpperCase(),
  id_frente: String(record.id_frente || "").toUpperCase(),
  id_contratista: String(record.id_contratista || "").toUpperCase(),
  nombre_contratista: String(record.nombre_contratista || "").toUpperCase(),
  code_bar: String(record.code_bar || "").toUpperCase()
});

/**
 * Genera código ZPL para una etiqueta individual
 * Formato actualizado:
 * - Línea 1: NOMBRE COMPLETO - ID_EMPLEADOS
 * - Línea 2: F- ID_FRENTE    ID_CONTRATISTA    NOMBRE_CONTRATISTA
 * - Línea 3: Código de barras PDF417 (más alto)
 */
export const generateZPL = (record) => {
  const r = normalizeRecord(record);

  // Formato ZPL optimizado para Zebra GK420t
  // ^PW = Ancho de impresión (400 dots para 5cm a 203 DPI)
  // ^LL = Largo de etiqueta (200 dots para 2.5cm a 203 DPI)
  // ^B7 = Código de barras PDF417
  // ^FO = Posición (x,y)
  // ^A0N = Font A, orientación normal
  // ^BY = Ancho de barras

  const zpl = `^XA
^PW400
^LL200
^PON
~SD15

^FO10,10^A0N,20,20^FD${r.nombre} - ${r.id_empleados}^FS

^FO10,40^A0N,18,18^FDF-${r.id_frente} ${r.id_contratista} ${r.nombre_contratista}^FS

^FO10,70^BY2,3^B7N,8,8,10,3,N
^FD${r.code_bar}^FS

^XZ`;

  return zpl;
};

/**
 * Genera código ZPL para múltiples copias de una etiqueta
 * Genera código de barras PDF417
 */
export const generateMultipleZPL = (record, quantity = 1) => {
  const r = normalizeRecord(record);

  // Usar el comando ^PQ para especificar la cantidad de copias
  // ^B7 = Código de barras PDF417
  const zpl = `^XA
^PW400
^LL200
^PON
^PQ${quantity}
~SD15

^FO10,10^A0N,20,20^FD${r.nombre} - ${r.id_empleados}^FS

^FO10,40^A0N,18,18^FDF-${r.id_frente} ${r.id_contratista} ${r.nombre_contratista}^FS

^FO10,70^BY2,3^B7N,8,8,10,3,N
^FD${r.code_bar}^FS

^XZ`;

  return zpl;
};

/**
 * Genera múltiples etiquetas para diferentes registros
 */
export const generateBatchZPL = (records, quantityPerRecord = 1) => {
  return records.map(record => generateMultipleZPL(record, quantityPerRecord));
};

/**
 * Comandos ZPL útiles para calibración y pruebas
 */
export const ZPLCommands = {
  // Calibra la impresora
  calibrate: '~JC^XA^JUS^XZ',

  // Imprime configuración de la impresora
  printConfig: '^XA^HH^XZ',

  // Cancela todos los trabajos de impresión
  cancelAll: '~JA',

  // Etiqueta de prueba
  testLabel: `^XA
^PW400
^LL200
^FO50,50^A0N,30,30^FDPRUEBA^FS
^FO50,100^A0N,25,25^FDZEBRA GK420T^FS
^XZ`
};

/**
 * Valida que un registro tenga todos los campos necesarios
 */
export const validateRecord = (record) => {
  const errors = [];

  if (!record.nombre) errors.push('El campo "nombre" es requerido');
  if (!record.id_empleados) errors.push('El campo "id_empleados" es requerido');
  if (!record.id_frente) errors.push('El campo "id_frente" es requerido');
  if (!record.id_contratista) errors.push('El campo "id_contratista" es requerido');
  if (!record.nombre_contratista) errors.push('El campo "nombre_contratista" es requerido');
  if (!record.code_bar) errors.push('El campo "code_bar" es requerido');

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  generateZPL,
  generateMultipleZPL,
  generateBatchZPL,
  validateRecord,
  ZPLCommands
};
