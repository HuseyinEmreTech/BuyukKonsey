# Büyük Konsey (LLM Council)

![Büyük Konsey Header](header.jpg)

Bu proje, tek bir yapay zekaya soru sormak yerine, kendi "Büyük Konseyinizi" kurmanızı sağlar. Sorunuz aynı anda birden fazla yapay zeka modeline gider. Modeller önce kendi cevaplarını yazar, sonra birbirlerinin cevaplarını okuyup puanlar, en sonunda da "Başkan", tüm bu süreci harmanlayıp size nihai cevabı sunar.

*Instead of asking a single AI, this project lets you build your own "Grand Council". Your question goes to multiple AI models simultaneously. They write their own answers, then rank each other's responses, and finally the "Chairman" synthesizes the best answer from the entire process.*

---

## Kurulum / Installation

### 1. Gereksinimler / Requirements
- **Python** 3.10+: [python.org](https://www.python.org/downloads/)
- **Node.js** 18+: [nodejs.org](https://nodejs.org/)

### 2. API Anahtarı / API Key
1. [OpenRouter.ai](https://openrouter.ai/) hesabı açın / Create an account
2. [API Keys](https://openrouter.ai/keys) sayfasından anahtar oluşturun / Create a key
3. Proje kök dizininde `.env` dosyası oluşturun / Create `.env` in root:
   ```env
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```
   Alternatif olarak uygulamayı başlattıktan sonra **Sistem Durumu** panelinden de API anahtarınızı kaydedebilirsiniz.
   
   *Alternatively, you can save your API key from the **System Status** panel after launching the app.*

### 3. Başlatma / Launch

**Linux / Mac:**
```bash
chmod +x start.sh
./start.sh
```

**Windows:**
`start.bat` dosyasına çift tıklayın / Double-click `start.bat`

Uygulama otomatik olarak http://localhost:5173 adresinde açılacaktır.

*The app will automatically open at http://localhost:5173*

---

## Özellikler / Features

### 3 Aşamalı Konsey Süreci / 3-Stage Council Process
1. **Bireysel Yanıtlar**: Her model sorunuza bağımsız cevap verir / Each model answers independently
2. **Karşılıklı Değerlendirme**: Modeller birbirlerinin yanıtlarını anonim olarak puanlar / Models rank each other's responses anonymously
3. **Nihai Sentez**: Başkan tüm yanıtları ve puanlamaları analiz ederek nihai cevabı oluşturur / Chairman synthesizes the final definitive answer

### Konsey Kadroları / Council Presets
- **Premium Kadro**: GPT-4o, Claude 3.5 Sonnet, Gemini Flash, DeepSeek V3 — hız ve kalite dengesi
- **Ücretsiz Kadro**: Gemini Flash, Llama 4 Maverick, Llama 3.3 70B, Qwen3 235B — sıfır maliyet

*Premium Cadre: Speed + quality balance. Free Cadre: Zero cost with best free models.*

### Diğer Özellikler / Other Features
- **Çoklu Dil**: Türkçe / İngilizce arayüz desteği / Turkish & English UI
- **Karanlık/Aydınlık Tema**: Tek tıkla tema değişimi / Dark & Light mode
- **Konsey Hafızası**: Son 10 mesaj bağlam olarak tutulur / Last 10 messages kept as context
- **Canlı İlerleme**: Modellerin yanıtları sırasında anlık durum takibi / Real-time progress tracking
- **Dinamik Başlıklar**: Sohbet başlıkları otomatik oluşturulur / Auto-generated conversation titles
- **Model Kataloğu**: Fiyat, hız ve marka bazlı model filtreleme / Filter models by price, speed, brand
- **Resmi Logolar**: Google, OpenAI, Anthropic gibi sağlayıcıların SVG logoları / Official brand logos
- **API Anahtar Yönetimi**: Sistem Durumu panelinden anahtar güncelleyebilirsiniz / Update API key from System Status panel
- **Özel Model Ekleme**: Katalogda olmayan modelleri elle ekleyebilirsiniz / Manually add models not in catalog

---

## Ücretsiz vs Ücretli / Free vs Paid

Ücretsiz modeller (`:free` uzantılı) çalışır ancak hız sınırları (429 hatası) olabilir. OpenRouter hesabınıza **$5** bakiye yüklerseniz:
- Hız sınırları kalkar / Rate limits removed
- Daha güçlü modeller kullanılabilir / Access to stronger models
- Konsey çok daha hızlı çalışır / Council runs much faster

*Free models work but may hit rate limits. Adding $5 credit removes limits and unlocks faster, more powerful models.*

---

## Sorun Giderme / Troubleshooting

| Hata / Error | Çözüm / Solution |
|---|---|
| `ModuleNotFoundError` | `.venv` klasörünü silip tekrar başlatın / Delete `.venv` and restart |
| 402 / 404 hatası | Ayarlardan modelleri güncelleyin / Update models in settings |
| 429 Rate Limit | Bakiye yükleyin veya $10 kredi ekleyin / Add credits to your account |
| Başlık güncellenmiyor | Sayfayı F5 ile yenileyin / Refresh the page |

---

## Teknolojiler / Tech Stack

| Katman / Layer | Teknoloji / Technology |
|---|---|
| Frontend | React + Vite |
| Backend | FastAPI + Python |
| API | OpenRouter (multi-model gateway) |
| Depolama / Storage | JSON dosya tabanlı / JSON file-based |

---

## Proje Yapısı / Project Structure
```
BuyukKonsey/
├── backend/
│   ├── main.py          # FastAPI endpoints
│   ├── council.py       # 3-stage council logic
│   ├── openrouter.py    # OpenRouter API client
│   ├── config.py        # Configuration & model defaults
│   └── storage.py       # JSON conversation storage
├── frontend/
│   └── src/
│       ├── App.jsx      # Main application
│       ├── api.js       # API client
│       ├── i18n.js      # Translations (TR/EN)
│       └── components/  # UI components
├── start.sh             # Linux/Mac launcher
├── start.bat            # Windows launcher
├── .env.example         # Environment template
└── README.md
```

---

Developed by [Hüseyin Emre](https://github.com/HuseyinEmreTech)
