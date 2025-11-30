@echo off
echo ========================================
echo  Sistema de Etiquetas Zebra
echo ========================================
echo.
echo Iniciando servidores...
echo.

REM Iniciar backend en nueva ventana
echo [1/2] Iniciando servidor backend (Puerto 5000)...
start "Backend - Impresion Zebra" cmd /k "cd backend && npm start"

REM Esperar un momento
timeout /t 3 /nobreak >nul

REM Iniciar frontend en nueva ventana
echo [2/2] Iniciando servidor frontend (Puerto 3000)...
start "Frontend - React App" cmd /k "npm run dev"

REM Esperar un momento
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo  Servidores Iniciados!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Presione cualquier tecla para abrir la aplicacion...
pause >nul

REM Abrir navegador
start http://localhost:3000

echo.
echo Sistema listo!
echo Cierre esta ventana cuando termine de usar el sistema.
echo.
pause
