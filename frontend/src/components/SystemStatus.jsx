import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './SystemStatus.css';

export default function SystemStatus({ isOpen, onClose }) {
    const { t } = useLanguage();
    const [apiStatus, setApiStatus] = useState('offline');
    const [logs, setLogs] = useState([]);

    const checkStatus = async () => {
        // We set it to checking only when manually refreshing or via effect
        setApiStatus('checking');
        try {
            const response = await fetch('http://localhost:8001/');
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
                </div>

                <div className="status-footer">
                    <button className="status-btn refresh" onClick={checkStatus}>{t('status.refresh')}</button>
                    <button className="status-btn close" onClick={onClose}>{t('status.close')}</button>
                </div>
            </div>
        </div>
    );
}
