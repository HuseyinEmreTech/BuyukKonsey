import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../api';
import CouncilTable from './CouncilTable';
import BrandLogo from './BrandLogo';
import './SettingsModal.css';

// Brand info mapping based on model ID prefix
const getBrandInfo = (modelId) => {
    const id = modelId.toLowerCase();
    if (id.includes('openai/')) return { icon: <BrandLogo brand="OpenAI" />, brand: 'OpenAI', bg: 'rgba(16, 163, 127, 0.15)', color: '#10a37f', desc: 'Güçlü Analiz & Mükemmel Kodlama' };
    if (id.includes('anthropic/')) return { icon: <BrandLogo brand="Anthropic" />, brand: 'Anthropic', bg: 'rgba(217, 119, 87, 0.15)', color: '#d97757', desc: 'İnsan Benzeri Kalite & Uzun Bağlam' };
    if (id.includes('google/')) return { icon: <BrandLogo brand="Google" />, brand: 'Google', bg: 'rgba(66, 133, 244, 0.15)', color: '#8ab4f8', desc: 'Yüksek Hız & Anında Cevap' };
    if (id.includes('meta-llama/')) return { icon: <BrandLogo brand="Meta" />, brand: 'Meta', bg: 'rgba(6, 104, 225, 0.15)', color: '#6fb5ff', desc: 'Açık Kaynak Lideri & Tutarlı' };
    if (id.includes('x-ai/')) return { icon: <BrandLogo brand="xAI" />, brand: 'xAI', bg: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', desc: 'Gerçek Zamanlı Veri & Zeka' };
    if (id.includes('deepseek/')) return { icon: <BrandLogo brand="DeepSeek" />, brand: 'DeepSeek', bg: 'rgba(77, 105, 236, 0.15)', color: '#4d69ec', desc: 'Matematik & Gelişmiş Kodlama' };
    if (id.includes('mistralai/')) return { icon: <BrandLogo brand="Mistral" />, brand: 'Mistral', bg: 'rgba(251, 169, 25, 0.15)', color: '#fba919', desc: 'Avrupa Çıkışlı & Etkili' };
    if (id.includes('cohere/')) return { icon: <BrandLogo brand="Default" />, brand: 'Cohere', bg: 'rgba(57, 89, 77, 0.15)', color: '#88a399', desc: 'Kurumsal Seviye Mantık' };
    if (id.includes('nousresearch/')) return { icon: <BrandLogo brand="Default" />, brand: 'Nous', bg: 'rgba(255, 100, 100, 0.15)', color: '#ff6464', desc: 'Topluluk Odaklı & Özgür' };
    if (id.includes('qwen/')) return { icon: <BrandLogo brand="Default" />, brand: 'Qwen', bg: 'rgba(115, 75, 226, 0.15)', color: '#9b7dff', desc: 'Çok Dilli & Güçlü Kodlama' };
    return { icon: <BrandLogo brand="Default" />, brand: 'Diğer', bg: 'var(--bg-secondary)', color: 'var(--text-secondary)', desc: 'Ekstra Topluluk Modeli' };
};

export default function SettingsModal({ isOpen, onClose }) {
    const { t } = useLanguage();
    const [councilModels, setCouncilModels] = useState([]);
    const [chairmanModel, setChairmanModel] = useState('');
    const [availableModels, setAvailableModels] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState('All');
    const [speedFilter, setSpeedFilter] = useState('All');
    const [brandFilter, setBrandFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [customModel, setCustomModel] = useState('');

    const getModelName = (modelId) => {
        const modelObj = availableModels.find(m => m.id === modelId);
        return modelObj ? (modelObj.name.split(': ').pop() || modelObj.name) : modelId.split('/').pop();
    };

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
            setIsSaving('success');
            setTimeout(() => {
                onClose();
                setIsSaving(false);
            }, 600);
        } catch (error) {
            console.error('Error saving settings:', error);
            alert(t('settings.error'));
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
        // Premium: Hız + Kalite dengesi (hızlı ama güçlü modeller)
        const premiumModels = [
            'openai/gpt-4o',                       // Hızlı, genel zeka lideri
            'anthropic/claude-3.5-sonnet',         // Hızlı, mükemmel sentez
            'google/gemini-2.0-flash-exp',         // Ultra hızlı, kaliteli
            'deepseek/deepseek-chat',              // Hızlı V3, güçlü kodlama
        ];

        const availablePremium = availableModels
            .filter(m => premiumModels.includes(m.id))
            .map(m => m.id);

        if (availablePremium.length > 0) {
            setCouncilModels(availablePremium);
            if (availablePremium.includes('anthropic/claude-3.5-sonnet')) {
                setChairmanModel('anthropic/claude-3.5-sonnet');
            } else {
                setChairmanModel(availablePremium[0]);
            }
        } else {
            alert('Premium modeller API üzerinden çekilemedi. Tekrar deneyin.');
        }
    };

    const handleAutoSelectFree = () => {
        // Ücretsiz: Hız + Kalite dengesi (sıfır maliyet, hızlı modeller)
        const freeModels = [
            'google/gemini-2.0-flash-exp:free',            // Ultra hızlı, ücretsiz
            'meta-llama/llama-4-maverick:free',             // Yeni nesil Llama, hızlı
            'meta-llama/llama-3.3-70b-instruct:free',      // Kanıtlanmış, tutarlı
            'qwen/qwen3-235b-a22b:free',                   // Çok dilli, güçlü
        ];

        // Fallback listesi
        const fallbackFreeModels = [
            'google/gemini-2.0-pro-exp-02-05:free',
            'deepseek/deepseek-chat:free',
            'qwen/qwen3-coder:free',
        ];

        let availableFree = availableModels
            .filter(m => freeModels.includes(m.id))
            .map(m => m.id);

        if (availableFree.length === 0) {
            availableFree = availableModels
                .filter(m => fallbackFreeModels.includes(m.id))
                .map(m => m.id);
        }

        if (availableFree.length === 0) {
            availableFree = availableModels
                .filter(m => m.is_free)
                .slice(0, 4)
                .map(m => m.id);
        }

        if (availableFree.length > 0) {
            setCouncilModels(availableFree);
            const preferredChairman = availableFree.find(id => id.includes('gemini')) ||
                availableFree.find(id => id.includes('llama')) ||
                availableFree[0];
            setChairmanModel(preferredChairman);
        } else {
            alert('Ücretsiz model bulunamadı. API bağlantısını kontrol edin.');
        }
    };

    const handleAddCustomModel = (e) => {
        e.preventDefault();
        if (customModel.trim() && !councilModels.includes(customModel.trim())) {
            setCouncilModels([...councilModels, customModel.trim()]);
            setCustomModel('');
        }
    };

    // Filter models based on multidimensional criteria
    const filteredModels = useMemo(() => {
        let result = availableModels;

        // 1. Price filtering
        if (priceFilter === 'Ücretsiz') {
            result = result.filter(m => m.is_free);
        } else if (priceFilter === 'Ücretli') {
            result = result.filter(m => !m.is_free);
        }

        // 2. Speed filtering
        if (speedFilter !== 'All') {
            result = result.filter(m => m.speed === speedFilter);
        }

        // 3. Brand filtering
        if (brandFilter !== 'All') {
            result = result.filter(m => getBrandInfo(m.id).brand === brandFilter);
        }

        // 4. Search filtering
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(m =>
                m.name.toLowerCase().includes(query) ||
                m.id.toLowerCase().includes(query)
            );
        }

        return result;
    }, [availableModels, searchQuery, priceFilter, speedFilter, brandFilter]);

    const BRAND_OPTIONS = ['All', 'OpenAI', 'Anthropic', 'Google', 'Meta', 'DeepSeek', 'Qwen', 'xAI', 'Mistral', 'Cohere', 'Nous', 'Diğer'];

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content settings-modal glass-effect">
                <h2 className="settings-title">✨ {t('settings.configureModels')}</h2>

                {isLoading ? (
                    <div className="settings-loading">
                        <div className="spinner"></div>
                        <p style={{ marginTop: '12px' }}>{t('settings.loading')}</p>
                    </div>
                ) : (
                    <div className="settings-body">

                        {/* 1. SEÇİLİ ÖZET (MASA GÖRÜNÜMÜ) */}
                        <div className="selected-summary-panel">
                            <div className="summary-section">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ margin: 0 }}>{t('settings.councilTable')}</h3>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={handleAutoSelectFree}
                                            className="magic-btn free-magic-btn"
                                            title={t('settings.freeKadroTitle')}
                                        >
                                            {t('settings.freeKadro')}
                                        </button>
                                        <button
                                            onClick={handleAutoSelectPremium}
                                            className="magic-btn"
                                            title={t('settings.premiumKadroTitle')}
                                        >
                                            {t('settings.premiumKadro')}
                                        </button>
                                    </div>
                                </div>

                                <CouncilTable
                                    councilModels={councilModels}
                                    chairmanModel={chairmanModel}
                                    getBrandInfo={getBrandInfo}
                                    getModelName={getModelName}
                                    onRemoveModel={removeCouncilModel}
                                    onSetChairman={setChairmanModel}
                                />
                            </div>
                        </div>

                        {/* 3. MANUEL MODEL EKLEME */}
                        <form className="custom-model-adder" onSubmit={handleAddCustomModel} style={{ marginTop: '0', marginBottom: '30px' }}>
                            <label>{t('settings.customModelLabel')}</label>                    <div className="custom-input-group">
                                <input
                                    type="text"
                                    placeholder={t('settings.customModelPlaceholder')}
                                    value={customModel}
                                    onChange={e => setCustomModel(e.target.value)}
                                />
                                <button type="submit" disabled={!customModel.trim()}>{t('settings.add')}</button>
                            </div>
                        </form>

                        {/* 2. MODEL ARAMA VE SEÇME IZGARASI */}
                        <div className="model-picker-section">
                            <div className="picker-header">
                                <h3>{t('settings.selectFromCatalog')}</h3>
                                <input
                                    type="text"
                                    className="model-search-input"
                                    placeholder={t('settings.searchSystem')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* MULTI-DIMENSIONAL FILTERS */}
                            <div className="filters-container">
                                <div className="filter-group">
                                    <label>{t('settings.price')}</label>
                                    <select
                                        className="filter-select"
                                        value={priceFilter}
                                        onChange={(e) => setPriceFilter(e.target.value)}
                                    >
                                        <option value="All">{t('settings.allPrices')}</option>
                                        <option value="Ücretsiz">{t('settings.onlyFree')}</option>
                                        <option value="Ücretli">{t('settings.onlyPaid')}</option>
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label>{t('settings.speed')}</label>
                                    <select
                                        className="filter-select"
                                        value={speedFilter}
                                        onChange={(e) => setSpeedFilter(e.target.value)}
                                    >
                                        <option value="All">{t('settings.allSpeeds')}</option>
                                        <option value="⚡ Hızlı">{t('settings.fast')}</option>
                                        <option value="⏱️ Normal">{t('settings.normal')}</option>
                                        <option value="🐢 Yavaş">{t('settings.slow')}</option>
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label>{t('settings.brand')}</label>
                                    <select
                                        className="filter-select"
                                        value={brandFilter}
                                        onChange={(e) => setBrandFilter(e.target.value)}
                                    >
                                        {BRAND_OPTIONS.map(brand => (
                                            <option key={brand} value={brand}>
                                                {brand === 'All' ? t('settings.allBrands') : brand}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="model-grid">
                                {availableModels.length === 0 ? (
                                    <div className="models-error">
                                        {t('settings.apiError')}
                                    </div>
                                ) : filteredModels.length === 0 ? (
                                    <div className="models-error">{t('settings.modelNotFound')}</div>
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
                                                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                        {model.speed && <span className="speed-badge" title="Model Tahmini işlem hızı" style={{
                                                            fontSize: '10px',
                                                            padding: '2px 6px',
                                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                            color: 'var(--text-secondary)',
                                                            borderRadius: '12px',
                                                            fontWeight: 'bold',
                                                            border: '1px solid rgba(255, 255, 255, 0.1)'
                                                        }}>{model.speed}</span>}
                                                        {model.is_free ? (
                                                            <span className="free-badge" style={{
                                                                fontSize: '10px',
                                                                padding: '2px 6px',
                                                                backgroundColor: 'rgba(74, 222, 128, 0.2)',
                                                                color: '#4ade80',
                                                                borderRadius: '12px',
                                                                fontWeight: 'bold',
                                                                border: '1px solid rgba(74, 222, 128, 0.3)'
                                                            }}>ÜCRETSİZ</span>
                                                        ) : (
                                                            <span className="paid-badge" style={{
                                                                fontSize: '10px',
                                                                padding: '2px 6px',
                                                                backgroundColor: 'rgba(251, 191, 36, 0.2)',
                                                                color: '#fbbf24',
                                                                borderRadius: '12px',
                                                                fontWeight: 'bold',
                                                                border: '1px solid rgba(251, 191, 36, 0.3)'
                                                            }}>ÜCRETLİ</span>
                                                        )}
                                                    </div>
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
                                                        {isCouncil ? '✅ Masada' : '🪑 Masaya Oturt'}
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

                    </div>
                )}

                <div className="settings-footer">
                    <div className="dev-credit" style={{ fontSize: '12px', color: 'var(--text-muted)', flex: 1 }}>
                        Developed by <a href="https://github.com/HuseyinEmreTech" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}><strong>Hüseyin Emre</strong></a>
                    </div>
                    <button className="settings-btn secondary" onClick={onClose}>{t('settings.close')}</button>
                    <button
                        className="settings-btn primary"
                        onClick={handleSave}
                        disabled={isSaving === true || councilModels.filter(m => m.trim() !== '').length === 0}
                        style={isSaving === 'success' ? { background: '#4ade80', color: '#000' } : {}}
                    >
                        {isSaving === true ? t('settings.saving') : isSaving === 'success' ? t('settings.saved') : t('settings.save')}
                    </button>
                </div>
            </div>
        </div >
    );
}
