# Documentación de la API

Esta aplicación está diseñada para consumir APIs REST que devuelven información de empleados. Este documento explica cómo integrar su API backend.

## Formato de Datos Requerido

### Estructura de un Empleado

Cada registro de empleado debe tener los siguientes campos:

```json
{
  "nombre": "Santos de Leon Tzunux",
  "id_empleados": "42702",
  "id_frente": "101",
  "id_contratista": "702",
  "nombre_contratista": "Manuel Equila Suy",
  "code_bar": "42702101702"
}
```

### Descripción de Campos

| Campo | Tipo | Descripción | Obligatorio | Ejemplo |
|-------|------|-------------|-------------|---------|
| `nombre` | String | Nombre completo del empleado | Sí | "Santos de Leon Tzunux" |
| `id_empleados` | String/Number | ID único del empleado | Sí | "42702" |
| `id_frente` | String/Number | ID del frente de trabajo | Sí | "101" |
| `id_contratista` | String/Number | ID del contratista | Sí | "702" |
| `nombre_contratista` | String | Nombre del contratista | Sí | "Manuel Equila Suy" |
| `code_bar` | String/Number | Código de barras (para PDF417) | Sí | "42702101702" |

**NOTA:** Todos los valores se convertirán automáticamente a MAYÚSCULAS en la aplicación.

## Endpoints de la API

### 1. Obtener Todos los Empleados

```
GET /api/empleados
```

**Respuesta exitosa (200):**
```json
[
  {
    "nombre": "Santos de Leon Tzunux",
    "id_empleados": "42702",
    "id_frente": "101",
    "id_contratista": "702",
    "nombre_contratista": "Manuel Equila Suy",
    "code_bar": "42702101702"
  },
  {
    "nombre": "Juan Perez Garcia",
    "id_empleados": "35481",
    "id_frente": "205",
    "id_contratista": "803",
    "nombre_contratista": "Carlos Martinez Lopez",
    "code_bar": "35481205803"
  }
]
```

**Respuesta de error (400/500):**
```json
{
  "error": "Mensaje de error descriptivo"
}
```

### 2. Buscar Empleados (Opcional)

```
GET /api/empleados/search?nombre=...&id_empleados=...&id_frente=...
```

**Parámetros de búsqueda:**
- `nombre` - Buscar por nombre (parcial)
- `id_empleados` - Buscar por ID de empleado
- `id_frente` - Filtrar por frente
- `id_contratista` - Filtrar por contratista

**Ejemplo:**
```
GET /api/empleados/search?nombre=Santos&id_frente=101
```

**Respuesta:**
```json
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

## Configuración en la Aplicación

### 1. Configurar la URL de la API

Edite el archivo `.env`:

```env
VITE_API_URL=http://tu-servidor.com/api
```

O directamente en `src/services/apiService.js`:

```javascript
const API_BASE_URL = 'http://tu-servidor.com/api';
```

### 2. Habilitar el Consumo de API Real

En `src/App.jsx`, línea 23-24, cambie:

```javascript
// De:
const data = getMockData();

// A:
const data = await fetchEmpleados();
```

## Ejemplos de Backend

### Node.js + Express

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Obtener todos los empleados
app.get('/api/empleados', async (req, res) => {
  try {
    // Consultar base de datos
    const empleados = await db.query(`
      SELECT
        nombre,
        id_empleados,
        id_frente,
        id_contratista,
        nombre_contratista,
        code_bar
      FROM empleados
    `);

    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar empleados
app.get('/api/empleados/search', async (req, res) => {
  try {
    const { nombre, id_empleados, id_frente, id_contratista } = req.query;

    let query = 'SELECT * FROM empleados WHERE 1=1';
    const params = [];

    if (nombre) {
      query += ' AND nombre LIKE ?';
      params.push(`%${nombre}%`);
    }
    if (id_empleados) {
      query += ' AND id_empleados = ?';
      params.push(id_empleados);
    }
    if (id_frente) {
      query += ' AND id_frente = ?';
      params.push(id_frente);
    }
    if (id_contratista) {
      query += ' AND id_contratista = ?';
      params.push(id_contratista);
    }

    const empleados = await db.query(query, params);
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log('API ejecutándose en http://localhost:5000');
});
```

### Python + Flask

```python
from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Configuración de base de datos
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'password',
    'database': 'empleados_db'
}

@app.route('/api/empleados', methods=['GET'])
def get_empleados():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                nombre,
                id_empleados,
                id_frente,
                id_contratista,
                nombre_contratista,
                code_bar
            FROM empleados
        """)

        empleados = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify(empleados)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/empleados/search', methods=['GET'])
def search_empleados():
    try:
        nombre = request.args.get('nombre')
        id_empleados = request.args.get('id_empleados')
        id_frente = request.args.get('id_frente')
        id_contratista = request.args.get('id_contratista')

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        query = "SELECT * FROM empleados WHERE 1=1"
        params = []

        if nombre:
            query += " AND nombre LIKE %s"
            params.append(f'%{nombre}%')
        if id_empleados:
            query += " AND id_empleados = %s"
            params.append(id_empleados)
        if id_frente:
            query += " AND id_frente = %s"
            params.append(id_frente)
        if id_contratista:
            query += " AND id_contratista = %s"
            params.append(id_contratista)

        cursor.execute(query, params)
        empleados = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify(empleados)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
```

