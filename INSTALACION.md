# Guía de Instalación Rápida

## Pasos para Instalar el Sistema

### 1️⃣ Instalar Node.js (si no lo tiene)

Descargue e instale Node.js desde: https://nodejs.org/
- Versión recomendada: LTS (Long Term Support)
- Durante la instalación, acepte instalar las herramientas necesarias

Verifique la instalación:
```bash
node --version
npm --version
```

### 2️⃣ Instalar Zebra Browser Print (OBLIGATORIO)

1. Descargue desde: https://www.zebra.com/us/en/support-downloads/software/printer-software/zebra-browser-print.html

2. Ejecute el instalador según su sistema operativo:
   - **Windows:** `BrowserPrint-Windows-x64.exe`
   - **Mac:** `BrowserPrint-Mac.dmg`
   - **Linux:** `BrowserPrint-Linux.sh`

3. Siga el asistente de instalación

4. **IMPORTANTE:** Reinicie su navegador después de instalar

5. Verifique la instalación:
   - Abra su navegador
   - Vaya a: `http://localhost:9100`
   - Debería ver la interfaz de Zebra Browser Print
   - Verifique que su impresora aparezca en la lista

### 3️⃣ Configurar la Impresora Zebra GK420t

1. Conecte la impresora por USB o red
2. Encienda la impresora
3. Instale los drivers si Windows los solicita
4. Configure etiquetas de 5 cm × 2.5 cm
5. Calibre la impresora (opcional pero recomendado):
   - Apague la impresora
   - Mantenga presionado el botón FEED
   - Encienda la impresora (aún presionando FEED)
   - Suelte cuando comience a parpadear
   - Espere a que termine la calibración

### 4️⃣ Instalar el Proyecto

```bash
# 1. Abrir terminal en la carpeta del proyecto
cd c:\Users\terce\OneDrive\Desktop\zafra2025

# 2. Instalar dependencias
npm install

# 3. Crear archivo de configuración
copy .env.example .env

# 4. Editar .env (opcional - solo si tiene API backend)
# notepad .env
# Cambiar: VITE_API_URL=http://tu-servidor.com/api
```

### 5️⃣ Iniciar la Aplicación

```bash
npm run dev
```

La aplicación se abrirá automáticamente en: `http://localhost:3000`

### 6️⃣ Verificar que Todo Funcione

1. **Verificar Zebra Browser Print:**
   - En el header debe aparecer "Impresora Conectada" (luz verde)
   - Si aparece "Sin Impresora" (luz roja), haga clic en "Reconectar"

2. **Probar la impresión:**
   - Haga clic en el botón "Prueba" en el header
   - Debe imprimirse una etiqueta de prueba

3. **Probar con datos reales:**
   - Seleccione un empleado de la tabla
   - Configure la cantidad de etiquetas (ejemplo: 1)
   - Haga clic en "Imprimir"
   - Verifique que se imprima correctamente

## ✅ Checklist de Instalación

- [ ] Node.js instalado y funcionando
- [ ] Zebra Browser Print instalado
- [ ] Navegador reiniciado después de instalar Browser Print
- [ ] `http://localhost:9100` muestra la interfaz de Browser Print
- [ ] Impresora Zebra GK420t conectada y encendida
- [ ] Drivers de impresora instalados
- [ ] Etiquetas de 5×2.5 cm cargadas en la impresora
- [ ] Dependencias del proyecto instaladas (`npm install`)
- [ ] Aplicación iniciada (`npm run dev`)
- [ ] Aplicación muestra "Impresora Conectada"
- [ ] Etiqueta de prueba imprime correctamente

## ❌ Solución de Problemas Comunes

### "npm no se reconoce como comando"
➜ Node.js no está instalado o no está en el PATH
- Reinstale Node.js
- Reinicie la terminal

### "Zebra Browser Print no está instalado"
➜ No instaló Browser Print o no reinició el navegador
- Instale Browser Print
- Reinicie el navegador completamente
- Verifique en `http://localhost:9100`

### "No se detectó ninguna impresora"
➜ La impresora no está conectada o configurada
- Encienda la impresora
- Verifique la conexión USB/red
- Instale drivers si es necesario
- Verifique en `http://localhost:9100` que aparezca

### "Error al imprimir"
➜ Problema con la impresora o configuración
- Verifique que haya etiquetas cargadas
- Verifique que la tapa esté cerrada
- Calibre la impresora
- Verifique que el tamaño de etiqueta sea 5×2.5 cm

## 📞 ¿Necesita Ayuda?

Si después de seguir estos pasos aún tiene problemas:

1. Revise el archivo [README.md](README.md) para más detalles
2. Verifique cada paso del checklist
3. Consulte la documentación de Zebra Browser Print
4. Revise los logs en la consola del navegador (F12)

## 🎉 ¡Listo!

Una vez completados todos los pasos, el sistema estará listo para imprimir etiquetas.

**Uso básico:**
1. Seleccione empleados en la tabla
2. Elija cantidad de etiquetas
3. Haga clic en "Imprimir"
4. ¡Las etiquetas se imprimirán automáticamente!
