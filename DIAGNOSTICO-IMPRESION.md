# Diagnóstico de Problemas de Impresión

## Estado Actual

- ✅ Frontend conectado a API real de EPSA
- ✅ Backend corriendo en puerto 5000
- ✅ Filtrado de registros con id_Contratista null
- ✅ Todos los datos en MAYÚSCULAS
- ❌ **Error de impresión: "0 exitosas, 1 fallidas"**

## Cambios Recientes

### 1. Archivo `print.bat` Mejorado
El script ahora intenta 4 métodos diferentes de impresión:
- Método 1: Impresora compartida en red (`\\COMPUTERNAME\NombreImpresora`)
- Método 2: Impresora local directa (`NombreImpresora`)
- Método 3: Puerto LPT1
- Método 4: Puerto USB001

### 2. Logging Mejorado en Backend
El servidor ahora muestra información detallada:
- Nombre de impresora utilizada
- Longitud del código ZPL
- Ruta del archivo temporal
- Código de salida del proceso
- Mensajes de error específicos

## Pasos para Diagnosticar el Problema

### Paso 1: Ejecutar Script de Prueba Manual

Abrir Command Prompt (CMD) como **Administrador** y ejecutar:

```cmd
cd C:\Users\terce\OneDrive\Desktop\zafra2025\backend
test-print.bat
```

Este script intentará los 4 métodos de impresión y te dirá cuál funciona.

### Paso 2: Revisar Logs del Backend

Cuando intentes imprimir desde la aplicación, revisa la consola del backend. Verás mensajes como:

```
📄 Imprimiendo en: ZDesigner GK420t
📝 Longitud ZPL: 123 caracteres
💾 Archivo temporal creado: C:\Users\...\label_xxx.zpl
🔧 Ejecutando script: C:\Users\...\print.bat
🔚 Proceso finalizado con código: 1
❌ Impresión fallida con código: 1
```

El código de salida te indica qué pasó:
- **0**: Éxito
- **1**: Todos los métodos fallaron

### Paso 3: Verificar Nombre Exacto de la Impresora

Ejecutar en CMD:

```cmd
wmic printer get name
```

Debe aparecer exactamente: `ZDesigner GK420t`

Si el nombre es diferente, actualizar en:
- `backend/server.js` (línea 34 y 102)
- `.env` (variable `VITE_PRINTER_NAME`)

### Paso 4: Compartir la Impresora (Si es necesario)

Si el método 1 falla, compartir la impresora:

1. Abrir **Panel de Control** → **Dispositivos e Impresoras**
2. Click derecho en **ZDesigner GK420t**
3. Seleccionar **Propiedades de impresora**
4. Pestaña **Compartir**
5. ✅ Marcar **Compartir esta impresora**
6. Nombre del recurso compartido: `ZDesigner GK420t`
7. Click **Aceptar**

### Paso 5: Verificar Puerto de la Impresora

En **Propiedades de impresora** → **Puertos**:
- Anotar qué puerto está usando (ej: USB001, LPT1, etc.)
- Si es un puerto USB específico, actualizar `print.bat` con ese puerto

## Solución Alternativa: PowerShell

Si todos los métodos anteriores fallan, podemos cambiar a usar PowerShell para imprimir.

Crear archivo `backend/print-powershell.ps1`:

```powershell
param(
    [string]$archivo,
    [string]$impresora
)

try {
    Get-Content -Path $archivo -Raw | Out-Printer -Name $impresora
    exit 0
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
```

Y modificar `backend/server.js` línea 48:

```javascript
// Cambiar de:
const printProcess = spawn('cmd.exe', ['/c', batScript, tempFile, printer], {

// A:
const psScript = path.join(__dirname, 'print-powershell.ps1');
const printProcess = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', psScript, tempFile, printer], {
```

## Verificación Final

Una vez que `test-print.bat` funcione, el sistema completo debería funcionar correctamente.

## Resumen del Sistema

### API EPSA
- **Endpoint**: `http://webapi.epsa.com.gt:7011/Api/PlaPersonalZebra`
- **Campos mapeados**:
  - `nombres` → `nombre`
  - `id_Empleado` → `id_empleados`
  - `id_Frente` → `id_frente`
  - `id_Contratista` → `id_contratista`
  - `nombre_Contratista` → `nombre_contratista`
  - `code_Bar` → `code_bar`

### Filtrado
- Se excluyen registros donde `id_Contratista` sea null o vacío

### Formato de Etiqueta
- **Tamaño**: 5 cm × 2.5 cm (400×200 dots)
- **Código de barras**: PDF417
- **Texto**: Todo en MAYÚSCULAS

### Archivos Modificados Hoy
1. `src/App.jsx` - Cambiado a usar API real
2. `src/services/apiService.js` - Filtrado y mapeo de campos EPSA
3. `backend/server.js` - Logging mejorado
4. `backend/print.bat` - 4 métodos de impresión
5. `backend/test-print.bat` - Script de diagnóstico (NUEVO)