### PHP (Laravel)

```php
<?php

// routes/api.php
Route::get('/empleados', [EmpleadoController::class, 'index']);
Route::get('/empleados/search', [EmpleadoController::class, 'search']);

// app/Http/Controllers/EmpleadoController.php
namespace App\Http\Controllers;

use App\Models\Empleado;
use Illuminate\Http\Request;

class EmpleadoController extends Controller
{
    public function index()
    {
        try {
            $empleados = Empleado::select([
                'nombre',
                'id_empleados',
                'id_frente',
                'id_contratista',
                'nombre_contratista',
                'code_bar'
            ])->get();

            return response()->json($empleados);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function search(Request $request)
    {
        try {
            $query = Empleado::query();

            if ($request->has('nombre')) {
                $query->where('nombre', 'LIKE', '%' . $request->nombre . '%');
            }
            if ($request->has('id_empleados')) {
                $query->where('id_empleados', $request->id_empleados);
            }
            if ($request->has('id_frente')) {
                $query->where('id_frente', $request->id_frente);
            }
            if ($request->has('id_contratista')) {
                $query->where('id_contratista', $request->id_contratista);
            }

            $empleados = $query->get();
            return response()->json($empleados);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
```

## Esquema de Base de Datos

### Tabla: empleados

```sql
CREATE TABLE empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    id_empleados VARCHAR(50) NOT NULL UNIQUE,
    id_frente VARCHAR(50) NOT NULL,
    id_contratista VARCHAR(50) NOT NULL,
    nombre_contratista VARCHAR(255) NOT NULL,
    code_bar VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_id_empleados (id_empleados),
    INDEX idx_id_frente (id_frente),
    INDEX idx_id_contratista (id_contratista)
);
```

### Datos de Ejemplo

```sql
INSERT INTO empleados (nombre, id_empleados, id_frente, id_contratista, nombre_contratista, code_bar)
VALUES
('Santos de Leon Tzunux', '42702', '101', '702', 'Manuel Equila Suy', '42702101702'),
('Juan Perez Garcia', '35481', '205', '803', 'Carlos Martinez Lopez', '35481205803'),
('Maria Rodriguez Hernandez', '28956', '102', '702', 'Manuel Equila Suy', '28956102702'),
('Pedro Gonzalez Ramirez', '41203', '301', '904', 'Ana Torres Mendez', '41203301904'),
('Luis Alberto Castro', '39875', '104', '702', 'Manuel Equila Suy', '39875104702');
```

## Seguridad y CORS

### Habilitar CORS en el Backend

Para permitir que la aplicación frontend consuma la API:

**Node.js:**
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // URL de la aplicación frontend
  credentials: true
}));
```

**Python:**
```python
from flask_cors import CORS
CORS(app, origins=['http://localhost:3000'])
```

**PHP:**
```php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

### Autenticación (Opcional)

Si necesita autenticación, puede agregar:

```javascript
// Frontend: src/services/apiService.js
const response = await axios.get(`${API_BASE_URL}/empleados`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Pruebas de la API

### Con cURL

```bash
# Obtener todos los empleados
curl http://localhost:5000/api/empleados

# Buscar empleados
curl "http://localhost:5000/api/empleados/search?nombre=Santos&id_frente=101"
```

### Con Postman

1. Crear nueva request GET
2. URL: `http://localhost:5000/api/empleados`
3. Enviar
4. Verificar que devuelva JSON con la estructura correcta

### Con la Consola del Navegador

```javascript
fetch('http://localhost:5000/api/empleados')
  .then(res => res.json())
  .then(data => console.log(data));
```

## Manejo de Errores

La aplicación maneja los siguientes errores de API:

- **Network Error:** No se puede conectar al servidor
- **400 Bad Request:** Parámetros inválidos
- **404 Not Found:** Endpoint no encontrado
- **500 Internal Server Error:** Error del servidor

Asegúrese de que su API devuelva códigos de estado HTTP apropiados.

## Validaciones Recomendadas

En el backend, valide:

1. Que todos los campos requeridos estén presentes
2. Que `id_empleados` sea único
3. Que los IDs sean válidos
4. Que los nombres no estén vacíos
5. Que `code_bar` tenga el formato correcto

## Optimización

Para mejorar el rendimiento:

1. Implemente paginación si tiene muchos registros
2. Use índices en la base de datos
3. Implemente caché en el backend
4. Comprima las respuestas (gzip)

---

**¿Necesita ayuda?** Revise los ejemplos de código o consulte la documentación de su framework backend preferido.
