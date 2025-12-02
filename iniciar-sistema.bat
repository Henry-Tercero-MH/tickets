@echo off
chcp 65001 >nul
echo ========================================
echo  Sistema de Etiquetas EPSA - Zebra
echo ========================================
echo.
echo [1/3] Verificando dependencias...
echo.

REM Verificar e instalar dependencias del frontend
if not exist "node_modules" (
    echo Instalando dependencias del frontend...
    call npm install
    if errorlevel 1 (
        echo ERROR: No se pudieron instalar las dependencias del frontend
        pause
        exit /b 1
    )
    echo Dependencias del frontend instaladas correctamente.
    echo.
)

REM Verificar dependencias del backend
if not exist "backend\node_modules" (
    echo Instalando dependencias del backend...
    cd backend
    call npm install
    if errorlevel 1 (
        echo ERROR: No se pudieron instalar las dependencias del backend
        pause
        exit /b 1
    )
    cd ..
    echo Dependencias del backend instaladas correctamente.
    echo.
)

echo [2/3] Compilando aplicacion web...
call npm run build
if errorlevel 1 (
    echo ERROR: No se pudo compilar la aplicacion
    pause
    exit /b 1
)
echo Aplicacion compilada correctamente.
echo.

echo [3/3] Iniciando servidor...
echo.

REM Iniciar backend en nueva ventana
start "EPSA Tickets - Puerto 5000" cmd /k "cd backend && npm start"

REM Esperar a que el servidor inicie
timeout /t 4 /nobreak >nul

echo.
echo ========================================
echo  SISTEMA LISTO!
echo ========================================
echo.
echo  Puerto:    http://localhost:5000
echo  Impresora: Zebra GK420t
echo.
echo Funcionalidades:
echo  - Etiquetas de empleados con codigo de barras
echo  - Etiquetas manuales con texto ajustable
echo  - Tamaño: 5cm x 2.5cm
echo.
echo Presione cualquier tecla para abrir en navegador...
pause >nul

REM Abrir navegador
start http://localhost:5000

echo.
echo Sistema en ejecucion!
echo.
echo IMPORTANTE: NO cierre esta ventana.
echo Para detener el sistema, cierre la ventana del servidor.
echo.
pause
