import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './TutorialModal.css';

export default function TutorialModal({ isOpen, onClose }) {
    const [currentStep, setCurrentStep] = useState(0);
    const { t } = useLanguage();

    const steps = [
        {
            title: t('tutorial.step1.title'),
            description: t('tutorial.step1.desc'),
            icon: '💬',
        },
        {
            title: t('tutorial.step2.title'),
            description: t('tutorial.step2.desc'),
            icon: '🛡️',
        },
        {
            title: t('tutorial.step3.title'),
            description: t('tutorial.step3.desc'),
            icon: '👑',
        },
    ];

    if (!isOpen) return null;

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content tutorial-modal">
                <button className="modal-close" onClick={onClose}>&times;</button>

                <div className="tutorial-header">
                    <h2>{t('tutorial.title')}</h2>
                    <div className="step-indicator">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`step-dot ${index === currentStep ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="tutorial-body">
                    <div className="tutorial-icon">{steps[currentStep].icon}</div>
                    <h3>{steps[currentStep].title}</h3>
                    <p>{steps[currentStep].description}</p>
                </div>

                <div className="tutorial-footer">
                    <button className="tutorial-btn secondary" onClick={onClose}>
                        {t('tutorial.skip')}
                    </button>

                    <div className="nav-btns">
                        {currentStep > 0 && (
                            <button className="tutorial-btn secondary" onClick={handlePrev}>
                                {t('tutorial.prev')}
                            </button>
                        )}
                        <button className="tutorial-btn primary" onClick={handleNext}>
                            {currentStep === steps.length - 1 ? t('tutorial.close') : t('tutorial.next')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
