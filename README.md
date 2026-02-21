# Büyük Konsey (LLM Council) - Premium Sürüm

![Büyük Konsey Header](header.jpg)

Bu projenin ana fikri, favori LLM sağlayıcınıza tekil bir soru sormak yerine, onlardan oluşan bir **"Büyük Konsey"** kurabilmenizdir. Bu uygulama, ChatGPT'ye benzeyen modern ve premium bir web arayüzüdür; ancak sorgunuzu birden fazla LLM'e (Aşama 1) gönderir, ardından onlardan birbirlerinin çalışmalarını anonim olarak inceleyip sıralamalarını (Aşama 2) ister ve son olarak "Konsey Başkanı" nihai, sentezlenmiş yanıtı (Aşama 3) üretir.

---

## 💎 Öne Çıkan Yeni Özellikler

### 1. Glassmorphism (Premium UI)
Arayüz, modern **buzlu cam (frosted glass)** efekti ile baştan tasarlandı. Indigo ve Violet gradyanları ile zenginleştirilmiş, estetik bir derinlik hisse sahip karanlık ve aydınlık tema desteği sunar.

### 2. 📊 Sistem Durumu & API İzleme
Sol alttaki buton aracılığıyla erişilebilen bu panelde:
- Backend sunucusunun aktiflik durumunu (`Online/Offline`) görebilirsiniz.
- Atılan son API isteklerini ve OpenRouter'dan gelen yanıtları (JSON) canlı olarak izleyebilirsiniz.
- Hataları (Bakiye yetersizliği, Rate Limit vb.) teknik olarak takip edebilirsiniz.

### 3. 🛡️ Dayanıklı Backend & Hata Yönetimi
OpenRouter'ın ücretsiz katmanındaki zorluklara (429 Too Many Requests, 402 Payment Required) karşı dayanıklıdır:
- **Kademeli İstekler**: Rate limit aşımını önlemek için isteklere milimetrik gecikmeler eklenmiştir.
- **Hata Toleransı**: Bir model yanıt vermese bile konsey dağılmaz; hata kullanıcıya bildirilir ve diğer modellerle süreç tamamlanır.

### 4. 🚀 Tek Tıkla Başlatma (`start.sh`)
Kurulum ve terminal karmaşasına son! Proje kök dizinindeki `./start.sh` dosyasını çalıştırarak hem backend'i hem frontend'i tek seferde ayağa kaldırabilirsiniz.

---

## 🛠️ Nasıl Çalışır?

1.  **Aşama 1: İlk Görüşler.** Sorgunuz seçilen tüm elit modellere gönderilir.
2.  **Aşama 2: Akran Değerlendirmesi.** Modeller birbirlerinin yanıtlarını anonim olarak puanlar ve bir "İtibar Sıralaması" (Street Cred) oluşturur.
3.  **Aşama 3: Büyük Sentez.** Konsey Başkanı, tüm verileri süzerek "Nihai Kesin Cevap"ı oluşturur.

---

## 🚀 Hızlı Başlangıç

1.  **API Anahtarı**: Kök dizinde `.env` dosyası oluşturun ve anahtarınızı ekleyin:
    ```bash
    OPENROUTER_API_KEY=sk-or-v1-...
    ```
2.  **Tek Komutla Çalıştır**:
    ```bash
    chmod +x start.sh
    ./start.sh
    ```

---

## ⚙️ Modelleri Yapılandırın
Konsey üyelerini ve Başkanı uygulama içindeki **Ayarlar (Settings ⚙️)** paneli üzerinden dinamik olarak değiştirebilirsiniz. Ücretsiz kullanım (0$ bakiye) için sadece sonu `:free` ile biten modelleri (örn: `google/gemini-2.0-flash-exp:free`) seçtiğinizden emin olun.

## 🔑 Vibe Code & İlham
Bu proje, yapay zekaların birbirlerini yargılamasının ne kadar şaşırtıcı sonuçlar doğurabileceğini görmek amacıyla geliştirilmiş bir **"Vibe Coding"** eseridir. Kod geçicidir, fikir kalıcıdır. İyi konseyler!
