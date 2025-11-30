import axios from 'axios';

/**
 * Servicio de impresión usando backend Node.js
 * Alternativa a Zebra Browser Print
 */

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

class BackendPrintService {
  constructor() {
    this.printerName = 'ZDesigner GK420t'; // Nombre por defecto
    this.isConnected = false;
  }

  /**
   * Verifica si el backend está funcionando
   */
  async isInstalled() {
    try {
      const response = await axios.get(`${API_URL}/test`, { timeout: 3000 });
      return response.data.success;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene la lista de impresoras disponibles
   */
  async getAvailablePrinters() {
    try {
      const response = await axios.get(`${API_URL}/printers`);

      if (response.data.success) {
        // Preferir impresoras Zebra
        const zebraPrinters = response.data.zebraPrinters;

        if (zebraPrinters.length > 0) {
          this.printerName = zebraPrinters[0];
          this.isConnected = true;
          return zebraPrinters;
        }

        // Si no hay Zebra, devolver todas
        if (response.data.allPrinters.length > 0) {
          this.printerName = response.data.allPrinters[0];
          this.isConnected = true;
          return response.data.allPrinters;
        }

        throw new Error('No se encontraron impresoras');
      }

      throw new Error('Error al obtener impresoras');
    } catch (error) {
      this.isConnected = false;
      throw new Error(`Error al buscar impresoras: ${error.message}`);
    }
  }

  /**
   * Conecta con una impresora específica
   */
  async connect(printerName) {
    this.printerName = printerName;
    this.isConnected = true;
    return { name: printerName };
  }

  /**
   * Obtiene el estado del servidor
   */
  async getStatus() {
    try {
      const response = await axios.get(`${API_URL}/test`);
      return {
        connected: response.data.success,
        printer: this.printerName,
        timestamp: response.data.timestamp
      };
    } catch (error) {
      throw new Error(`Error al obtener estado: ${error.message}`);
    }
  }

  /**
   * Imprime código ZPL en la impresora
   */
  async print(zplCode) {
    try {
      if (!this.printerName) {
        throw new Error('No hay impresora seleccionada');
      }

      const response = await axios.post(`${API_URL}/print`, {
        zpl: zplCode,
        printerName: this.printerName
      }, {
        timeout: 10000
      });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Etiqueta enviada a la impresora'
        };
      } else {
        throw new Error(response.data.error || 'Error desconocido al imprimir');
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('No se puede conectar con el servidor de impresión. Asegúrese de que esté ejecutando.');
      }
      throw new Error(`Error al imprimir: ${error.message}`);
    }
  }

  /**
   * Imprime múltiples etiquetas
   */
  async printMultiple(zplCodes) {
    console.log('📡 [backendPrintService] printMultiple llamado');
    console.log('📊 [backendPrintService] Cantidad de códigos ZPL:', zplCodes.length);
    console.log('🖨️ [backendPrintService] Impresora seleccionada:', this.printerName);

    try {
      if (!this.printerName) {
        throw new Error('No hay impresora seleccionada');
      }

      console.log('🚀 [backendPrintService] Enviando POST a:', `${API_URL}/print-batch`);
      console.log('📦 [backendPrintService] Payload:', {
        zplCodesCount: zplCodes.length,
        printerName: this.printerName,
        firstZPL: zplCodes[0]?.substring(0, 200)
      });

      const response = await axios.post(`${API_URL}/print-batch`, {
        zplCodes: zplCodes,
        printerName: this.printerName
      }, {
        timeout: 30000 // 30 segundos para lotes grandes
      });

      console.log('📥 [backendPrintService] Respuesta recibida:', response.data);

      if (response.data.success) {
        console.log('✅ [backendPrintService] Impresión exitosa');
        console.log('📊 [backendPrintService] Resultados:', response.data.results);
        return response.data.results.map(r => ({
          success: r.success,
          message: r.success ? 'Etiqueta impresa' : r.error
        }));
      } else {
        console.error('❌ [backendPrintService] Error en respuesta:', response.data.error);
        // Si falló completamente, devolver errores para todas
        return zplCodes.map(() => ({
          success: false,
          message: response.data.error || 'Error al imprimir'
        }));
      }
    } catch (error) {
      console.error('❌ [backendPrintService] Excepción capturada:', error);
      console.error('❌ [backendPrintService] Error code:', error.code);
      console.error('❌ [backendPrintService] Error message:', error.message);

      if (error.code === 'ECONNREFUSED') {
        throw new Error('No se puede conectar con el servidor de impresión');
      }
      throw new Error(`Error al imprimir lote: ${error.message}`);
    }
  }

  /**
   * Desconecta la impresora
   */
  disconnect() {
    this.printerName = null;
    this.isConnected = false;
  }

  /**
   * Verifica la conectividad
   */
  async testConnection() {
    try {
      const status = await this.getStatus();
      return {
        success: true,
        status: status
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Instancia única del servicio
const backendPrintService = new BackendPrintService();

export default backendPrintService;
