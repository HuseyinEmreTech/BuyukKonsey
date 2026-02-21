import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../api';
import './SettingsModal.css';

export default function SettingsModal({ isOpen, onClose }) {
    const { t } = useLanguage();
    const [councilModels, setCouncilModels] = useState([]);
    const [chairmanModel, setChairmanModel] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const settings = await api.getSettings();
            setCouncilModels(settings.council_models || []);
            setChairmanModel(settings.chairman_model || '');
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        const filteredCouncil = councilModels.filter(m => m.trim() !== '');
        if (filteredCouncil.length === 0) return;

        setIsSaving(true);
        try {
            await api.updateSettings({
                council_models: filteredCouncil,
                chairman_model: chairmanModel.trim() || filteredCouncil[0]
            });
            onClose();
        } catch (error) {
            console.error('Error saving settings:', error);
            alert(t('settings.error'));
        } finally {
            setIsSaving(false);
        }
    };

    const updateCouncilModel = (index, value) => {
        const newModels = [...councilModels];
        newModels[index] = value;
        setCouncilModels(newModels);
    };

    const addCouncilModel = () => {
        setCouncilModels([...councilModels, '']);
    };

    const removeCouncilModel = (index) => {
        setCouncilModels(councilModels.filter((_, i) => i !== index));
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content settings-modal glass-effect">
                <button className="modal-close" onClick={onClose}>&times;</button>

                <h2 className="settings-title">{t('settings.title')}</h2>

                {isLoading ? (
                    <div className="settings-loading">{t('settings.loading')}</div>
                ) : (
                    <div className="settings-body">
                        <div className="info-box free-tier-info">
                            <span className="info-icon">💡</span>
                            <p>{t('settings.freeTierInfo')}</p>
                        </div>

                        <div className="settings-section">
                            <h3>{t('settings.councilTitle')}</h3>
                            <p className="section-desc">{t('settings.councilDesc')}</p>

                            <div className="model-input-list">
                                {councilModels.map((model, index) => (
                                    <div key={index} className="model-input-row">
                                        <input
                                            type="text"
                                            className="model-input"
                                            value={model}
                                            placeholder="google/gemini-2.0-flash-exp:free"
                                            onChange={(e) => updateCouncilModel(index, e.target.value)}
                                        />
                                        <button
                                            className="remove-model-btn"
                                            onClick={() => removeCouncilModel(index)}
                                            title="Kaldır"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                                <button className="add-model-btn" onClick={addCouncilModel}>
                                    + {t('sidebar.newConversation')}
                                </button>
                            </div>
                        </div>

                        <div className="settings-section">
                            <h3>{t('settings.chairmanTitle')}</h3>
                            <p className="section-desc">{t('settings.chairmanDesc')}</p>
                            <input
                                type="text"
                                className="chairman-input"
                                value={chairmanModel}
                                placeholder="google/gemini-2.0-pro-exp-02-05:free"
                                onChange={(e) => setChairmanModel(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <div className="settings-footer">
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
