# 📖 Guía Final - Sistema de Etiquetas Zebra

## ✅ Lo que Tienes Funcionando

- Frontend React: http://localhost:3000 ✅
- Backend Node.js: http://localhost:5000 ✅
- Impresora ZDesigner GK420t conectada ✅
- Datos de prueba (5 empleados) ✅

## ⚠️ Problema Actual

Error 500 al intentar imprimir. Esto es porque el método de impresión necesita ajustes finales.

---

## 🔧 Solución Paso a Paso

### Opción 1: Reiniciar Todo Limpio (RECOMENDADO)

1. **Cierra TODAS las ventanas** de cmd/PowerShell/terminal

2. **Doble clic en:** `iniciar-sistema.bat`
   - Esto abrirá 2 ventanas:
     - Backend (puerto 5000)
     - Frontend (puerto 3000)

3. **Espera 10 segundos** a que ambos servidores inicien

4. **Abre el navegador** en: http://localhost:3000

5. **Presiona Ctrl + Shift + R** (recarga forzada sin caché)

6. **Haz clic en "Reconectar"**

7. **Intenta imprimir**

---

### Opción 2: Verificar Manualmente

Si la Opción 1 no funciona, verifica:

#### 1. ¿El backend está corriendo?

Abre: http://localhost:5000/api/test

Deberías ver:
```json
{"success":true,"message":"Servidor de impresión funcionando correctamente",...}
```

#### 2. ¿Detecta la impresora?

Abre: http://localhost:5000/api/printers

Deberías ver:
```json
{"success":true,"allPrinters":["ZDesigner GK420t"],...}
```

#### 3. ¿El frontend está corriendo?

Abre: http://localhost:3000

Deberías ver la tabla con 5 empleados.

---

## 🐛 Si Sigue Sin Funcionar

### Revisar el archivo print.bat

El archivo `backend/print.bat` debe contener:

```batch
@echo off
REM Script para imprimir ZPL en impresora Zebra
REM Uso: print.bat "archivo.zpl" "NombreImpresora"

set ARCHIVO=%~1
set IMPRESORA=%~2

REM Enviar archivo directamente al puerto de la impresora
copy /B "%ARCHIVO%" "\\%COMPUTERNAME%\%IMPRESORA%" >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    exit /b 0
) else (
    exit /b 1
)
```

### Probar Manualmente

Abre cmd y prueba:

```cmd
cd C:\Users\terce\OneDrive\Desktop\zafra2025\backend
echo ^XA^FO50,50^A0N,30,30^FDTEST^FS^XZ > test.zpl
print.bat test.zpl "ZDesigner GK420t"
```

Si imprime, el problema está en el Node.js.
Si NO imprime, el problema está en la configuración de Windows/impresora.

---

## 🔍 Diagnóstico de la Impresora

### 1. Verificar nombre exacto

Abre "Dispositivos e impresoras" y copia el nombre EXACTO de tu impresora.

Puede ser:
- `ZDesigner GK420t`
- `ZDesigner GK420t (Copy 1)`
- `Zebra GK420t`
- etc.

### 2. Actualizar el nombre en backend

Si el nombre es diferente, edita `backend/server.js` línea 34:

```javascript
const printer = printerName || 'NOMBRE_EXACTO_AQUI';
```

Y también línea 177:

```javascript
const configuredPrinter = 'NOMBRE_EXACTO_AQUI';
```

### 3. Compartir la impresora (Importante)

1. Abre "Dispositivos e impresoras"
2. Clic derecho en tu Zebra → "Propiedades de impresora"
3. Pestaña "Compartir"
4. Marca "Compartir esta impresora"
5. Nombre del recurso compartido: `ZDesigner`
6. Aplicar → Aceptar

### 4. Reiniciar backend

```cmd
cd backend
npm start
```

---

## 📊 Método Alternativo - Impresión Directa

Si nada funciona, puedes usar impresión directa desde archivos:

### 1. Genera el archivo ZPL

En el navegador, abre la consola (F12) y ejecuta:

```javascript
// Copiar un código ZPL de ejemplo
const zpl = `^XA
^PW400
^LL200
^FO10,10^A0N,25,25^FDSANTOS DE LEON TZUNUX^FS
^FO140,45^A0N,35,35^FD42702^FS
^FO10,90^A0N,20,20^FDF- 101^FS
^FO100,90^A0N,20,20^FD702^FS
^FO170,90^A0N,20,20^FDMANUEL EQUILA SUY^FS
^FO10,120^B7N,3,3,7,1,N^FD42702101702^FS
^XZ`;

// Descargar
const blob = new Blob([zpl], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'etiqueta.zpl';
a.click();
```

### 2. Imprime manualmente

```cmd
copy /B etiqueta.zpl "\\%COMPUTERNAME%\ZDesigner GK420t"
```

---

## 🎯 Checklist Final

Antes de pedir más ayuda, verifica:

- [ ] Backend corriendo (http://localhost:5000/api/test funciona)
- [ ] Frontend corriendo (http://localhost:3000 se ve)
- [ ] Impresora encendida
- [ ] Impresora con nombre correcto en el código
- [ ] Impresora compartida en Windows
- [ ] Etiquetas cargadas en la impresora
- [ ] Recarga forzada del navegador (Ctrl + Shift + R)
- [ ] Script print.bat existe en carpeta backend/
- [ ] Prueba manual con print.bat funciona

---

## 📞 Información para Soporte

Si necesitas ayuda, ten esta info lista:

1. **Nombre exacto de tu impresora** (desde Dispositivos e impresoras)
2. **Versión de Windows** (Win 10/11)
3. **¿La impresora imprime desde otras aplicaciones?** (Word, Notepad, etc.)
4. **Logs del backend** (lo que aparece en la ventana de backend al intentar imprimir)
5. **Error en el navegador** (consola F12)

---

## ✨ Cuando Todo Funcione

Una vez que imprima correctamente:

1. **Guarda el proyecto**
2. **Documenta cualquier cambio** que hayas hecho
3. **Crea un backup** de la carpeta zafra2025
4. **Para iniciar próxima vez:** Doble clic en `iniciar-sistema.bat`

---

**¡El sistema está casi listo! Solo falta ajustar el método de impresión a tu configuración específica de Windows!** 🚀
