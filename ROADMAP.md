# Büyük Konsey - Gelecek Vizyonu (Roadmap)

Bu dosya, projenin temelleri (güvenlik, stabilite, hata yönetimi) sağlama alındıktan sonra eklenecek devasa özellikleri ve vizyoner fikirleri not etmek için oluşturulmuştur.

## 🌟 1. Vizyoner Özellikler (Agentic AI)
- [ ] **Gerçek Konsey Tartışması (Multi-Agent Debate):** 
  Modeller sadece sırayla çalışıp birbirini tek seferlik eleştirmesin. Tıpkı gerçek bir konsey gibi, "Sana katılmıyorum çünkü..." diyerek 2-3 tur karşılıklı tartışsınlar ve en son Başkan bu tartışmayı dinleyip karar versin.
- [ ] **Özelleştirilmiş Konsey Odaları (Personas):** 
  "Kodlama Konseyi", "Felsefe Konseyi" gibi ön tanımlı odalar yapılması. Gizli sistem komutlarıyla (System Prompt) modeller sadece o odaya özel bağlamda tartışsın.
- [ ] **Yerel Yapay Zeka (Ollama / Local LLM Desteği):** 
  Kullanıcıların kendi bilgisayarlarındaki yerel modelleri sisteme entegre edebilmesi. Hem ücretsiz hem tam gizlilik.

## ⚡ 2. Kullanıcı Deneyimi (UX) Şovları
- [ ] **Harf Harf Akış (Token Streaming):** 
  Modellerin cevabı bir bütün olarak gelmesin, daktilo gibi ekrana harf harf dökülsün (Streaming). Bu hız algısını ve kullanıcı bekleme deneyimini mükemmelleştirir.
- [ ] **Dosya/Belge Yükleme (RAG - Retrieval Augmented Generation):** 
  Sohbet kutusuna 📎 ataç ikonu eklenmesi. Kullanıcılar bir PDF dosyası veya kod parçası yüklediğinde, sadece o bağlam üzerinden tartışma yapılması.

## 🏗️ 3. Altyapı ve Profesyonelleşme
- [ ] **Gerçek Veritabanına Geçiş (SQLite / PostgreSQL):** 
  `storage.py` içindeki `.json` tabanlı mimariyi terk edip, binlerce sohbeti milisaniyede kaldıracak yapısal bir veritabanına geçiş.
- [ ] **Dockerization (Tek Tık Kurulum):** 
  İnsanların Python veya Node.js kurmasına gerek kalmadan, `docker-compose up` yazarak projeyi sıfır hata ile ayağa kaldırabilmesi.
