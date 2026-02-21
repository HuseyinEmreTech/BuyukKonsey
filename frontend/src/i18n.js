const translations = {
  en: {
    // Sidebar
    'sidebar.title': 'LLM Council',
    'sidebar.newConversation': '+ New Conversation',
    'sidebar.noConversations': 'No conversations yet',
    'sidebar.messages': 'messages',
    'sidebar.newConvTitle': 'New Conversation',
    'sidebar.theme': 'Theme',
    'sidebar.language': 'Language',
    'sidebar.dark': '🌙 Dark',
    'sidebar.light': '☀️ Light',
    'sidebar.help': 'How it works?',
    'sidebar.settings': 'Settings',
    'sidebar.langNameEn': '🇬🇧 English',
    'sidebar.langNameTr': '🇹🇷 Turkish',

    // Settings
    'settings.title': 'Model Configuration',
    'settings.councilTitle': 'Council Members',
    'settings.councilDesc': 'Select models that will provide initial responses and rank each other.',
    'settings.chairmanTitle': 'Council Chairman',
    'settings.chairmanDesc': 'Select the model that will synthesize the final definitive answer.',
    'settings.searchPlaceholder': 'Search models...',
    'settings.save': 'Save Settings',
    'settings.loading': 'Loading models...',
    'settings.error': 'Failed to load models.',
    'settings.success': 'Settings saved successfully!',

    // ChatInterface
    'chat.welcome': 'Welcome to LLM Council',
    'chat.welcomeDesc': 'Create a new conversation to get started',
    'chat.startConversation': 'Start a conversation',
    'chat.startDesc': 'Ask a question to consult the LLM Council',
    'chat.you': 'You',
    'chat.council': 'LLM Council',
    'chat.stage1Loading': 'Running Stage 1: Collecting individual responses...',
    'chat.stage2Loading': 'Running Stage 2: Peer rankings...',
    'chat.stage3Loading': 'Running Stage 3: Final synthesis...',
    'chat.consulting': 'Consulting the council...',
    'chat.placeholder': 'Ask your question... (Shift+Enter for new line, Enter to send)',
    'chat.send': 'Send',

    // Stage 1
    'stage1.title': 'Stage 1: Individual Responses',

    // Stage 2
    'stage2.title': 'Stage 2: Peer Rankings',
    'stage2.rawEvaluations': 'Raw Evaluations',
    'stage2.description': 'Each model evaluated all responses (anonymized as Response A, B, C, etc.) and provided rankings. Below, model names are shown in',
    'stage2.descBold': 'bold',
    'stage2.descEnd': 'for readability, but the original evaluation used anonymous labels.',
    'stage2.extractedRanking': 'Extracted Ranking:',
    'stage2.aggregateTitle': 'Aggregate Rankings (Street Cred)',
    'stage2.aggregateDesc': 'Combined results across all peer evaluations (lower score is better):',
    'stage2.avg': 'Avg',
    'stage2.votes': 'votes',

    // Stage 3
    'stage3.title': 'Stage 3: Final Council Answer',
    'stage3.chairman': 'Chairman',

    // Onboarding
    'tutorial.title': 'Welcome to the LLM Council!',
    'tutorial.step1.title': '1. First Opinions (Stage 1)',
    'tutorial.step1.desc': 'Your question is sent to three different elite AI models at once. Each provides its own independent expert perspective. You can explore these initial answers in the Stage 1 tabs.',
    'tutorial.step2.title': '2. Blind Peer Review (Stage 2)',
    'tutorial.step2.desc': 'This is where the magic happens! Every model reviews and scores its peers anonymously. This process helps filter out errors, identifies the most logical reasoning, and builds a "Street Cred" ranking.',
    'tutorial.step3.title': '3. Final Synthesis (Stage 3)',
    'tutorial.step3.desc': 'The Council Chairman — a specialized power model — reviews all initial answers and the peer rankings. It then synthesizes the definitive final response, drawing from the best points of the entire council.',
    'tutorial.close': 'Let\'s Start!',
    'tutorial.next': 'Next',
    'tutorial.prev': 'Previous',
    'tutorial.skip': 'Skip',

    // System Status
    'status.title': 'System Status',
    'status.apiRunning': 'API IS RUNNING',
    'status.apiOutputs': 'Latest API Outputs',
    'status.refresh': 'Refresh Status',
    'status.close': 'Close Status',

    // Settings Refinement
    'settings.freeTierInfo': 'OpenRouter Free Tier Note: With $0 balance, only models with ":free" suffix work (e.g., google/gemini-2.0-flash-exp:free). Others will return a 402 error.',
  },

  tr: {
    // Sidebar
    'sidebar.title': 'Büyük Konsey',
    'sidebar.newConversation': '+ Yeni Sohbet',
    'sidebar.noConversations': 'Henüz sohbet yok',
    'sidebar.messages': 'mesaj',
    'sidebar.newConvTitle': 'Yeni Sohbet',
    'sidebar.theme': 'Tema',
    'sidebar.language': 'Dil',
    'sidebar.dark': '🌙 Karanlık',
    'sidebar.light': '☀️ Aydınlık',
    'sidebar.help': 'Nasıl Çalışır?',
    'sidebar.settings': 'Ayarlar',
    'sidebar.langNameEn': '🇬🇧 İngilizce',
    'sidebar.langNameTr': '🇹🇷 Türkçe',

    // Settings
    'settings.title': 'Model Yapılandırması',
    'settings.councilTitle': 'Konsey Üyeleri',
    'settings.councilDesc': 'İlk yanıtları verecek ve birbirini puanlayacak modelleri seçin.',
    'settings.chairmanTitle': 'Konsey Başkanı',
    'settings.chairmanDesc': 'Nihai kesin yanıtı sentezleyecek modeli seçin.',
    'settings.searchPlaceholder': 'Model ara...',
    'settings.save': 'Ayarları Kaydet',
    'settings.loading': 'Modeller yükleniyor...',
    'settings.error': 'Modeller yüklenemedi.',
    'settings.success': 'Ayarlar başarıyla kaydedildi!',

    // ChatInterface
    'chat.welcome': 'Büyük Konsey\'e Hoş Geldiniz',
    'chat.welcomeDesc': 'Başlamak için yeni bir sohbet oluşturun',
    'chat.startConversation': 'Bir sohbet başlatın',
    'chat.startDesc': 'Büyük Konsey\'e danışmak için bir soru sorun',
    'chat.you': 'Siz',
    'chat.council': 'Büyük Konsey',
    'chat.stage1Loading': 'Aşama 1 çalışıyor: Bireysel yanıtlar toplanıyor...',
    'chat.stage2Loading': 'Aşama 2 çalışıyor: Karşılıklı değerlendirme...',
    'chat.stage3Loading': 'Aşama 3 çalışıyor: Son sentez yapılıyor...',
    'chat.consulting': 'Konsey\'e danışılıyor...',
    'chat.placeholder': 'Sorunuzu yazın... (Shift+Enter yeni satır, Enter gönder)',
    'chat.send': 'Gönder',

    // Stage 1
    'stage1.title': 'Aşama 1: Bireysel Yanıtlar',

    // Stage 2
    'stage2.title': 'Aşama 2: Karşılıklı Değerlendirme',
    'stage2.rawEvaluations': 'Ham Değerlendirmeler',
    'stage2.description': 'Her model tüm yanıtları değerlendirdi (Yanıt A, B, C olarak anonimleştirilmiş) ve sıralama yaptı. Aşağıda model isimleri okunabilirlik için',
    'stage2.descBold': 'kalın',
    'stage2.descEnd': 'olarak gösterilmiştir, ancak orijinal değerlendirmede anonim etiketler kullanılmıştır.',
    'stage2.extractedRanking': 'Çıkarılan Sıralama:',
    'stage2.aggregateTitle': 'Toplam Sıralama (İtibar Puanı)',
    'stage2.aggregateDesc': 'Tüm değerlendirmelerin birleştirilmiş sonuçları (düşük puan daha iyi):',
    'stage2.avg': 'Ort',
    'stage2.votes': 'oy',

    // Stage 3
    'stage3.title': 'Aşama 3: Konsey\'in Nihai Yanıtı',
    'stage3.chairman': 'Başkan',

    // Onboarding
    'tutorial.title': 'Büyük Konsey\'e Hoş Geldiniz!',
    'tutorial.step1.title': '1. İlk Uzman Görüşleri (Aşama 1)',
    'tutorial.step1.desc': 'Sorunuz aynı anda üç farklı elit yapay zeka modeline gönderilir. Her biri kendi bağımsız uzmanlık perspektifini sunar. Bu ham yanıtları Aşama 1 sekmesinde detaylıca inceleyebilirsiniz.',
    'tutorial.step2.title': '2. Kör Hakem Değerlendirmesi (Aşama 2)',
    'tutorial.step2.desc': 'İşin tılsımı burada! Her model, meslektaşlarının yanıtlarını anonim olarak inceler ve puanlar. Bu süreç hataları eler, en güçlü mantığı belirler ve modeller arası bir "İtibar Sıralaması" (Street Cred) oluşturur.',
    'tutorial.step3.title': '3. Büyük Sentez (Aşama 3)',
    'tutorial.step3.desc': 'Konsey Başkanı — özel bir yetkin model — tüm ham yanıtları ve modellerin birbirine verdiği puanları inceler. Ardından, konseyin sunduğu en iyi noktalardan süzülen "Nihai Kesin Cevap"ı Aşama 3\'te oluşturur.',
    'tutorial.close': 'Başlayalım!',
    'tutorial.next': 'İleri',
    'tutorial.prev': 'Geri',
    'tutorial.skip': 'Atla',

    // System Status
    'status.title': 'Sistem Durumu',
    'status.apiRunning': 'API ÇALIŞIYOR',
    'status.apiOutputs': 'Son API Çıktıları',
    'status.refresh': 'Durumu Yenile',
    'status.close': 'Kapat',

    // Settings Refinement
    'settings.freeTierInfo': 'OpenRouter Ücretsiz Kullanım Notu: 0$ bakiyeniz varsa sadece ":free" uzantılı modeller (örn: google/gemini-2.0-flash-exp:free) çalışır. Diğerleri 402 hatası verecektir.',
  },
};

export function getTranslation(lang, key) {
  return translations[lang]?.[key] || translations['en']?.[key] || key;
}

export default translations;
