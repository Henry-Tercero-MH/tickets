const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ruta temporal para archivos ZPL
const tempDir = path.join(os.tmpdir(), 'zebra-labels');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

/**
 * Endpoint para imprimir ZPL en Windows
 * Envía el código ZPL directamente a la impresora usando el comando copy
 */
app.post('/api/print', async (req, res) => {
  try {
    const { zpl, printerName } = req.body;

    if (!zpl) {
      return res.status(400).json({ error: 'No se proporcionó código ZPL' });
    }

    // Nombre de la impresora (por defecto Zebra GK420t)
    const printer = printerName || 'ZDesigner GK420t';

    console.log('📄 Imprimiendo en:', printer);
    console.log('📝 Longitud ZPL:', zpl.length, 'caracteres');

    // Crear archivo temporal con el código ZPL
    const tempFile = path.join(tempDir, `label_${Date.now()}.zpl`);
    fs.writeFileSync(tempFile, zpl);
    console.log('💾 Archivo temporal creado:', tempFile);

    // Usar script .bat para impresión rápida
    const batScript = path.join(__dirname, 'print.bat');
    console.log('🔧 Ejecutando script:', batScript);

    const printProcess = spawn('cmd.exe', ['/c', batScript, tempFile, printer], {
      windowsHide: true
    });

    let output = '';
    let errorOutput = '';

    printProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    printProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    printProcess.on('error', (error) => {
      console.error('❌ Error al ejecutar proceso de impresión:', error.message);
      res.status(500).json({
        success: false,
        error: 'Error al ejecutar proceso de impresión',
        details: error.message
      });
    });

    printProcess.on('close', (code) => {
      console.log('🔚 Proceso finalizado con código:', code);
      console.log('📤 Output:', output || '(vacío)');
      console.log('❌ Error output:', errorOutput || '(vacío)');

      // Limpiar archivo temporal
      try {
        fs.unlinkSync(tempFile);
        console.log('🗑️  Archivo temporal eliminado');
      } catch (e) {
        console.error('⚠️  Error al eliminar archivo temporal:', e.message);
      }

      if (code === 0) {
        console.log('✅ Impresión exitosa');
        res.json({
          success: true,
          message: 'Etiqueta enviada a la impresora correctamente',
          output: output
        });
      } else {
        console.log('❌ Impresión fallida con código:', code);
        res.status(500).json({
          success: false,
          error: 'Error al enviar a la impresora',
          details: errorOutput || output || 'No se pudo conectar con la impresora',
          code: code
        });
      }
    });

  } catch (error) {
    console.error('Error en /api/print:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Endpoint para imprimir múltiples etiquetas
 */
app.post('/api/print-batch', async (req, res) => {
  console.log('\n🔵 ============ INICIO /api/print-batch ============');
  console.log('⏰ Timestamp:', new Date().toISOString());

  try {
    const { zplCodes, printerName } = req.body;

    console.log('📊 Datos recibidos:');
    console.log('  - Cantidad de códigos ZPL:', zplCodes?.length);
    console.log('  - Nombre de impresora:', printerName);

    if (!zplCodes || !Array.isArray(zplCodes)) {
      console.error('❌ Error: No se proporcionó array de códigos ZPL');
      return res.status(400).json({ error: 'Se requiere un array de códigos ZPL' });
    }

    const results = [];
    const printer = printerName || 'ZDesigner GK420t';
    console.log('🖨️  Impresora a usar:', printer);

    for (let i = 0; i < zplCodes.length; i++) {
      console.log(`\n📄 Procesando etiqueta ${i + 1}/${zplCodes.length}`);
      const zpl = zplCodes[i];
      const tempFile = path.join(tempDir, `label_batch_${Date.now()}_${i}.zpl`);

      console.log('  📝 Longitud ZPL:', zpl.length, 'caracteres');
      console.log('  💾 Archivo temporal:', tempFile);
      console.log('  📋 Primeros 150 caracteres del ZPL:', zpl.substring(0, 150));

      try {
        fs.writeFileSync(tempFile, zpl);
        console.log('  ✅ Archivo ZPL escrito correctamente');

        const batScript = path.join(__dirname, 'print.bat');
        console.log('  🔧 Ejecutando:', batScript);
        console.log('  🎯 Comando:', `cmd.exe /c ${batScript} "${tempFile}" "${printer}"`);

        await new Promise((resolve, reject) => {
          const printProcess = spawn('cmd.exe', ['/c', batScript, tempFile, printer], {
            windowsHide: false  // Cambiar a false para ver el output del batch
          });

          let stdout = '';
          let stderr = '';

          printProcess.stdout.on('data', (data) => {
            stdout += data.toString();
            console.log('  📤 STDOUT:', data.toString().trim());
          });

          printProcess.stderr.on('data', (data) => {
            stderr += data.toString();
            console.log('  ⚠️  STDERR:', data.toString().trim());
          });

          printProcess.on('close', (code) => {
            console.log(`  🔚 Proceso finalizado con código: ${code}`);
            console.log('  📤 Output completo:', stdout || '(vacío)');
            console.log('  ⚠️  Error output:', stderr || '(vacío)');

            try {
              fs.unlinkSync(tempFile);
              console.log('  🗑️  Archivo temporal eliminado');
            } catch (e) {
              console.error('  ⚠️  Error al eliminar archivo temporal:', e.message);
            }

            if (code === 0) {
              console.log('  ✅ Etiqueta enviada exitosamente');
              results.push({ success: true, index: i });
              resolve();
            } else {
              console.error('  ❌ Error al enviar etiqueta');
              results.push({ success: false, index: i, error: `Código de salida: ${code}` });
              resolve();
            }
          });

          printProcess.on('error', (err) => {
            console.error('  ❌ Error en proceso de impresión:', err.message);
            results.push({ success: false, index: i, error: err.message });
            resolve();
          });
        });

        // Pausa entre impresiones para no saturar
        console.log('  ⏳ Esperando 200ms antes de la siguiente...');
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`  ❌ Excepción en etiqueta ${i + 1}:`, error.message);
        results.push({ success: false, index: i, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;

    console.log('\n📊 RESUMEN FINAL:');
    console.log(`  ✅ Exitosas: ${successCount}`);
    console.log(`  ❌ Fallidas: ${failCount}`);
    console.log(`  📋 Total: ${results.length}`);
    console.log('🔵 ============ FIN /api/print-batch ============\n');

    res.json({
      success: failCount === 0,
      total: results.length,
      successful: successCount,
      failed: failCount,
      results: results
    });

  } catch (error) {
    console.error('Error en /api/print-batch:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Endpoint para obtener la lista de impresoras instaladas
 */
app.get('/api/printers', (req, res) => {
  // Retornar impresora configurada directamente
  // Ya que sabemos que la impresora es "ZDesigner GK420t"
  const configuredPrinter = 'ZDesigner GK420t';

  res.json({
    success: true,
    allPrinters: [configuredPrinter],
    zebraPrinters: [configuredPrinter],
    message: 'Impresora configurada: ' + configuredPrinter
  });
});

/**
 * Endpoint de prueba
 */
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor de impresión funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

/**
 * Mock data de empleados (ejemplo)
 */
app.get('/api/empleados', (req, res) => {
  const empleados = [
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

  res.json(empleados);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🖨️  Servidor de impresión Zebra iniciado`);
  console.log(`🌐 Escuchando en http://localhost:${PORT}`);
  console.log(`📡 Endpoints disponibles:`);
  console.log(`   POST /api/print - Imprimir una etiqueta`);
  console.log(`   POST /api/print-batch - Imprimir múltiples etiquetas`);
  console.log(`   GET  /api/printers - Listar impresoras`);
  console.log(`   GET  /api/empleados - Obtener empleados`);
  console.log(`   GET  /api/test - Probar conexión\n`);
});
