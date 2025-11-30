# Sistema de Impresión de Etiquetas Zebra

Sistema completo en React para imprimir etiquetas en impresoras Zebra GK420t usando código ZPL y Zebra Browser Print.

## Características Principales

- ✅ Consumo de APIs REST para obtener datos de empleados
- ✅ Tabla interactiva con filtros en tiempo real y ordenamiento
- ✅ Selección múltiple de registros
- ✅ Conversión automática a MAYÚSCULAS de todos los datos
- ✅ Generación dinámica de código ZPL con PDF417
- ✅ Impresión directa en Zebra GK420t mediante Zebra Browser Print
- ✅ Interfaz moderna con Tailwind CSS
- ✅ Control de cantidad de etiquetas por registro
- ✅ Sistema de notificaciones en tiempo real

## Formato de Etiqueta

Tamaño: **5 cm × 2.5 cm** (400 × 200 dots a 203 DPI)

Contenido de la etiqueta:
```
NOMBRE COMPLETO
ID_EMPLEADOS (centrado y destacado)
F- ID_FRENTE    ID_CONTRATISTA    NOMBRE_CONTRATISTA
[Código de barras PDF417]
```

Todos los textos se imprimen en **MAYÚSCULAS**.

## Requisitos Previos

### 1. Node.js
- Node.js 16.x o superior
- npm o yarn

### 2. Zebra Browser Print
**¡IMPORTANTE!** Debe instalar Zebra Browser Print para que la impresión funcione.

#### Instalación en Windows:
1. Descargue desde: https://www.zebra.com/us/en/support-downloads/software/printer-software/zebra-browser-print.html
2. Ejecute el instalador `BrowserPrint-Windows-x64.exe`
3. Siga las instrucciones del instalador
4. Reinicie el navegador después de la instalación

#### Verificación:
- Abra el navegador y vaya a: `http://localhost:9100`
- Debería ver la página de administración de Zebra Browser Print
- Verifique que su impresora Zebra aparezca en la lista

### 3. Impresora Zebra GK420t
- Conectada por USB o red
- Configurada con etiquetas de 5 cm × 2.5 cm
- Drivers instalados correctamente

## Instalación

### 1. Clonar o copiar el proyecto
```bash
cd zafra2025
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
copy .env.example .env

# Editar .env y configurar la URL de tu API
VITE_API_URL=http://tu-servidor.com/api
```

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

## Estructura del Proyecto

```
zafra2025/
├── src/
│   ├── components/
│   │   ├── EmpleadosTable.jsx      # Tabla con filtros y selección
│   │   └── PrintControls.jsx       # Controles de impresión
│   ├── services/
│   │   ├── apiService.js           # Consumo de APIs
│   │   └── zebraPrintService.js    # Integración con Zebra Browser Print
│   ├── utils/
│   │   └── zplGenerator.js         # Generador de código ZPL
│   ├── App.jsx                     # Componente principal
│   ├── main.jsx                    # Punto de entrada
│   └── index.css                   # Estilos globales
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Uso de la Aplicación

### 1. Verificar Conexión
- Al abrir la aplicación, verifique que aparezca "Impresora Conectada" en el header
- Si no aparece, haga clic en "Reconectar"
- Use el botón "Prueba" para imprimir una etiqueta de prueba

### 2. Seleccionar Empleados
- Use la barra de búsqueda para filtrar empleados
- Haga clic en las filas para seleccionar/deseleccionar
- Use el checkbox del header para seleccionar todos

### 3. Configurar Impresión
- Elija la cantidad de etiquetas por empleado (1-100)
- Use los botones +/- o los accesos rápidos (x1, x5, x10)
- Revise el total de etiquetas a imprimir

### 4. Imprimir
- Haga clic en "Imprimir"
- Espere a que se complete la impresión
- Verifique las notificaciones para confirmar el éxito

## Configuración de la API

### Formato de Datos Esperado

La API debe devolver un array de objetos con la siguiente estructura:

```javascript
[
  {
    "nombre": "Santos de Leon Tzunux",
    "id_empleados": "42702",
    "id_frente": "101",
    "id_contratista": "702",
    "nombre_contratista": "Manuel Equila Suy",
    "code_bar": "42702101702"
  }
]
```

### Endpoints

Edite `src/services/apiService.js` para configurar sus endpoints:

```javascript
// Obtener todos los empleados
GET /api/empleados

