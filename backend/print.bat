@echo off
REM Script para imprimir ZPL en impresora Zebra
REM Uso: print.bat "archivo.zpl" "NombreImpresora"

set ARCHIVO=%~1
set IMPRESORA=%~2

echo [PRINT.BAT] Iniciando impresion...
echo [PRINT.BAT] Archivo: %ARCHIVO%
echo [PRINT.BAT] Impresora: %IMPRESORA%

REM Verificar que el archivo existe
if not exist "%ARCHIVO%" (
    echo [PRINT.BAT ERROR] El archivo no existe
    exit /b 1
)

REM Mostrar contenido del archivo para debug
echo [PRINT.BAT] Contenido del archivo ZPL:
type "%ARCHIVO%"
echo.

REM Intentar método 1: Usar print command de Windows
echo [PRINT.BAT] Intentando metodo 1: PRINT comando
print /D:"%IMPRESORA%" "%ARCHIVO%" 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PRINT.BAT] Metodo 1 exitoso
    exit /b 0
)
echo [PRINT.BAT] Metodo 1 fallo

REM Intentar método 2: Copy directo al nombre de impresora
echo [PRINT.BAT] Intentando metodo 2: COPY a impresora
copy /B "%ARCHIVO%" "%IMPRESORA%" 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PRINT.BAT] Metodo 2 exitoso
    exit /b 0
)
echo [PRINT.BAT] Metodo 2 fallo

REM Intentar método 3: Impresora compartida en red
echo [PRINT.BAT] Intentando metodo 3: COPY a \\%COMPUTERNAME%\%IMPRESORA%
copy /B "%ARCHIVO%" "\\%COMPUTERNAME%\%IMPRESORA%" 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PRINT.BAT] Metodo 3 exitoso
    exit /b 0
)
echo [PRINT.BAT] Metodo 3 fallo

REM Intentar método 4: Puerto LPT1
echo [PRINT.BAT] Intentando metodo 4: COPY a LPT1
copy /B "%ARCHIVO%" LPT1 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PRINT.BAT] Metodo 4 exitoso
    exit /b 0
)
echo [PRINT.BAT] Metodo 4 fallo

REM Intentar método 5: Puerto USB001
echo [PRINT.BAT] Intentando metodo 5: COPY a USB001
copy /B "%ARCHIVO%" USB001 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PRINT.BAT] Metodo 5 exitoso
    exit /b 0
)
echo [PRINT.BAT] Metodo 5 fallo

echo [PRINT.BAT ERROR] Todos los metodos fallaron
exit /b 1
