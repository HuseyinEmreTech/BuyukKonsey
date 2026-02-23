# Büyük Konsey (LLM Council) - Premium Sürüm

![Büyük Konsey Header](header.jpg)

Bu proje, tek bir yapay zekaya (ChatGPT gibi) soru sormak yerine, kendi "Büyük Konseyinizi" kurmanızı sağlar. Sorunuz aynı anda **3 farklı yapay zeka modeline** gider. Modeller önce kendi cevaplarını yazar, sonra birbirlerinin cevaplarını okuyup puanlar, en sonunda da "Başkan", tüm bu süreci harmanlayıp size en kusursuz ve kesin cevabı sunar. 

---

## 🚀 Yeni Başlayanlar İçin Kurulum Rehberi (Adım Adım)

Bu projeyi bilgisayarınızda çalıştırmak sandığınızdan çok daha kolaydır! Sadece şu 3 basit adımı izleyin:

### 1️⃣ Gerekli Programları İndirin (Eğer yoksa)
Bilgisayarınızda şu iki programın kurulu olması gerekir. Yüklü değillerse indirip "İleri, İleri" diyerek klasik şekilde kurun:
- **Python**: [Resmi sitesinden indirin](https://www.python.org/downloads/)
- **Node.js**: [Resmi sitesinden indirin](https://nodejs.org/en/)

### 2️⃣ API Anahtarı Alın (Sistemin Şifresi)
Büyük Konsey'deki modellerin çalışabilmesi için OpenRouter sisteminden ücretsiz bir şifre (API Key) almanız gerekiyor.
1. [OpenRouter.ai](https://openrouter.ai/) sitesine gidin ve hesap açın.
2. Sağ üstten profilinize tıklayıp **"Keys" (Anahtarlar)** veya doğrudan **[API Keys Sayfasına](https://openrouter.ai/keys)** gidin.
3. `Create Key` düğmesine basıp bir isim verin ve ekranda beliren uzun kodu `sk-or-v1-...` kopyalayın.

### 3️⃣ Şifreyi Projeye Ekleyin
1. Bu projenin kök (ana) klasöründe `settings.json` veya benzeri bir `.env` dosyası oluşturmalısınız.
2. Ana klasörde sağ tıklayıp yeni bir metin belgesi oluşturun, adını **tam olarak** `.env` yapın. (Önünde nokta olmalı, sonu txt falan olmamalı)
3. Dosyayı metin belgesi olarak açın ve içine şunu yapıştırın:
   ```env
   OPENROUTER_API_KEY=kopyaladıgınız-uzun-sifreyi-buraya-yapistirin
   ```
4. Dosyayı kaydedip kapatın.

### 4️⃣ Sistemi Başlatma (Her Şeyi O Halletsin)
Komut satırları veya tek tek dosyalarla uğraşmanıza gerek yok. İşletim sisteminize uygun olan tek-tık dosyasını çalıştırın:

**🍎 Mac / 🐧 Linux Kullanıcıları:**
Terminali proje klasöründe açın ve önce dosyaya çalışma izni verip ardından başlatın:
```bash
chmod +x start.sh
./start.sh
```

**🪟 Windows Kullanıcıları:**
Proje klasöründeki **`start.bat`** dosyasına çift tıklamanız yeterlidir. (Eğer açılmazsa Komut İstemini (CMD) klasörde açıp `start.bat` yazabilirsiniz).

Bu script sizin yerinize gerekli klasörleri kuracak, internet sayfasına (http://localhost:5173/) bağlanacak ve sistemi karşınızdaki tarayıcıda otomatik açacaktır.

---

## 💸 Ücretsiz (Bedava) Modeller mi, Premium (Ücretli) Modeller mi?

Proje içerisinde yer alan **Ayarlar (⚙️)** kısmından dilediğiniz yapay zekayı (GPT-4, Claude, Gemini vb.) konseye çağırabilirsiniz. OpenRouter üzerinde sonu `:free` ile biten düzinelerce **tamamen ücretsiz** model de mevcuttur. Ancak bilmeniz gereken **ÇOK KRİTİK** bir fark var:

### 😡 Ücretsiz (Free) Modellerin Dezavantajları (Rate Limit Hatası)
Ücretsiz modeller sistemde çalışır ancak OpenRouter, bedava sunuculara **katı hız sınırları (Rate Limit - 429 Hatası)** uygular. 
Yani Konsey aynı soruyu 3 modele aynı anda sormaya kalktığında veya siz saniyeler içinde cevap aradığınızda, sunucular "Çok hızlı soru soruyorsunuz!" deyip hata (429) verir ve konsey çöker. *Bunu aşmak için koda modelleri çok uzun süre bekleterek konuşturma taktikleri eklenmiştir fakat bu süreç konseyin çok yavaşlamasına neden olur.*

### 🚀 Neden Sadece 5$ (Bakiye) Yüklemelisiniz? (Önerilen)
Sistemi asıl potansiyeliyle, şimşek hızında ve mükemmel bir akılla kullanmak istiyorsanız; OpenRouter hesabınıza (Kredi kartı/Kripto ile) sadece **$5 (Dolar)** bakiye yüklemeniz yeterlidir. Neden mi?

1. **İnanılmaz Ucuzluk**: Premium modellerin (GPT-4o Mini, Claude 3.5 Haiku, Gemini 2.5 Flash) soru başı maliyeti **Kuruş bile değildir** ($0.005 ila $0.01 arası). Sadece $5 ile **500 ila 1000 üzerinde Büyük Konsey** dizebilirsiniz. 
2. **Kusursuz Hız**: Paralı bir müşteriye dönüştüğünüz an hız sınırları (Rate Limit 429) tamamen kalkar. 3 model birden aynı saniyede konuşur ve saniyeler içinde devasa kod analizlerini ve metinleri hatasız olarak ekranınıza dökerler.
3. **Gerçek Güç**: Bedava modeller kıyasla zayıf kalırken; $5 bakiye attığınızda Konsey Başkanı seviyesine dünyanın en zeki modeli olan **GPT-4o**'yu koyabilirsiniz. Sistemin kalitesi 10 kat artar.

---

## 💎 Diğer Premium Özellikler

- **Sohbet Otomasyonu**: Sorunuzun türüne göre (Türkçe, İngilizce), gelişmiş dil modelleri arka planda sorunuzu analiz edip çok şık dinamik isimler (Örn: "Karadelikler Nasıldır?") oluşturup sol sekmeye otomatik ekler.
- **Sohbet Silme**: Sol taraftaki menüde sohbet listelerinin üzerine farenizle geldiğinizde **Çöp Kutusu (🗑️)** ikonu belirir. Geçmiş konsey toplantılarınızı anında temizleyebilirsiniz.
- **Çoklu Dil (i18n)**: Yeni eklenen dil altyapısıyla sol alt menüden istediğiniz an Türkçe/İngilizce arayüz arası geçiş yapabilirsiniz. Sistemi nasıl kullanacağınızı anlatan "Yardım (❓)" paneli de dahil her şey sizin dilinizde olacaktır.

---

## 🚑 Sıkça Sorulan Sorular (Hata Çözümleri)

**Soru: Uygulama açılırken Backend (Siyah ekran/Konsol) çöküyor, "ModuleNotFoundError" veriyor.**
Cevap: Python sanal ortamı (`.venv`) düzgün kurulamamış olabilir. Proje klasöründeki `.venv` klasörünü manuel olarak silin ve sistemi (`start.sh` veya `start.bat`) yeniden çalıştırın. Eksik olan modüller baştan indirilecektir.

**Soru: Modellerden "Model XYZ Bulunamadı veya Ücretliye Döndü (402/404)" hatası alıyorum.**
Cevap: Ayarlar menüsünden `Ayarlar (⚙️)` seçtiğiniz bazı ücretsiz (`:free`) modeller OpenRouter tarafından yayından kaldırılmış olabilir. Menüyü açın, listedeki modelleri güvenilir güncel versiyonlarla (Örn: `google/gemini-2.0-flash-exp:free`) yenileyin ve **Kaydet**'e basın.

**Soru: Sol taraftaki menüde sohbetimin ismi hala "Yeni Sohbet" yazıyor, isimlendirme değişmiyor.**
Cevap: Dinamik isimlendirmeyi yapan API (Büyük ihtimalle OpenRouter üzerindeki ücretsiz bir kanal) "Rate Limit" engelinden (Çok hızlı sorgu atılmasından) dolayı ismi üretememiştir. Sadece sayfanızı bir kere F5 ile yenileyin.

---

## 🧭 Gelecek Hedefleri ve Vizyon

Projenin gelecekteki devasa hedefleri (Gerçek konsey senaryoları, daktilo gibi kelime kelime yazma, dosya yükleme, vb.) artık detaylı olarak **[ROADMAP.md](ROADMAP.md)** dosyasında tutulmaktadır.

Siz de projeyi geliştirmek veya sıradaki büyük güncellemenin ne olacağını görmek isterseniz `ROADMAP.md` dosyasını inceleyebilirsiniz.

---

## 🔒 Güvenlik & Stabilite Güncellemesi (v1.1)
Son yapılan güncellemelerle birlikte proje çok daha dayanıklı hale gelmiştir:
- **Tam Güvenlik:** API anahtarınız `.env` dosyasında güvende tutulur ve asla GitHub'a sızmaz. Dışarıdan dosya erişim (Path Traversal) açıkları tamamen kapatılmıştır.
- **Kesintisiz Akış:** Modeller çok uzun sürdüğünde çökmek yerine, ekranda zarif kırmızı hata mesajı (Zaman Aşımı / İçerik Sınırı Aşıldı) göstererek konseyi ayakta tutar.
- **Konsey Hafızası:** Konsey üyeleri artık son 10 mesajınızı hatırlar! Böylece "Söylediğin kodu tekrar değerlendir" gibi komutları sorunsuz yerine getirirler.
- **Daha Temiz Kod:** `storage.py` üzerinden asenkron dosya kilitleme (fcntl) ile veri kayıpları önlendi. Arayüz (`ChatInterface.jsx`) hata mesajlarını daha okunaklı şekilde gösterir.
- **Temiz Kurulum:** `.env.example` şablonu eklendi.

---
