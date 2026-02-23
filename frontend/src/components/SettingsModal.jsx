import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../api';
import './SettingsModal.css';

// Brand info mapping based on model ID prefix
const getBrandInfo = (modelId) => {
    const id = modelId.toLowerCase();
    if (id.includes('openai/')) return { icon: '🟢', brand: 'OpenAI', bg: 'rgba(16, 163, 127, 0.15)', color: '#10a37f', desc: 'Güçlü Analiz & Mükemmel Kodlama' };
    if (id.includes('anthropic/')) return { icon: '🟤', brand: 'Anthropic', bg: 'rgba(217, 119, 87, 0.15)', color: '#d97757', desc: 'İnsan Benzeri Kalite & Uzun Bağlam' };
    if (id.includes('google/')) return { icon: '🔵', brand: 'Google', bg: 'rgba(66, 133, 244, 0.15)', color: '#8ab4f8', desc: 'Yüksek Hız & Anında Cevap' };
    if (id.includes('meta-llama/')) return { icon: '🥽', brand: 'Meta', bg: 'rgba(6, 104, 225, 0.15)', color: '#6fb5ff', desc: 'Açık Kaynak Lideri & Tutarlı' };
    if (id.includes('x-ai/')) return { icon: '✖️', brand: 'xAI', bg: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', desc: 'Gerçek Zamanlı Veri & Zeka' };
    if (id.includes('deepseek/')) return { icon: '🐋', brand: 'DeepSeek', bg: 'rgba(77, 105, 236, 0.15)', color: '#4d69ec', desc: 'Matematik & Gelişmiş Kodlama' };
    if (id.includes('mistralai/')) return { icon: '🌪️', brand: 'Mistral', bg: 'rgba(251, 169, 25, 0.15)', color: '#fba919', desc: 'Avrupa Çıkışlı & Etkili' };
    if (id.includes('cohere/')) return { icon: '🪨', brand: 'Cohere', bg: 'rgba(57, 89, 77, 0.15)', color: '#88a399', desc: 'Kurumsal Seviye Mantık' };
    if (id.includes('nousresearch/')) return { icon: '🧠', brand: 'Nous', bg: 'rgba(255, 100, 100, 0.15)', color: '#ff6464', desc: 'Topluluk Odaklı & Özgür' };
    return { icon: '🤖', brand: 'Diğer', bg: 'var(--bg-secondary)', color: 'var(--text-secondary)', desc: 'Ekstra Topluluk Modeli' };
};

export default function SettingsModal({ isOpen, onClose }) {
    const { t } = useLanguage();
    const [councilModels, setCouncilModels] = useState([]);
    const [chairmanModel, setChairmanModel] = useState('');
    const [availableModels, setAvailableModels] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [customModel, setCustomModel] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // Load both settings and available models concurrently
            const [settings, models] = await Promise.all([
                api.getSettings(),
                api.getAvailableModels().catch(() => []) // Fallback to empty if api fails
            ]);

            setCouncilModels(settings.council_models || []);
            setChairmanModel(settings.chairman_model || '');

            // Validate if array otherwise empty list
            setAvailableModels(Array.isArray(models) ? models : []);
        } catch (error) {
            console.error('Error loading settings/models:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        const filteredCouncil = councilModels.filter(m => m && m.trim() !== '');
        if (filteredCouncil.length === 0) return;

        setIsSaving(true);
        try {
            await api.updateSettings({
                council_models: filteredCouncil,
                chairman_model: chairmanModel && chairmanModel.trim() !== '' ? chairmanModel.trim() : filteredCouncil[0]
            });
            onClose();
        } catch (error) {
            console.error('Error saving settings:', error);
            alert(t('settings.error'));
        } finally {
            setIsSaving(false);
        }
    };

    const removeCouncilModel = (idToRemove) => {
        setCouncilModels(councilModels.filter(id => id !== idToRemove));
    };

    const addCouncilModel = (id) => {
        if (!councilModels.includes(id)) {
            setCouncilModels([...councilModels, id]);
        }
    };

    const handleAutoSelectPremium = () => {
        // En iyi, rasyonel, premium modellerden oluşan bir rüya takımı
        const premiumModels = [
            'anthropic/claude-3.5-sonnet',      // Mükemmel Sentez, İletişim, Mantık
            'openai/gpt-4o',                   // Genel Zeka, Kodlama
            'deepseek/deepseek-r1',            // Derin Mantık, Matematik (Premium versiyonu)
            'meta-llama/llama-3.3-70b-instruct' // Açık Kaynak Lideri, Tutarlı Yargıç
        ];

        // Sadece mevcut olanları bulup ekle, yoksa sorun çıkartma
        const availablePremium = availableModels
            .filter(m => premiumModels.includes(m.id))
            .map(m => m.id);

        if (availablePremium.length > 0) {
            setCouncilModels(availablePremium);
            // Başkanı her zaman genel geçer mantık harikası Sonnet 3.5 yap
            if (availablePremium.includes('anthropic/claude-3.5-sonnet')) {
                setChairmanModel('anthropic/claude-3.5-sonnet');
            } else {
                setChairmanModel(availablePremium[0]);
            }
        } else {
            alert('En iyi modeller listesi API üzerinden çekilemedi. Tekrar deneyin.');
        }
    };

    const handleAddCustomModel = (e) => {
        e.preventDefault();
        if (customModel.trim() && !councilModels.includes(customModel.trim())) {
            setCouncilModels([...councilModels, customModel.trim()]);
            setCustomModel('');
        }
    };

    // Filter models based on search query and active tab
    const filteredModels = useMemo(() => {
        let result = availableModels;

        // Tab filtering
        if (activeTab !== 'All') {
            result = result.filter(m => getBrandInfo(m.id).brand === activeTab);
        }

        // Search filtering
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(m =>
                m.name.toLowerCase().includes(query) ||
                m.id.toLowerCase().includes(query)
            );
        }

        return result;
    }, [availableModels, searchQuery, activeTab]);

    const TABS = ['All', 'OpenAI', 'Anthropic', 'Google', 'Meta', 'DeepSeek', 'xAI', 'Mistral', 'Cohere', 'Nous', 'Diğer'];

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content settings-modal glass-effect">
                <button className="modal-close" onClick={onClose}>&times;</button>

                <h2 className="settings-title">✨ Modelleri Yapılandır</h2>

                {isLoading ? (
                    <div className="settings-loading">
                        <div className="spinner"></div>
                        <p style={{ marginTop: '12px' }}>Modeller yükleniyor...</p>
                    </div>
                ) : (
                    <div className="settings-body">

                        {/* 1. SEÇİLİ ÖZET */}
                        <div className="selected-summary-panel">

                            {/* Konsey Üyeleri */}
                            <div className="summary-section">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <label style={{ marginBottom: 0 }}>⚖️ Seçili Konsey Üyeleri ({councilModels.length})</label>
                                    <button
                                        onClick={handleAutoSelectPremium}
                                        className="magic-btn"
                                        title="Bakiyeniz varsa, OpenAI, Anthropic ve DeepSeek'in en iyilerinden şampiyonlar ligi kurar."
                                    >
                                        ✨ Premium Kadro Kur
                                    </button>
                                </div>
                                <div className="chips-container">
                                    {councilModels.length === 0 && <span className="empty-chip">Henüz konsey üyesi seçilmedi</span>}
                                    {councilModels.map(modelId => (
                                        <div key={`c-${modelId}`} className="model-chip" title={modelId}>
                                            <span className="chip-brand">{getBrandInfo(modelId).icon}</span>
                                            <span className="chip-text">{modelId.split('/').pop()}</span>
                                            <button className="chip-remove" onClick={() => removeCouncilModel(modelId)}>&times;</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Başkan */}
                            <div className="summary-section">
                                <label>👑 Konsey Başkanı</label>
                                <div className="chips-container">
                                    {chairmanModel ? (
                                        <div className="model-chip chairman-chip" title={chairmanModel}>
                                            <span className="chip-brand">{getBrandInfo(chairmanModel).icon}</span>
                                            <span className="chip-text">{chairmanModel.split('/').pop()}</span>
                                            <button className="chip-remove" onClick={() => setChairmanModel('')}>&times;</button>
                                        </div>
                                    ) : (
                                        <span className="empty-chip warning">⚠️ Başkan seçilmedi (İlk konsey üyesi atanır)</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. MODEL ARAMA VE SEÇME IZGARASI */}
                        <div className="model-picker-section">
                            <div className="picker-header">
                                <h3>Katalogdan Model Seçin</h3>
                                <input
                                    type="text"
                                    className="model-search-input"
                                    placeholder="🔍 Sistemde Ara..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* TABS */}
                            <div className="brand-tabs">
                                {TABS.map(tab => (
                                    <button
                                        key={tab}
                                        className={`brand-tab ${activeTab === tab ? 'active' : ''}`}
                                        onClick={() => setActiveTab(tab)}
                                        title={tab === 'All' ? 'Tüm Modeller' : tab}
                                    >
                                        {tab === 'All' ? 'Tümü' : tab}
                                    </button>
                                ))}
                            </div>

                            <div className="model-grid">
                                {availableModels.length === 0 ? (
                                    <div className="models-error">
                                        Modeller API'den çekilemedi. Özel ekleme kutusunu kullanabilirsiniz.
                                    </div>
                                ) : filteredModels.length === 0 ? (
                                    <div className="models-error">Aradığınız model bulunamadı.</div>
                                ) : (
                                    filteredModels.map(model => {
                                        const isCouncil = councilModels.includes(model.id);
                                        const isChairman = chairmanModel === model.id;
                                        const brand = getBrandInfo(model.id);

                                        return (
                                            <div key={model.id} className={`model-card ${isCouncil ? 'selected-council' : ''} ${isChairman ? 'selected-chairman' : ''}`}>
                                                <div className="model-card-header" style={{ backgroundColor: brand.bg }}>
                                                    <span className="model-icon">{brand.icon}</span>
                                                    <span className="model-brand" style={{ color: brand.color }}>{brand.brand}</span>
                                                </div>
                                                <div className="model-card-body">
                                                    <h4 title={model.name}>{model.name.split(': ').pop() || model.name}</h4>
                                                    <div className="model-id" title={model.id}>{model.id.split('/').pop()}</div>
                                                    <div className="model-desc">{brand.desc}</div>
                                                </div>
                                                <div className="model-card-actions">
                                                    <button
                                                        className={`card-btn council-btn ${isCouncil ? 'active' : ''}`}
                                                        onClick={() => isCouncil ? removeCouncilModel(model.id) : addCouncilModel(model.id)}
                                                    >
                                                        {isCouncil ? '✓ Konseyde' : '+ Konseye Ekle'}
                                                    </button>
                                                    <button
                                                        className={`card-btn chairman-btn ${isChairman ? 'active' : ''}`}
                                                        onClick={() => setChairmanModel(isChairman ? '' : model.id)}
                                                    >
                                                        {isChairman ? '👑 Başkan' : 'Başkan Yap'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* 3. MANUEL MODEL EKLEME */}
                        <form className="custom-model-adder" onSubmit={handleAddCustomModel}>
                            <label>Katalogda Olmayan Özel Model Ekle:</label>
                            <div className="custom-input-group">
                                <input
                                    type="text"
                                    placeholder="örn: anthropic/claude-3-opus:beta"
                                    value={customModel}
                                    onChange={e => setCustomModel(e.target.value)}
                                />
                                <button type="submit" disabled={!customModel.trim()}>Ekle</button>
                            </div>
                        </form>

                    </div>
                )}

                <div className="settings-footer">
                    <div className="dev-credit" style={{ fontSize: '12px', color: 'var(--text-muted)', flex: 1 }}>
                        Built with 🔥 by <strong>Hüseyin Emre</strong>
                    </div>
                    <button className="settings-btn secondary" onClick={onClose}>{t('status.close')}</button>
                    <button
                        className="settings-btn primary"
                        onClick={handleSave}
                        disabled={isSaving || councilModels.filter(m => m.trim() !== '').length === 0}
                    >
                        {isSaving ? '...' : t('settings.save')}
                    </button>
                </div>
            </div>
        </div>
    );
}
