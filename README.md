# Sistema de Impresión de Etiquetas

Sistema completo en React para imprimir etiquetas usando el diálogo de impresión del navegador.

## Características Principales

- ✅ Consumo de APIs REST para obtener datos de empleados
- ✅ Tabla interactiva con filtros en tiempo real y ordenamiento
- ✅ Selección múltiple de registros
- ✅ Conversión automática a MAYÚSCULAS de todos los datos
- ✅ Generación de etiquetas con códigos de barras PDF417 renderizados como imágenes
- ✅ Impresión directa mediante el diálogo de impresión del navegador
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

### 2. Navegador Web
- Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- Cualquier impresora conectada al sistema

### 3. Librerías
- Todas las dependencias se instalan automáticamente con npm install

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

### 1. Verificar Sistema
- Al abrir la aplicación, verifique que aparezca "Diálogo de Impresión Listo" en el header
- El sistema usa el diálogo de impresión nativo del navegador

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
- Se abrirá el diálogo de impresión del navegador
- Seleccione su impresora y haga clic en "Imprimir"
- Las etiquetas se imprimirán automáticamente

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

### ❌ "No se puede imprimir"
**Solución:**
1. Verifique que tenga una impresora conectada al sistema
2. Asegúrese de que los drivers de la impresora estén instalados
3. En el diálogo de impresión, seleccione la impresora correcta
4. Verifique que haya papel en la impresora

### ❌ Las etiquetas no se imprimen en el tamaño correcto
**Solución:**
1. En el diálogo de impresión, configure el tamaño de página en "Personalizado" o "Etiquetas"
2. Ajuste las dimensiones a 5 cm × 2.5 cm (2 × 1 pulgadas)
3. Configure los márgenes a 0
4. Use la opción "Ajustar al tamaño de página" si es necesario

### ❌ Los códigos de barras no se imprimen correctamente
**Solución:**
1. Verifique que el navegador soporte la librería bwip-js
2. Asegúrese de que las imágenes se carguen completamente antes de imprimir
3. Si los códigos aparecen borrosos, aumente la resolución de impresión

### ❌ Los datos no se convierten a mayúsculas
**Solución:**
- Los datos ya se convierten automáticamente en `apiService.js`
- Si aún aparecen en minúsculas, revise que esté usando las funciones `normalizeData` y `normalizeRecord`

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
- **react-to-print** - Diálogo de impresión del navegador
- **bwip-js** - Generación de códigos de barras PDF417
- **CSS Print Media** - Estilos de impresión

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
- En las etiquetas impresas
- No es necesario formatear manualmente

⚠️ **EL SISTEMA USA EL DIÁLOGO DE IMPRESIÓN DEL NAVEGADOR**
- Compatible con cualquier impresora conectada al sistema
- Las etiquetas se renderizan como HTML/CSS para impresión
- Configure el tamaño de página en el diálogo de impresión (5cm × 2.5cm)

⚠️ **CÓDIGOS DE BARRAS PDF417**
- Se generan como imágenes usando bwip-js
- Optimizados para etiquetas pequeñas
- Compatibles con lectores estándar

---

**¡Sistema listo para producción!** 🎉
