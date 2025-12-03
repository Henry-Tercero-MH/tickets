# Guía para Replicar el Sistema de Impresión de Etiquetas Zebra

Esta guía proporciona las instrucciones completas para integrar el sistema de impresión de etiquetas en otro proyecto React. El sistema es 100% frontend, no requiere backend propio y utiliza el diálogo de impresión nativo del navegador.

## 📋 Descripción del Sistema

Sistema web para imprimir etiquetas de empleados con códigos de barras PDF417. Incluye:
- Tabla interactiva con filtros de empleados
- Vista previa de etiquetas
- Impresión vía diálogo del navegador
- Generación automática de códigos de barras

## 🔧 Requisitos Técnicos

### Dependencias Principales
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "axios": "^1.6.0",
  "bwip-js": "^4.8.0",
  "react-to-print": "^3.2.0",
  "tailwindcss": "^3.3.6",
  "vite": "^5.0.0"
}
```

### Navegador
- Cualquier navegador moderno con soporte para impresión
- Recomendado: Chrome, Firefox, Edge

### Impresora
- Cualquier impresora conectada al sistema
- Para etiquetas: configurar tamaño 5cm × 2.5cm (2" × 1")

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias
```bash
npm install react react-dom axios bwip-js react-to-print tailwindcss autoprefixer postcss vite @vitejs/plugin-react
```

### 2. Configurar Tailwind CSS
Crear `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Crear `postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 3. Configurar Vite
Crear `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

## 📊 Datos y APIs Requeridos

### API Externa Requerida
**Endpoint:** `http://webapi.epsa.com.gt:7011/Api/PlaPersonalZebra`

**Método:** GET

**Respuesta esperada:** Array de objetos JSON

### Estructura de Datos de Empleados
```javascript
[
  {
    "nombres": "SANTOS DE LEON TZUNUX",           // Nombre completo
    "id_Empleado": "42702",                       // ID del empleado
    "id_Frente": "101",                          // ID del frente de trabajo
    "id_Contratista": "702",                     // ID del contratista
    "nombre_Contratista": "MANUEL EQUILA SUY",   // Nombre del contratista
    "code_Bar": "42702101702",                   // Código de barras (ID_EMPLEADO + ID_FRENTE + ID_CONTRATISTA)
    "id_Planilla": 1                             // (Opcional) ID de planilla para filtros
  }
]
```

**Notas importantes:**
- Todos los campos de texto se convierten automáticamente a MAYÚSCULAS
- Se filtran automáticamente registros donde `id_Contratista` sea null
- El `code_Bar` debe ser único por empleado

### Servicio API (apiService.js)
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://webapi.epsa.com.gt:7011/Api';

export const fetchEmpleados = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/PlaPersonalZebra`);
    return normalizeData(response.data);
  } catch (error) {
    throw new Error('Error al conectar con la API');
  }
};

const normalizeData = (data) => {
  return data
    .filter(item => item.id_Contratista != null)
    .map(item => ({
      nombre: (item.nombres || "").toUpperCase(),
      id_empleados: String(item.id_Empleado || "").toUpperCase(),
      id_frente: String(item.id_Frente || "").toUpperCase(),
      id_contratista: String(item.id_Contratista || "").toUpperCase(),
      nombre_contratista: (item.nombre_Contratista || "").toUpperCase(),
      code_bar: String(item.code_Bar || "").toUpperCase(),
      id_Planilla: item.id_Planilla
    }));
};
```

## 🏗️ Estructura de Archivos a Copiar

### Archivos Principales
```
src/
├── components/
│   ├── EmpleadosTable.jsx      # Tabla con filtros y selección
│   ├── FilterPanel.jsx         # Panel de filtros
│   ├── LabelPreview.jsx        # Vista previa de etiquetas
│   ├── LabelPrintContent.jsx   # Contenido para impresión
│   ├── PrintControls.jsx       # Controles de impresión
│   └── ManualTextLabelModal.jsx # Modal para etiquetas manuales
├── services/
│   └── apiService.js           # Servicio para consumir API
├── utils/
│   └── zplGenerator.js         # Utilidades (solo validateRecord)
├── App.jsx                     # Componente principal
├── main.jsx                    # Punto de entrada
└── index.css                   # Estilos globales
```

### Archivos de Configuración
- `package.json` (con dependencias arriba)
- `vite.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `index.html`

## 🎨 Estilos y CSS

### index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Estilos de impresión */
@media print {
  .no-print { display: none !important; }
  .print-only { display: block !important; }
}

/* Estilos personalizados */
.label-content {
  width: 5cm;
  height: 2.5cm;
  font-family: 'Courier New', monospace;
}
```

## 🔄 Flujo de la Aplicación

1. **Carga inicial:** Obtener datos de empleados desde API
2. **Filtrado:** Aplicar filtros por planilla, nombre, etc.
3. **Selección:** Usuario selecciona empleados y cantidad de etiquetas
4. **Vista previa:** Mostrar cómo quedarán las etiquetas
5. **Impresión:** Abrir diálogo del navegador y imprimir

## 🖨️ Configuración de Impresión

### Diálogo del Navegador
- Tamaño de página: Personalizado (5cm × 2.5cm)
- Márgenes: 0
- Escala: Ajustar al tamaño de página
- Orientación: Retrato

### Etiqueta Generada
```
┌─────────────────────────────────┐
│ SANTOS DE LEON TZUNUX          │
│ 42702                          │
│ F-101  702  MANUEL EQUILA SUY  │
│ [CÓDIGO DE BARRAS PDF417]      │
└─────────────────────────────────┘
```

## 🧪 Datos de Prueba (Mock)

Si no tienes acceso a la API real, usa estos datos de prueba:

```javascript
const mockData = [
  {
    nombre: "SANTOS DE LEON TZUNUX",
    id_empleados: "42702",
    id_frente: "101",
    id_contratista: "702",
    nombre_contratista: "MANUEL EQUILA SUY",
    code_bar: "42702101702"
  }
  // ... más datos
];
```

## 🚀 Inicio del Sistema

```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev

# Build para producción
npm run build
```

## 🔧 Personalización

### Cambiar API
Edita `src/services/apiService.js`:
```javascript
const API_BASE_URL = 'TU_API_ENDPOINT_AQUI';
```

### Modificar Diseño de Etiquetas
Edita `src/components/LabelPrintContent.jsx`

### Ajustar Filtros
Edita `src/components/FilterPanel.jsx`

## ⚠️ Notas Importantes

- **Sin Backend:** El sistema funciona completamente en frontend
- **Impresión Universal:** Compatible con cualquier impresora del sistema
- **Códigos de Barras:** Se generan con bwip-js (PDF417)
- **Responsive:** Funciona en desktop y mobile
- **Mayúsculas:** Todos los datos se convierten automáticamente a mayúsculas

## 🐛 Solución de Problemas

### Error de API
- Verifica que la URL de la API sea accesible
- Revisa la estructura de datos devuelta por la API
- Usa datos mock si la API no está disponible

### Problemas de Impresión
- Verifica que haya una impresora conectada
- Configura el tamaño de página en el diálogo de impresión
- Asegúrate de que el navegador tenga permisos de impresión

### Códigos de Barras no Aparecen
- Verifica que bwip-js esté instalado
- Revisa la consola del navegador por errores
- Asegúrate de que el campo `code_bar` tenga datos válidos

---

**¡Listo para integrar!** Copia los archivos, instala dependencias y configura tu API. 🎉</content>
<parameter name="filePath">c:\Users\henry\Desktop\tickets\README-REPLICACION.md