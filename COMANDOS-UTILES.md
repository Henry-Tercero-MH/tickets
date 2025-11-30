# Comandos Útiles

Guía rápida de comandos para trabajar con el proyecto.

## Instalación y Configuración Inicial

```bash
# Instalar dependencias
npm install

# Crear archivo de configuración
copy .env.example .env

# Editar configuración (opcional)
notepad .env
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# La aplicación se abrirá en http://localhost:3000
# Los cambios se actualizan automáticamente
```

## Producción

```bash
# Generar build optimizado
npm run build

# Previsualizar build de producción
npm run preview

# Los archivos generados estarán en la carpeta /dist
```

## Verificación

```bash
# Verificar versiones instaladas
node --version
npm --version

# Verificar que Zebra Browser Print esté corriendo
# Abrir en el navegador: http://localhost:9100
```

## Comandos de Git (Opcional)

```bash
# Inicializar repositorio
git init

# Agregar archivos
git add .

# Crear commit
git commit -m "Proyecto inicial de etiquetas Zebra"

# Conectar con repositorio remoto
git remote add origin https://github.com/tu-usuario/tu-repo.git

# Subir cambios
git push -u origin main
```

## Solución de Problemas

```bash
# Limpiar node_modules y reinstalar
rmdir /s node_modules
npm install

# Limpiar caché de npm
npm cache clean --force

# Reinstalar desde cero
rmdir /s node_modules
del package-lock.json
npm install
```

## Despliegue

### Opción 1: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel

# Desplegar a producción
vercel --prod
```

### Opción 2: Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Construir proyecto
npm run build

# Desplegar
netlify deploy

# Desplegar a producción
netlify deploy --prod
```

### Opción 3: Servidor Propio

```bash
# 1. Generar build
npm run build

# 2. Copiar carpeta /dist al servidor

# 3. Configurar servidor web (Apache/Nginx)
# Apuntar a la carpeta /dist
```

## Comandos de Base de Datos (Ejemplo MySQL)

```bash
# Conectar a MySQL
mysql -u root -p

# Crear base de datos
CREATE DATABASE empleados_db;

# Usar base de datos
USE empleados_db;

# Importar datos (si tiene un archivo .sql)
mysql -u root -p empleados_db < datos.sql
```

## Pruebas de la API

```bash
# Con cURL - Obtener empleados
curl http://localhost:5000/api/empleados

# Con cURL - Buscar empleados
curl "http://localhost:5000/api/empleados/search?nombre=Santos"

# Con cURL - Ver headers
curl -I http://localhost:5000/api/empleados
```

## Comandos de Zebra (Avanzado)

### Enviar ZPL directamente por red

```bash
# Enviar archivo ZPL a impresora de red (Linux/Mac)
cat etiqueta.zpl | nc 192.168.1.100 9100

# Windows (con netcat)
type etiqueta.zpl | nc 192.168.1.100 9100
```

### Calibrar impresora por comandos ZPL

```zpl
# Guardar en archivo calibrar.zpl y enviar a la impresora
~JC
^XA
^JUS
^XZ
```

## Atajos del Proyecto

```bash
# Crear alias para comandos frecuentes (PowerShell)
Set-Alias dev "npm run dev"
Set-Alias build "npm run build"

# Usar:
dev      # En lugar de npm run dev
build    # En lugar de npm run build
```

## Información del Sistema

```bash
# Ver información del sistema
systeminfo

# Ver puertos en uso
netstat -ano | findstr :3000
netstat -ano | findstr :9100

# Matar proceso en puerto 3000
npx kill-port 3000
```

## Actualizar Dependencias

```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar todas las dependencias
npm update

# Actualizar una dependencia específica
npm install react@latest

# Actualizar a última versión (incluso major)
npm install react@latest --save
```

## Herramientas de Desarrollo

```bash
# Analizar tamaño del bundle
npm install -D rollup-plugin-visualizer
npm run build

# Verificar código (si tienes ESLint)
npm run lint

# Formatear código (si tienes Prettier)
npm run format
```

## Generar Documentación

```bash
# Si instalas JSDoc
npm install -g jsdoc

# Generar documentación
jsdoc src/ -r -d docs/
```

## Comandos de Windows Útiles

```bash
# Abrir carpeta en explorador
start .

# Abrir en VS Code
code .

# Abrir en navegador
start http://localhost:3000

# Ver contenido de archivo
type README.md

# Buscar texto en archivos
findstr /s "palabra" *.js
```

## Respaldo del Proyecto

```bash
# Crear archivo ZIP del proyecto (excluyendo node_modules)
# Usar PowerShell:
Compress-Archive -Path .\* -DestinationPath ..\zafra2025-backup.zip -Force
```

## Monitoreo de Logs

```bash
# Ver logs del servidor de desarrollo
# Ya se muestran automáticamente al ejecutar npm run dev

# Para guardar logs en archivo:
npm run dev > logs.txt 2>&1
```

---

**💡 Tip:** Guarde este archivo para referencia rápida de comandos frecuentes.
