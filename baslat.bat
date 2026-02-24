@echo off
chcp 65001 > nul

rem Handle the trailing backslash in %~dp0 which can break quoted paths
set "BASE_DIR=%~dp0"
if "%BASE_DIR:~-1%"=="\" set "BASE_DIR=%BASE_DIR:~0,-1%"

cd /d "%BASE_DIR%"

echo =======================================
echo       BUYUK KONSEY BASLATILIYOR
echo =======================================

echo [1/4] Temizlik yapiliyor...
for /f "tokens=5" %%a in ('netstat -aon ^| find "8001" ^| find "LISTENING"') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| find "5173" ^| find "LISTENING"') do taskkill /f /pid %%a 2>nul
rem Use ping for cross-platform sleep in headless environments
ping 127.0.0.1 -n 2 > nul

echo [2/4] Backend hazirlaniyor...

set PYTHON_CMD=python
where python >nul 2>nul
if errorlevel 1 (
    set PYTHON_CMD=py
    where py >nul 2>nul
    if errorlevel 1 (
        echo [ERROR] Python bulunamadi.
        pause
        exit /b 1
    )
)

if not exist ".venv\" (
    echo [INFO] .venv olusturuluyor...
    "%PYTHON_CMD%" -m venv .venv
    if errorlevel 1 (
        echo [ERROR] .venv olusturulamadi.
        pause
        exit /b 1
    )
)

echo [INFO] Bagimliliklar kontrol ediliyor...
call ".venv\Scripts\python.exe" -m pip install -r backend\requirements.txt

echo [INFO] Backend baslatiliyor...
rem Use a simpler start command with cd first
start "Buyuk Konsey Backend" cmd /k "chcp 65001 > nul && cd /d "%BASE_DIR%" && .venv\Scripts\python.exe -m backend.main"

echo [INFO] Backend bekleniyor...
ping 127.0.0.1 -n 6 > nul

echo [3/4] Frontend hazirlaniyor...
cd /d "%BASE_DIR%\frontend"
if not exist "node_modules\" (
    echo [INFO] npm install yapiliyor...
    call npm install
)

echo [4/4] Uygulama aciliyor...
start http://localhost:5173/

echo [INFO] Frontend sunucusu baslatiliyor...
call npm run dev
pause
