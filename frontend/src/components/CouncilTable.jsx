import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './CouncilTable.css';

export default function CouncilTable({ councilModels, chairmanModel, getBrandInfo, getModelName, onRemoveModel, onSetChairman }) {
    const { t } = useLanguage();
    // Calculate positions for seated models (circular layout)
    const getPositions = (count) => {
        const positions = [];
        const radiusX = 40; // Percentage
        const radiusY = 35; // Percentage
        const centerX = 50;
        const centerY = 50;

        for (let i = 0; i < count; i++) {
            // Adjust angle to start from bottom and go clockwise
            // 0 is bottom, PI/2 is left, PI is top (chairman), 3PI/2 is right
            const angle = (i / count) * 2 * Math.PI + Math.PI / 2;
            const x = centerX + radiusX * Math.cos(angle);
            const y = centerY + radiusY * Math.sin(angle);
            positions.push({ x, y });
        }
        return positions;
    };

    const seatedModels = councilModels.map((id) => ({
        id,
        name: getModelName(id),
        brand: getBrandInfo(id),
        isChairman: id === chairmanModel
    }));

    // Sort to put chairman at the "head" (top) if they exist
    // Actually, we can just map the positions
    const positions = getPositions(seatedModels.length);

    return (
        <div className="council-table-container">
            <div className="the-table">
                <div className="table-surface">
                    <div className="table-glare"></div>
                    <div className="inner-ring"></div>
                    <div className="bk-logo-watermark">{t('table.logoText')}</div>
                </div>

                {seatedModels.map((model, index) => {
                    const pos = positions[index];
                    return (
                        <div
                            key={model.id}
                            className={`seated-member ${model.isChairman ? 'is-chairman' : ''}`}
                            style={{
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                                transitionDelay: `${index * 0.05}s`
                            }}
                        >
                            <div className="seat-crown">👑</div>
                            <div className="member-avatar" style={{ backgroundColor: model.brand.bg, color: model.brand.color }}>
                                {model.brand.icon}
                            </div>
                            <div className="member-info">
                                <span className="member-name">{model.name}</span>
                                <div className="member-actions">
                                    {!model.isChairman && (
                                        <button
                                            className="action-btn make-head"
                                            onClick={() => onSetChairman(model.id)}
                                            title={t('table.makeChairman')}
                                        >
                                            👑
                                        </button>
                                    )}
                                    <button
                                        className="action-btn unseat"
                                        onClick={() => onRemoveModel(model.id)}
                                        title={t('table.unseat')}
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {councilModels.length === 0 && (
                    <div className="empty-table-msg">
                        <p>{t('table.empty')}</p>
                        <span>{t('table.emptyDesc')}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
