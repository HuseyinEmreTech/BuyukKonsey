import { createContext, useContext, useState, useCallback } from 'react';
import { getTranslation } from '../i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('bk-language') || 'tr';
    });

    const changeLanguage = useCallback((lang) => {
        setLanguage(lang);
        localStorage.setItem('bk-language', lang);
    }, []);

    const t = useCallback((key) => {
        return getTranslation(language, key);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
