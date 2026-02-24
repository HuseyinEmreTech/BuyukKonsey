import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../api';
import './SystemStatus.css';

export default function SystemStatus({ isOpen, onClose }) {
    const { t } = useLanguage();
    const [apiStatus, setApiStatus] = useState('offline');
    const [logs, setLogs] = useState([]);
    const [apiKey, setApiKey] = useState('');
    const [isSavingApiKey, setIsSavingApiKey] = useState(false);

    const checkStatus = async () => {
        // We set it to checking only when manually refreshing or via effect
        setApiStatus('checking');
        try {
            const response = await fetch('http://127.0.0.1:8001/');
            if (response.ok) {
                setApiStatus('online');
            } else {
                setApiStatus('offline');
            }
        } catch {
            setApiStatus('offline');
        }
    };

    const loadMockLogs = () => {
        // Simulating recent API responses for display
        setLogs([
            { id: 1, type: 'POST /api/conversations', time: new Date().toLocaleTimeString(), status: 200, data: '{ "id": "06deef...", "status": "created" }' },
            { id: 2, type: 'GET /api/models', time: new Date().toLocaleTimeString(), status: 200, data: '[ { "id": "google/gemini-2.0-flash-exp:free", ... } ]' },
            { id: 3, type: 'POST /api/message', time: new Date().toLocaleTimeString(), status: 402, data: '{ "error": "Insufficient Balance" }' }
        ]);
    };

    const handleSaveApiKey = async (e) => {
        e.preventDefault();
        if (!apiKey.trim()) return;

        setIsSavingApiKey(true);
        try {
            await api.updateApiKey(apiKey.trim());
            setIsSavingApiKey('success');
            setTimeout(() => {
                setIsSavingApiKey(false);
                setApiKey('');
                checkStatus(); // Refresh status after update
            }, 1500);
        } catch (error) {
            console.error('Error saving API Key:', error);
            alert(error.message || t('settings.error'));
            setIsSavingApiKey(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Use a clean way to trigger async calls
            const init = async () => {
                await checkStatus();
                loadMockLogs();
            };
            init();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content status-modal glass-effect">
                <button className="modal-close" onClick={onClose}>&times;</button>

                <div className="status-header">
                    <div className={`status-badge ${apiStatus}`}>
                        {apiStatus === 'online' ? '●' : '○'} {t('status.apiRunning')}
                    </div>
                    <h2>{t('status.title')}</h2>
                </div>

                <div className="status-body">
                    <div className="api-info-card">
                        <div className="info-row">
                            <span>Backend URL:</span>
                            <code>http://localhost:8001</code>
                        </div>
                        <div className="info-row">
                            <span>Frontend URL:</span>
                            <code>http://localhost:5173</code>
                        </div>
                    </div>

                    {/* API Key Configuration - Re-styled for System Status */}
                    <div className="api-info-card" style={{ marginTop: '20px', border: '1px dashed var(--border-glass)' }}>
                        <h3 style={{ marginTop: 0, fontSize: '16px', marginBottom: '10px' }}>{t('settings.apiKeyTitle')}</h3>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px', fontStyle: 'italic' }}>
                            {t('settings.apiKeyDesc')}
                        </p>
                        <form className="custom-input-group" onSubmit={handleSaveApiKey} style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="password"
                                placeholder={t('settings.apiKeyPlaceholder')}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                autoComplete="off"
                                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            />
                            <button
                                type="submit"
                                disabled={isSavingApiKey || !apiKey.trim()}
                                style={{ padding: '0 20px', borderRadius: '8px', background: 'var(--accent-primary)', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 600 }}
                            >
                                {isSavingApiKey === 'success' ? '✓' : isSavingApiKey ? '...' : t('settings.apiKeySave')}
                            </button>
                        </form>
                        {isSavingApiKey === 'success' && (
                            <p style={{ fontSize: '11px', color: '#4ade80', marginTop: '8px' }}>
                                {t('settings.apiKeySuccess')}
                            </p>
                        )}
                    </div>

                    <h3>{t('status.apiOutputs')}</h3>
                    <div className="logs-container">
                        {logs.map(log => (
                            <div key={log.id} className={`log-item ${log.status >= 400 ? 'error' : 'success'}`}>
                                <div className="log-meta">
                                    <span className="log-type">{log.type}</span>
                                    <span className="log-time">{log.time}</span>
                                    <span className="log-status">{log.status}</span>
                                </div>
                                <pre className="log-data">{log.data}</pre>
                            </div>
                        ))}
                    </div>

                    <h3 style={{ marginTop: '30px' }}>{t('status.errorCodeRef')}</h3>
                    <div className="error-codes-grid">
                        <div className="error-card">
                            <h4>{t('status.error401.title')}</h4>
                            <p>{t('status.error401.desc')}</p>
                        </div>
                        <div className="error-card">
                            <h4>{t('status.error402.title')}</h4>
                            <p>{t('status.error402.desc')}</p>
                        </div>
                        <div className="error-card">
                            <h4>{t('status.error429.title')}</h4>
                            <p>{t('status.error429.desc')}</p>
                        </div>
                    </div>
                </div>

                <div className="status-footer">
                    <button className="status-btn refresh" onClick={checkStatus}>{t('status.refresh')}</button>
                    <button className="status-btn close" onClick={onClose}>{t('status.close')}</button>
                </div>
            </div>
        </div>
    );
}
