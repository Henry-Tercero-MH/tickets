# 🖨️ Sistema de Impresión SIN Zebra Browser Print

## ✅ Configuración Completada

El sistema ahora utiliza un **backend Node.js** para enviar el código ZPL directamente a la impresora Zebra, sin necesidad de instalar Zebra Browser Print.

---

## 🚀 Estado Actual

### ✅ Servidores Ejecutándose

1. **Frontend (React):** http://localhost:3000
2. **Backend (Impresión):** http://localhost:5000

Ambos servidores están corriendo en segundo plano.

---

## 📋 Cómo Funciona

### Arquitectura del Sistema

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│   React     │         │   Backend    │         │   Impresora     │
│  Frontend   │ ──────> │   Node.js    │ ──────> │   Zebra GK420t  │
│             │  HTTP   │              │  Windows│                 │
│ localhost   │         │ localhost    │  Driver │                 │
│   :3000     │         │   :5000      │         │                 │
└─────────────┘         └──────────────┘         └─────────────────┘
```

### Flujo de Impresión

1. Usuario selecciona empleados en la interfaz web
2. React genera código ZPL
3. Envía el ZPL al backend vía HTTP POST
4. Backend guarda temporalmente el archivo .zpl
5. Backend usa comando de Windows `copy` para enviar a la impresora
6. La impresora recibe el ZPL e imprime la etiqueta

---

## 🔧 Configuración de la Impresora

### Nombre de la Impresora

El sistema busca automáticamente impresoras Zebra, pero si el nombre de tu impresora es diferente, actualízalo:

**En el archivo:** `backend/server.js`
```javascript
// Línea 28
const printer = printerName || 'ZDesigner GK420t';
```

Cambia `'ZDesigner GK420t'` por el nombre exacto de tu impresora.

### Cómo Encontrar el Nombre de tu Impresora

**Opción 1: Desde el navegador**
- Ve a: http://localhost:5000/api/printers
- Verás una lista de todas las impresoras instaladas

**Opción 2: Desde Windows**
```cmd
wmic printer get name
```

**Opción 3: Panel de Control**
1. Abre "Dispositivos e impresoras"
2. Busca tu impresora Zebra
3. Copia el nombre exacto

---

## 🎯 Uso del Sistema

### 1. Verificar que los Servidores Estén Corriendo

**Frontend:**
- Abre: http://localhost:3000
- Deberías ver la interfaz de la aplicación

**Backend:**
- Abre: http://localhost:5000/api/test
- Deberías ver: `{"success":true,"message":"Servidor de impresión funcionando correctamente",...}`

### 2. Usar la Aplicación

1. **Abre** http://localhost:3000
2. Verás 5 empleados de prueba en la tabla
3. **Busca** empleados usando la barra de búsqueda
4. **Selecciona** uno o varios empleados (checkbox)
5. **Elige** la cantidad de etiquetas (botones +/- o x1, x5, x10)
6. **Click en "Imprimir"**
7. Las etiquetas se enviarán automáticamente a tu impresora

---

## 📡 Endpoints del Backend

### GET /api/test
Prueba que el servidor esté funcionando
```bash
curl http://localhost:5000/api/test
```

### GET /api/printers
Lista todas las impresoras disponibles
```bash
curl http://localhost:5000/api/printers
```

### POST /api/print
Imprime una etiqueta
```bash
curl -X POST http://localhost:5000/api/print \
  -H "Content-Type: application/json" \
  -d "{\"zpl\":\"^XA^FO50,50^A0N,30,30^FDPRUEBA^FS^XZ\",\"printerName\":\"ZDesigner GK420t\"}"
```

### POST /api/print-batch
Imprime múltiples etiquetas
```bash
curl -X POST http://localhost:5000/api/print-batch \
  -H "Content-Type: application/json" \
  -d "{\"zplCodes\":[\"^XA^FO50,50^A0N,30,30^FDPRUEBA 1^FS^XZ\",\"^XA^FO50,50^A0N,30,30^FDPRUEBA 2^FS^XZ\"]}"
```

### GET /api/empleados
Obtiene datos de empleados (mock data)
```bash
curl http://localhost:5000/api/empleados
```

---

## 🛠️ Comandos Útiles

### Iniciar los Servidores

Si necesitas reiniciar los servidores:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm start
```

### Detener los Servidores

Presiona **Ctrl + C** en cada terminal.

---

## 🔍 Solución de Problemas

### ❌ "No se puede conectar con el servidor de impresión"

**Solución:**
1. Verifica que el backend esté corriendo:
   ```bash
   curl http://localhost:5000/api/test
   ```
2. Si no responde, inicia el backend:
   ```bash
   cd backend
   npm start
   ```

### ❌ "No se encontraron impresoras"

**Solución:**
1. Verifica que la impresora esté encendida y conectada
2. Verifica que los drivers estén instalados
3. Lista las impresoras disponibles:
   ```bash
   curl http://localhost:5000/api/printers
   ```
4. Actualiza el nombre de la impresora en `backend/server.js`

### ❌ "Error al imprimir"

**Solución:**
1. Verifica que haya etiquetas en la impresora
2. Verifica que la impresora no tenga errores (tapa abierta, papel atascado)
3. Prueba imprimir una etiqueta de prueba:
   - Click en botón "Prueba" en la app
   - O ve a: http://localhost:3000 y usa el botón

### ❌ La aplicación frontend no carga

**Solución:**
1. Verifica que el servidor frontend esté corriendo:
   ```bash
   curl http://localhost:3000
   ```
2. Si no responde, inicia el frontend:
   ```bash
   npm run dev
   ```
3. Abre tu navegador en http://localhost:3000

---

## 📝 Configuración Adicional

### Cambiar Puerto del Backend

**En:** `backend/server.js`
```javascript
const PORT = 5000; // Cambiar a otro puerto si está ocupado
```

**No olvides actualizar en:** `src/services/backendPrintService.js`
```javascript
const API_URL = 'http://localhost:NUEVO_PUERTO/api';
```

### Agregar Autenticación

Si necesitas proteger el backend:

```javascript
// backend/server.js
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== 'TU_CLAVE_SECRETA') {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
});
```

---

## 🎨 Ventajas de este Método

✅ **No requiere Zebra Browser Print**
✅ **Usa drivers nativos de Windows**
✅ **Funciona con cualquier impresora instalada**
✅ **Más fácil de configurar**
✅ **Mejor control del proceso de impresión**
✅ **Logs detallados en el servidor**

---

## 📊 Información Técnica

### Tecnologías Utilizadas

**Backend:**
- Node.js
- Express.js
- CORS
- Child Process (para comandos de Windows)

**Método de Impresión:**
- Comando Windows: `copy /B archivo.zpl \\localhost\NombreImpresora`
- Archivos temporales en: `%TEMP%\zebra-labels\`

**Comunicación:**
- HTTP REST API
- JSON para intercambio de datos

---

## 📖 Archivos Creados

```
zafra2025/
├── backend/
│   ├── server.js              # Servidor de impresión
│   ├── package.json           # Dependencias del backend
│   └── node_modules/          # (generado)
│
├── src/
│   └── services/
│       └── backendPrintService.js  # Cliente del backend
│
└── SIN-BROWSER-PRINT.md       # Esta documentación
```

---

## ✅ Sistema Listo

**Ambos servidores están corriendo:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

**Para usar:**
1. Abre http://localhost:3000 en tu navegador
2. Selecciona empleados
3. Click en "Imprimir"
4. ¡Listo! Las etiquetas se imprimirán automáticamente

---

**¿Necesitas ayuda?** Consulta la documentación principal en [README.md](README.md)
