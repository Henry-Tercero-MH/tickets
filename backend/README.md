# Backend - Servidor de Impresión Zebra

Servidor Node.js que envía código ZPL directamente a impresoras Zebra sin necesidad de Zebra Browser Print.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor
npm start

# Desarrollo con auto-reinicio
npm run dev
```

El servidor se iniciará en: **http://localhost:5000**

## 📡 Endpoints

### GET /api/test
Verifica que el servidor esté funcionando.

**Respuesta:**
```json
{
  "success": true,
  "message": "Servidor de impresión funcionando correctamente",
  "timestamp": "2025-11-29T..."
}
```

### GET /api/printers
Lista todas las impresoras instaladas en el sistema.

**Respuesta:**
```json
{
  "success": true,
  "allPrinters": ["Impresora 1", "Impresora 2", ...],
  "zebraPrinters": ["ZDesigner GK420t", ...]
}
```

### POST /api/print
Imprime una etiqueta ZPL.

**Request:**
```json
{
  "zpl": "^XA^FO50,50^A0N,30,30^FDTEST^FS^XZ",
  "printerName": "ZDesigner GK420t"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Etiqueta enviada a la impresora correctamente"
}
```

### POST /api/print-batch
Imprime múltiples etiquetas.

**Request:**
```json
{
  "zplCodes": [
    "^XA^FO50,50^A0N,30,30^FDTEST 1^FS^XZ",
    "^XA^FO50,50^A0N,30,30^FDTEST 2^FS^XZ"
  ],
  "printerName": "ZDesigner GK420t"
}
```

**Respuesta:**
```json
{
  "success": true,
  "total": 2,
  "successful": 2,
  "failed": 0,
  "results": [
    { "success": true, "index": 0 },
    { "success": true, "index": 1 }
  ]
}
```

### GET /api/empleados
Devuelve datos de ejemplo de empleados (mock data).

## 🔧 Configuración

### Cambiar Nombre de Impresora

Edita `server.js` línea 28:

```javascript
const printer = printerName || 'ZDesigner GK420t';
```

Reemplaza `'ZDesigner GK420t'` con el nombre de tu impresora.

### Cambiar Puerto

Edita `server.js` línea 8:

```javascript
const PORT = 5000;
```

### Encontrar Nombre de Impresora

```bash
# Desde cmd
wmic printer get name

# O usa el endpoint
curl http://localhost:5000/api/printers
```

## 🛠️ Cómo Funciona

1. Recibe código ZPL vía POST
2. Guarda el ZPL en un archivo temporal (.zpl)
3. Usa el comando de Windows `copy` para enviar a la impresora:
   ```cmd
   copy /B archivo.zpl \\localhost\NombreImpresora
   ```
4. Elimina el archivo temporal
5. Retorna resultado al cliente

## 📁 Archivos Temporales

Los archivos ZPL temporales se guardan en:
```
%TEMP%\zebra-labels\
```

Se eliminan automáticamente después de imprimir.

## 🔒 Seguridad

### CORS

El servidor permite solicitudes desde cualquier origen. Para producción, restringe CORS:

```javascript
app.use(cors({
  origin: 'http://localhost:3000'
}));
```

### Límite de Tamaño

El servidor acepta hasta 10MB de datos JSON. Ajusta en `server.js`:

```javascript
app.use(express.json({ limit: '10mb' }));
```

## 🐛 Solución de Problemas

### Error: "Cannot find printer"

- Verifica que la impresora esté encendida
- Verifica que los drivers estén instalados
- Usa `wmic printer get name` para ver el nombre exacto

### Error: "Access denied"

- Ejecuta el servidor con permisos de administrador
- Verifica que la impresora esté compartida

### Puerto en uso

Cambia el puerto en `server.js` o mata el proceso:

```bash
# Ver qué usa el puerto 5000
netstat -ano | findstr :5000

# Matar proceso (reemplaza PID)
taskkill /F /PID [PID]
```

## 📦 Dependencias

- `express` - Framework web
- `cors` - Manejo de CORS
- `nodemon` (dev) - Auto-reinicio en desarrollo

## 🧪 Pruebas

### Probar servidor
```bash
curl http://localhost:5000/api/test
```

### Listar impresoras
```bash
curl http://localhost:5000/api/printers
```

### Imprimir prueba
```bash
curl -X POST http://localhost:5000/api/print \
  -H "Content-Type: application/json" \
  -d "{\"zpl\":\"^XA^FO50,50^A0N,30,30^FDTEST^FS^XZ\"}"
```

## 📝 Logs

Los logs se muestran en la consola:

- ✅ Solicitudes exitosas
- ❌ Errores de impresión
- 📊 Información de proceso

## 🚀 Producción

Para producción, considera:

1. **Usar PM2** para mantener el servidor corriendo:
   ```bash
   npm install -g pm2
   pm2 start server.js --name zebra-print
   pm2 save
   ```

2. **Agregar autenticación**
3. **Configurar HTTPS**
4. **Agregar rate limiting**
5. **Implementar logs persistentes**

## 📖 Más Información

- Documentación principal: [../README.md](../README.md)
- Sin Browser Print: [../SIN-BROWSER-PRINT.md](../SIN-BROWSER-PRINT.md)
- ZPL Programming Guide: https://www.zebra.com/zpl
