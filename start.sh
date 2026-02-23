#!/bin/bash

# Renk tanımlamaları
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=======================================${NC}"
echo -e "${GREEN}      BÜYÜK KONSEY BAŞLATILIYOR        ${NC}"
echo -e "${BLUE}=======================================${NC}"

# Mevcut çalışan süreçleri temizle
echo -e "${BLUE}[1/4] Eski süreçler temizleniyor...${NC}"
fuser -k 8001/tcp 2>/dev/null
fuser -k 5173/tcp 2>/dev/null
sleep 1

# Backend Hazırlığı
echo -e "${BLUE}[2/4] Backend hazırlanıyor...${NC}"
if [ ! -d ".venv" ]; then
    echo -e "${RED}.venv bulunamadı, oluşturuluyor...${NC}"
    python3 -m venv .venv
    source .venv/bin/activate
    pip install .
else
    source .venv/bin/activate
fi

# Backend'i başlat
nohup python3 -m backend.main > backend.log 2>&1 &
echo -e "${GREEN}✔ Backend arka planda başlatıldı (Port: 8001)${NC}"

# Frontend Hazırlığı
echo -e "${BLUE}[3/4] Frontend hazırlanıyor...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    echo -e "${RED}Bağımlılıklar eksik, npm install çalıştırılıyor...${NC}"
    npm install
fi

# Frontend'i başlat
echo -e "${BLUE}[4/4] Uygulama açılıyor...${NC}"
echo -e "\n${GREEN}🚀 Uygulama hazır! Tarayıcınızda açılıyor: http://localhost:5173${NC}"
echo -e "${NC}DURDURMAK İÇİN: Terminalde CTRL+C tuşlarına basın.${NC}\n"

# Tarayıcıyı aç (isteğe bağlı, Linux xdg-open)
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:5173 2>/dev/null &
fi

npm run dev
