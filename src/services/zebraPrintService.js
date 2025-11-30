/**
 * Servicio de impresión para Zebra Browser Print
 * Compatible con impresoras Zebra GK420t
 */

class ZebraPrintService {
  constructor() {
    this.device = null;
    this.isConnected = false;
    this.BrowserPrint = window.BrowserPrint || null;
  }

  /**
   * Verifica si Zebra Browser Print está instalado
   */
  isInstalled() {
    return this.BrowserPrint !== null && typeof this.BrowserPrint !== 'undefined';
  }

  /**
   * Obtiene la lista de impresoras Zebra disponibles
   */
  async getAvailablePrinters() {
    return new Promise((resolve, reject) => {
      if (!this.isInstalled()) {
        reject(new Error('Zebra Browser Print no está instalado'));
        return;
      }

      this.BrowserPrint.getDefaultDevice(
        'printer',
        (device) => {
          if (device) {
            this.device = device;
            this.isConnected = true;
            resolve([device]);
          } else {
            reject(new Error('No se encontró ninguna impresora Zebra'));
          }
        },
        (error) => {
          reject(new Error(`Error al buscar impresoras: ${error}`));
        }
      );
    });
  }

  /**
   * Conecta con una impresora específica
   */
  async connect(device) {
    return new Promise((resolve, reject) => {
      if (!this.isInstalled()) {
        reject(new Error('Zebra Browser Print no está instalado'));
        return;
      }

      this.device = device;
      this.isConnected = true;
      resolve(device);
    });
  }

  /**
   * Obtiene el estado de la impresora
   */
  async getStatus() {
    return new Promise((resolve, reject) => {
      if (!this.device) {
        reject(new Error('No hay impresora conectada'));
        return;
      }

      this.device.sendThenRead(
        '~HQES',
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(new Error(`Error al obtener estado: ${error}`));
        }
      );
    });
  }

  /**
   * Imprime código ZPL en la impresora
   */
  async print(zplCode) {
    return new Promise((resolve, reject) => {
      if (!this.device) {
        reject(new Error('No hay impresora conectada'));
        return;
      }

      if (!this.isConnected) {
        reject(new Error('La impresora no está conectada'));
        return;
      }

      this.device.send(
        zplCode,
        () => {
          resolve({ success: true, message: 'Etiqueta enviada a la impresora' });
        },
        (error) => {
          reject(new Error(`Error al imprimir: ${error}`));
        }
      );
    });
  }

  /**
   * Imprime múltiples etiquetas
   */
  async printMultiple(zplCodes) {
    const results = [];

    for (const zpl of zplCodes) {
      try {
        const result = await this.print(zpl);
        results.push(result);
        // Pequeña pausa entre impresiones para evitar saturar la impresora
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Desconecta la impresora
   */
  disconnect() {
    this.device = null;
    this.isConnected = false;
  }

  /**
   * Verifica la conectividad con la impresora
   */
  async testConnection() {
    try {
      const status = await this.getStatus();
      return { success: true, status };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Instancia única del servicio
const zebraPrintService = new ZebraPrintService();

export default zebraPrintService;
