@echo off
setlocal enabledelayedexpansion
chcp 65001 > nul

echo =======================================
echo       BUYUK KONSEY BASLATILIYOR (Windows)
echo =======================================

echo [1/4] Eski surecler temizleniyor...
REM 8001 ve 5173 portlarini dinleyen islemleri oldur
for /f "tokens=5" %%a in ('netstat -aon ^| find "8001" ^| find "LISTENING"') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| find "5173" ^| find "LISTENING"') do taskkill /f /pid %%a 2>nul
timeout /t 1 > nul

echo [2/4] Backend hazirlaniyor...

REM Python tespiti
set PYTHON_CMD=
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    set PYTHON_CMD=python
) else (
    where py >nul 2>nul
    if !ERRORLEVEL! equ 0 (
        set PYTHON_CMD=py
    ) else (
        echo [ERROR] Python bulunamadi! Lutfen Python yuklediginizden ve PATH'e eklediginizden emin olun.
        pause
        exit /b 1
    )
)

if not exist ".venv\" (
    echo [INFO] Python Sanal Ortami (.venv) bulunamadi, olusturuluyor...
    !PYTHON_CMD! -m venv .venv
    call .venv\Scripts\activate.bat
    echo [INFO] Bagimliliklar yukleniyor...
    pip install .
) else (
    call .venv\Scripts\activate.bat
)

echo [INFO] Backend arka planda baslatiliyor (Port: 8001)...
REM .venv icindeki python'u direkt kullanarak baslatmak daha guvenli
start "Buyuk Konsey Backend" /MIN .venv\Scripts\python.exe -m backend.main

echo [INFO] Backend'in hazir olmasi bekleniyor...
timeout /t 5 > nul

REM Port kontrolu (Backend gercekten basladi mi?)
netstat -aon | find "8001" | find "LISTENING" > nul
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Backend 8001 portunda tespit edilemedi. Loglari kontrol edin: backend.log
    echo [INFO] Yine de frontend baslatiliyor...
) else (
    echo [OK] Backend basariyla baslatildi.
)

echo [3/4] Frontend hazirlaniyor...
cd frontend
if not exist "node_modules\" (
    echo [INFO] Frontend bagimliliklari (node_modules) bulunamadi, npm install calistiriliyor...
    npm install
)

echo [4/4] Uygulama aciliyor...
echo [INFO] Uygulama adresiniz: http://localhost:5173/

REM Varsayilan tarayicida ac
start http://localhost:5173/

REM Dev sunucuyu bu konsolda baslat
npm run dev
