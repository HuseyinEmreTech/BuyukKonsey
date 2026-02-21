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
Komut satırları veya kodlarla uğraşmanıza gerek yok. Proje klasörünüze gidin, Linux kullanıyorsanız terminali proje klasöründe açıp sadece şu komutu yazın:
```bash
./start.sh
```
Bu script sizin yerinize gerekli klasörleri kuracak, internet sayfasına (http://localhost:5173/) bağlanacak ve sistemi karşınıza getirecektir.

---

## 💸 Ücretsiz (Bedava) Modeller mi, Premium (Ücretli) Modeller mi?

Proje içerisinde yer alan **Ayarlar (⚙️)** kısmından dilediğiniz yapay zekayı (GPT-4, Claude, Gemini vb.) konseye çağırabilirsiniz. OpenRouter üzerinde sonu `:free` ile biten düzinelerce **tamamen ücretsiz** model de mevcuttur. Ancak bilmeniz gereken **ÇOK KRİTİK** bir fark var:

### 😡 Ücretsiz (Free) Modellerin Dezavantajları (Rate Limit Hatası)
Ücretsiz modeller sistemde çalışır ancak OpenRouter, bedava sitemine **katı hız sınırları (Rate Limit - 429 Hatası)** uygular. 
Yani Konsey aynı soruyu 3 modele aynı anda sormaya kalktığında veya saniyeler içinde cevap aradığında, ücretsiz sunucular "Çok hızlı soru soruyorsunuz, benden bu kadar çok işlem isteyemezsiniz!" deyip hata (429) verir ve konsey çöker. *Bunu aşmak için kodda soruyu çok yavaş ve sırayla sorma taktikleri vardır fakat bu da konseyin aşırı yavaşlamasına neden olur.*

### 🚀 Neden Sadece 5$ (Bakiye) Yüklemelisiniz? (Önerilen)
Sistemi asıl potansiyeliyle, şimşek hızında ve mükemmel bir akılla kullanmak istiyorsanız; OpenRouter hesabınıza (Kredi kartı/Kripto ile) sadece **$5 (Dolar)** bakiye yüklemeniz yeterlidir. Neden mi?

1. **İnanılmaz Ucuzluk**: Premium modellerin (GPT-4o Mini, Claude 3.5 Haiku, Gemini 2.5 Flash) soru başı maliyeti **Kuruş bile değildir** ($0.005 ila $0.01 arası). Sadece $5 ile **500 ila 1000 üzerinde Büyük Konsey** dizebilirsiniz. 
2. **Kusursuz Hız**: Paralı bir müşteriye dönüştüğünüz an hız sınırları (Rate Limit 429) tamamen kalkar. 3 model birden aynı saniyede konuşur ve saniyeler içinde devasa kod analizlerini ve özetleri hatasız olarak ekranınıza dökerler.
3. **Gerçek Güç**: Bedava modeller kıyasla zayıf kalırken; $5 bakiye attığınızda Konsey Başkanı seviyesine dünyanın en zeki môdeli olan **GPT-4o**'yu koyabilirsiniz. Sistemin kalitesi 10 kat artar.

---

## 💎 Diğer Premium Özellikler

- **Sohbet Otomasyonu**: Sorunuzun türüne göre (Türkçe, İngilizce), gelişmiş dil modelleri arka planda sorunuzu analiz edip çok şık dinamik isimler (Örn: "Karadelikler Nasıldır?") oluşturup sol sekmeye otomatik ekler.
- **Sohbet Silme**: Sol taraftaki menüde sohbet listelerinin üzerine farenizle geldiğinizde **Güzel bir Çöp Kutusu (🗑️)** ikonu belirir. Geçmiş konsey toplantılarınızı anında temizleyebilirsiniz.
- **Çoklu Dil (i18n)**: Yeni eklenen dil altyapısıyla sol alt menüden istediğiniz an Türkçe/İngilizce arayüz arası geçiş yapabilirsiniz. Sistemi nasıl kullanacağınızı anlatan "Yardım (❓)" özelliği de dahil her şey sizin dilinizde olacaktır.

## 🔑 Vibe Code & İlham
Bu proje, kodlama veya sistemden anlamayan sadece "Yapay zekalar kendi aralarında beni yorumlasa ne güzel bir akıl ortaya çıkardı" diyen vizyoner beyinlerin **"Vibe Coding"** mantığıyla üretilmiş, tam işlevsel gerçek bir yazılım eseridir. İyi konseyler!
