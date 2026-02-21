@echo off
setlocal
chcp 65001 > nul

echo =======================================
echo       BUYUK KONSEY BASLATILIYOR (Windows)
echo =======================================

echo [1/4] Eski surecler temizleniyor...
:: Windows'ta 8001 ve 5173 portlarini dinleyen islemleri öldür (Uyarilari gizler)
for /f "tokens=5" %%a in ('netstat -aon ^| find "8001" ^| find "LISTENING"') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| find "5173" ^| find "LISTENING"') do taskkill /f /pid %%a 2>nul
timeout /t 1 > nul

echo [2/4] Backend hazirlaniyor...
if not exist ".venv\" (
    echo [INFO] Python Sanal Ortami (.venv) bulunamadi, olusturuluyor...
    python -m venv .venv
    call .venv\Scripts\activate.bat
    echo [INFO] Bagimliliklar (requirements.txt) yukleniyor...
    pip install -r backend\requirements.txt
) else (
    call .venv\Scripts\activate.bat
)

:: Backend'i arka planda (ayri bir CMD penceresi acmadan) yurutmek zordur, bu yuzden yeni pencerede minimal baslatacagiz.
echo [INFO] Backend arka planda baslatiliyor (Port: 8001)...
start "Buyuk Konsey Backend" /MIN python -m backend.main

echo [3/4] Frontend hazirlaniyor...
cd frontend
if not exist "node_modules\" (
    echo [INFO] Frontend bagimliliklari (node_modules) bulunamadi, npm install calistiriliyor...
    npm install
)

echo [4/4] Uygulama aciliyor...
echo [INFO] Uygulama adresiniz: http://localhost:5173/

:: Varsayilan tarayicida ac
start http://localhost:5173/

:: Dev sunucuyu bu konsolda baslat (Uygulama buradan kapanacak)
npm run dev
