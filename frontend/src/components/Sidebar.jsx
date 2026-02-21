import './Sidebar.css';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onShowTutorial,
  onShowSettings,
  onShowStatus,
}) {
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>{t('sidebar.title')}</h1>
        <button className="new-conversation-btn" onClick={onNewConversation}>
          {t('sidebar.newConversation')}
        </button>
      </div>

      <div className="conversation-list">
        {conversations.length === 0 ? (
          <div className="no-conversations">{t('sidebar.noConversations')}</div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${conv.id === currentConversationId ? 'active' : ''
                }`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="conversation-content">
                <div className="conversation-title">
                  {conv.title || t('sidebar.newConvTitle')}
                </div>
                <div className="conversation-meta">
                  {conv.message_count} {t('sidebar.messages')}
                </div>
              </div>
              <button
                className="delete-conversation-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conv.id);
                }}
                title={t('sidebar.delete')}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-control">
          <span className="sidebar-control-label">{t('sidebar.help')}</span>
          <button className="help-toggle-btn" onClick={onShowTutorial}>
            ❓
          </button>
        </div>
        <div className="sidebar-control">
          <span className="sidebar-control-label">{t('status.title')}</span>
          <button className="status-toggle-btn" onClick={onShowStatus}>
            📊
          </button>
        </div>
        <div className="sidebar-control">
          <span className="sidebar-control-label">{t('sidebar.settings')}</span>
          <button className="settings-toggle-btn" onClick={onShowSettings}>
            ⚙️
          </button>
        </div>
        <div className="sidebar-control">
          <span className="sidebar-control-label">{t('sidebar.theme')}</span>
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'dark' ? t('sidebar.light') : t('sidebar.dark')}
          </button>
        </div>
        <div className="sidebar-control">
          <span className="sidebar-control-label">{t('sidebar.language')}</span>
          <button
            className="lang-toggle-btn"
            onClick={() => changeLanguage(language === 'tr' ? 'en' : 'tr')}
          >
            {language === 'tr' ? t('sidebar.langNameTr') : t('sidebar.langNameEn')}
          </button>
        </div>
      </div>
    </div>
  );
}
