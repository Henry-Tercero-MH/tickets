@echo off
REM Script de prueba para diagnosticar problemas de impresión
REM Este script intenta imprimir un archivo ZPL de prueba

echo ========================================
echo PRUEBA DE IMPRESION ZEBRA
echo ========================================
echo.

REM Crear archivo ZPL de prueba
echo ^XA > test.zpl
echo ^FO50,50^A0N,50,50^FDPRUEBA^FS >> test.zpl
echo ^XZ >> test.zpl

echo Archivo ZPL de prueba creado: test.zpl
echo.

REM Mostrar contenido del archivo
echo Contenido del archivo ZPL:
type test.zpl
echo.
echo ========================================

REM Intentar imprimir usando diferentes métodos
set IMPRESORA=ZDesigner GK420t

echo.
echo Metodo 1: Impresora compartida en red
echo Comando: copy /B test.zpl "\\%COMPUTERNAME%\%IMPRESORA%"
copy /B test.zpl "\\%COMPUTERNAME%\%IMPRESORA%"
if %ERRORLEVEL% EQU 0 (
    echo [OK] Metodo 1 funciono!
    echo.
    echo RESULTADO: La impresora esta compartida en red
    pause
    del test.zpl
    exit /b 0
) else (
    echo [FALLO] Metodo 1 no funciono
)

echo.
echo Metodo 2: Impresora local directa
echo Comando: copy /B test.zpl "%IMPRESORA%"
copy /B test.zpl "%IMPRESORA%"
if %ERRORLEVEL% EQU 0 (
    echo [OK] Metodo 2 funciono!
    echo.
    echo RESULTADO: La impresora esta accesible localmente
    pause
    del test.zpl
    exit /b 0
) else (
    echo [FALLO] Metodo 2 no funciono
)

echo.
echo Metodo 3: Puerto LPT1
echo Comando: copy /B test.zpl LPT1
copy /B test.zpl LPT1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Metodo 3 funciono!
    echo.
    echo RESULTADO: La impresora esta en puerto LPT1
    pause
    del test.zpl
    exit /b 0
) else (
    echo [FALLO] Metodo 3 no funciono
)

echo.
echo Metodo 4: Puerto USB001
echo Comando: copy /B test.zpl USB001
copy /B test.zpl USB001
if %ERRORLEVEL% EQU 0 (
    echo [OK] Metodo 4 funciono!
    echo.
    echo RESULTADO: La impresora esta en puerto USB001
    pause
    del test.zpl
    exit /b 0
) else (
    echo [FALLO] Metodo 4 no funciono
)

echo.
echo ========================================
echo TODOS LOS METODOS FALLARON
echo ========================================
echo.
echo Posibles soluciones:
echo 1. Compartir la impresora en Windows:
echo    - Panel de Control ^> Dispositivos e Impresoras
echo    - Click derecho en "%IMPRESORA%"
echo    - Propiedades ^> Compartir ^> Compartir esta impresora
echo.
echo 2. Verificar que el nombre de la impresora sea exacto:
echo    - Ejecute: wmic printer get name
echo.
echo 3. Usar PowerShell para imprimir (alternativa):
echo    - Ejecute el backend con metodo PowerShell
echo.
pause

del test.zpl