// Buscar empleados (opcional)
GET /api/empleados/search?nombre=...&id_empleados=...
```

### Usando Mock Data

Por defecto, la aplicación usa datos de prueba. Para cambiar a la API real:

En `src/App.jsx`, línea 23-24:
```javascript
// Cambiar de:
const data = getMockData();

// A:
const data = await fetchEmpleados();
```

## Código ZPL Generado

Ejemplo de código ZPL generado (se puede ver en la consola):

```zpl
^XA
^PW400
^LL200
^PON

~SD15

^FO10,10^A0N,25,25^FDSANTOS DE LEON TZUNUX^FS

^FO140,45^A0N,35,35^FD42702^FS

^FO10,90^A0N,20,20^FDF- 101^FS
^FO100,90^A0N,20,20^FD702^FS
^FO170,90^A0N,20,20^FDMANUEL EQUILA SUY^FS

^FO10,120^B7N,3,3,7,1,N
^FD42702101702^FS

^XZ
```

## Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Genera build optimizado en /dist
npm run preview      # Previsualiza el build de producción
```

## Solución de Problemas

### ❌ "Zebra Browser Print no está instalado"
**Solución:**
1. Descargue e instale Zebra Browser Print
2. Reinicie el navegador
3. Verifique que el servicio esté corriendo en `http://localhost:9100`

### ❌ "No se detectó ninguna impresora Zebra"
**Solución:**
1. Verifique que la impresora esté encendida y conectada
2. Revise que los drivers estén instalados
3. Abra `http://localhost:9100` y verifique que aparezca la impresora
4. Haga clic en "Reconectar" en la aplicación

### ❌ "Error al imprimir"
**Solución:**
1. Verifique que haya etiquetas en la impresora
2. Revise que el tamaño de etiqueta sea correcto (5×2.5 cm)
3. Calibre la impresora si es necesario
4. Revise que no haya errores en la impresora (papel atascado, tapa abierta, etc.)

### ❌ Los datos no se convierten a mayúsculas
**Solución:**
- Los datos ya se convierten automáticamente en `apiService.js` y `zplGenerator.js`
- Si aún aparecen en minúsculas, revise que esté usando las funciones `normalizeData` y `normalizeRecord`

### ❌ El código de barras no se imprime correctamente
**Solución:**
1. Verifique que `code_bar` contenga solo números
2. Ajuste el tamaño del código de barras en `zplGenerator.js`:
   - Línea: `^FO10,120^B7N,3,3,7,1,N`
   - Parámetros: altura, densidad, orientación

## Personalización

### Cambiar Tamaño de Etiqueta

En `src/utils/zplGenerator.js`:
```javascript
// Para 10cm × 5cm (800 × 400 dots)
^PW800
^LL400
```

### Ajustar Posiciones de Campos

Modifique los comandos `^FO` (Field Origin) en `zplGenerator.js`:
```javascript
^FOx,y  // x = posición horizontal, y = posición vertical
```

### Cambiar Tamaño de Fuente

Modifique el comando `^A0N`:
```javascript
^A0N,altura,ancho
```

### Personalizar Estilos

Edite `tailwind.config.js` para cambiar colores, fuentes, etc.

## Backend Alternativo (Node.js)

Si Zebra Browser Print no funciona, puede usar un backend Node.js:

```javascript
// backend/server.js
const express = require('express');
const { print } = require('unix-print');

app.post('/print', (req, res) => {
  const { zpl } = req.body;
  // Enviar ZPL a la impresora
  print(zpl, 'Zebra-GK420t');
  res.json({ success: true });
});
```

## Tecnologías Utilizadas

- **React 18** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Axios** - HTTP Client
- **Zebra Browser Print** - Comunicación con impresora
- **ZPL II** - Lenguaje de programación de Zebra

## Licencia

MIT

## Soporte

Para problemas o preguntas:
1. Revise la sección "Solución de Problemas"
2. Consulte la documentación de Zebra Browser Print
3. Verifique que todos los requisitos estén instalados

## Notas Importantes

⚠️ **TODOS LOS DATOS SE CONVIERTEN A MAYÚSCULAS AUTOMÁTICAMENTE**
- En la tabla de visualización
- En las etiquetas ZPL
- No es necesario formatear manualmente

⚠️ **Zebra Browser Print es obligatorio**
- Sin este software, la impresión NO funcionará
- Debe estar instalado en la computadora que imprime
- Funciona en Windows, Mac y Linux

⚠️ **Configuración de Etiquetas**
- Las etiquetas deben ser de 5 cm × 2.5 cm
- Configure la impresora correctamente
- Calibre la impresora antes del primer uso

---

**¡Sistema listo para producción!** 🎉
